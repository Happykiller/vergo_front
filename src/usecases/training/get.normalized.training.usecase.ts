import { CODES } from '@src/commons/codes';
import { Inversify } from '@src/commons/inversify';
import { GetTrainingUsecaseDto } from '@usecases/training/dto/get.training.usecase.dto';
import { TrainingNormalizedUsecaseModel } from '@usecases/training/model/training.normalized.usecase.model';

export class GetNormalizedTrainingUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: GetTrainingUsecaseDto): Promise<{
    message: string,
    error?: string,
    data?: TrainingNormalizedUsecaseModel[]
  }>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
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

      if(response.errors) {
        throw new Error(response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: response.data.training_normalized
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