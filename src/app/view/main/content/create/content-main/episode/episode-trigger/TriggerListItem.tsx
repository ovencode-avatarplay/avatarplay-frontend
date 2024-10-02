// 파일 경로: components/TriggerListItem.tsx

import React, { useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { ArrowForwardIos } from '@mui/icons-material';
import { DataPair, TriggerMainDataType } from '@/types/apps/dataTypes'; // DataPair 타입 가져오기
import ChangeBehaviour from './ChangeBehaviour'; // ChangeBehaviour 모달 임포트
import styles from './TriggerListItem.module.css'; // CSS 모듈 임포트

interface TriggerListItemProps {
    item: DataPair; // Redux에서 가져온 DataPair 타입의 데이터
    handleToggle: (key: TriggerMainDataType) => () => void;
    isSelected: boolean; // 선택 여부 확인
}

const TriggerListItem: React.FC<TriggerListItemProps> = ({ item, handleToggle, isSelected }) => {
    const [isModalOpen, setModalOpen] = useState(false); // 모달 열림 상태 관리

    const handleModalOpen = () => {
        setModalOpen(true); // 모달 열기
    };

    const handleModalClose = () => {
        setModalOpen(false); // 모달 닫기
    };

    return (
        <>
            <ListItem
                className={`${styles.listItem} ${isSelected ? styles.selected : ''}`} // 선택 여부에 따른 클래스 적용
                disablePadding
            >
                <ListItemIcon>
                    <ListItemText
                        className={styles.listItemText}
                        primary={<span className={styles.primaryText}>{`${item.main.key}`}</span>}
                    />

                </ListItemIcon>
                <ListItemText
                    className={styles.listItemText}
                    primary={<span className={styles.primaryText}>{`${item.name}`}</span>}
                />
                <IconButton edge="end" aria-label="comments" className={styles.iconButton} onClick={handleModalOpen}>
                    <ArrowForwardIos />
                </IconButton>
            </ListItem>

            {/* ChangeBehaviour 모달에 item 데이터 전달 */}
            <ChangeBehaviour open={isModalOpen} onClose={handleModalClose} item={item} />
        </>
    );
};

export default TriggerListItem;
