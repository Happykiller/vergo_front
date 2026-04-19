// src\usecases\dashboard\model\kpis.sessions.dashboard.usecase.model.ts
export interface KpisSessionsDashbardUsecaseModel {
  id: string;
  label: string;
  date: string;
  duration: number;
  completed: boolean;
}