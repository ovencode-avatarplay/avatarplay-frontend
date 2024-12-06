import React, {useState} from 'react';

import {Drawer, Box, Typography, Button} from '@mui/material';

import Link from 'next/link';

import styles from './SelectProfileWidget.module.css';
import getLocalizedText from '@/utils/getLocalizedText';
import SelectProfileItem from './SelectProfileItem';
import {Profile} from './ProfileType';

interface Props {
  open: boolean;
  onClose: () => void;
  profiles: Profile[]; // 프로필 목록
  isEditing: boolean;
}

const SelectProfileWidget: React.FC<Props> = ({open, onClose, profiles, isEditing}) => {
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  const handleProfileSelect = (id: number) => {
    setSelectedProfileId(id);
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: styles.drawerContainer, // 클래스 이름으로 스타일 적용
      }}
    >
      <Box>
        {/* Drawer 타이틀 */}
        <Typography variant="h5" className={styles.drawerTitle}>
          Select Profile
        </Typography>

        {/* 프로필 리스트 */}
        <Box className={styles.profileList}>
          {profiles.map(profile => (
            <SelectProfileItem
              key={profile.id}
              profile={{...profile, isSelected: profile.id === selectedProfileId}} // 선택 상태 전달
              isEditing={false}
              onSelect={() => handleProfileSelect(profile.id)}
            />
          ))}
          {isEditing && (
            <SelectProfileItem
              key={-1}
              profile={{
                id: -1,
                type: 'Character',
                avatar: '',
                name: 'Add New Profile',
                status: '',
                isSelected: false,
                posts: 0,
                followers: 0,
                following: 0,
              }}
              isEditing={true}
              onSelect={() => handleProfileSelect(-1)}
            />
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default SelectProfileWidget;
