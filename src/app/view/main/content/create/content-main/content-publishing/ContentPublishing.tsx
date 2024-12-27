//Drawer
// ContentPublishing.tsx
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {
  setSelectedTags,
  setVisibility,
  setMonetization,
  setNSFW,
  setContentDescription,
  setAuthorComment,
} from '@/redux-store/slices/PublishInfo';

import {Box, Drawer, Typography, TextField, Button, Chip, Snackbar, Alert} from '@mui/material';
import RadioButtonGroup from '@/components/create/RadioButtonGroup';

import styles from './ContentPublishing.module.css';

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import ContentImageUpload from './ContentImageUploader';
import {sendGetTagList} from '@/app/NetWork/ContentNetwork';
import {string} from 'valibot';
import {LineUpload} from '@ui/Icons';
import MaxTextInput from '@/components/create/MaxTextInput';

interface Props {
  open: boolean;
  onClose: () => void;
  onPublish: () => void;
}

const ContentPublishing: React.FC<Props> = ({open, onClose, onPublish}) => {
  const dispatch = useDispatch();
  const {thumbnail, contentDescription, authorComment, visibilityType, monetization, nsfw, selectTagList} = useSelector(
    (state: RootState) => state.publish,
  );

  const [tagList, setTagList] = useState<string[]>([]);
  const [showMoreTags, setShowMoreTags] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showTagCount, setShowTagCount] = useState(6);
  const [isUploadImageDialogOpen, setUploadImageDialogOpen] = useState(false);

  useLayoutEffect(() => {
    handleGetTagList();
  }, []);

  const handleContentDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setContentDescription(e.target.value));
  };

  const handleAuthorCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAuthorComment(e.target.value));
  };

  const handleGetTagList = async () => {
    try {
      const response = await sendGetTagList({}); // 수정된 반환 타입 반영

      if (response.data) {
        const tagData: string[] = response.data?.tagList;
        setTagList(tagData);
      } else {
        console.warn('No tags found in the response.');
        setTagList([]);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
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

  const openUploadImageDialog = () => {
    setUploadImageDialogOpen(true);
  };

  const closeUploadImageDialog = () => {
    setUploadImageDialogOpen(false);
  };

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

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {width: '100vw', height: '100vh'},
      }}
    >
      <CreateDrawerHeader title="Publish" onClose={onClose} />
      <div className={styles.drawerContainer}>
        <div className={styles.bigTitle}>Default Information</div>
        <div className={styles.informationArea}>
          <div className={styles.imageArea}>
            <div className={styles.smallTitle}>Cover Image</div>
            <div className={styles.imageInputBox}>
              <img className={styles.uploadIcon} src={LineUpload.src} />
              <div className={styles.uploadText}>Upload</div>
            </div>
          </div>
          <div className={styles.inputBox}>
            <div className={styles.smallTitle}>Introduction</div>
            <MaxTextInput promptValue="" handlePromptChange={() => {}} maxPromptLength={400} />
          </div>
        </div>
        <div className={styles.settingList}>
          <div className={styles.settingItem}></div>
          <div className={styles.settingItem}></div>
          <div className={styles.settingItem}></div>
          <div className={styles.settingItem}></div>
        </div>

        {/* 첫 번째 설정 박스 */}
        <div className={styles.settingBox}>
          <ContentImageUpload
            uploadImageState={isUploadImageDialogOpen}
            initImage={thumbnail}
            onClickUploadImage={openUploadImageDialog}
            onCloseUploadImage={closeUploadImageDialog}
          />

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
        </div>

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
      </div>
    </Drawer>
  );
};

export default ContentPublishing;
