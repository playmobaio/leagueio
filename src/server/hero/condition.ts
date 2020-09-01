import { ICondition } from '../../models/interfaces/basicTypes';

export default class Condition {
  readonly iCondition: ICondition;
  static Active = new Condition(ICondition.Active);
  static Casting = new Condition(ICondition.Casting);
  static Stunned = new Condition(ICondition.Stunned);
  static Dead = new Condition(ICondition.Dead);

  constructor(iCondition: ICondition) {
    this.iCondition = iCondition;
  }

  overrides(condition: Condition): boolean {
    return this.iCondition > condition.iCondition;
  }

  equals(condition: Condition): boolean {
    return this.iCondition == condition.iCondition;
  }

  toString(): string {
    switch (this.iCondition) {
    case ICondition.Active:
      return "Condition.Active";
    case ICondition.Casting:
      return "Condition.Casting";
    case ICondition.Stunned:
      return "Condition.Stunned";
    case ICondition.Dead:
      return "Condition.Dead";
    }
  }
}
