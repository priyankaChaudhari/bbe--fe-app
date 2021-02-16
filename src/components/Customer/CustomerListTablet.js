import React from 'react';
import styled from 'styled-components';
import Theme from '../../theme/Theme';
import { WhiteCard } from '../../theme/Global';
import {
  DefaultUser,
  ClockIcon,
  RecurringIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from '../../theme/images/index';

export default function CustomerListTablet() {
  return (
    <CustomerListTabletView>
      <div className="row">
        <div className="col-md-6 col-12">
          <WhiteCard className="mt-2">
            <img className="company-logo" src={DefaultUser} alt="logo" />

            <div className="company-name">Viking Farmer</div>
            <div className="status">Active</div>
            <div className="clear-fix" />
            <div className="straight-line horizontal-line pt-3 mb-3" />
            <p className="black-heading-title mt-0 mb-0">
              <img className="solid-icon " src={RecurringIcon} alt="" />
              Recurring Contract
            </p>
            <ul className="recurring-contact mb-2">
              <li>
                <p className="basic-text ">12 month contract</p>
              </li>
              <li>
                <p className="basic-text "> Expires: Mar 20, 2021</p>
              </li>
              <li>
                <div className="days-block">
                  {' '}
                  <img className="clock-icon" src={ClockIcon} alt="clock" /> 96
                  days
                </div>
              </li>
            </ul>
            <div className="straight-line horizontal-line pt-3 mb-3" />
            <div className="row">
              <div className="col-6">
                {' '}
                <div className="label">Monthly Retainer</div>
                <div className="label-info">
                  $3,000{' '}
                  <span className="increase-rate ml-1">
                    <img width="14px" src={ArrowUpIcon} alt="arrow-up" /> 0.51%
                  </span>
                </div>
              </div>
              <div className="col-6">
                <div className="label">Rev Share %</div>
                <div className="label-info ">
                  3%
                  <sapn className="decrease-rate ml-1">
                    {' '}
                    <img
                      className="red-arrow"
                      src={ArrowDownIcon}
                      alt="arrow-up"
                    />
                    0.15%
                  </sapn>
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="label">Brand Strategist</div>
                <div className="label-info">Wilhelm Dowall</div>
              </div>
            </div>
          </WhiteCard>
        </div>
        <div className="col-md-6 col-12">
          <WhiteCard className="mt-2">
            <img className="company-logo" src={DefaultUser} alt="logo" />

            <div className="company-name">Viking Farmer</div>
            <div className="status">Active</div>
            <div className="clear-fix" />
            <div className="straight-line horizontal-line pt-3 mb-3" />
            <p className="black-heading-title mt-0 mb-0">
              <img className="solid-icon " src={RecurringIcon} alt="" />
              Recurring Contract
            </p>
            <ul className="recurring-contact mb-2">
              <li>
                <p className="basic-text ">12 month contract</p>
              </li>
              <li>
                <p className="basic-text "> Expires: Mar 20, 2021</p>
              </li>
              <li>
                <div className="days-block">
                  {' '}
                  <img className="clock-icon" src={ClockIcon} alt="clock" /> 96
                  days
                </div>
              </li>
            </ul>
            <div className="straight-line horizontal-line pt-3 mb-3" />
            <div className="row">
              <div className="col-6">
                {' '}
                <div className="label">Monthly Retainer</div>
                <div className="label-info">$3,000</div>
              </div>
              <div className="col-6">
                <div className="label">Rev Share %</div>
                <div className="label-info">3%</div>
              </div>
              <div className="col-12 mt-3">
                <div className="label">Brand Strategist</div>
                <div className="label-info">Wilhelm Dowall</div>
              </div>
            </div>
          </WhiteCard>
        </div>
      </div>
    </CustomerListTabletView>
  );
}

const CustomerListTabletView = styled.div`
  background: ${Theme.gray6};
  height: 100%;
  padding-top: 130px;

  .black-heading-title {
    font-size: 14px;
  }
  .solid-icon {
    width: 36px;
    margin-right: 15px;
  }
  .recurring-contact {
    li {
      margin-right: 5px;
    }
  }
  .company-logo {
    border-radius: 10px;
    width: 45px;
    height: 45px;
    margin-right: 14px;
    float: left;
  }
  .company-name {
    vertical-align: middle;
    position: relative;
    color: ${Theme.black};
    font-size: 18px;
    font-weight: 600;
  }

  .status {
    color: #171725;
    font-size: 14px;
  }
  .label-info {
    font-weight: 600;
  }
  .increase-rate {
    color: #407b00;
    font-size: 14px;
    font-weight: 300;
    img {
      vertical-align: bottom;
    }
  }
  .decrease-rate {
    color: ${Theme.darkRed};
    font-size: ${Theme.extraNormal};
    font-weight: 300;
    .red-arrow {
      width: 14px;
      transform: rotate(180deg);
      vertical-align: middle;
    }
  }
  @media (max-width: 991px) {
    padding-top: 180px;
  }
`;
