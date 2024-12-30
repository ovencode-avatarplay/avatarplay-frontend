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

import {Box, Drawer, Typography, Button, Chip, Snackbar, Alert} from '@mui/material';
import RadioButtonGroup from '@/components/create/RadioButtonGroup';

import styles from './ContentPublishing.module.css';
import {BoldArrowDown, LineArrowRight, LineRefresh} from '@ui/Icons';

import llmModelData from '../content-LLMsetup/ContentLLMsetup.json';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import ContentImageUpload from './ContentImageUploader';
import {sendGetTagList} from '@/app/NetWork/ContentNetwork';
import MaxTextInput from '@/components/create/MaxTextInput';
import ToggleButton from '@/components/layout/shared/ToggleButton';
import ContentLLMSetup from '../content-LLMsetup/ContentLLMsetup';

interface Props {
  open: boolean;
  onClose: () => void;
  onPublish: () => void;
  LLMOpen: boolean;
  setLLMOpen: () => void;
  onLLMClose: () => void;
}

const ContentPublishing: React.FC<Props> = ({open, onClose, onPublish, LLMOpen, setLLMOpen, onLLMClose}) => {
  const dispatch = useDispatch();
  const {thumbnail, contentDescription, authorComment, visibilityType, monetization, nsfw, selectTagList} = useSelector(
    (state: RootState) => state.publish,
  );

  const [tagList, setTagList] = useState<string[]>([]);
  const [showMoreTags, setShowMoreTags] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showTagCount, setShowTagCount] = useState(3);
  const minTagCount = 1;
  const maxTagCount = 5;
  const currentLLM = useSelector((state: RootState) => state.publish.llmSetupInfo);
  const [isUploadImageDialogOpen, setUploadImageDialogOpen] = useState(false);

  useLayoutEffect(() => {
    handleGetTagList();
  }, []);

  const handleResetClicked = () => {
    dispatch(setSelectedTags([]));
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
    if (selectTagList.includes(tag)) {
      handleTagRemove(tag);
    } else {
      if (selectTagList.length >= maxTagCount) {
        setOpenSnackbar(true); // 경고 메시지 표시
        return;
      }
      dispatch(setSelectedTags([...selectTagList, tag]));
    }
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
    if (thumbnail === '') setUploadImageDialogOpen(true);
  };

  const closeUploadImageDialog = () => {
    setUploadImageDialogOpen(false);
  };

  // useEffect(() => {
  //   // contentTag의 길이에 따라 showTagCount 설정
  //   if (tagList?.length >= showTagCount) {
  //     setShowTagCount(showTagCount);
  //   }
  //   else if (tagList?.length > 1) {
  //     setShowTagCount(Math.floor(tagList.length / 2));
  //   } else {
  //     setShowTagCount(1);
  //   }
  // }, [tagList]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {width: '100vw', height: '100vh', maxWidth: '402px', margin: '0 auto', overflow: 'hidden'},
      }}
    >
      <CreateDrawerHeader title="Publish" onClose={onClose} />
      <div className={styles.drawerContainer}>
        <div className={styles.bigTitle}>Default Information</div>

        {/* Image, Prompt */}
        <ContentImageUpload
          uploadImageState={isUploadImageDialogOpen}
          initImage={thumbnail}
          onClickUploadImage={openUploadImageDialog}
          onCloseUploadImage={closeUploadImageDialog}
        />
        <div className={styles.informationArea}>
          <div className={styles.inputBox}>
            <div className={styles.smallTitle}>Introduction</div>
            <MaxTextInput promptValue="" handlePromptChange={() => {}} maxPromptLength={400} />
          </div>
        </div>
        {/* Setting List */}
        <div className={styles.settingList}>
          <div className={styles.settingItem}>
            <div className={styles.llmSettingContainer}>
              <div className={styles.settingTextArea}>
                <div className={styles.settingName}>LLM</div>
                <div className={styles.curLLM}>{llmModelData[currentLLM.llmModel].label}</div>
              </div>
              <button className={styles.llmButtonArea} onClick={setLLMOpen}>
                <img className={styles.llmButtonIcon} src={LineArrowRight.src} />
              </button>
            </div>
          </div>
          <div className={styles.settingItem}>
            <div className={styles.settingTextArea}>
              <div className={styles.settingName}>Visibility</div>
              <div className={styles.settingState}>{visibilityType}</div>
            </div>
            <ToggleButton
              size="lg"
              isToggled={visibilityType === 0 ? true : false}
              onToggle={() => {
                dispatch(setVisibility(visibilityType === 0 ? 1 : 0));
              }}
            />
          </div>
          <div className={styles.settingItem}>
            <div className={styles.settingTextArea}>
              <div className={styles.settingName}>Monetization</div>
              <div className={styles.settingState}>{monetization ? 'ON' : 'OFF'}</div>
            </div>
            <ToggleButton
              size="lg"
              isToggled={monetization}
              onToggle={() => {
                dispatch(setMonetization(!monetization));
              }}
            />
          </div>
          <div className={styles.settingItem}>
            <div className={styles.settingTextArea}>
              <div className={styles.settingName}>NSFW</div>
              <div className={styles.settingState}>{nsfw === 0 ? 'ON' : 'OFF'}</div>
            </div>
            <ToggleButton
              size="lg"
              isToggled={nsfw === 0 ? true : false}
              onToggle={() => {
                dispatch(setNSFW(nsfw === 0 ? 1 : 0));
              }}
            />
          </div>
        </div>

        {/* Tag Container */}
        <div className={styles.tagContainer}>
          <div className={styles.tagTitleArea}>
            <div className={styles.bigTitle}>Story Genre</div>
            <button className={styles.resetButtonArea} onClick={handleResetClicked}>
              <img className={styles.resetIcon} src={LineRefresh.src} />
              <div className={styles.grayText}>Reset</div>
            </button>
          </div>
          <div className={styles.grayText}>{`Please select ${minTagCount} to ${maxTagCount} tags`}</div>
          <div className={styles.tagArea}>
            {/* 태그 선택 부분 */}
            <div className={styles.tagSelect}>
              {tagList?.slice(0, showTagCount).map(
                (
                  tag, // 첫 6개 태그만 표시
                ) => (
                  <button
                    key={tag}
                    className={`${styles.tagItem} ${selectTagList.includes(tag) ? styles.selectedItem : ''}`}
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag}
                  </button>
                ),
              )}
            </div>

            {/* 추가적인 태그 내용 */}
            {showMoreTags && (
              <div className={styles.moreTagsArea}>
                {tagList?.slice(showTagCount).map(
                  (
                    tag, // 6개 이후의 태그 표시
                  ) => (
                    <button
                      key={tag}
                      className={`${styles.tagItem} ${selectTagList.includes(tag) ? styles.selectedItem : ''}`}
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </button>
                  ),
                )}
              </div>
            )}

            {/* More 버튼 */}
            <button className={styles.moreButton} onClick={handleMoreTagsToggle}>
              {showMoreTags ? 'Less' : 'More'}
              {showMoreTags ? (
                <img className={styles.moreIcon} src={BoldArrowDown.src} style={{transform: 'rotate(180deg)'}} />
              ) : (
                <img className={styles.moreIcon} src={BoldArrowDown.src} />
              )}
            </button>

            {/* Snackbar 경고 메시지 */}
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleSnackbarClose}>
              <Alert onClose={handleSnackbarClose} severity="warning">
                {`You can only select up to ${maxTagCount} tags!`}
              </Alert>
            </Snackbar>
          </div>
        </div>

        <button className={styles.buttonComplete} onClick={onPublish}>
          Complete
        </button>
      </div>
      {/* EpisodeLLMSetup 모달 */}
      <ContentLLMSetup open={LLMOpen} onClose={onLLMClose} />
    </Drawer>
  );
};

export default ContentPublishing;
