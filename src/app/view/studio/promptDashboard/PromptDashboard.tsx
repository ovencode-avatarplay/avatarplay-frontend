import React from 'react';
import styles from './PromptDashboard.module.css';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import {useRouter} from 'next/navigation';
import Splitters from '@/components/layout/shared/CustomSplitter';

const PromptDashboard: React.FC = () => {
  const router = useRouter();

  const handleOnClose = () => {
    router.back();
  };

  const renderPromptArea = () => {
    return <>Prompt</>;
  };

  const renderLoreBookArea = () => {
    return <>LoreBook</>;
  };

  const splitData = [
    {
      label: 'Prompt',
      preContent: '',
      content: <>{renderPromptArea}</>,
    },
    {
      label: 'Lorebook',
      preContent: '',
      content: <>{renderLoreBookArea}</>,
    },
  ];

  return (
    <div style={{marginTop: '58px'}}>
      <div className={styles.promptContainer}>
        <CreateDrawerHeader title="Create Content" onClose={handleOnClose} />
        <Splitters splitters={splitData} />
      </div>
    </div>
  );
};

export default PromptDashboard;
