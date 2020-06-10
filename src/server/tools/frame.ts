import constants from '../constants';

function secondsToFrames(seconds: number): number {
  return constants.FRAMES_PER_SECOND * seconds;
}

export { secondsToFrames }