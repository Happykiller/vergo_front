import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import translation hook for i18n
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material'; // Import Material-UI components

import Header from '@components/Header';
import inversify from '../commons/inversify';
import { CODES } from '../commons/codes';

const Training_edit: React.FC = () => {
  // Use the translation hook to get the translation function
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language;
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
        const result = await inversify.getTrainingUsecase.execute({id: training_id});
        if (result.message !== CODES.SUCCESS) {
          throw new Error(result.message);
        } else if (result.data) {
          console.log(result.data);
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
        flexDirection="column"
        minHeight="80vh" // Minimum height of 80% of the viewport height
        textAlign="center" // Center text alignment
      >
        {/* Typography component to display the page title */}
        <Typography variant="h2">
          {t('training_edit.title')} {/* Translation key for the page title */}
        </Typography>
      </Box>
    </Container>
  </>);
}

export default Training_edit;
