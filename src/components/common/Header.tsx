import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface HeaderProps {
  title: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress
}) => {
  return (
    <View style={styles.container}>
      {leftIcon && (
        <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
          <Icon name={leftIcon} size={24} color="#0D2F81" />
        </TouchableOpacity>
      )}
      <Text variant="headlineSmall" style={styles.title}>{title}</Text>
      {rightIcon && (
        <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
          <Icon name={rightIcon} size={24} color="#0D2F81" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#0D2F81',
    fontWeight: '600'
  },
  iconButton: {
    padding: 8
  }
});