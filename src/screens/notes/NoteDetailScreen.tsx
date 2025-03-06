import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Text, IconButton, useTheme, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { notesService } from '../../services/notes/notesService';
import { Note } from '../../types/note';
import { useAuth } from '../../hooks/useAuth';
import { ShareNoteDialog } from '../../components/notes/ShareNoteDialog';

type RouteParams = {
  noteId: string;
};

export const NoteDetailScreen = () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { noteId } = route.params as RouteParams;

  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isShareDialogVisible, setIsShareDialogVisible] = useState(false);

  useEffect(() => {
    if (user) {
      const unsubscribe = notesService.subscribeToNote(noteId, (updatedNote) => {
        if (updatedNote) {
          setNote(updatedNote);
          setContent(updatedNote.content);
        }
      });
      return () => unsubscribe();
    }
  }, [noteId, user]);

  const handleSave = async () => {
    if (!note || !user) return;

    try {
      await notesService.updateNote(note.id, {
        content,
      });
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
    }
  };

  const handleDelete = async () => {
    if (!note || !user) return;

    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await notesService.deleteNote(note.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ]
    );
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text variant="headlineSmall" style={styles.title}>
          {note.title}
        </Text>
        <View style={styles.headerActions}>
          <IconButton
            icon="delete"
            size={24}
            onPress={handleDelete}
          />
          <IconButton
            icon="share"
            size={24}
            onPress={() => setIsShareDialogVisible(true)}
          />
        </View>
      </View>

      <View style={styles.metadata}>
        <Text variant="bodySmall" style={styles.date}>
          Created: {new Date(note.createdAt).toLocaleDateString()}
        </Text>
        <Text variant="bodySmall" style={styles.date}>
          Updated: {new Date(note.updatedAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.editorContainer}>
        {isEditing ? (
          <>
            <RichToolbar
              editor={content}
              selectedIconTint={theme.colors.primary}
              iconTint={theme.colors.onSurface}
              style={styles.toolbar}
            />
            <RichEditor
              initialContentHTML={content}
              onChange={setContent}
              placeholder="Start typing..."
              style={styles.editor}
            />
          </>
        ) : (
          <View style={styles.contentContainer}>
            <Text>{content}</Text>
          </View>
        )}
      </View>

      <ShareNoteDialog
        visible={isShareDialogVisible}
        onDismiss={() => setIsShareDialogVisible(false)}
        noteId={noteId}
      />

      <FAB
        icon={isEditing ? 'check' : 'pencil'}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          if (isEditing) {
            handleSave();
          } else {
            setIsEditing(true);
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    flex: 1,
    marginLeft: 16,
  },
  headerActions: {
    flexDirection: 'row',
  },
  metadata: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  date: {
    color: '#666',
    marginBottom: 4,
  },
  editorContainer: {
    flex: 1,
  },
  toolbar: {
    backgroundColor: '#f5f5f5',
  },
  editor: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});