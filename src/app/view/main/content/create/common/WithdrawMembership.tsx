import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import styles from './WithdrawMembership.module.css';
import getLocalizedText from '@/utils/getLocalizedText';
import {BoldInfo} from '@ui/Icons';

interface WithdrawalModalProps {
  open: boolean;
  onClose: () => void;
  onWithdraw: () => void;
}

const WithdrawMembership: React.FC<WithdrawalModalProps> = ({open, onClose, onWithdraw}) => {
  const [checked, setChecked] = useState(false);

  const handleWithdraw = () => {
    if (checked) {
      onWithdraw();
    } else {
      alert('Please review all items before withdrawing.');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalBox}>
        <h2 className={styles.title}>{getLocalizedText('common_alert_068')}</h2>
        <div className={styles.content}>
          <p className={styles.subtitle}>
            <img src={BoldInfo.src} className={styles.infoIcon}></img>
            {getLocalizedText('common_alert_069')}
          </p>
          <ul className={styles.list}>
            <li>Once your member information is deleted, it cannot be recovered by any means.</li>
            <li>Upon withdrawal, profile information and other member data created on Caveduck will be deleted.</li>
            <li>You cannot sign up with the same email account for 7 days.</li>
            <li>
              Created characters will not be deleted. Please delete them yourself before withdrawing if necessary.
            </li>
          </ul>
        </div>

        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              sx={{color: '#2C3131', '&.Mui-checked': {color: '#2C3131'}}}
            />
          }
          label={getLocalizedText('common_alert_030')}
        />

        <div className={styles.buttonContainer}>
          <Button className={styles.reconsiderBtn} onClick={onClose}>
            Reconsider
          </Button>
          <Button className={styles.withdrawBtn} onClick={handleWithdraw}>
            Withdraw
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default WithdrawMembership;
