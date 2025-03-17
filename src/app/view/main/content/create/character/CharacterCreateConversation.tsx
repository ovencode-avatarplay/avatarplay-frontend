import CustomButton from '@/components/layout/shared/CustomButton';
import styles from './CharacterCreateConversation.module.css';
import {LinePlus} from '@ui/Icons';
import ConversationCard, {CardData} from '../story-main/episode/episode-conversationtemplate/ConversationCard';
import getLocalizedText from '@/utils/getLocalizedText';
import formatText from '@/utils/formatText';

interface Props {
  cardList: CardData[];
  setCardList: React.Dispatch<React.SetStateAction<CardData[]>>;
  onAddCard: () => void;
  onRemoveCard: (id: number) => void;
  onUpdateCard: (updatedCard: CardData) => void;
  onMoveCard: (index: number, direction: 'up' | 'down') => void;
  onDuplicateCard: (index: number) => void;
}

const CharacterCreateConversation: React.FC<Props> = ({
  cardList,
  setCardList,
  onAddCard,
  onRemoveCard,
  onUpdateCard,
  onMoveCard,
  onDuplicateCard,
}) => {
  return (
    <div className={styles.conversationContainer}>
      <div className={styles.titleArea}>
        <h2 className={styles.title2}>{getLocalizedText('CreateCharacter', 'createcharacter016_desc_001')}</h2>
        <div className={styles.desc}>
          {formatText(getLocalizedText('CreateCharacter', 'createcharacter016_desc_002'))}
        </div>
      </div>
      <CustomButton
        size="Large"
        type="Tertiary"
        state="IconLeft"
        onClick={onAddCard}
        iconClass={styles.buttonIcon}
        icon={LinePlus.src}
        customClassName={[styles.newButton]}
      >
        {getLocalizedText('Common', 'common_button_addexamplenewaltn')}
      </CustomButton>
      <ul className={styles.conversationList}>
        {cardList.map((cardData, index) => (
          <ConversationCard
            key={cardData.id}
            card={cardData}
            remove={() => onRemoveCard(cardData.id)}
            onUpdate={updatedCard => {
              setCardList(prevCards => prevCards.map(c => (c.id === cardData.id ? {...c, ...updatedCard} : c)));
            }}
            moveDown={() => onMoveCard(index, 'down')}
            moveUp={() => onMoveCard(index, 'up')}
            duplicate={() => onDuplicateCard(index)}
          />
        ))}
      </ul>
    </div>
  );
};
export default CharacterCreateConversation;
