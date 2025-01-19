import React from 'react';
import moment from 'moment';
import { Trans } from 'react-i18next';
import { Add } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Grid2, IconButton, Tabs, Tab, TextField, Button } from '@mui/material';

import Header from '@components/Header';
import { CODES } from '@src/commons/codes';
import commons from '@src/commons/commons';
import inversify from '@src/commons/inversify';
import PaginationComponent from '@components/Pagination';
import { contextStore, ContextStoreModel } from '@src/stores/contextStore';
import { TrainingUsecaseModel } from '@usecases/training/model/training.usecase.model';
import { GetTrainingsUsecaseModel } from '@usecases/training/model/get.trainings.usecase.model';

const Trainings: React.FC = () => {
  const navigate = useNavigate();
  const limit = 10;
  const [totalItem, setTotalItem] = React.useState(0);
  const [offset, setOffset] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const context: ContextStoreModel = contextStore();
  const [trainings, setTrainings] = React.useState<{
    public: TrainingUsecaseModel[],
    private: TrainingUsecaseModel[]
  } | null>(null);
  const [trainingsShowed, setTrainingsShowed] = React.useState<TrainingUsecaseModel[] | null>(null);
  const [tabIndex, setTabIndex] = React.useState(0);

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

  const Row = (props: { training: TrainingUsecaseModel }) => {
    const { training } = props;
    const strDate = moment(commons.getTimestampFromObjectId(training.id)).format('DD/MM/YY HH:mm:ss');

    return (
      <Grid2
        container
        sx={{
          marginBottom: '1px',
          "&:hover": {
            backgroundColor: "#606368",
          },
        }}
      >
        {/* For personal */}
        {tabIndex === 0 && (<>
          <Grid2
            size={{
              xs: 8,
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
        </>)}

        {/* For public and private */}
        {tabIndex !== 0 && (<>
          <Grid2
            size={{
              xs: 8,
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
          </Grid2>
          <Grid2
            size={{
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
            title={training.gender}
          >
            <Typography noWrap><Trans>trainings.{training.gender ?? 'woman'}</Trans></Typography>
          </Grid2>
          <Grid2
            size={{
              sm: 2,
              md: 2,
              lg: 2,
              xl: 2,
            }}
            sx={{
              display: { xs: 'none', sm: 'flex' }, // Cacher sur 'xs', afficher en 'flex' à partir de 'sm'
              justifyContent: 'center',
              alignItems: 'center',
            }}
            title={training.gender}
          >
            <Typography noWrap>{strDate}</Typography>
          </Grid2>
        </>)}

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
          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              goTraining(training);
            }}
          >
            <FitnessCenterIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              goPreview(training);
            }}
          >
            <VisibilityIcon />
          </IconButton>
          {training?.contributors?.find(contributor => contributor.id === context.id) &&
            <IconButton
              size="small"
              sx={{
                display: { xs: 'none', md: 'block' },
              }}
              onClick={(e) => {
                e.preventDefault();
                go_training_edit(training);
              }}
            >
              <EditIcon />
            </IconButton>
          }
        </Grid2>
      </Grid2>
    )
  }

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
    content = <Grid2
      container
      sx={{
        marginBottom: '1px',
        "&:hover": {
          backgroundColor: "#606368",
        },
      }}
    >
      <Grid2
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
      </Grid2>
    </Grid2>;
  } else if (qry.error) {
    content = <Grid2
      container
      sx={{
        marginBottom: '1px',
        "&:hover": {
          backgroundColor: "#606368",
        },
      }}
    >
      <Grid2
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
      </Grid2>
    </Grid2>;
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
    <Header />
    <Container>
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

      {/* Champ de recherche */}
      <TextField
        label="Recherche"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
      />

      <Grid2
        container
        sx={{
          color: "#000000",
          fontWeight: "bold",
          backgroundColor: "#EA80FC",
          borderRadius: "5px 5px 0px 0px",
          fontSize: "0.875rem",
        }}
      >
        {/* For personal */}
        {tabIndex === 0 && (
          <>
            <Grid2
              size={{
                xs: 8,
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
              <Trans>trainings.date</Trans>
            </Grid2>
          </>
        )}

        {/* For public and private */}
        {tabIndex !== 0 && (
          <>
            <Grid2
              size={{
                xs: 6,
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
            </Grid2>
            <Grid2
              size={{
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
              <Trans>trainings.gender</Trans>
            </Grid2>
            <Grid2
              size={{
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
            </Grid2>
          </>
        )}

        <Grid2
          size={{
            xs: 2,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2,
          }}
        >
          {/* Empty Grid for spacing or layout */}
        </Grid2>
      </Grid2>

      {trainingsShowed?.map((training) => (
        <Row key={training.id} training={training} />
      ))}

      {content}

      {/* Pagination */}
      {totalItem / limit > 1 && (
        <Grid2
          size={12}
          sx={{ marginBottom: 2 }}
        >
          <PaginationComponent
            totalItems={totalItem}
            limit={limit}
            onPageChange={handlePageChange}
          />
        </Grid2>
      )}

      <Grid2
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
          size="small"
          startIcon={<Add />}
          onClick={(e) => {
            e.preventDefault();
            goCreate();
          }}
        >
          <Trans>common.create</Trans>
        </Button>
      </Grid2>

    </Container>
  </>);
}

export default Trainings;
