import React from 'react';
import styles from './ContentItem.module.css'; 

interface ContentItemProps {
    thumbnailSrc: string;
    createdDate: string;
    buttonShareText: string;
    title: string;
    talkCount: number;
    peopleCount: number;
    isSelected: boolean;
}

const ContentItem: React.FC<ContentItemProps> = ({
    thumbnailSrc,
    createdDate,
    buttonShareText,
    title,
    talkCount,
    peopleCount,
    isSelected,
}) => {
    return (
        <div className={styles.container} style={{ backgroundColor: isSelected ? 'red' : 'blue' }}>
            <div className={styles.thumbnail}>
                <img src={thumbnailSrc} alt="Thumbnail" />
            </div>
            <div className={styles.description}>
                <div className={styles.topRow}>
                    <span className={styles.createdDate}>{createdDate}</span>
                    <button className={styles.buttonShare}>{buttonShareText}</button>
                </div>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.bottomRow}>
                    <span className={styles.talkCount}>{`Talk Count: ${talkCount}`}</span>
                    <span className={styles.people}>{`People: ${peopleCount}`}</span>
                </div>
            </div>
        </div>
    );
};

export default ContentItem;
