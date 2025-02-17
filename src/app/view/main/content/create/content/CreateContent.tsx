import React, {useState} from 'react';
import styles from './CreateContent.module.css';
import CreateContentIntroduction from './CreateContentIntroduction';
import TermsAndConditions from './TermsAndConditions';
import CreateSeriesContent from './CreateSeriesContent';

// 스텝을 관리하는 ENUM
enum Step {
  Introduction = 0,
  TermsAndConditions = 1,
  CreateSeriesContent = 2,
}

const CreateContent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Introduction);

  // 현재 스텝에 따라 렌더링할 컴포넌트 선택
  const renderStepContent = () => {
    switch (currentStep) {
      case Step.Introduction:
        return <CreateContentIntroduction onNext={() => setCurrentStep(Step.TermsAndConditions)} />;
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
      default:
        return null;
    }
  };

  return <>{renderStepContent()}</>;
};

export default CreateContent;
