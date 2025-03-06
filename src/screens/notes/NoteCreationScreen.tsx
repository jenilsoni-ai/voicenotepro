import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TextInput, SegmentedButtons } from 'react-native-paper';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { notesService } from '../../services/notes/notesService';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';

interface NoteCreationScreenProps {
  route: {
    params: {
      transcribedText: string;
      recordingId: string;
    };
  };
}

type NoteType = 'note' | 'email' | 'flashcard' | 'journal';

export const NoteCreationScreen: React.FC<NoteCreationScreenProps> = ({ route }) => {
  const { transcribedText, recordingId } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(transcribedText);
  const [noteType, setNoteType] = useState<NoteType>('note');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your note');
      return;
    }

    try {
      setIsLoading(true);
      const newNote = {
        title: title.trim(),
        content,
        type: noteType,
        userId: user.uid,
        transcriptionId: recordingId,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
        isShared: false,
        sharedWith: []
      };

      await notesService.createNote(newNote);
      navigation.replace('Home');
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Create Note"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <TextInput
          style={styles.titleInput}
          placeholder="Enter note title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={colors.text.secondary}
        />
        <SegmentedButtons
          value={noteType}
          onValueChange={setNoteType as (value: string) => void}
          buttons={[
            { value: 'note', label: 'Note' },
            { value: 'email', label: 'Email' },
            { value: 'flashcard', label: 'Flashcard' },
            { value: 'journal', label: 'Journal' }
          ]}
          style={styles.segmentedButtons}
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Note content"
          value={content}
          onChangeText={setContent}
          multiline
          placeholderTextColor={colors.text.secondary}
        />
      </View>
      <View style={styles.footer}>
        <Button
          title="Save Note"
          onPress={handleSave}
          disabled={isLoading}
          loading={isLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary
  },
  content: {
    flex: 1,
    padding: 16
  },
  titleInput: {
    marginBottom: 16,
    backgroundColor: colors.background.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.text.primary
  },
  segmentedButtons: {
    marginBottom: 16
  },
  contentInput: {
    flex: 1,
    backgroundColor: colors.background.surface,
    borderRadius: 8,
    padding: 12,
    color: colors.text.primary,
    textAlignVertical: 'top'
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary
  }
});