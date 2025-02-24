import React, {useState} from 'react';
import styles from './CreateContent.module.css';
import CreateContentIntroduction from './CreateContentIntroduction';
import TermsAndConditions from './TermsAndConditions';
import CreateSeriesContent from './CreateSeriesContent';
import SeriesDetail, {SeriesInfo} from './SeriesDetail';
import {ContentInfo} from './ContentCard';
import CreateContentEpisode from './CreateContentEpisode';

// 스텝을 관리하는 ENUM
enum Step {
  Introduction = 0,
  TermsAndConditions = 1,
  CreateSeriesContent = 2,
  SeriesDetail = 3,
  CreateEpisode = 4,
}

const CreateContent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Introduction);
  const [SeriesInfo, setCurSeriesInfo] = useState<SeriesInfo>();

  // 현재 스텝에 따라 렌더링할 컴포넌트 선택
  const renderStepContent = () => {
    switch (currentStep) {
      case Step.Introduction:
        return (
          <CreateContentIntroduction
            setCurContentInfo={setCurSeriesInfo}
            onNext={() => setCurrentStep(Step.TermsAndConditions)}
            onNextSeriesDetail={() => setCurrentStep(Step.SeriesDetail)}
          />
        );
      case Step.TermsAndConditions:
        return (
          <TermsAndConditions
            onPrev={() => setCurrentStep(Step.Introduction)}
            onNext={() => setCurrentStep(Step.CreateSeriesContent)}
          ></TermsAndConditions>
        );
      case Step.CreateSeriesContent:
        return (
          <CreateSeriesContent onPrev={() => setCurrentStep(Step.Introduction)} onNext={() => {}}></CreateSeriesContent>
        );
      case Step.SeriesDetail:
        return (
          <>
            {SeriesInfo && (
              <SeriesDetail
                seriesInfo={SeriesInfo}
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
      default:
        return null;
    }
  };

  return <>{renderStepContent()}</>;
};

export default CreateContent;
