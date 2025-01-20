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

import {Drawer, Snackbar, Alert, Modal} from '@mui/material';

import styles from './ContentPublishing.module.css';
import {BoldArrowDown, LineArrowRight, LineRefresh} from '@ui/Icons';

import llmModelData from '../content-LLMsetup/ContentLLMsetup.json';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import ContentImageUpload from './ContentImageUploader';
import {sendGetTagList} from '@/app/NetWork/ContentNetwork';
import MaxTextInput, {displayType} from '@/components/create/MaxTextInput';
import ContentLLMSetup from '../content-LLMsetup/ContentLLMsetup';
import {SelectDrawerItem} from '@/components/create/SelectDrawer';
import CustomButton from '@/components/layout/shared/CustomButton';
import CustomSettingButton from '@/components/layout/shared/CustomSettingButton';

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

  const [isUploadImageDialogOpen, setUploadImageDialogOpen] = useState(false);
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
  const [isMonetizationOpen, setIsMonetizationOpen] = useState(false);

  const currentLLM = useSelector((state: RootState) => state.publish.llmSetupInfo);
  const visibilityItems: SelectDrawerItem[] = [
    {
      name: 'Private',
      onClick: () => {
        dispatch(setVisibility(0));
      },
    },
    {
      name: 'Unlisted',
      onClick: () => {
        dispatch(setVisibility(1));
      },
    },
    {
      name: 'Public',
      onClick: () => {
        dispatch(setVisibility(2));
      },
    },
  ];
  const monetizationItems: SelectDrawerItem[] = [
    {
      name: 'Fan',
      onClick: () => {
        dispatch(setMonetization(false));
      },
    },
    {
      name: 'Original',
      onClick: () => {
        dispatch(setMonetization(true));
      },
    },
  ];

  const [tagList, setTagList] = useState<string[]>([]);
  const [showMoreTags, setShowMoreTags] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showTagCount, setShowTagCount] = useState(3);
  const minTagCount = 1;
  const maxTagCount = 5;

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

  const countHiddenTags = () => {
    return tagList.slice(showTagCount).filter(tag => selectTagList.includes(tag)).length;
  };

  const handleIntroductionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setContentDescription(event.target.value));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{
        sx: {background: 'rgba(0, 0, 0, 0.7)'},
      }}
    >
      <div className={styles.modalContainer}>
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
              <MaxTextInput
                promptValue={contentDescription}
                handlePromptChange={handleIntroductionChange}
                maxPromptLength={400}
                displayDataType={displayType.Label}
                labelText="Introduction"
              />
            </div>
          </div>

          {/* Setting List */}
          <div className={styles.settingList}>
            <CustomSettingButton
              type="text"
              name="LLM"
              selectedValue={llmModelData[currentLLM.llmModel].label}
              onClick={setLLMOpen}
              isOpen={false}
              selectedIndex={0}
            />
            <CustomSettingButton
              type="select"
              name="Visibility"
              selectedValue={visibilityItems[visibilityType]?.name}
              items={visibilityItems}
              onClick={() => setIsVisibilityOpen(true)}
              isOpen={isVisibilityOpen}
              onClose={() => setIsVisibilityOpen(false)}
              selectedIndex={visibilityType}
            />
            <CustomSettingButton
              type="select"
              name="Monetization"
              selectedValue={monetizationItems[monetization ? 1 : 0]?.name}
              items={monetizationItems}
              onClick={() => setIsMonetizationOpen(true)}
              isOpen={isMonetizationOpen}
              onClose={() => setIsMonetizationOpen(false)}
              selectedIndex={monetization ? 1 : 0}
            />

            <CustomSettingButton
              type="toggle"
              name="NSFW"
              selectedValue={nsfw === 0 ? 'ON' : 'OFF'}
              onClick={() => {}}
              isToggled={nsfw === 0}
              onToggle={() => {
                dispatch(setNSFW(nsfw === 0 ? 1 : 0));
              }}
            />
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
                {showMoreTags ? 'Less' : `More ${countHiddenTags() > 0 ? `(${countHiddenTags()})` : ''}`}
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

          <CustomButton
            size="Large"
            state="Normal"
            type="Primary"
            customClassName={[styles.buttonComplete]}
            onClick={onPublish}
          >
            Complete
          </CustomButton>
        </div>
        {/* EpisodeLLMSetup 모달 */}
        <ContentLLMSetup open={LLMOpen} onClose={onLLMClose} />
      </div>
    </Modal>
  );
};

export default ContentPublishing;
