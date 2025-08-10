// src\usecases\dashboard\model\kpis.dashboard.usecase.model.ts
import { KpisBadgeDashbardUsecaseModel } from "@usecases/dashboard/model/kpis.badge.dashboard.usecase.model";
import { KpisSessionsDashbardUsecaseModel } from "@usecases/dashboard/model/kpis.sessions.dashboard.usecase.model";
import { KpisActivitiesDashbardUsecaseModel } from "@usecases/dashboard/model/kpis.activities.dashboard.usecase.model";
import { KpisGamificationDashbardUsecaseModel } from "@usecases/dashboard/model/kpis.gamification.dashboard.usecase.model";

export interface KpisDashbardUsecaseModel {
  sessions: KpisSessionsDashbardUsecaseModel[];
  activities: KpisActivitiesDashbardUsecaseModel[];
  gamification: KpisGamificationDashbardUsecaseModel;
  badges: KpisBadgeDashbardUsecaseModel[];
}