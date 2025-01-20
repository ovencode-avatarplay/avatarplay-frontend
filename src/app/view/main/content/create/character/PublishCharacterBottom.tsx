import React from 'react';
import styles from './CreateCharacterSequence.module.css';
import CustomButton from '@/components/layout/shared/CustomButton';
import {LineArrowLeft, LineArrowRight} from '@ui/Icons';

interface PublishCharacterBottomProps {
  onPrevClick: () => void;
  onPublishClick: () => void;
}

const PublishCharacterBottom: React.FC<PublishCharacterBottomProps> = ({onPrevClick, onPublishClick}) => {
  return (
    <>
      <CustomButton
        size="Medium"
        type="Tertiary"
        state="IconLeft"
        onClick={onPrevClick}
        icon={LineArrowLeft.src}
        iconClass="blackIcon"
        customClassName={[styles.stepButton]}
      >
        {'Previous'}
      </CustomButton>
      <CustomButton
        size="Medium"
        type="Primary"
        state="IconRight"
        customClassName={[styles.stepButton]}
        icon={LineArrowRight.src}
        iconClass="blackIcon"
        onClick={onPublishClick}
      >
        {'Submit'}
      </CustomButton>
    </>
  );
};

export default PublishCharacterBottom;
