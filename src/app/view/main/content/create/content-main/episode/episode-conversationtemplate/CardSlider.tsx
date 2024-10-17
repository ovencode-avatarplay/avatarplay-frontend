import React, {useState} from 'react';
import {Box, Button} from '@mui/material';
import styles from './CardSlider.module.css';
import {ArrowForwardIos, ArrowBackIos} from '@mui/icons-material';
import TalkCard from './TalkCard';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '@/redux-store/ReduxStore';
import {
  addConversationTalk,
  addConversationTalkItem,
  updateConversationTalk,
  removeConversationItem,
  removeConversationTalk,
  addActionConversationTalk,
  addActionConversationTalkItem,
  updateActionConversationTalk,
  removeActionConversationItem,
  removeActionConversationTalk,
} from '@/redux-store/slices/EpisodeInfo';
import {SelectChangeEvent} from '@mui/material';
import {ConversationPriortyType, ConversationTalkType} from '@/types/apps/dataTypes';

interface CardSliderProps {
  triggerId: number; // 트리거 ID가 전달되며, -1이면 일반 conversationTemplateList를 사용
}

const CardSlider: React.FC<CardSliderProps> = ({triggerId}) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentEpisodeInfo = useSelector((state: RootState) => state.episode.currentEpisodeInfo);
  const isFromChangeBehaviour = triggerId !== -1; // triggerId가 -1이 아니면 ChangeBehaviour에서 시작됨
  const conversationList = isFromChangeBehaviour
    ? currentEpisodeInfo.triggerInfoList.find(trigger => trigger.id === triggerId)?.actionConversationList || []
    : currentEpisodeInfo.conversationTemplateList;

  const [currentIndex, setCurrentIndex] = useState(0);
  const priorities = ['Mandatory', 'Depends on'];
  const [selectedPriority, setSelectedPriority] = useState(priorities[0]);

  const nextCard = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % conversationList.length);
  };

  const prevCard = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + conversationList.length) % conversationList.length);
  };

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedPriority(event.target.value as string);
  };

  const addTalkCard = () => {
    const newCard = {
      user: [{type: ConversationTalkType.Speech, talk: 'New User Talk'}],
      character: [{type: ConversationTalkType.Action, talk: 'New Character Talk'}],
      conversationTpye: ConversationPriortyType.Mandatory,
    };

    if (isFromChangeBehaviour) {
      // ChangeBehaviour에서 시작된 경우 triggerInfoList[].actionConversationList에 저장
      dispatch(addActionConversationTalk({triggerId, ...newCard}));
    } else {
      // 일반적인 경우 conversationTemplateList에 저장
      dispatch(addConversationTalk(newCard));
    }
    setCurrentIndex(conversationList.length); // 새 카드를 추가하고 해당 카드로 이동
  };

  const deleteTalkCard = (id: number) => {
    if (isFromChangeBehaviour) {
      // ChangeBehaviour에서 시작된 경우 triggerInfoList[].actionConversationList에서 삭제
      dispatch(removeActionConversationTalk({triggerId, conversationIndex: id}));
    } else {
      // 일반적인 경우 conversationTemplateList에서 삭제
      dispatch(removeConversationTalk(id));
    }
    setCurrentIndex(prevIndex => Math.max(0, Math.min(prevIndex, conversationList.length - 2)));
  };

  const updateUserTalk = (conversationIndex: number, itemIndex: number, value: string) => {
    if (isFromChangeBehaviour) {
      dispatch(
        updateActionConversationTalk({
          triggerId,
          conversationIndex,
          itemIndex,
          type: 'user',
          newTalk: value,
        }),
      );
    } else {
      dispatch(
        updateConversationTalk({
          conversationIndex,
          itemIndex,
          type: 'user',
          newTalk: value,
        }),
      );
    }
  };

  const updateCharacterTalk = (conversationIndex: number, itemIndex: number, value: string) => {
    if (isFromChangeBehaviour) {
      dispatch(
        updateActionConversationTalk({
          triggerId,
          conversationIndex,
          itemIndex,
          type: 'character',
          newTalk: value,
        }),
      );
    } else {
      dispatch(
        updateConversationTalk({
          conversationIndex,
          itemIndex,
          type: 'character',
          newTalk: value,
        }),
      );
    }
  };

  return (
    <Box className={styles.body}>
      <Box className={styles.cardSlider}>
        <Button className={styles.arrowButton} onClick={prevCard}>
          <ArrowBackIos />
        </Button>
        <Box className={styles.cardsContainer}>
          <Box className={styles.cardsWrapper} style={{transform: `translateX(-${currentIndex * 100}%)`}}>
            {conversationList.map((card, index) => (
              <TalkCard
                key={card.id}
                card={{id: card.id, title: `Card ${card.id + 1}`, description: card.user[0] || ''}}
                selectedPriority={selectedPriority}
                priorities={priorities}
                onChange={handleChange}
                onDelete={() => deleteTalkCard(card.id)}
                updateUserTalk={(itemIndex: number, value: string) => updateUserTalk(card.id, itemIndex, value)}
                updateCharacterTalk={(itemIndex: number, value: string) =>
                  updateCharacterTalk(card.id, itemIndex, value)
                }
                triggerId={triggerId}
              />
            ))}
          </Box>
        </Box>
        <Button className={styles.arrowButton} onClick={nextCard}>
          <ArrowForwardIos />
        </Button>
      </Box>
      <Button className={styles.buttonAdd} onClick={addTalkCard}>
        Add Conversation
      </Button>
    </Box>
  );
};

export default CardSlider;
