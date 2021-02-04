import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
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
  RecurringIcon,
  ServiceIcon,
  CloseIcon,
} from '../../theme/images/index';
import Button from '../../common/Button';
import { GroupUser, WhiteCard } from '../../theme/Global';
import { ModalBox, FormField } from '../../common';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '600px ',
    width: '100% ',
    minHeight: '200px',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function CustomerDetails() {
  const [showModal, setShowModal] = useState(false);
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
                <div
                  className=" edit-details edit-brand-details "
                  onClick={() => setShowModal(true)}
                  role="presentation">
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
                      Activity
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
                  <div className="col-lg-9 col-md-8 col-12">
                    <p className="black-heading-title mt-0 mb-0">
                      <img
                        className="service-icon mb-2"
                        src={ServiceIcon}
                        alt=""
                      />
                      One Time Services Contract
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-4 col-12 text-right">
                    <Button className="btn-transparent w-100  ">
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
                <div className="clear-fix" />
              </WhiteCard>
            </div>
          </div>
        </CustomerBody>
      </CustomerDetailBanner>
      <Modal
        isOpen={showModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => setShowModal(false)}
          role="presentation"
        />
        <ModalBox>
          <div className="modal-body">
            <h4>Edit Company Details</h4>
            <div className="body-content mt-3">
              <div className="row">
                <div className="col-3">
                  <div className="customer-company-profile" />
                </div>
                <div className="col-9">
                  <FormField className="mt-3">
                    <label htmlFor="emailAddress">
                      Company Name
                      <br />
                      <input
                        className="form-control"
                        type="text"
                        placeholder=" Recurring"
                      />
                    </label>
                  </FormField>
                </div>
                <div className="col-12">
                  <FormField className="mt-3">
                    <label htmlFor="emailAddress">
                      Description
                      <br />
                      <textarea
                        className="form-control"
                        type="text"
                        placeholder=" Recurring"
                      />
                    </label>
                  </FormField>
                </div>
                <div className="col-6">
                  <FormField className="mt-3">
                    <label htmlFor="emailAddress">
                      Category
                      <input
                        className="form-control"
                        type="text"
                        placeholder=" Recurring"
                      />
                    </label>
                  </FormField>
                </div>
                <div className="col-6">
                  <FormField className="mt-3">
                    <label htmlFor="emailAddress">
                      Website
                      <input
                        className="form-control"
                        type="text"
                        placeholder=" Recurring"
                      />
                    </label>
                  </FormField>
                </div>
                <div className="col-6">
                  <FormField className="mt-3">
                    <label htmlFor="emailAddress">
                      Annual Revenue
                      <input
                        className="form-control"
                        type="text"
                        placeholder=" Recurring"
                      />
                    </label>
                  </FormField>
                </div>
                <div className="col-6">
                  <FormField className="mt-3">
                    <label htmlFor="emailAddress">
                      Company Size
                      <input
                        className="form-control"
                        type="text"
                        placeholder=" Recurring"
                      />
                    </label>
                  </FormField>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-line " />
          <div className="modal-footer">
            <Button className=" btn-primary mr-4">Save Changes</Button>

            <Button className=" btn-borderless">Discard Changes</Button>
          </div>
        </ModalBox>
      </Modal>
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
