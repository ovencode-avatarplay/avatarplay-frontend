import CustomInput from '@/components/layout/shared/CustomInput';
import styles from './CreateCustomLorebook.module.css';
import {useState} from 'react';
import {CustomPromptData} from './PromptDashboard';
import CustomButton from '@/components/layout/shared/CustomButton';
import {LineDelete, LineUpload} from '@ui/Icons';

interface Props {
  lorebook: CustomPromptData;
  onSave: (updatedPrompt: CustomPromptData) => void;
}

export interface LorebookItem {
  id: number;
  keyword: string;
  content: string;
}

export interface LorebookData {
  id: number;
  items: LorebookItem[];
}

const CreateCustomLorebook: React.FC<Props> = ({lorebook, onSave}) => {
  const [lorebookName, setLorebookName] = useState(lorebook.name);
  const [lorebookData, setLorebookData] = useState<LorebookData>({
    id: lorebook.id,
    items: [],
  });

  const handleAddItem = () => {
    if (lorebookData.items.length >= 10) return; // 최대 10개 제한
    const newItem: LorebookItem = {
      id: lorebookData.items.length > 0 ? Math.min(...lorebookData.items.map(item => item.id)) - 1 : -1,
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
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

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
          <li key={item.id} className={styles.lorebookItem}>
            <button className={styles.deleteButton}>
              <img className={styles.deleteIcon} src={LineDelete.src} />
            </button>
            <div className={styles.itemInputArea}>
              <div className={styles.itemTitle}>Keyword</div>
              <CustomInput
                inputType="Basic"
                textType="Label"
                value={item.keyword}
                onChange={e => handleInputChange(item.id, 'keyword', e.target.value)}
                maxLength={50}
              />
              <div className={styles.itemTitle}>Content</div>
              <CustomInput
                inputType="Basic"
                textType="Label"
                value={item.content}
                onChange={e => handleInputChange(item.id, 'content', e.target.value)}
                maxLength={400}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateCustomLorebook;
