import { CODES } from '@src/commons/codes';
import { Inversify } from '@src/commons/inversify';
import { GetExerciceUsecaseDto } from '@usecases/exercice/dto/get.exercice.usecase.dto';
import { GetExerciceUsecaseModel } from '@usecases/exercice/model/get.exercice.usecase.model';

export class GetExerciceUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: GetExerciceUsecaseDto): Promise<GetExerciceUsecaseModel>  {
    try {
      const exercice_response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'exercice',
          variables: dto,
          query: `query exercice($id: String!) {
  exercice (
    dto: {
      id: $id
    }
  ) {
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

      if(exercice_response.errors) {
        throw new Error(exercice_response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: exercice_response.data.exercice
      }
    } catch (e: any) {
      if(e.message in CODES) {
        return {
          message: e.message,
          error: e.message
        }
      } else {
        return {
          message: CODES.GET_EXERCICE_FAIL,
          error: e.message
        }
      }
    }
  }
}