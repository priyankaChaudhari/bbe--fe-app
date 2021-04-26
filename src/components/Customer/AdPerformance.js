/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import styled from 'styled-components';
// import Theme from '../../theme/Theme';
import Select from 'react-select';
import { DropDownSelect } from '../../common';
import { WhiteCard } from '../../theme/Global';
import { ArrowDownIcon } from '../../theme/images/index';

export default function AdPerformance() {
  return (
    <AddPerformance>
      <div className="row">
        <div className="col-12 mb-3">
          <DropDownSelect className="cursor">
            <Select classNamePrefix="react-select" className="active" />
          </DropDownSelect>
        </div>
      </div>
      <WhiteCard>
        <div className="row">
          <div className="col-md-3  col-sm1-12">
            {' '}
            <p className="black-heading-title mt-0 mb-4"> Sales Performance</p>
          </div>
          <div className="col-md-9 col-sm1-12  mb-3 pr-0">
            <ul className="ad-performance-nav">
              <li className="ad-performance">
                {' '}
                <DropDownSelect>
                  <Select classNamePrefix="react-select" className="active" />
                </DropDownSelect>
              </li>
              <li className="day-performance">
                {' '}
                <DropDownSelect className="days-performance">
                  <Select classNamePrefix="react-select" className="active" />
                </DropDownSelect>
              </li>
            </ul>{' '}
          </div>
        </div>

        <div className="row mr-1 ml-1">
          <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
            <div className="order-chart-box ad-sales-active fix-height">
              <div className="chart-name">Ad Sales </div>
              <div className="number-rate">$15,050.28</div>
              <div className="vs">vs $11,114.90</div>
              <div className="perentage-value down mt-3">
                <img
                  className="red-arrow"
                  src={ArrowDownIcon}
                  alt="arrow-down"
                />
                40.75%
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
            <div className="order-chart-box ad-spend-active fix-height">
              <div className="chart-name">Ad Spend </div>
              <div className="number-rate">$15,050.28</div>
              <div className="vs">vs $11,114.90</div>
              <div className="perentage-value down mt-3">
                <img
                  className="red-arrow"
                  src={ArrowDownIcon}
                  alt="arrow-down"
                />
                40.75%
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
            <div className="order-chart-box ad-conversion-active fix-height">
              <div className="chart-name">Ad Conversion Rate</div>
              <div className="number-rate">$15,050.28</div>
              <div className="vs">vs $11,114.90</div>
              <div className="perentage-value down mt-3">
                <img
                  className="red-arrow"
                  src={ArrowDownIcon}
                  alt="arrow-down"
                />
                40.75%
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
            <div className="order-chart-box impression-active fix-height">
              <div className="chart-name">Impressions </div>
              <div className="number-rate">$15,050.28</div>
              <div className="vs">vs $11,114.90</div>
              <div className="perentage-value down mt-3">
                <img
                  className="red-arrow"
                  src={ArrowDownIcon}
                  alt="arrow-down"
                />
                40.75%
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
            <div className="order-chart-box  fix-height">
              <div className="chart-name">Ad Cos</div>
              <div className="number-rate">$15,050.28</div>
              <div className="vs">vs $11,114.90</div>
              <div className="perentage-value down mt-3">
                <img
                  className="red-arrow"
                  src={ArrowDownIcon}
                  alt="arrow-down"
                />
                40.75%
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
            <div className="order-chart-box  fix-height">
              <div className="chart-name">RoAS </div>
              <div className="number-rate">$15,050.28</div>
              <div className="vs">vs $11,114.90</div>
              <div className="perentage-value down mt-3">
                <img
                  className="red-arrow"
                  src={ArrowDownIcon}
                  alt="arrow-down"
                />
                40.75%
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
            <div className="order-chart-box  fix-height">
              <div className="chart-name">Clicks </div>
              <div className="number-rate">$15,050.28</div>
              <div className="vs">vs $11,114.90</div>
              <div className="perentage-value down mt-3">
                <img
                  className="red-arrow"
                  src={ArrowDownIcon}
                  alt="arrow-down"
                />
                40.75%
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 pr-1 pl-0 col-6 mb-3">
            <div className="order-chart-box  fix-height">
              <div className="chart-name">Click through rate </div>
              <div className="number-rate">$15,050.28</div>
              <div className="vs">vs $11,114.90</div>
              <div className="perentage-value down mt-3">
                <img
                  className="red-arrow"
                  src={ArrowDownIcon}
                  alt="arrow-down"
                />
                40.75%
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mt-4">
            {' '}
            <div className="days-container ">
              <ul className="days-tab">
                <li>
                  {' '}
                  <input
                    className="d-none"
                    type="radio"
                    id="daysCheck"
                    name="flexRadioDefault"
                  />
                  <label htmlFor="daysCheck">Daily</label>
                </li>

                <li>
                  <input
                    className="d-none"
                    type="radio"
                    id="weeklyCheck"
                    name="flexRadioDefault"
                  />
                  <label htmlFor="weeklyCheck">Weekly</label>
                </li>

                <li>
                  <input
                    className=" d-none"
                    type="radio"
                    id="monthlyCheck"
                    name="flexRadioDefault"
                  />
                  <label htmlFor="monthlyCheck">Monthly</label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </WhiteCard>
    </AddPerformance>
  );
}

const AddPerformance = styled.div`
  .ad-performance-nav {
    list-style-type: none;
    padding: 0;
    margin: 0;
    text-align: right;

    li {
      display: inline-block;
      margin-right: 10px;

      &:last-child {
        margin-right: 23px;
      }
      &.ad-performance {
        max-width: 220px;
        width: 100%;
        vertical-align: top;
      }
      &.day-performance {
        max-width: 259px;
        width: 100%;
      }
    }
  }
`;
