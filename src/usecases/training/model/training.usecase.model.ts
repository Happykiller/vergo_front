import { UserUsecaseModel } from '@usecases/model/user.usecase.model';

export interface TrainingUsecaseModel {
  id: string;
  slug: string;
  gender?: string;
  label?: string;
  workout?: WorkoutUsecaseModel[];
  creator?: UserUsecaseModel;
  contributors?: UserUsecaseModel[];
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