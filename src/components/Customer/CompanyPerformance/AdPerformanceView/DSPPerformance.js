import React from 'react';

import dayjs from 'dayjs';
import styled from 'styled-components';
import { arrayOf, bool, func, instanceOf, string } from 'prop-types';

import DSPPerformanceChart from './DSPPerformanceChart';
import DSPMetrics from '../../../BrandPartner/AdManagerAdminDashboard/DSPDashboard/DSPMetrics';
import { ArrowRightBlackIcon, LeftArrowIcon } from '../../../../theme/images';
import {
  PageLoader,
  WhiteCard,
  ToggleButton,
  AllocateBar,
} from '../../../../common';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

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
  dspPacingChartData,
  noGraphDataMessage,
  performancePacingFlag,
  handlePeformancePacing,
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

  const renderDspAdHeaderSection = () => {
    return (
      <>
        <div className="row">
          <div className="col-md-6  col-sm1-12 pr-0">
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
          <div className="col-md-6 col-sm1-12  mb-3 pl-0">
            <ToggleButton>
              <div className="days-container ">
                <ul className="days-tab">
                  <li id="BT-performance-toggle">
                    <input
                      className="d-none"
                      type="radio"
                      id="peformanceCheck"
                      name="performanceRadioDefault"
                      value={performancePacingFlag}
                      checked={performancePacingFlag === 'performance'}
                      onClick={() => handlePeformancePacing('performance')}
                      onChange={() => {}}
                    />
                    <label htmlFor="peformanceCheck">Performance</label>
                  </li>

                  <li id="BT-pacing-toggle">
                    <input
                      className="d-none"
                      type="radio"
                      id="pacingCheck"
                      name="pacingRadioDefault"
                      value={performancePacingFlag}
                      checked={performancePacingFlag === 'pacing'}
                      onClick={() => handlePeformancePacing('pacing')}
                      onChange={() => {}}
                    />
                    <label htmlFor="pacingCheck">Pacing</label>
                  </li>
                </ul>
              </div>
            </ToggleButton>
          </div>
        </div>
        <AllocateBar className="mb-4">
          {' '}
          <div className="remaing-label">
            {`Remaining Budget (${displayMonth()}):`}
            <span> $18,000</span>
          </div>{' '}
          <div
            className="allocate-balance cursor"
            role="presentation"
            onClick={() => setShowDspAdPacingModal({ show: true })}>
            Allocate Balance{' '}
            <img className="orange-left-arrow" src={LeftArrowIcon} alt="" />
          </div>
          <div className="clear-fix" />
        </AllocateBar>
      </>
    );
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
                    id="BT-dspperformance-days"
                    className={
                      dspFilters.daily === false ? 'disabled-tab' : ''
                    }>
                    {' '}
                    <input
                      className="d-none"
                      type="radio"
                      id="dspDaysCheck"
                      name="flexRadioDefault1"
                      value={dspGroupBy}
                      checked={dspFilters.daily && dspGroupBy === 'daily'}
                      onClick={() => handleDSPGroupBy('daily')}
                      onChange={() => {}}
                    />
                    <label htmlFor="dspDaysCheck">Daily</label>
                  </li>

                  <li
                    id="BT-dspperformance-weekly"
                    className={
                      dspFilters.weekly === false ? 'disabled-tab' : ''
                    }>
                    <input
                      className="d-none"
                      type="radio"
                      id="dspWeeklyCheck"
                      name="flexRadioDefault1"
                      value={dspGroupBy}
                      checked={dspFilters.weekly && dspGroupBy === 'weekly'}
                      onChange={() => handleDSPGroupBy('weekly')}
                    />
                    <label htmlFor="dspWeeklyCheck">Weekly</label>
                  </li>

                  <li
                    id="BT-dspperformance-monthly"
                    className={
                      dspFilters.month === false ? 'disabled-tab' : ''
                    }>
                    <input
                      className=" d-none"
                      type="radio"
                      id="dspMonthlyCheck"
                      name="flexRadioDefault1"
                      value={dspGroupBy}
                      checked={dspFilters.month && dspGroupBy === 'monthly'}
                      onChange={() => handleDSPGroupBy('monthly')}
                    />
                    <label htmlFor="dspMonthlyCheck">Monthly</label>
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
      {renderDspAdHeaderSection()}

      {performancePacingFlag === 'performance' ? (
        <>
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
        </>
      ) : (
        <>
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
              chartData={dspPacingChartData}
              currencySymbol={currencySymbol}
            />
          ) : (
            <NoData>{noGraphDataMessage}</NoData>
          )}
        </>
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
  dspPacingChartData: {},
  noGraphDataMessage: {},
  performancePacingFlag: 'performance',
  handlePeformancePacing: () => {},
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
  dspPacingChartData: arrayOf(Array),
  noGraphDataMessage: string,
  performancePacingFlag: string,
  handlePeformancePacing: () => {},
};

const NoData = styled.div`
  margin: 3em;
  text-align: center;
`;
