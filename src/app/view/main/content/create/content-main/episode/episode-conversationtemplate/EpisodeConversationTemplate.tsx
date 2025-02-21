import React, {useEffect, useState} from 'react';
import styles from './EpisodeConversationTemplate.module.css';
import {Dialog, IconButton} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {useDispatch, useSelector} from 'react-redux';
import {Plus} from '@ui/chatting';
import ConversationCard from './ConversationCard';
import {RootState} from '@/redux-store/ReduxStore';
import {BoldArrowLeft} from '@ui/Icons';
import CustomButton from '@/components/layout/shared/CustomButton';
import {EpisodeInfo, saveConversationTemplateList} from '@/redux-store/slices/ContentInfo';

interface Bar {
  id: number;
  inputValue: string;
  type: 'dots' | 'description';
}

interface CardData {
  id: number;
  priorityType: number;
  userBars: Bar[];
  charBars: Bar[];
}

const EpisodeConversationTemplate: React.FC<{open: boolean; closeModal: () => void; episodeInfo: EpisodeInfo}> = ({
  open,
  closeModal,
  episodeInfo,
}) => {
  const dispatch = useDispatch();

  const selectedChapterIdx = useSelector((state: RootState) => state.content.selectedChapterIdx);
  const selectedEpisodeIdx = useSelector((state: RootState) => state.content.selectedEpisodeIdx);

  // Redux에서 conversationTemplateList 가져오기
  const conversationTemplateList = useSelector(
    (state: RootState) =>
      state.content.curEditingContentInfo.chapterInfoList[selectedChapterIdx]?.episodeInfoList[selectedEpisodeIdx]
        ?.conversationTemplateList,
  );

  // 로컬 상태 관리
  const [cards, setCards] = useState<CardData[]>([]);

  const getMinId = (list: CardData[]): number => {
    const listId = list.flatMap(item => item.id);
    if (listId.length === 0) return 0;
    const minId = Math.min(...listId);
    return minId > 0 ? 0 : minId - 1;
  };

  useEffect(() => {
    if (conversationTemplateList?.length > 0) {
      let minCardId = -1;
      let minBarId = -1;

      const initialCards = conversationTemplateList.map(conversation => {
        const assignedId = conversation.id > 0 ? conversation.id : minCardId--;

        const userBars = JSON.parse(conversation.user || '[]').map(
          (bar: any): Bar => ({
            id: minBarId--,
            inputValue: bar.talk || '',
            type: bar.type === 0 ? 'dots' : 'description',
          }),
        );

        const charBars = JSON.parse(conversation.character || '[]').map(
          (bar: any): Bar => ({
            id: minBarId--,
            inputValue: bar.talk || '',
            type: bar.type === 0 ? 'dots' : 'description',
          }),
        );

        return {id: assignedId, priorityType: conversation.conversationType, userBars, charBars};
      });

      setCards(initialCards);
    }
  }, [conversationTemplateList]);

  const handleDuplicateCard = (index: number) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      const cardToDuplicate = newCards[index];
      const newId = getMinId(newCards);

      const duplicatedCard: CardData = {
        ...cardToDuplicate,
        id: newId,
        userBars: cardToDuplicate.userBars.map((bar, idx) => ({
          ...bar,
          id: newId - idx,
        })),
        charBars: cardToDuplicate.charBars.map((bar, idx) => ({
          ...bar,
          id: newId - idx,
        })),
      };

      newCards.splice(index + 1, 0, duplicatedCard);
      return newCards;
    });
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= newCards.length) return newCards;

      const [movedCard] = newCards.splice(index, 1);
      newCards.splice(newIndex, 0, movedCard);
      return newCards;
    });
  };

  const handleAddCard = () => {
    setCards(prevCards => [
      ...prevCards,
      {
        id: getMinId(prevCards),
        priorityType: 0,
        userBars: [{id: getMinId(prevCards), inputValue: '', type: 'dots'}],
        charBars: [{id: getMinId(prevCards), inputValue: '', type: 'dots'}],
      },
    ]);
  };

  const handleRemoveCard = (id: number) => {
    setCards(prevCards => prevCards.filter(card => card.id !== id));
  };

  const handleConfirm = () => {
    const updatedTemplateList = cards.map(card => ({
      id: card.id > 0 ? card.id : 0,
      conversationType: card.priorityType,
      user: JSON.stringify(
        card.userBars.map(bar => ({
          type: bar.type === 'dots' ? 0 : 1,
          talk: bar.inputValue,
        })),
      ),
      character: JSON.stringify(
        card.charBars.map(bar => ({
          type: bar.type === 'dots' ? 0 : 1,
          talk: bar.inputValue,
        })),
      ),
    }));

    dispatch(saveConversationTemplateList(updatedTemplateList));
    closeModal();
  };

  return (
    <Dialog
      closeAfterTransition={false}
      open={open}
      onClose={closeModal}
      fullScreen
      className={styles['modal-body']}
      disableAutoFocus={true}
      disableEnforceFocus={true}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={closeModal}>
            <img src={BoldArrowLeft.src} className={styles.backIcon} />
          </button>
          <div className={styles.navTitle}>Conversation Template</div>
        </div>
        <IconButton onClick={() => setCards([])}>
          <RestartAltIcon />
        </IconButton>
      </div>

      <div className={styles.container}>
        <div className={styles.addNew} onClick={handleAddCard}>
          <img src={Plus.src} alt="Add New" />
          Add New
        </div>
        <div className={styles.cardBox}>
          {cards.map((card, index) => (
            <ConversationCard
              key={card.id}
              card={card}
              remove={() => handleRemoveCard(card.id)}
              onUpdate={updatedCard => {
                setCards(prevCards => prevCards.map(c => (c.id === card.id ? {...c, ...updatedCard} : c)));
              }}
              moveDown={() => handleMoveCard(index, 'down')} // 인덱스 전달
              moveUp={() => handleMoveCard(index, 'up')} // 인덱스 전달
              duplicate={() => handleDuplicateCard(index)} // 인덱스 전달
            />
          ))}

          <div style={{height: '500px'}}></div>
        </div>
      </div>
      <div className={styles.contentBottom}>
        <CustomButton
          size="Large"
          state="Normal"
          type="Primary"
          customClassName={[styles.setupButtons]}
          onClick={handleConfirm}
        >
          Confirm
        </CustomButton>
      </div>
    </Dialog>
  );
};

export default EpisodeConversationTemplate;
