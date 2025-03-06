import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, Dialog, TextInput, Button, Text, Checkbox, useTheme } from 'react-native-paper';
import { notesService } from '../../services/notes/notesService';

interface ShareNoteDialogProps {
  visible: boolean;
  onDismiss: () => void;
  noteId: string;
}

export const ShareNoteDialog: React.FC<ShareNoteDialogProps> = ({
  visible,
  onDismiss,
  noteId,
}) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShare = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await notesService.shareNote(noteId, email, canEdit);
      onDismiss();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to share note');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Share Note</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            error={!!error}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.permissionContainer}>
            <Checkbox
              status={canEdit ? 'checked' : 'unchecked'}
              onPress={() => setCanEdit(!canEdit)}
              color={theme.colors.primary}
            />
            <Text>Allow editing</Text>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button
            mode="contained"
            onPress={handleShare}
            loading={isLoading}
            disabled={isLoading}
          >
            Share
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 8,
  },
  error: {
    color: '#B00020',
    fontSize: 12,
    marginBottom: 8,
  },
  permissionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
});