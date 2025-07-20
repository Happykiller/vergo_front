// src\commons\inversify.ts
import { 
  AuthPasskeyUsecase, AuthUsecase, CreatePasskeyUsecase, DeletePasskeyUsecase, 
  GetPasskeyForUserUsecase, GraphqlService, GraphqlServiceFetch, 
  LoggerService, LoggerServiceReal, SessionInfoUsecase, SystemInfoUsecase, UpdPasswordUsecase 
} from '@happykiller/sunny-ui';
import { GetPreviewUsecase } from '@usecases/preview/get.preview.usecase';
import { GetWorkoutsUsecase } from '@usecases/workout/get.workouts.usecase';
import { GraphqlServiceFake } from '@services/graphql/graphql.service.fake';
import { GetTrainingUsecase } from '@usecases/training/getTraining.usecase';
import { GetExerciceUsecase } from '@usecases/exercice/get.exercice.usecase';
import { GetTrainingsUsecase } from '@usecases/training/getTrainings.usecase';
import { GetExercicesUsecase } from '@usecases/exercice/get.exercices.usecase';
import { CreateExerciceUsecase } from '@usecases/exercice/create.exercice.usecase';
import { UpdateExerciceUsecase } from '@usecases/exercice/update.exercice.usecase';
import { UpdateTrainingUsecase } from '@usecases/training/update.training.usecase';
import { CreateTrainingUsecase } from '@usecases/training/create.training.usecase';
import { SaveTrainingStatUsecase } from '@usecases/training/save.training.stat.usecase';
import { BuildPreviewItemsUsecase } from '@usecases/preview/build.preview.items.usecase';
import { GetNormalizedTrainingUsecase } from '@usecases/training/get.normalized.training.usecase';


export class Inversify {
  authUsecase: AuthUsecase;
  loggerService: LoggerService;
  graphqlService: GraphqlService;
  sessionInfo: SessionInfoUsecase;
  getPreviewUsecase: GetPreviewUsecase;
  systemInfoUsecase: SystemInfoUsecase;
  getWorkoutsUsecase: GetWorkoutsUsecase;
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
  update_exercice_usecase: UpdateExerciceUsecase;
  saveTrainingStatUsecase: SaveTrainingStatUsecase;
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
    this.getWorkoutsUsecase = new GetWorkoutsUsecase(this);
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
    this.saveTrainingStatUsecase = new SaveTrainingStatUsecase(this);
    this.getPasskeyForUserUsecase = new GetPasskeyForUserUsecase(this);
    this.getNormalizedTrainingUsecase = new GetNormalizedTrainingUsecase(this);

    // Services
    if (process.env.APP_MODE === 'prod' || process.env.APP_MODE === 'dev') {
      this.graphqlService = new GraphqlServiceFetch(this, {
        apiUrl: process.env.API_URL??'',
        storageName: 'vergo-storage'
      });
    } else {
      this.graphqlService = new GraphqlServiceFake();
    }

  }
}

const inversify = new Inversify();

export default inversify;