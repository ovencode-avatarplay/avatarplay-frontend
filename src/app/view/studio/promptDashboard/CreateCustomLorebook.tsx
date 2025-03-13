import CustomInput from '@/components/layout/shared/CustomInput';
import styles from './CreateCustomLorebook.module.css';
import React, {useEffect, useState} from 'react';
import {LinePlus, LineUpload} from '@ui/Icons';
import {CustomModuleLorebook, LorebookItem} from '@/app/NetWork/CustomModulesNetwork';
import CustomButton from '@/components/layout/shared/CustomButton';
import CustomPopup from '@/components/layout/shared/CustomPopup';

interface Props {
  lorebook: CustomModuleLorebook;
  onSave: (updatedPrompt: CustomModuleLorebook) => void;
  onCancel: () => void;
  onRemove: React.Dispatch<React.SetStateAction<number[]>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateCustomLorebook: React.FC<Props> = ({lorebook, onSave, onCancel, onRemove, setIsEditing}) => {
  const [beforeEditLorebook, setBeforeEditLorebook] = useState<CustomModuleLorebook>(lorebook);
  const [lorebookName, setLorebookName] = useState(lorebook.title);
  const [lorebookData, setLorebookData] = useState<CustomModuleLorebook>(lorebook);
  const [isSavePopupOpen, setIsSavePopupOpen] = useState<boolean>(false);

  let keywordMaxCount = 50;
  let keywordMaxTextLength = 400;
  let descriptionMaxTextLength = 400;
  const keywordCount = (keyword: string): number => {
    return keyword.split(',').filter(k => k.trim() !== '').length;
  };
  const isMaxKeywordReached = (keywordCount: number): boolean => {
    return keywordCount >= keywordMaxCount;
  };

  const getLorebookMinId = (list: LorebookItem[]): number => {
    const listId = list.flatMap(list => list.lorebookItemId);

    if (listId.length === 0) {
      return 0;
    }

    const minId = Math.min(...listId);
    return minId > 0 ? 0 : minId;
  };

  const handleAddItem = () => {
    setIsEditing(true);
    if (lorebookData.items.length >= 10) return; // 최대 10개 제한
    const newItem: LorebookItem = {
      lorebookItemId: getLorebookMinId(lorebookData.items) - 1,
      keyword: '',
      content: '',
    };
    setLorebookData(prevData => ({
      ...prevData,
      items: [...prevData.items, newItem],
    }));
  };

  const handleInputChange = (id: number, field: 'keyword' | 'content', value: string) => {
    setIsEditing(true);
    setLorebookData(prevData => ({
      ...prevData,
      items: prevData.items.map(item =>
        item.lorebookItemId === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const handleDeleteLorebookItem = (id: number) => {
    setIsEditing(true);
    setLorebookData(prevData => {
      const updatedItems = prevData.items.filter(item => item.lorebookItemId !== id);

      if (id > 0) {
        onRemove(prevRemovedItems => [...prevRemovedItems, id]);
      }

      return {
        ...prevData,
        items: updatedItems,
      };
    });
  };

  const handleOnClickSave = () => {
    const updatedItems = lorebookData.items.filter(
      item =>
        !beforeEditLorebook.items.some(
          oldItem =>
            oldItem.lorebookItemId === item.lorebookItemId &&
            oldItem.keyword === item.keyword &&
            oldItem.content === item.content,
        ),
    );

    const isTitleChanged = beforeEditLorebook.title !== lorebookName;

    const updatedLorebook = {
      ...lorebookData,
      title: isTitleChanged ? lorebookName : beforeEditLorebook.title,
      items: updatedItems,
    };

    onSave(updatedLorebook);

    setIsSavePopupOpen(false);
    setIsEditing(false);
  };

  useEffect(() => {
    setBeforeEditLorebook(lorebook);
  }, []);

  const renderAddButton = () => (
    <button className={styles.addButton} onClick={handleAddItem}>
      <img className={styles.addIcon} src={LineUpload.src} />
      <span className={styles.addButtonText}>Add New</span>
    </button>
  );

  return (
    <div className={styles.createContainer}>
      <div className={styles.lorebookDesc}>
        {`로어북은 유저의 입력 중 특정 단어가 발견되면 프롬프트에 포함시킬 내용 모음입니다. 로어북은 번역되지 않고 바로 사용됩니다. 개별 항목 400자 제한. 최대 100개 등록 가능.\n 단축키 [alt+n:추가] [alt+up:이전] [alt+down:다음]`}
      </div>
      <CustomInput
        inputType="Basic"
        textType="Label"
        value={lorebookName}
        onChange={e => {
          setLorebookName(e.target.value);

          setIsEditing(true);
        }}
        label={
          <span>
            Name <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
          </span>
        }
        placeholder="please enter a title for your post"
      />
      <h2 className={styles.title2}>{`Data (${lorebookData.items.length})`}</h2>
      {renderAddButton()}

      <ul className={styles.lorebookItemList}>
        {lorebookData.items.map(item => (
          <li key={item.lorebookItemId} className={styles.lorebookItem}>
            <div className={styles.deleteArea}>
              <button className={styles.deleteButton} onClick={() => handleDeleteLorebookItem(item.lorebookItemId)}>
                <img className={styles.deleteIcon} src={LinePlus.src} />
              </button>
            </div>
            <div className={styles.itemInputArea}>
              <div className={styles.itemTitle}>{`Keywords ${keywordCount(item.keyword)} / ${keywordMaxCount}`}</div>
              <textarea
                className={styles.itemInput}
                value={item.keyword}
                onChange={e => {
                  if (!isMaxKeywordReached(keywordCount(item.keyword)) || e.target.value.length < item.keyword.length) {
                    handleInputChange(item.lorebookItemId, 'keyword', e.target.value);
                  }
                }}
                maxLength={keywordMaxTextLength}
                placeholder="Enter keyword"
              />
              <div
                className={styles.itemTitle}
              >{`Description ${item.content.length} / ${descriptionMaxTextLength}`}</div>
              <textarea
                className={styles.itemInput}
                value={item.content}
                onChange={e => handleInputChange(item.lorebookItemId, 'content', e.target.value)}
                maxLength={descriptionMaxTextLength}
                placeholder="Enter keyword"
              />
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.buttonArea}>
        <CustomButton
          size="Medium"
          state="Normal"
          type="Tertiary"
          customClassName={[styles.bottomButton]}
          onClick={() => onCancel()}
        >
          Cancel
        </CustomButton>
        <CustomButton
          size="Medium"
          state="Normal"
          type="Primary"
          customClassName={[styles.bottomButton]}
          onClick={() => {
            setIsSavePopupOpen(true);
          }}
        >
          Submit
        </CustomButton>
      </div>
      {isSavePopupOpen && (
        <CustomPopup
          type="alert"
          title="Do you want to submit
this lorebook?"
          buttons={[
            {
              label: 'No',
              onClick: () => {
                setIsSavePopupOpen(false);
              },
            },
            {
              label: 'Yes',
              isPrimary: true,
              onClick: handleOnClickSave,
            },
          ]}
        />
      )}
    </div>
  );
};

export default CreateCustomLorebook;
