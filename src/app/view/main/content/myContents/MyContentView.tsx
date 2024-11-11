import React, {useState} from 'react';
import {Box, Tab, Tabs, IconButton, Select, MenuItem} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import StoryIcon from '@mui/icons-material/Book';

import styles from './MyContentView.module.css';

import MyContentListItem from './MyContentListItem';

const MyContentTabView = () => {
  const [tabValue, setTabValue] = useState(0);
  const [sortOrder, setSortOrder] = useState('Latest');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box className={styles.container}>
      <Tabs value={tabValue} onChange={handleTabChange} className={styles.tabs} variant="fullWidth">
        <Tab icon={<StoryIcon />} label="Story" />
        <Tab icon={<ChatIcon />} label="Chat" />
      </Tabs>

      <Box className={styles.dropdownContainer}>
        <Select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className={styles.dropdown}>
          <MenuItem value="Latest">Latest</MenuItem>
          <MenuItem value="MostPlayed">Most Played</MenuItem>
          <MenuItem value="Progress">Progress</MenuItem>
        </Select>
      </Box>

      <Box className={styles.contentList}>
        {' '}
        {/* TODO API 생기면 내 컨텐츠 불러오기 */}
        {tabValue === 0 ? (
          <>
            {[...Array(10)].map((_, index) => (
              <MyContentListItem
                key={index}
                thumbnail="./images/001.png"
                contentName="ContentName"
                chapterName="ChapterName"
                episodeName="EpisodeName"
                intimacy={10}
                chatCount={10}
                lastPlayedDate="2024-11-04 16:00 pm"
                contentInfo="ContentInfo"
              />
            ))}
          </>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};
export default MyContentTabView;
