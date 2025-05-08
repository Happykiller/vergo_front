import moment from 'moment';
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Container, Typography, Box, CircularProgress, Alert, Grid2, TextField, useTheme } from '@mui/material';

import commons from '@src/commons/commons';
import { CODES } from '@src/commons/codes';
import inversify from '@src/commons/inversify';
import PaginationComponent from '@src/components/Pagination';
import { ExerciceUsecaseModel } from '@usecases/exercice/model/exercice.usecase.model';
import { WorkoutDefUsecaseModel } from '@usecases/workout/model/workout.def.usecase.model';

const Workouts: React.FC = () => {
  const limit = 25;
  const theme = useTheme();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const [offset, setOffset] = React.useState(0);
  const [totalItem, setTotalItem] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [workouts, set_workouts] = React.useState<WorkoutDefUsecaseModel[]>([]);
  const [showed, set_showed] = React.useState<WorkoutDefUsecaseModel[] | null>(null);

  const [qry, setQry] = React.useState<{
    loading: boolean | null,
    data: any,
    error: Error | null
  }>({
    loading: null,
    data: null,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      setQry({ loading: true, data: null, error: null });
      try {
        const result = await inversify.getWorkoutsUsecase.execute();
        if (result.message !== CODES.SUCCESS) {
          throw new Error(result.message);
        } else if (result.data) {

          set_workouts(result.data);
          setQry({ loading: false, data: result, error: null });
        }
      } catch (err) {
        setQry({ loading: false, data: null, error: err as Error });
      }
    };

    if (qry.loading === null) {
      fetchData();
    } else if (workouts.length > 0) {
      let temps = [...workouts];
      temps = temps.slice().sort(((elt1: ExerciceUsecaseModel, elt2: ExerciceUsecaseModel) => (elt1.slug) < (elt2.slug) ? -1 : 1));
      temps = temps.filter(exercice =>
        commons.normalizeString(exercice.slug).includes(commons.normalizeString(searchTerm))
      );
      setTotalItem(temps.length);
      set_showed(temps.slice(offset, offset + limit));
    }
  }, [inversify, workouts, offset, searchTerm]);

  const Row = (props: { exercice: ExerciceUsecaseModel }) => {
    const { exercice } = props;
    const strDate = moment(commons.getTimestampFromObjectId(exercice.id)).format('DD/MM/YY HH:mm:ss');
    const title = exercice.title.find((elt: any) => elt.lang === currentLocale)?.value;
    const description = exercice.description.find((elt: any) => elt.lang === currentLocale)?.value;

    return (
      <Grid2
        container
        sx={{
          mb: '1px',
          px: 2,
          py: 1,
          borderRadius: 0,
          backgroundColor: theme.palette.background.paper,
          '&:hover': {
            backgroundColor: `${theme.palette.primary.main}22`,
          },
        }}
      >
        <Grid2
          size={{
            xs: 2,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2,
          }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          title={exercice.slug}
        >
          <Typography noWrap>{exercice.slug}</Typography>
        </Grid2>
        <Grid2
          size={{
            xs: 2,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2,
          }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          title={strDate}
        >
          <Typography noWrap>{strDate}</Typography>
        </Grid2>
        <Grid2
          size={{
            xs: 3,
            sm: 3,
            md: 3,
            lg: 3,
            xl: 3,
          }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          title={title}
        >
          <Typography noWrap>{title}</Typography>
        </Grid2>
        <Grid2
          size={{
            xs: 4,
            sm: 4,
            md: 4,
            lg: 4,
            xl: 4,
          }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          title={description}
        >
          <Typography noWrap>{description}</Typography>
        </Grid2>
        <Grid2
          size={{
            xs: 1,
            sm: 1,
            md: 1,
            lg: 1,
            xl: 1,
          }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
        </Grid2>
      </Grid2>
    )
  }

  // Gérer le changement de page depuis le composant Pagination
  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
  };

  return (<>
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        px: { xs: 1, sm: 2 },
        background: theme.palette.background.default,
        backgroundImage: theme.palette.gradient,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {/* Box component to center the content vertically and horizontally */}
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', md: '1400px' },
          mx: 'auto',
          px: { xs: 1, sm: 2 },
        }}
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
        {qry.data && (<>
          {/* Champ de recherche */}
          <TextField
            label={<Trans>trainings.search</Trans>}
            variant="outlined"
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
            fullWidth
            sx={{
              mb: 3,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          />

          <Box
            sx={{
              color: '#fff',
              padding: 2,
            }}
          >
            {/* Table */}
            <Grid2
              container
              sx={{
                fontWeight: 600,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderRadius: '10px 10px 0 0',
                px: 2,
                py: 1,
              }}
            >
              <Grid2
                size={{
                  xs: 2,
                  sm: 2,
                  md: 2,
                  lg: 2,
                  xl: 2,
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Trans>workouts.slug</Trans>
              </Grid2>
              <Grid2
                size={{
                  xs: 2,
                  sm: 2,
                  md: 2,
                  lg: 2,
                  xl: 2,
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Trans>workouts.creation_date</Trans>
              </Grid2>
              <Grid2
                size={{
                  xs: 3,
                  sm: 3,
                  md: 3,
                  lg: 3,
                  xl: 3,
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Trans>workouts.title</Trans>
              </Grid2>
              <Grid2
                size={{
                  xs: 4,
                  sm: 4,
                  md: 4,
                  lg: 4,
                  xl: 4,
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Trans>workouts.description</Trans>
              </Grid2>
              <Grid2
                size={{
                  xs: 1,
                  sm: 1,
                  md: 1,
                  lg: 1,
                  xl: 1,
                }}>
              </Grid2>
            </Grid2>

            {showed?.map((exercice) => (
              <Row key={exercice.id} exercice={exercice} />
            ))}
          </Box>
        </>)}

        {/* Pagination */}
        {
          (totalItem / limit > 1) && (
            <Grid2 size={12} sx={{ marginBottom: 2 }}>
              <PaginationComponent
                totalItems={totalItem}
                limit={limit}
                onPageChange={handlePageChange}
              />
            </Grid2>
          )
        }

      </Box>
    </Box>
  </>);
}

export default Workouts;
