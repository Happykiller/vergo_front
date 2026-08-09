// src\pages\Preview.tsx
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { InfoOutlined, ModeEditOutlineOutlined } from '@mui/icons-material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Typography, Box, CircularProgress, Alert, Grid, IconButton, Tooltip, Divider } from '@mui/material';

import commons from '@src/commons/commons';
import { CODES } from '@src/commons/codes';
import inversify from '@src/commons/inversify';
import ExerciseCard from '@components/ExerciseCard';
import LargeIconButton from '@components/LargeIconButton';
import { GridItem } from '@usecases/preview/build.preview.items.usecase';
import { contextStore, ContextStoreModel } from '@src/stores/contextStore';
import { TrainingUsecaseModel } from '@usecases/training/model/training.usecase.model';

const Preview: React.FC = () => {
  let old_workout_slug = '';
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const [searchParams] = useSearchParams();
  const training_id = searchParams.get('id');
  const context: ContextStoreModel = contextStore();
  const [items, setItems] = React.useState<GridItem[]>([]);
  const [duration, setDuration] = React.useState("MM:SS");

  const [qry, setQry] = React.useState<{
    loading: boolean,
    data: any,
    error: Error | null
  }>({
    loading: false,
    data: null,
    error: null
  });

  const goTraining = async (training: TrainingUsecaseModel) => {
    let dto: any = {
      id: training.id
    };
    if (training.gender) {
      dto.gender = training.gender;
    }
    navigate({
      pathname: '/training',
      search: createSearchParams(dto).toString()
    });
  }

  const go_training_edit = async (training: TrainingUsecaseModel) => {
    let dto: any = {
      id: training.id
    };
    navigate({
      pathname: '/training_edit',
      search: createSearchParams(dto).toString()
    });
  }

  const go_exercice = async (exercice_id?: string) => {
    if (exercice_id) {
      let dto: any = {
        id: exercice_id
      };
      navigate({
        pathname: '/exercice',
        search: createSearchParams(dto).toString()
      });
    }
  }

  useEffect(() => {
    const fetchData = async (training_id: string) => {
      setQry({ loading: true, data: null, error: null });
      try {
        const result = await inversify.getPreviewUsecase.execute({ id: training_id });
        if (result.message !== CODES.SUCCESS) {
          throw new Error(result.message);
        } else if (result.data) {
          const totalDuration = result.data.training_normalized.reduce((acc, exercise) => acc + exercise.duration, 0);
          const durationFormatted = commons.formatDurationFromSeconds(totalDuration);
          setDuration(durationFormatted);
          setItems(inversify.buildPreviewItemsUsecase.execute({
            ...result.data,
            locale: currentLocale
          }));
          setQry({ loading: false, data: result, error: null });
        }
      } catch (err) {
        setQry({ loading: false, data: null, error: err as Error });
      }
    };

    if (training_id) {
      fetchData(training_id);
    }
  }, [inversify]);

  return (
    <>
      {/* loading */}
      {qry.loading && (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
          <CircularProgress />
        </Box>
      )}

      {/* error */}
      {qry.error && (
        <Alert severity="error" variant="filled">
          <Trans>CODES.FAIL</Trans>
        </Alert>
      )}

      {/* data */}
      {qry.data && (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
            {/* Titre */}
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {qry.data.data.training.label ?? qry.data.data.training.slug}
            </Typography>

            {/* Chronomètre */}
            <Typography variant="h4">
              {duration}
            </Typography>

            <Box
              sx={{
                gap: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {/* Bt Go Training */}
              <LargeIconButton
                onClick={(e) => {
                  e.preventDefault();
                  goTraining(qry.data.data.training);
                }}
              >
                <PlayCircleOutlineIcon />
              </LargeIconButton>
              {/* Bt Go edit training */}
              {qry.data.data.training?.contributors?.find((contributor: any) => contributor.id === context.id) &&
                <IconButton
                  size="small"
                  title={t('trainings.go_edit')}
                  sx={{
                    display: { xs: 'none', md: 'block' },
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    go_training_edit(qry.data.data.training);
                  }}
                >
                  <ModeEditOutlineOutlined fontSize="small" />
                </IconButton>
              }
            </Box>
          </Box>

          {/* Grille des éléments */}
          <Grid
            container
            spacing={2}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {items.map((item, index) => {
              let divider = null;
              if (item.workout_slug && old_workout_slug !== item.workout_slug) {
                /**
                 * Block Workout
                 */
                const ex = qry.data?.data?.workouts.find((workout: any) => workout.search === item.workout_slug)?.found;
                const title = ex?.title.find((elt: any) => elt.lang === currentLocale).value ?? item.workout_slug;
                const description = ex?.description.find((elt: any) => elt.lang === currentLocale).value;
                divider = (
                  <Grid size={12}>
                    <Typography variant="h4">
                      {ex && (
                        <IconButton
                          size="small"
                          title={t('trainings.go_edit')}><ModeEditOutlineOutlined fontSize="small" /></IconButton>
                      )
                      }
                      {description && (
                        <Tooltip title={description}>
                          <IconButton><InfoOutlined fontSize="small" /></IconButton>
                        </Tooltip>
                      )
                      }
                      {title}
                    </Typography>
                    <Divider />
                  </Grid>)
                old_workout_slug = item.workout_slug;
              }

              return <React.Fragment key={index}>
                {divider}
                <Grid
                  size={{
                    xs: 4,
                    sm: 3,
                    md: 2,
                  }}
                >
                  <ExerciseCard
                    exercice_id={item.exercice_id}
                    title={item.title}
                    description={item.description}
                    serie={item.serie}
                    ite={item.ite}
                    weight={item.weight}
                    duration={item.duration}
                    rest={item.rest}
                    pause={item.pause}
                    gender={qry.data.data.training.gender ?? 'woman'}
                    img={item.img}
                    onEditClick={go_exercice}
                  />
                </Grid>
              </React.Fragment>
            })
            }
          </Grid>
        </>
      )}
    </>
  );
}

export default Preview;
