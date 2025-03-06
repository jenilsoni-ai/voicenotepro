import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Recording: undefined;
  Settings: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  NoteDetail: { noteId: string };
  NoteCreation: { transcribedText: string; recordingId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}