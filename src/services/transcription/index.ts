import { useState } from 'react';
import { useGroqClient } from '../../hooks/useGroqClient';

export const useTranscriptionService = () => {
  const [error, setError] = useState<string | null>(null);
  const groqClient = useGroqClient();

  const getTranscription = async (recordingId: string): Promise<string> => {
    try {
      // Get the audio URL from the recording service (to be implemented)
      const audioUrl = `https://storage.googleapis.com/voicenotepro-recordings/${recordingId}`;
      return await groqClient.transcribeAudio(audioUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get transcription');
      throw err;
    }
  };

  return {
    getTranscription,
    error
  };
};