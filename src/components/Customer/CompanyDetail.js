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
  LinkedinIcon,
  InstagramIcon,
  TwitterIcon,
} from '../../theme/images/index';

import { WhiteCard, GroupUser } from '../../theme/Global';

export default function CompanyDetail() {
  return (
    <>
      <CustomerDetailBanner>
        <div className="banner">
          <div className="inner" />
        </div>

        <CustomerBody>
          <WhiteCard className="customer-brand-details mb-n2">
            <div className="row">
              <div className="col-lg-3 col-md-12">
                <div className="brand-logo" />
              </div>
              <div className="col-lg-9 col-md-12 ">
                <div className="brand-name mb-2">
                  TRX Training
                  <span>Active</span>
                </div>
                <div className=" edit-details edit-brand-details ">
                  <img src={EditOrangeIcon} alt="" />
                  Edit
                </div>

                <div className="row">
                  <div className="col-lg-4 col-12">
                    <div className="company-label-info text-left">
                      1660 Pacific Ave, San Francisco, CA, United States
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="company-label-info">
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
                    </div>
                  </div>{' '}
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="company-label-info">
                      <div className="brand-label">
                        Annual Revenue
                        <span>$50,000,000</span>
                      </div>
                      <div className="brand-label">
                        Company Size
                        <span> 200</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </WhiteCard>
          <div className="row">
            <div className="col-lg-4 col-12">
              <WhiteCard className="left-border order-2 order-lg-1 d-lg-block d-none">
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
              <select className="customeer-dropdown-select d-lg-none d-block ">
                <option> Agreements</option>
                <option> Company Details</option>
                <option> Activity</option>
              </select>
              <WhiteCard className="mt-3 order-1 order-lg-2">
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
              <WhiteCard className="mt-3 d-none d-lg-block">
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

                    <ul className="social-media-icons">
                      <li>
                        <img src={LinkedinIcon} alt="linkedin" />
                      </li>
                      <li>
                        <img src={InstagramIcon} alt="linkedin" />
                      </li>
                      <li>
                        <img src={TwitterIcon} alt="linkedin" />
                      </li>
                    </ul>
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
  .banner {
    height: 307px;
    padding-left: 62px;
    background-image: url(${BannerImg});
    background-position: top;
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;

    .inner {
      background: rgb(14 14 14 / 28%);
      height: 100%;
      top: 0;
      max-width: 100%;
      padding: 0 20px;
    }
  }

  @media only screen and (max-width: 991px) {
    .banner {
      padding-left: 0;
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
  .customeer-dropdown-select {
    color: #000000;
    padding: 0 0px 0px 25px;
    background-color: #ffffff;
    border-radius: 8px;
    width: 100%;
    padding: 13px;
    border-left: 3px solid red;
    color: #000000;
    font-size: 16px;
    font-weight: bold;
    height: 55px;
    border-right: none;
    border-top: none;
    border-bottom: none;

    &:focus {
      outline: none;
    }

    select {
      background: red;
      width: 140px;
      height: 35px;
      border: 1px solid #ccc;
      font-size: 18px;
    }
  }

  @media only screen and (max-width: 991px) {
    padding: 0 20px;
  }
`;
