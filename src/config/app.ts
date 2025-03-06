export const appConfig = {
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY
  },
  app: {
    name: 'VoiceNotes Pro',
    version: '1.0.0',
    splashScreenDuration: 2000, // milliseconds
    maxRecordingDuration: 3600, // seconds (1 hour)
    freeTierLimits: {
      recordingsPerMonth: 5
    },
    premiumPrice: 4.99
  }
}