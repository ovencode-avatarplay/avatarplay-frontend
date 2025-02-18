import React, {useState} from 'react';
import styles from './CharacterCreateVoiceSetting.module.css';
import CustomToolTip from '@/components/layout/shared/CustomToolTip';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import {BoldAudioPlay} from '@ui/Icons';
import Splitters from '@/components/layout/shared/CustomSplitter';

interface Props {
  voiceOpen: boolean;
  setVoiceOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SoundItem {
  address: string;
  description: string;
}

interface VoiceData {
  label: string;
  gender: number;
  voiceDesc: string;
  soundData: SoundItem[];
}

const CharacterCreateVoiceSetting: React.FC<Props> = ({voiceOpen, setVoiceOpen}) => {
  const [pitchShift, setPitchShift] = useState(0);
  const [pitchVariance, setPitchVariance] = useState(0);
  const [speed, setSpeed] = useState(1);

  // 슬라이더 값 설정
  const pitchShiftMin = -24,
    pitchShiftMax = 24;
  const pitchVarianceMin = 0,
    pitchVarianceMax = 2,
    pitchVarianceStep = 0.1;
  const speedMin = 0.5,
    speedMax = 2,
    speedStep = 0.1;

  const voiceData: VoiceData[] = [
    {
      label: 'Voice 1',
      gender: 0,
      voiceDesc: 'Voice Desc 1',
      soundData: [
        {address: 'url-to-sound1.mp3', description: 'Sound 1'},
        {address: 'url-to-sound2.mp3', description: 'Sound 2'},
      ],
    },
    {
      label: 'Voice 2',
      gender: 1,
      voiceDesc: 'Voice Desc 2',
      soundData: [{address: 'url-to-sound2.mp3', description: 'Sound 2'}],
    },
    {
      label: 'Voice 3',
      gender: 0,
      voiceDesc: 'Voice Desc 3',
      soundData: [{address: 'url-to-sound3.mp3', description: 'Sound 3'}],
    },
    {
      label: 'Voice 4',
      gender: 1,
      voiceDesc: 'Voice Desc 4',
      soundData: [{address: 'url-to-sound4.mp3', description: 'Sound 4'}],
    },
  ];

  const renderVoiceItem = (label: string, desc: string, soundData: SoundItem[]) => (
    <div className={styles.voiceItem}>
      <CustomRadioButton displayType="buttonOnly" shapeType="circle" value="" onSelect={() => {}} selectedValue={''} />
      <div className={styles.voiceInfoArea}>
        <div className={styles.voiceTitle}>{label}</div>
        <div className={styles.voiceDesc}>{desc}</div>
        <ul className={styles.soundList}>
          {soundData.map((item, index) => (
            <div className={styles.soundItem} key={index}>
              <button className={styles.soundButton}>
                <img className={styles.soundIcon} src={BoldAudioPlay.src} alt="Play Icon" />
              </button>
              <div className={styles.soundText}>{item.description}</div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );

  const voiceSplitter = [
    {
      label: 'All',
      content: (
        <ul className={styles.voiceList}>
          {voiceData.map(item => (
            <div className={styles.voiceItem}>{renderVoiceItem(item.label, item.voiceDesc, item.soundData)}</div>
          ))}
        </ul>
      ),
    },
    {
      label: 'Male',
      content: (
        <ul className={styles.voiceList}>
          {voiceData
            .filter(item => item.gender === 0)
            .map(item => (
              <div>{renderVoiceItem(item.label, item.voiceDesc, item.soundData)}</div>
            ))}
        </ul>
      ),
    },
    {
      label: 'Female',
      content: (
        <ul className={styles.voiceList}>
          {voiceData
            .filter(item => item.gender === 1)
            .map(item => (
              <div>{renderVoiceItem(item.label, item.voiceDesc, item.soundData)}</div>
            ))}
        </ul>
      ),
    },
  ];

  return (
    <>
      <CustomDrawer open={voiceOpen} onClose={() => setVoiceOpen(false)} title="Select Voices">
        <div className={styles.voiceDrawerContainer}>
          <CustomRadioButton
            displayType="buttonText"
            shapeType="circle"
            label="I will not set the voice"
            value="False"
            selectedValue={'False'}
            onSelect={() => {}}
          />
          <Splitters
            splitters={voiceSplitter}
            placeholderWidth="40%"
            headerStyle={{padding: '0'}}
            contentStyle={{padding: '0'}}
          />
        </div>
        <div className={styles.pitchArea}>
          <div className={styles.sliderContainer}>
            <label htmlFor="pitchShift" className={styles.sliderLabel}>
              Pitch Shift {pitchShift}
            </label>
            <div className={styles.sliderWrapper}>
              <input
                id="pitchShift"
                type="range"
                min={pitchShiftMin}
                max={pitchShiftMax}
                value={pitchShift}
                onChange={e => setPitchShift(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>
          <div className={styles.sliderContainer}>
            <label htmlFor="pitchVariance" className={styles.sliderLabel}>
              Pitch Variance {pitchVariance}
            </label>
            <div className={styles.sliderWrapper}>
              <input
                id="pitchVariance"
                type="range"
                min={pitchVarianceMin}
                max={pitchVarianceMax}
                value={pitchVariance}
                step={pitchVarianceStep}
                onChange={e => setPitchVariance(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>
          <div className={styles.sliderContainer}>
            <label htmlFor="speed" className={styles.sliderLabel}>
              Speed {speed}
            </label>
            <div className={styles.sliderWrapper}>
              <input
                id="speed"
                type="range"
                min={speedMin}
                max={speedMax}
                value={speed}
                step={speedStep}
                onChange={e => setSpeed(Number(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>
        </div>
      </CustomDrawer>
    </>
  );
};

export default CharacterCreateVoiceSetting;
