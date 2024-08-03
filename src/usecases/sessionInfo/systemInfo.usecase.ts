import { CODES } from '@src/commons/codes';
import { Inversify } from '@src/commons/inversify';
import { SessionInfoUsecaseModel } from '@usecases/sessionInfo/model/sessionInfo.usecase.model';

export class SessionInfoUsecase {

  SessionInfo:any;

  constructor(
    private inversify:Inversify
  ){}

  async execute(): Promise<SessionInfoUsecaseModel>  {
    try {
      const response:any = await this.inversify.graphqlService.send(
        {
          operationName: 'getSessionInfo',
          variables: {},
          query: `query getSessionInfo {  
            getSessionInfo {
              access_token
              id
              code
              name_first
              name_last
              description
              mail
              role
            }
          }`
        }
      );

      if(response.errors) {
        throw new Error(response.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: response.data.getSessionInfo
      }
    } catch (e: any) {
      return {
        message: CODES.FAIL,
        error: e.message
      }
    }
  }
}