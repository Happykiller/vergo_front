import React from 'react';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Container, Box, Grid2, TextField, Button } from '@mui/material';

import inversify from '@src/commons/inversify';
import { useFlashStore } from '@happykiller/sunny-ui';

const Exercice_create: React.FC = () => {
  const flash = useFlashStore();
  // Use the translation hook to get the translation function
  const navigate = useNavigate();
  // Use the translation hook to get the translation function
  const { t } = useTranslation();
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
    <Container>
      {/* Box component to center the content vertically and horizontally */}
      <Box 
        display="flex" 
        justifyContent="center" 
        flexDirection="column"
        minHeight="80vh"
        textAlign="center"
        marginBottom={"5vh"}
        marginTop={"2vh"}
      >
        <Grid2 
          container 
          spacing={2}
        >
          <Grid2
            size={12}
          >
            <h1><Trans>exercice_create.title</Trans></h1>
          </Grid2>
          <Grid2
            size={12}
          >
            <TextField
              label="JSON Input"
              multiline
              fullWidth
              onChange={(e) => setRawData(e.target.value)}
              variant="outlined"
              minRows={10}
              slotProps={{
                input: {
                  style: { fontFamily: 'monospace', whiteSpace: 'pre' },
                },
              }}
            />
          </Grid2>
          <Grid2
            size={12}
          >
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
          </Grid2>
        </Grid2>
      </Box>
    </Container>
  </>);
}

export default Exercice_create;
