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
  const [searchParams] = useSearchParams();
  const training_id = searchParams.get('id');
  const training_slug = searchParams.get('slug');
  const [currentIndex, setCurrentIndex] = useState<number|null>(0);
  const [training, setTraining] = React.useState<TrainingNormalizedUsecaseModel[]|null>(null);
  const [exercices, setExercices] = React.useState<ExerciceUsecaseModel[]|null>(null);

  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });

  let content = <></>;

  const doThing = (index: number|null) => {
    if (index === null || training === null) return <></>;
    const thing = training[index];
    let title = `${training_slug}${thing.slugs[0]?` | ${thing.slugs[0]}`:''}` ;
    let exercice = null;
    if (thing.slugs.length > 1) {
      exercice = '';
      for (let pas = 1; pas < thing.slugs.length; pas++) {
        exercice += `${(pas===1)?'':' | '}${thing.slugs[pas]}`;
      }
    }
    return (<>
      <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
        <Typography variant="h4" align="center" color={'#664FA1'}>{title}</Typography>
      </Grid>
      {(exercice)&&
        <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
          <Typography variant="h4" align="center" color={'#B59DF7'}>{exercice}</Typography>
        </Grid>
      }
      <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
        <Typography variant="h5" align="center">{thing.type}</Typography>
      </Grid>
      <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
        <Chrono key={index} duration={thing.duration} onComplete={() => {
          if (training[index+1]) {
            setTimeout(() => {setCurrentIndex(index+1)}, 100);
          } else {
            setTimeout(() => {setCurrentIndex(null)}, 100);
          }
        }} />
      </Grid>
    </>);
  }

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
  } else if (training && currentIndex !== null) {
    content = doThing(currentIndex);
  } else if (currentIndex === null) {
    content = <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
      <Typography variant="h2" align="center" color={'#664FA1'}>FINIIISHHH !!!</Typography>
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
        <Grid container justifyContent="center" gap={1}>
          {content}
        </Grid>
      </Box>
    </Container>
  </>);
}

export default Training;
