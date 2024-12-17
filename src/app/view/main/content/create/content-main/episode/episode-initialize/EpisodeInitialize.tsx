import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import {Drawer} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import styles from './EpisodeInitialize.module.css';
import EpisodeInitializeStep from './EpisodeInitializeStep';
import CharacterGrid from '@/app/view/studio/characterDashboard/CharacterGrid';
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';
import {GetCharacterInfoReq, sendGetCharacterInfo, sendGetCharacterList} from '@/app/NetWork/CharacterNetwork';
import CharacterGalleryGrid from '@/app/view/studio/characterDashboard/CharacterGalleryGrid';

interface Props {
  open: boolean;
  onClose: () => void;
  addEpisodeOper: () => void;
  episodeName: string;
}

const EpisodeInitialize: React.FC<Props> = ({open, onClose, addEpisodeOper, episodeName}) => {
  //#region 선언
  // 공통
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  const [isInitFinished, setIsInitFinished] = useState<boolean>(false);
  // 스텝
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

  // 캐릭터 설명
  const maxNameLength: number = 50;
  const maxPromptLength: number = 500;
  const [nameValue, setNameValue] = useState<string>('');
  const [promptValue, setPromptValue] = useState<string>('');

  // 캐릭터 선택
  const [currentSelectedCharacter, setCurrentSelectedCharacter] = useState<CharacterInfo | undefined>();
  const [characters, setCharacters] = useState<CharacterInfo[] | undefined>();
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);

  // 이미지 업로드

  // 이미지 생성

  //#endregion

  //#region  함수
  // 공통
  const getStepText = () => {
    if (curStep >= maxStep) {
      return finalStepText;
    }
    const currentStep = stepTexts[uploadType][curStep - 1]; // 0부터 시작이므로 curStep - 1
    return currentStep || '';
  };

  // 스텝
  function checkFinalStep() {
    if (curStep === maxStep) return true;
    return false;
  }
  function addStep() {
    setCurStep(prev => Math.min(prev + 1, maxStep));
    handleConfirm();
  }

  function subStep() {
    setCurStep(prev => Math.max(prev - 1, 0));
  }

  // 캐릭터 선택
  const getCharacterList = async () => {
    setLoading(true);
    try {
      const response = await sendGetCharacterList({});
      if (response.data) {
        const characterInfoList: CharacterInfo[] = response.data?.characterInfoList;
        setCharacters(characterInfoList);
      } else {
        throw new Error(`No contentInfo in response`);
      }
    } catch (error) {
      console.error('Error fetching character list:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCharacterInfo = async (id: number) => {
    setLoading(true);
    try {
      const req: GetCharacterInfoReq = {characterId: id};
      const response = await sendGetCharacterInfo(req);

      if (response.data) {
        const characterInfo: CharacterInfo = response.data?.characterInfo;
        setCurrentSelectedCharacter(characterInfo);
      } else {
        throw new Error(`No characterInfo in response for ID: ${id}`);
      }
    } catch (error) {
      console.error('Error fetching character info:', error);
    } finally {
      setLoading(false);
    }
  };

  const galleryAllUrl = [
    ...(currentSelectedCharacter?.portraitGalleryImageUrl || []),
    ...(currentSelectedCharacter?.poseGalleryImageUrl || []),
    ...(currentSelectedCharacter?.expressionGalleryImageUrl || []),
  ];
  //#endregion

  //#region handler
  // 공통
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

  // 업로드 타입 선택
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

  // 캐릭터 설명

  const handleCharacterDescNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxNameLength) {
      setNameValue(e.target.value);
    }
  };

  const handleCharacterDescPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxPromptLength) {
      setPromptValue(e.target.value);
    }
  };

  //캐릭터 선택
  const handleCharacterSelect = (id: number) => {
    setSelectedCharacterId(id);
  };

  const handleConfirm = async () => {
    if (curStep === 1 && selectedCharacterId) {
      await getCharacterInfo(selectedCharacterId);
    }
  };

  // 이미지 업로드

  // 이미지 생성

  //#endregion

  //#region Hook

  //캐릭터 선택
  useEffect(() => {
    if (uploadType === 'SelectCharacter' && curStep === 1) {
      getCharacterList();
    }
  }, [curStep]);

  //#endregion

  //#region 렌더링을 위한 함수
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
              <CharacterGrid characters={characters || []} onCharacterSelect={handleCharacterSelect} />
            ) : uploadType === 'UploadImage' ? (
              <>UploadImage1</>
            ) : (
              <>GenerateImage1</>
            )}
          </>
        );
      case 2:
        return (
          <>
            {uploadType === 'SelectCharacter' ? (
              <CharacterGalleryGrid
                itemUrl={galleryAllUrl}
                selectedItemIndex={selectedGalleryIndex}
                onSelectItem={i => {
                  setSelectedGalleryIndex(i);
                }}
                isTrigger={true}
              />
            ) : uploadType === 'UploadImage' ? (
              <div>{getInputCharacterDesc()}</div>
            ) : (
              <>GenerateImage2</>
            )}
          </>
        );
      case 3:
        return (
          <>
            {uploadType === 'SelectCharacter' ? (
              <>SelectCharacter3</>
            ) : uploadType === 'UploadImage' ? (
              <div> {getInputTitle()}</div>
            ) : (
              <div>{getInputCharacterDesc()}</div>
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
    return (
      <div className={styles.inputTitle}>
        <div className={styles.title}>Title</div>
        <input className={styles.inputBox} placeholder="Text Placeholder" value={episodeName} />
      </div>
    );
  };

  const getInputCharacterDesc = () => {
    return (
      <div className={styles.inputCharacterDesc}>
        <div className={styles.characterDesc}>
          <div className={styles.title}>CharacterName</div>
          <input
            className={styles.inputBox}
            placeholder="Text Placeholder"
            value={nameValue}
            onChange={handleCharacterDescNameChange}
            maxLength={maxNameLength}
          />
        </div>
        <div className={styles.characterDesc}>
          <div className={styles.title}>CharacterPrompt</div>
          <div className={styles.inputArea}>
            <textarea
              className={styles.inputPrompt}
              placeholder="Text Placeholder"
              value={promptValue}
              onChange={handleCharacterDescPromptChange}
              maxLength={maxPromptLength}
            />

            <div className={styles.inputHint}>
              {promptValue.length} / {maxPromptLength}
            </div>
          </div>
        </div>
      </div>
    );
  };
  //#endregion

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
            {
              checkFinalStep() === true ? handlerOnCompleteInit() : addStep();
            }
          }}
        >
          <div>{checkFinalStep() === true ? 'Complete' : 'Next'}</div>
          <img className={styles.buttonIcon} />
        </button>
      </div>
    </Drawer>
  );
};

export default EpisodeInitialize;
