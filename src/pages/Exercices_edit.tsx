import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next'; // Import translation hook for i18n
import DoneIcon from '@mui/icons-material/Done';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, Grid, TextField, Button, CircularProgress, Alert } from '@mui/material'; // Import Material-UI components

import Header from '@components/Header';
import { CODES } from '@src/commons/codes';
import inversify from '@src/commons/inversify';
import { FlashStore, flashStore} from '@components/Flash';

const Exercice_edit: React.FC = () => {
  // Use the translation hook to get the translation function
  const { t } = useTranslation();
  const flash:FlashStore = flashStore();
  const [searchParams] = useSearchParams();
  const exercice_id = searchParams.get('id');
  const [data, setData] = React.useState<any>(null);
  const [rawData, setRawData] = React.useState<any>('');

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
    const fetchData = async (exercice_id: string) => {
      setQry({ loading: true, data: null, error: null });
      try {
        const result = await inversify.get_exercice_usecase.execute({id: exercice_id});
        if (result.message !== CODES.SUCCESS) {
          throw new Error(result.message);
        } else if (result.data) {
          setData(result.data);
          let tmp:any = {
            ... result.data
          };
          delete tmp.id;
          setRawData(JSON.stringify(removeNullValues(tmp)));
          setQry({ loading: false, data: result, error: null });
        }
      } catch (err) {
        setQry({ loading: false, data: null, error: err as Error });
      }
    };

    if (exercice_id) {
      fetchData(exercice_id);
    }
  }, [inversify]);

  function removeNullValues(obj:any) {
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
    } catch(e) {
      flash.open(t('exercice_edit.json_fail'));
    }

    try {
      const response = await inversify.update_exercice_usecase.execute(tmp);
      if (response.error) {
        throw new Error(response.error);
      }
      flash.open(t('exercice_edit.update_sucess'));
    } catch(e) {
      flash.open(t('exercice_edit.update_fail'));
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
        marginBottom={"5vh"}
        marginTop={"2vh"}
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

        {qry.data && (<>
          {/* Typography component to display the page title */}
          <Typography variant="h2">
            {data?.label??data?.slug}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="JSON Input"
                multiline
                fullWidth
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}  // Ajout du onChange pour gérer les modifications
                variant="outlined"
                minRows={10}
                InputProps={{
                  style: { fontFamily: 'monospace', whiteSpace: 'pre' }, // Style monospace et retour à la ligne respecté
                }}
              />
            </Grid>
            <Grid item xs={12}>
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
  </>);
}

export default Exercice_edit;
