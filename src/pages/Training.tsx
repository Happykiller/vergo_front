import moment from 'moment';
import { Trans } from 'react-i18next';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Box, Typography, Grid } from '@mui/material'; // Import Material-UI components

import Header from '@components/Header';
import Chrono from '@components/Chrono';
import { CODES } from '@src/commons/codes';
import ImageFetcher from '@components/Image';
import inversify from '@src/commons/inversify';
import { TrainingNormalizedUsecaseModel } from '@usecases/training/model/training.normalized.usecase.model';

const Training: React.FC = () => {
  const [searchParams] = useSearchParams();
  const start = moment();
  const training_id = searchParams.get('id');
  const training_slug = searchParams.get('slug');
  const [currentIndex, setCurrentIndex] = useState<number|null>(0);
  const [training, setTraining] = React.useState<TrainingNormalizedUsecaseModel[]|null>(null);

  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });

  let content = <></>;

  const doThing = (index: number|null) => {
    if (index === null || training === null) return <></>;

    const totalDuration = training.reduce((acc, exercise) => acc + exercise.duration, 0);
    // Convertir la durée totale en format MM:SS
    const durationFormatted = moment.utc(totalDuration * 1000).format('mm:ss');
    // Calculer la date et l'heure de fin en ajoutant la durée totale à maintenant
    const endDateTime = start.add(totalDuration, 'seconds').format('HH:mm:ss');

    const thing = training[index];
    let title = `${training_slug} | ${durationFormatted} | ${endDateTime}`;
    let exercice = null;
    if (thing.slugs.length > 1) {
      exercice = '';
      for (let pas = 1; pas < thing.slugs.length; pas++) {
        exercice += `${(pas===1)?'':' | '}${thing.slugs[pas]}`;
      }
    }
    let show = <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
      <Typography variant="h3" align="center" noWrap>{thing.type.toUpperCase()}</Typography>
    </Grid>;
    if (thing.type === 'pause' || thing.type === 'rest') {
      show = <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
        <ImageFetcher name="man-doing-seated.jpg" height={100} title={thing.type}/><Typography variant="h5" align="center" noWrap>{thing.type}</Typography>
      </Grid>;
    }
    let next = <></>;
    if (training[index+1]) {
      let next_exercice;
      if (training[index+1].slugs.length > 1) {
        next_exercice = '';
        for (let pas = 1; pas < training[index+1].slugs.length; pas++) {
          next_exercice += `${(pas===1)?'':' | '}${training[index+1].slugs[pas]}`;
        }
      }
      next = <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
        <Typography variant="h5" align="center" color={'#664FA1'} noWrap>Next: {training[index+1].slugs[0]}{(next_exercice)?` | ${next_exercice}`:''} | {training[index+1].type}</Typography>
      </Grid>
    }
    return (<>
      <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
        <Typography variant="h4" align="center" color={'#664FA1'} noWrap>{title}</Typography>
      </Grid>
      <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
        <Typography variant="h4" align="center" color={'#B59DF7'} noWrap>{thing.slugs[0]}{(exercice)?` | ${exercice}`:''}</Typography>
      </Grid>
      {show}
      <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
        <Chrono key={index} duration={thing.duration} onComplete={() => {
          if (training[index+1]) {
            setTimeout(() => {setCurrentIndex(index+1)}, 100);
          } else {
            setTimeout(() => {setCurrentIndex(null)}, 100);
          }
        }} />
      </Grid>
      {next}
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
      <Typography variant="h2" align="center" color={'#664FA1'} noWrap>FINIIISHHH !!!</Typography>
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
