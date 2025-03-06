import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, Switch, Text, useTheme, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { settingsService, UserSettings } from '../../services/settings/settingsService';
import { auth } from '../../services/auth/firebase';

export const SettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [settings, setSettings] = React.useState<UserSettings>({
    theme: 'light',
    notifications: true,
    language: 'en'
  });

  useEffect(() => {
    if (user) {
      const unsubscribe = settingsService.subscribeToUserSettings(user.uid, (userSettings) => {
        setSettings(userSettings);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const handleThemeChange = async () => {
    try {
      const newTheme = settings.theme === 'light' ? 'dark' : 'light';
      await settingsService.updateUserSettings(user!.uid, {
        theme: newTheme
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update theme');
    }
  };

  const handleNotificationToggle = async () => {
    try {
      await settingsService.updateUserSettings(user!.uid, {
        notifications: !settings.notifications
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon name="cog" size={24} color={theme.colors.primary} />
        <Text variant="headlineSmall" style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Email"
            description={user?.email}
            left={props => <List.Icon {...props} icon="email" />}
          />
          <List.Item
            title="Change Password"
            left={props => <List.Icon {...props} icon="lock" />}
            onPress={() => {}}
          />
          <List.Item
            title="Log Out"
            left={props => <List.Icon {...props} icon="logout" />}
            onPress={handleLogout}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={settings.theme === 'dark'}
                onValueChange={handleThemeChange}
                color={theme.colors.primary}
              />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Notifications</List.Subheader>
          <List.Item
            title="Enable Notifications"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={settings.notifications}
                onValueChange={handleNotificationToggle}
                color={theme.colors.primary}
              />
            )}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="shield-account" />}
            onPress={() => {}}
          />
          <List.Item
            title="Terms of Service"
            left={props => <List.Icon {...props} icon="file-document" />}
            onPress={() => {}}
          />
        </List.Section>
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    marginLeft: 8,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});