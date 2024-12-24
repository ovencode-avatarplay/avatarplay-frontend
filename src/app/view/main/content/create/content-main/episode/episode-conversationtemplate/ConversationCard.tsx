import React from 'react';
import styles from './ConversationCard.module.css';
import {BoldMenuDots, ProfileUser} from '@ui/Icons';
import {ChatRoundDots, Description, Description2} from '@ui/chatting';

interface ConversationCardProps {
  userType?: 'User' | 'Char';
}

const ConversationCard: React.FC<ConversationCardProps> = ({userType}) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        Mandatory
        <div className={styles.blackIcon} onClick={() => {}}>
          <img src={BoldMenuDots.src} style={{transform: 'rotate(180deg)'}} alt="Main" />
        </div>
      </div>
      <div className={styles.chatGroup}>
        <div className={styles.userAvatar}>
          <img src={ProfileUser.src} style={{width: '30px', height: '48px'}} />
          User
        </div>
        <div className={styles.body}>
          <div className={styles.inputGroup}>
            <div className={styles.icon}>
              <img src={ChatRoundDots.src} style={{width: '16px', height: '16px'}} />
            </div>
            <input type="text" className={styles.inputField} placeholder="Write a message" />
          </div>
          <div className={styles.inputGroup}>
            <div className={styles.icon}>
              <img src={Description2.src} style={{width: '24px', height: '24px'}} />
            </div>
            <input type="text" className={styles.inputField} placeholder="Describe your action..." />
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.inputGroup}>
          <div className={styles.icon}></div>
          <input type="text" className={styles.inputField} placeholder="Write a message" />
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.actionIcon}></div>
          <input type="text" className={styles.inputField} placeholder="Describe your action..." />
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
