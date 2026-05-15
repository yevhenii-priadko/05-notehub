import css from './Pagination.module.css';
import type { ComponentType } from 'react';
import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

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
  return (
    <div className={css.paginationContainer}>
      <ReactPaginate
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
