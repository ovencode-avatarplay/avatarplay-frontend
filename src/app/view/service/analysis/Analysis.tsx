'use client';

import styles from './analysis.module.css';

import * as React from 'react';
import {BarChart} from '@mui/x-charts/BarChart';
import {dataset, valueFormatter} from './DataSample';

const chartSettingX = {
  xAxis: [
    {
      label: 'Sample Analysis',
    },
  ],
  width: 400,
  height: 800,
};

const chartSettingY = {
  yAxis: [
    {
      // 'label: 'Sample Analysis2',
    },
  ],
  barGap: 10, // 막대 간 간격 설정
  width: 400,
  height: 400,
};

export const Analysis: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      {/* 가로 방향 차트 */}
      <div className={styles['bar-chart-container']}>
        <BarChart
          dataset={dataset}
          yAxis={[{scaleType: 'band', dataKey: 'character'}]}
          series={[{dataKey: 'seoul', label: 'Ruby 수익', valueFormatter}]}
          layout="horizontal"
          {...chartSettingX}
        />
      </div>

      {/* 세로 방향 차트 */}
      <div className={styles['bar-chart-container']}>
        <BarChart
          dataset={dataset}
          xAxis={[{scaleType: 'band', dataKey: 'character'}]}
          series={[{dataKey: 'seoul', label: '월간 수익', valueFormatter}]}
          layout="vertical"
          {...chartSettingY}
        />
      </div>
    </div>
  );
};
