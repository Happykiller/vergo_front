import { CODES } from '@src/commons/codes';
import { Inversify } from '@src/commons/inversify';

export class CreateTrainingUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: any): Promise<{
    message: string
    error?: string
  }>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'training_create',
          variables: dto,
          query: `mutation training_create(
  $slug: String!, 
  $gender: String, 
  $label: String, 
  $workout: [CreateTrainingWorkoutDtoResolver!]!
) {
  training_create(
    dto: {
      slug: $slug,
      gender: $gender,
      label: $label,
      workout: $workout
    }
  ) {
    id
  }
}`
        }
      );

      if(response.errors) {
        throw new Error(response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS
      }
    } catch (e: any) {
      if(e.message in CODES) {
        return {
          message: e.message,
          error: e.message
        }
      } else {
        return {
          message: CODES.CREATE_TRAINING_FAIL,
          error: e.message
        }
      }
    }
  }
}