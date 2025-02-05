import {BoldArrowDown} from '@ui/Icons';
import styles from './CharacterCreatePolicy.module.css';
import {useEffect, useState} from 'react';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import ContentLLMSetup from '../content-main/content-LLMsetup/ContentLLMsetup';
import llmModelData from '../content-main/content-LLMsetup/ContentLLMsetup.json';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import {sendGetTagList} from '@/app/NetWork/ContentNetwork';
import CustomHashtag from '@/components/layout/shared/CustomHashtag';

interface Props {}

const CharacterCreatePolicy: React.FC<Props> = ({}) => {
  let VisibilityData = {label: 'Visibility', items: ['Private', 'UnListed', 'Public']};
  const [visibility, setVisibility] = useState('Private');

  const [selectedllmIdx, setSelectedLlmIdx] = useState(0);
  const [llmOpen, setLlmOpen] = useState(false);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagOpen, setTagOpen] = useState(false);

  const [tagList, setTagList] = useState<string[]>([]);
  const [showMoreTags, setShowMoreTags] = useState(false);
  const maxTagCount = 5;
  const [selectedTagAlertOn, setSelectedTagAlertOn] = useState(false);

  let PositionCountryData = {label: 'Position Country', items: ['USA', 'Korea', 'Japan']};
  const [PositionCountry, setPositionCountry] = useState('USA');

  const handleSelectVisibilityItem = (value: string) => {
    setVisibility(value);
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
    if (selectedTags.includes(tag)) {
      handleTagRemove(tag);
    } else {
      if (selectedTags.length >= maxTagCount) {
        setSelectedTagAlertOn(true);
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleMoreTagsToggle = () => {
    setShowMoreTags(prev => !prev);
  };

  const handleSelectPositionCountryItem = (value: string) => {
    setPositionCountry(value);
  };

  const renderDropDownSelectDrawer = (
    title: string,
    items: string[],
    selectedItem: string,
    handler: (value: string) => void,
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    const drawerItems: SelectDrawerItem[] = items.map(item => ({
      name: item,
      onClick: () => handler(item),
    }));

    return (
      <div className={styles.titleArea}>
        <h2 className={styles.title2}>{title}</h2>
        <div className={styles.selectItem}>
          <div className={styles.selectItemText}>{selectedItem}</div>
          <button className={styles.selectItemButton} onClick={() => setIsOpen(!isOpen)}>
            <img className={styles.selectItemIcon} src={BoldArrowDown.src} />
          </button>
        </div>
        <SelectDrawer
          isOpen={isOpen}
          items={drawerItems}
          onClose={() => setIsOpen(false)}
          selectedIndex={items.indexOf(selectedItem)}
        />
      </div>
    );
  };

  const renderDropDown = (
    title: string,
    selectedItem: string,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    return (
      <div className={styles.titleArea}>
        <h2 className={styles.title2}>{title}</h2>
        <div className={styles.selectItem}>
          <div className={styles.selectItemText}>{selectedItem}</div>
          <button
            className={styles.selectItemButton}
            onClick={() => setIsOpen(prev => !prev)} // 상태 토글
          >
            <img className={styles.selectItemIcon} src={BoldArrowDown.src} />
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (tagOpen) {
      handleGetTagList();
    }
  }, [tagOpen]);

  return (
    <div className={styles.policyContainer}>
      <div className={styles.selectItemsArea}>
        {renderDropDownSelectDrawer(VisibilityData.label, VisibilityData.items, visibility, handleSelectVisibilityItem)}
        {renderDropDown('LLM', llmModelData[selectedllmIdx].label, setLlmOpen)}
        <ContentLLMSetup open={llmOpen} onClose={() => setLlmOpen(false)} onModelSelected={setSelectedLlmIdx} />
        {renderDropDown('Tag', selectedTags[0], setTagOpen)}
        {
          <CustomDrawer open={tagOpen} onClose={() => setTagOpen(false)}>
            <div className={styles.tagArea}>
              {/* 태그 선택 부분 */}
              <div className={styles.tagSelect}>
                {tagList?.map(tag => (
                  <CustomHashtag
                    text={tag}
                    onClickAction={() => handleTagSelect(tag)}
                    isSelected={selectedTags.includes(tag)}
                  ></CustomHashtag>
                ))}
              </div>
            </div>
          </CustomDrawer>
        }
        {selectedTagAlertOn && (
          <CustomPopup
            type="alert"
            title="Max Tag Count Alert"
            description={`maxTagCount : ${maxTagCount}`}
            buttons={[
              {
                label: 'Close',
                onClick: () => {
                  setSelectedTagAlertOn(false);
                },
              },
            ]}
          />
        )}

        {renderDropDownSelectDrawer(
          PositionCountryData.label,
          PositionCountryData.items,
          PositionCountry,
          handleSelectPositionCountryItem,
        )}
      </div>
      <div className={styles.radioButtonsArea}></div>
    </div>
  );
};

export default CharacterCreatePolicy;
