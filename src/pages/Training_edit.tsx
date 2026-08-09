import { useFlashStore } from '@happykiller/sunny-ui';
import DoneIcon from '@mui/icons-material/Done';
import { Alert,Box, Button, CircularProgress, Container, Grid, TextField, Typography } from '@mui/material';
import { CODES } from '@src/commons/codes';
import inversify from '@src/commons/inversify';
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const Training_edit: React.FC = () => {
  const flash = useFlashStore();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const training_id = searchParams.get('id');
  const [data, setData] = React.useState<any>(null);
  const [rawData, setRawData] = React.useState<any>('');

  const [qry, setQry] = React.useState<{
    loading: boolean,
    data: any,
    error: Error | null
  }>({
    loading: false,
    data: null,
    error: null
  });

  useEffect(() => {
    const fetchData = async (training_id: string) => {
      setQry({ loading: true, data: null, error: null });
      try {
        const result = await inversify.getTrainingUsecase.execute({ id: training_id });
        if (result.message !== CODES.SUCCESS) {
          throw new Error(result.message);
        } else if (result.data) {
          setData(result.data);
          let tmp: any = {
            ...result.data
          };
          delete tmp.id;
          setRawData(JSON.stringify(removeNullValues(tmp)));
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

  function removeNullValues(obj: any) {
    try {
      Object.keys(obj).forEach(key => {
        // Si la valeur est un objet, on le parcourt récursivement
        if (typeof obj[key] === 'object' && obj[key] !== null && key !== 'slugs') {
          obj[key] = removeNullValues(obj[key]);
        }
        // Si la valeur est null, on supprime la clé
        else if (obj[key] === null) {
          delete obj[key];
        }
      });

      return obj;
    } catch (e) {
      return null;
    }
  }

  const update = async () => {
    let tmp;

    try {
      tmp = JSON.parse(rawData);
      tmp.id = data.id;
    } catch (e) {
      flash.open(t('training_edit.json_fail'));
    }

    try {
      await inversify.updateTraingUsecase.execute(tmp);
      flash.open(t('training_edit.update_sucess'));
    } catch (e) {
      flash.open(t('training_edit.update_fail'));
    }
  }

  return (
    <>
      <Container>
        {/* Box component to center the content vertically and horizontally */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            minHeight: "80vh",
            textAlign: "center",
            marginBottom: "5vh",
            marginTop: "2vh"
          }}>
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

          {qry.data && (<>
            {/* Typography component to display the page title */}
            <Typography variant="h2">
              {data?.label ?? data?.slug}
            </Typography>

            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  label="JSON Input"
                  multiline
                  fullWidth
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                  variant="outlined"
                  minRows={10}
                  slotProps={{
                    input: {
                      style: { fontFamily: 'monospace', whiteSpace: 'pre' },
                    },
                  }}
                />
              </Grid>
              <Grid size={12}>
                {/* Submit button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  startIcon={<DoneIcon />}
                  onClick={(e) => {
                    e.preventDefault();
                    update();
                  }}
                ><Trans>common.update</Trans></Button>
              </Grid>
            </Grid>
          </>)}
        </Box>
      </Container>
    </>
  );
}

export default Training_edit;
