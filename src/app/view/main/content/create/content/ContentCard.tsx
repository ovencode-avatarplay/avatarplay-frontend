import React, {useEffect, useState} from 'react';
import styles from './ContentCard.module.css';
import {BoldChatRoundDots, BoldFollowers, BoldMenuDots, BoldStar, LineDelete, LineEdit, LineMenu} from '@ui/Icons';
import {ContentListInfo, ContentState, VisibilityType} from '@/app/NetWork/ContentNetwork';
import DropDownMenu, {DropDownMenuItem} from '@/components/create/DropDownMenu';
import getLocalizedText from '@/utils/getLocalizedText';

interface ContentCardProps {
  content: ContentListInfo;
  onAddEpisode: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isSingle?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({content, onAddEpisode, onEdit, onDelete, isSingle = false}) => {
  const isVideo = content.thumbnailUrl.match(/\.(mp4|webm|ogg)$/i);
  const [dropBoxOpen, setDropBoxOpen] = useState<boolean>(false);
  const dropDownMenuItems: DropDownMenuItem[] = [
    {
      name: getLocalizedText('common_dropdown_edit'),
      icon: LineEdit.src,
      onClick: () => {
        onEdit();
      },
    },
    {
      name: getLocalizedText('common_button_delete'),
      icon: LineDelete.src,
      onClick: () => {
        onDelete();
      },
      isRed: true, // Delete는 위험 동작으로 표시
    },
  ];
  return (
    <div className={styles.card}>
      {/* 상단 메뉴 */}
      {content.state === ContentState.Upload && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          Uploading...
        </div>
      )}
      <div className={styles.topMenu}>
        {content.name}
        <img src={BoldMenuDots.src} className={styles.menuDots} onClick={() => setDropBoxOpen(true)}></img>
      </div>

      {/* 콘텐츠 정보 */}
      <div className={styles.contentSection}>
        <div className={styles.thumbnail}>
          {isVideo ? (
            <video
              src={content.thumbnailUrl}
              className={styles.video}
              controls={false}
              muted
              autoPlay={false}
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
            />
          ) : (
            <img src={content.thumbnailUrl} alt="Webtoon Thumbnail" />
          )}
          <span className={styles.status}>{VisibilityType[content.visibility]}</span>
        </div>

        <div className={styles.infoBox}>
          <p className={styles.genre}>{getLocalizedText(content.genre)}</p>
          <p className={styles.description}>{content.description}</p>

          {/* 평점 및 조회수 */}
          {/* <div className={styles.bottomInfo}>
            <div className={styles.rating}>
              <img src={BoldStar.src} className={styles.star} /> {content.}
            </div>
          </div> */}

          {/* 에피소드 정보 */}
          <div className={styles.episodeInfo}>
            {isSingle != true && (
              <strong>
                {getLocalizedText('createcontent001_label_010')} {content.episodeCount}
              </strong>
            )}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <img src={BoldFollowers.src} className={styles.icon} alt="views" />
                {content.subscriberCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <button className={styles.addButton} onClick={onAddEpisode}>
        {getLocalizedText('createcontent001_button_006')}
      </button>

      {dropBoxOpen && (
        <>
          <DropDownMenu
            items={dropDownMenuItems}
            onClose={() => setDropBoxOpen(false)}
            className={styles.DropDown}
            useSelected={false}
          />
        </>
      )}
    </div>
  );
};

export default ContentCard;
