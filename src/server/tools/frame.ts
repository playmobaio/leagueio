import Game from '../game';

function secondsToFrames(seconds: number): number {
  return Game.FRAMES_PER_SECOND * seconds;
}

function framesToSeconds(frames: number): number {
  return frames / Game.FRAMES_PER_SECOND;
}

function getFramesBetweenAutoAttack(speed: number): number {
  return Game.FRAMES_PER_SECOND / speed;
}

export { secondsToFrames, framesToSeconds, getFramesBetweenAutoAttack }