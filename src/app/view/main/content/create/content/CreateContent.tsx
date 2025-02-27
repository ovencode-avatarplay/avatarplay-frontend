import React, {useEffect, useState} from 'react';
import styles from './CreateContent.module.css';
import CreateContentIntroduction from './CreateContentIntroduction';
import TermsAndConditions from './TermsAndConditions';
import CreateSeriesContent from './CreateSeriesContent';
import SeriesDetail from './SeriesDetail';
import CreateContentEpisode from './CreateContentEpisode';
import CreateSingleContent from './CreateSingleContent';
import SingleDetail, {mockSingle, SingleInfo} from './SingleDetail';
import {ContentEpisodeInfo, ContentListInfo} from '@/app/NetWork/ContentNetwork';

// 스텝을 관리하는 ENUM
enum Step {
  Introduction = 0,
  TermsAndConditions = 1,
  CreateSeriesContent = 2,
  SeriesDetail = 3,
  CreateEpisode = 4,
  CreateSingleContent = 5,
  SingleDetail = 6,
}

const CreateContent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Introduction);
  const [curContentInfo, setCurSeriesInfo] = useState<ContentListInfo>();
  const [curSeason, setCurSeason] = useState<number>(0);
  const [curEpisodeCount, setEpisodeCount] = useState<number>(0);
  const [isSingle, setIssingle] = useState<boolean>(false);

  useEffect(() => {
    console.log('asda', isSingle, currentStep);
  }, [isSingle, currentStep]);

  // 현재 스텝에 따라 렌더링할 컴포넌트 선택
  const renderStepContent = () => {
    switch (currentStep) {
      case Step.Introduction:
        return (
          <CreateContentIntroduction
            setCurContentInfo={setCurSeriesInfo}
            onNext={() => setCurrentStep(Step.TermsAndConditions)}
            onNextSeriesDetail={() => setCurrentStep(Step.SeriesDetail)}
            onNextSingleDetail={() => setCurrentStep(Step.SingleDetail)}
            isSingle={setIssingle}
          />
        );
      case Step.TermsAndConditions:
        return (
          <TermsAndConditions
            onPrev={() => setCurrentStep(Step.Introduction)}
            onNext={() => {
              if (!isSingle) setCurrentStep(Step.CreateSeriesContent);
              else setCurrentStep(Step.CreateSingleContent);
            }}
          ></TermsAndConditions>
        );
      case Step.CreateSeriesContent:
        return (
          <CreateSeriesContent onPrev={() => setCurrentStep(Step.Introduction)} onNext={() => {}}></CreateSeriesContent>
        );
      case Step.SeriesDetail:
        return (
          <>
            {curContentInfo && (
              <SeriesDetail
                contentInfo={curContentInfo}
                onPrev={() => setCurrentStep(Step.Introduction)}
                onNext={() => setCurrentStep(Step.CreateEpisode)}
                setCurSeason={setCurSeason}
                setEpisodeCount={setEpisodeCount}
              ></SeriesDetail>
            )}
          </>
        );
      case Step.CreateEpisode:
        return (
          <CreateContentEpisode
            onPrev={() => setCurrentStep(Step.SeriesDetail)}
            onNext={() => setCurrentStep(Step.SeriesDetail)}
            contentInfo={curContentInfo}
            curSeason={curSeason}
            curEpisodeCount={curEpisodeCount}
          ></CreateContentEpisode>
        );
      case Step.CreateSingleContent:
        return (
          <CreateSingleContent
            onPrev={() => setCurrentStep(Step.SingleDetail)}
            onNext={() => setCurrentStep(Step.SingleDetail)}
          ></CreateSingleContent>
        );
      case Step.SingleDetail:
        return (
          <>
            {curContentInfo && (
              <SingleDetail
                contentInfo={curContentInfo}
                onPrev={() => setCurrentStep(Step.Introduction)}
                onNext={() => setCurrentStep(Step.CreateEpisode)}
              ></SingleDetail>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return <>{renderStepContent()}</>;
};

export default CreateContent;
