// src/pages/Dashboard.tsx
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';

import inversify from '@src/commons/inversify';
import { useAsyncTask } from '@hooks/useAsyncTask';
import ActivityCard from '@components/dashboard/ActivityCard';
import GamificationCard from '@components/dashboard/GamificationCard';
import RecentTrainingsCard from '@components/dashboard/RecentTrainingsCard';
import { KpisDashbardUsecaseModel } from '@usecases/dashboard/model/kpis.dashboard.usecase.model';
import BadgesCard from '@components/dashboard/BadgesCard';

const Dashboard: React.FC = () => {
  const [datas, setDatas] = useState<KpisDashbardUsecaseModel>();
  const { execute } = useAsyncTask();

  useEffect(() => {
    execute(async () => {
      const response = await inversify.getKpisDashboardUsecase.execute();
      if (response.data) setDatas(response.data);
    });
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 720 }}>
        {/* Gamification Card */}
        <GamificationCard gamification={datas?.gamification} />
        {/* Badges Card */}
        <BadgesCard badges={datas?.badges} />
        {/* Activity Card */}
        <ActivityCard activities={datas?.activities ?? []} />
        {/* Recent Trainings Card */}
        <RecentTrainingsCard sessions={datas?.sessions ?? []} />
      </Box>
    </Box>
  );
};

export default Dashboard;
