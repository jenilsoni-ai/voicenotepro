import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput } from 'react-native-paper';
import { resetPassword } from '../../services/auth/firebase';
import { theme } from '../../config/theme';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await resetPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError(err.message as string);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.gradient.start, theme.colors.gradient.end]}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Reset Password</Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? (
          <Text style={styles.success}>
            Password reset link has been sent to your email address
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: theme.typography.fontSize.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    fontFamily: theme.typography.fontFamily.primary,
  },
  input: {
    width: '100%',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  button: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    padding: theme.spacing.md,
    borderRadius: theme.spacing.xs,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.primary,
  },
  linkButton: {
    marginTop: theme.spacing.md,
  },
  linkText: {
    color: theme.colors.secondary,
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.primary,
  },
  error: {
    color: '#FF0000',
    marginBottom: theme.spacing.sm,
    fontSize: theme.typography.fontSize.caption,
  },
  success: {
    color: '#4CAF50',
    marginBottom: theme.spacing.sm,
    fontSize: theme.typography.fontSize.caption,
    textAlign: 'center',
  },
});