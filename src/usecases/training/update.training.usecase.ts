import { CODES } from '@src/commons/codes';
import { Inversify } from '@src/commons/inversify';

export class UpdateTrainingUsecase {

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
          operationName: 'training_update',
          variables: dto,
          query: `mutation training_update(
  $id: String!,
  $slug: String, 
  $gender: String, 
  $label: String, 
  $workout: [WorkoutDtoResolver!]
) {
  training_update(
    dto: {
      id: $id,
      slug: $slug,
      gender: $gender,
      label: $label,
      workout: $workout
    }
  )
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
          message: CODES.UPDATE_TRAINING_FAIL,
          error: e.message
        }
      }
    }
  }
}