import { insertDB, getDB, saveDB } from './db.js';

export const newNote = async (note, tags) => {
  const newNote = {
    tags,
    content: note,
    id: Date.now(),
  }
  await insertDB(newNote);
  return newNote
}

export const getAllNotes = async () => {
  const { notes } = await getDB()
  return notes;
}

export const findNotes = async filter => {
  const { notes } = await getDB();
  return notes.filter(note => note.content.toLowerCase().includes(filter.toLowerCase()));
}

export const removeNote = async id => {
  const { notes } = await getDB();
  const match = notes.find(note => note.id === id);

  if (match) {
    const newNotes = notes.filter(note => note.id !== id); // ==> We are not removing the note that matched, we are creating a new array without the note
    await saveDB({ notes: newNotes });
    return id;
  }
}

export const removeAllNotes = () => saveDB({ notes: [] });
