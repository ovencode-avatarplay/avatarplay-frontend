import React, {useState} from 'react';
import styles from './RewardContent.module.css';
import TestAdModal from '../../header/header-nav-bar/TestAdModal';

const RewardContent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.rewardContainer}>
      {/* Referral Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Referral</h3>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <h4>Invite friends</h4>
            <p>Invite your friends with the referral link and earn free rubies</p>
          </div>
          <button className={styles.button}>Claim</button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardContent}>
            <h4>Register a referral code and earn free rubies</h4>
            <p className={styles.warningText}>You can only register a referral code within 24 hours of signing up</p>
          </div>
          <button className={styles.button}>Free</button>
        </div>
      </div>

      {/* Creative Incentive Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Creative Incentive</h3>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <h4>Invite your friends with the referral link and earn free rubies</h4>
          </div>
          <button className={styles.button}>Claim</button>
        </div>
      </div>

      {/* Watch Ads Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Watch Ads</h3>
        {[50, 50, 100, 150, 200].map((reward, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.adBadge}>Ad</div>
              <span className={styles.adReward}>+{reward}</span>
            </div>
            <button className={styles.button} onClick={() => setIsModalOpen(true)}>
              Watch
            </button>
          </div>
        ))}
      </div>

      {/* Follow & Subscribe Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Referral</h3>
        {['Notification', 'YouTube', 'Instagram', 'Facebook', 'Tiktok'].map((platform, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.cardContent}>
              <h4>Follow us on {platform}</h4>
              <p>Earn +20 Rubies</p>
            </div>
            <button className={styles.button}>Move</button>
          </div>
        ))}
      </div>
      <TestAdModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}></TestAdModal>
    </div>
  );
};

export default RewardContent;
