import React, {useState, useEffect} from 'react';
import {Card, FormControl, Select, MenuItem, Button, Typography, Avatar, IconButton, Collapse} from '@mui/material';
import styles from './TalkCard.module.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InputCard from './InputCard';
import {SelectChangeEvent} from '@mui/material';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '@/redux-store/ReduxStore';
import {
  addConversationTalkItem,
  updateConversationTalk,
  removeConversationItem,
  addActionConversationTalkItem,
  updateActionConversationTalk,
  removeActionConversationItem,
} from '@/redux-store/slices/EpisodeInfo';
import {ConversationTalkInfo} from '@/types/apps/DataTypes';

interface TalkCardProps {
  card: {
    id: number;
    title: string;
    description: string;
  };
  selectedPriority: string;
  priorities: string[];
  onChange: (event: SelectChangeEvent<string>) => void;
  onDelete: (id: number) => void;
  updateUserTalk: (itemIndex: number, value: string) => void;
  updateCharacterTalk: (itemIndex: number, value: string) => void;
  triggerIndex?: number; // triggerId를 받아서 처리 (optional)
}

const TalkCard: React.FC<TalkCardProps> = ({
  card,
  selectedPriority,
  priorities,
  onChange,
  onDelete,
  updateUserTalk,
  updateCharacterTalk,
  triggerIndex: triggerIndex = -1, // 기본값은 -1
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isFromChangeBehaviour = triggerIndex !== -1; // triggerId가 -1이 아니면 ChangeBehaviour에서 호출됨
  const [isExpanded, setIsExpanded] = useState(true);

  // Redux에서 초기 값을 가져오기
  const initialUserInputCards = useSelector((state: RootState) => {
    const userString = isFromChangeBehaviour
      ? state.episode.currentEpisodeInfo.triggerInfoList[triggerIndex]?.actionConversationList[card.id]?.user || '[]'
      : state.episode.currentEpisodeInfo.conversationTemplateList[card.id]?.user || '[]';
    return JSON.parse(userString) as ConversationTalkInfo[];
  });

  const initialCharacterInputCards = useSelector((state: RootState) => {
    const characterString = isFromChangeBehaviour
      ? state.episode.currentEpisodeInfo.triggerInfoList[triggerIndex]?.actionConversationList[card.id]?.character ||
        '[]'
      : state.episode.currentEpisodeInfo.conversationTemplateList[card.id]?.character || '[]';
    return JSON.parse(characterString) as ConversationTalkInfo[];
  });

  // Redux 상태를 기반으로 로컬 상태 초기화
  const [userInputCards, setUserInputCards] = useState<ConversationTalkInfo[]>([]);
  const [characterInputCards, setCharacterInputCards] = useState<ConversationTalkInfo[]>([]);

  useEffect(() => {
    // 초기 상태와 가져온 상태가 다를 때만 업데이트
    if (JSON.stringify(userInputCards) !== JSON.stringify(initialUserInputCards)) {
      setUserInputCards(initialUserInputCards);
    }
    if (JSON.stringify(characterInputCards) !== JSON.stringify(initialCharacterInputCards)) {
      setCharacterInputCards(initialCharacterInputCards);
    }
  }, [initialUserInputCards, initialCharacterInputCards]);

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  const addUserInputCard = () => {
    const newUserTalk = {type: 1, talk: `New User Talk ${userInputCards.length + 1}`};
    setUserInputCards(prev => [...prev, newUserTalk]);

    if (isFromChangeBehaviour) {
      dispatch(
        addActionConversationTalkItem({
          triggerIndex: triggerIndex,
          conversationIndex: card.id,
          type: 'user',
          newTalk: newUserTalk.talk,
        }),
      );
    } else {
      dispatch(
        addConversationTalkItem({
          conversationIndex: card.id,
          type: 'user',
          newTalk: newUserTalk.talk,
        }),
      );
    }
  };

  const addCharacterInputCard = () => {
    const newCharacterTalk = {type: 0, talk: `New Character Talk ${characterInputCards.length + 1}`};
    setCharacterInputCards(prev => [...prev, newCharacterTalk]);

    if (isFromChangeBehaviour) {
      dispatch(
        addActionConversationTalkItem({
          triggerIndex: triggerIndex,
          conversationIndex: card.id,
          type: 'character',
          newTalk: newCharacterTalk.talk,
        }),
      );
    } else {
      dispatch(
        addConversationTalkItem({
          conversationIndex: card.id,
          type: 'character',
          newTalk: newCharacterTalk.talk,
        }),
      );
    }
  };

  const handleUpdateInputCard = (type: 'user' | 'character', index: number, value: string) => {
    if (type === 'user') {
      setUserInputCards(prev => {
        const updated = [...prev];
        updated[index].talk = value;
        return updated;
      });

      if (isFromChangeBehaviour) {
        dispatch(
          updateActionConversationTalk({
            triggerIndex: triggerIndex,
            conversationIndex: card.id,
            itemIndex: index,
            type: 'user',
            newTalk: value,
          }),
        );
      } else {
        dispatch(
          updateConversationTalk({
            conversationIndex: card.id,
            itemIndex: index,
            type: 'user',
            newTalk: value,
          }),
        );
      }
    } else {
      setCharacterInputCards(prev => {
        const updated = [...prev];
        updated[index].talk = value;
        return updated;
      });

      if (isFromChangeBehaviour) {
        dispatch(
          updateActionConversationTalk({
            triggerIndex: triggerIndex,
            conversationIndex: card.id,
            itemIndex: index,
            type: 'character',
            newTalk: value,
          }),
        );
      } else {
        dispatch(
          updateConversationTalk({
            conversationIndex: card.id,
            itemIndex: index,
            type: 'character',
            newTalk: value,
          }),
        );
      }
    }
  };

  const handleDeleteInputCard = (type: 'user' | 'character', index: number) => {
    if (type === 'user') {
      setUserInputCards(prev => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });

      if (isFromChangeBehaviour) {
        dispatch(
          removeActionConversationItem({
            triggerIndex: triggerIndex,
            conversationIndex: card.id,
            itemIndex: index,
            type: 'user',
          }),
        );
      } else {
        dispatch(
          removeConversationItem({
            conversationIndex: card.id,
            itemIndex: index,
            type: 'user',
          }),
        );
      }
    } else {
      setCharacterInputCards(prev => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });

      if (isFromChangeBehaviour) {
        dispatch(
          removeActionConversationItem({
            triggerIndex: triggerIndex,
            conversationIndex: card.id,
            itemIndex: index,
            type: 'character',
          }),
        );
      } else {
        dispatch(
          removeConversationItem({
            conversationIndex: card.id,
            itemIndex: index,
            type: 'character',
          }),
        );
      }
    }
  };

  return (
    <Card className={styles.card}>
      <div className={styles.topArea}>
        <FormControl className={styles.formControl} variant="outlined">
          <Select
            value={selectedPriority}
            onChange={onChange}
            displayEmpty
            inputProps={{'aria-label': 'Without label'}}
            sx={{height: '30px'}}
          >
            {priorities.map(priority => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button className={styles.button1} onClick={() => onDelete(card.id)}>
          delete
        </Button>
      </div>

      {/* User's Talk */}
      <div className={styles.divBox}>
        <div className={styles.innerBox}>
          <Card className={styles.cardTop}>
            <Avatar src="/path/to/image.jpg" alt="Avatar" className={styles.cardTopImage} />
            <Typography
              variant="subtitle2"
              className={styles.cardTopText}
              onClick={toggleExpand}
              style={{cursor: 'pointer'}}
            >
              User's Talk
            </Typography>
            <IconButton onClick={addUserInputCard}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Card>
          <Card className={styles.cardRect}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <div>
                {userInputCards.map((inputCard, index) => (
                  <div key={index} style={{paddingBottom: '10px'}}>
                    <InputCard
                      defaultValue={inputCard.talk}
                      onChange={value => handleUpdateInputCard('user', index, value)}
                      onDelete={() => handleDeleteInputCard('user', index)}
                    />
                  </div>
                ))}
              </div>
            </Collapse>
          </Card>
        </div>

        <br />

        {/* Character's Talk */}
        <div className={styles.innerBox}>
          <Card className={styles.cardTop}>
            <Avatar src="/path/to/image.jpg" alt="Avatar" className={styles.cardTopImage} />
            <Typography
              variant="subtitle2"
              className={styles.cardTopText}
              onClick={toggleExpand}
              style={{cursor: 'pointer'}}
            >
              Character's Talk
            </Typography>
            <IconButton onClick={addCharacterInputCard}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Card>
          <Card className={styles.cardRect}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <div>
                {characterInputCards.map((inputCard, index) => (
                  <div key={index} style={{paddingBottom: '10px'}}>
                    <InputCard
                      defaultValue={inputCard.talk}
                      onChange={value => handleUpdateInputCard('character', index, value)}
                      onDelete={() => handleDeleteInputCard('character', index)}
                    />
                  </div>
                ))}
              </div>
            </Collapse>
          </Card>
        </div>
      </div>
    </Card>
  );
};

export default TalkCard;
