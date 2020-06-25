import CGameMap from "../cgameMap";
import { IPoint } from "../../../models/interfaces";

function drawCircle(map: CGameMap,
  position: IPoint,
  radius: number,
  strokeStyle = "black",
  fill = false,
  fillStyle = "black"): void {
  map.context.strokeStyle = strokeStyle;
  map.context.beginPath();
  map.context.arc(
    position.x,
    position.y,
    radius,
    0,
    2 * Math.PI);
  map.context.stroke();
  if (fill) {
    map.context.fillStyle = fillStyle;
    map.context.fill();
  }
}

export { drawCircle }