import React, {useState} from 'react';
import styles from './PromptDashboard.module.css';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import {useRouter} from 'next/navigation';
import Splitters from '@/components/layout/shared/CustomSplitter';
import {LineUpload} from '@ui/Icons';
import CustomPopup from '@/components/layout/shared/CustomPopup';

interface ListItem {
  name: string;
  updateAt: Date;
}

const PromptDashboard: React.FC = () => {
  const router = useRouter();
  const [promptList, setPromptList] = useState<ListItem[]>([]);
  const [lorebookList, setLorebookList] = useState<ListItem[]>([]);
  const [namePopupOpen, setNamePopupOpen] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<'prompt' | 'lorebook'>('prompt');
  const [newItemName, setNewItemName] = useState<string>('');

  const handleOnClose = () => {
    router.back();
  };

  const handleOpenNamePopup = (type: 'prompt' | 'lorebook') => {
    setNewItemName('');
    setPopupType(type);
    setNamePopupOpen(true);
  };

  const handleConfirmAddItem = () => {
    if (newItemName.trim() === '') return;
    const newItem = {name: newItemName, updateAt: new Date()};

    if (popupType === 'prompt') {
      setPromptList([...promptList, newItem]);
    } else {
      setLorebookList([...lorebookList, newItem]);
    }
    setNamePopupOpen(false);
  };

  const renderAddButton = (onClickAction: () => void) => {
    return (
      <button className={styles.addButton} onClick={onClickAction}>
        <img className={styles.addIcon} src={LineUpload.src} />
        <span className={styles.addButtonText}>Add New</span>
      </button>
    );
  };

  const renderItem = (item: ListItem) => {
    return (
      <li key={item.name} className={styles.promptItem}>
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
      <div className={styles.promptContainer}>
        <CreateDrawerHeader title="Create Content" onClose={handleOnClose} />
        <Splitters splitters={splitData} />
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
