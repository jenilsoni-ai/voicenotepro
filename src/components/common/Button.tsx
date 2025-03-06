import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: object;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineButtonText;
      default:
        return styles.buttonText;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), disabled && styles.disabledButton, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[getTextStyle(), disabled && styles.disabledText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#0D2F81',
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0D2F81',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: '#0D2F81',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.8,
  },
});