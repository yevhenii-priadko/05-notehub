import { useState } from 'react';
import css from './SearchBox.module.css';

interface SearchBoxProps {
  onChange: (text: string) => void;
  value: string;
}

export default function SearchBox({ onChange, value }: SearchBoxProps) {
  const [state, setState] = useState({
    localValue: value || '',
    prevPropsValue: value,
  });

  if (value !== state.prevPropsValue) {
    setState({
      localValue: value || '',
      prevPropsValue: value,
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setState((prev) => ({
      ...prev,
      localValue: text,
    }));
    onChange(text);
  };
  return (
    <>
      <input
        className={css.input}
        type="text"
        placeholder="Search notes"
        value={state.localValue}
        onChange={handleInputChange}
      />
    </>
  );
}
