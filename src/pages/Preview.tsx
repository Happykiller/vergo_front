import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next'; // Import translation hook for i18n
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert, Grid, Badge, Card, CardMedia, CardContent } from '@mui/material'; // Import Material-UI components

import Header from '@components/Header';
import inversify from '@src/commons/inversify';
import { CODES } from '@src/commons/codes';

type GridItem =
  | { _type: 'text'; value: string }
  | { _type: 'badge'; title: string; img: string; ite: number; weight: number };

const itemList: GridItem[] = [
  { _type: 'badge', title: 'Exercice', img: 'https://via.placeholder.com/150', ite: 12, weight: 5 },
  { _type: 'text', value: 'blabla' },
  { _type: 'text', value: 'another text' },
  { _type: 'badge', title: 'Another Exercise', img: 'https://via.placeholder.com/150', ite: 10, weight: 10 },
  // Ajoute d'autres éléments ici...
];

const Preview: React.FC = () => {
  // Use the translation hook to get the translation function
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const training_id = searchParams.get('id');

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
        } else {
          console.log(result)
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
            <Typography variant="h3" fontWeight="bold">
              TITRE
            </Typography>
          </Box>
    
          {/* Chronomètre */}
          <Typography variant="h4" align="center" marginBottom={4}>
            MM:SS
          </Typography>
    
          {/* Grille des éléments */}
          <Grid container spacing={2}>
            {itemList.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                {item._type === 'badge' ? (
                  <Badge badgeContent={`x${item.ite}`} color="primary">
                    <Card sx={{ backgroundColor: '#333' }}>
                      <CardMedia component="img" height="140" image={item.img} alt={item.title} />
                      <CardContent>
                        <Typography variant="h6">{item.title}</Typography>
                        <Typography variant="body2">
                          x{item.ite} {item.weight}kg
                        </Typography>
                      </CardContent>
                    </Card>
                  </Badge>
                ) : (
                  <Box
                    sx={{
                      height: '100%',
                      border: '1px solid #fff',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 2,
                    }}
                  >
                    <Typography variant="body1">{item.value}</Typography>
                  </Box>
                )}
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
