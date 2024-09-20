import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next'; // Import translation hook for i18n
import { Container, Box, CircularProgress, Alert, Typography, Card, CardMedia, CardContent } from '@mui/material'; // Import Material-UI components
import { useSearchParams } from 'react-router-dom';

import Header from '@components/Header';
import { CODES } from '@src/commons/codes';
import inversify from '@src/commons/inversify';
import { ExerciceUsecaseModel } from '@usecases/exercice/model/exercice.usecase.model';
import ImageFetcher from '../components/Image';

const Exercice: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id:any = searchParams.get('id');
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
            {/* Image de l'exercice */}
            <ImageFetcher key={qry.data.image} name={qry.data.image} height={200}/>
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
