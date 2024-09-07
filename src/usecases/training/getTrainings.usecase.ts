import { CODES } from '@src/commons/codes';
import { Inversify } from '@src/commons/inversify';
import { GetTrainingsUsecaseModel } from '@usecases/training/model/get.trainings.usecase.model';

export class GetTrainingsUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(): Promise<GetTrainingsUsecaseModel>  {
    try {
      const publics:any = await this.inversify.graphqlService.send(
        {
          operationName: 'trainings',
          variables: {},
          query: `query trainings {
            trainings
            {
              id
              slug
              label
              gender
            }
          }`
        }
      );

      if(publics.errors) {
        throw new Error(publics.errors[0].message);
      }

      const privates:any = await this.inversify.graphqlService.send(
        {
          operationName: 'get_private_trainings',
          variables: {},
          query: `query get_private_trainings {
            get_private_trainings
            {
              id
              slug
              label
              gender
            }
          }`
        }
      );

      if(privates.errors) {
        throw new Error(privates.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: {
          public: publics.data.trainings,
          private: privates.data.get_private_trainings,
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
          message: CODES.GET_TRANINGS_FAIL,
          error: e.message
        }
      }
    }
  }
}