import { StandardUsecaseModel } from "@usecases/model/standard.usecase.model"
import { ExerciceUsecaseModel } from '@usecases/exercice/model/exercice.usecase.model'

export interface GetExercicesUsecaseModel extends StandardUsecaseModel {
  data?: ExerciceUsecaseModel[]
}