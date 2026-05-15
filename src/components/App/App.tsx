import { useState } from 'react';
// Імпортуємо інструменти для роботи з сервером та глобальним кешем від React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Імпортуємо хук для відкладеного пошуку (Debounce)
import { useDebouncedCallback } from 'use-debounce';
// Імпортуємо наші функції для HTTP-запитів з сервісного шару
import { fetchNotes, deleteNote, createNote } from '../../services/noteService';
// Імпортуємо інші компоненти інтерфейсу
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import css from './App.module.css';

export default function App() {
  // Ініціалізуємо QueryClient для керування та інвалідації глобального кешу
  const queryClient = useQueryClient();

  // Локальні стейти для керування параметрами пошуку, пагінації та модальним вікном
  const [search, setSearch] = useState<string>(''); // Рядок пошуку
  const [page, setPage] = useState<number>(1); // Поточна сторінка пагінації
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Стан відкриття модалки

  // 1. АВТОМАТИЧНИЙ ЗАПИТ ДАНИХ (Заміна useEffect)
  // Хук useQuery самостійно стежить за змінами у масиві queryKey [search, page].
  // Як тільки змінюється сторінка або текст пошуку, він автоматично перезапускає fetchNotes.
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', search, page],
    queryFn: () => fetchNotes(search, page),
  });

  // 2. МУТАЦІЯ ДЛЯ ВИДАЛЕННЯ НОТАТКИ
  // Використовуємо useMutation, оскільки це деструктивна операція (DELETE)
  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    // Колбек успішного виконання: коли сервер підтвердив видалення, ми оновлюємо кеш
    onSuccess: () => {
      // Інвалідуємо кеш із ключем 'notes', що змушує useQuery вище автоматично перекачати свіжий список
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  // 3. МУТАЦІЯ ДЛЯ СТВОРЕННЯ НОТАТКИ
  // Використовуємо useMutation для POST-запиту на створення
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      setIsModalOpen(false); // Закриваємо модальне вікно після успішного створення
      setPage(1); // Скидаємо сторінку на першу, щоб користувач побачив нову нотатку зверху
      // Оновлюємо дані в кеші, щоб інтерфейс миттєво відобразив нову нотатку
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  // ВІДКЛАДЕНИЙ ПОШУК (Debounce) STRICTLY BY ТЗ
  // Затримка у 500 мс запобігає спаму бэкенду HTTP-запитами на кожен введений символ
  const debouncedSearch = useDebouncedCallback((text: string) => {
    setSearch(text);
    setPage(1); // При кожному новому пошуковому запиті повертаємо користувача на 1 сторінку
  }, 500);

  // Безпечно витягуємо дані з об'єкта відповіді useQuery, задаючи дефолтні значення
  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* Передаємо дебаунс-функцію в інпут пошуку */}
        <SearchBox onChange={debouncedSearch} value={search} />

        {/* Рендеримо пагінацію лише у випадку, якщо сторінок більше 1 (вимога ТЗ) */}
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={(p) => setPage(p)}
          />
        )}

        {/* Кнопка відкриття модального вікна для створення нової нотатки */}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {/* ВІДОБРАЖЕННЯ СТАТУСІВ ЗАВАНТАЖЕННЯ ТА ПОМИЛОК (вимога ТЗ) */}
      {isLoading && <div className={css.loading}>Loading notes...</div>}
      {isError && <div className={css.error}>Something went wrong!</div>}

      {/* Список нотаток відображається тільки тоді, коли дані успішно завантажені без помилок */}
      {!isLoading && !isError && (
        <NoteList
          notes={notes}
          onDelete={(id) => deleteNoteMutation.mutate(id)}
        />
      )}

      {/* Універсальне модальне вікно, що приймає форму створення через children */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onSubmit={(values) => createNoteMutation.mutate(values)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
