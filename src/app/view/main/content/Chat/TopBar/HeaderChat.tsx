import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import { Avatar, IconButton } from '@mui/material';
import styles from '@chats/Styles/StyleChat.module.css';

// 1. 인터페이스 정의
interface ChatTopBarProps {
    username: string;           // 대화 상대 이름
    description: string;        // 대화 상대 설명
    avatarUrl: string;          // 대화 상대 아바타 이미지 URL
    onBackClick: () => void;    // 뒤로 가기 버튼 클릭 핸들러
    onMoreClick: () => void;    // 더보기 버튼 클릭 핸들러
    onToggleBackground: () => void; // 배경 보기/숨기기 클릭 핸들러
}

// 2. props를 받아서 TopBar 컴포넌트 구현
const TopBar: React.FC<ChatTopBarProps> = ({
    username,
    description,
    avatarUrl,
    onBackClick,
    onMoreClick,
    onToggleBackground
}) => {
    return (
        <div className={styles.topBar}>
            <div className={styles.left}>
                {/* 뒤로 가기 버튼 */}
                <IconButton className={styles.backButton} onClick={onBackClick}>
                    <ArrowBackIcon />
                </IconButton>

                {/* 대화 상대 아바타 */}
                <Avatar
                    src={avatarUrl}
                    alt={username}
                    className={styles.avatar}
                />

                {/* 대화 상대 정보 */}
                <div className={styles.userInfo}>
                    <span className={styles.username}>{username}</span>
                    <span className={styles.description}>{description}</span>
                </div>
            </div>
            <div className={styles.right}>
                {/* 배경 보기/숨기기 버튼 */}
                <IconButton className={styles.BackgroundButton} onClick={onToggleBackground}>
                    <WallpaperIcon />
                </IconButton>

                {/* 더보기 버튼 */}
                <IconButton className={styles.moreButton} onClick={onMoreClick}>
                    <MoreVertIcon />
                </IconButton>
            </div>


        </div>
    );
};

export default TopBar;
