import CGameMap from "../cgameMap";
import { IPlayer } from '../../../models/interfaces';

function drawClientHealth(gameMap: CGameMap, clientPlayer: IPlayer): void {
  gameMap.context.font = "30px Arial";
  gameMap.context.fillText(`Health: ${clientPlayer.health.current}`, 10, 30);
}

export {
  drawClientHealth
}