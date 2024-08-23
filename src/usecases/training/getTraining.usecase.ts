import { CODES } from '@src/commons/codes';
import { Inversify } from '@src/commons/inversify';
import { TrainingUsecaseModel } from '@usecases/training/model/training.usecase.model';
import { GetTrainingUsecaseDto } from '@usecases/training/dto/get.training.usecase.dto';

export class GetTrainingUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: GetTrainingUsecaseDto): Promise<{
    message: string,
    error?: string,
    data?: TrainingUsecaseModel
  }>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'training',
          variables: dto,
          query: `query training($id: String!) {
            training (
              dto: {
                id: $id
              }
            ) {
              id
              slug
              label
              gender
              workout {
                slug
              }
            }
          }`
        }
      );

      if(response.errors) {
        throw new Error(response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: response.data.training
      }
    } catch (e: any) {
      if(e.message in CODES) {
        return {
          message: e.message,
          error: e.message
        }
      } else {
        return {
          message: CODES.GET_TRANING_FAIL,
          error: e.message
        }
      }
    }
  }
}