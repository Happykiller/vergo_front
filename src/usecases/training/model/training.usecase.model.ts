export interface TrainingUsecaseModel {
  id: string;
  slug: string;
  gender?: string;
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
  ite?: number;
  weight?: number;
  rest?: number;
  pause?: number;
  sets?: SetUsecaseModel[];
}