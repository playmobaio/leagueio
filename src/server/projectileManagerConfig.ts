export class ProjectileManagerConfig {
  // all frequencies are in 10 second increments
  meteorFrequency: number;
  ezrealUltimateFrequency: number;

  static DEFAULT_METEOR_FREQUENCY = 8;
  static DEFAULT_EZREAL_ULTIMATE_FREQUENCY = 2;

  constructor(meteorFrequency: number, ezrealUltimateFrequency: number) {
    this.meteorFrequency = meteorFrequency;
    this.ezrealUltimateFrequency = ezrealUltimateFrequency;
  }

  getMeteorFrequency(): number {
    return this.meteorFrequency;
  }

  getEzrealUltimateFrequency(): number {
    return this.ezrealUltimateFrequency;
  }
}

export class ProjectileManagerConfigBuilder {
  meteorFrequency: number;
  ezrealUltimateFrequency: number;

  constructor() {
    this.meteorFrequency = ProjectileManagerConfig.DEFAULT_METEOR_FREQUENCY;
    this.ezrealUltimateFrequency = ProjectileManagerConfig.DEFAULT_EZREAL_ULTIMATE_FREQUENCY;
  }

  setMeteorFrequency(frequency: number): ProjectileManagerConfigBuilder {
    this.meteorFrequency = frequency;
    return this;
  }

  setEzrealUltimateFrequency(frequency: number): ProjectileManagerConfigBuilder {
    this.ezrealUltimateFrequency = frequency;
    return this;
  }

  build(): ProjectileManagerConfig {
    return new ProjectileManagerConfig(this.meteorFrequency,
      this.ezrealUltimateFrequency);
  }
}
