import React from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { arrayOf, bool, func, instanceOf, string } from 'prop-types';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { ArrowRightBlackIcon } from '../../../../theme/images/index';
import { PageLoader, WhiteCard, ToggleButton } from '../../../../common';
import DSPPerformanceChart from './DSPPerformanceChart';
import DSPMetrics from '../../../BrandPartner/AdManagerAdminDashboard/DSPDashboard/DSPMetrics';

const _ = require('lodash');

export default function DSPPerformance({
  dspData,
  setShowDspAdPacingModal,
  selectedDspBox,
  dspFilters,
  handleDSPGroupBy,
  dspGroupBy,
  selectedAdDF,
  currencySymbol,
  dspCurrentTotal,
  dspDifference,
  dspPreviousTotal,
  setBoxToggle,
  setBoxClasses,
  dspGraphLoader,
  dspChartData,
  noGraphDataMessage,
}) {
  const displayDspPacingLabel = () => {
    if (
      dspData &&
      dspData.dsp_pacing &&
      dspData.dsp_pacing.dsp_pacing_flag === '1'
    ) {
      return (
        <span>
          Overspending
          <img
            className="right-arrow-icon"
            width="18px"
            src={ArrowRightBlackIcon}
            alt="arrow"
          />
        </span>
      );
    }
    if (
      dspData &&
      dspData.dsp_pacing &&
      dspData.dsp_pacing.dsp_pacing_flag === '0'
    ) {
      return (
        <span className="green">
          On Track
          <img
            className="right-arrow-icon "
            width="18px"
            src={ArrowRightBlackIcon}
            alt="arrow"
          />
        </span>
      );
    }
    if (
      dspData &&
      dspData.dsp_pacing &&
      dspData.dsp_pacing.dsp_pacing_flag === '-1'
    ) {
      return (
        <span>
          Underspending
          <img
            className="right-arrow-icon"
            width="18px"
            src={ArrowRightBlackIcon}
            alt="arrow"
          />
        </span>
      );
    }
    return '';
  };

  const displayMonth = () => {
    const currentDateOfMonth = new Date().getDate();
    if (currentDateOfMonth === 1 || currentDateOfMonth === 2) {
      const todayDate = new Date();
      todayDate.setMonth(todayDate.getMonth() - 1, 1);
      return dayjs(new Date(todayDate)).format('MMMM');
    }
    return dayjs(new Date()).format('MMMM');
  };

  const renderDSPGroupBy = () => {
    return (
      <>
        <div className="row mt-4 mb-3">
          {_.size(selectedDspBox) <= 2 ? (
            <div className="col-md-6 col-sm-12 order-md-1 order-2 mt-2">
              <ul className="rechart-item">
                <li>
                  <div className="weeks">
                    <span
                      className={
                        _.size(selectedDspBox) === 1
                          ? `${_.keys(selectedDspBox)[0]} circle`
                          : 'darkGray circle'
                      }
                    />

                    <span>Recent</span>
                  </div>
                </li>
                {selectedAdDF.value !== 'custom' ? (
                  <li>
                    <div className="weeks">
                      <ul className="dashed-line">
                        <li
                          className={
                            _.size(selectedDspBox) === 1
                              ? `${_.keys(selectedDspBox)[0]} block`
                              : 'darkGray block'
                          }
                        />
                        <li
                          className={
                            _.size(selectedDspBox) === 1
                              ? `${_.keys(selectedDspBox)[0]} block`
                              : 'darkGray block'
                          }
                        />
                      </ul>
                      <span>Previous</span>
                    </div>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : (
            <div className="col-md-6 col-sm-12 order-md-1 order-2 mt-2" />
          )}

          <div className="col-md-6 col-sm-12 order-md-2 order-1">
            <ToggleButton>
              <div className="days-container ">
                <ul className="days-tab">
                  <li
                    className={
                      dspFilters.daily === false ? 'disabled-tab' : ''
                    }>
                    {' '}
                    <input
                      className="d-none"
                      type="radio"
                      id="daysCheck"
                      name="flexRadioDefault1"
                      value={dspGroupBy}
                      checked={dspFilters.daily}
                      onClick={() => handleDSPGroupBy('daily')}
                      onChange={() => {}}
                    />
                    <label htmlFor="daysCheck">Daily</label>
                  </li>

                  <li
                    className={
                      dspFilters.weekly === false ? 'disabled-tab' : ''
                    }>
                    <input
                      className="d-none"
                      type="radio"
                      id="weeklyCheck"
                      name="flexRadioDefault1"
                      value={dspGroupBy}
                      checked={dspFilters.weekly && dspGroupBy === 'weekly'}
                      onChange={() => handleDSPGroupBy('weekly')}
                    />
                    <label htmlFor="weeklyCheck">Weekly</label>
                  </li>

                  <li
                    className={
                      dspFilters.month === false ? 'disabled-tab' : ''
                    }>
                    <input
                      className=" d-none"
                      type="radio"
                      id="monthlyCheck"
                      name="flexRadioDefault1"
                      value={dspGroupBy}
                      checked={dspFilters.month}
                      onChange={() => handleDSPGroupBy('monthly')}
                    />
                    <label htmlFor="monthlyCheck">Monthly</label>
                  </li>
                </ul>
              </div>
            </ToggleButton>
          </div>
        </div>
      </>
    );
  };

  return (
    <WhiteCard className="mt-3 mb-3">
      <div className="row">
        <div className="col-12">
          {' '}
          <p className="black-heading-title mt-3 mb-0"> DSP Ad Performance</p>
          <p className="gray-normal-text mb-4 mt-1">
            {dspData && dspData.dsp_pacing
              ? `Monthly Budget Pacing ( ${displayMonth()} )`
              : ''}{' '}
            <span
              className="orange-text"
              role="presentation"
              onClick={() => setShowDspAdPacingModal({ show: true })}>
              {displayDspPacingLabel()}
            </span>
          </p>
        </div>
      </div>
      <div className="row mr-1 ml-1">
        <DSPMetrics
          currencySymbol={currencySymbol}
          dspCurrentTotal={dspCurrentTotal}
          dspDifference={dspDifference}
          dspPreviousTotal={dspPreviousTotal}
          setBoxToggle={setBoxToggle}
          setBoxClasses={setBoxClasses}
        />
      </div>
      {renderDSPGroupBy()}
      {dspGraphLoader ? (
        <PageLoader
          component="performance-graph"
          color="#FF5933"
          type="detail"
          width={40}
          height={40}
        />
      ) : dspChartData.length >= 1 ? (
        <DSPPerformanceChart
          chartId="dspChart"
          chartData={dspChartData}
          currencySymbol={currencySymbol}
          selectedBox={selectedDspBox}
          selectedDF={selectedAdDF.value}
        />
      ) : (
        <NoData>{noGraphDataMessage}</NoData>
      )}
    </WhiteCard>
  );
}

DSPPerformance.defaultProps = {
  dspData: {},
  setShowDspAdPacingModal: () => {},
  selectedDspBox: {},
  dspFilters: {},
  handleDSPGroupBy: () => {},
  dspGroupBy: '',
  selectedAdDF: {},
  currencySymbol: {},
  dspCurrentTotal: {},
  dspDifference: {},
  dspPreviousTotal: {},
  setBoxToggle: () => {},
  setBoxClasses: () => {},
  dspGraphLoader: {},
  dspChartData: {},
  noGraphDataMessage: {},
};

DSPPerformance.propTypes = {
  dspData: instanceOf(Object),
  setShowDspAdPacingModal: func,
  selectedDspBox: instanceOf(Object),
  dspFilters: instanceOf(Object),
  handleDSPGroupBy: func,
  dspGroupBy: string,
  selectedAdDF: instanceOf(Object),
  currencySymbol: string,
  dspCurrentTotal: instanceOf(Object),
  dspDifference: instanceOf(Object),
  dspPreviousTotal: instanceOf(Object),
  setBoxToggle: func,
  setBoxClasses: func,
  dspGraphLoader: bool,
  dspChartData: arrayOf(Array),
  noGraphDataMessage: string,
};

const NoData = styled.div`
  margin: 3em;
  text-align: center;
`;
