import React from 'react';

import { components } from 'react-select';
import { arrayOf, bool, func, shape } from 'prop-types';
import {
  LineChart,
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
} from 'recharts';

import { DropDown } from '../DropDown';
import {
  dateOptions,
  bbDateOptions,
  noGraphDataMessage,
} from '../../../../constants';
import {
  WhiteCard,
  PageLoader,
  CustomDateModal,
  NoData,
  DropDownIndicator,
} from '../../../../common';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

export default function BuyBoxPercentPanel({
  bBChartData,
  bBGraphLoader,
  handleBBDailyFact,
  isApiCall,
  bBDailyFact,
  dspData,
  showBBCustomDateModal,
  BBstate,
  setShowBBCustomDateModal,
  setBBState,
  applyCustomDate,
  currentDate,
  renderCustomDateSubLabel,
}) {
  const { Option, SingleValue } = components;

  const bbFilterOption = (props) => (
    <Option {...props}>
      <div className="">
        <span style={{ fontSize: '15px', color: '#000000' }}>
          {props.data.label}
        </span>
        {props.data.value === 'custom' ? (
          <div style={{ fontSize: '12px', color: '#556178' }}>
            {props.data.sub}
          </div>
        ) : null}
      </div>
    </Option>
  );

  const bbSingleFilterOption = (props) => (
    <SingleValue {...props}>
      <span style={{ fontSize: '15px', color: '#000000' }}>
        {props.data.label}
      </span>

      <div style={{ fontSize: '12px', color: '#556178' }}>
        {renderCustomDateSubLabel(props, 'bb')}
      </div>
    </SingleValue>
  );

  const getBBSelectComponents = () => {
    return {
      Option: bbFilterOption,
      SingleValue: bbSingleFilterOption,
      DropDownIndicator,
    };
  };

  const BBCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      if (payload.length === 2) {
        return (
          <div className="custom-tooltip">
            <p className="label-1">{payload[0].payload.date}</p>

            <p className="label-2">{payload[1].payload.value}%</p>
          </div>
        );
      }
    }
    return null;
  };

  const CustomizedLabel = (data) => {
    const dataLength = bBChartData.length - 1;
    if (
      data &&
      data.index === dataLength &&
      bBChartData &&
      data.y !== null &&
      !Number.isNaN(data.y)
    ) {
      return (
        <g className="mb-3">
          {bBChartData && bBChartData[0].avg ? (
            <rect
              x={data.x - 25}
              y={data.y - 27}
              fill="#BFC5D2"
              width={50}
              height={28}
            />
          ) : null}

          <text
            className="cust-label-avg"
            x={data.x}
            y={data.y}
            dy={-10}
            fontSize={14}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="black">
            {bBChartData[0].avg}%
          </text>
        </g>
      );
    }
    return null;
  };

  const customTicks = () => {
    if (bBChartData && bBChartData.length) {
      const { avg } = bBChartData[0];
      if (avg === '0.00') {
        return [-1, parseFloat(avg), 1];
      }
      return [0, parseFloat(avg), parseFloat(avg) * 2];
    }
    return [];
  };

  const renderBBgraph = () => {
    return (
      <ResponsiveContainer width="99%" height={200}>
        <LineChart
          // width={300}
          // height={200}
          data={bBChartData}
          margin={{
            top: 30,
            right: 30,
            left: 20,
            bottom: 20,
          }}>
          <XAxis dataKey="date" hide />
          <YAxis tickCount={3} ticks={customTicks()} hide />
          <Tooltip content={<BBCustomTooltip />} />
          <Legend />
          <Line dataKey="avg" dot={false} stroke="#BFC5D2" activeDot={false}>
            <LabelList content={<CustomizedLabel />} />
          </Line>
          <Line
            dataKey="value"
            dot={false}
            stroke="BLACK"
            strokeWidth={2}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderBBPercentGraphPanel = () => {
    return (
      <div className="col-sm-12 mb-3 ">
        <WhiteCard className="fix-height">
          <div className="row">
            <div className="col-6 ">
              {' '}
              <p className="black-heading-title mt-2 mb-4"> Buy Box %</p>
            </div>
            <div className="col-6 text-right mb-1">
              {DropDown(
                'days-performance',
                bbDateOptions,
                dateOptions[0].label,
                getBBSelectComponents,
                bbDateOptions[0],
                handleBBDailyFact,
                isApiCall,
                null,
                bBDailyFact,
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-12 order-md-1 order-2">
              <ul className="rechart-item">
                <li>
                  <div className="weeks">
                    <span className="black block" />
                    <span>Daily %</span>
                  </div>
                </li>
                <li>
                  <div className="weeks">
                    <span className="gray block" />
                    <span>Average</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {bBGraphLoader ? (
            <PageLoader
              component="performance-graph"
              color="#FF5933"
              type="detail"
              width={40}
              height={40}
            />
          ) : bBChartData && bBChartData.length > 1 ? (
            renderBBgraph()
          ) : (
            <NoData>{noGraphDataMessage}</NoData>
          )}
          <br />
          <br />
          <div className="last-update ">
            Last updated: {dspData && dspData.latest_date}
          </div>
        </WhiteCard>
      </div>
    );
  };

  return (
    <>
      <div className="row ">{renderBBPercentGraphPanel()}</div>

      {/* custom date modal for BB% graph */}
      <CustomDateModal
        id="BT-performancereport-daterange-BBdate"
        isOpen={showBBCustomDateModal}
        ranges={BBstate}
        onClick={() => {
          setShowBBCustomDateModal(false);
          setBBState([
            {
              startDate: currentDate,
              endDate: currentDate,
              key: 'BBselection',
            },
          ]);
        }}
        onChange={(item) => {
          setBBState([item.BBselection]);
        }}
        onApply={() => applyCustomDate('BBDate')}
        currentDate={currentDate}
      />
    </>
  );
}

BuyBoxPercentPanel.defaultProps = {
  isApiCall: false,
  bBGraphLoader: false,
  showBBCustomDateModal: false,
  bBChartData: [],
  currentDate: '',
  bBDailyFact: {},
  dspData: {},
  BBstate: [{}],
  data: {},
  active: {},
  payload: {},
  setShowBBCustomDateModal: () => {},
  setBBState: () => {},
  applyCustomDate: () => {},
  handleBBDailyFact: () => {},
  getBBSelectComponents: () => {},
  renderCustomDateSubLabel: () => {},
};

BuyBoxPercentPanel.propTypes = {
  bBGraphLoader: bool,
  isApiCall: bool,
  showBBCustomDateModal: bool,
  bBDailyFact: shape({}),
  dspData: shape({}),
  data: shape({}),
  active: shape({}),
  payload: shape({}),
  currentDate: shape({}),
  bBChartData: arrayOf(shape({})),
  BBstate: arrayOf(shape({})),
  setBBState: func,
  applyCustomDate: func,
  handleBBDailyFact: func,
  getBBSelectComponents: func,
  setShowBBCustomDateModal: func,
  renderCustomDateSubLabel: func,
};
