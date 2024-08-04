import React, { useState } from 'react';
import { Container, Box, Typography, Grid, Paper } from '@mui/material'; // Import Material-UI components

import Header from '@components/Header';
import Chrono from '@components/Chrono';
import { contextStore, ContextStoreModel } from '@src/stores/contextStore';

const Training: React.FC = () => {
  let flattenTraining:any = [];
  const context:ContextStoreModel = contextStore();
  const [currentIndex, setCurrentIndex] = useState<number|null>(null);

  const flatten = () => {
    for(const workout of context.training.workout) {
      for(const set of workout.sets) {
        flattenTraining = flattenTraining.concat(flattenSequence(set));
      }
    }
  }

  const flattenSequence = (set: any): [] => {
    let response:any = [];
    let label = '';
    for (let i = 0; i < set.rep; i++) {
      if(set.slugs && set.slugs[i]) {
        label = set.slugs[i];
      } else {
        label = '';
      }
      if(set.duration) {
        response.push({
          label,
          type: 'effort',
          duration: set.duration
        });
      }
      if(set.set) {
        for(const seq of set.set) {
          response = response.concat(flattenSequence(seq));
        }
      }
      if(set.rest) {
        response.push({
          label,
          type: 'rest',
          duration: set.rest
        });
      }
    }
    if(set.pause) {
      response.push({
        label,
        type: 'pause',
        duration: set.pause
      });
    }
    return response;
  }
  
  flatten();

  const doThing = (index: number|null) => {
    if (index === null) return <></>;
    const thing = flattenTraining[index];
    return (<>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h6" align="center">{thing.label}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h6" align="center">{thing.type}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Chrono key={index} duration={thing.duration} onComplete={() => {
          if (flattenTraining[index+1]) {
            setTimeout(() => {setCurrentIndex(index+1)}, 100);
          } else {
            console.log('FIIIIIINIIISHHHHH');
          }
        }} />
      </Grid>
    </>);
  }

  if(currentIndex === null) {
    setCurrentIndex(0);
  }

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
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Paper>
              <Typography variant="h6" align="center">{context.training.slug}</Typography>
            </Paper>
          </Grid>
          {doThing(currentIndex)}
        </Grid>
      </Box>
    </Container>
  </>);
}

export default Training;
