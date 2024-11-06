import React, {useState} from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import {ArrowForwardIos} from '@mui/icons-material';
import {useSelector} from 'react-redux'; // Redux에서 상태를 가져오기 위해 추가
import {RootState} from '@/redux-store/ReduxStore'; // RootState 타입 가져오기
import {TriggerTypeNames} from '@/types/apps/DataTypes'; // TriggerInfo 타입 가져오기
import ChangeBehaviour from './ChangeBehaviour'; // ChangeBehaviour 모달 임포트
import styles from './TriggerListItem.module.css'; // CSS 모듈 임포트

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

  return (
    <>
      <ListItem
        className={`${styles.listItem} ${isSelected ? styles.selected : ''}`} // 선택 여부에 따른 클래스 적용
        disablePadding
        onClick={handleToggle} // 함수 자체를 호출
      >
        <ListItemIcon>
          <ListItemText
            className={styles.listItemText}
            primary={<span className={styles.primaryText}>{`${TriggerTypeNames[item.triggerType]}`}</span>}
          />
        </ListItemIcon>
        <ListItemText
          className={styles.listItemText}
          primary={<span className={styles.primaryText}>{`${item.name}`}</span>} // 트리거 이름 표시
        />
        <IconButton edge="end" aria-label="comments" onClick={handleModalOpen}>
          <ArrowForwardIos className={styles.iconButton} />
        </IconButton>
      </ListItem>

      {/* ChangeBehaviour 모달에 index 데이터 전달 */}
      <ChangeBehaviour open={isModalOpen} onClose={handleModalClose} index={index} />
    </>
  );
};

export default TriggerListItem;
