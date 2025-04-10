import React, {useState} from 'react';
import styles from './ChatSearchMain.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import {Drawer} from '@mui/material';
import SearchBar from './SearchBar';
import MessageTagList from '../01_Layout/MessageTagList';
import RecentSearchList from './RecentSearchList';
import PopularTagList from './PopularTagList';
import {relative} from 'path';
import EmptyState from '@/components/search/EmptyState';
const tags = ['All', 'My', 'Story', 'Music', 'Gravure', 'Custom1', 'Custom2'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChatSearchMain: React.FC<Props> = ({isOpen, onClose}) => {
  const [selectedTag, setSelectedTag] = useState(tags[0]);
  const [searchText, setSearchText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false); // 포커싱 상태

  const renderSubMenu = () => {
    if (!isInputFocused) return null;
    return (
      <div className={styles.subMenu}>
        <RecentSearchList
          initialItems={['anime', 'Prince', 'anime3']}
          onRemove={keyword => console.log(`${keyword} removed`)}
        />
        <PopularTagList tags={['Romance', 'Fantasy', 'AI Friend']} onTagClick={tag => console.log('clicked:', tag)} />
      </div>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      ModalProps={{style: {zIndex: 3000}}}
      PaperProps={{
        className: styles.drawerContainer,
        sx: {width: '100%', height: '100%', position: 'relative'},
      }}
    >
      <SearchBar
        onBack={onClose}
        onSearchTextChange={text => {
          setSearchText(text);
        }}
        onFocusChange={isFocused => setIsInputFocused(isFocused)}
      />

      {renderSubMenu()}

      <MessageTagList tags={tags} defaultTag="All" onTagChange={tag => setSelectedTag(tag)} />
      <div className={styles.noFoundSearch}>
        <EmptyState stateText="No search results found." />
      </div>
    </Drawer>
  );
};

export default ChatSearchMain;
