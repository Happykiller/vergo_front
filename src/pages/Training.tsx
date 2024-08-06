import { Trans } from 'react-i18next';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Box, Typography, Grid, Paper } from '@mui/material'; // Import Material-UI components

import Header from '@components/Header';
import Chrono from '@components/Chrono';
import { CODES } from '@src/commons/codes';
import inversify from '@src/commons/inversify';
import { ExerciceUsecaseModel } from '@usecases/exercice/model/exercice.usecase.model';
import { TrainingNormalizedUsecaseModel } from '@usecases/training/model/training.normalized.usecase.model';

const Training: React.FC = () => {
  let flattenTraining:any = [];
  const [searchParams] = useSearchParams();
  const training_id = searchParams.get('id');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [training, setTraining] = React.useState<TrainingNormalizedUsecaseModel[]|null>(null);
  const [exercices, setExercices] = React.useState<ExerciceUsecaseModel[]|null>(null);

  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });

  const doThing = (index: number|null) => {
    if (index === null || training === null) return <></>;
    const thing = training[index];
    return (<>
      {thing.slugs?.map((slug) => (
        <Grid item xs={12} key={slug}>
          <Paper>
            <Typography variant="h6" align="center">{slug}</Typography>
          </Paper>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h6" align="center">{thing.type}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Chrono key={index} duration={thing.duration} onComplete={() => {
          if (training[index+1]) {
            setTimeout(() => {setCurrentIndex(index+1)}, 100);
          } else {
            console.log('FIIIIIINIIISHHHHH');
          }
        }} />
      </Grid>
    </>);
  }

  let content = <></>;

  if(qry.loading) {
    content = <Trans>common.loading</Trans>;
  } else if(qry.error) {
    content = <span>{qry.error}</span>;
  } else if (!training && training_id) {
    setQry(qry => ({
      ...qry,
      loading: true
    }));
    inversify.getNormalizedTrainingUsecase.execute({
      id: training_id
    })
      .then((response:{
        message: string,
        error?: string,
        data?: TrainingNormalizedUsecaseModel[]
      }) => {
        if(response.message === CODES.SUCCESS && response.data) {
          setTraining(response.data);
        } else {
          inversify.loggerService.debug(response.error);
          setQry((qry:any) => ({
            ...qry,
            error: response.message
          }));
        }
      })
      .catch((error:any) => {
        setQry((qry:any) => ({
          ...qry,
          error: error.message
        }));
      })
      .finally(() => {
        setQry((qry:any) => ({
          ...qry,
          loading: false
        }));
      });
  } else if (training) {
    content = <Grid container spacing={2} justifyContent="center">
      {doThing(currentIndex)}
    </Grid>;
  }

  return (<>
    <Header/>
    <Container>
      {/* Box component to center the content vertically and horizontally */}
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh" // Minimum height of 80% of the viewport height
        textAlign="center" // Center text alignment
      >
        {content}
      </Box>
    </Container>
  </>);
}

export default Training;
