import { collection, query, where, orderBy, addDoc, updateDoc, deleteDoc, doc, onSnapshot, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Note } from '../../types/note';

const NOTES_COLLECTION = 'notes';

export class NotesService {
  private notesRef = collection(db, NOTES_COLLECTION);

  /**
   * Get real-time updates for a user's notes
   */
  subscribeToUserNotes(userId: string, callback: (notes: Note[]) => void) {
    const q = query(
      this.notesRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Note[];
      callback(notes);
    });
  }

  /**
   * Get real-time updates for a specific note
   */
  subscribeToNote(noteId: string, callback: (note: Note | null) => void) {
    const noteRef = doc(this.notesRef, noteId);

    return onSnapshot(noteRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      const note = {
        id: snapshot.id,
        ...snapshot.data()
      } as Note;
      callback(note);
    });
  }

  /**
   * Create a new note
   */
  async createNote(note: Omit<Note, 'id'>) {
    try {
      const docRef = await addDoc(this.notesRef, {
        ...note,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  /**
   * Update an existing note
   */
  async updateNote(noteId: string, updates: Partial<Note>) {
    try {
      const noteRef = doc(this.notesRef, noteId);
      await updateDoc(noteRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  /**
   * Delete a note
   */
  async deleteNote(noteId: string) {
    try {
      const noteRef = doc(this.notesRef, noteId);
      await deleteDoc(noteRef);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  /**
   * Share a note with another user
   */
  async shareNote(noteId: string, recipientEmail: string, canEdit: boolean) {
    try {
      const noteRef = doc(this.notesRef, noteId);
      await updateDoc(noteRef, {
        isShared: true,
        sharedWith: arrayUnion({
          email: recipientEmail,
          canEdit: canEdit,
          sharedAt: new Date()
        }),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error sharing note:', error);
      throw error;
    }
  }
}

export const notesService = new NotesService();