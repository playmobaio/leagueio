import Game from './game';
import CPlayer from './cplayer';
import { IPlayer } from '../../models/interfaces';

function registerSocket(socket): void {
  const _game: Game = Game.getInstance();

  socket.on("SERVER:PLAYER_CREATED", () => {
    _game.startGame();
  });

  socket.on("S:PLAYER_MOVE", (player: IPlayer) => {
    const cplayer = new CPlayer(player.id, player.position);
    _game.addOrUpdatePlayer(cplayer);
  });
}

export { registerSocket };