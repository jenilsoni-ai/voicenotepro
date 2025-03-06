export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'note' | 'email' | 'flashcard' | 'journal';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  transcriptionId?: string;
  isShared: boolean;
  sharedWith: string[];
}