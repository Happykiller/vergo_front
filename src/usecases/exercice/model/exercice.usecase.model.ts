import { UserUsecaseModel } from '@usecases/model/user.usecase.model';

export interface LanguageUsecaseModel {
  lang: string;
  value: string;
}

export interface ExerciceUsecaseModel {
  id: string;
  slug: string;
  title: LanguageUsecaseModel[];
  description: LanguageUsecaseModel[];
  image: string;
  creator?: UserUsecaseModel;
  contributors?: UserUsecaseModel[];
}