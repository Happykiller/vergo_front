import { CODES } from '@src/commons/codes';
import { Inversify } from '@src/commons/inversify';
import { WorkoutDefUsecaseModel } from '@usecases/workout/model/workout.def.usecase.model';

export class GetWorkoutsUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(): Promise<{
    message: string,
    error?: string,
    data?: WorkoutDefUsecaseModel[]
  }>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'workouts',
          variables: {},
          query: `query workouts {
  workouts (
    limit: 999
    order_by: {
      field: "slug"
      order: DESC
    }
  ) {
    count
    nodes {
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
  }
}`
        }
      );

      if(response.errors) {
        throw new Error(response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: response.data.workouts.nodes
      }
    } catch (e: any) {
      if(e.message in CODES) {
        return {
          message: e.message,
          error: e.message
        }
      } else {
        return {
          message: CODES.GET_WORKOUTS_FAIL,
          error: e.message
        }
      }
    }
  }
}