import React, {useState} from 'react';
import styles from './ConversationCard.module.css';
import {LineArrowDown, BoldMenuDots, PlusBubble, ProfileChar, ProfileUser} from '@ui/Icons';
import {ChatRoundDots, Close, Description2} from '@ui/chatting';
import TextField from '@mui/material/TextField';
import ConversationCardDropDown from './ConversationCardDropDown';

export interface Bar {
  id: number;
  inputValue: string;
  type: 'dots' | 'description';
}

export interface CardData {
  id: number; // 고유 ID
  priorityType: number;
  userBars: Bar[];
  charBars: Bar[];
}

interface ConversationCardProps {
  card: CardData;
  onUpdate: (updatedCard: Partial<CardData>) => void;
  remove: () => void;
  moveUp: () => void;
  moveDown: () => void;
  duplicate: () => void;
}

const ConversationCard: React.FC<ConversationCardProps> = ({card, moveUp, moveDown, duplicate, onUpdate, remove}) => {
  const [isDropDown, setIsDropDown] = useState<boolean>(false);

  const getMinId = (list: Bar[]): number => {
    if (list.length === 0) return -1;
    const minId = Math.min(...list.map(bar => bar.id));
    return minId > 0 ? 0 : minId - 1;
  };

  const handleInputChange = (type: 'userBars' | 'charBars', barId: number, value: string) => {
    const updatedBars = card[type].map(bar => (bar.id === barId ? {...bar, inputValue: value} : bar));
    onUpdate({[type]: updatedBars});
  };

  const handleAddBar = (type: 'userBars' | 'charBars') => {
    const newBar: Bar = {id: getMinId(card[type]), inputValue: '', type: 'dots'};
    onUpdate({[type]: [...card[type], newBar]});
  };

  const handleRemoveBar = (type: 'userBars' | 'charBars', barId: number) => {
    const updatedBars = card[type].filter(bar => bar.id !== barId);
    onUpdate({[type]: updatedBars});
  };

  const handleTypeToggle = (type: 'userBars' | 'charBars', barId: number) => {
    const updatedBars = card[type].map(bar =>
      bar.id === barId ? {...bar, type: bar.type === 'dots' ? 'description' : 'dots'} : bar,
    );
    onUpdate({[type]: updatedBars});
  };

  const handlePriorityChange = () => {
    const newPriorityType = card.priorityType === 0 ? 1 : 0;
    onUpdate({priorityType: newPriorityType});
  };

  const renderChatGroup = (type: 'userBars' | 'charBars', avatarSrc: string, label: string) => (
    <div className={styles.chatGroup}>
      <div className={styles.userAvatar}>
        <img src={avatarSrc} width={30} height={48} alt={`${label} Avatar`} />
        {label}
      </div>
      <div className={styles.barGroup}>
        {card[type].map((bar, index) => (
          <div key={bar.id} className={styles.inputBar}>
            <div className={styles.body}>
              <div className={styles.inputGroup}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => handleTypeToggle(type, bar.id)}
                  aria-label="Toggle Chat Type"
                >
                  <img
                    src={bar.type === 'dots' ? ChatRoundDots.src : Description2.src}
                    width={bar.type === 'dots' ? 16 : 24}
                    height={bar.type === 'dots' ? 16 : 24}
                    alt="Toggle Icon"
                  />
                </button>
                <TextField
                  multiline
                  maxRows={4}
                  value={bar.inputValue}
                  onChange={e => handleInputChange(type, bar.id, e.target.value)}
                  placeholder="Write a message"
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      padding: '4px 1px',
                      fontFamily: 'Lato',
                      fontSize: '14px',
                      color: '#9aa0a6',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {borderColor: 'transparent'},
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {borderColor: '#e8eaed'},
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '#e8eaed'},
                  }}
                />
                {index > 0 && (
                  <button type="button" className={styles.closeButton} onClick={() => handleRemoveBar(type, bar.id)}>
                    <img src={Close.src} alt="Remove" />
                  </button>
                )}
              </div>
            </div>
            {index === 0 && (
              <button
                type="button"
                className={styles.plusButton}
                onClick={() => handleAddBar(type)}
                aria-label="Add Bar"
              >
                <img src={PlusBubble.src} alt="Add" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.card}>
      {/* 헤더 영역 */}
      <div className={styles.header}>
        {card.priorityType === 0 ? 'Mandatory' : 'Depends on Situation'}
        <div style={{display: 'flex'}}>
          <button className={styles.arrowButton} onClick={moveUp}>
            <img src={LineArrowDown.src} style={{transform: 'rotate(180deg)'}} alt="Move Up" />
          </button>
          <button className={styles.arrowButton} onClick={moveDown}>
            <img src={LineArrowDown.src} alt="Move Down" />
          </button>
          <button className={styles.menuDotButton} onClick={() => setIsDropDown(true)}>
            <img src={BoldMenuDots.src} style={{transform: 'rotate(180deg)'}} alt="Menu" />
          </button>
        </div>
      </div>

      {renderChatGroup('userBars', ProfileUser.src, 'User')}
      {renderChatGroup('charBars', ProfileChar.src, 'Char')}

      {isDropDown && (
        <>
          <div className={styles.editDropdDownBack} onClick={() => setIsDropDown(false)}></div>
          <div className={styles.editDropdDown}>
            <ConversationCardDropDown
              close={() => setIsDropDown(false)}
              remove={remove}
              duplicate={duplicate}
              open={isDropDown}
              changePriority={handlePriorityChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationCard;
