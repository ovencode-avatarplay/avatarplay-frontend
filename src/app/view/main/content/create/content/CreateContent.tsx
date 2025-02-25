import React, {useEffect, useState} from 'react';
import styles from './CreateContent.module.css';
import CreateContentIntroduction from './CreateContentIntroduction';
import TermsAndConditions from './TermsAndConditions';
import CreateSeriesContent from './CreateSeriesContent';
import SeriesDetail, {SeriesInfo} from './SeriesDetail';
import {ContentInfo} from './ContentCard';
import CreateContentEpisode from './CreateContentEpisode';
import CreateSingleContent from './CreateSingleContent';
import SingleDetail, {mockSingle, SingleInfo} from './SingleDetail';

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
  const [seriesInfo, setCurSeriesInfo] = useState<SeriesInfo>();
  const [singleInfo, setCurSingleInfo] = useState<SingleInfo>(mockSingle);
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
            setCurSingleInfo={setCurSingleInfo}
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
            {seriesInfo && (
              <SeriesDetail
                seriesInfo={seriesInfo}
                onPrev={() => setCurrentStep(Step.Introduction)}
                onNext={() => setCurrentStep(Step.CreateEpisode)}
              ></SeriesDetail>
            )}
          </>
        );
      case Step.CreateEpisode:
        return (
          <CreateContentEpisode
            onPrev={() => setCurrentStep(Step.SeriesDetail)}
            onNext={() => setCurrentStep(Step.SeriesDetail)}
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
            {singleInfo && (
              <SingleDetail
                singleInfo={singleInfo}
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
