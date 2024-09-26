// 파일 경로: components/TriggerList.tsx

import * as React from 'react';
import List from '@mui/material/List';
import { useSelector } from 'react-redux'; // Redux 상태를 가져오기 위한 useSelector
import { RootState } from '@/redux-store/ReduxStore'; // RootState 타입 가져오기
import TriggerListItem from './TriggerListItem';

const TriggerList: React.FC = () => {
    const [selected, setSelected] = React.useState<string | null>(null); // 선택된 항목을 관리

    // Redux에서 dataPairs 배열을 가져옴
    const dataPairs = useSelector((state: RootState) => state.create.dataPairs);

    const handleToggle = (key: string) => () => {
        // 선택한 항목의 key를 상태로 설정
        setSelected(key === selected ? null : key);
    };

    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {dataPairs.map((pair, index) => (
                <TriggerListItem
                    key={index}
                    item={pair}
                    handleToggle={handleToggle}
                    isSelected={selected === pair.main.key} // 선택 여부를 확인
                />
            ))}
        </List>
    );
};

export default TriggerList;
