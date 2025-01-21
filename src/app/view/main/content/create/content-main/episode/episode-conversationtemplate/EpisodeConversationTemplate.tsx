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
  id: string;
  inputValue: string;
  type: 'dots' | 'description';
}

interface CardData {
  id: string;
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

  useEffect(() => {
    let currentId = -1; // CardData의 ID 시작점
    let currentBarId = -1; // Bar의 ID 시작점

    if (conversationTemplateList?.length > 0) {
      const initialCards = conversationTemplateList.map(conversation => {
        const assignedId = conversation.id <= 0 ? currentId-- : conversation.id;

        // userBars 생성
        const userBars = JSON.parse(conversation.user || '[]').map((bar: any): Bar => {
          const newBar: Bar = {
            id: (currentBarId--).toString(),
            inputValue: bar.talk || '', // talk를 inputValue로 설정
            type: bar.type === 0 ? 'dots' : 'description', // 정확히 "dots" | "description"으로 변환
          };
          return newBar;
        });

        // charBars 생성
        const charBars = JSON.parse(conversation.character || '[]').map((bar: any): Bar => {
          const newBar: Bar = {
            id: (currentBarId--).toString(),
            inputValue: bar.talk || '', // talk를 inputValue로 설정
            type: bar.type === 0 ? 'dots' : 'description', // 정확히 "dots" | "description"으로 변환
          };
          return newBar;
        });

        // CardData 생성
        const newCard: CardData = {
          id: assignedId.toString(),
          priorityType: conversation.conversationType,
          userBars,
          charBars,
        };

        return newCard;
      });

      setCards(initialCards); // 초기값으로 cards 상태 설정
      console.log('Initialized Cards:', initialCards);
    } else {
      // 기본값 생성
    }
  }, [conversationTemplateList]);
  const handleDuplicateCard = (index: number) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      const cardToDuplicate = newCards[index];

      // 복사한 데이터에 새로운 ID 부여
      const duplicatedCard: CardData = {
        ...cardToDuplicate,
        id: Date.now().toString(), // 새로운 고유 ID
        userBars: cardToDuplicate.userBars.map(bar => ({
          ...bar,
          id: Date.now().toString() + '_user', // 새로운 고유 ID
        })),
        charBars: cardToDuplicate.charBars.map(bar => ({
          ...bar,
          id: Date.now().toString() + '_char', // 새로운 고유 ID
        })),
      };

      // 복사한 카드를 해당 인덱스 다음에 삽입
      newCards.splice(index + 1, 0, duplicatedCard);

      return newCards;
    });
  };
  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    setCards(prevCards => {
      const newCards = [...prevCards];

      // 이동할 새로운 위치 계산
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      // 경계를 벗어나면 무시
      if (newIndex < 0 || newIndex >= newCards.length) {
        return newCards;
      }

      // 현재 카드 추출
      const [movedCard] = newCards.splice(index, 1);

      // 새로운 위치에 삽입
      newCards.splice(newIndex, 0, movedCard);

      return newCards;
    });
  };

  const handleAddCard = () => {
    setCards(prevCards => [
      ...prevCards,
      {
        id: Date.now().toString(),
        priorityType: 0,
        userBars: [{id: Date.now().toString() + '_user', inputValue: '', type: 'dots'}],
        charBars: [{id: Date.now().toString() + '_char', inputValue: '', type: 'dots'}],
      },
    ]);
  };

  const handleRemoveCard = (id: string) => {
    setCards(prevCards => prevCards.filter(card => card.id !== id));
  };

  const handleConfirm = () => {
    // Redux 저장 형식으로 변환
    const updatedTemplateList = cards.map(card => ({
      id: 0, // 서버에서 부여받는 값
      conversationType: card.priorityType, // 기본 타입 (필요시 수정 가능)
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

    // Redux에 저장
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
