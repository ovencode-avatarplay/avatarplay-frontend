import React, {useEffect, useState} from 'react';
import styles from './CustomModuleDashboard.module.css';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import {useRouter} from 'next/navigation';
import Splitters from '@/components/layout/shared/CustomSplitter';
import {LineDelete, LineUpload} from '@ui/Icons';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import CreateCustomPrompt from './CreateCustomPrompt';
import CreateCustomLorebook from './CreateCustomLorebook';
import {
  CustomModulesLorebookInfo,
  CustomModulesPromptInfo,
  EditLorebookReq,
  EditPromptReq,
  CustomModuleLorebook,
  LorebookItem,
  CustomModulePrompt,
  sendGetCustomModules,
  sendLorebook,
  sendPrompt,
  sendGetLorebook,
  GetLorebookReq,
  DeleteCustomModulesReq,
  sendDeleteCustomModules,
  GetPromptReq,
  sendGetPrompt,
} from '@/app/NetWork/CustomModulesNetwork';
import getLocalizedText from '@/utils/getLocalizedText';
import formatText from '@/utils/formatText';

export interface PromptTemplateChatGPT {
  system: string;
}

export interface PromptTemplateMandarin {
  input: string;
  instruction: string;
  output: string;
}

const CustomModuleDashboard: React.FC = () => {
  const router = useRouter();
  const [promptList, setPromptList] = useState<CustomModulesPromptInfo[]>([]);
  const [lorebookList, setLorebookList] = useState<CustomModulesLorebookInfo[]>([]);
  const [namePopupOpen, setNamePopupOpen] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<'dashboard' | 'prompt' | 'lorebook'>('dashboard');
  const [newItemName, setNewItemName] = useState<string>('');
  const [displayState, setDisplayState] = useState<'dashboard' | 'prompt' | 'lorebook'>('dashboard');
  const [createState, setCreateState] = useState<'prompt' | 'lorebook'>('prompt');
  const [selectedPrompt, setSelectedPrompt] = useState<CustomModulePrompt | null>(null);
  const [selectedLorebook, setSelectedLorebook] = useState<CustomModuleLorebook | null>(null);
  const [removedLorebookItems, setRemovedLorebookItems] = useState<number[]>([]);

  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);

  let defaultPromptItem: CustomModulePrompt = {
    promptId: 0,
    title: '',
    claude: getLocalizedText('Common', 'common_sample_004'),
    // `###About {{char}}: \n
    // ###Lore Book : \n
    // ###About {{user}} : \n
    // ###Instruction : \n
    // ###Response :`,
    chatGPT: getLocalizedText('Common', 'common_sample_004'),
    // `###About {{char}}: \n
    // ###Lore Book : \n
    // ###About {{user}} : \n
    // ###Instruction : \n
    // ###Response :`,
  };

  let defaultLorebookItem: EditLorebookReq = {
    lorebookId: 0,
    title: '',
    removes: [],
    editList: [],
  };

  function onCancel() {
    if (isEditing) {
      setIsCloseConfirmOpen(true);
    } else {
      setDisplayState('dashboard');
    }
  }

  //#region  handler
  const handleOnClose = () => {
    if (displayState === 'dashboard') router.back();
    else if (displayState === 'prompt' || displayState === 'lorebook') {
      onCancel();
    }
  };

  const handleOpenNamePopup = (type: 'prompt' | 'lorebook') => {
    setNewItemName('');
    setPopupType(type);
    setNamePopupOpen(true);
  };

  const handleConfirmAddPromptItem = () => {
    if (newItemName.trim() === '') return;
    handleAddPrompt(newItemName);

    setNamePopupOpen(false);
  };

  const handleConfirmAddLorebookItem = () => {
    if (newItemName.trim() === '') return;
    handleAddLorebook(newItemName);

    setNamePopupOpen(false);
  };

  const handlePromptItemClick = async (item: CustomModulesPromptInfo) => {
    const req: GetPromptReq = {promptId: item.promptId};
    const response = await sendGetPrompt(req);
    if (response.data) {
      setSelectedPrompt(response.data);
    }
    setDisplayState('prompt');
    setCreateState('prompt');
  };

  const handleLorebookItemClick = async (item: CustomModulesLorebookInfo) => {
    const req: GetLorebookReq = {lorebookId: item.lorebookId};
    const response = await sendGetLorebook(req);
    if (response.data) {
      setSelectedLorebook(response.data);
      setRemovedLorebookItems([]);
    }
    setDisplayState('lorebook');
    setCreateState('lorebook');
  };

  const handlePromptDeleteItem = async () => {
    if (!selectedPrompt) return;

    const req: DeleteCustomModulesReq = {lorebookId: 0, promptId: selectedPrompt.promptId};
    const response = await sendDeleteCustomModules(req);
    if (response.resultCode === 0) {
      // setPromptList(prev => prev.filter(item => item.promptId !== selectedPrompt.promptId)); // 프론트에서만 삭제
      await handleRefreshContentModules(); // 서버에서 갱신 받기. 둘중 하나만 써도 됨
    } else {
      // delete failed
    }

    setSelectedPrompt(null);
    setDisplayState('dashboard');
  };

  const handleLorebookDeleteItem = async () => {
    if (!selectedLorebook) return;

    const req: DeleteCustomModulesReq = {lorebookId: selectedLorebook.lorebookId, promptId: 0};
    const response = await sendDeleteCustomModules(req);
    if (response.resultCode === 0) {
      // setLorebookList(prev => prev.filter(item => item.lorebookId !== selectedLorebook.lorebookId)); // 프론트에서만 삭제
      await handleRefreshContentModules(); // 서버에서 갱신 받기. 둘중 하나만 써도 됨
    } else {
      // delete failed
    }
    setSelectedLorebook(null);
    setRemovedLorebookItems([]);
    setDisplayState('dashboard');
  };

  const handleSavePrompt = (updatedPrompt: CustomModulePrompt) => {
    handleEditPrompt(updatedPrompt);

    setDisplayState('dashboard');
    setSelectedPrompt(null);
  };

  const handleSaveLorebook = (updatedLorebook: CustomModuleLorebook) => {
    handleEditLorebook(
      {
        ...updatedLorebook,
        items: updatedLorebook.items.map(item => ({
          ...item,
          lorebookItemId: item.lorebookItemId < 0 ? 0 : item.lorebookItemId,
        })),
      },
      removedLorebookItems,
    );

    setDisplayState('dashboard');
    setSelectedLorebook(null);
    setRemovedLorebookItems([]);
  };

  const handleRefreshContentModules = async () => {
    const response = await sendGetCustomModules();
    if (response.data) {
      const prompts = response.data?.prompts;
      setPromptList(prompts);
      const lorebooks = response.data?.lorebooks;
      setLorebookList(lorebooks);
      setRemovedLorebookItems([]);
    }
  };

  const handleAddPrompt = async (title: string) => {
    const req: EditPromptReq = {...defaultPromptItem, title: title};
    const response = await sendPrompt(req);
    if (response.resultCode === 0) {
      handleRefreshContentModules();
    }
  };

  const handleAddLorebook = async (title: string) => {
    const req: EditLorebookReq = {...defaultLorebookItem, title: title};
    const response = await sendLorebook(req);
    if (response.resultCode === 0) {
      handleRefreshContentModules();
    }
  };

  const handleEditPrompt = async (promptitem: CustomModulePrompt) => {
    const req: EditPromptReq = promptitem;
    const response = await sendPrompt(req);
    if (response.resultCode === 0) {
      handleRefreshContentModules();
    }
  };

  const handleEditLorebook = async (lorebook: CustomModuleLorebook, removes: number[]) => {
    const req: EditLorebookReq = {
      title: lorebook.title,
      lorebookId: lorebook.lorebookId,
      removes: removes,
      editList: lorebook.items,
    };
    const response = await sendLorebook(req);
    if (response.resultCode === 0) {
      handleRefreshContentModules();
    }
  };
  //#endregion

  //#region  render
  const renderAddButton = (onClickAction: () => void) => {
    return (
      <button className={styles.addButton} onClick={onClickAction}>
        <img className={styles.addIcon} src={LineUpload.src} />
        <span className={styles.addButtonText}>{getLocalizedText('Common', 'common_button_addnew')}</span>
      </button>
    );
  };

  const renderPromptItem = (item: CustomModulesPromptInfo) => {
    const formatDateTime = (isoString: Date) => {
      const utcDate = new Date(isoString + 'Z'); // UTC 기준
      const localString = utcDate.toLocaleString(); // 시스템의 로컬 시간대로 변환
      return localString.replace(',', '');
    };

    return (
      <li key={item.title} className={styles.customModuleItem} onClick={() => handlePromptItemClick(item)}>
        <div className={styles.itemName}>{item.title}</div>
        <div className={styles.itemUpdateAt}>{formatDateTime(item.createdAt)}</div>
      </li>
    );
  };

  const renderLorebookItem = (item: CustomModulesLorebookInfo) => {
    const formatDateTime = (isoString: Date) => {
      const utcDate = new Date(isoString + 'Z'); // UTC 기준
      const localString = utcDate.toLocaleString(); // 시스템의 로컬 시간대로 변환
      return localString.replace(',', '');
    };
    return (
      <li key={item.title} className={styles.customModuleItem} onClick={() => handleLorebookItemClick(item)}>
        <div className={styles.itemName}>{item.title}</div>
        <div className={styles.itemUpdateAt}>{formatDateTime(item.createdAt)}</div>
      </li>
    );
  };

  const renderPromptArea = () => {
    return (
      <>
        {renderAddButton(() => handleOpenNamePopup('prompt'))}
        <ul className={styles.customModuleList}>{promptList.map(item => renderPromptItem(item))}</ul>
      </>
    );
  };

  const renderLoreBookArea = () => {
    return (
      <>
        {renderAddButton(() => handleOpenNamePopup('lorebook'))}
        <ul className={styles.customModuleList}>{lorebookList.map(item => renderLorebookItem(item))}</ul>
      </>
    );
  };

  const splitData = [
    {
      label: getLocalizedText('CreateModules', 'createmodules004_label_002'),
      preContent: '',
      content: <>{renderPromptArea()}</>,
    },
    {
      label: getLocalizedText('CreateModules', 'createmodules004_label_003'),
      preContent: '',
      content: <>{renderLoreBookArea()}</>,
    },
  ];
  //#endregion

  //#region  useEffect
  useEffect(() => {
    handleRefreshContentModules();
  }, []);

  //#endregion

  return (
    <div style={{marginTop: '58px'}}>
      <CreateDrawerHeader
        title={
          displayState === 'dashboard'
            ? getLocalizedText('CreateModules', 'createmodules004_title_001')
            : displayState === 'prompt'
            ? getLocalizedText('CreateModules', 'createmodules001_title_001')
            : displayState === 'lorebook'
            ? getLocalizedText('CreateModules', 'createmodules007_title_001')
            : 'err'
        }
        onClose={handleOnClose}
      >
        {displayState !== 'dashboard' ? (
          <button
            className={styles.deleteButton}
            onClick={() => {
              setIsDeleteConfirmOpen(true);
            }}
          >
            <img className={styles.deleteIcon} src={LineDelete.src} />
          </button>
        ) : (
          ''
        )}
      </CreateDrawerHeader>
      <div className={styles.customModuleContainer}>
        {displayState === 'dashboard' && (
          <Splitters
            splitters={splitData}
            initialActiveSplitter={createState === 'prompt' ? 0 : createState === 'lorebook' ? 1 : 0}
          />
        )}
        {displayState === 'prompt' && selectedPrompt && (
          <CreateCustomPrompt prompt={selectedPrompt} onSave={handleSavePrompt} setIsEditing={setIsEditing} />
        )}
        {displayState === 'lorebook' && selectedLorebook && (
          <CreateCustomLorebook
            lorebook={selectedLorebook}
            onSave={handleSaveLorebook}
            onCancel={() => onCancel()}
            onRemove={setRemovedLorebookItems}
            setIsEditing={setIsEditing}
          />
        )}
      </div>

      {namePopupOpen && (
        <CustomPopup
          type="alert"
          title={
            popupType === 'prompt'
              ? formatText(getLocalizedText('Common', 'common_alert_039'))
              : formatText(getLocalizedText('Common', 'common_alert_078'))
          }
          inputField={{
            value: newItemName,
            onChange: e => setNewItemName(e.target.value),
            placeholder: getLocalizedText('Common', 'common_sample_060'),
            textType: 'Label',
            label:
              popupType === 'prompt'
                ? formatText(getLocalizedText('Common', 'common_alert_037'))
                : formatText(getLocalizedText('Common', 'common_alert_079')),
          }}
          buttons={[
            {
              label: getLocalizedText('Common', 'common_button_submit'),
              onClick: () => {
                {
                  popupType === 'prompt'
                    ? handleConfirmAddPromptItem()
                    : popupType === 'lorebook'
                    ? handleConfirmAddLorebookItem()
                    : {
                        //error
                      };
                }
              },
              isPrimary: true,
            },
          ]}
        />
      )}
      {isCloseConfirmOpen && (
        <CustomPopup
          type="alert"
          title={formatText(getLocalizedText('Common', 'common_alert_075'), [
            displayState === 'prompt'
              ? selectedPrompt?.title ?? ''
              : displayState === 'lorebook'
              ? selectedLorebook?.title ?? ''
              : 'err',
          ])}
          description={getLocalizedText('Common', 'common_alert_076')}
          buttons={[
            {
              label: getLocalizedText('Common', 'common_button_cancel'),
              onClick: () => setIsCloseConfirmOpen(false),
            },
            {
              label: getLocalizedText('Common', 'common_button_confirm'),
              onClick: () => {
                setIsCloseConfirmOpen(false);
                setDisplayState('dashboard');
                setSelectedPrompt(null);
                setSelectedLorebook(null);
              },
              isPrimary: true,
            },
          ]}
        />
      )}
      {isDeleteConfirmOpen && (
        <CustomPopup
          type="alert"
          title={formatText(getLocalizedText('Common', 'common_alert_006'), [
            displayState === 'prompt'
              ? selectedPrompt?.title ?? ''
              : displayState === 'lorebook'
              ? selectedLorebook?.title ?? ''
              : 'err',
          ])}
          // description={
          //   // {getLocalizedText('Common', 'common_alert_076')}
          //   `really?`
          // }
          buttons={[
            {
              label: getLocalizedText('Common', 'common_button_cancel'),
              onClick: () => setIsDeleteConfirmOpen(false),
            },
            {
              label: getLocalizedText('Common', 'common_button_confirm'),
              onClick: () => {
                setIsDeleteConfirmOpen(false);
                setDisplayState('dashboard');
                displayState === 'prompt'
                  ? handlePromptDeleteItem()
                  : displayState === 'lorebook'
                  ? handleLorebookDeleteItem()
                  : {
                      //empty
                    };
                setSelectedPrompt(null);
                setSelectedLorebook(null);
              },
              isPrimary: true,
            },
          ]}
        />
      )}
    </div>
  );
};

export default CustomModuleDashboard;
