// src\pages\Trainings.tsx
import React from 'react';
import moment from 'moment';
import InboxIcon from '@mui/icons-material/Inbox';
import SearchIcon from '@mui/icons-material/Search';
import { Trans, useTranslation } from 'react-i18next';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Add, ModeEditOutline, OpenInNew } from '@mui/icons-material';
import { Box, Typography, Grid, IconButton, Tabs, Tab, TextField, Button, useTheme, Paper, useMediaQuery } from '@mui/material';

import { CODES } from '@src/commons/codes';
import commons from '@src/commons/commons';
import inversify from '@src/commons/inversify';
import PaginationComponent from '@components/Pagination';
import { contextStore, ContextStoreModel } from '@src/stores/contextStore';
import { TrainingUsecaseModel } from '@usecases/training/model/training.usecase.model';
import { GetTrainingsUsecaseModel } from '@usecases/training/model/get.trainings.usecase.model';

const Trainings: React.FC = () => {
  const limit = 25;
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [offset, setOffset] = React.useState(0);
  const [tabIndex, setTabIndex] = React.useState(0);
  const context: ContextStoreModel = contextStore();
  const [totalItem, setTotalItem] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const [trainings, setTrainings] = React.useState<{
    public: TrainingUsecaseModel[],
    private: TrainingUsecaseModel[]
  } | null>(null);
  const [trainingsShowed, setTrainingsShowed] = React.useState<TrainingUsecaseModel[] | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const [qry, setQry] = React.useState({
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

  const goPreview = async (training: TrainingUsecaseModel) => {
    let dto: any = {
      id: training.id
    };
    navigate({
      pathname: '/preview',
      search: createSearchParams(dto).toString()
    });
  }

  const goCreate = async () => {
    navigate({
      pathname: '/training_create'
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

  const Row = React.memo((props: { training: TrainingUsecaseModel }) => {
    const { training } = props;
    const strDate = moment(commons.getTimestampFromObjectId(training.id)).format('DD/MM/YY HH:mm:ss');

    return (
      <Paper
        elevation={0}
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
        <Grid
          container
          alignItems="center"
          onClick={(e) => {
            if (isXs) {
              e.preventDefault();
              goTraining(training);
            }
          }}
        >
          {/* For personal */}
          {tabIndex === 0 && (<>
            <Grid
              size={{
                xs: 10,
                sm: 8,
                md: 8,
                lg: 8,
                xl: 8,
              }}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              title={training.label ?? training.slug}
            >
              <Typography noWrap>{training.label ?? training.slug}</Typography>
            </Grid>
            <Grid
              size={{
                xs: 0,
                sm: 2,
                md: 2,
                lg: 2,
                xl: 2,
              }}
              sx={{
                display: { xs: 'none', md: 'block' },
                justifyContent: 'center',
                alignItems: 'center',
              }}
              title={strDate}
            >
              <Typography noWrap>{strDate}</Typography>
            </Grid>
          </>)}

          {/* For public and private */}
          {tabIndex !== 0 && (<>
            <Grid
              size={{
                xs: 10,
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
              title={training.label ?? training.slug}
            >
              <Typography noWrap>{training.label ?? training.slug}</Typography>
            </Grid>
            <Grid
              size={{
                xs: 0,
                sm: 2,
                md: 2,
                lg: 2,
                xl: 2,
              }}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
              }}
              title={training.gender}
            >
              <Typography noWrap>{training?.creator?.code}</Typography>
            </Grid>
            <Grid
              size={{
                xs: 0,
                sm: 2,
                md: 2,
                lg: 2,
                xl: 2,
              }}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
              }}
              title={training.gender}
            >
              <Typography noWrap><Trans>trainings.{training.gender ?? 'woman'}</Trans></Typography>
            </Grid>
            <Grid
              size={{
                xs: 0,
                sm: 2,
                md: 2,
                lg: 2,
                xl: 2,
              }}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
              }}
              title={strDate}
            >
              <Typography noWrap>{strDate}</Typography>
            </Grid>
          </>)}

          <Grid
            size={{
              xs: 2,
              sm: 2,
              md: 2,
              lg: 2,
              xl: 2,
            }}
            sx={{
              display: 'flex',
              justifyContent: 'right'
            }}
          >
            {(!isXs) && (
              <IconButton
                size="small"
                title={t('trainings.go_training')}
                sx={{
                  color: (theme) => theme.palette.primary.main,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  goTraining(training);
                }}
              >
                <OpenInNew fontSize="small" />
              </IconButton>
            )}
            <IconButton
              size="small"
              title={t('trainings.go_preview')}
              onClick={(e) => {
                e.preventDefault();
                goPreview(training);
              }}
            >
              <SearchIcon fontSize="small" />
            </IconButton>
            {(!isXs && (training?.contributors?.find(contributor => contributor.id === context.id))) && (
              <IconButton
                size="small"
                title={t('trainings.go_edit')}
                onClick={(e) => {
                  e.preventDefault();
                  go_training_edit(training);
                }}
              >
                <ModeEditOutline fontSize="small" />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </Paper>
    )
  });

  React.useEffect(() => {
    const fetchTrainingsToShow = async () => {
      try {
        if (trainings) {
          let temps = [];
          if (tabIndex === 0) { // personal
            temps = trainings.public.filter(training => training.creator?.id === context.id);
          } else if (tabIndex === 1) { // public
            temps = trainings.public.filter(training => training.creator?.id !== context.id);
          } else { // private
            temps = trainings.private;
          }
          temps = temps.slice().sort(((elt1: TrainingUsecaseModel, elt2: TrainingUsecaseModel) => (elt1.label ?? elt1.slug) < (elt2.label ?? elt2.slug) ? -1 : 1));
          temps = temps.filter(training =>
            commons.normalizeString(training.label ?? training.slug).includes(commons.normalizeString(searchTerm))
          );
          setTotalItem(temps.length);
          setTrainingsShowed(temps.slice(offset, offset + limit));
        }
      } catch (error) {
        console.error("Error fetching trainings", error);
      }
    };

    fetchTrainingsToShow();
  }, [trainings, tabIndex, offset, searchTerm]);

  let content = <></>;

  if (qry.loading) {
    content = <Grid
      container
      sx={{
        marginBottom: '1px',
        "&:hover": {
          backgroundColor: "#606368",
        },
      }}
    >
      <Grid
        size={{
          md: 12,
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography noWrap><Trans>common.loading</Trans></Typography>
      </Grid>
    </Grid>;
  } else if (qry.error) {
    content = <Grid
      container
      sx={{
        marginBottom: '1px',
        "&:hover": {
          backgroundColor: "#606368",
        },
      }}
    >
      <Grid
        size={{
          md: 12,
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography noWrap><Trans>{qry.error}</Trans></Typography>
      </Grid>
    </Grid>;
  } else if (!trainings) {
    setQry(qry => ({
      ...qry,
      loading: true
    }));
    inversify.getTrainingsUsecase.execute()
      .then((response: GetTrainingsUsecaseModel) => {
        if (response.message === CODES.SUCCESS && response.data) {
          setTrainings(response.data);
        } else {
          inversify.loggerService.debug(response.error);
          setQry((qry: any) => ({
            ...qry,
            error: response.message
          }));
        }
      })
      .catch((error: any) => {
        setQry((qry: any) => ({
          ...qry,
          error: error.message
        }));
      })
      .finally(() => {
        setQry((qry: any) => ({
          ...qry,
          loading: false
        }));
      });
  }

  // Gérer le changement de page depuis le composant Pagination
  const handlePageChange = (newOffset: number, newLimit: number) => {
    setOffset(newOffset);
  };

  return (<>
    {/* Box for centering the Tabs */}
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        marginBottom: 2
      }}
    >
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label={<Trans>trainings.personal</Trans>} />
        <Tab label={<Trans>trainings.public</Trans>} />
        <Tab label={<Trans>trainings.private</Trans>} />
      </Tabs>
    </Box>

    {trainingsShowed && trainingsShowed.length > 0 ? (
      <>

        {/* Champ de recherche */}
        <TextField
          label={<Trans>trainings.search</Trans>}
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{
            mb: 3,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
          }}
        />

        <Paper
          elevation={0}
          sx={{
            borderRadius: '10px 10px 0 0',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            px: 2,
            py: 1,
            mb: '1px',
            fontWeight: 600,
          }}
        >
          <Grid container alignItems="center">
            {/* For personal */}
            {tabIndex === 0 && (
              <>
                <Grid
                  size={{
                    xs: 10,
                    sm: 8,
                    md: 8,
                    lg: 8,
                    xl: 8,
                  }}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Trans>trainings.label</Trans>
                </Grid>
                <Grid
                  size={{
                    xs: 0,
                    sm: 2,
                    md: 2,
                    lg: 2,
                    xl: 2,
                  }}
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Trans>trainings.date</Trans>
                </Grid>
              </>
            )}

            {/* For public and private */}
            {tabIndex !== 0 && (
              <>
                <Grid
                  size={{
                    xs: 10,
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
                  <Trans>trainings.label</Trans>
                </Grid>
                <Grid
                  size={{
                    xs: 0,
                    sm: 2,
                    md: 2,
                    lg: 2,
                    xl: 2,
                  }}
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Trans>trainings.creator</Trans>
                </Grid>
                <Grid
                  size={{
                    xs: 0,
                    sm: 2,
                    md: 2,
                    lg: 2,
                    xl: 2,
                  }}
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Trans>trainings.gender</Trans>
                </Grid>
                <Grid
                  size={{
                    xs: 0,
                    sm: 2,
                    md: 2,
                    lg: 2,
                    xl: 2,
                  }}
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Trans>trainings.date</Trans>
                </Grid>
              </>
            )}

            <Grid
              size={{
                xs: 2,
                sm: 2,
                md: 2,
                lg: 2,
                xl: 2,
              }}
            >
              {/* Empty Grid for spacing or layout */}
            </Grid>
          </Grid>
        </Paper>

        {trainingsShowed?.map((training) => (
          <Row key={training.id} training={training} />
        ))}

        {content}

        {/* Pagination */}
        {totalItem / limit > 1 && (
          <Grid
            size={12}
            sx={{ marginBottom: 2 }}
          >
            <PaginationComponent
              totalItems={totalItem}
              limit={limit}
              onPageChange={handlePageChange}
            />
          </Grid>
        )}

      </>
    ) : (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={6}
        sx={{ opacity: 0.6 }}
      >
        <InboxIcon sx={{ fontSize: 64 }} />
        <Typography variant="body1" mt={2}>
          <Trans>trainings.empty</Trans>
        </Typography>
      </Box>
    )}

    <Grid
      size={12}
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {/* Submit button */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        startIcon={<Add />}
        onClick={goCreate}
        sx={{
          mt: 2
        }}
      >
        <Trans>common.create</Trans>
      </Button>
    </Grid>
  </>);
}

export default Trainings;
