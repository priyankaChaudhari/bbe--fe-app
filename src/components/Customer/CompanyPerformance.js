/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Select from 'react-select';
import {
  // CopyLinkIcon,
  // InfoIcons,
  // ExternalLink,

  ArrowUpIcon,
  ArrowDownIcon,
} from '../../theme/images/index';
import { DropDownSelect } from '../../common';
import { WhiteCard } from '../../theme/Global';

export default function CompanyPerformance() {
  const data = [
    {
      name: 'Jan 8',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Jan 9',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Jan 10',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Jan 11',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Jan 12',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Jan 13',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Jan 14',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const pieData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <>
      <div className="col-8">
        <div className="row">
          <div className="col-12 mb-3">
            <DropDownSelect>
              <Select classNamePrefix="react-select" className="active" />
            </DropDownSelect>{' '}
          </div>
        </div>
        <WhiteCard>
          <div className="row">
            <div className="col-6 ">
              {' '}
              <p className="black-heading-title mt-0 mb-4">
                {' '}
                Sales Performance
              </p>
            </div>
            <div className="col-6 text-right mb-4">
              <DropDownSelect className="days-performance">
                <Select classNamePrefix="react-select" className="active" />
              </DropDownSelect>{' '}
            </div>
          </div>
          <ul className="new-order-chart">
            <li>
              <div className="chart-name">Revenue</div>
              <div className="number-rate">22,496</div>
              <div className="vs"> vs 22,368</div>
              <div className="perentage-value">
                <img src={ArrowUpIcon} alt="arrow-up" /> 0.51%
              </div>
            </li>
            <li>
              <div className="chart-name">Units Sold</div>
              <div className="number-rate">268</div>
              <div className="vs"> vs 261</div>
              <div className="perentage-value">
                <img src={ArrowUpIcon} alt="arrow-up" /> 2.51%
              </div>
            </li>
            <li>
              <div className="chart-name">Traffic</div>
              <div className="number-rate">1.22%</div>
              <div className="vs"> vs 1.07%</div>
              <div className="perentage-value down">
                <img className="red-arrow" src={ArrowDownIcon} alt="arrow-up" />
                0.15%
              </div>
            </li>
            <li>
              <div className="chart-name">Conversion</div>
              <div className="number-rate">$82.64</div>
              <div className="vs"> vs $80.90</div>
              <div className="perentage-value">
                <img src={ArrowUpIcon} alt="arrow-up" />
                2.10%
              </div>
            </li>
            {/* <li>
              <div className="chart-name">Revenue</div>
              <div className="number-rate">$22,147.52</div>
              <div className="vs"> vs $21,114.90</div>
              <div className="perentage-value">
                <img src={ArrowUpIcon} alt="arrow-up" />
                4.75%
              </div>
            </li> */}
          </ul>
        </WhiteCard>
        <WhiteCard>
          <div className="days-container">
            <ul className="days-tab">
              <li className=" active">Daily</li>
              <li className="disabled">Weekly</li>
              <li className="disabled">Monthly</li>
            </ul>
          </div>
          <LineChart
            width={700}
            height={300}
            data={data}
            margin={{
              top: 40,
              right: 30,
              left: 20,
              bottom: 5,
            }}>
            <CartesianGrid strokeDasharray="none" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#FF5933"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#BFC5D2" />
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
              <p className="black-heading-title mt-0 mb-4">Positive Feedback</p>
              <div className="seller-health positive">98%</div>
              <div className="seller-update mb-3">Last 30 days</div>
              <div className="seller-health positive ">0.07%</div>
              <div className="seller-update mb-5">Last 12 months</div>
              <div className="last-update ">Last updated: Dec 31 2020</div>
            </WhiteCard>
          </div>
          <div className="col-4">
            <WhiteCard className="fix-height">
              {' '}
              <p className="black-heading-title mt-0 mb-4">Order Issues</p>
              <div className="seller-health">98%</div>
              <div className="seller-update mb-3">Positive Feedback</div>
              <div className="seller-health  ">0.07%</div>
              <div className="seller-update mb-5">Order Defect Rate</div>
              <div className="last-update ">Last updated: Dec 31 2020</div>
              {/* <div className="seller-health mt-3">0.01%</div>
              <div className="last-update">Policy Violations</div> */}
            </WhiteCard>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-4">
            <WhiteCard className="fix-height">
              <p className="black-heading-title mt-0 mb-4">
                Inventory Score (IPI)
              </p>
              <PieChart width={250} height={150}>
                <Pie
                  data={pieData}
                  cx={90}
                  cy={100}
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884D8"
                  paddingAngle={6}
                  dataKey="value">
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
              <div className="last-update ">Last updated: Dec 31 2020</div>
            </WhiteCard>
          </div>
          <div className="col-8">
            <WhiteCard className="fix-height">
              <div className="row">
                <div className="col-6 ">
                  {' '}
                  <p className="black-heading-title mt-0 mb-4"> Buy Box %</p>
                </div>
                <div className="col-6 text-right mb-4">
                  <DropDownSelect className="days-performance">
                    <Select classNamePrefix="react-select" className="active" />
                  </DropDownSelect>{' '}
                </div>
              </div>
              <LineChart
                width={450}
                height={200}
                data={data}
                margin={{
                  top: 30,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}>
                <CartesianGrid strokeDasharray="none" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#FF5933"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="uv" stroke="#BFC5D2" />
              </LineChart>
              <div className="last-update ">Last updated: Dec 31 2020</div>
            </WhiteCard>
          </div>
        </div>
      </div>
    </>
  );
}
