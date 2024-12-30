import React, {useState} from 'react';
import {useSelector} from 'react-redux'; // Redux에서 상태를 가져오기 위해 추가
import {RootState} from '@/redux-store/ReduxStore'; // RootState 타입 가져오기
import {TriggerActionType, TriggerTypeNames} from '@/types/apps/DataTypes'; // TriggerInfo 타입 가져오기
import styles from './TriggerListItem.module.css'; // CSS 모듈 임포트
import {
  Arrow_Trigger,
  AudioFile,
  BoldPlay,
  edit1Pixel,
  editPlusOpacity,
  LineArrowRight,
  LineArrowSwap,
  LineCopy,
  LineDelete,
} from '@ui/Icons';
import {TriggerMediaState} from '@/types/apps/content/episode/TriggerInfo';

interface TriggerListItemProps {
  handleToggle: () => void; // 함수 형식을 () => void로 수정
  isSelected: boolean; // 선택 여부 확인
  index: number; // 인덱스 전달
}

const TriggerListItem: React.FC<TriggerListItemProps> = ({handleToggle, isSelected, index}) => {
  const [isModalOpen, setModalOpen] = useState(false); // 모달 열림 상태 관리

  // Redux 상태에서 triggerInfoList 배열을 가져오고, 전달받은 index를 통해 해당 item을 탐색
  const item = useSelector((state: RootState) => state.episode.currentEpisodeInfo.triggerInfoList[index]);

  const handleModalOpen = () => {
    setModalOpen(true); // 모달 열기
  };

  const handleModalClose = () => {
    setModalOpen(false); // 모달 닫기
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
            <div className={styles.videoEditIcon}>
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
            <div className={styles.videoEditIcon}>
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
            <div className={styles.editIcon}>
              <img src={editPlusOpacity.src} alt="Edit" />
            </div>
          </div>
        );
    }
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
            <div className={styles.input}>
              {' '}
              Trigger ConditionTrigger ConditionTrigger ConditionTrigger ConditionTrigger ConditionTrigger
              ConditionTrigger ConditionTrigger ConditionTrigger ConditionTrigger Condition
            </div>
          </div>
        </div>
        <div className={styles.triggerActions}>
          <div className={styles.actionButton} onClick={() => {}}>
            <span className={styles.editButton}>
              <img src={edit1Pixel.src}></img>
            </span>
            <span>Edit</span>
          </div>
          <div className={styles.actionButton} onClick={() => {}}>
            <span className={styles.normalButton}>
              <img src={LineArrowSwap.src}></img>
            </span>
            <span>Move to</span>
          </div>
          <div className={styles.actionButton} onClick={() => {}}>
            <span className={styles.normalButton}>
              <img src={LineCopy.src}></img>
            </span>
            Duplicate
          </div>
          <div className={`${styles.actionButton} ${styles.delete}`} onClick={() => {}}>
            <span className={styles.normalButtonRed}>
              <img src={LineDelete.src}></img>
            </span>
            Delete
          </div>
        </div>
      </div>
    </>
  );
};

export default TriggerListItem;
