import { useCallback } from 'react';
import { groqConfig } from '../config/groq';

export const useGroqClient = () => {
  const transcribeAudio = useCallback(async (audioUrl: string): Promise<string> => {
    try {
      const formData = new FormData();
      const audioResponse = await fetch(audioUrl);
      const blob = await audioResponse.blob();
      formData.append('file', blob, 'audio.mp4');
      formData.append('model', groqConfig.model);
      formData.append('language', groqConfig.language);
      formData.append('temperature', groqConfig.temperature.toString());
      formData.append('response_format', groqConfig.responseFormat);

      const response = await fetch(groqConfig.apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqConfig.apiKey}`,
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.text) {
        return data.text;
      } else {
        throw new Error('Invalid response from Groq API');
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }, []);

  return {
    transcribeAudio
  };
};