import { IPlayer } from "../../../../models/interfaces";
import HudScene from "../hudScene";

const STOCK_X = 10;
const STOCK_Y = 20;

function drawStocks(scene: HudScene, player: IPlayer): void {
  const text = `Stocks: ${player.stocks}`;
  if (scene.stockText) {
    scene.stockText.setText(text);
    return;
  }
  scene.stockText = scene.add.text(STOCK_X, STOCK_Y, text, { fontSize: "30px" });
}

export { drawStocks }