import { CODES } from '@src/commons/codes';
import { Inversify } from '@src/commons/inversify';

export class CreateExerciceUsecase {

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
          operationName: 'exercice_create',
          variables: dto,
          query: `mutation exercice_create(
  $slug: String!, 
  $image: String!, 
  $title: [LanguageDtoResolver!]!, 
  $description: [LanguageDtoResolver!]!
) {
  exercice_create(
    dto: {
      slug: $slug,
      image: $image,
      title: $title,
      description: $description
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
          message: CODES.CREATE_EXERCICE_FAIL,
          error: e.message
        }
      }
    }
  }
}