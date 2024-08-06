export interface TrainingUsecaseModel {
  id: string;
  slug: string;
  workout?: WorkoutUsecaseModel[];
}

export interface WorkoutUsecaseModel {
  slug: string;
  sets: SetUsecaseModel[];
}

export interface SetUsecaseModel {
  rep?: number;
  slugs?: string[];
  duration?: number;
  rest?: number;
  pause?: number;
  sets?: SetUsecaseModel[];
}