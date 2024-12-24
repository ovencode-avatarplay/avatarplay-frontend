import React, {useState} from 'react';
import styles from './ConversationCard.module.css';
import {BoldMenuDots, PlusBubble, ProfileChar, ProfileUser} from '@ui/Icons';
import {ChatRoundDots, Close, Description, Description2} from '@ui/chatting';
import TextField from '@mui/material/TextField';

interface Bar {
  id: string;
  inputValue: string;
  type: 'dots' | 'description';
}

const ConversationCard: React.FC = () => {
  const [userBars, setUserBars] = useState<Bar[]>([{id: Date.now().toString(), inputValue: '', type: 'dots'}]);

  const UserHandleAddBar = () => {
    setUserBars(prevBars => [{id: Date.now().toString(), inputValue: '', type: 'dots'}, ...prevBars]);
  };

  const UserHandleInputChange = (id: string, value: string) => {
    setUserBars(prevBars => prevBars.map(bar => (bar.id === id ? {...bar, inputValue: value} : bar)));
  };

  const UserHandleKeyDown = (id: string, event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      // 기본 Enter 동작을 막음
      event.preventDefault();
    }
  };
  const UserHandleTypeToggle = (id: string) => {
    setUserBars(prevBars =>
      prevBars.map(bar => (bar.id === id ? {...bar, type: bar.type === 'dots' ? 'description' : 'dots'} : bar)),
    );
  };

  const UserHandleRemoveBar = (id: string) => {
    setUserBars(prevBars => prevBars.filter(bar => bar.id !== id));
  };

  const [charBars, setCharBars] = useState<Bar[]>([{id: Date.now().toString(), inputValue: '', type: 'dots'}]);

  const CharHandleAddBar = () => {
    setCharBars(prevBars => [{id: Date.now().toString(), inputValue: '', type: 'dots'}, ...prevBars]);
  };

  const CharHandleInputChange = (id: string, value: string) => {
    setCharBars(prevBars => prevBars.map(bar => (bar.id === id ? {...bar, inputValue: value} : bar)));
  };

  const CharHandleKeyDown = (id: string, event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      // 기본 Enter 동작을 막음
      event.preventDefault();
    }
  };
  const CharHandleTypeToggle = (id: string) => {
    setCharBars(prevBars =>
      prevBars.map(bar => (bar.id === id ? {...bar, type: bar.type === 'dots' ? 'description' : 'dots'} : bar)),
    );
  };

  const CharHandleRemoveBar = (id: string) => {
    setCharBars(prevBars => prevBars.filter(bar => bar.id !== id));
  };

  return (
    <div className={styles.card}>
      {/* 헤더 영역 */}
      <div className={styles.header}>
        Mandatory
        <div className={styles.blackIcon} onClick={() => {}}>
          <img src={BoldMenuDots.src} style={{transform: 'rotate(180deg)'}} alt="Main" />
        </div>
      </div>

      {/* 유저 영역 */}
      <div className={styles.chatGroup}>
        <div className={styles.userAvatar}>
          <img src={ProfileUser.src} style={{width: '30px', height: '48px'}} alt="User Avatar" />
          User
        </div>
        <div className={styles.barGroup}>
          {userBars.map((bar, index) => (
            <div key={bar.id} className={styles.inputBar}>
              <div className={styles.body}>
                <div className={styles.inputGroup}>
                  <div className={styles.icon} onClick={() => UserHandleTypeToggle(bar.id)}>
                    <img
                      src={bar.type === 'dots' ? ChatRoundDots.src : Description2.src}
                      style={{
                        width: bar.type === 'dots' ? '16px' : '24px',
                        height: bar.type === 'dots' ? '16px' : '24px',
                      }}
                      alt="Toggle Icon"
                    />
                  </div>
                  <div style={{width: '80%'}}>
                    <TextField
                      multiline
                      maxRows={4}
                      value={bar.inputValue}
                      onChange={e => UserHandleInputChange(bar.id, e.target.value)}
                      onKeyDown={e => UserHandleKeyDown(bar.id, e)}
                      placeholder="Write a message"
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          padding: '4px 1px',
                          fontFamily: 'Lato, sans-serif',
                          fontSize: '14px',
                          color: '#9aa0a6',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent',
                        },
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e8eaed',
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e8eaed',
                        },
                      }}
                    />
                  </div>

                  {index > 0 && (
                    <div onClick={() => UserHandleRemoveBar(bar.id)} className={styles.closeButton}>
                      <img src={Close.src} alt="Close Button" />
                    </div>
                  )}
                </div>
              </div>
              {index === 0 && (
                <div className={styles.plusButton} onClick={UserHandleAddBar}>
                  <img src={PlusBubble.src} alt="Add Button" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 캐릭터 영역 */}
      <div className={styles.chatGroup}>
        <div className={styles.userAvatar}>
          <img src={ProfileChar.src} style={{width: '30px', height: '48px'}} alt="User Avatar" />
          Char
        </div>
        <div className={styles.barGroup}>
          {charBars.map((bar, index) => (
            <div key={bar.id} className={styles.inputBar}>
              <div className={styles.body}>
                <div className={styles.inputGroup}>
                  <div className={styles.icon} onClick={() => CharHandleTypeToggle(bar.id)}>
                    <img
                      src={bar.type === 'dots' ? ChatRoundDots.src : Description2.src}
                      style={{
                        width: bar.type === 'dots' ? '16px' : '24px',
                        height: bar.type === 'dots' ? '16px' : '24px',
                      }}
                      alt="Toggle Icon"
                    />
                  </div>
                  <div style={{width: '80%'}}>
                    <TextField
                      multiline
                      maxRows={4}
                      value={bar.inputValue}
                      onChange={e => CharHandleInputChange(bar.id, e.target.value)}
                      onKeyDown={e => CharHandleKeyDown(bar.id, e)}
                      placeholder="Write a message"
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          padding: '4px 1px',
                          fontFamily: 'Lato, sans-serif',
                          fontSize: '14px',
                          color: '#9aa0a6',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent',
                        },
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e8eaed',
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e8eaed',
                        },
                      }}
                    />
                  </div>

                  {index > 0 && (
                    <div onClick={() => CharHandleRemoveBar(bar.id)} className={styles.closeButton}>
                      <img src={Close.src} alt="Close Button" />
                    </div>
                  )}
                </div>
              </div>
              {index === 0 && (
                <div className={styles.plusButton} onClick={CharHandleAddBar}>
                  <img src={PlusBubble.src} alt="Add Button" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
