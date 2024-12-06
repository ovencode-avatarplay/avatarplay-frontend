'use client';

import React, {useState} from 'react';

import {Box, Button} from '@mui/material';
import ProfileTopEditMenu from './ProfileTopEditMenu';
import ProfileInfo from './ProfileInfo';
import profileData from 'data/profile/profile-data.json';
import ProfileTopViewMenu from './ProfileTopViewMenu';

const ProfileBase = () => {
  const [editMode, setEditMode] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<number>(1);

  const handleSelectCharacter = (id: number) => {
    setSelectedId(id); // 선택된 ID 상태 업데이트
  };

  const selectedProfile = profileData.find(profile => profile.id === selectedId);

  return (
    <div>
      <Button
        onClick={() => {
          setEditMode(!editMode);
        }}
      >
        SwitchEditMode for Dev ({editMode ? 'true' : 'false'})
      </Button>
      {editMode ? (
        <ProfileTopEditMenu profiles={profileData} selectedId={selectedId} onSelectCharacter={handleSelectCharacter} />
      ) : selectedProfile ? (
        <ProfileTopViewMenu profile={selectedProfile} onBack={() => console.log('Back button clicked')} />
      ) : (
        <div>프로필을 찾을 수 없습니다.</div>
      )}
      {selectedProfile ? (
        <ProfileInfo profile={selectedProfile} editMode={editMode} />
      ) : (
        <div>프로필을 찾을 수 없습니다.</div>
      )}
      <Box>Profile {selectedId}</Box>
    </div>
  );
};

export default ProfileBase;
