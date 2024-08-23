import React from 'react';
import { Trans } from 'react-i18next'; // Import translation hook for i18n
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Grid, IconButton } from '@mui/material'; // Import Material-UI components

import Header from '@components/Header';
import { CODES } from '@src/commons/codes';
import inversify from '@src/commons/inversify';
import { TrainingUsecaseModel } from '@usecases/training/model/training.usecase.model';
import moment from 'moment';
import commons from '../commons/commons';

const Trainings: React.FC = () => {
  // Use the translation hook to get the translation function
  const navigate = useNavigate();
  const [trainings, setTrainings] = React.useState<TrainingUsecaseModel[]|null>(null);

  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });

  const goTraining = async (training: TrainingUsecaseModel) => {
    let dto:any = {
      id: training.id,
      slug: training.slug
    };
    if(training.gender) {
      dto.gender = training.gender;
    }
    navigate({
      pathname: '/training',
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
          xs={6} sm={6} md={6} lg={6} xl={6}
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
          xs={2} sm={2} md={2} lg={2} xl={2}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={training.gender}
        >
          <Typography noWrap><Trans>{strDate}</Trans></Typography>
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
        </Grid>
      </Grid>
    )
  }

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
      .then((response:{
        message: string,
        error?: string,
        data?: TrainingUsecaseModel[]
      }) => {
        if(response.message === CODES.SUCCESS && response.data) {
          setTrainings(response.data.slice().sort(((elt1: TrainingUsecaseModel, elt2: TrainingUsecaseModel) => (elt1.label??elt1.slug) < (elt2.label??elt2.slug) ? -1 : 1 )));
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
              xs={6} sm={6} md={6} lg={6} xl={6}
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
              xs={2} sm={2} md={2} lg={2} xl={2}
              item
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Trans>trainings.date</Trans>
            </Grid>
            <Grid
              xs={2} sm={2} md={2} lg={2} xl={2}
              item>
            </Grid>
          </Grid>

          {trainings?.map((training) => (
            <Row key={training.id} training={training} />
          ))}

          {content}

        </Grid>
      </Box>
    </Container>
  </>);
}

export default Trainings;
