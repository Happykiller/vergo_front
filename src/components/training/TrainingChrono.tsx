// src\components\training\TrainingChrono.tsx
import Chrono from '@components/Chrono';
import React from 'react';

interface Props {
  index: number;
  duration: number;
  volume: number;
  hasNext: boolean;
  onEnd: () => void;
}

const TrainingChrono: React.FC<Props> = ({ index, duration, volume, onEnd }) => {
  return (
    <Chrono
      key={index}
      duration={duration}
      volume={volume}
      onComplete={() => {
        setTimeout(onEnd, 100);
      }}
    />
  );
};

export default TrainingChrono;
