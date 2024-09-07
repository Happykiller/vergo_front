import { StandardUsecaseModel } from "@usecases/model/standard.usecase.model"
import { TrainingUsecaseModel } from "@usecases/training/model/training.usecase.model"

export interface GetTrainingsUsecaseModel extends StandardUsecaseModel {
  data?: {
    public: TrainingUsecaseModel[],
    private: TrainingUsecaseModel[]
  }
}