import React from 'react';
import moment from 'moment';
import { Trans } from 'react-i18next'; // Import translation hook for i18n
import VisibilityIcon from '@mui/icons-material/Visibility';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Grid, IconButton, Tabs, Tab, TextField } from '@mui/material'; // Import Material-UI components

import Header from '@components/Header';
import { CODES } from '@src/commons/codes';
import commons from '@src/commons/commons';
import inversify from '@src/commons/inversify';
import PaginationComponent from '@components/Pagination';
import { TrainingUsecaseModel } from '@usecases/training/model/training.usecase.model';
import { GetTrainingsUsecaseModel } from '@usecases/training/model/get.trainings.usecase.model';

const Trainings: React.FC = () => {
  // Use the translation hook to get the translation function
  const navigate = useNavigate();
  const limit = 10;  // Par exemple, 10 éléments par page
  const [totalItem, setTotalItem] = React.useState(0);
  const [offset, setOffset] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');  // État pour le champ de recherche
  const [trainings, setTrainings] = React.useState<{
    public: TrainingUsecaseModel[],
    private:TrainingUsecaseModel[]
  }|null>(null);
  const [trainingsShowed, setTrainingsShowed] = React.useState<TrainingUsecaseModel[]|null>(null);
  const [tabIndex, setTabIndex] = React.useState(0); // State for tabs

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const [qry, setQry] = React.useState({
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

  const goPreview = async (training: TrainingUsecaseModel) => {
    let dto:any = {
      id: training.id
    };
    navigate({
      pathname: '/preview',
      search: createSearchParams(dto).toString()
    });
  }

  const Row = (props: { training: TrainingUsecaseModel }) => {
    const { training } = props;
    const strDate = moment(commons.getTimestampFromObjectId(training.id)).format('DD/MM/YY HH:mm:ss');

    return (
      <Grid
        container
        sx={{
          marginBottom:'1px',
          "&:hover": {
            backgroundColor: "#606368"
          }
        }}
      >
        <Grid 
          xs={8} sm={6} md={6} lg={6} xl={6}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={training.label??training.slug}
        >
          <Typography noWrap>{training.label??training.slug}</Typography>
        </Grid>
        <Grid 
          xs={2} sm={2} md={2} lg={2} xl={2}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={training.gender}
        >
          <Typography noWrap><Trans>trainings.{training.gender??'woman'}</Trans></Typography>
        </Grid>
        <Grid 
          sm={2} md={2} lg={2} xl={2}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={training.gender}
          sx={{
            display: { xs: 'none', sm: 'block' }
          }}
        >
          <Typography noWrap>{strDate}</Typography>
        </Grid>
        <Grid 
          xs={2} sm={2} md={2} lg={2} xl={2}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              goTraining(training);
            }}
          >
            <FitnessCenterIcon/>
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              goPreview(training);
            }}
          >
            <VisibilityIcon/>
          </IconButton>
        </Grid>
      </Grid>
    )
  }

  // Fonction pour normaliser les chaînes (supprimer les accents et rendre insensible à la casse)
  const normalizeString = (str: string) => {
    return str
      .toLowerCase() // Mettre en minuscule
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9]/g, ''); // Supprimer les caractères spéciaux
  };

  React.useEffect(() => {
    const fetchTrainingsToShow = async () => {
      try {
        if(trainings) {
          let temps = [];
          if (tabIndex === 0) {
            temps = trainings.public;
          } else {
            temps = trainings.private;
          }
          temps = temps.slice().sort(((elt1: TrainingUsecaseModel, elt2: TrainingUsecaseModel) => (elt1.label??elt1.slug) < (elt2.label??elt2.slug) ? -1 : 1 ));
          temps = temps.filter(training =>
            normalizeString(training.label??training.slug).includes(normalizeString(searchTerm))
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

  if(qry.loading) {
    content = <Grid
    container
    sx={{
      marginBottom:'1px',
      "&:hover": {
        backgroundColor: "#606368"
      }
    }}
  >
    <Grid 
      md={12}
      item
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Typography noWrap><Trans>common.loading</Trans></Typography>
    </Grid>
  </Grid>;
  } else if(qry.error) {
    content = <Grid
      container
      sx={{
        marginBottom:'1px',
        "&:hover": {
          backgroundColor: "#606368"
        }
      }}
    >
      <Grid 
        md={12}
        item
        display="flex"
        justifyContent="center"
        alignItems="center"
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
      .then((response:GetTrainingsUsecaseModel) => {
        if(response.message === CODES.SUCCESS && response.data) {
          setTrainings(response.data);
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
  }

  // Gérer le changement de page depuis le composant Pagination
  const handlePageChange = (newOffset: number, newLimit: number) => {
    setOffset(newOffset);
    // Vous pouvez aussi faire d'autres actions comme recharger les données
    console.log(`Offset: ${newOffset}, Limit: ${newLimit}`);
  };
  
  return (<>
    <Header/>
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
      
      {/* Box component to center the content vertically and horizontally */}
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        textAlign="center" // Center text alignment
      >
        {/* Table */}
        <Grid
          container
        >
          <Grid
            container
            sx={{
              color: "#000000",
              fontWeight: "bold",
              backgroundColor: "#EA80FC",
              borderRadius: "5px 5px 0px 0px",
              fontSize: "0.875rem"
            }}
          >
            <Grid 
              xs={8} sm={6} md={6} lg={6} xl={6}
              item
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Trans>trainings.label</Trans>
            </Grid>
            <Grid 
              xs={2} sm={2} md={2} lg={2} xl={2}
              item
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Trans>trainings.gender</Trans>
            </Grid>
            <Grid 
              sm={2} md={2} lg={2} xl={2}
              item
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                display: { xs: 'none', sm: 'block' }
              }}
            >
              <Trans>trainings.date</Trans>
            </Grid>
            <Grid
              xs={2} sm={2} md={2} lg={2} xl={2}
              item>
            </Grid>
          </Grid>

          {trainingsShowed?.map((training) => (
            <Row key={training.id} training={training} />
          ))}

          {content}

        </Grid>
      </Box>
      {/* Pagination */}
      {
        (totalItem/limit>1) && (
          <PaginationComponent
            totalItems={totalItem}
            limit={limit}
            onPageChange={handlePageChange}
          />
        )
      }
      
    </Container>
  </>);
}

export default Trainings;
