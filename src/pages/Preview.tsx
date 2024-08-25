import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next'; // Import translation hook for i18n
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert, Grid, Badge, Card, CardMedia, CardContent } from '@mui/material'; // Import Material-UI components

import Header from '@components/Header';
import inversify from '@src/commons/inversify';
import { CODES } from '@src/commons/codes';
import { GridItem } from '@src/usecases/preview/build.preview.items.usecase';
import moment from 'moment';
import ImageFetcher from '@src/components/Image';

const Preview: React.FC = () => {
  // Use the translation hook to get the translation function
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const [searchParams] = useSearchParams();
  const training_id = searchParams.get('id');
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
        {/* Content */}
        {qry.loading && (
          <>
            <CircularProgress />
          </>
        )}

        {qry.error && (
          <Alert severity="error" variant="filled">
            <Trans>CODES.FAIL</Trans>
          </Alert>
        )}

        {qry.data && (
          <Box
          sx={{
            height: '100vh',
            backgroundColor: '#000', // Fond noir
            color: '#fff',
            padding: 2,
          }}
        >
          {/* Titre et icône d'information */}
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
            <Typography variant="h4" fontWeight="bold">
              {qry.data.data.training.label??qry.data.data.training.slug}
            </Typography>
          </Box>
    
          {/* Chronomètre */}
          <Typography variant="h4" align="center" marginBottom={4}>
            {duration}
          </Typography>
    
          {/* Grille des éléments */}
          <Grid container spacing={2}>
            {items.map((item, index) => (
              <Grid item xs={4} sm={3} md={2} key={index}>
                {item.serie!==1 ? 
                  <Badge badgeContent={`x${item.serie}`} color="primary">
                    <Card sx={{ backgroundColor: '#333' }}>
                      <ImageFetcher name={item.img} height={100} width={100}/>
                      <CardContent>
                        <Typography>{item.title}</Typography>
                        <Typography variant="body2" >
                          {item.ite?`X${item.ite}`:''}  {item.weight?`${item.weight}kg`:''}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Badge>
                  :
                  <Card sx={{ backgroundColor: '#333' }}>
                    <ImageFetcher name={item.img} height={100} width={100}/>
                    <CardContent>
                      <Typography >{item.title}</Typography>
                      <Typography variant="body2" >
                        {item.ite?`X${item.ite}`:''} {item.weight?`${item.weight}kg`:''}
                      </Typography>
                    </CardContent>
                  </Card>
                }
              </Grid>
            ))}
          </Grid>
        </Box>
        )}
      </Box>
    </Container>
  </>);
}

export default Preview;
