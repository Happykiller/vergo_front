// src\usecases\dashboard\get.kpis.dashboard.usecase.ts
import { CODES } from '@src/commons/codes';
import { Inversify } from '@src/commons/inversify';

import { KpisDashbardUsecaseModel } from './model/kpis.dashboard.usecase.model';

export class GetKpisDashbardUsecase {

  constructor(
    private inversify: Inversify
  ) { }

  async execute(): Promise<{ message: string, error?: string, data?: KpisDashbardUsecaseModel }> {
    try {
      const kpis: any = await this.inversify.graphqlService.send(
        {
          operationName: 'getUserKpis',
          variables: {},
          query: `query getUserKpis {
            getUserKpis 
            {
              sessions {
                id
                label
                date
                duration
                completed
              }
              activities {
                date
                duration
              }
              volume {
                last15Days {
                  hours
                  minutes
                  sessionsCount
                }
                last30Days {
                  hours
                  minutes
                  sessionsCount
                }
                last90Days {
                  hours
                  minutes
                  sessionsCount
                }
                last6Months {
                  hours
                  minutes
                  sessionsCount
                }
                last1Year {
                  hours
                  minutes
                  sessionsCount
                }
              }
              gamification {
                xp
                level
                levelXp
                levelXpToNext
                levelProgressPct
                league {
                  code
                  minutes
                  threshold
                  nextCode
                  nextThreshold
                }
                weeklyLeague {
                  code
                  minutes
                  threshold
                  nextCode
                  nextThreshold
                }
              }      
              badges {
                code
                earned
                earnedAt
                meta
              }
            }
          }`
        }
      );

      if (kpis.errors) {
        throw new Error(kpis.errors[0].message);
      }

      return {
        message: CODES.SUCCESS,
        data: kpis.data.getUserKpis
      }
    } catch (e: any) {
      if (e.message in CODES) {
        return {
          message: e.message,
          error: e.message
        }
      } else {
        return {
          message: CODES.GET_KPIS_DASHBOARD_FAIL,
          error: e.message
        }
      }
    }
  }
}
