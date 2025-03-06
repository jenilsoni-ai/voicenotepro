import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { RootStackParamList } from '../../navigation/types';

export const StartupScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [fontsLoaded] = useFonts({
    'Inter': require('../../../assets/fonts/Inter-Regular.ttf'),
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Wait for 2-3 seconds before navigating
      setTimeout(() => {
        if (user) {
          navigation.replace('Home');
        } else {
          navigation.replace('Signup');
        }
      }, 2500);
    });

    return () => unsubscribe();
  }, [navigation]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#6B46C1', '#FFFFFF']}
      style={styles.container}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="microphone"
          size={80}
          color="#6B46C1"
          style={styles.logo}
        />
        <Text style={styles.appName}>VoiceNotes Pro</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    marginBottom: 16,
  },
  appName: {
    fontFamily: 'Inter',
    fontSize: 24,
    color: '#0D2F81',
    textAlign: 'center',
  },
});