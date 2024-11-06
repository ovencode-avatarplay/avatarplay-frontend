//Drawer
// ContentPublishing.tsx
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {
  setSelectedTags,
  setVisibility,
  setMonetization,
  setNSFW,
  setLanguageType,
  setContentDescription,
  setAuthorComment,
  setAuthorName,
} from '@/redux-store/slices/PublishInfo';

import {Box, Drawer, Typography, TextField, Button, Select, MenuItem, Chip, Snackbar, Alert} from '@mui/material';
import RadioButtonGroup from '@/components/create/RadioButtonGroup';

import styles from './ContentPublishing.module.css';

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';

interface Props {
  open: boolean;
  onClose: () => void;
  onPublish: () => void;
  tagList: string[];
}

const ContentPublishing: React.FC<Props> = ({open, onClose, onPublish, tagList}) => {
  const dispatch = useDispatch();
  const {
    languageType,
    contentDescription,
    authorName,
    authorComment,
    visibilityType,
    monetization,
    nsfw,
    selectTagList,
  } = useSelector((state: RootState) => state.publish);

  const [showMoreTags, setShowMoreTags] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showTagCount, setShowTagCount] = useState(6);

  useEffect(() => {
    // contentTag의 길이에 따라 showTagCount 설정
    if (tagList?.length >= 6) {
      setShowTagCount(6);
    } else if (tagList?.length > 1) {
      setShowTagCount(Math.floor(tagList.length / 2));
    } else {
      setShowTagCount(1);
    }
  }, [tagList]);

  const handleContentDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setContentDescription(e.target.value));
  };

  const handleAuthorCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAuthorComment(e.target.value));
  };

  const handleTagSelect = (tag: string) => {
    if (selectTagList.length >= 7) {
      setOpenSnackbar(true); // 경고 메시지 표시
      return;
    }
    dispatch(setSelectedTags([...selectTagList, tag]));
  };

  const handleTagRemove = (tag: string) => {
    dispatch(setSelectedTags(selectTagList.filter(t => t !== tag)));
  };

  const handleMoreTagsToggle = () => {
    setShowMoreTags(prev => !prev);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {width: '100vw', height: '100vh'},
      }}
    >
      <Box className={styles.drawerContainer}>
        <CreateDrawerHeader title="Publishing Setup" onClose={onClose} />

        {/* 첫 번째 설정 박스 */}
        <Box className={styles.settingBox}>
          <Typography variant="h6">Language Select</Typography>

          <Select
            fullWidth
            variant="outlined"
            value={languageType}
            onChange={e => dispatch(setLanguageType(e.target.value as number))}
          >
            <MenuItem value={0}>English</MenuItem>
            <MenuItem value={1}>Korean</MenuItem>
            <MenuItem value={2}>Arab</MenuItem>
            {/* TODO 언어 테이블 리스트 / enum 등 받아와서 설정*/}
          </Select>

          <Typography variant="subtitle1" className={styles.label}>
            Content Introduction
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={contentDescription}
            onChange={handleContentDescriptionChange}
          />

          <Typography variant="subtitle1" className={styles.label}>
            Creator's Comment
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={authorComment}
            onChange={handleAuthorCommentChange}
          />
        </Box>

        {/* 두 번째 설정 박스 */}
        {tagList != null && (
          <Box className={styles.settingBox}>
            <Typography variant="h6">Content Tag</Typography>

            <Box display="flex" alignItems="center" justifyContent="right" className={styles.tagContainer}>
              {selectTagList.length > 0 ? null : (
                <Typography variant="body2" color="textSecondary" sx={{padding: '8px'}}>
                  Please Select 1~7 Tags
                </Typography>
              )}
              <Button variant="contained" onClick={() => dispatch(setSelectedTags([]))} sx={{marginLeft: '16px'}}>
                Reset
              </Button>
            </Box>
            <Box display="flex" flexWrap="wrap" sx={{flexGrow: 1}}>
              {selectTagList.map(tag => (
                <Chip key={tag} label={tag} onDelete={() => handleTagRemove(tag)} className={styles.chip} />
              ))}
            </Box>
            {/* 태그 선택 부분 */}
            <Box className={styles.tagSelect}>
              {tagList?.slice(0, showTagCount).map(
                (
                  tag, // 첫 6개 태그만 표시
                ) => (
                  <Button
                    key={tag}
                    variant="outlined"
                    onClick={() => handleTagSelect(tag)}
                    disabled={selectTagList.includes(tag)}
                  >
                    {tag}
                  </Button>
                ),
              )}
            </Box>

            {/* 추가적인 태그 내용 */}
            {showMoreTags && (
              <Box className={styles.moreTags}>
                {tagList?.slice(showTagCount).map(
                  (
                    tag, // 6개 이후의 태그 표시
                  ) => (
                    <Button
                      key={tag}
                      variant="outlined"
                      onClick={() => handleTagSelect(tag)}
                      disabled={selectTagList.includes(tag)}
                    >
                      {tag}
                    </Button>
                  ),
                )}
              </Box>
            )}

            {/* More 버튼 */}
            <Button variant="outlined" onClick={handleMoreTagsToggle}>
              {showMoreTags ? 'Show Less' : 'More'}
            </Button>
          </Box>
        )}
        {/* 라디오 버튼 그룹 추가 */}
        <RadioButtonGroup
          title="Visibility"
          description="공개 설정"
          options={[
            {value: 0, label: 'Private'},
            {value: 1, label: 'Unlisted'},
            {value: 2, label: 'Public'},
          ]}
          selectedValue={visibilityType}
          onChange={value => dispatch(setVisibility(value as number))}
        />
        <RadioButtonGroup
          title="Monetization"
          description="수익화 제한"
          options={[
            {value: true, label: 'ON'},
            {value: false, label: 'OFF'},
          ]}
          selectedValue={monetization}
          onChange={value => dispatch(setMonetization(value as boolean))}
        />
        <RadioButtonGroup
          title="NSFW"
          description="성인 컨텐츠"
          options={[
            {value: 0, label: 'ON'},
            {value: 1, label: 'OFF'},
          ]}
          selectedValue={nsfw}
          onChange={value => dispatch(setNSFW(value as number))}
        />
        <Button variant="outlined" onClick={onPublish}>
          Publish!
        </Button>

        {/* Snackbar 경고 메시지 */}
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="warning">
            You can only select up to 7 tags!
          </Alert>
        </Snackbar>
      </Box>
    </Drawer>
  );
};

export default ContentPublishing;
