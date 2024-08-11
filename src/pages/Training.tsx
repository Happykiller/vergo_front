import moment from 'moment';
import React, { useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import { useSearchParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Container, Box, Typography, Grid, useTheme, useMediaQuery, TypographyProps, Tooltip, IconButton } from '@mui/material'; // Import Material-UI components

import Header from '@components/Header';
import Chrono from '@components/Chrono';
import { CODES } from '@src/commons/codes';
import ImageFetcher from '@components/Image';
import inversify from '@src/commons/inversify';
import { contextStore, ContextStoreModel } from '@src/stores/contextStore';
import { volatileStore, VolatileStoreModel } from '@src/stores/volatileStore';
import { ExerciceUsecaseModel } from '@usecases/exercice/model/exercice.usecase.model';
import { TrainingNormalizedUsecaseModel } from '@usecases/training/model/training.normalized.usecase.model';

const Training: React.FC = () => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const [searchParams] = useSearchParams();
  const training_id = searchParams.get('id');
  const training_slug = searchParams.get('slug');
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
    exercices: ExerciceUsecaseModel[]
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
    variant = 'h5'; // Variante par défaut pour d'autres tailles d'écran
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
      const elem = document.documentElement; // Utilisez l'élément racine du document
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

    /**
     * Header block
     */
    let exercice = null;
    let ex_details:any = null;
    if (thing.slugs.length > 1) {
      exercice = '';
      for (let pas = 1; pas < thing.slugs.length; pas++) {
        const finded = findExercice(thing.slugs[pas]);
        if (!ex_details && finded) {
          ex_details = finded;
        }
        exercice += `${(pas===1)?'':' | '}${(finded?.title)?finded.title:thing.slugs[pas]}`;
      }
      if (thing.type === 'pause' || thing.type === 'rest') {
        exercice = <Trans>training.{thing.type}</Trans>;
      }
    }

    /**
     * Main Block
     */
    let show = <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
      <Typography variant={variant} align="center" noWrap>{thing.type.toUpperCase()}</Typography>
    </Grid>;
    if (thing.type === 'pause' || thing.type === 'rest') {
      show = <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
        <ImageFetcher key={training_gender+"_bhastrika_pranayama"} name={training_gender+"_bhastrika_pranayama"} height={200} title={thing.type}/>
      </Grid>;
    } else {
      const src = training_gender+'_'+((ex_details?.image)?ex_details?.image:ex_details?.slug);
      show = <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
        <ImageFetcher key={src} name={src} height={200} title={thing.type}/>
      </Grid>;
    }

    /**
     * Block Next
     */
    let next = <></>;
    if (training.training[index+1]) {
      let next_exercice;
      if (training.training[index+1].slugs.length > 1) {
        next_exercice = '';
        let next_details:any = null;
        for (let pas = 1; pas < training.training[index+1].slugs.length; pas++) {
          const finded = findExercice(training.training[index+1].slugs[pas]);
          if (!next_details && finded) {
            next_details = finded;
          }
          next_exercice += `${(pas===1)?'':' | '}${(next_details?.title)?next_details.title:training.training[index+1].slugs[pas]}`;
        }
      }
      if (training.training[index+1].type === 'effort') {
        next = <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
          <Typography variant={variant} align="center" color={'#664FA1'} noWrap>{(next_exercice)?`${next_exercice}`:''}</Typography>
        </Grid>
      } else {
        next = <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
          <Typography variant={variant} align="center" color={'#664FA1'} noWrap><Trans>training.{training.training[index+1].type}</Trans></Typography>
        </Grid>
      }
    }

    return (<>
      <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
        <Typography variant={variant} align="center" color={'#664FA1'} noWrap>{training_slug}<IconButton onClick={handleToggle}>
      {volatileContext.fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </IconButton></Typography>
        <Typography variant={variant} align="center" color={'#664FA1'} noWrap>{`${durationFormatted} | ${endDateTime}`}</Typography>
      </Grid>
      <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
        <Typography variant={variant} align="center" color={'#B59DF7'} noWrap>{thing.slugs[0]}</Typography>
        <Typography variant={variant} align="center" color={'#B59DF7'} noWrap>{exercice}{(thing.type !== 'pause' && thing.type !== 'rest' && ex_details?.description)?(
          <Tooltip title={ex_details.description}>
            <IconButton><InfoIcon/></IconButton>
          </Tooltip>
        ):null}
        </Typography>
      </Grid>
      {show}
      <Grid item xs={12} p={1} border={1} borderColor="grey.300" borderRadius={2}>
        <Chrono key={index} duration={thing.duration} onComplete={() => {
          if (training.training[index+1]) {
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
        data?: {
          training: TrainingNormalizedUsecaseModel[],
          exercices: ExerciceUsecaseModel[]
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
