import { LanguageUsecaseModel } from '@usecases/exercice/model/exercice.usecase.model';


export interface WorkoutDefUsecaseModel {
  id: string;
  slug: string;
  title: LanguageUsecaseModel[];
  description: LanguageUsecaseModel[];
  image: string;
}