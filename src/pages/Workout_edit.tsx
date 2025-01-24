import React, { useEffect } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { useSearchParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Container, Typography, Box, Grid2, TextField, Button, CircularProgress, Alert } from '@mui/material';

import Header from '@components/Header';
import { CODES } from '@src/commons/codes';
import inversify from '@src/commons/inversify';
import { FlashStore, flashStore} from '@components/Flash';

const Workout_edit: React.FC = () => {
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
        if (typeof obj[key] === 'object' && obj[key] !== null && key !== 'slugs') {
          obj[key] = removeNullValues(obj[key]);
        } 
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
        minHeight="80vh"
        textAlign="center"
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
          
          <Grid2 container spacing={2}>
            <Grid2 size={12}>
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
            </Grid2>
            <Grid2 size={12}>
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
            </Grid2>
          </Grid2>
        </>)}
      </Box>
    </Container>
  </>);
}

export default Workout_edit;
