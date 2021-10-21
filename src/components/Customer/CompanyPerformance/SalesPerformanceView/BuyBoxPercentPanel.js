import React from 'react';

import { components } from 'react-select';
import { arrayOf, bool, func, shape } from 'prop-types';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import BbPercentChart from './BbPercentChart';
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

  const renderBBPercentGraphPanel = () => {
    return (
      <div className="col-sm-12 mb-3 ">
        <WhiteCard className="fix-height">
          <div className="row">
            <div className="col-6 ">
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
            <BbPercentChart chartId="BbPercentchart" chartData={bBChartData} />
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
