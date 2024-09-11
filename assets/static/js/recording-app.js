/* eslint-disable no-undef */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function recordingApp(endpoint = '/user/personality') {
  const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#53bbb3',
    progressColor: '#27ade4',
    mediaControls: true,
  });
  const mediaRecorder = WaveSurfer.create({
    container: '#audio-level',
    waveColor: '#27ade4',
    progressColor: '#53bbb3',
  }).registerPlugin(WaveSurfer.Record.create());
  mediaRecorder.startMic();

  return {
    wavesurfer,
    showInfo: true,
    recording: false,
    readyToUpload: false,
    uploading: false,
    buttonText: 'Start Recording',
    mediaRecorder,
    timer: null,
    audioCtx: null,
    audioBlob: null,
    showWarning: false,

    beep() {
      if (this.audioCtx === null) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      gainNode.gain.value = 0.5;
      oscillator.frequency.value = 432;
      oscillator.type = 'sine';
      oscillator.start();
      setTimeout(function () {
        oscillator.stop();
      }, 100);
    },

    toggleRecording() {
      this.wavesurfer.pause();
      if (!this.recording) {
        this.startRecording();
      } else {
        this.stopRecording();
      }
    },

    doRecording() {
      const maxMinutes = 10; // 10 minutes max recording time
      this.mediaRecorder.startRecording();
      let seconds = maxMinutes * 60;
      this.buttonText = 'Stop Recording - ' + maxMinutes + 'm:0s';
      this.timer = setInterval(() => {
        seconds--;
        if (seconds === 0) {
          this.stopRecording();
        }
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        this.buttonText = 'Stop Recording - ' + mins + 'm:' + secs + 's';
      }, 1000);
    },

    startRecording() {
      this.recording = true;
      this.readyToUpload = false;
      let seconds = 2;
      this.beep();
      const countdown = setInterval(() => {
        this.buttonText = 'READY ... ' + seconds;
        if (seconds === 0) {
          clearInterval(countdown);
          this.doRecording();
        } else {
          this.beep();
        }
        seconds--;
      }, 1000);
    },

    stopRecording() {
      this.mediaRecorder.stopRecording();
      clearInterval(this.timer);
      this.recording = false;
      this.buttonText = 'Record It Again';
      this.readyToUpload = true;
    },

    redoRecording() {
      this.readyToUpload = false;
      this.buttonText = 'Start Recording';
      this.audioBlob = null;
      this.wavesurfer.empty();
      this.showWarning = false;
    },

    async uploadAudio() {
      this.uploading = true;
      const formData = new FormData();
      const MIME_TYPES = ['audio/webm', 'audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/mp3'];
      const findSupportedMimeType = () => MIME_TYPES.find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
      const ext = findSupportedMimeType().split('/')[1];
      const filename = `${uuid()}.${ext}`;
      this.wavesurfer.pause();
      formData.append('audio', this.audioBlob, filename);
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      const page = document.getElementById('page');
      page.innerHTML = await response.text();
      htmx.process(page);
      this.audioBlob = null;
    },

    init() {
      this.mediaRecorder.on('record-end', async (blob) => {
        this.audioBlob = blob;
        const audioUrl = window.URL.createObjectURL(blob);
        await this.wavesurfer.load(audioUrl);
        const length = this.wavesurfer.getDuration();
        if (length < 90) {
          this.showWarning = true;
        }
      });
    },
  };
}
