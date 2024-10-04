import { AuthUsecase } from '@usecases/auth/auth.usecase';
import LoggerService from '@services/logger/logger.service';
import GraphqlService from '@services/graphql/graphql.service';
import { SystemInfoUsecase } from '@usecases/system/systemInfo.usecase';
import { LoggerServiceReal } from '@services/logger/logger.service.real';
import { GetPreviewUsecase } from '@usecases/preview/get.preview.usecase';
import { GraphqlServiceFake } from '@services/graphql/graphql.service.fake';
import { GetTrainingUsecase } from '@usecases/training/getTraining.usecase';
import { GetExerciceUsecase } from '@usecases/exercice/get.exercice.usecase';
import { GetTrainingsUsecase } from '@usecases/training/getTrainings.usecase';
import { GraphqlServiceFetch } from '@services/graphql/graphql.service.fetch';
import { SessionInfoUsecase } from '@usecases/sessionInfo/systemInfo.usecase';
import { UpdPasswordUsecase } from '@usecases/updPassword/updPassword.usecase';
import { GetExercicesUsecase } from '@usecases/exercice/get.exercices.usecase';
import { AuthPasskeyUsecase } from '@usecases/authPasskey/authPasskey.usecase';
import { CreateExerciceUsecase } from '@usecases/exercice/create.exercice.usecase';
import { UpdateExerciceUsecase } from '@usecases/exercice/update.exercice.usecase';
import { UpdateTrainingUsecase } from '@usecases/training/update.training.usecase';
import { CreateTrainingUsecase } from '@usecases/training/create.training.usecase';
import { DeletePasskeyUsecase } from '@usecases/deletePasskey/deletePasskey.usecase';
import { CreatePasskeyUsecase } from '@usecases/createPasskey/createPasskey.usecase';
import { BuildPreviewItemsUsecase } from '@usecases/preview/build.preview.items.usecase';
import { GetPasskeyForUserUsecase } from '@usecases/getPasskeyForUser/getPasskeyForUser.usecase';
import { GetNormalizedTrainingUsecase } from '@usecases/training/get.normalized.training.usecase';

export class Inversify {
  authUsecase: AuthUsecase;
  loggerService: LoggerService;
  graphqlService: GraphqlService;
  sessionInfo: SessionInfoUsecase;
  getPreviewUsecase: GetPreviewUsecase;
  systemInfoUsecase: SystemInfoUsecase;
  updPasswordUsecase: UpdPasswordUsecase;
  authPasskeyUsecase: AuthPasskeyUsecase;
  getTrainingUsecase: GetTrainingUsecase;
  getTrainingsUsecase: GetTrainingsUsecase;
  get_exercice_usecase: GetExerciceUsecase;
  get_exercices_usecase: GetExercicesUsecase;
  updateTraingUsecase: UpdateTrainingUsecase;
  deletePasskeyUsecase: DeletePasskeyUsecase;
  createPasskeyUsecase: CreatePasskeyUsecase;
  createTrainingUsecase: CreateTrainingUsecase;
  createExerciceUsecase: CreateExerciceUsecase;
  update_exercice_usecase : UpdateExerciceUsecase;
  buildPreviewItemsUsecase: BuildPreviewItemsUsecase;
  getPasskeyForUserUsecase: GetPasskeyForUserUsecase;
  getNormalizedTrainingUsecase: GetNormalizedTrainingUsecase;

  constructor() {
    // Usecases
    this.authUsecase = new AuthUsecase(this);
    this.loggerService = new LoggerServiceReal();
    this.sessionInfo = new SessionInfoUsecase(this);
    this.getPreviewUsecase = new GetPreviewUsecase(this);
    this.systemInfoUsecase = new SystemInfoUsecase(this);
    this.updPasswordUsecase = new UpdPasswordUsecase(this);
    this.authPasskeyUsecase = new AuthPasskeyUsecase(this);
    this.getTrainingUsecase = new GetTrainingUsecase(this);
    this.getTrainingsUsecase = new GetTrainingsUsecase(this);
    this.get_exercice_usecase = new GetExerciceUsecase(this);
    this.updateTraingUsecase = new UpdateTrainingUsecase(this);
    this.deletePasskeyUsecase = new DeletePasskeyUsecase(this);
    this.createPasskeyUsecase = new CreatePasskeyUsecase(this);
    this.get_exercices_usecase = new GetExercicesUsecase(this);
    this.createExerciceUsecase = new CreateExerciceUsecase(this);
    this.createTrainingUsecase = new CreateTrainingUsecase(this);
    this.update_exercice_usecase = new UpdateExerciceUsecase(this);
    this.buildPreviewItemsUsecase = new BuildPreviewItemsUsecase();
    this.getPasskeyForUserUsecase = new GetPasskeyForUserUsecase(this);
    this.getNormalizedTrainingUsecase = new GetNormalizedTrainingUsecase(this);

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