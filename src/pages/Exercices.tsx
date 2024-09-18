import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next'; // Import translation hook for i18n
import { Container, Typography, Box, CircularProgress, Alert, Grid, TextField } from '@mui/material'; // Import Material-UI components

import Header from '@components/Header';
import { CODES } from '@src/commons/codes';
import inversify from '@src/commons/inversify';
import { ExerciceUsecaseModel } from '../usecases/exercice/model/exercice.usecase.model';
import moment from 'moment';
import commons from '../commons/commons';

const Exercices: React.FC = () => {
  // Use the translation hook to get the translation function
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const [searchTerm, setSearchTerm] = React.useState('');  // État pour le champ de recherche
  const [exercices, set_exercices] = React.useState<any[]>([]);

  const [qry, setQry] = React.useState<{
    loading: boolean,
    data: any,
    error: Error|null
  }>({
    loading: false,
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
          console.log(result.data)
          set_exercices(result.data);
          setQry({ loading: false, data: result, error: null });
        }
      } catch (err) {
        setQry({ loading: false, data: null, error: err as Error });
      }
    };

    fetchData();
  }, [inversify]);

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
          xs={2} sm={2} md={2} lg={2} xl={2}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {/* actions */}
        </Grid>
      </Grid>
    )
  }

  return (<>
    <Header/>
    <Container>
      {/* Box component to center the content vertically and horizontally */}
      <Box 
        display="flex" 
        justifyContent="center" 
        flexDirection="column"
        minHeight="80vh" // Minimum height of 80% of the viewport height
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
              height: '100vh',
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
                <Trans>trainings.slug</Trans>
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
                xs={2} sm={2} md={2} lg={2} xl={2}
                item>
              </Grid>
            </Grid>

            {exercices?.map((exercice) => (
              <Row key={exercice.id} exercice={exercice} />
            ))}

          </Grid>
        </Box>
        </>)}
      </Box>
    </Container>
  </>);
}

export default Exercices;
