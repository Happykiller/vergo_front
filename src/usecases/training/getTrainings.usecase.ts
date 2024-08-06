import { CODES } from '@src/commons/codes';
import { Inversify } from '@src/commons/inversify';
import { TrainingUsecaseModel } from '@usecases/training/model/training.usecase.model';

export class GetTrainingsUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(): Promise<{
    message: string,
    error?: string,
    data?: TrainingUsecaseModel[]
  }>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'trainings',
          variables: {},
          query: `query trainings {
            trainings
            {
              id
              slug
            }
          }`
        }
      );

      if(response.errors) {
        throw new Error(response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: response.data.trainings
      }
    } catch (e: any) {
      if(e.message in CODES) {
        return {
          message: e.message,
          error: e.message
        }
      } else {
        return {
          message: CODES.GET_TRANINGS_FAIL,
          error: e.message
        }
      }
    }
  }
}