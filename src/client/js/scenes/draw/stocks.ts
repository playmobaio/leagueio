import { IPlayer } from "../../../../models/interfaces";
import HudScene from "../hudScene";

const STOCK_X = 10;
const STOCK_Y = 20;

function drawStocks(scene: HudScene, player: IPlayer): void {
  const text = scene.add.text(STOCK_X, STOCK_Y, `Stocks: ${player.stocks}`, { fontSize: "30px" });
  scene.gameObjects.push(text);
}

export { drawStocks }