import css from './SearchBox.module.css';

interface SearchBoxProps {
  onChange: (text: string) => void;
  value: string;
}

export default function SearchBox({ onChange, value }: SearchBoxProps) {
  return (
    <>
      <input
        className={css.input}
        type="text"
        placeholder="Search notes"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
      />
    </>
  );
}
