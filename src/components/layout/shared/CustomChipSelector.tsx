import {LineClose, LinePlus} from '@ui/Icons';
import CustomButton from './CustomButton';
import styles from './CustomChipSelector.module.css';
import getLocalizedText from '@/utils/getLocalizedText';

/* string[] 로 받아오는 경우는 tag 사용 */
/* 복잡한건 reactNode를 직접 삽입 */
type Props = {
  label: string | React.ReactNode;
  onClick: () => void;
  tagType: 'tags' | 'node';
  tags?: string[];
  handleTagSelect?: (tag: string) => void;
  reactNode?: React.ReactNode;
  error?: boolean;
  containerStyle?: React.CSSProperties;
};

const CustomChipSelector = ({
  label,
  onClick,
  tagType,
  tags,
  handleTagSelect,
  reactNode,
  error,
  containerStyle,
}: Props) => {
  return (
    <div className={`${styles.customChipSelectorContainer}`} style={containerStyle}>
      <CustomButton
        size="Medium"
        type={'Tertiary'}
        state="IconRight"
        icon={LinePlus.src}
        onClick={() => onClick()}
        customClassName={[styles.selectorOpenButton, error ? styles.isError : '']}
      >
        {label}
      </CustomButton>
      {tagType === 'node' && reactNode && reactNode}
      {tagType === 'tags' && tags && (
        <div className={styles.blackTagContainer}>
          {tags.map((tag, index) => (
            <div key={index} className={styles.blackTag}>
              {getLocalizedText(`${tag}`)}
              <img
                src={LineClose.src}
                className={styles.lineClose}
                onClick={() => {
                  if (handleTagSelect) {
                    handleTagSelect(tag);
                  }
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomChipSelector;
