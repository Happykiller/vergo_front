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
}