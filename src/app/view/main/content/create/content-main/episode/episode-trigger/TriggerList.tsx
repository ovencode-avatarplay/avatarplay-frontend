import React, {useEffect} from 'react';
import List from '@mui/material/List';
import {useSelector, useDispatch} from 'react-redux'; // Redux 상태 및 액션 사용
import {RootState} from '@/redux-store/ReduxStore'; // RootState 타입 가져오기
import TriggerListItem from './TriggerListItem';
import {TriggerMainDataType} from '@/types/apps/dataTypes';
import {removeTriggerInfo} from '@/redux-store/slices/EpisodeInfo'; // 트리거 삭제 액션 임포트

const TriggerList: React.FC = () => {
  const [selected, setSelected] = React.useState<TriggerMainDataType | null>(null); // 선택된 항목을 관리
  const dispatch = useDispatch();

  // Redux에서 dataPairs 배열을 가져옴
  const dataPairs = useSelector((state: RootState) => state.episode.currentEpisodeInfo.triggerInfoList);
  const current = useSelector((state: RootState) => state.episode.currentEpisodeInfo);

  const handleToggle = (key: TriggerMainDataType) => () => {
    // 선택한 항목의 key를 상태로 설정
    setSelected(key === selected ? null : key);
  };

  // 트리거 리스트가 변경될 때 선택된 항목이 삭제되었는지 확인하고, 삭제된 경우 Redux에 삭제 요청
  useEffect(() => {
    const selectedTrigger = dataPairs.find(pair => pair.id === selected); // 선택된 id와 일치하는 트리거를 찾음
    if (!selectedTrigger && selected !== null) {
      // 선택된 트리거가 목록에 없으면 삭제 디스패치
      dispatch(removeTriggerInfo(selected)); // selected는 id이므로 그대로 전달
      setSelected(null); // 선택 상태 해제
    }
  }, [dataPairs, selected, dispatch]);

  return (
    <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
      {dataPairs.map((pair, index) => (
        <TriggerListItem
          key={index}
          item={pair}
          handleToggle={handleToggle}
          isSelected={selected === pair.triggerType} // 선택 여부를 확인
        />
      ))}
    </List>
  );
};

export default TriggerList;
