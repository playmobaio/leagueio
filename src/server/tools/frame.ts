import constants from '../constants';

function secondsToFrames(seconds: number): number {
  return constants.FRAMES_PER_SECOND * seconds;
}

function framesToSeconds(frames: number): number {
  return Math.floor(frames / constants.FRAMES_PER_SECOND);
}

export { secondsToFrames, framesToSeconds }