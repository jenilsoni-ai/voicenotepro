import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Button, TextInput } from 'react-native-paper';
import { notesService } from '../../services/notes/notesService';
import { Note } from '../../types/note';

type RouteParams = {
  noteId: string;
};

export const NoteDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { noteId } = route.params as RouteParams;

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = notesService.subscribeToUserNotes('currentUserId', (notes) => {
      const currentNote = notes.find((n) => n.id === noteId);
      if (currentNote) {
        setNote(currentNote);
        setTitle(currentNote.title);
        setContent(currentNote.content);
      }
    });

    return () => unsubscribe();
  }, [noteId]);

  const handleSave = async () => {
    try {
      await notesService.updateNote(noteId, {
        title,
        content,
        updatedAt: new Date(),
      });
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
    }
  };

  const handleDelete = async () => {
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
              await notesService.deleteNote(noteId);
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
    return null;
  }

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        label="Title"
        value={title}
        onChangeText={setTitle}
        disabled={!isEditing}
        style={styles.titleInput}
      />
      <TextInput
        mode="outlined"
        label="Content"
        value={content}
        onChangeText={setContent}
        disabled={!isEditing}
        multiline
        style={styles.contentInput}
      />
      <View style={styles.buttonContainer}>
        {isEditing ? (
          <Button mode="contained" onPress={handleSave} style={styles.button}>
            Save
          </Button>
        ) : (
          <Button mode="contained" onPress={() => setIsEditing(true)} style={styles.button}>
            Edit
          </Button>
        )}
        <Button mode="outlined" onPress={handleDelete} style={styles.button} textColor="red">
          Delete
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  titleInput: {
    marginBottom: 16,
  },
  contentInput: {
    flex: 1,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    minWidth: 120,
  },
});