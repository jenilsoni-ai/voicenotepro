import { collection, query, where, orderBy, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Transcription, NewTranscription } from '../../types/transcription';
import { groqConfig } from '../../config/groq';
import axios from 'axios';

const TRANSCRIPTIONS_COLLECTION = 'transcriptions';

export class TranscriptionService {
  private transcriptionsRef = collection(db, TRANSCRIPTIONS_COLLECTION);

  /**
   * Get real-time updates for a user's transcriptions
   */
  subscribeToUserTranscriptions(userId: string, callback: (transcriptions: Transcription[]) => void) {
    const q = query(
      this.transcriptionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const transcriptions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transcription[];
      callback(transcriptions);
    });
  }

  /**
   * Create a new transcription
   */
  async createTranscription(transcription: NewTranscription) {
    try {
      const docRef = await addDoc(this.transcriptionsRef, {
        ...transcription,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating transcription:', error);
      throw error;
    }
  }

  /**
   * Update an existing transcription
   */
  async updateTranscription(transcriptionId: string, updates: Partial<Transcription>) {
    try {
      const transcriptionRef = doc(this.transcriptionsRef, transcriptionId);
      await updateDoc(transcriptionRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating transcription:', error);
      throw error;
    }
  }

  /**
   * Get transcription by recording ID
   */
  getTranscriptionByRecordingId(userId: string, recordingId: string, callback: (transcription: Transcription | null) => void) {
    const q = query(
      this.transcriptionsRef,
      where('userId', '==', userId),
      where('recordingId', '==', recordingId)
    );

    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        callback(null);
        return;
      }

      const transcription = {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data(),
      } as Transcription;
      callback(transcription);
    });
  }

  /**
   * Process audio using Groq API
   */
  async processAudioWithGroq(audioUrl: string): Promise<string> {
    try {
      const formData = new FormData();
      const audioResponse = await fetch(audioUrl);
      const blob = await audioResponse.blob();
      formData.append('file', blob, 'audio.mp4');
      formData.append('model', groqConfig.model);
      formData.append('language', groqConfig.language);
      formData.append('temperature', groqConfig.temperature.toString());
      formData.append('response_format', groqConfig.responseFormat);

      const response = await axios.post(groqConfig.apiEndpoint, formData, {
        headers: {
          'Authorization': `Bearer ${groqConfig.apiKey}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.text) {
        return response.data.text;
      } else {
        throw new Error('Invalid response from Groq API');
      }
    } catch (error) {
      console.error('Error processing audio with Groq:', error);
      throw error;
    }
  }
}

export const transcriptionService = new TranscriptionService();