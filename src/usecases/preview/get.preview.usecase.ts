import { CODES } from '@src/commons/codes';
import commons from '@src/commons/commons';
import { Inversify } from '@src/commons/inversify';
import { GetPreviewUsecaseDto } from '@usecases/preview/dto/get.preview.usecase.dto';
import { ExerciceUsecaseModel } from '@usecases/exercice/model/exercice.usecase.model';
import { WorkoutDefUsecaseModel } from '@usecases/workout/model/workout.def.usecase.model';
import { TrainingNormalizedUsecaseModel } from '@usecases/training/model/training.normalized.usecase.model';

export class GetPreviewUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: GetPreviewUsecaseDto): Promise<{
    message: string,
    error?: string,
    data?: {
      training: {
        id: string;
        slug: string;
        gender?: string;
        label?: string;
      },
      training_normalized: TrainingNormalizedUsecaseModel[],
      exercices: ExerciceUsecaseModel[],
      workouts: WorkoutDefUsecaseModel[]
    }
  }>  {
    try {
      await commons.sleep(2);
      const training:any = await this.inversify.graphqlService.send(
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
            }
          }`
        }
      );

      if(training.errors) {
        throw new Error(training.errors[0].message);
      }

      const training_normalized:any = await this.inversify.graphqlService.send(
        {
          operationName: 'training_normalized',
          variables: dto,
          query: `query training_normalized($id: String!) {
            training_normalized (
              dto: {
                id: $id
              }
            ) {
              slugs
              type
              duration
              ite
              weight
            }
          }`
        }
      );

      if(training_normalized.errors) {
        throw new Error(training_normalized.errors[0].message);
      }

      const exercices_request:any = await this.inversify.graphqlService.send(
        {
          operationName: 'exercices',
          variables: dto,
          query: `query exercices($id: String!) {
            exercices (
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

      if(exercices_request.errors) {
        throw new Error(exercices_request.errors[0].message);
      }

      let workouts_slug:string[] = [];

      for(let elt of training_normalized.data.training_normalized) {
        if(!workouts_slug.includes(elt.slugs[0])) {
          workouts_slug.push(elt.slugs[0]);
        }
      }

      const workouts_request:any = await this.inversify.graphqlService.send(
        {
          operationName: 'searchWorkoutsPaginated',
          variables: {
            workouts_slug: workouts_slug
          },
          query: `query searchWorkoutsPaginated($workouts_slug: [String!]!) {
            searchWorkoutsPaginated (
              dto: {
                workouts_slug: $workouts_slug
              }
            ) {
              count
              nodes {
                search
                found {
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
            }
          }`
        }
      );

      if(workouts_request.errors) {
        throw new Error(workouts_request.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: {
          training: training.data.training,
          training_normalized: training_normalized.data.training_normalized,
          exercices: exercices_request.data.exercices,
          workouts: workouts_request.data.searchWorkoutsPaginated.nodes
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
          message: CODES.GET_PREVIEW_FAIL,
          error: e.message
        }
      }
    }
  }
}