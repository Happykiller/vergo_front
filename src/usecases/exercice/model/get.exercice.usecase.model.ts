import { ExerciceUsecaseModel } from '@usecases/exercice/model/exercice.usecase.model'
import { StandardUsecaseModel } from "@usecases/model/standard.usecase.model"

export interface GetExerciceUsecaseModel extends StandardUsecaseModel {
  data?: ExerciceUsecaseModel
}