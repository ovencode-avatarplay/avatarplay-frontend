import React, {useState} from 'react';
import CustomButton from '@/components/layout/shared/CustomButton';
import {BoldHome, LineSearch} from '@ui/Icons';
import CustomInput from './CustomInput';

const sizes = ['Large', 'Medium', 'Small'] as const;
const states = ['Normal', 'IconLeft', 'IconRight', 'Icon'] as const;
const types = ['ColorPrimary', 'Primary', 'Secondary', 'Tertiary'] as const;

const ComponentTesting: React.FC = () => {
  const [inputValues, setInputValues] = useState({
    basic: '',
    leftIcon: '',
    rightIcon: '',
    twoIcon: '',
  });

  const handleInputChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues(prev => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const [inputError, setInputError] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);

  return (
    <main style={{display: 'flex', flexDirection: 'column', gap: '32px', height: '80vh', overflow: 'scroll'}}>
      {types.map(type => (
        <section key={type} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <h3>{type}</h3>
          {states.map(state => (
            <>
              <strong>{state}</strong>
              <div key={state} style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
                {sizes.map(size => (
                  <CustomButton
                    key={`${type}-${state}-${size}`}
                    size={size}
                    state={state}
                    type={type}
                    icon={BoldHome.src}
                    // style={{width: 'calc(100% - 32px)', maxWidth: '370px'}}
                  >
                    {state !== 'Icon' ? 'Button' : ''}
                  </CustomButton>
                ))}
              </div>

              <strong>disabled</strong>
              <div key={state} style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
                {sizes.map(size => (
                  <CustomButton
                    key={`${type}-${state}-${size}`}
                    size={size}
                    state={state}
                    type={type}
                    icon={BoldHome.src}
                    // style={{width: 'calc(100% - 32px)', maxWidth: '370px'}}
                    isDisabled={true}
                  >
                    {state !== 'Icon' ? 'Button' : ''}
                  </CustomButton>
                ))}
              </div>
            </>
          ))}
        </section>
      ))}

      <>
        <div>
          <h2>Custom Input Test</h2>

          <div>
            <h3>Text Type: Default</h3>
            <CustomInput
              textType="InputOnly"
              inputType="Basic"
              value={inputValues.basic}
              onChange={handleInputChange('basic')}
              placeholder="Basic Input"
              error={inputError}
              disabled={inputDisabled}
            />
          </div>

          <div>
            <h3>Text Type: Label</h3>
            <CustomInput
              textType="Label"
              inputType="LeftIcon"
              label="Label Input"
              value={inputValues.leftIcon}
              onChange={handleInputChange('leftIcon')}
              placeholder="Input with Left Icon"
              iconLeft={<img src={LineSearch.src} />}
              error={inputError}
              disabled={inputDisabled}
            />
          </div>

          <div>
            <h3>Text Type: Hint</h3>
            <CustomInput
              textType="Hint"
              inputType="RightIcon"
              hint="This is a hint text"
              value={inputValues.rightIcon}
              onChange={handleInputChange('rightIcon')}
              placeholder="Input with Right Icon"
              iconRight={<img src={LineSearch.src} />}
              error={inputError}
              disabled={inputDisabled}
            />
          </div>

          <div>
            <h3>Text Type: Label and Hint</h3>
            <CustomInput
              textType="LabelandHint"
              inputType="TwoIcon"
              label="Label and Hint Input"
              hint="This is a hint text for Label and Hint"
              value={inputValues.twoIcon}
              onChange={handleInputChange('twoIcon')}
              placeholder="Input with Two Icons"
              iconLeft={<img src={LineSearch.src} />}
              iconRight={<img src={LineSearch.src} />}
              error={inputError}
              disabled={inputDisabled}
            />
          </div>
        </div>

        <CustomButton
          size="Small"
          state="Normal"
          type={inputError ? 'ColorPrimary' : 'Primary'}
          onClick={() => {
            setInputError(!inputError);
          }}
        >
          Error
        </CustomButton>

        <CustomButton
          size="Small"
          state="Normal"
          type={inputDisabled ? 'ColorPrimary' : 'Primary'}
          onClick={() => {
            setInputDisabled(!inputDisabled);
          }}
        >
          Disable {inputDisabled}
        </CustomButton>
      </>
    </main>
  );
};

export default ComponentTesting;
