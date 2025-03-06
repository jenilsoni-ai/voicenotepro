import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { useAnimatedStyle, withSpring, withRepeat, withSequence } from 'react-native-reanimated';
import { recordingService } from '../../services/recording/recordingService';

interface WaveformVisualizerProps {
  isRecording: boolean;
  isPaused: boolean;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ isRecording, isPaused }) => {
  const theme = useTheme();
  const numberOfBars = 50;
  const bars = Array.from({ length: numberOfBars });

  return (
    <View style={styles.waveformContainer}>
      {bars.map((_, index) => {
        const baseHeight = Math.random() * 40 + 10;
        const animatedStyle = useAnimatedStyle(() => ({
          height: isRecording && !isPaused
            ? withRepeat(
                withSequence(
                  withSpring(baseHeight * 2, { damping: 10, stiffness: 80 }),
                  withSpring(baseHeight, { damping: 10, stiffness: 80 })
                ),
                -1,
                true
              )
            : baseHeight,
          backgroundColor: theme.colors.primary,
          opacity: isRecording ? 1 : 0.5,
        }));

        return (
          <Animated.View
            key={index}
            style={[styles.bar, animatedStyle]}
          />
        );
      })}
    </View>
  );
};

export const RecordingScreen = () => {
  const navigation = useNavigation();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    const interval = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
    setTimer(interval);
  }, []);

  const stopTimer = useCallback(() => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [timer]);

  const resetTimer = useCallback(() => {
    stopTimer();
    setRecordingTime(0);
  }, [stopTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    try {
      await recordingService.startRecording();
      setIsRecording(true);
      startTimer();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handlePauseRecording = async () => {
    try {
      if (isPaused) {
        await recordingService.resumeRecording();
        setIsPaused(false);
        startTimer();
      } else {
        await recordingService.pauseRecording();
        setIsPaused(true);
        stopTimer();
      }
    } catch (error) {
      console.error('Failed to pause/resume recording:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const uri = await recordingService.stopRecording();
      setIsRecording(false);
      setIsPaused(false);
      resetTimer();
      if (uri) {
        // Handle the recorded audio file
        console.log('Recording saved at:', uri);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const handleDiscardRecording = async () => {
    try {
      await recordingService.discardRecording();
      setIsRecording(false);
      setIsPaused(false);
      resetTimer();
      navigation.goBack();
    } catch (error) {
      console.error('Failed to discard recording:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#0D2F81', '#0A1F3D']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor="white"
            onPress={() => navigation.goBack()}
          />
          <Text variant="headlineSmall" style={styles.headerTitle}>Recording</Text>
        </View>

        <View style={styles.waveformContainer}>
          <WaveformVisualizer isRecording={isRecording} isPaused={isPaused} />

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
          </View>

          <View style={styles.controlsContainer}>
            {!isRecording ? (
              <TouchableOpacity
                onPress={handleStartRecording}
                style={[styles.controlButton, styles.startButton]}
              >
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={handlePauseRecording}
                  style={[styles.controlButton, styles.pauseButton]}
                >
                  <Text style={styles.buttonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleStopRecording}
                  style={[styles.controlButton, styles.stopButton]}
                >
                  <Text style={styles.buttonText}>Stop</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDiscardRecording}
                  style={[styles.controlButton, styles.discardButton]}
                >
                  <Text style={styles.buttonText}>Discard</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 2,
  },
  bar: {
    width: 3,
    borderRadius: 1.5,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  controlButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    minWidth: 120,
    alignItems: 'center',
    elevation: 4,
  },
  startButton: {
    backgroundColor: '#2196F3',
  },
  pauseButton: {
    backgroundColor: '#2196F3',
  },
  stopButton: {
    backgroundColor: '#DC2626',
  },
  discardButton: {
    backgroundColor: '#4B5563',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});