export const GOAL_VALUES = [
  "reduction",
  "mass_gain",
  "maintain_weight",
  "strength",
  "endurance",
] as const;

export type GoalValue = typeof GOAL_VALUES[number];

const GOAL_LABELS: Record<GoalValue, string> = {
  reduction: "Redukcja tkanki tłuszczowej",
  mass_gain: "Przybranie masy mięśniowej",
  maintain_weight: "Utrzymanie wagi",
  strength: "Poprawa siły",
  endurance: "Poprawa wytrzymałości",
};

export const GOAL_OPTIONS = GOAL_VALUES.map((v) => ({
  value: v,
  label: GOAL_LABELS[v],
})) as { value: GoalValue; label: string }[];


export const GOAL_LABEL_MAP = new Map<GoalValue, string>(
  GOAL_OPTIONS.map((o) => [o.value, o.label])
);

export function getGoalLabel(value?: string | null) {
  if (!value) return "—";
  return GOAL_LABEL_MAP.get(value as GoalValue) ?? "Nieznany cel";
}

export const ACTIVITY_VALUES = [
  'LOW', 'MEDIUM', 'HIGH'
] as const;

export type ActivityValue = typeof ACTIVITY_VALUES[number];

export const ACTIVITY_OPTIONS: Record<ActivityValue, string> = {
  'LOW': 'Mała',
  'MEDIUM': 'Średnia',
  "HIGH": 'Duża',
}

export const WEIGHT_MIN = 10;
export const WEIGHT_MAX = 500;
export const HEIGHT_MIN = 50;
export const HEIGHT_MAX = 300;
