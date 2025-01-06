import React from 'react';
import styles from './EpisodeInitializeStep.module.css';

interface Props {
  maxStep: number;
  curStep: number;
}

const EpisodeInitializeStep: React.FC<Props> = ({maxStep, curStep}) => {
  return (
    <div className={styles.stepContainer}>
      {Array.from({length: maxStep}, (_, index) => (
        <div key={index} className={`${styles.stepItem} ${index < curStep ? styles.stepOn : styles.stepOff}`}></div>
      ))}
    </div>
  );
};

export default EpisodeInitializeStep;
