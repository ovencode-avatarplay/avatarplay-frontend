// 파일 경로: components/TriggerListItem.tsx

import React, { useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { ArrowForwardIos } from '@mui/icons-material';
import { TriggerMainDataType } from '@/types/apps/dataTypes'; // TriggerInfo 타입 가져오기
import { TriggerInfo } from '@/types/apps/content/episode/triggerInfo';
import ChangeBehaviour from './ChangeBehaviour'; // ChangeBehaviour 모달 임포트
import styles from './TriggerListItem.module.css'; // CSS 모듈 임포트

interface TriggerListItemProps {
    item: TriggerInfo; // Redux에서 가져온 TriggerInfo 타입의 데이터
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
                        primary={<span className={styles.primaryText}>{`${item.triggerType}`}</span>}
                    />
                </ListItemIcon>
                <ListItemText
                    className={styles.listItemText}
                    primary={<span className={styles.primaryText}>{`${item.id}`}</span>} // 이름 대신 id 표시 (TriggerInfo에는 name이 없으므로 적절한 필드 사용)
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
