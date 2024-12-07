// src\pages\Exercice.tsx
import React, { useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useSearchParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Container, Box, CircularProgress, Alert, Typography, Card, CardContent, IconButton, Grid } from '@mui/material';

import Header from '@components/Header';
import { CODES } from '@src/commons/codes';
import ImageFetcher from '@components/Image';
import inversify from '@src/commons/inversify';
import { contextStore, ContextStoreModel } from '@src/stores/contextStore';
import { ExerciceUsecaseModel } from '@usecases/exercice/model/exercice.usecase.model';

const Exercice: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id:any = searchParams.get('id');
  const context:ContextStoreModel = contextStore();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;

  const [qry, setQry] = React.useState<{
    loading: boolean|null,
    data: ExerciceUsecaseModel|null,
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
        const result = await inversify.get_exercice_usecase.execute({
          id
        });
        if (result.message !== CODES.SUCCESS) {
          throw new Error(result.message);
        } else if (result.data) {
          setQry({ loading: false, data: result.data, error: null });
        }
      } catch (err) {
        setQry({ loading: false, data: null, error: err as Error });
      }
    };

    if(qry.loading === null && id !== null) {
      fetchData();
    }
  }, [inversify]);

  const go_exercice_edit = async (exercice: ExerciceUsecaseModel|null) => {
    if (exercice) {
      let dto:any = {
        id: exercice.id
      };
      navigate({
        pathname: '/exercice_edit',
        search: createSearchParams(dto).toString()
      });
    }
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
          <Card sx={{ maxWidth: 345, margin: 'auto', mt: 4 }}>
            {/* Edit icon */}
            {qry.data?.contributors?.find((contributor:any) => contributor.id === context.id) && 
              <IconButton
                size="small"
                sx={{
                  display: { xs: 'none', md: 'block' },
                }}
                onClick={(e) => {
                  e.preventDefault();
                  go_exercice_edit(qry.data);
                }}
              >
                <EditIcon/>
              </IconButton>
            }
            {/* Image de l'exercice */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <ImageFetcher key={qry.data.image + "1"} name={'man ' + qry.data.image} width={100}/>
                V1 Man
              </Grid>
              <Grid item xs={6}>
                <ImageFetcher key={qry.data.image + "2"} name={'woman ' + qry.data.image} width={100}/>
                V1 Woman
              </Grid>
              <Grid item xs={6}>
                <ImageFetcher key={qry.data.image + "3"} name={'man ' + qry.data.image} width={100} v2/>
                V2 Man
              </Grid>
              <Grid item xs={6}>
                <ImageFetcher key={qry.data.image + "4"} name={'woman ' + qry.data.image} width={100} v2/>
                V2 Woman
              </Grid>
            </Grid>

            <Typography color="text.secondary">
              Img:{qry.data.image}
            </Typography>
            
            {/* Contenu de la carte */}
            <CardContent>
              
              {/* Affichage du titre */}
              <Typography variant="h5" component="div">
                {qry.data.title.find((elt:any) => elt.lang === currentLocale)?.value}
              </Typography>

              {/* Affichage du slug */}
              <Box sx={{ mb: 1 }}>
                <Typography color="text.secondary">
                  Slug:{qry.data.slug}
                </Typography>
              </Box>
              
              {/* Affichage de la description */}
              <Typography variant="body2" color="text.secondary">
                {qry.data.description.find((elt:any) => elt.lang === currentLocale)?.value}
              </Typography>
            </CardContent>
          </Card>
        </>)}
      </Box>
    </Container>
  </>);
}

export default Exercice;
