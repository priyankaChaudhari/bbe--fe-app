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
  ClockIcon,
} from '../../theme/images/index';
import Button from '../../common/Button';
import { GroupUser, WhiteCard } from '../../theme/Global';

export default function CustomerDetails() {
  return (
    <>
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
                    <div className=" edit-details edit-brand-details">
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
              <Tab>
                <ul className="tabs">
                  <li className="active">Active Agreements</li>
                  <li className="">Past Agreements</li>
                </ul>
              </Tab>
              <WhiteCard className="mt-3">
                <div className="row">
                  <div className="col-8">
                    <p className="black-heading-title mt-0 mb-0">
                      {' '}
                      Recurring Contract
                    </p>
                    <ul className="recurring-contact">
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
                  <div className="col-4 text-right">
                    <Button className="btn-transparent ">
                      {' '}
                      <img
                        className="file-contract-icon"
                        src={FileContract}
                        alt=""
                      />
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
                  <div className="col-8">
                    <p className="black-heading-title mt-0 mb-0">
                      {' '}
                      One Time Services Contract
                    </p>
                  </div>
                  <div className="col-4 text-right">
                    <Button className="btn-transparent ">
                      {' '}
                      <img
                        className="file-contract-icon"
                        src={FileContract}
                        alt=""
                      />
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
              </WhiteCard>
            </div>
          </div>
        </CustomerBody>
      </CustomerDetailBanner>
    </>
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
        padding-bottom: 15px;
        border-bottom: 2px solid ${Theme.orange};
        color: ${Theme.black};
        font-family: ${Theme.titleFontFamily};
      }
    }
  }
`;
