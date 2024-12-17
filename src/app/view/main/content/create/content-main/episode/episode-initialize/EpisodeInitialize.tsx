import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import {Drawer} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import styles from './EpisodeInitialize.module.css';
import EpisodeInitializeStep from './EpisodeInitializeStep';

interface Props {
  open: boolean;
  onClose: () => void;
  addEpisodeOper: () => void;
}

const EpisodeInitialize: React.FC<Props> = ({open, onClose, addEpisodeOper}) => {
  const router = useRouter();

  const [isInitFinished, setIsInitFinished] = useState<boolean>(false);
  const [maxStep, setMaxStep] = useState<number>(4);
  const [curStep, setCurStep] = useState<number>(0); // 0일때는 max 수치가 변동이 있을 수 있기때문에 step이 가려집니다.

  type UploadType = 'SelectCharacter' | 'UploadImage' | 'GenerateImage';
  const [uploadType, setUploadType] = useState<UploadType>('SelectCharacter');

  const stepTexts: Record<UploadType, string[]> = {
    SelectCharacter: ['Select a character', 'Select an image', 'Select a background'],
    UploadImage: ['Upload your image', 'Describe character in scene'],
    GenerateImage: ['Write an image you want', 'Select an image', 'Describe character in the scene'],
  };
  const finalStepText = 'Write the title of the episode';
  const getStepText = () => {
    if (curStep >= maxStep) {
      return finalStepText;
    }
    const currentStep = stepTexts[uploadType][curStep - 1]; // 0부터 시작이므로 curStep - 1
    return currentStep || '';
  };

  const handlerOnCompleteInit = () => {
    setIsInitFinished(true);
    addEpisodeOper();
    onClose();
  };

  const handlerOnClose = () => {
    if (isInitFinished) {
      onClose();
    } else {
      router.back();
    }
  };

  function addStep() {
    setCurStep(prev => Math.min(prev + 1, maxStep));
  }

  function subStep() {
    setCurStep(prev => Math.max(prev - 1, 0));
  }

  const handleOnSelectCharacter = () => {
    setMaxStep(4);
    setUploadType('SelectCharacter');
    addStep();
  };

  const handleOnUploadImage = () => {
    setMaxStep(3);
    setUploadType('UploadImage');
    addStep();
  };

  const handleOnGenerateImage = () => {
    setMaxStep(4);
    setUploadType('GenerateImage');
    addStep();
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className={styles.uploadImage}>
            <div className={styles.buttonArea}>
              <button className={styles.uploadButton} onClick={handleOnSelectCharacter}>
                <div className={styles.buttonIconBack}>
                  <img className={styles.buttonIcon} />
                </div>
                <div className={styles.buttonText}>Select Character</div>
              </button>

              <button className={styles.uploadButton} onClick={handleOnUploadImage}>
                <div className={styles.buttonIconBack}>
                  <img className={styles.buttonIcon} />
                </div>
                <div className={styles.buttonText}>Upload Image</div>
              </button>

              <button className={styles.uploadButton} onClick={handleOnGenerateImage}>
                <div className={styles.buttonIconBack}>
                  <img className={styles.buttonIcon} />
                </div>
                <div className={styles.buttonText}>Generate Image</div>
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <>
            {uploadType === 'SelectCharacter' ? (
              <>SelectCharacter</>
            ) : uploadType === 'UploadImage' ? (
              <>UploadImage</>
            ) : (
              <>GenerateImage</>
            )}
          </>
        );
      case 2:
        return (
          <>
            {uploadType === 'SelectCharacter' ? (
              <>SelectCharacter</>
            ) : uploadType === 'UploadImage' ? (
              <>UploadImage</>
            ) : (
              <>GenerateImage</>
            )}
          </>
        );
      case 3:
        return (
          <>
            {uploadType === 'SelectCharacter' ? (
              <>SelectCharacter</>
            ) : uploadType === 'UploadImage' ? (
              <div> {getInputTitle()}</div>
            ) : (
              <>GenerateImage</>
            )}
          </>
        );
      case 4:
        return (
          <>
            {uploadType === 'SelectCharacter' || uploadType === 'GenerateImage' ? (
              <div> {getInputTitle()}</div>
            ) : (
              <>Err</>
            )}
          </>
        );
    }
  };

  const getInputTitle = () => {
    return <>Input Title</>;
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {width: '100vw', height: '100vh', maxWidth: '500px', margin: '0 auto'},
      }}
    >
      <CreateDrawerHeader title="EpisodeCreate" onClose={handlerOnClose} />
      {curStep > 0 && (
        <>
          <EpisodeInitializeStep maxStep={maxStep} curStep={curStep} />
          <div className={styles.stepDesc}>
            Step {curStep}. {getStepText()}
          </div>
        </>
      )}
      {getStepContent(curStep)}
      <div></div>
      {/* Float Button */}
      <div className={styles.floatButtonArea}>
        <button
          className={`${styles.floatButton} ${styles.prevButton}`}
          onClick={() => {
            subStep();
          }}
        >
          <img className={styles.buttonIcon} />
          <div>Previous</div>
        </button>
        <button
          className={`${styles.floatButton} ${styles.nextButton}`}
          onClick={() => {
            addStep();
          }}
        >
          <div>Next</div>
          <img className={styles.buttonIcon} />
        </button>
      </div>
      EpisodeCreate
      <button onClick={handlerOnCompleteInit}> Init </button>
      isInit : {isInitFinished ? 'Complete' : 'False'}
    </Drawer>
  );
};

export default EpisodeInitialize;
