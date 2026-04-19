export interface KpisVolumePeriodDashbardUsecaseModel {
  hours: number;
  minutes: number;
  sessionsCount: number;
}

export interface KpisVolumeDashbardUsecaseModel {
  last15Days: KpisVolumePeriodDashbardUsecaseModel;
  last30Days: KpisVolumePeriodDashbardUsecaseModel;
  last90Days: KpisVolumePeriodDashbardUsecaseModel;
  last6Months: KpisVolumePeriodDashbardUsecaseModel;
  last1Year: KpisVolumePeriodDashbardUsecaseModel;
}
