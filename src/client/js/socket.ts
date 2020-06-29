import Game from './game';
import UserInputController from './userInputController';
import { PlayerCastIO, IPoint, IGameState, Click, ICasting } from '../../models/interfaces';

function registerSocket(socket: SocketIO.Socket): void {
  const _game: Game = Game.getInstance();
  const _userInputController: UserInputController = UserInputController.getInstance(socket);

  socket.on("S:UPDATE_GAME_STATE", (userGame: IGameState) => {
    _game.draw(userGame);
  });

  socket.on("S:CASTING", (casting: ICasting) => {
    _game.casting.set(casting.abilityName, casting.coolDownLastFrame);
  });

  addEventListener("mousedown", function(event) {
    const screenPoint: IPoint = { x: event.clientX, y: event.clientY };

    let click: Click;
    switch(event.button) {
    case 0:
      click = Click.Left;
      break;
    case 2:
      click = Click.Right;
      break;
    }
    _userInputController.sendMouseClick(
      click,
      _game.camera.getAbsolutePosition(screenPoint));
  });

  function getPlayerCastIO(event: KeyboardEvent): PlayerCastIO {
    switch(event.code) {
    case "KeyQ":
      return PlayerCastIO.Q;
    case "KeyW":
      return PlayerCastIO.W;
    case "KeyE":
      return PlayerCastIO.E;
    }
    return PlayerCastIO.None;
  }

  window.onkeydown = (event: KeyboardEvent): void => {
    event.preventDefault();
    const io: PlayerCastIO = getPlayerCastIO(event);
    _userInputController.preCast(io);
  }

  window.onkeyup = (event: KeyboardEvent): void => {
    event.preventDefault();
    _userInputController.cast();
  }
}

export { registerSocket };
