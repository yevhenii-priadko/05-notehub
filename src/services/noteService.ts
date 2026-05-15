import axios from 'axios';
import type { Note } from '../types/note';

interface ResponseNotes {
  notes: Note[];
  totalPages: number;
}

interface NoteInput {
  title: string;
  content: string | null;
  tag: string;
}

const BASE_URL = 'https://notehub-public.goit.study/api/notes';

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;

const headers = {
  accept: 'application/json',
  Authorization: `Bearer ${myKey}`,
};

export async function fetchNotes(
  search: string,
  page: number
): Promise<ResponseNotes> {
  const response = await axios.get<ResponseNotes>(BASE_URL, {
    params: { search, page, perPage: 10 },
    headers,
  });

  return response.data;
}

export async function createNote(noteData: NoteInput): Promise<Note> {
  const response = await axios.post<Note>(BASE_URL, noteData, { headers });
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await axios.delete<Note>(`${BASE_URL}/${id}`, { headers });
  return response.data;
}
