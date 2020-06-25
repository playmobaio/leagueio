import {
  IPoint,
  PlayerCastIO,
  IUserInput,
  IUserMouseClick,
  Click,
  IAbility,
  IHero
} from '../../models/interfaces';
import Game from './game';
import constants from './constants';
import CGameMap from './cgameMap';
import Abilities from '../../models/data/abilities';

class UserInputController {
  private static instance: UserInputController;
  socket: SocketIO.Socket;
  userIO: PlayerCastIO;
  targetPosition: IPoint;
  cursorPosition: IPoint;

  private constructor(socket: SocketIO.Socket) {
    this.socket = socket
    this.userIO = PlayerCastIO.None;
    this.cursorPosition = constants.POINT_NOT_ON_MAP;
  }

  static getInstance(socket: SocketIO.Socket): UserInputController {
    if (!UserInputController.instance) {
      UserInputController.instance = new UserInputController(socket);
    }
    if (socket != null && UserInputController.instance.socket == null) {
      UserInputController.instance.socket = socket;
    }

    return UserInputController.instance;
  }

  setCastingAreaOrigin(evt: MouseEvent): void {
    const gameMap = CGameMap.getInstance();
    const rect = gameMap.canvas.getBoundingClientRect();
    this.cursorPosition = {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  registerPlayerMove(io: PlayerCastIO): void {
    this.userIO = io;
    const gameMap = CGameMap.getInstance();
    gameMap.canvas.addEventListener("mousemove", this.setCastingAreaOrigin.bind(this));
  }

  deRegisterPlayerMove(): void {
    this.sendPlayerInput();
    const gameMap = CGameMap.getInstance();
    gameMap.canvas.removeEventListener("mousemove", this.setCastingAreaOrigin.bind(this));
    this.userIO = null;
  }

  sendMouseClick(click: Click, cursorPosition: IPoint): void {
    if (this.socket == null) {
      return;
    }

    if (click == Click.Right) {
      this.targetPosition = cursorPosition;
    }
    const userMouseClick: IUserMouseClick = { cursorPosition: cursorPosition, click: click }
    this.socket.emit("C:USER_MOUSE_CLICK", userMouseClick);
  }

  sendPlayerInput(): void {
    if (this.socket == null) {
      return;
    }
    const game = Game.getInstance();
    const userInput: IUserInput = {
      io: this.userIO,
      cursorPosition: game.camera.relativeToAbsolutePosition(this.cursorPosition)
    };
    this.socket.emit("C:USER_CAST", userInput);
  }

  getCastingAbility(hero: IHero): IAbility {
    let abilityName: string;
    switch(this.userIO) {
    case PlayerCastIO.Q:
      abilityName = hero.qAbility.abilityName;
      break;
    case PlayerCastIO.W:
      abilityName = hero.wAbility.abilityName;
      break;
    case PlayerCastIO.E:
      abilityName = hero.eAbility.abilityName;
      break;
    default:
      return null;
    }
    const ability: IAbility = Abilities[abilityName];
    if (ability == null) {
      return null;
    }
    const game = Game.getInstance();
    ability.castingShape.origin = game.camera.getRelativePosition(this.cursorPosition);
    return ability;
  }

  drawTargetPosition(game: Game): void {
    if (this.targetPosition == null) {
      return;
    }
    const point: IPoint = game.camera.absoluteToRelativePosition(this.targetPosition);
    game.gameMap.context.beginPath();
    game.gameMap.context.strokeStyle = "red";

    game.gameMap.context.strokeRect(point.x,
      point.y,
      constants.DEFAULT_CURSOR_PIXEL_LENGTH,
      constants.DEFAULT_CURSOR_PIXEL_LENGTH);
  }
}

export default UserInputController;
