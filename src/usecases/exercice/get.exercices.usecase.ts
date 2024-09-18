import { CODES } from '@src/commons/codes';
import { Inversify } from '@src/commons/inversify';
import { GetExercicesUsecaseModel } from '@usecases/exercice/model/get.exercices.usecase.model';

export class GetExercicesUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(): Promise<GetExercicesUsecaseModel>  {
    try {
      const exercices_response:any = await this.inversify.graphqlService.send(
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

      if(exercices_response.errors) {
        throw new Error(exercices_response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: exercices_response.data.exercices
      }
    } catch (e: any) {
      if(e.message in CODES) {
        return {
          message: e.message,
          error: e.message
        }
      } else {
        return {
          message: CODES.GET_EXERCICES_FAIL,
          error: e.message
        }
      }
    }
  }
}