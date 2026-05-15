import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onChange: (text: string) => void;
}

export default function SearchBox({ onChange }: SearchBoxProps) {
  return (
    <>
      <input
        className={css.input}
        type="text"
        placeholder="Search notes"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
      />
    </>
  );
}
