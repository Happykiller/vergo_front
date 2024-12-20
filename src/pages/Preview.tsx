// src\pages\Preview.tsx
import moment from 'moment';
import React, { useEffect } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import { Trans, useTranslation } from 'react-i18next';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert, Grid, Badge, Card, CardContent, IconButton, Tooltip, Divider } from '@mui/material'; // Import Material-UI components

import Header from '@components/Header';
import { CODES } from '@src/commons/codes';
import ImageFetcher from '@components/Image';
import inversify from '@src/commons/inversify';
import ExerciseCard from '@components/ExerciseCard';
import LargeIconButton from '@components/LargeIconButton';
import { GridItem } from '@usecases/preview/build.preview.items.usecase';
import { contextStore, ContextStoreModel } from '@src/stores/contextStore';
import { TrainingUsecaseModel } from '@usecases/training/model/training.usecase.model';

const Preview: React.FC = () => {
  let old_workout_slug = '';
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const currentLocale = i18n.language;
  const [searchParams] = useSearchParams();
  const training_id = searchParams.get('id');
  const context:ContextStoreModel = contextStore();
  const [items, setItems] = React.useState<GridItem[]>([]);
  const [duration, setDuration] = React.useState("MM:SS");

  const [qry, setQry] = React.useState<{
    loading: boolean,
    data: any,
    error: Error|null
  }>({
    loading: false,
    data: null,
    error: null
  });

  const goTraining = async (training: TrainingUsecaseModel) => {
    let dto:any = {
      id: training.id
    };
    if(training.gender) {
      dto.gender = training.gender;
    }
    navigate({
      pathname: '/training',
      search: createSearchParams(dto).toString()
    });
  }

  const go_training_edit = async (training: TrainingUsecaseModel) => {
    let dto:any = {
      id: training.id
    };
    navigate({
      pathname: '/training_edit',
      search: createSearchParams(dto).toString()
    });
  }

  const go_exercice = async (exercice_id?: string) => {
    if(exercice_id) {
      let dto:any = {
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
        const result = await inversify.getPreviewUsecase.execute({id: training_id});
        if (result.message !== CODES.SUCCESS) {
          throw new Error(result.message);
        } else if (result.data) {
          const totalDuration = result.data.training_normalized.reduce((acc, exercise) => acc + exercise.duration, 0);
          // Convertir la durée totale en format MM:SS
          const durationFormatted = moment.utc(totalDuration * 1000).format('mm:ss');
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
        {/* loading */}
        {qry.loading && (
          <>
            <CircularProgress />
          </>
        )}

        {/* error */}
        {qry.error && (
          <Alert severity="error" variant="filled">
            <Trans>CODES.FAIL</Trans>
          </Alert>
        )}

        {/* data */}
        {qry.data && (
          <Box
            sx={{
              height: '100vh',
              color: '#fff',
              padding: 2,
            }}
        >
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center"
          >
            {/* Titre */}
            <Typography variant="h4" fontWeight="bold">
              {qry.data.data.training.label??qry.data.data.training.slug}
            </Typography>
    
            {/* Chronomètre */}
            <Typography variant="h4">
              {duration}
            </Typography>

            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              gap={2} // Adds spacing between buttons
            >
              {/* Bt Go Training */}
              <LargeIconButton
                onClick={(e) => {
                  e.preventDefault();
                  goTraining(qry.data.data.training);
                }}
              >
                <PlayCircleOutlineIcon/>
              </LargeIconButton>
              {/* Bt Go edit training */}
              {qry.data.data.training?.contributors?.find((contributor:any) => contributor.id === context.id) && 
                <IconButton
                  size="small"
                  sx={{
                    display: { xs: 'none', md: 'block' },
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    go_training_edit(qry.data.data.training);
                  }}
                >
                  <EditIcon/>
                </IconButton>
              }
            </Box>
          </Box>
    
          {/* Grille des éléments */}
          <Grid 
            container 
            spacing={2}
          >
            {items.map((item, index) => {
              let divider = null;
              if (item.workout_slug && old_workout_slug !== item.workout_slug) {
                /**
                 * Block Workout
                 */
                const ex = qry.data?.data?.workouts.find((workout:any) => workout.search === item.workout_slug)?.found;
                const title = ex?.title.find((elt:any) => elt.lang === currentLocale).value??item.workout_slug;
                const description = ex?.description.find((elt:any) => elt.lang === currentLocale).value;
                divider = (
                  <Grid item xs={12}>
                    <Typography>
                      {ex && (
                          <IconButton><EditIcon/></IconButton>
                        )
                      }
                      {description && (
                          <Tooltip title={description}>
                            <IconButton><InfoIcon/></IconButton>
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
                <Grid item xs={4} sm={3} md={2}>
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
        </Box>
        )}
      </Box>
    </Container>
  </>);
}

export default Preview;
