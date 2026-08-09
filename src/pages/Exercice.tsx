// src\pages\Exercice.tsx
import EditIcon from '@mui/icons-material/Edit';
import { Alert, Box, Card, CardContent, CircularProgress, Grid, IconButton, Paper, Typography, useTheme } from '@mui/material';
import { CODES } from '@src/commons/codes';
import inversify from '@src/commons/inversify';
import ImageFetcher from '@src/components/ImageFetcher';
import { contextStore, ContextStoreModel } from '@stores/contextStore';
import { ExerciceUsecaseModel } from '@usecases/exercice/model/exercice.usecase.model';
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { createSearchParams, useNavigate } from 'react-router-dom';

const Exercice: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id: any = searchParams.get('id');
  const context: ContextStoreModel = contextStore();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;

  const [qry, setQry] = React.useState<{
    loading: boolean | null,
    data: ExerciceUsecaseModel | null,
    error: Error | null
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

    if (qry.loading === null && id !== null) {
      fetchData();
    }
  }, [inversify]);

  const go_exercice_edit = async (exercice: ExerciceUsecaseModel | null) => {
    if (exercice) {
      let dto: any = {
        id: exercice.id
      };
      navigate({
        pathname: '/exercice_edit',
        search: createSearchParams(dto).toString()
      });
    }
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 1000,
          p: { xs: 0, sm: 4 },
          backgroundColor: { xs: 'transparent', sm: theme.palette.background.default },
          boxShadow: {
            xs: 'none',
            sm: `0 0 24px ${theme.palette.primary.main}33,
             0 0 64px ${theme.palette.primary.main}1A,
             inset 0 0 8px rgba(255, 255, 255, 0.02)`,
          },
          border: {
            xs: 'none',
            sm: `1px solid ${theme.palette.primary.main}`,
          },
          borderRadius: `${theme.shape.borderRadius}px`,
          backdropFilter: { xs: 'none', sm: 'blur(2px)' },
        }}
      >
        {/* loading */}
        {qry.loading && (
          <CircularProgress />
        )}

        {/* error */}
        {qry.error && (
          <Alert severity="error" variant="filled">
            <Trans>CODES.FAIL</Trans>
          </Alert>
        )}

        {/* Data */}
        {qry.data && (
          <>
            {/* Titre + Edit bouton */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2
              }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {qry.data.title.find((elt: any) => elt.lang === currentLocale)?.value}
              </Typography>

              {qry.data.contributors?.some(c => c.id === context.id) && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    go_exercice_edit(qry.data);
                  }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>

            {/* Description */}
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {qry.data.description.find((elt: any) => elt.lang === currentLocale)?.value}
            </Typography>

            {/* Grid images */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                { label: 'V1 Man', gender: 'man', v2: false },
                { label: 'V1 Woman', gender: 'woman', v2: false },
                { label: 'V2 Man', gender: 'man', v2: true },
                { label: 'V2 Woman', gender: 'woman', v2: true }
              ].map(({ label, gender, v2 }, idx) => (
                <Grid key={idx} size={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}>
                    <ImageFetcher
                      name={`${gender} ${qry.data?.image}`}
                      width={140}
                      v2={v2}
                    />
                    <Typography variant="caption" sx={{ mt: 1 }}>{label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Métadonnées */}
            <Card variant="outlined" sx={{ backgroundColor: theme.palette.background.paper }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Slug: {qry.data.slug}
                </Typography>
                <Typography color="text.secondary">
                  Img: {qry.data.image}
                </Typography>
              </CardContent>
            </Card>
          </>
        )}
      </Paper>
    </>
  );
}

export default Exercice;
