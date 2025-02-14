import React, {useState} from 'react';
import styles from './ConversationCard.module.css';
import {BoldArrowDown, BoldMenuDots, PlusBubble, ProfileChar, ProfileUser} from '@ui/Icons';
import {ChatRoundDots, Close, Description2} from '@ui/chatting';
import TextField from '@mui/material/TextField';
import ConversationCardDropDown from './ConversationCardDropDown';

export interface Bar {
  id: string;
  inputValue: string;
  type: 'dots' | 'description';
}

export interface CardData {
  id: string; // 고유 ID
  priorityType: number;
  userBars: Bar[]; // User 데이터
  charBars: Bar[]; // Char 데이터
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
  const handleInputChange = (type: 'userBars' | 'charBars', barId: string, value: string) => {
    const updatedBars = card[type].map(
      bar => (bar.id === barId ? {...bar, inputValue: value} : bar), // 해당 bar만 업데이트
    );
    onUpdate({[type]: updatedBars});
  };
  const handleAddBar = (type: 'userBars' | 'charBars') => {
    const newBar = {id: Date.now().toString(), inputValue: '', type: 'dots'};
    onUpdate({[type]: [...card[type], newBar]}); // 배열에 새 bar 추가
  };

  const handleRemoveBar = (type: 'userBars' | 'charBars', barId: string) => {
    const updatedBars = card[type].filter(bar => bar.id !== barId); // 해당 bar만 제거
    onUpdate({[type]: updatedBars});
  };

  const handleTypeToggle = (type: 'userBars' | 'charBars', barId: string) => {
    const updatedBars = card[type].map(bar =>
      bar.id === barId ? {...bar, type: bar.type === 'dots' ? 'description' : 'dots'} : bar,
    );
    onUpdate({[type]: updatedBars});
  };
  const handlePriorityChange = () => {
    const newPriorityType = card.priorityType === 0 ? 1 : 0; // 0이면 1로, 1이면 0으로
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
          <button
            className={styles.arrowButton}
            onClick={() => {
              moveUp();
            }}
          >
            <img src={BoldArrowDown.src} style={{transform: 'rotate(180deg)'}} alt="Main" />
          </button>
          <button
            className={styles.arrowButton}
            onClick={() => {
              moveDown();
            }}
          >
            <img src={BoldArrowDown.src} alt="Main" />
          </button>
          <button
            className={styles.menuDotButton}
            onClick={() => {
              setIsDropDown(true);
            }}
          >
            <img src={BoldMenuDots.src} style={{transform: 'rotate(180deg)'}} alt="Main" />
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
              remove={() => remove()}
              duplicate={() => duplicate()}
              open={isDropDown}
              changePriority={() => handlePriorityChange()}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationCard;
