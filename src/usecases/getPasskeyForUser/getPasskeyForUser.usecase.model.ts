import { PasskeyUsecaseModel } from '@usecases/model/passkey.usecase.model';

export interface GetPasskeyForUserUsecaseModel {
  message: string;
  data?: PasskeyUsecaseModel[],
  error?: string;
}