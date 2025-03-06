import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput } from 'react-native-paper';
import { signUp } from '../../services/auth/firebase';
import { theme } from '../../config/theme';

interface SignupScreenProps {
  navigation: any;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!firstName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signUp(email, password);
      // Navigate to home screen after successful signup
      navigation.replace('Home');
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
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          mode="outlined"
          placeholder="John"
          placeholderTextColor="#E2E8F0"
        />

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

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry={!showPassword}
          right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>Already have an account? Log In</Text>
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
});