import moment from 'moment';
import React, { useEffect } from 'react';
import { Add } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { Trans, useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert, Grid, TextField, IconButton, Button } from '@mui/material'; // Import Material-UI components

import Header from '@components/Header';
import commons from '@src/commons/commons';
import { CODES } from '@src/commons/codes';
import inversify from '@src/commons/inversify';
import PaginationComponent from '@src/components/Pagination';
import { contextStore, ContextStoreModel } from '@src/stores/contextStore';
import { ExerciceUsecaseModel } from '@usecases/exercice/model/exercice.usecase.model';

const Exercices: React.FC = () => {
  const limit = 25;
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const [offset, setOffset] = React.useState(0);
  const context:ContextStoreModel = contextStore();
  const [totalItem, setTotalItem] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [exercices, set_exercices] = React.useState<any[]>([]);
  const [showed, set_showed] = React.useState<ExerciceUsecaseModel[]|null>(null);

  const [qry, setQry] = React.useState<{
    loading: boolean|null,
    data: any,
    error: Error|null
  }>({
    loading: null,
    data: null,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      setQry({ loading: true, data: null, error: null });
      try {
        const result = await inversify.get_exercices_usecase.execute();
        if (result.message !== CODES.SUCCESS) {
          throw new Error(result.message);
        } else if (result.data) {

          set_exercices(result.data);
          setQry({ loading: false, data: result, error: null });
        }
      } catch (err) {
        setQry({ loading: false, data: null, error: err as Error });
      }
    };

    if(qry.loading === null) {
      fetchData();
    } else if(exercices.length > 0) {
      let temps = [...exercices];
      temps = temps.slice().sort(((elt1: ExerciceUsecaseModel, elt2: ExerciceUsecaseModel) => (elt1.slug) < (elt2.slug) ? -1 : 1 ));
      temps = temps.filter(exercice =>
        commons.normalizeString(exercice.slug).includes(commons.normalizeString(searchTerm))
      );
      setTotalItem(temps.length);
      set_showed(temps.slice(offset, offset + limit));
    }
  }, [inversify, exercices, offset, searchTerm]);

  const goView = async (exercice: ExerciceUsecaseModel) => {
    let dto:any = {
      id: exercice.id
    };
    navigate({
      pathname: '/exercice',
      search: createSearchParams(dto).toString()
    });
  }

  const goCreate = async () => {
    navigate({
      pathname: '/exercice_create'
    });
  }

  const go_exercice_edit = async (exercice: ExerciceUsecaseModel) => {
    let dto:any = {
      id: exercice.id
    };
    navigate({
      pathname: '/exercice_edit',
      search: createSearchParams(dto).toString()
    });
  }

  const Row = (props: { exercice: ExerciceUsecaseModel }) => {
    const { exercice } = props;
    const strDate = moment(commons.getTimestampFromObjectId(exercice.id)).format('DD/MM/YY HH:mm:ss');
    const title = exercice.title.find((elt:any) => elt.lang === currentLocale)?.value;
    const description = exercice.description.find((elt:any) => elt.lang === currentLocale)?.value;

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
          xs={2} sm={2} md={2} lg={2} xl={2}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={exercice.slug}
        >
          <Typography noWrap>{exercice.slug}</Typography>
        </Grid>
        <Grid 
          xs={1} sm={1} md={1} lg={1} xl={1}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={exercice?.creator?.code}
        >
          <Typography noWrap>{exercice?.creator?.code}</Typography>
        </Grid>
        <Grid 
          xs={2} sm={2} md={2} lg={2} xl={2}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={strDate}
        >
          <Typography noWrap>{strDate}</Typography>
        </Grid>
        <Grid 
          xs={2} sm={2} md={2} lg={2} xl={2}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={title}
        >
          <Typography noWrap>{title}</Typography>
        </Grid>
        <Grid 
          xs={2} sm={2} md={2} lg={2} xl={2}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={description}
        >
          <Typography noWrap>{description}</Typography>
        </Grid>
        <Grid 
          xs={2} sm={2} md={2} lg={2} xl={2}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={exercice.image}
        >
          <Typography noWrap>{exercice.image}</Typography>
        </Grid>
        <Grid 
          xs={1} sm={1} md={1} lg={1} xl={1}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {/* actions */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              goView(exercice);
            }}
          >
            <VisibilityIcon/>
          </IconButton>
          {exercice?.contributors?.find(contributor => contributor.id === context.id) && 
            <IconButton
              size="small"
              sx={{
                display: { xs: 'none', md: 'block' },
              }}
              onClick={(e) => {
                e.preventDefault();
                go_exercice_edit(exercice);
              }}
            >
              <EditIcon/>
            </IconButton>
          }
        </Grid>
      </Grid>
    )
  }

  // Gérer le changement de page depuis le composant Pagination
  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
  };

  return (<>
    <Header/>
    <Container>
      {/* Box component to center the content vertically and horizontally */}
      <Box 
        display="flex" 
        justifyContent="center" 
        flexDirection="column"
        textAlign="center" // Center text alignment
        marginBottom={"5vh"}
        marginTop={"2vh"}
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
            label="Recherche"
            variant="outlined"
            value={searchTerm}
            onChange={(e:any) => setSearchTerm(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <Box
            sx={{
              color: '#fff',
              padding: 2,
            }}
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
                xs={2} sm={2} md={2} lg={2} xl={2}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Trans>exercices.slug</Trans>
              </Grid>
              <Grid 
                xs={1} sm={1} md={1} lg={1} xl={1}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Trans>exercices.creator</Trans>
              </Grid>
              <Grid 
                xs={2} sm={2} md={2} lg={2} xl={2}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Trans>exercices.creation_date</Trans>
              </Grid>
              <Grid 
                xs={2} sm={2} md={2} lg={2} xl={2}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Trans>exercices.title</Trans>
              </Grid>
              <Grid 
                xs={2} sm={2} md={2} lg={2} xl={2}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                <Trans>exercices.description</Trans>
              </Grid>
              <Grid 
                xs={2} sm={2} md={2} lg={2} xl={2}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                <Trans>exercices.image</Trans>
              </Grid>
              <Grid
                xs={1} sm={1} md={1} lg={1} xl={1}
                item>
              </Grid>
            </Grid>

            {showed?.map((exercice) => (
              <Row key={exercice.id} exercice={exercice} />
            ))}

          </Grid>
        </Box>
        </>)}

        {/* Pagination */}
        {
          (totalItem/limit>1) && (
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <PaginationComponent
                totalItems={totalItem}
                limit={limit}
                onPageChange={handlePageChange}
              />
            </Grid>
          )
        }

        <Grid item xs={12}>
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
          ><Trans>common.create</Trans></Button>
        </Grid>
        
      </Box>
    </Container>
  </>);
}

export default Exercices;
