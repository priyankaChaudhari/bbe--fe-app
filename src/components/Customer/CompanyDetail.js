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
  CopyLinkIcon,
  InfoIcons,
  ExternalLink,
} from '../../theme/images/index';

import { WhiteCard, GroupUser } from '../../theme/Global';

export default function CompanyDetail() {
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
                            <a href="*"> trxtraining.com</a>
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
              <WhiteCard>
                <div className="row">
                  <div className="col-10">
                    <p className="black-heading-title mt-0">
                      Company Description
                    </p>
                    <p className="normal-text">
                      The TRX System, also known as Total Resistance exercises,
                      refers to a specialized form of suspension training that
                      utilizes equipment developed by former US Navy SEAL Randy
                      Hetrick.
                    </p>
                  </div>
                </div>
                <div className=" edit-details">
                  <img src={EditOrangeIcon} alt="" />
                  Edit
                </div>
              </WhiteCard>

              <div className="row mt-3">
                <div className="col-6">
                  <WhiteCard>
                    <p className="black-heading-title mt-0">Brands</p>
                    <p className="no-result-found"> No brands added</p>
                    <div className="edit-details">
                      <img src={EditOrangeIcon} alt="" />
                      Edit
                    </div>
                  </WhiteCard>

                  <WhiteCard className="mt-3">
                    <p className="black-heading-title mt-0">Contact Info</p>
                    <div className="edit-details">
                      <img src={EditOrangeIcon} alt="" />
                      Edit
                    </div>

                    <div className="label">Phone Number</div>
                    <div className="label-info">+1 415 236 6068</div>

                    <div className="label mt-3">Social Accounts</div>
                    <div className="label-info">+1 415 236 6068</div>
                  </WhiteCard>
                  <WhiteCard className="mt-3">
                    <p className="black-heading-title mt-0 ">
                      Company Contacts
                    </p>
                    <div className="edit-details">
                      <img src={EditOrangeIcon} alt="" />
                      Edit
                    </div>
                    <GroupUser>
                      <img
                        className="default-user-activity"
                        src={DefaultUser}
                        alt=""
                      />
                      <div className="activity-user ">Randy Hetrick</div>
                      <div className="user-email-address">
                        rhetrick@trxtraining.com
                      </div>
                      <div className="clear-fix" />
                    </GroupUser>
                    <GroupUser className="mt-3">
                      <img
                        className="default-user-activity"
                        src={DefaultUser}
                        alt=""
                      />
                      <div className="activity-user ">Pete Jacobs</div>
                      <div className="user-email-address">
                        rhetrick@trxtraining.com
                      </div>
                      <div className="clear-fix" />
                    </GroupUser>
                  </WhiteCard>
                </div>
                <div className="col-6">
                  <WhiteCard>
                    <p className="black-heading-title mt-0 ">
                      Amazon Credentials
                    </p>
                    <div className="edit-details">
                      <img src={EditOrangeIcon} alt="" />
                      Edit
                    </div>
                    <div className="copy-info">
                      <div className="label mt-3">Merchant ID</div>
                      <div className="label-info">AMC184CK5LKV1129F</div>

                      <div className="copy-text">
                        <img src={CopyLinkIcon} alt="" />
                        Copy
                      </div>
                    </div>
                    <div className="copy-info">
                      <div className="label mt-3">Marketplace ID</div>
                      <div className="label-info">VNNUSNV1310VD9V3B</div>

                      <div className="copy-text">
                        <img src={CopyLinkIcon} alt="" />
                        Copy
                      </div>
                    </div>
                    <div className="straight-line horizontal-line pt-3 mb-3" />

                    <div className="label mt-3">
                      Account Management Credentials
                      <img className="info-icon" src={InfoIcons} alt="" />
                    </div>
                    <div className="label-info">
                      accounts+CMtyre9@buyboxexperts.com
                    </div>
                    <div className="phone-number">+1 592 559 2950</div>
                    <div className="straight-line horizontal-line pt-3 mb-3" />
                    <div className="label mt-3">
                      Data Bots Credentials
                      <img className="info-icon" src={InfoIcons} alt="" />
                    </div>
                    <div className="label-info">
                      accounts+data@buyboxexperts.com
                    </div>
                    <div className="phone-number">+1 592 559 2950</div>
                    <div className="straight-line horizontal-line pt-3 mb-3" />
                    <div className="label mt-3">
                      Vendor Central Username & password
                      <br />
                      <a href="*">
                        {' '}
                        View Credentials
                        <img
                          className="external-link-icon"
                          src={ExternalLink}
                          alt="link"
                        />
                      </a>
                    </div>
                    <div className="label mt-3">
                      Seller Central Username & password
                      <br />
                      <a href="*">
                        {' '}
                        View Credentials
                        <img
                          className="external-link-icon"
                          src={ExternalLink}
                          alt="link"
                        />
                      </a>
                    </div>
                  </WhiteCard>
                </div>
              </div>
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

// const Tab = styled.div`
//   .tabs {
//     list-style-type: none;
//     position: relative;
//     text-align: left;
//     margin: 0;
//     padding: 0;
//     border-bottom: 1px solid #e0e6e8;

//     li {
//       display: inline-block;
//       margin-right: 60px;
//       padding-bottom: 15px;
//       font-weight: normal;
//       color: #000000;
//       font-size: 16px;
//       font-family: ${Theme.baseFontFamily};
//       cursor: pointer;

//       &:last-child {
//         margin-right: 0;
//       }

//       &.a {
//         text-decoration: none;
//       }

//       &.active {
//         padding-bottom: 15px;
//         border-bottom: 2px solid ${Theme.orange};
//         color: ${Theme.black};
//         font-family: ${Theme.titleFontFamily};
//       }
//     }
//   }
// `;
