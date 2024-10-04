import React from 'react';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next'; // Import translation hook for i18n
import { Container, Box, Grid, TextField, Button } from '@mui/material'; // Import Material-UI components

import Header from '@components/Header';
import inversify from '@src/commons/inversify';
import { FlashStore, flashStore} from '@components/Flash';

const Exercice_create: React.FC = () => {
  // Use the translation hook to get the translation function
  const navigate = useNavigate();
  // Use the translation hook to get the translation function
  const { t } = useTranslation();
  const flash:FlashStore = flashStore();
  const [rawData, setRawData] = React.useState<any>('');

  const submit = async () => {
    let tmp;

    try {
      tmp = JSON.parse(rawData);
      try {
        const response = await inversify.createExerciceUsecase.execute(tmp);
        if (response.error) {
          throw new Error(response.error);
        }
        flash.open(t('exercice_create.create_success'));
        navigate({
          pathname: '/exercices'
        });
      } catch(e:any) {
        flash.open(t('exercice_create.create_fail'));
      }
    } catch(e:any) {
      flash.open(t('exercice_create.json_fail'));
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="JSON Input"
              multiline
              fullWidth
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
              startIcon={<Add />}
              onClick={(e) => { 
                e.preventDefault();
                submit();
              }}
            ><Trans>common.create</Trans></Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  </>);
}

export default Exercice_create;
