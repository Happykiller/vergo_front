// src\pages\Training.tsx
import moment from 'moment';
import InfoIcon from '@mui/icons-material/Info';
import { useSearchParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { Typography, useTheme, useMediaQuery, Tooltip, IconButton, CircularProgress, Grid } from '@mui/material';

import commons from '@src/commons/commons';
import { CODES } from '@src/commons/codes';
import inversify from '@src/commons/inversify';
import TrainingCard from '@components/TrainingCard';
import { useFullscreen } from '@hooks/useFullscreen';
import TrainingNext from '@components/training/TrainingNext';
import TrainingTitle from '@components/training/TrainingTitle';
import TrainingImage from '@components/training/TrainingImage';
import TrainingChrono from '@components/training/TrainingChrono';
import TrainingFooter from '@components/training/TrainingFooter';
import TrainingFinish from '@components/training/TrainingFinish';
import { contextStore, ContextStoreModel } from '@stores/contextStore';
import { ExerciceUsecaseModel } from '@usecases/exercice/model/exercice.usecase.model';
import { WorkoutDefUsecaseModel } from '@usecases/workout/model/workout.def.usecase.model';
import { TrainingNormalizedUsecaseModel } from '@usecases/training/model/training.normalized.usecase.model';

const Training: React.FC = () => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const [searchParams] = useSearchParams();
  const training_id = searchParams.get('id');
  const context: ContextStoreModel = contextStore();
  const [start] = useState<string>(moment().format());
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [currentIndex, setCurrentIndex] = useState<number | null>(0);
  const [training, setTraining] = React.useState<{
    training: TrainingNormalizedUsecaseModel[],
    exercices: ExerciceUsecaseModel[],
    workouts: {
      search: string
      found: WorkoutDefUsecaseModel
    }[]
  } | null>(null);

  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });

  let content = <></>;

  const variant = useMemo(() => isXs ? 'h6' : isMd ? 'h4' : 'h5', [isXs, isMd]);
  const training_gender = useMemo(() => searchParams.get('gender') ?? 'woman', [searchParams]);

  useEffect(() => {
    if (!training_id || training) return;

    setQry(q => ({ ...q, loading: true }));
    inversify.getNormalizedTrainingUsecase.execute({ id: training_id })
      .then((response) => {
        if (response.message === CODES.SUCCESS && response.data) {
          setTraining(response.data);
        } else {
          inversify.loggerService.debug(response.error);
          setQry((q: any) => ({ ...q, error: response.message }));
        }
      })
      .catch((error) => {
        setQry(q => ({ ...q, error: error.message }));
      })
      .finally(() => {
        setQry(q => ({ ...q, loading: false }));
      });
  }, [training_id, training]);

  const findExercice = (slug: string) => {
    const exerciceDetails = training?.exercices.find(exercice => slug === exercice.slug);

    return {
      slug,
      title: exerciceDetails?.title.find(lang => lang.lang === currentLocale)?.value ?? null,
      description: exerciceDetails?.description.find(lang => lang.lang === currentLocale)?.value ?? null,
      image: exerciceDetails?.image ?? null,
    };
  };

  const doThing = (index: number | null) => {
    if (index === null || training === null) return <></>;
    const totalDuration = training.training.reduce((acc, exercise) => acc + exercise.duration, 0);
    const durationFormatted = commons.formatDurationFromSeconds(totalDuration);
    const endDateTime = moment(start).add(totalDuration, 'seconds').format('HH:mm:ss');

    const thing = training.training[index];
    const thing_next = training.training[index + 1] ?? null;

    const workout_def: any = training?.workouts.find((workout: any) => workout.search === thing.slugs[0])?.found;
    const title = workout_def?.title.find((elt: any) => elt.lang === currentLocale).value ?? thing.slugs[0];
    const description = workout_def?.description.find((elt: any) => elt.lang === currentLocale).value;

    /**
     * Exercice block
     */
    let exercice = [];
    let ex_details: any = null;
    let tootips;
    if (thing.slugs.length > 1) {
      exercice = [];
      for (let pas = 1; pas < thing.slugs.length; pas++) {
        const finded = findExercice(thing.slugs[pas]);
        if (!ex_details && finded) {
          ex_details = finded;
          if (thing.type !== 'pause' && thing.type !== 'rest' && ex_details?.description) {
            tootips = <Tooltip title={ex_details.description}>
              <IconButton><InfoIcon /></IconButton>
            </Tooltip>
          }
        } else {
          tootips = null;
        }
        exercice.push(<Typography key={thing.slugs[pas]} variant={variant} align="center" noWrap>{(tootips) ? tootips : ''}{(finded?.title) ? finded.title : <Trans>{thing.slugs[pas]}</Trans>}</Typography>);
      }
    }

    /**
     * Block Next
     */
    const nextBlock = thing_next ? (
      <TrainingNext
        type={thing_next.type}
        variant={variant}
        nextTitles={
          thing_next.slugs.slice(1).map((slug, i) => {
            const finded = findExercice(slug);
            return (
              <React.Fragment key={`next-${index}-${slug}-${i}`}>
                <Typography variant={variant} align="center" noWrap>
                  {finded?.title ?? <Trans>{slug}</Trans>}
                </Typography>
                {thing_next.weight && (
                  <Typography variant={variant} align="center" noWrap>
                    {thing_next.weight}Kg
                  </Typography>
                )}
              </React.Fragment>
            );
          })
        }
      />
    ) : <></>;


    /**
     * Image Block
     */
    const imageBlock = (
      <TrainingCard>
        <TrainingImage
          type={thing.type}
          gender={training_gender}
          image={ex_details?.image}
          slug={ex_details?.slug}
          weight={thing.weight}
          ite={thing.ite}
          variant={variant}
        />
      </TrainingCard>
    );

    return (<>
      {/**
       * Block title
       */}
      <TrainingCard
        direction="column"
      >
        <TrainingTitle
          title={title}
          description={description}
          variant={variant}
        />
        {(thing.type !== 'pause' && thing.type !== 'rest') ? (
          exercice
        ) : (
          <Typography variant={variant} align="center" noWrap>
            <Trans>training.{thing.type}</Trans>
          </Typography>
        )}
      </TrainingCard>
      {/**
       * Block Img
       */}
      {imageBlock}
      {/**
       * Block chrono
       */}
      <TrainingCard>
        <TrainingChrono
          index={index}
          duration={thing.duration}
          volume={context.volume}
          hasNext={!!training.training[index + 1]}
          onEnd={() => {
            if (training.training[index + 1]) {
              setCurrentIndex(index + 1);
            } else {
              setCurrentIndex(null);
            }
          }}
        />
      </TrainingCard>
      {/**
       * Block next
       */}
      {nextBlock}
      {/**
       * Block Resume
       */}
      <TrainingCard>
        <TrainingFooter
          variant={variant}
          formattedDuration={durationFormatted}
          endTime={endDateTime}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
        />
      </TrainingCard>
    </>);
  }

  if (qry.loading) {
    content = <>
      <CircularProgress />
    </>
  } else if (qry.error) {
    content = <span>{qry.error}</span>;
  } else if (training && currentIndex !== null) {
    content = doThing(currentIndex);
  } else if (currentIndex === null) {
    content = <TrainingFinish gender={training_gender === 'woman' ? 'female' : 'male'} />;
  }


  return (<Grid container justifyContent="center" gap={1}>
    {content}
  </Grid>);
}

export default Training;
