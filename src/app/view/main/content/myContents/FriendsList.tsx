import React, {useState} from 'react';
import styles from './FriendsList.module.css';

interface Friend {
  id: number;
  name: string;
  desc: string;
  avatar: string;
  isOriginal: boolean;
}

const favoriteList: Friend[] = [
  {id: 1, name: 'Felixidol', desc: 'Likewise Andrew, you blahblah', avatar: '/images/001.png', isOriginal: true},
  {id: 2, name: 'Felixidol', desc: 'Likewise Andrew, you blahblah', avatar: '/images/001.png', isOriginal: true},
  {id: 3, name: 'Felixidol', desc: 'Likewise Andrew, you blahblah', avatar: '/images/001.png', isOriginal: true},
];

const followingList: Friend[] = [
  {id: 4, name: 'Felixidol', desc: 'Likewise Andrew, you blahblah', avatar: '/images/001.png', isOriginal: true},
  {id: 5, name: 'Felixidol', desc: 'Likewise Andrew, you blahblah', avatar: '/images/001.png', isOriginal: true},
  {id: 6, name: 'Felixidol', desc: 'Likewise Andrew, you blahblah', avatar: '/images/001.png', isOriginal: true},
];

const FriendsList: React.FC = () => {
  const [tab, setTab] = useState<'character' | 'dm'>('character');
  const [favOpen, setFavOpen] = useState(true);
  const [followOpen, setFollowOpen] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn}>{'<'}</button>
        <span className={styles.title}>Friends</span>
        <div className={styles.headerIcons}>
          <button className={styles.iconBtn} aria-label="search">
            <span className={styles.iconSearch} />
          </button>
          <button className={styles.iconBtn} aria-label="add">
            <span className={styles.iconAdd} />
          </button>
        </div>
      </div>
      <div className={styles.tabs}>
        <button className={tab === 'character' ? styles.activeTab : ''} onClick={() => setTab('character')}>
          Character
        </button>
        <button className={tab === 'dm' ? styles.activeTab : ''} onClick={() => setTab('dm')}>
          DM
        </button>
      </div>
      {tab === 'character' && (
        <div className={styles.sectionWrap}>
          <div className={styles.section}>
            <div className={styles.sectionHeader} onClick={() => setFavOpen(v => !v)}>
              <span>Favorite ({favoriteList.length})</span>
              <span className={favOpen ? styles.arrowDown : styles.arrowRight}></span>
            </div>
            {favOpen &&
              favoriteList.map(friend => (
                <div className={styles.friendRow} key={friend.id}>
                  <img src={friend.avatar} className={styles.avatar} alt="avatar" />
                  <div className={styles.info}>
                    <div className={styles.nameRow}>
                      <span className={styles.name}>{friend.name}</span>
                      {friend.isOriginal && <span className={styles.badge}>Original</span>}
                    </div>
                    <span className={styles.desc}>{friend.desc}</span>
                  </div>
                  <button className={styles.moreBtn}>...</button>
                </div>
              ))}
          </div>
          <div className={styles.section}>
            <div className={styles.sectionHeader} onClick={() => setFollowOpen(v => !v)}>
              <span>Following (300)</span>
              <span className={followOpen ? styles.arrowDown : styles.arrowRight}></span>
            </div>
            {followOpen &&
              followingList.map(friend => (
                <div className={styles.friendRow} key={friend.id}>
                  <img src={friend.avatar} className={styles.avatar} alt="avatar" />
                  <div className={styles.info}>
                    <div className={styles.nameRow}>
                      <span className={styles.name}>{friend.name}</span>
                      {friend.isOriginal && <span className={styles.badge}>Original</span>}
                    </div>
                    <span className={styles.desc}>{friend.desc}</span>
                  </div>
                  <button className={styles.moreBtn}>...</button>
                </div>
              ))}
          </div>
        </div>
      )}
      {tab === 'dm' && <div className={styles.dmTab}>DM 탭 내용</div>}
    </div>
  );
};

export default FriendsList;
