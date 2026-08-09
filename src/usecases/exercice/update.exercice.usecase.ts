import { CODES } from '@src/commons/codes';
import { Inversify } from '@src/commons/inversify';

export class UpdateExerciceUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: any): Promise<{
    message: string
    error?: string
  }> {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'exercice_update',
          variables: dto,
          query: `mutation exercice_update(
  $id: String!,
  $slug: String, 
  $image: String, 
  $title: [LanguageDtoResolver!], 
  $description: [LanguageDtoResolver!]
) {
  exercice_update(
    dto: {
      id: $id,
      slug: $slug,
      image: $image,
      title: $title,
      description: $description
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
          message: CODES.UPDATE_EXERCICE_FAIL,
          error: e.message
        }
      }
    }
  }
}