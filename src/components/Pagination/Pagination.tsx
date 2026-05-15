import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selected: number) => void;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const PaginateComponent =
    (ReactPaginate as unknown as { default: typeof ReactPaginate }).default ||
    ReactPaginate;
  return (
    <div className={css.paginationContainer}>
      <PaginateComponent
        previousLabel={'<-'}
        nextLabel={'->'}
        breakLabel={'...'}
        pageCount={pageCount} // Загальна кілкість аркушів
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        // Бібліотека рахує сторінки з 0, тому при кліку передаємо номер сторінки назад в App із зсувом на +1

        onPageChange={(data: { selected: number }) =>
          onPageChange(data.selected + 1)
        }
        forcePage={currentPage - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
      />
    </div>
  );
}
