export interface IJoinGame {
  name: string;
  heroId: HeroID;
}

export enum HeroID {
  Dodge = 0,
  Ranger = 1,
  Brute = 2
}
