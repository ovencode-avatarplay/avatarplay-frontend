import CustomInput from '@/components/layout/shared/CustomInput';
import styles from './CreateCustomLorebook.module.css';
import {useEffect, useState} from 'react';
import {LineDelete, LineUpload} from '@ui/Icons';
import {CustomModuleLorebook, LorebookItem} from '@/app/NetWork/CustomModulesNetwork';
import CustomButton from '@/components/layout/shared/CustomButton';

interface Props {
  lorebook: CustomModuleLorebook;
  onSave: (updatedPrompt: CustomModuleLorebook) => void;
  onRemove: React.Dispatch<React.SetStateAction<number[]>>;
}

const CreateCustomLorebook: React.FC<Props> = ({lorebook, onSave, onRemove}) => {
  const [beforeEditLorebook, setBeforeEditLorebook] = useState<CustomModuleLorebook>(lorebook);
  const [lorebookName, setLorebookName] = useState(lorebook.title);
  const [lorebookData, setLorebookData] = useState<CustomModuleLorebook>(lorebook);

  const getLorebookMinId = (list: LorebookItem[]): number => {
    const listId = list.flatMap(list => list.lorebookItemId);

    if (listId.length === 0) {
      return 0;
    }

    const minId = Math.min(...listId);
    return minId > 0 ? 0 : minId;
  };

  const handleAddItem = () => {
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
        onChange={e => setLorebookName(e.target.value)}
        label="Custom lorebook name *"
        placeholder="please enter a title for your post"
      />
      <h2 className={styles.title2}>Data : {lorebookData.items.length}</h2>
      {renderAddButton()}

      <ul className={styles.lorebookItemList}>
        {lorebookData.items.map(item => (
          <li key={item.lorebookItemId} className={styles.lorebookItem}>
            <button className={styles.deleteButton} onClick={() => handleDeleteLorebookItem(item.lorebookItemId)}>
              <img className={styles.deleteIcon} src={LineDelete.src} />
            </button>
            <div className={styles.itemInputArea}>
              <div className={styles.itemTitle}>Keyword</div>
              <CustomInput
                inputType="Basic"
                textType="Label"
                value={item.keyword}
                onChange={e => handleInputChange(item.lorebookItemId, 'keyword', e.target.value)}
                maxLength={50}
              />
              <div className={styles.itemTitle}>Content</div>
              <CustomInput
                inputType="Basic"
                textType="Label"
                value={item.content}
                onChange={e => handleInputChange(item.lorebookItemId, 'content', e.target.value)}
                maxLength={400}
              />
            </div>
          </li>
        ))}
      </ul>

      <CustomButton size="Medium" state="Normal" type="Primary" onClick={handleOnClickSave}>
        Save
      </CustomButton>
    </div>
  );
};

export default CreateCustomLorebook;
