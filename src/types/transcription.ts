export interface Transcription {
  id: string;
  recordingId: string;
  userId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'final';
}

export type NewTranscription = Omit<Transcription, 'id' | 'createdAt' | 'updatedAt'>;