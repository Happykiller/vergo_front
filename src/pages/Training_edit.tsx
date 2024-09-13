import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next'; // Import translation hook for i18n
import { useSearchParams } from 'react-router-dom';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { Container, Typography, Box, Grid, TextField, Button } from '@mui/material'; // Import Material-UI components

import Header from '@components/Header';
import { CODES } from '@src/commons/codes';
import inversify from '@src/commons/inversify';
import { FlashStore, flashStore} from '@components/Flash';

const Training_edit: React.FC = () => {
  // Use the translation hook to get the translation function
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language;
  const flash:FlashStore = flashStore();
  const [searchParams] = useSearchParams();
  const training_id = searchParams.get('id');
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
    const fetchData = async (training_id: string) => {
      setQry({ loading: true, data: null, error: null });
      try {
        const result = await inversify.getTrainingUsecase.execute({id: training_id});
        if (result.message !== CODES.SUCCESS) {
          throw new Error(result.message);
        } else if (result.data) {
          setData(result.data);
          setRawData(JSON.stringify(removeNullValues(result.data)));
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

  function removeNullValues(obj:any) {
    let tmp:any = {
      ... obj
    };
    delete tmp.id;
    delete tmp.slug;
    delete tmp.label;

    try {
      // Parcourt les clés de l'objet
      Object.keys(tmp).forEach(key => {
        // Si la valeur est un objet, on le parcourt récursivement
        if (typeof tmp[key] === 'object' && tmp[key] !== null) {
          tmp[key] = removeNullValues(tmp[key]);
        } 
        // Si la valeur est null, on supprime la clé
        else if (tmp[key] === null) {
          delete tmp[key];
        }
      });
  
      return tmp;
    } catch (e) {
      return null;
    }
  }

  const update = async () => {
    await inversify.updateTraingUsecase.execute({
      rawData
    })
    flash.open(t('training_edit.update_sucess'));
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
              variant="outlined"
              minRows={10}
              InputProps={{
                style: { fontFamily: 'monospace', whiteSpace: 'pre' }, // Style monospace et retour à la ligne respecté
              }}
            />
          </Grid>
          {/* Submit button */}
          <Button 
            type="submit"
            variant="contained"
            size="small"
            startIcon={<SystemUpdateAltIcon />}
            onClick={(e) => { 
              e.preventDefault();
              update();
            }}
          ><Trans>common.done</Trans></Button>
        </Grid>

      </Box>
    </Container>
  </>);
}

export default Training_edit;
