// 파일 경로: components/TriggerList.tsx

import * as React from 'react';
import List from '@mui/material/List';
import { useSelector } from 'react-redux'; // Redux 상태를 가져오기 위한 useSelector
import { RootState } from '@/redux-store/ReduxStore'; // RootState 타입 가져오기
import TriggerListItem from './TriggerListItem';

import { DataPair, MainData, SubData, TriggerMainDataType, TriggerSubDataType } from '@/types/apps/dataTypes';
const TriggerList: React.FC = () => {
    const [selected, setSelected] = React.useState<TriggerMainDataType | null>(null); // 선택된 항목을 관리

    // Redux에서 dataPairs 배열을 가져옴
    const dataPairs = useSelector((state: RootState) => state.episode.currentEpisodeInfo.triggerInfoList);
    const current = useSelector((state: RootState) => state.episode.currentEpisodeInfo);

    const handleToggle = (key: TriggerMainDataType) => () => {
        // 선택한 항목의 key를 상태로 설정
        setSelected(key === selected ? null : key);
    };
    console.log(dataPairs)

    

    const data : DataPair = {
        id: 0,
        name: "123123123",
        main: null,
        sub: null,
        data : {
            "id": 0,
            "triggerType2": 0,
            "triggerValueIntimacy": 0,
            "triggerValueChatCount": 99,
            "triggerValueKeyword": "string",
            "triggerValueTimeMinute": 0,
            "triggerActionType": 0,
            "actionChangeEpisodeId": 0,
            "actionChangePrompt": "string",
            "actionIntimacyPoint": 0,
            "maxIntimacyCount": 0,
            "actionCoversationList": [
              {
                "id": 0,
                "conversationType": 0,
                "user": "string",
                "character": "string"
              }
            ]
          }
    }
              

    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <TriggerListItem
                    key={0}
                    item={data}
                    handleToggle={handleToggle}
                    isSelected={selected === 0} // 선택 여부를 확인
                />
            {/* {dataPairs.map((pair, index) => (
                <TriggerListItem
                    key={index}
                    item={data}
                    handleToggle={handleToggle}
                    isSelected={selected === pair.main.key} // 선택 여부를 확인
                />
            ))} */}
        </List>
    );
};

export default TriggerList;
