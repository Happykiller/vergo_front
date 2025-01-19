// src\pages\Training.tsx
import moment from 'moment';
import React, { useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import { useSearchParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Container, Box, Typography, useTheme, useMediaQuery, TypographyProps, Tooltip, IconButton, CircularProgress, Grid2 } from '@mui/material';

import Header from '@components/Header';
import Chrono from '@components/Chrono';
import { CODES } from '@src/commons/codes';
import ImageFetcher from '@components/Image';
import inversify from '@src/commons/inversify';
import WakeLockComponent from '@src/components/WakeLock';
import { contextStore, ContextStoreModel } from '@src/stores/contextStore';
import { volatileStore, VolatileStoreModel } from '@src/stores/volatileStore';
import { ExerciceUsecaseModel } from '@usecases/exercice/model/exercice.usecase.model';
import { WorkoutDefUsecaseModel } from '@usecases/workout/model/workout.def.usecase.model';
import { TrainingNormalizedUsecaseModel } from '@usecases/training/model/training.normalized.usecase.model';

const Training: React.FC = () => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const [searchParams] = useSearchParams();
  const training_id = searchParams.get('id');
  let training_gender = searchParams.get('gender');
  training_gender = training_gender??'woman';
  const context:ContextStoreModel = contextStore();
  const [start] = useState<string>(moment().format());
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const volatileContext:VolatileStoreModel = volatileStore();
  const [currentIndex, setCurrentIndex] = useState<number|null>(0);
  const [training, setTraining] = React.useState<{
    training: TrainingNormalizedUsecaseModel[],
    exercices: ExerciceUsecaseModel[],
    workouts: {
      search: string 
      found: WorkoutDefUsecaseModel
    }[]
  }|null>(null);

  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });

  let content = <></>;

  let variant: TypographyProps['variant'];
  if (isXs) {
    variant = 'h6';
  } else if (isMd) {
    variant = 'h4';
  } else {
    variant = 'h5';
  }

  const handleToggle = () => {
    if (volatileContext.fullscreen) {
      // Sortir du mode plein écran
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    } else {
      // Entrer en mode plein écran
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { // Safari
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
      }
    }
    volatileStore.setState({ 
      ... context,
      fullscreen: !volatileContext.fullscreen
    });
  };

  const findExercice = (slug: string) => {
    if (training === null) return {
      slug: slug,
      title: null,
      description: null,
      image: null
    };

    let ex_details;
    const exerciceDetails = training.exercices.find(exercice => slug === exercice.slug);
    if (exerciceDetails) {
      ex_details = {
        slug: slug,
        title: exerciceDetails?.title.find(lang => lang.lang === currentLocale)?.value,
        description: exerciceDetails?.description.find(lang => lang.lang === currentLocale)?.value,
        image: exerciceDetails?.image
      }
    } else {
      ex_details = {
        slug: slug,
        title: null,
        description: null,
        image: null
      };
    }

    return ex_details;
  }

  const doThing = (index: number|null) => {
    if (index === null || training === null) return <></>;

    const totalDuration = training.training.reduce((acc, exercise) => acc + exercise.duration, 0);
    // Convertir la durée totale en format MM:SS
    const durationFormatted = moment.utc(totalDuration * 1000).format('mm:ss');
    // Calculer la date et l'heure de fin en ajoutant la durée totale à maintenant
    const endDateTime = moment(start).add(totalDuration, 'seconds').format('HH:mm:ss');

    const thing = training.training[index];
    const thing_next = training.training[index+1]??null;

    const workout_def:any = training?.workouts.find((workout:any) => workout.search === thing.slugs[0])?.found;
    const title = workout_def?.title.find((elt:any) => elt.lang === currentLocale).value??thing.slugs[0];
    const description = workout_def?.description.find((elt:any) => elt.lang === currentLocale).value;

    /**
     * Exercice block
     */
    let exercice = [];
    let ex_details:any = null;
    let tootips;
    if (thing.slugs.length > 1) {
      exercice = [];
      for (let pas = 1; pas < thing.slugs.length; pas++) {
        const finded = findExercice(thing.slugs[pas]);
        if (!ex_details && finded) {
          ex_details = finded;
          if (thing.type !== 'pause' && thing.type !== 'rest' && ex_details?.description) {
            tootips = <Tooltip title={ex_details.description}>
              <IconButton><InfoIcon/></IconButton>
            </Tooltip>
          }
        } else {
          tootips = null;
        }
        exercice.push(<Typography key={thing.slugs[pas]} variant={variant} align="center" color={'#B59DF7'} noWrap>{(tootips)?tootips:''}{(finded?.title)?finded.title:<Trans>{thing.slugs[pas]}</Trans>}</Typography>);
      }
    }

    /**
     * Block Next
     */
    let next = <></>;
    if (thing_next) {
      let next_exercice = [];
      if (thing_next.slugs.length > 1) {
        next_exercice = [];
        let next_details:any = null;
        for (let pas = 1; pas < thing_next.slugs.length; pas++) {
          const finded = findExercice(thing_next.slugs[pas]);
          if (!next_details && finded) {
            next_details = finded;
          }
          next_exercice.push(<Typography key={finded.slug} variant={variant} align="center" color={'#664FA1'} noWrap>{(finded?.title)?finded.title:<Trans>{thing.slugs[pas]}</Trans>}</Typography>)
        }
        if(thing_next.weight) {
          next_exercice.push(<Typography key='weight' variant={variant} align="center" color={'#664FA1'} noWrap>{thing_next.weight}Kg</Typography>)
        }
      }
      if (thing_next.type === 'effort') {
        next = <Grid2
          size={12}
          sx={{
            p: 1,
            border: 1,
            borderColor: 'grey.300',
            borderRadius: 2,
          }}
        >
          {next_exercice}
        </Grid2>
      } else {
        next = <Grid2
          size={12}
          sx={{
            p: 1,
            border: 1,
            borderColor: 'grey.300',
            borderRadius: 2,
          }}
        >
          <Typography
            variant={variant}
            align="center"
            color="#664FA1"
            noWrap
          >
            <Trans>training.{thing_next.type}</Trans>
          </Typography>
        </Grid2>
      }
    }

    /**
     * Image Block
     */
    let show = <Grid2
      size={12}
      sx={{
        p: 1,
        border: 1,
        borderColor: 'grey.300',
        borderRadius: 2,
      }}
    >
      <Typography
        variant={variant}
        align="center"
        noWrap
      >
        {thing.type.toUpperCase()}
      </Typography>
    </Grid2>;
    if (thing.type === 'pause' || thing.type === 'rest') {
      show = <Grid2
        size={12}
        sx={{
          p: 1,
          border: 1,
          borderColor: 'grey.300',
          borderRadius: 2,
        }}
      >
        <ImageFetcher
          key={`${training_gender}_bhastrika_pranayama`}
          name={`${training_gender}_bhastrika_pranayama`}
          height={200}
          title={thing.type}
        />
      </Grid2>;
    } else {
      const src = training_gender+'_'+((ex_details?.image)?ex_details?.image:ex_details?.slug);
      show = <Grid2
        size={12}
        sx={{
          p: 1,
          border: 1,
          borderColor: 'grey.300',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          {thing.ite ? (
            <Typography variant={variant} align="center" noWrap>
              X{thing.ite}
            </Typography>
          ) : null}
          <ImageFetcher key={src} name={src} height={200} title={thing.type} />
          {thing.weight ? (
            <Typography variant={variant} align="center" noWrap>
              {thing.weight}Kg
            </Typography>
          ) : null}
        </Box>
      </Grid2>;
    }

    return (<>
      <Grid2
        size={12}
        sx={{
          p: 1,
          border: 1,
          borderColor: 'grey.300',
          borderRadius: 2,
        }}
      >
        <Typography variant={variant} align="center" color="#B59DF7" noWrap>
          {description && (
            <Tooltip title={description}>
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          )}
          {title}
        </Typography>
        {(thing.type !== 'pause' && thing.type !== 'rest') ? (
          exercice
        ) : (
          <Typography variant={variant} align="center" color="#B59DF7" noWrap>
            <Trans>training.{thing.type}</Trans>
          </Typography>
        )}
      </Grid2>
      {show}
      <Grid2
        size={12}
        sx={{
          p: 1,
          border: 1,
          borderColor: 'grey.300',
          borderRadius: 2,
        }}
      >
        <Chrono
          key={index}
          duration={thing.duration}
          volume={context.volume}
          onComplete={() => {
            if (training.training[index + 1]) {
              setTimeout(() => {
                setCurrentIndex(index + 1);
              }, 100);
            } else {
              setTimeout(() => {
                setCurrentIndex(null);
              }, 100);
            }
          }}
        />
      </Grid2>
      {next}
      <Grid2
        size={12}
        sx={{
          p: 1,
          border: 1,
          borderColor: 'grey.300',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <WakeLockComponent />
        <Typography
          variant={variant}
          align="center"
          color="#664FA1"
          noWrap
        >
          {`${durationFormatted} | ${endDateTime}`}
        </Typography>
        <IconButton onClick={handleToggle}>
          {volatileContext.fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Grid2>
    </>);
  }

  if(qry.loading) {
    content = <>
      <CircularProgress />
    </>
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
        data?: {
          training: TrainingNormalizedUsecaseModel[],
          exercices: ExerciceUsecaseModel[],
          workouts: {
            search: string 
            found: WorkoutDefUsecaseModel
          }[]
        }
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
    content = <Grid2
      size={12}
      sx={{
        p: 1,
        border: 1,
        borderColor: 'grey.300',
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h2"
        align="center"
        color="#664FA1"
        noWrap
      >
        FINIIISHHH !!!
      </Typography>
    </Grid2>;
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
        <Grid2
          container
          justifyContent="center"
          gap={1}
        >
          {content}
        </Grid2>
      </Box>
    </Container>
  </>);
}

export default Training;
