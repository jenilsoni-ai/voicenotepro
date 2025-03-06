import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Text, Avatar, FAB, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { notesService } from '../../services/notes/notesService';
import { searchService } from '../../services/search/searchService';
import { Note } from '../../types/note';
import { useAuth } from '../../hooks/useAuth';

export const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = notesService.subscribeToUserNotes(user.uid, (updatedNotes) => {
      setNotes(updatedNotes);
    });

    return () => unsubscribe();
  }, [user]);

  const debouncedSearch = useCallback(
    (query: string) => {
      const filtered = searchService.searchNotes(notes, query);
      setFilteredNotes(filtered);
    },
    [notes]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, debouncedSearch]);

  const renderNoteCard = ({ item }: { item: Note }) => {
    const titleSegments = searchQuery
      ? searchService.highlightSearchTerms(item.title, searchQuery)
      : [{ text: item.title, isHighlighted: false }];

    const contentSegments = searchQuery
      ? searchService.highlightSearchTerms(item.content, searchQuery)
      : [{ text: item.content, isHighlighted: false }];

    return (
      <TouchableOpacity
        style={[styles.noteCard, { backgroundColor: theme.colors.surface }]}
        onPress={() => navigation.navigate('NoteDetail', { noteId: item.id })}
      >
        <Text variant="titleMedium" style={styles.noteTitle}>
          {titleSegments.map((segment, index) => (
            <Text
              key={index}
              style={segment.isHighlighted ? styles.highlightedText : undefined}
            >
              {segment.text}
            </Text>
          ))}
        </Text>
        <Text variant="bodyMedium" numberOfLines={2} style={styles.noteContent}>
          {contentSegments.map((segment, index) => (
            <Text
              key={index}
              style={segment.isHighlighted ? styles.highlightedText : undefined}
            >
              {segment.text}
            </Text>
          ))}
        </Text>
        <Text variant="bodySmall" style={styles.noteDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleStartRecording = () => {
    navigation.navigate('Recording');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Icon name="microphone" size={24} color={theme.colors.primary} />
          <Text variant="headlineSmall" style={styles.appTitle}>VoiceNotes Pro</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Avatar.Icon size={40} icon="account" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color={theme.colors.primary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />
      </View>

      <FlatList
        data={filteredNotes}
        renderItem={renderNoteCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notesList}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="microphone"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleStartRecording}
        color="white"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    marginLeft: 8,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    fontSize: 16,
  },
  notesList: {
    padding: 16,
  },
  noteCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  noteTitle: {
    marginBottom: 8,
  },
  noteContent: {
    marginBottom: 8,
  },
  noteDate: {
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  highlightedText: {
    backgroundColor: '#FFE082',
  },
});