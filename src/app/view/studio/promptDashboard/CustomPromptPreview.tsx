import React, {useEffect, useState} from 'react';
import {Modal, Box, Typography} from '@mui/material';
import styles from './CustomPromptPreview.module.css';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import getLocalizedText from '@/utils/getLocalizedText';

interface KeywordData {
  keyword: string;
  description: string;
  example: any;
  type: number;
}

interface Props {
  textValue: string;
  keywordData: KeywordData[];
  isOpen: boolean;
  onClose: () => void;
}

const CustomPromptPreview: React.FC<Props> = ({textValue, keywordData, isOpen, onClose}) => {
  const [processedText, setProcessedText] = useState<string>('');

  // Replace `{{keyword}}` placeholders with actual examples
  useEffect(() => {
    let newText = textValue;

    keywordData.forEach(({keyword, example}) => {
      const regex = new RegExp(keyword.replace(/[{}]/g, '\\$&'), 'g'); // Escaping curly braces
      newText = newText.replace(regex, example);
    });

    setProcessedText(newText);
  }, [textValue, keywordData]);

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="prompt-preview-title">
      <Box className={styles.modalBox}>
        <CreateDrawerHeader title={getLocalizedText('CreateModules', 'createmodules003_title_001')} onClose={onClose} />
        <div className={styles.modalContainer}>
          <pre className={styles.processedText}>{processedText}</pre>
        </div>
      </Box>
    </Modal>
  );
};

export default CustomPromptPreview;
