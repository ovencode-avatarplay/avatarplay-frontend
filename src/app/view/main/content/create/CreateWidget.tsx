import React from 'react';
import { Drawer, Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Link from 'next/link'; // Next.js의 Link를 import합니다.
import Style from './CreateWidget.module.css';

interface Props {
    open: boolean;
    onClose: () => void;
}

const CreateWidget: React.FC<Props> = ({ open, onClose }) => {
    return (
        <Drawer 
            anchor="bottom" 
            open={open} 
            onClose={onClose} 
            ModalProps={{
                BackdropProps: {
                    style: { backgroundColor: 'transparent' }, // 배경을 투명하게 설정
                },
            }}
            PaperProps={{
                sx: {
                    position: 'absolute', // BottomNavigation 위로 올라오지 않도록
                    bottom: 56, // BottomNavigation의 높이만큼 여백
                    zIndex: 50, // BottomNavigation보다 낮은 zIndex
                },
            }}
        >
            <Box className={Style.drawerBox}>
                {/* Character Navigation */}
                <Link href="/:lang/create" passHref>
                    <Box className={Style.drawerItem} onClick={onClose}>
                        <PersonIcon fontSize="large" />
                        <Typography>Character</Typography>
                    </Box>
                </Link>

                {/* Story Navigation */}
                <Link href="/:lang/create" passHref>
                    <Box className={Style.drawerItem} onClick={onClose}>
                        <BookIcon fontSize="large" />
                        <Typography>Story</Typography>
                    </Box>
                </Link>

                {/* Post Navigation */}
                <Link href="/:lang/create" passHref>
                    <Box className={Style.drawerItem} onClick={onClose}>
                        <PostAddIcon fontSize="large" />
                        <Typography>Post</Typography>
                    </Box>
                </Link>
            </Box>
        </Drawer>
    );
};

export default CreateWidget;
