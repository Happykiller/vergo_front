import ActivityCard from '@components/dashboard/ActivityCard';
import BadgesCard from '@components/dashboard/BadgesCard';
import GamificationCard from '@components/dashboard/GamificationCard';
import RecentTrainingsCard from '@components/dashboard/RecentTrainingsCard';
import { useAsyncTask } from '@hooks/useAsyncTask';
import { Alert, Box } from '@mui/material';
import inversify from '@src/commons/inversify';
import { KpisDashbardUsecaseModel } from '@usecases/dashboard/model/kpis.dashboard.usecase.model';
import React, { useEffect, useState } from 'react';

const Dashboard: React.FC = () => {
  const [datas, setDatas] = useState<KpisDashbardUsecaseModel>();
  const { execute, error } = useAsyncTask();

  useEffect(() => {
    execute(async () => {
      const response = await inversify.getKpisDashboardUsecase.execute();
      if (response.data) setDatas(response.data);
    });
  }, [execute]);

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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <GamificationCard gamification={datas?.gamification} />
        <BadgesCard badges={datas?.badges} />
        <ActivityCard activities={datas?.activities ?? []} volume={datas?.volume} />
        <RecentTrainingsCard sessions={datas?.sessions ?? []} />
      </Box>
    </Box>
  );
};

export default Dashboard;
