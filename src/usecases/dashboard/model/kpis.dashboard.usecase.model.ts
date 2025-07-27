// src\usecases\dashboard\model\kpis.dashboard.usecase.model.ts
import { KpisSessionsDashbardUsecaseModel } from "./kpis.sessions.dashboard.usecase.model";
import { KpisActivitiesDashbardUsecaseModel } from "./kpis.activities.dashboard.usecase.model";

export interface KpisDashbardUsecaseModel {
  sessions: KpisSessionsDashbardUsecaseModel[];
  activities: KpisActivitiesDashbardUsecaseModel[];
}