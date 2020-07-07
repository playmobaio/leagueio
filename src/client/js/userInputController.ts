import {
  IPoint,
  PlayerCastIO,
  IUserInput,
  IUserMouseClick,
  Click,
  IAbility,
} from '../../models/interfaces';
import Game from './game';
import constants from './constants';
import CGameMap from './cgameMap';
import { HeroAbilities, Abilities } from '../../models/data/heroAbilities';

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

  preCast(io: PlayerCastIO): void {
    this.userIO = io;
    const gameMap = CGameMap.getInstance();
    gameMap.canvas.addEventListener("mousemove", this.setCastingAreaOrigin.bind(this));
  }

  cast(): void {
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
      cursorPosition: game.camera.getAbsolutePosition(this.cursorPosition)
    };
    this.socket.emit("C:USER_CAST", userInput);
  }

  getCastingAbility(): IAbility {
    let abilityName: string;
    const game = Game.getInstance();
    const heroAbilities = HeroAbilities[game.heroId];
    switch(this.userIO) {
    case PlayerCastIO.Q:
      abilityName = heroAbilities.qAbility?.abilityName;
      break;
    case PlayerCastIO.W:
      abilityName = heroAbilities.wAbility?.abilityName;
      break;
    case PlayerCastIO.E:
      abilityName = heroAbilities.eAbility?.abilityName;
      break;
    default:
      return null;
    }
    if (abilityName == null || Abilities[abilityName].castingShape == null) {
      return null;
    }
    const ability: IAbility = Abilities[abilityName];
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
