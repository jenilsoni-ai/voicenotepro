import { Note } from '../../types/note';

export class SearchService {
  /**
   * Search notes by query string
   * @param notes Array of notes to search through
   * @param query Search query string
   * @returns Filtered array of notes
   */
  searchNotes(notes: Note[], query: string): Note[] {
    if (!query.trim()) {
      return notes;
    }

    const searchTerm = query.toLowerCase().trim();

    try {
      return notes.filter((note) => {
        const titleMatch = note.title?.toLowerCase().includes(searchTerm) || false;
        const contentMatch = note.content?.toLowerCase().includes(searchTerm) || false;
        return titleMatch || contentMatch;
      });
    } catch (error) {
      console.error('Error searching notes:', error);
      return notes;
    }
  }

  /**
   * Highlight search terms in text
   * @param text Text to highlight
   * @param searchTerm Term to highlight
   * @returns Array of text segments with highlighting information
   */
  highlightSearchTerms(text: string, searchTerm: string): { text: string; isHighlighted: boolean }[] {
    if (!searchTerm.trim() || !text) {
      return [{ text, isHighlighted: false }];
    }

    try {
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const segments = text.split(regex);

      return segments.map((segment) => ({
        text: segment,
        isHighlighted: segment.toLowerCase() === searchTerm.toLowerCase()
      }));
    } catch (error) {
      console.error('Error highlighting search terms:', error);
      return [{ text, isHighlighted: false }];
    }
  }
}

export const searchService = new SearchService();