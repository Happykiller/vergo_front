import { CODES } from '@src/commons/codes';
import { Inversify } from '@src/commons/inversify';
import { ExerciceUsecaseModel } from '@usecases/exercice/model/exercice.usecase.model';
import { GetTrainingUsecaseDto } from '@usecases/training/dto/get.training.usecase.dto';
import { TrainingNormalizedUsecaseModel } from '@usecases/training/model/training.normalized.usecase.model';

export class GetNormalizedTrainingUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: GetTrainingUsecaseDto): Promise<{
    message: string,
    error?: string,
    data?: {
      training: TrainingNormalizedUsecaseModel[],
      exercices: ExerciceUsecaseModel[]
    }
  }>  {
    try {
      const training_request:any = await this.inversify.graphqlService.send(
        {
          operationName: 'training_normalized',
          variables: dto,
          query: `query training_normalized($id: String!) {
            training_normalized (
              dto: {
                id: $id
              }
            ) {
              slugs
              type
              duration
            }
          }`
        }
      );

      if(training_request.errors) {
        throw new Error(training_request.errors[0].message);
      }

      const exercices_request:any = await this.inversify.graphqlService.send(
        {
          operationName: 'exercices',
          variables: {},
          query: `query exercices {
            exercices {
              id
              slug
              title {
                lang
                value
              }
              description {
                lang
                value
              }
              image
            }
          }`
        }
      );

      if(exercices_request.errors) {
        throw new Error(exercices_request.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: {
          training: training_request.data.training_normalized,
          exercices: exercices_request.data.exercices
        }
      }
    } catch (e: any) {
      if(e.message in CODES) {
        return {
          message: e.message,
          error: e.message
        }
      } else {
        return {
          message: CODES.GET_NORMALIZED_TRANINGS_FAIL,
          error: e.message
        }
      }
    }
  }
}