import React, {useState} from 'react';
import styles from './PromptDashboard.module.css';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import {useRouter} from 'next/navigation';
import Splitters from '@/components/layout/shared/CustomSplitter';
import {LineDelete, LineUpload} from '@ui/Icons';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import CreateCustomPrompt from './CreateCustomPrompt';
import CreateCustomLorebook from './CreateCustomLorebook';

export interface CustomPromptData {
  id: number;
  type: number;
  name: string;
  updateAt: Date;
}

export interface PromptTemplateChatGPT {
  system: string;
}

export interface PromptTemplateMandarin {
  input: string;
  instruction: string;
  output: string;
}

const PromptDashboard: React.FC = () => {
  const router = useRouter();
  const [promptList, setPromptList] = useState<CustomPromptData[]>([]);
  const [lorebookList, setLorebookList] = useState<CustomPromptData[]>([]);
  const [namePopupOpen, setNamePopupOpen] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<'dashboard' | 'prompt' | 'lorebook'>('dashboard');
  const [newItemName, setNewItemName] = useState<string>('');
  const [displayState, setDisplayState] = useState<'dashboard' | 'prompt' | 'lorebook'>('dashboard');
  const [createState, setCreateState] = useState<'prompt' | 'lorebook'>('prompt');
  const [selectedItem, setSelectedItem] = useState<CustomPromptData | null>(null);

  const handleOnClose = () => {
    if (displayState === 'dashboard') router.back();
    else if (displayState === 'prompt' || displayState === 'lorebook') {
      setDisplayState('dashboard');
    }
  };

  const handleOpenNamePopup = (type: 'prompt' | 'lorebook') => {
    setNewItemName('');
    setPopupType(type);
    setNamePopupOpen(true);
  };

  const getMinId = (list: CustomPromptData[]): number => {
    const listId = list.flatMap(list => list.id);

    if (listId.length === 0) {
      return 0; // 에피소드가 없는 경우 null 반환 (버그)
    }

    const minId = Math.min(...listId);
    return minId > 0 ? 0 : minId;
  };

  const handleConfirmAddItem = () => {
    if (newItemName.trim() === '') return;
    const newItem = {
      name: newItemName,
      updateAt: new Date(),
      id: popupType === 'prompt' ? getMinId(promptList) - 1 : getMinId(lorebookList),
      type: popupType === 'prompt' ? 0 : 1,
    };

    if (popupType === 'prompt') {
      setPromptList([...promptList, newItem]);
    } else {
      setLorebookList([...lorebookList, newItem]);
    }
    setNamePopupOpen(false);
  };

  const handleItemClick = (item: CustomPromptData) => {
    setSelectedItem(item);
    setDisplayState(item.type === 0 ? 'prompt' : item.type === 1 ? 'lorebook' : 'prompt');
    setCreateState(item.type === 0 ? 'prompt' : item.type === 1 ? 'lorebook' : 'prompt');
  };

  const handleDeleteItem = () => {
    if (!selectedItem) return;

    if (selectedItem.type === 0) {
      setPromptList(prev => prev.filter(item => item.id !== selectedItem.id));
    } else {
      setLorebookList(prev => prev.filter(item => item.id !== selectedItem.id));
    }

    setSelectedItem(null);
    setDisplayState('dashboard');
  };

  const handleSavePrompt = (updatedPrompt: CustomPromptData) => {
    setPromptList(prevPrompts => prevPrompts.map(p => (p.id === updatedPrompt.id ? updatedPrompt : p)));
    setDisplayState('dashboard');
    setSelectedItem(null);
  };

  const renderAddButton = (onClickAction: () => void) => {
    return (
      <button className={styles.addButton} onClick={onClickAction}>
        <img className={styles.addIcon} src={LineUpload.src} />
        <span className={styles.addButtonText}>Add New</span>
      </button>
    );
  };

  const renderItem = (item: CustomPromptData) => {
    return (
      <li key={item.name} className={styles.promptItem} onClick={() => handleItemClick(item)}>
        <div className={styles.itemName}>{item.name}</div>
        <div className={styles.updateAt}>{item.updateAt.toDateString()}</div>
      </li>
    );
  };

  const renderPromptArea = () => {
    return (
      <>
        {renderAddButton(() => handleOpenNamePopup('prompt'))}
        <ul className={styles.promptList}>{promptList.map(item => renderItem(item))}</ul>
      </>
    );
  };

  const renderLoreBookArea = () => {
    return (
      <>
        {renderAddButton(() => handleOpenNamePopup('lorebook'))}
        <ul className={styles.promptList}>{lorebookList.map(item => renderItem(item))}</ul>
      </>
    );
  };

  const splitData = [
    {
      label: 'Prompt',
      preContent: '',
      content: <>{renderPromptArea()}</>,
    },
    {
      label: 'Lorebook',
      preContent: '',
      content: <>{renderLoreBookArea()}</>,
    },
  ];

  return (
    <div style={{marginTop: '58px'}}>
      <CreateDrawerHeader title="Create Content" onClose={handleOnClose}>
        {displayState !== 'dashboard' ? (
          <button className={styles.deleteButton} onClick={handleDeleteItem}>
            <img className={styles.deleteIcon} src={LineDelete.src} />
          </button>
        ) : (
          ''
        )}
      </CreateDrawerHeader>
      <div className={styles.promptContainer}>
        {displayState === 'dashboard' && (
          <Splitters
            splitters={splitData}
            initialActiveSplitter={createState === 'prompt' ? 0 : createState === 'lorebook' ? 1 : 0}
          />
        )}
        {displayState === 'prompt' && selectedItem && (
          <CreateCustomPrompt prompt={selectedItem} onSave={handleSavePrompt} />
        )}
        {displayState === 'lorebook' && selectedItem && (
          <CreateCustomLorebook lorebook={selectedItem} onSave={handleSavePrompt} />
        )}
      </div>
      {namePopupOpen && (
        <CustomPopup
          type="alert"
          title={`Make New Custom ${popupType === 'prompt' ? 'Prompt' : 'Lorebook'}`}
          description={`Input new custom ${popupType === 'prompt' ? 'prompt' : 'lorebook'} name`}
          inputField={{
            value: newItemName,
            onChange: e => setNewItemName(e.target.value),
            placeholder: `Enter ${popupType === 'prompt' ? 'prompt' : 'lorebook'} name`,
          }}
          buttons={[
            {
              label: 'Cancel',
              onClick: () => setNamePopupOpen(false),
            },
            {
              label: 'OK',
              onClick: handleConfirmAddItem,
              isPrimary: true,
            },
          ]}
        />
      )}
    </div>
  );
};

export default PromptDashboard;
