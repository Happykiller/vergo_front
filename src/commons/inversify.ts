import { AuthUsecase } from '@usecases/auth/auth.usecase';
import LoggerService from '@services/logger/logger.service';
import GraphqlService from '@services/graphql/graphql.service';
import { SystemInfoUsecase } from '@usecases/system/systemInfo.usecase';
import { LoggerServiceReal } from '@services/logger/logger.service.real';
import { GraphqlServiceFake } from '@services/graphql/graphql.service.fake';
import { GraphqlServiceFetch } from '@services/graphql/graphql.service.fetch';
import { SessionInfoUsecase } from '@usecases/sessionInfo/systemInfo.usecase';
import { UpdPasswordUsecase } from '@usecases/updPassword/updPassword.usecase';
import { AuthPasskeyUsecase } from '@usecases/authPasskey/authPasskey.usecase';
import { DeletePasskeyUsecase } from '@usecases/deletePasskey/deletePasskey.usecase';
import { CreatePasskeyUsecase } from '@usecases/createPasskey/createPasskey.usecase';
import { GetPasskeyForUserUsecase } from '@usecases/getPasskeyForUser/getPasskeyForUser.usecase';

export class Inversify {
  authUsecase: AuthUsecase;
  loggerService: LoggerService;
  graphqlService: GraphqlService;
  sessionInfo: SessionInfoUsecase;
  systemInfoUsecase: SystemInfoUsecase;
  updPasswordUsecase: UpdPasswordUsecase;
  authPasskeyUsecase: AuthPasskeyUsecase;
  deletePasskeyUsecase: DeletePasskeyUsecase;
  createPasskeyUsecase: CreatePasskeyUsecase;
  getPasskeyForUserUsecase: GetPasskeyForUserUsecase;

  constructor() {
    // Usecases
    this.authUsecase = new AuthUsecase(this);
    this.loggerService = new LoggerServiceReal();
    this.sessionInfo = new SessionInfoUsecase(this);
    this.systemInfoUsecase = new SystemInfoUsecase(this);
    this.updPasswordUsecase = new UpdPasswordUsecase(this);
    this.authPasskeyUsecase = new AuthPasskeyUsecase(this);
    this.deletePasskeyUsecase = new DeletePasskeyUsecase(this);
    this.createPasskeyUsecase = new CreatePasskeyUsecase(this);
    this.getPasskeyForUserUsecase = new GetPasskeyForUserUsecase(this);

    // Services
    if (process.env.APP_MODE === 'prod') {
      this.graphqlService = new GraphqlServiceFetch(this);
    } else if (process.env.APP_MODE === 'dev') {
      this.graphqlService = new GraphqlServiceFetch(this);
    } else {
      this.graphqlService = new GraphqlServiceFake();
    }

  }
}

const inversify = new Inversify();

export default inversify;