import React from 'react';
import CustomButton from '@/components/layout/shared/CustomButton';
import {BoldHome} from '@ui/Icons';

const sizes = ['Large', 'Medium', 'Small'] as const;
const states = ['Normal', 'IconLeft', 'IconRight', 'Icon'] as const;
const types = ['ColorPrimary', 'Primary', 'Secondary', 'Tertiary'] as const;

const ComponentTesting: React.FC = () => {
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
    </main>
  );
};

export default ComponentTesting;
