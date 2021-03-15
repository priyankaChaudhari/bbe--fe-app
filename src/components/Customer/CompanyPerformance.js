import React from 'react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import {
  // CopyLinkIcon,
  // InfoIcons,
  // ExternalLink,

  ArrowUpIcon,
  ArrowDownIcon,
} from '../../theme/images/index';

import { WhiteCard } from '../../theme/Global';

export default function CompanyPerformance() {
  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <>
      <div className="col-8">
        <WhiteCard>
          <div className="row">
            <div className="col-6">
              {' '}
              <p className="black-heading-title mt-0 mb-4">
                {' '}
                Sales Performance
              </p>
            </div>
            <div className="col-6" />
          </div>
          <ul className="new-order-chart">
            <li>
              <div className="chart-name">Traffic</div>
              <div className="number-rate">22,496</div>
              <div className="vs"> vs 22,368</div>
              <div className="perentage-value">
                <img src={ArrowUpIcon} alt="arrow-up" /> 0.51%
              </div>
            </li>
            <li>
              <div className="chart-name">Orders</div>
              <div className="number-rate">268</div>
              <div className="vs"> vs 261</div>
              <div className="perentage-value">
                <img src={ArrowUpIcon} alt="arrow-up" /> 2.51%
              </div>
            </li>
            <li>
              <div className="chart-name">Conversion</div>
              <div className="number-rate">1.22%</div>
              <div className="vs"> vs 1.07%</div>
              <div className="perentage-value down">
                <img className="red-arrow" src={ArrowDownIcon} alt="arrow-up" />
                0.15%
              </div>
            </li>
            <li>
              <div className="chart-name">Avg Order Value</div>
              <div className="number-rate">$82.64</div>
              <div className="vs"> vs $80.90</div>
              <div className="perentage-value">
                <img src={ArrowUpIcon} alt="arrow-up" />
                2.10%
              </div>
            </li>
            <li>
              <div className="chart-name">Revenue</div>
              <div className="number-rate">$22,147.52</div>
              <div className="vs"> vs $21,114.90</div>
              <div className="perentage-value">
                <img src={ArrowUpIcon} alt="arrow-up" />
                4.75%
              </div>
            </li>
          </ul>
        </WhiteCard>
        <WhiteCard>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </WhiteCard>

        <div className="row mt-3">
          <div className="col-4">
            <WhiteCard className="fix-height">
              <p className="black-heading-title mt-0 mb-4">DSP Spend</p>
              <div className="speed-rate">$2,681.13</div>
              <div className="last-update">Last updated: Dec 31 2020</div>
            </WhiteCard>{' '}
          </div>
          <div className="col-4">
            <WhiteCard className="fix-height">
              <p className="black-heading-title mt-0 mb-4">
                Inventory Score (IPI)
              </p>
            </WhiteCard>
          </div>
          <div className="col-4">
            <WhiteCard className="fix-height">
              {' '}
              <p className="black-heading-title mt-0 mb-4">Seller Health</p>
              <div className="seller-health">98%</div>
              <div className="last-update">Positive Feedback</div>
              <div className="seller-health mt-3">0.07%</div>
              <div className="last-update">Order Defect Rate</div>
              <div className="seller-health mt-3">0.01%</div>
              <div className="last-update">Policy Violations</div>
            </WhiteCard>
          </div>
        </div>
      </div>
    </>
  );
}
