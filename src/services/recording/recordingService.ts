import { Audio } from 'expo-av';
import { Recording } from 'expo-av/build/Audio';

export class RecordingService {
  private recording: Recording | null = null;
  private isRecording = false;
  private isPaused = false;

  /**
   * Start a new recording
   */
  async startRecording() {
    try {
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        throw new Error('Permission to record was denied');
      }

      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create and start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      this.isRecording = true;
      this.isPaused = false;

      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  /**
   * Pause the current recording
   */
  async pauseRecording() {
    if (!this.recording || !this.isRecording || this.isPaused) return false;

    try {
      await this.recording.pauseAsync();
      this.isPaused = true;
      return true;
    } catch (error) {
      console.error('Error pausing recording:', error);
      throw error;
    }
  }

  /**
   * Resume a paused recording
   */
  async resumeRecording() {
    if (!this.recording || !this.isRecording || !this.isPaused) return false;

    try {
      await this.recording.startAsync();
      this.isPaused = false;
      return true;
    } catch (error) {
      console.error('Error resuming recording:', error);
      throw error;
    }
  }

  /**
   * Stop and save the current recording
   */
  async stopRecording() {
    if (!this.recording || !this.isRecording) return null;

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      this.isRecording = false;
      this.isPaused = false;
      return uri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  }

  /**
   * Discard the current recording
   */
  async discardRecording() {
    if (!this.recording) return false;

    try {
      await this.recording.stopAndUnloadAsync();
      this.recording = null;
      this.isRecording = false;
      this.isPaused = false;
      return true;
    } catch (error) {
      console.error('Error discarding recording:', error);
      throw error;
    }
  }

  /**
   * Get the current recording status
   */
  getStatus() {
    return {
      isRecording: this.isRecording,
      isPaused: this.isPaused,
    };
  }
}

export const recordingService = new RecordingService();