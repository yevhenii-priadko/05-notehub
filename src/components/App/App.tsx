import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import css from './App.module.css';

export default function App() {
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
    placeholderData: keepPreviousData,
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

      {/* ВІДОБРАЖЕННЯ СТАТУСІВ ЗАВАНТАЖЕННЯ ТА ПОМИЛОК  */}
      {isLoading && <div className={css.loading}>Loading notes...</div>}
      {isError && <div className={css.error}>Something went wrong!</div>}

      {/* Список нотаток відображається тільки тоді, коли дані успішно завантажені без помилок */}
      {!isLoading && !isError && <NoteList notes={notes} />}

      {/* Універсальне модальне вікно, що приймає форму створення через children */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
