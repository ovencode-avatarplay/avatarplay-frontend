import CustomButton from '@/components/layout/shared/CustomButton';
import styles from './CharacterCreateConversation.module.css';
import {LinePlus} from '@ui/Icons';

interface Props {}

const CharacterCreateConversation: React.FC<Props> = ({}) => {
  let title = 'Conversation Example';
  let desc = `Appropriate dialogue examples help to show the character's dialogue style.
Shortcut [alt+n:add] [alt+up:prev] [alt+down:next]`;

  return (
    <div className={styles.conversationContainer}>
      <div className={styles.titleArea}>
        <h2 className={styles.title2}>{title}</h2>
        <div className={styles.desc}>{desc}</div>
      </div>
      <CustomButton
        size="Large"
        type="Tertiary"
        state="IconLeft"
        onClick={() => {}}
        iconClass={styles.buttonIcon}
        icon={LinePlus.src}
        customClassName={[styles.newButton]}
      >
        Add example new
      </CustomButton>
    </div>
  );
};
export default CharacterCreateConversation;
