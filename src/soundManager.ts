// soundManager.ts
import Sound from 'react-native-sound';

Sound.setCategory('Playback'); // iOS silent mode

let correctSound: Sound | null = null;
let wrongSound: Sound | null = null;
let winSound: Sound | null = null;

export const loadSounds = () => {
  correctSound = new Sound('correct.mp3', Sound.MAIN_BUNDLE, (e) => {
    if (e) console.log('Load correct failed', e);
  });

  wrongSound = new Sound('wrong.mp3', Sound.MAIN_BUNDLE, (e) => {
    if (e) console.log('Load wrong failed', e);
  });

  winSound = new Sound('win.mp3', Sound.MAIN_BUNDLE, (e) => {
    if (e) console.log('Load win failed', e);
  });
};

export const playCorrect = () => {
  if (correctSound) correctSound.stop(() => correctSound?.play());
};

export const playWrong = () => {
  if (wrongSound) wrongSound.stop(() => wrongSound?.play());
};

export const playWin = () => {
  if (winSound) winSound.stop(() => winSound?.play());
};

export const releaseSounds = () => {
  correctSound?.release();
  wrongSound?.release();
  winSound?.release();
};
