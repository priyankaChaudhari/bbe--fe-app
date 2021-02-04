import React from 'react';

import styled from 'styled-components';

import Theme from '../../theme/Theme';
import { Button } from '../../common';
import { WhiteCard } from '../../theme/Global';
import {
  ClockIcon,
  FileContract,
  RecurringIcon,
  ServiceIcon,
} from '../../theme/images';

export default function AgreementDetails() {
  return (
    <>
      <div className="col-lg-8 col-12">
        <Tab>
          <ul className="tabs">
            <li className="active">Active Agreements</li>
            <li className="">Past Agreements</li>
          </ul>
        </Tab>
        <WhiteCard className="mt-3">
          <div className="row">
            <div className="col-lg-9 col-md-8 col-12">
              <p className="black-heading-title mt-0 mb-0">
                <img className="solid-icon " src={RecurringIcon} alt="" />
                Recurring Contract
              </p>

              <ul className="recurring-contact mb-2">
                <li>
                  <p className="basic-text ">12 month contract</p>
                </li>
                <li>
                  <p className="basic-text ">Expires: Mar 20, 2021</p>
                </li>
                <li>
                  <div className="days-block">
                    {' '}
                    <img
                      className="clock-icon"
                      src={ClockIcon}
                      alt="clock"
                    />{' '}
                    96 days
                  </div>
                </li>
              </ul>
            </div>
            <div className="clear-fix" />
            <div className="col-lg-3 col-md-4 col-12 text-right">
              <Button className="btn-transparent w-100 ">
                {' '}
                <img className="file-contract-icon" src={FileContract} alt="" />
                View Contract
              </Button>
            </div>
          </div>
          <div className="straight-line horizontal-line pt-3 mb-3" />

          <ul className="monthly-retainer">
            <li>
              <div className="label">Monthly Retainer</div>
              $3,000
            </li>
            <li>
              <div className="label">Rev Share %</div>
              3%
            </li>
            <li>
              <div className="label">Sales Threshold</div>
              $100,000
            </li>
            <li>
              <div className="label">Billing CAP</div>
              $9,000
            </li>
          </ul>
          <div className="straight-line horizontal-line pt-3 mb-3" />

          <div className="label">Marketplaces</div>
          <ul className="selected-list">
            <li>Amazon.com (Primary)</li>
            <li>Amazon.ca</li>
            <li>Amazon.co.uk</li>
          </ul>
          <div className="label mt-3">Additional Monthly Services</div>
          <ul className="selected-list">
            <li>Additional Marketplaces (2)</li>
            <li>Customer Support</li>
            <li>DSP Advertising ($2,000p/m)</li>
            <li>DSP Advertising ($2,000p/m)</li>
            <li>Inventory Reconciliation</li>
            <li>Logistics Management</li>
          </ul>
          <div className="straight-line horizontal-line pt-3 mb-3" />
          <div className="label">One Time Services</div>
          <ul className="selected-list">
            <li>A+ Content (7)</li>
            <li>Infographics (2)</li>
            <li>Listing Copy (12)</li>
          </ul>
        </WhiteCard>
        <WhiteCard className="mt-3">
          <div className="row">
            <div className="col-lg-9 col-md-8 col-12">
              <p className="black-heading-title mt-0 mb-0">
                <img className="service-icon mb-2" src={ServiceIcon} alt="" />
                One Time Services Contract
              </p>
            </div>
            <div className="col-lg-3 col-md-4 col-12 text-right">
              <Button className="btn-transparent w-100  ">
                {' '}
                <img className="file-contract-icon" src={FileContract} alt="" />
                View Contract
              </Button>
            </div>
          </div>
          <div className="straight-line horizontal-line pt-3 mb-3" />
          <div className="label">One Time Services</div>

          <ul className="selected-list">
            <li>A+ Content (7)</li>
            <li>Infographics (2)</li>
            <li>Listing Copy (12)</li>
          </ul>
          <div className="clear-fix" />
        </WhiteCard>
      </div>
    </>
  );
}

const Tab = styled.div`
  .tabs {
    list-style-type: none;
    position: relative;
    text-align: left;
    margin: 0;
    padding: 0;
    border-bottom: 1px solid ${Theme.gray11};

    li {
      display: inline-block;
      margin-right: 60px;
      padding-bottom: 15px;
      font-weight: normal;
      color: ${Theme.black};
      font-size: ${Theme.extraMedium};
      font-family: ${Theme.baseFontFamily};
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      &.a {
        text-decoration: none;
      }

      &.active {
        padding-bottom: 16px;
        border-bottom: 2px solid ${Theme.orange};
        color: ${Theme.black};
        font-family: ${Theme.titleFontFamily};
      }
    }
  }
`;
