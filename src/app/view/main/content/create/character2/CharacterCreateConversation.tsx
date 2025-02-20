import CustomButton from '@/components/layout/shared/CustomButton';
import styles from './CharacterCreateConversation.module.css';
import {LinePlus} from '@ui/Icons';
import ConversationCard, {CardData} from '../content-main/episode/episode-conversationtemplate/ConversationCard';

interface Props {
  cardList: CardData[];
  setCardList: React.Dispatch<React.SetStateAction<CardData[]>>;
  onAddCard: () => void;
  onRemoveCard: (id: string) => void;
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
  let title = 'Conversation Example';
  let desc = `Appropriate dialogue examples help to show the character's dialogue style.
Shortcut [alt+n:add] [alt+up:prev] [alt+down:next]`;

  const handleUpdateCard = (updatedCard: Partial<CardData>) => {
    if (!updatedCard.id) {
      const foundCard = cardList.find(
        card =>
          updatedCard.userBars?.some(bar => bar.id.includes(card.id)) ||
          updatedCard.charBars?.some(bar => bar.id.includes(card.id)),
      );

      if (foundCard) {
        updatedCard.id = foundCard.id;
      } else {
        console.error('No matching card found for update:', updatedCard);
        return;
      }
    }

    setCardList(prevCards => prevCards.map(card => (card.id === updatedCard.id ? {...card, ...updatedCard} : card)));
  };

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
        onClick={onAddCard}
        iconClass={styles.buttonIcon}
        icon={LinePlus.src}
        customClassName={[styles.newButton]}
      >
        Add example new
      </CustomButton>
      <ul className={styles.conversationList}>
        {cardList.map((cardData, index) => (
          <ConversationCard
            key={cardData.id}
            card={cardData}
            remove={() => onRemoveCard(cardData.id)}
            onUpdate={handleUpdateCard}
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
