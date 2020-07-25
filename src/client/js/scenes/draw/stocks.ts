import { IPlayer } from "../../../../models/interfaces";
import HudScene from "../hudScene";

function drawStocks(scene: HudScene, player: IPlayer): void {
  const text = scene.add.text(10, 20, `Stocks: ${player.stocks}`, { fontSize: "30px" });
  scene.gameObjects.push(text);
}

export { drawStocks }