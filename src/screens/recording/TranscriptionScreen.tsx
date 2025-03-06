import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { useTranscriptionService } from '../../services/transcription';
import { colors } from '../../constants/theme';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native-paper';

interface TranscriptionScreenProps {
  route: {
    params: {
      recordingId: string;
    };
  };
}

export const TranscriptionScreen: React.FC<TranscriptionScreenProps> = ({ route }) => {
  const { recordingId } = route.params;
  const navigation = useNavigation();
  const [transcribedText, setTranscribedText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { getTranscription } = useTranscriptionService();

  useEffect(() => {
    const loadTranscription = async () => {
      try {
        const text = await getTranscription(recordingId);
        setTranscribedText(text);
        Toast.show({
          type: 'success',
          text1: 'Transcription Complete',
          text2: 'Your audio has been successfully transcribed'
        });
      } catch (error) {
        console.error('Error loading transcription:', error);
        Toast.show({
          type: 'error',
          text1: 'Transcription Failed',
          text2: 'Unable to transcribe audio. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTranscription();
  }, [recordingId]);

  const handleSave = async () => {
    if (!transcribedText.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Cannot Save',
        text2: 'Please wait for transcription to complete'
      });
      return;
    }
    navigation.navigate('NoteCreation', {
      transcribedText,
      recordingId
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Transcription"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Transcribing your audio...</Text>
          </View>
        ) : (
          <TextInput
            style={styles.textArea}
            multiline
            value={transcribedText}
            onChangeText={setTranscribedText}
            placeholder="Transcribed text will appear here..."
            placeholderTextColor={colors.text.secondary}
            editable={!isLoading}
          />
        )}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="Save & Continue"
          onPress={handleSave}
          disabled={isLoading || !transcribedText.trim()}
          loading={isLoading}
        />
      </View>
      <Toast />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    padding: 20
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center'
  },
  textArea: {
    flex: 1,
    minHeight: 200,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background.surface,
    color: colors.text.primary,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top'
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary
  }
});