import React from 'react';
import styled from 'styled-components';
import Theme from '../../theme/Theme';
import {
  BannerImg,
  EditOrangeIcon,
  FileContract,
  Organization,
  ExchangeIcon,
  AddIcons,
  DefaultUser,
  // CopyLinkIcon,
  // InfoIcons,
  // ExternalLink,
  HeartMonitorIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '../../theme/images/index';

import { WhiteCard, GroupUser } from '../../theme/Global';

export default function CustomerActivity() {
  return (
    <div>
      <CustomerDetailBanner>
        <div className="banner">
          <img src={BannerImg} alt="" />
        </div>

        <CustomerBody>
          <div className="row">
            <div className="col-12">
              <WhiteCard className="customer-brand-details">
                <div className="row">
                  <div className="col-3">
                    <div className="brand-logo" />
                  </div>
                  <div className="col-9">
                    <div className="brand-name">
                      TRX Training
                      <span>Active</span>
                    </div>
                    <div className="edit-details edit-brand-details">
                      <img src={EditOrangeIcon} alt="" />
                      Edit
                    </div>

                    <ul className="brand-details">
                      <li className="label-info">
                        1660 Pacific Ave, San Francisco, <br />
                        CA, United States
                      </li>
                      <li className="label-info">
                        <div className="brand-label">
                          Category
                          <span>Health_Wellness_And_Fitness</span>
                        </div>
                        <div className="brand-label">
                          Website
                          <span>
                            {' '}
                            <a href="*">trxtraining.com</a>
                          </span>
                        </div>
                      </li>
                      <li className="label-info">
                        <div className="brand-label">
                          Annual Revenue
                          <span>$50,000,000</span>
                        </div>
                        <div className="brand-label">
                          Company Size
                          <span> 200</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </WhiteCard>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <WhiteCard className="left-border">
                <ul className="left-details-card">
                  <li>
                    <div className="left-details">
                      <img
                        className="file-contract"
                        src={HeartMonitorIcon}
                        alt="monitor"
                      />
                      Performance
                    </div>
                  </li>
                  <li>
                    <div className="left-details">
                      <img
                        className="file-contract"
                        src={FileContract}
                        alt=""
                      />
                      Agreements
                    </div>
                  </li>
                  <li>
                    <div className="left-details">
                      <img src={Organization} alt="" />
                      Company Details
                    </div>
                  </li>
                  <li>
                    <div className="left-details">
                      <img src={ExchangeIcon} alt="" />
                      Agreements
                    </div>
                  </li>
                </ul>
              </WhiteCard>
              <WhiteCard className="mt-3">
                <p className="black-heading-title mt-0 mb-4">
                  {' '}
                  Team Members (4)
                </p>
                <div className="add-new-tab ">
                  <img className="mr-1" src={AddIcons} alt="" />
                  Add new
                </div>
                <div className="add-more-people ">
                  <img src={DefaultUser} alt="" />
                  <img src={DefaultUser} alt="" />
                  <img src={DefaultUser} alt="" />
                </div>
              </WhiteCard>
              <WhiteCard className="mt-3">
                <p className="black-heading-title mt-0 mb-4">
                  {' '}
                  Recent Activity
                </p>
                <GroupUser>
                  <img
                    className="default-user-activity"
                    src={DefaultUser}
                    alt=""
                  />
                  <div className="activity-user mb-4">
                    System User created new record by company name TRX Training
                    <div className="time-date mt-1">
                      01/14/2021, 5:13:42 PM MST
                    </div>
                  </div>
                  <div className="clear-fix" />
                </GroupUser>
                <GroupUser>
                  <img
                    className="default-user-activity"
                    src={DefaultUser}
                    alt=""
                  />
                  <div className="activity-user">
                    System User created new record by company name TRX Training
                    <div className="time-date mt-1">
                      01/14/2021, 5:13:42 PM MST
                    </div>
                  </div>
                  <div className="clear-fix" />
                </GroupUser>
              </WhiteCard>
            </div>
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
                      <img
                        className="red-arrow"
                        src={ArrowDownIcon}
                        alt="arrow-up"
                      />
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
                    <p className="black-heading-title mt-0 mb-4">
                      Seller Health
                    </p>
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
          </div>
        </CustomerBody>
      </CustomerDetailBanner>
    </div>
  );
}

const CustomerDetailBanner = styled.div`
  background: ${Theme.gray6};
  // height: 100%;
  // padding-left: 62px;
  .banner {
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 1) 100%
    );
    max-height: 307px;
    padding-left: 62px;
    img {
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      width: 100%;
      opacity: 0.8;
    }
  }
`;

const CustomerBody = styled.div`
  max-width: 1220px;
  margin: 0 auto;
  width: 100%;

  .customer-body-container {
    max-width: 1220px;
    margin: 0 auto;
    width: 100%;
  }
`;
