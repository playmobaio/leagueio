import CGameMap from "../cgameMap";
import { IPlayer } from '../../../models/interfaces';

function drawClientStocks(gameMap: CGameMap, clientPlayer: IPlayer): void {
  gameMap.context.font = "30px Arial";
  gameMap.context.fillText(`Stocks: ${clientPlayer.stocks}`, 10, 30);
}

export {
  drawClientStocks
}