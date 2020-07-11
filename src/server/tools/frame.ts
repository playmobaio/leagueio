import constants from '../constants';

function secondsToFrames(seconds: number): number {
  return constants.FRAMES_PER_SECOND * seconds;
}

function framesToSeconds(frames: number): number {
  return frames / constants.FRAMES_PER_SECOND;
}

function getFramesBetweenAutoAttack(speed: number): number {
  return constants.FRAMES_PER_SECOND / speed;
}

export { secondsToFrames, framesToSeconds, getFramesBetweenAutoAttack }