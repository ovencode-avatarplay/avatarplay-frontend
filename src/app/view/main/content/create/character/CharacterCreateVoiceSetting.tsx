import React from 'react';
import styles from './CharacterCreateVoiceSetting.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import {BoldAudioPlay} from '@ui/Icons';
import Splitters from '@/components/layout/shared/CustomSplitter';

interface Props {
  voiceOpen: boolean;
  setVoiceOpen: React.Dispatch<React.SetStateAction<boolean>>;
  notSetVoice: boolean;
  setNotSetVoice: React.Dispatch<React.SetStateAction<boolean>>;
  selectedVoiceId: number;
  setSelectedVoiceId: React.Dispatch<React.SetStateAction<number>>;
  pitchShift: number;
  setPitchShift: React.Dispatch<React.SetStateAction<number>>;
  pitchVariance: number;
  setPitchVariance: React.Dispatch<React.SetStateAction<number>>;
  speed: number;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
}

interface SoundItem {
  address: string;
  description: string;
}

interface VoiceData {
  id: number;
  label: string;
  gender: number;
  voiceDesc: string;
  soundData: SoundItem[];
}

const CharacterCreateVoiceSetting: React.FC<Props> = ({
  voiceOpen,
  setVoiceOpen,
  notSetVoice,
  setNotSetVoice,
  selectedVoiceId,
  setSelectedVoiceId,
  pitchShift,
  setPitchShift,
  pitchVariance,
  setPitchVariance,
  speed,
  setSpeed,
}) => {
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
      id: 1,
      label: 'Voice 1',
      gender: 0,
      voiceDesc: 'Voice Desc 1',
      soundData: [
        {address: 'url-to-sound1.mp3', description: 'Sound 1'},
        {address: 'url-to-sound2.mp3', description: 'Sound 2'},
      ],
    },
    {
      id: 2,
      label: 'Voice 2',
      gender: 1,
      voiceDesc: 'Voice Desc 2',
      soundData: [{address: 'url-to-sound2.mp3', description: 'Sound 2'}],
    },
    {
      id: 3,
      label: 'Voice 3',
      gender: 0,
      voiceDesc: 'Voice Desc 3',
      soundData: [{address: 'url-to-sound3.mp3', description: 'Sound 3'}],
    },
    {
      id: 4,
      label: 'Voice 4',
      gender: 1,
      voiceDesc: 'Voice Desc 4',
      soundData: [{address: 'url-to-sound4.mp3', description: 'Sound 4'}],
    },
  ];

  const renderVoiceItem = (voice: VoiceData) => (
    <div className={`${styles.voiceItem} ${notSetVoice ? styles.disabled : ''}`} key={voice.id}>
      <CustomRadioButton
        displayType="buttonOnly"
        shapeType="circle"
        value={voice.id}
        onSelect={() => {
          if (!notSetVoice) {
            setSelectedVoiceId(voice.id);
          }
        }}
        selectedValue={selectedVoiceId}
      />
      <div className={styles.voiceInfoArea}>
        <div className={styles.voiceTitle}>{voice.label}</div>
        <div className={styles.voiceDesc}>{voice.voiceDesc}</div>
        <ul className={styles.soundList}>
          {voice.soundData.map((item, index) => (
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
      content: <ul className={styles.voiceList}>{voiceData.map(renderVoiceItem)}</ul>,
    },
    {
      label: 'Male',
      content: <ul className={styles.voiceList}>{voiceData.filter(v => v.gender === 0).map(renderVoiceItem)}</ul>,
    },
    {
      label: 'Female',
      content: <ul className={styles.voiceList}>{voiceData.filter(v => v.gender === 1).map(renderVoiceItem)}</ul>,
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
            value={0}
            selectedValue={notSetVoice ? 0 : selectedVoiceId}
            onSelect={() => {
              setNotSetVoice(prev => !prev);
            }}
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
