import GameScene from "../gameScene";
import TileMap from '../../../../models/tileMap';

function drawTiles(scene: GameScene, data: number[][]): void {
  const map = scene.make.tilemap({
    data: data,
    tileWidth: TileMap.tileSize,
    tileHeight: TileMap.tileSize,
    width: TileMap.cols,
    height: TileMap.rows
  });
  const tiles = map.addTilesetImage(
    'tileMap',
    'tileMap',
    TileMap.tileSize,
    TileMap.tileSize,
    1,
    2);
  map.createStaticLayer(0, tiles, 0, 0);
}

export { drawTiles }