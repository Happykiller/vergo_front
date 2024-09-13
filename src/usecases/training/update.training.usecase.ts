import { CODES } from '@src/commons/codes';
import { Inversify } from '@src/commons/inversify';

export class UpdateTrainingUsecase {

  constructor(
    private inversify:Inversify
  ){}

  async execute(dto: {rawData: string}): Promise<{
    message: string
    error?: string
  }>  {
    try {
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