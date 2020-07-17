import Projectile from '../models/projectile';
import { Body } from 'detect-collisions';
import Player from '../player';

// To add a new event, add the corresponding EmitEvent, and assign the value as
// a property on this interface.
export interface IEmitEventMapping {
  NEW_PLAYER: (player: Player) => void;
  NEW_PROJECTILE:  (projectile: Projectile) => void;
  DELETE_PROJECTILE: (projectileId: string) => void;
  NEW_BODY: (body: Body) => void;
  REMOVE_BODY: (body: Body) => void;
}
