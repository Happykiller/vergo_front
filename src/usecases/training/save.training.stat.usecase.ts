// src/usecases/training/save.training.stat.usecase.ts
import { CODES } from '@src/commons/codes';
import { Inversify } from '@src/commons/inversify';

export class SaveTrainingStatUsecase {
  constructor(
    private inversify: Inversify
  ) {}

  async execute(dto: {
    training_id: string;
    start: string;
    end: string;
    durationInSeconds: number;
    completed: boolean;
  }): Promise<{
    message: string;
    error?: string;
  }> {
    try {
      const response: any = await this.inversify.graphqlService.send({
        operationName: 'SaveTrainingStat',
        variables: {
          dto,
        },
        query: `mutation SaveTrainingStat($dto: SaveTrainingStatDtoResolver!) {
  training_stat_save(dto: $dto) {
    id
    training_id
    start
    end
    durationInSeconds
    completed
    created_at
    user_id
  }
}`
      });

      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
      };
    } catch (e: any) {
      if (e.message in CODES) {
        return {
          message: e.message,
          error: e.message,
        };
      } else {
        return {
          message: CODES.SAVE_STATS_FAIL,
          error: e.message,
        };
      }
    }
  }
}
