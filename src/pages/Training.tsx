import { Trans } from 'react-i18next';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Box, Typography, Grid, Paper } from '@mui/material'; // Import Material-UI components

import Header from '@components/Header';
import Chrono from '@components/Chrono';
import { CODES } from '@src/commons/codes';
import inversify from '@src/commons/inversify';
import { TrainingUsecaseModel } from '@usecases/training/model/training.usecase.model';
import { ExerciceUsecaseModel } from '@usecases/exercice/model/exercice.usecase.model';

const Training: React.FC = () => {
  let flattenTraining:any = [];
  const [searchParams] = useSearchParams();
  const training_id = searchParams.get('id');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [training, setTraining] = React.useState<TrainingUsecaseModel|null>(null);
  const [exercices, setExercices] = React.useState<ExerciceUsecaseModel[]|null>(null);

  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });

  const flatten = (training: TrainingUsecaseModel): [] => {
    let response:any = [];
    for(const workout of training.workout) {
      for(const set of workout.sets) {
        response = response.concat(flattenSequence(set, workout.slug));
      }
    }

    return response;
  }

  const flattenSequence = (set: any, workout_slug?: string): [] => {
    let response:any = [];
    let label = '';
    for (let i = 0; i < set.rep; i++) {
      if(set.slugs && set.slugs[i]) {
        label = set.slugs[i];
      } else {
        label = '';
      }
      if(set.duration) {
        response.push({
          label,
          workout_slug: workout_slug,
          type: 'effort',
          duration: set.duration
        });
      }
      if(set.sets) {
        for(const seq of set.sets) {
          response = response.concat(flattenSequence(seq, workout_slug));
        }
      }
      if(set.rest) {
        response.push({
          label,
          workout_slug: workout_slug,
          type: 'rest',
          duration: set.rest
        });
      }
    }
    if(set.pause) {
      response.push({
        label,
        workout_slug: workout_slug,
        type: 'pause',
        duration: set.pause
      });
    }
    return response;
  }

  const doThing = (index: number|null) => {
    if (index === null) return <></>;
    const thing = flattenTraining[index];
    return (<>
    <Grid item xs={12}>
        <Paper>
          <Typography variant="h6" align="center">{thing.workout_slug}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h6" align="center">{thing.label}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h6" align="center">{thing.type}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Chrono key={index} duration={thing.duration} onComplete={() => {
          if (flattenTraining[index+1]) {
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
    inversify.getTrainingUsecase.execute({
      id: training_id
    })
      .then((response:{
        message: string,
        error?: string,
        data?: TrainingUsecaseModel
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
    flattenTraining = flatten(training);
    console.log(JSON.stringify(flattenTraining))
    content = <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h6" align="center">{training.slug}</Typography>
        </Paper>
      </Grid>
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
