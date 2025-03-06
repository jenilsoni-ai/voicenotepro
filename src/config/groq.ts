export const groqConfig = {
  apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY,
  apiEndpoint: 'https://api.groq.com/openai/v1/audio/transcriptions',
  model: 'whisper-large-v3',
  language: 'en',
  temperature: 0.3,
  responseFormat: 'json'
};