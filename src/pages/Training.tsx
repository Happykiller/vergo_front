import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Paper } from '@mui/material'; // Import Material-UI components

import Chrono from '@components/Chrono';

const Training: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number|null>(null);
  let flattenTraining:any = [];
  const training = {
    "_type": "TRAINING",
    "label": "HIIT Training",
    "workout": [
      {
        "_type": "WORKOUT",
        "label": "warm-up",
        "sequence": [
          {
            "_type": "SET",
            "serie": ["Jumping Jacks"],
            "rep": 1,
            "duration": 40,
            "rest": 20,
          },
          {
            "_type": "SET",
            "rep": 3,
            "serie": ['Arm Circles', 'Bodyweight Squats', 'High Knees'],
            "duration": 40,
            "rest": 20,
            "pause": 60,
          }
        ]
      },
      {
        "_type": "WORKOUT",
        "label": "HIIT",
        "sequence": [
          {
            "_type": "SET",
            "rep": 4,
            "rest": 60,
            "pause": 60,
            "sequence": [
              {
                "_type": "SET",
                "rep": 8,
                "serie": ['Burpees', 'Mountain Climbers', 'Jumb rope', ' Jump Squats', 'Push-Ups', 'Russian Twists', 'Bank jumb', 'Jumping Lunges'],
                "duration": 40,
                "rest": 20
              }
            ]
          }
        ]
      },
      {
        "_type": "WORKOUT",
        "label": "cooldown",
        "sequence": [
          {
            "_type": "SET",
            "rep": 2,
            "serie": ['Standing Hamstring Stretch', 'Quadriceps Stretch'],
            "duration": 60,
          },
          {
            "_type": "SET",
            "rep": 1,
            "serie": ['Shoulder Stretch'],
            "sequence": [
              {
                "_type": "SET",
                "rep": 2,
                "serie": ['Left', 'Right'],
                "sequence": [
                  {
                    "_type": "SET",
                    "rep": 3,
                    "duration": 10,
                  }
                ]
              }
            ]
          },
          {
            "_type": "SET",
            "rep": 1,
            "serie": ["Child's Pose"],
            "duration": 60,
          }
        ]
      }
    ]
  };

  const flatten = () => {
    for(const workout of training.workout) {
      for(const sequence of workout.sequence) {
        flattenTraining = flattenTraining.concat(flattenSequence(sequence));
      }
    }
  }

  const flattenSequence = (sequence: any): [] => {
    let response:any = [];
    let label = '';
    for (let i = 0; i < sequence.rep; i++) {
      if(sequence.serie && sequence.serie[i]) {
        label = sequence.serie[i];
      } else {
        label = '';
      }
      if(sequence.duration) {
        response.push({
          label,
          type: 'effort',
          duration: sequence.duration
        });
      }
      if(sequence.sequence) {
        for(const seq of sequence.sequence) {
          response = response.concat(flattenSequence(seq));
        }
      }
      if(sequence.rest) {
        response.push({
          label,
          type: 'rest',
          duration: sequence.rest
        });
      }
    }
    if(sequence.pause) {
      response.push({
        label,
        type: 'pause',
        duration: sequence.pause
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

  return (
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
              <Typography variant="h6" align="center">{training.label}</Typography>
            </Paper>
          </Grid>
          {doThing(currentIndex)}
        </Grid>
      </Box>
    </Container>
  );
}

export default Training;
