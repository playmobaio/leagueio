export class ProjectileManagerConfig {
  meteorFrequency: number;
  ezrealUltimateFrequency: number;

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
