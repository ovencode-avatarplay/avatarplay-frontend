import React, {useEffect} from 'react';
import List from '@mui/material/List';
import {useSelector, useDispatch} from 'react-redux'; // Redux 상태 및 액션 사용
import {RootState} from '@/redux-store/ReduxStore'; // RootState 타입 가져오기
import TriggerListItem from './TriggerListItem';
import {removeTriggerInfo} from '@/redux-store/slices/StoryInfo'; // 트리거 삭제 액션 임포트

const TriggerList: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null); // 선택된 인덱스를 관리
  const dispatch = useDispatch();

  // Redux에서 dataPairs 배열을 가져옴

  const selectedChapterIdx = useSelector((state: RootState) => state.story.selectedChapterIdx);
  const selectedEpisodeIdx = useSelector((state: RootState) => state.story.selectedEpisodeIdx);
  const dataPairs = useSelector(
    (state: RootState) =>
      state.story.curEditingStoryInfo.chapterInfoList[selectedChapterIdx].episodeInfoList[selectedEpisodeIdx],
  ).triggerInfoList;

  const handleToggle = (index: number) => {
    // 인덱스를 받아 선택 상태를 설정
    setSelectedIndex(index === selectedIndex ? null : index);
  };
  // 트리거 리스트가 변경될 때 선택된 항목이 삭제되었는지 확인하고, 삭제된 경우 Redux에 삭제 요청
  useEffect(() => {
    if (selectedIndex !== null && (selectedIndex < 0 || selectedIndex >= dataPairs.length)) {
      // 선택된 인덱스가 범위를 벗어나면 삭제 디스패치
      dispatch(removeTriggerInfo(selectedIndex)); // 인덱스를 그대로 전달
      setSelectedIndex(null); // 선택 상태 해제
    }
  }, [dataPairs, selectedIndex, dispatch]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        width: 'var(--full-width)',
        alignItems: 'center',
      }}
    >
      {dataPairs.map((pair, index) => (
        <TriggerListItem
          key={index}
          handleToggle={() => handleToggle(index)} // 인덱스를 사용하여 함수 호출
          isSelected={selectedIndex === index} // 선택 여부를 확인
          index={index}
        />
      ))}
    </div>
  );
};

export default TriggerList;
