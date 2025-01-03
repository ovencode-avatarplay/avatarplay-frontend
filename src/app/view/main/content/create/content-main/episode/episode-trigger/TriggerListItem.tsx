import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux'; // Redux에서 상태를 가져오기 위해 추가
import {RootState} from '@/redux-store/ReduxStore'; // RootState 타입 가져오기
import {TriggerActionType, TriggerTypeNames} from '@/types/apps/DataTypes'; // TriggerInfo 타입 가져오기
import styles from './TriggerListItem.module.css'; // CSS 모듈 임포트
import {
  Arrow_Trigger,
  AudioFile,
  BoldPlay,
  edit1Pixel,
  editPlusOpacity,
  EmotionBored,
  EmotionHappy,
  EmotionSad,
  EmotionExcited,
  EmotionScared,
  EmotionAngry,
  LineArrowRight,
  LineArrowSwap,
  LineCopy,
  LineDelete,
} from '@ui/Icons';
import {EmotionState, TriggerMediaState} from '@/types/apps/content/episode/TriggerInfo';
import TriggerCreate from './TriggerCreate';
import {duplicateTriggerInfo, removeTriggerInfo, updateTriggerInfo} from '@/redux-store/slices/EpisodeInfo';
import TriggerChapterList from './TriggerChapterList';
import {moveTriggerToEpisode} from '@/redux-store/slices/ContentInfo';
import BottomRenameDrawer from '../BottomRenameDrawer';
import {inputType} from '@/components/create/MaxTextInput';
import {number} from 'valibot';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import {MediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import {Alert} from '@mui/material';

const mediaTypeConfig = {
  image: {
    label: 'Write Image File Type',
    hint: 'Write image file type (e.g., .png, .jpg, .jpeg)',
    accept: 'image/*', // 이미지 파일
  },
  video: {
    label: 'Write Video File Type',
    hint: 'Write video file type (e.g., .mp4, .mov, .avi)',
    accept: 'video/*', // 비디오 파일
  },
  audio: {
    label: 'Write Audio File Type',
    hint: 'Write audio file type (e.g., .mp3, .wav, .aac)',
    accept: 'audio/*', // 오디오 파일
  },
};
interface TriggerListItemProps {
  handleToggle: () => void; // 함수 형식을 () => void로 수정
  isSelected: boolean; // 선택 여부 확인
  index: number; // 인덱스 전달
}

const TriggerListItem: React.FC<TriggerListItemProps> = ({handleToggle, isSelected, index}) => {
  const dispatch = useDispatch();
  // Redux 상태에서 triggerInfoList 배열을 가져오고, 전달받은 index를 통해 해당 item을 탐색
  const item = useSelector((state: RootState) => state.episode.currentEpisodeInfo.triggerInfoList[index]);
  const ep = useSelector((state: RootState) => state.episode.currentEpisodeInfo);

  const [openTriggerCreate, SetOpenTriggerCreate] = useState(false); // Trigger name 상태

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number | null>(null);
  const [selectedEpisodeIdx, setSelectedEpisodeIdx] = useState<number | null>(null);

  const editingContentInfo = useSelector((state: RootState) => state.content.curEditingContentInfo); // 현재 수정중인 컨텐츠 정보
  const handleConfirm = (chapterIdx: number, episodeIdx: number) => {
    setSelectedChapterIdx(chapterIdx);
    setSelectedEpisodeIdx(episodeIdx);
    setModalOpen(false); // 모달 닫기
    dispatch(
      moveTriggerToEpisode({
        sourceEpisodeId: ep.id, // 소스 에피소드 ID
        triggerId: item.id, // 이동할 트리거 ID
        targetEpisodeId: editingContentInfo.chapterInfoList[chapterIdx].episodeInfoList[episodeIdx].id, // 대상 에피소드 ID
      }),
    );
  };
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio'>('image');

  useEffect(() => {
    if (item.triggerActionType == TriggerActionType.PlayMedia) {
      if (item.actionMediaState == TriggerMediaState.TriggerAudio) setMediaType('audio');
      if (item.actionMediaState == TriggerMediaState.TriggerImage) setMediaType('image');
      if (item.actionMediaState == TriggerMediaState.TriggerVideo) setMediaType('video');
    }
  }, [item]);

  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const getTriggerValueInputType = (): inputType => {
    switch (item.triggerType) {
      case TriggerTypeNames.Intimacy:
        return inputType.OnlyNumMax100; // 100까지만 입력 가능
      case TriggerTypeNames.ChatCount:
        return inputType.OnlyNum; // 숫자만 입력 가능
      case TriggerTypeNames.TimeMinute:
        return inputType.OnlyNum; // 숫자만 입력 가능
      case TriggerTypeNames.Keyword:
        return inputType.None; // 제한 없음
      default:
        return inputType.None; // 제한 없음
    }
  };
  const [isEditValue, setIsEditValue] = useState<boolean>(false);
  const handleSetEpisodeNameComplete = (name: string): boolean => {
    if (name != null && name != '') {
      if (item.triggerType === TriggerTypeNames.ChatCount) {
        dispatch(
          updateTriggerInfo({
            id: item.id, // 업데이트할 트리거의 ID
            info: {
              triggerValueChatCount: name ? Number(name) : 0,
            }, // 업데이트할 정보
          }),
        );
      } else if (item.triggerType === TriggerTypeNames.Intimacy) {
        dispatch(
          updateTriggerInfo({
            id: item.id, // 업데이트할 트리거의 ID
            info: {
              triggerValueIntimacy: name ? Number(name) : 0,
            }, // 업데이트할 정보
          }),
        );
      } else if (item.triggerType === TriggerTypeNames.TimeMinute) {
        dispatch(
          updateTriggerInfo({
            id: item.id, // 업데이트할 트리거의 ID
            info: {
              triggerValueTimeMinute: name ? Number(name) : 0,
            }, // 업데이트할 정보
          }),
        );
      } else if (item.triggerType === TriggerTypeNames.Keyword) {
        dispatch(
          updateTriggerInfo({
            id: item.id, // 업데이트할 트리거의 ID
            info: {
              triggerValueKeyword: name ? name : '',
            }, // 업데이트할 정보
          }),
        );
      }
      dispatch(
        updateTriggerInfo({
          id: item.id, // 업데이트할 트리거의 ID
          info: {}, // 업데이트할 정보
        }),
      );
      return true;
    }
    return false;
  };

  // item이 존재하는지 확인하여 렌더링
  if (!item) {
    return null; // item이 없으면 렌더링하지 않음
  }
  const getDynamicStyle = (triggerActionType: TriggerActionType): React.CSSProperties => {
    switch (triggerActionType) {
      case TriggerActionType.EpisodeChange:
        return {width: '100%'}; // 예: EpisodeChange일 경우
      case TriggerActionType.ChangePrompt:
        return {width: '100%'}; // 예: ChangePrompt일 경우
      case TriggerActionType.GetIntimacyPoint:
        return {width: '100%'}; // 예: GetIntimacyPoint일 경우
      case TriggerActionType.ChangeCharacter:
      case TriggerActionType.PlayMedia:
      default:
        return {width: '275px'}; // 기본값
    }
  };

  const renderTriggerMedia = (stat: TriggerMediaState) => {
    switch (stat) {
      case TriggerMediaState.TriggerAudio:
        return (
          <div className={styles.audioContainer}>
            <div className={styles.audioBackground}></div>
            <div className={styles.audioEditIcon}></div>
            <div className={styles.audioFileIcon}>
              <img src={AudioFile.src} alt="Edit Video" />{' '}
            </div>
            <div className={styles.audioLabel}>mp3</div>
            <div
              className={styles.videoEditIcon}
              onClick={() => {
                setIsOpenDrawer(true);
              }}
            >
              <img src={editPlusOpacity.src} alt="Edit Video" />
            </div>
          </div>
        );

      case TriggerMediaState.TriggerVideo:
        return (
          <div className={styles.videoContainer}>
            <video
              className={styles.videoThumbnail}
              src={item.actionMediaUrlList[0]} // 비디오 파일 URL
              preload="metadata" // 첫 프레임만 로드
              muted // 소리 제거 (필수는 아님, 안전하게 추가)
              playsInline // iOS 환경에서 화면 전체로 확대 방지
              disablePictureInPicture // PIP 모드 방지
            />
            <div
              className={styles.videoEditIcon}
              onClick={() => {
                setIsOpenDrawer(true);
              }}
            >
              <img src={editPlusOpacity.src} alt="Edit Video" />
            </div>
            <div className={styles.videoPlayIcon}>
              <img src={BoldPlay.src} />
            </div>
          </div>
        );

      default: // Image의 경우
        return (
          <div className={styles.imageContainer}>
            <img src={item.actionMediaUrlList[0]} alt="Media" className={styles.thumbnail} />
            <div
              className={styles.editIcon}
              onClick={() => {
                setIsOpenDrawer(true);
              }}
            >
              <img src={editPlusOpacity.src} alt="Edit" />
            </div>
          </div>
        );
    }
  };
  const emotionImages: {[key in EmotionState]: {src: string; alt: string}} = {
    [EmotionState.Happy]: {src: EmotionHappy.src, alt: 'Happy'},
    [EmotionState.Angry]: {src: EmotionAngry.src, alt: 'Angry'},
    [EmotionState.Sad]: {src: EmotionSad.src, alt: 'Sad'},
    [EmotionState.Excited]: {src: EmotionExcited.src, alt: 'Excited'},
    [EmotionState.Scared]: {src: EmotionScared.src, alt: 'Scared'},
    [EmotionState.Bored]: {src: EmotionBored.src, alt: 'Bored'},
  };

  // TriggerSubDataType에 따라 이미지와 아이콘 내용 동적으로 변경
  const renderTriggerImage = (triggerActionType: TriggerActionType) => {
    switch (triggerActionType) {
      case TriggerActionType.EpisodeChange:
        return null;
      case TriggerActionType.ChangePrompt:
        return null;
      case TriggerActionType.GetIntimacyPoint:
        return null;
      case TriggerActionType.ChangeCharacter:
        return (
          <div className={styles.triggerImage}>
            <img src={item.actionCharacterInfo.mainImageUrl} alt="Character" className={styles.thumbnail} />
            <div className={styles.editIcon}>
              <img src={editPlusOpacity.src}></img>
            </div>
          </div>
        );
      case TriggerActionType.PlayMedia:
        return renderTriggerMedia(item.actionMediaState);
      default:
        return (
          <div className={styles.triggerImage}>
            <img src={item.actionMediaUrlList[0]} alt="Character" className={styles.thumbnail} />
            <div className={styles.editIcon}>
              <img src={editPlusOpacity.src}></img>
            </div>
          </div>
        );
    }
  };
  function getCharacterDescriptionById(type: TriggerTypeNames): JSX.Element | string {
    switch (type) {
      case TriggerTypeNames.Intimacy:
        return item.triggerValueIntimacy.toString();
      case TriggerTypeNames.ChatCount:
        return item.triggerValueChatCount.toString();
      case TriggerTypeNames.EmotionStatus:
        const {src, alt} = emotionImages[item.emotionState];
        return (
          <div style={{display: 'flex', alignItems: 'center'}}>
            <img src={src} alt={alt} style={{width: '20px', height: '20px', marginRight: '8px'}} />
            {EmotionState[item.emotionState]}
          </div>
        );
      case TriggerTypeNames.EpisodeStart:
        return '-';
      case TriggerTypeNames.Keyword:
        return item.triggerValueKeyword;
      case TriggerTypeNames.TimeMinute:
        return item.triggerValueTimeMinute.toString();
      default:
        return '';
    }
  }

  const visibilityItems: SelectDrawerItem[] = [
    {
      name: 'Take a photo or video',
      onClick: () => {
        handleTakeMedia();
      },
    },
    {
      name: 'Media library',
      onClick: () => {
        handleMediaLibrary();
      },
    },
    {
      name: 'File folder',
      onClick: () => {
        handleChooseFile();
      },
    },
  ];

  const {label, hint, accept} = mediaTypeConfig[mediaType];
  const handleMediaLibrary = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept; // mediaType에 따라 파일 형식 설정
    input.multiple = mediaType === 'image'; // 이미지일 경우만 다중 선택 가능
    input.onchange = event => {
      const files = Array.from((event.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        handleOnFileSelect(mediaType === 'image' ? files.slice(0, 9) : files); // 이미지일 경우 최대 9개 제한
      }
    };
    input.click();
  };

  const handleTakeMedia = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept; // mediaType에 따라 파일 형식 설정
    input.capture = 'environment'; // 후면 카메라 (이미지/비디오)
    input.multiple = mediaType === 'image'; // 이미지일 경우만 다중 선택 가능
    input.onchange = event => {
      const files = Array.from((event.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        handleOnFileSelect(mediaType === 'image' ? files.slice(0, 9) : files); // 이미지일 경우 최대 9개 제한
      }
    };
    input.click();
  };

  const handleChooseFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept; // mediaType에 따라 파일 형식 설정
    input.multiple = mediaType === 'image'; // 이미지일 경우만 다중 선택 가능
    input.onchange = event => {
      const files = Array.from((event.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        handleOnFileSelect(mediaType === 'image' ? files.slice(0, 9) : files); // 이미지일 경우 최대 9개 제한
      }
    };
    input.click();
  };
  const handleOnFileSelect = async (files: File[]) => {
    try {
      // MediaState 설정
      let state = MediaState.None;
      if (mediaType === 'audio') {
        state = MediaState.TriggerAudio;
      } else if (mediaType === 'image') {
        state = MediaState.TriggerImage;
      } else if (mediaType === 'video') {
        state = MediaState.TriggerVideo;
      }

      // 업로드 요청 객체 생성
      const req: MediaUploadReq = {
        mediaState: state, // 적절한 MediaState 설정
      };

      // 이미지일 경우 다중 파일 처리, 그 외 단일 파일 처리
      if (state === MediaState.TriggerImage) {
        req.triggerImageList = files;
      } else {
        req.file = files[0];
      }

      // 파일 업로드 API 호출
      const response = await sendUpload(req);

      if (response?.data) {
        const imgUrl: string = response.data.url; // 업로드된 메인 이미지 URL
        const additionalUrls: string[] = response.data.imageUrlList || []; // 추가 이미지 URL 리스트

        console.log('Uploaded Image URL:', imgUrl); // 업로드 결과 로그 출력
        console.log('Additional Image URLs:', additionalUrls); // 추가 이미지 결과 로그 출력

        // Redux 상태 업데이트를 위한 URL 리스트 생성
        const validImageUrls = [imgUrl, ...additionalUrls].filter(url => url !== null);

        // 상태 업데이트: 새로운 이미지 추가
        dispatch(
          updateTriggerInfo({
            id: item.id, // 업데이트할 트리거의 ID
            info: {
              actionMediaUrlList: validImageUrls.slice(0, 9), // 최대 9개 제한
            },
          }),
        );

        console.log('Updated Trigger Info with Media URLs:', validImageUrls);
      } else {
        console.error('Failed to upload files:', files.map(file => file.name).join(', '));
      }
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  };

  return (
    <>
      <div className={styles.triggerCard}>
        <div className={styles.triggerHeader}>
          {renderTriggerImage(item.triggerActionType)} {/* 동적으로 콘텐츠 렌더링 */}
          <div className={styles.triggerContent} style={getDynamicStyle(item.triggerActionType)}>
            <div className={styles.triggerTitle}>
              <span className={styles.progressPoint}>{TriggerTypeNames[item.triggerType]}</span>
              <span className={styles.arrowIcon}>
                <img src={Arrow_Trigger.src}></img>
              </span>
              <span className={styles.changeCharacter}>{TriggerActionType[item.triggerActionType]}</span>
            </div>
            <div className={styles.triggerCondition}>Trigger Condition</div>
            <div
              className={styles.input}
              onClick={() => {
                setIsEditValue(true);
              }}
            >
              {getCharacterDescriptionById(item.triggerType)}
            </div>
          </div>
        </div>
        <div className={styles.triggerActions}>
          <div
            className={styles.actionButton}
            onClick={() => {
              SetOpenTriggerCreate(true);
            }}
          >
            <span className={styles.editButton}>
              <img src={edit1Pixel.src}></img>
            </span>
            <span>Edit</span>
          </div>
          <div
            className={styles.actionButton}
            onClick={() => {
              setModalOpen(true);
            }}
          >
            <span className={styles.normalButton}>
              <img src={LineArrowSwap.src}></img>
            </span>
            <span>Move to</span>
          </div>
          <div
            className={styles.actionButton}
            onClick={() => {
              dispatch(duplicateTriggerInfo(item.id));
            }}
          >
            <span className={styles.normalButton}>
              <img src={LineCopy.src}></img>
            </span>
            Duplicate
          </div>
          <div
            className={`${styles.actionButton} ${styles.delete}`}
            onClick={() => {
              dispatch(removeTriggerInfo(item.id));
            }}
          >
            <span className={styles.normalButtonRed}>
              <img src={LineDelete.src}></img>
            </span>
            Delete
          </div>
        </div>
        <TriggerCreate
          open={openTriggerCreate}
          onClose={() => {
            SetOpenTriggerCreate(false);
          }}
          isEditing={true}
          updateInfo={item}
        ></TriggerCreate>
        <TriggerChapterList
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirm} // 콜백 전달
        />
        <BottomRenameDrawer
          open={isEditValue}
          onClose={() => {
            setIsEditValue(false);
          }}
          onComplete={s => handleSetEpisodeNameComplete(s)}
          errorMessage="Character Limit exceeded. Please shorten your input"
          maxTextLength={500}
          lineCount={5}
          name="Trigger Condition"
          inputType={getTriggerValueInputType()}
        ></BottomRenameDrawer>
      </div>

      <div style={{position: 'relative'}}>
        <SelectDrawer
          items={visibilityItems}
          isOpen={isOpenDrawer}
          onClose={() => setIsOpenDrawer(false)}
          selectedIndex={0}
        />
      </div>
    </>
  );
};

export default TriggerListItem;
