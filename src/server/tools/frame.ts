import constants from '../constants';

function secondsToFrames(seconds: number): number {
  return constants.FRAME_RATE * seconds;
}

function framesToSeconds(frames: number): number {
  return frames / constants.FRAME_RATE;
}

function getFramesBetweenAutoAttack(speed: number): number {
  return constants.FRAME_RATE / speed;
}

export { secondsToFrames, framesToSeconds, getFramesBetweenAutoAttack }
