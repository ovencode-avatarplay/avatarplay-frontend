import {Button} from '@mui/material';
import React from 'react';
import styles from './CreateCharacterSequence.module.css';

interface PublishCharacterBottomProps {
  onPrevClick: () => void;
  onPublishClick: () => void;
}

const PublishCharacterBottom: React.FC<PublishCharacterBottomProps> = ({onPrevClick, onPublishClick}) => {
  return (
    <>
      <Button className={styles.stepButton} variant="outlined" onClick={onPrevClick}>
        Change Thumbnail
      </Button>

      <Button className={styles.stepButton} variant="contained" onClick={onPublishClick}>
        Publish
      </Button>
    </>
  );
};

export default PublishCharacterBottom;
