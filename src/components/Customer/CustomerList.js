/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import Select from 'react-select';
import Theme from '../../theme/Theme';
import {
  CheckBox,
  DropDownSelect,
  InputSearchWithRadius,
  Table,
} from '../../common';
import {
  DefaultUser,
  SearchIcon,
  ClockIcon,
  ArrowUpIcon,
  SliderHIcon,
  ArrowDownIcon,
  CloseIcon,
} from '../../theme/images/index';
import CustomerListTablet from './CustomerListTablet';

export default function CustomerList() {
  const options = [
    { value: ' Performance', label: 'Performance' },
    { value: 'Contract Details', label: 'Contract Details' },
  ];

  const isDesktop = useMediaQuery({ minWidth: 992 });

  return (
    <CustomerListPage>
      <div className="row">
        <div className="col-lg-2 col-12 ">
          {' '}
          <p className="black-heading-title ml-3 "> Customers</p>
          <div className=" mb-3 d-lg-none d-block ">
            <label
              className="filter-slider mt-4 "
              htmlFor="tabletmenu-check"
              id="responsive-button">
              <img src={SliderHIcon} alt="Menu Lines" />
              Filter
            </label>
          </div>
          <MobileLeftSidebar>
            <input type="checkbox" id="tabletmenu-check" />
            <div id="ifp-sidebar-responsive">
              <SideContent>
                <p className="black-heading-title mt-0 mb-4">
                  {' '}
                  Filter Customers
                </p>
                <label
                  htmlFor="tabletmenu-check"
                  className="close-icon d-xl-none d-block">
                  <img width="25px" src={CloseIcon} alt="cross" />
                </label>
                <div className="label">Brand Strategist</div>
                <DropDownSelect>
                  <Select options={options} />
                </DropDownSelect>{' '}
                <div className="label mt-4">Status</div>
                <div className="unselected ">Unselect all</div>
                <div className="clear-fix" />
                <ul className="check-box-list">
                  <li>
                    <CheckBox>
                      <label
                        className="container customer-pannel"
                        htmlFor="contract-copy-check">
                        Active
                        <input type="checkbox" id="contract-copy-check" />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>
                  </li>
                  <li>
                    <CheckBox>
                      <label
                        className="container customer-pannel"
                        htmlFor="contract-copy-check">
                        At Risk
                        <input type="checkbox" id="contract-copy-check" />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>
                  </li>
                  <li>
                    <CheckBox>
                      <label
                        className="container customer-pannel"
                        htmlFor="contract-copy-check">
                        Pending Cancellation
                        <input type="checkbox" id="contract-copy-check" />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>
                  </li>
                  <li>
                    <CheckBox>
                      <label
                        className="container customer-pannel"
                        htmlFor="contract-copy-check">
                        Inactive
                        <input type="checkbox" id="contract-copy-check" />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>
                  </li>
                </ul>
                <div className="label mt-4">Contract Type</div>
                <div className="unselected ">Unselect all</div>
                <div className="clear-fix" />
                <ul className="check-box-list">
                  <li>
                    {' '}
                    <CheckBox>
                      <label
                        className="container customer-pannel"
                        htmlFor="contract-copy-check">
                        Recurring
                        <input type="checkbox" id="2" />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>
                  </li>
                  <li>
                    {' '}
                    <CheckBox>
                      <label
                        className="container customer-pannel"
                        htmlFor="contract-copy-check">
                        One Time
                        <input type="checkbox" id="3" />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>
                  </li>
                </ul>
              </SideContent>
            </div>
            <div className="straight-line horizontal-line" />
          </MobileLeftSidebar>
        </div>

        <div className="col-lg-6 col-md-6 col-12 col-8 mt-2 mb-2">
          <InputSearchWithRadius>
            <input
              className=" form-control search-filter"
              placeholder="Search"
            />

            <img src={SearchIcon} alt="search" className="search-input-icon" />
          </InputSearchWithRadius>
        </div>
        <div className="col-lg-2 col-md-3 col-6  mt-2 mb-2">
          <DropDownSelect>
            <Select options={options} />
          </DropDownSelect>{' '}
        </div>
        <div className="col-lg-2 col-md-3  col-6  mt-2 mb-2">
          <DropDownSelect>
            <Select options={options} />
          </DropDownSelect>{' '}
        </div>
      </div>

      <div className="straight-line horizontal-line" />
      <CustomerLeftPannel className="d-none d-lg-block">
        <div className="label">Brand Strategist</div>
        <DropDownSelect>
          <Select options={options} />
        </DropDownSelect>{' '}
        <div className="label mt-4">Status</div>
        <div className="unselected ">Unselect all</div>
        <div className="clear-fix" />
        <ul className="check-box-list">
          <li>
            <CheckBox>
              <label
                className="container customer-pannel"
                htmlFor="contract-copy-check">
                Active
                <input type="checkbox" id="contract-copy-check" />
                <span className="checkmark" />
              </label>
            </CheckBox>
          </li>
          <li>
            <CheckBox>
              <label
                className="container customer-pannel"
                htmlFor="contract-copy-check">
                At Risk
                <input type="checkbox" id="contract-copy-check" />
                <span className="checkmark" />
              </label>
            </CheckBox>
          </li>
          <li>
            <CheckBox>
              <label
                className="container customer-pannel"
                htmlFor="contract-copy-check">
                Pending Cancellation
                <input type="checkbox" id="contract-copy-check" />
                <span className="checkmark" />
              </label>
            </CheckBox>
          </li>
          <li>
            <CheckBox>
              <label
                className="container customer-pannel"
                htmlFor="contract-copy-check">
                Inactive
                <input type="checkbox" id="contract-copy-check" />
                <span className="checkmark" />
              </label>
            </CheckBox>
          </li>
        </ul>
        <div className="label mt-4">Contract Type</div>
        <div className="unselected ">Unselect all</div>
        <div className="clear-fix" />
        <ul className="check-box-list">
          <li>
            {' '}
            <CheckBox>
              <label className="container customer-pannel" htmlFor="2">
                Recurring
                <input type="checkbox" id="2" />
                <span className="checkmark" />
              </label>
            </CheckBox>
          </li>
          <li>
            {' '}
            <CheckBox>
              <label className="container customer-pannel" htmlFor="3">
                One Time
                <input type="checkbox" id="3" />
                <span className="checkmark" />
              </label>
            </CheckBox>
          </li>
        </ul>
      </CustomerLeftPannel>

      {isDesktop ? (
        <div className="table-part">
          <Table>
            <tbody>
              <tr className="table-header">
                <th className="text-center ">Customer</th>
                <th>Contract</th>
                <th>Retainer</th>
                <th>Rev. Share</th>
                <th>Brand Strategist</th>
              </tr>
              <tr>
                <td width="20%">
                  <img className="company-logo" src={DefaultUser} alt="logo" />

                  <div className="company-name">Viking Farmer</div>
                  <div className="status">Active</div>
                </td>
                <td width="40%">
                  <p className="black-heading-title mt-0 mb-0">
                    {' '}
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
                        <img
                          className="clock-icon"
                          src={ClockIcon}
                          alt="clock"
                        />{' '}
                        96 days
                      </div>
                    </li>
                  </ul>
                </td>
                <td width="10%">
                  $3,000
                  <div className="increase-rate">
                    <img width="14px" src={ArrowUpIcon} alt="arrow-up" /> 0.51%
                  </div>
                </td>
                <td width="10%">
                  3%{' '}
                  <div className="decrease-rate">
                    <img
                      className="red-arrow"
                      src={ArrowDownIcon}
                      alt="arrow-up"
                    />
                    0.15%
                  </div>
                </td>
                <td width="20%">
                  <img
                    className="user-profile-circle"
                    src={DefaultUser}
                    alt="user"
                  />
                  <div className="user-name"> Anton</div>
                  <div className="user-name"> Brownstein</div>
                </td>
              </tr>
              <tr>
                <td width="20%">
                  <img className="company-logo" src={DefaultUser} alt="logo" />

                  <div className="company-name">Viking Farmer</div>
                  <div className="status">Active</div>
                </td>
                <td width="40%">
                  <p className="black-heading-title mt-0 mb-0">
                    {' '}
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
                        <img
                          className="clock-icon"
                          src={ClockIcon}
                          alt="clock"
                        />{' '}
                        96 days
                      </div>
                    </li>
                  </ul>
                </td>
                <td width="10%">
                  $3,000
                  <div className="increase-rate">
                    <img width="14px" src={ArrowUpIcon} alt="arrow-up" /> 0.51%
                  </div>
                </td>
                <td width="10%">
                  3%{' '}
                  <div className="decrease-rate">
                    <img
                      className="red-arrow"
                      src={ArrowDownIcon}
                      alt="arrow-up"
                    />
                    0.15%
                  </div>
                </td>
                <td width="20%">
                  <img
                    className="user-profile-circle"
                    src={DefaultUser}
                    alt="user"
                  />
                  <div className="user-name"> Anton</div>
                  <div className="user-name"> Brownstein</div>
                </td>
              </tr>
              <tr>
                <td width="20%">
                  <img className="company-logo" src={DefaultUser} alt="logo" />

                  <div className="company-name">Viking Farmer</div>
                  <div className="status">Active</div>
                </td>
                <td width="40%">
                  <p className="black-heading-title mt-0 mb-0">
                    {' '}
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
                        <img
                          className="clock-icon"
                          src={ClockIcon}
                          alt="clock"
                        />{' '}
                        96 days
                      </div>
                    </li>
                  </ul>
                </td>
                <td width="10%">
                  $3,000
                  <div className="increase-rate">
                    <img width="14px" src={ArrowUpIcon} alt="arrow-up" /> 0.51%
                  </div>
                </td>
                <td width="10%">
                  3%{' '}
                  <div className="decrease-rate">
                    <img
                      className="red-arrow"
                      src={ArrowDownIcon}
                      alt="arrow-up"
                    />
                    0.15%
                  </div>
                </td>
                <td width="20%">
                  <img
                    className="user-profile-circle"
                    src={DefaultUser}
                    alt="user"
                  />
                  <div className="user-name"> Anton</div>
                  <div className="user-name"> Brownstein</div>
                </td>
              </tr>
              <tr>
                <td width="20%">
                  <img className="company-logo" src={DefaultUser} alt="logo" />

                  <div className="company-name">Viking Farmer</div>
                  <div className="status">Active</div>
                </td>
                <td width="40%">
                  <p className="black-heading-title mt-0 mb-0">
                    {' '}
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
                        <img
                          className="clock-icon"
                          src={ClockIcon}
                          alt="clock"
                        />{' '}
                        96 days
                      </div>
                    </li>
                  </ul>
                </td>
                <td width="10%">
                  $3,000
                  <div className="increase-rate">
                    <img width="14px" src={ArrowUpIcon} alt="arrow-up" /> 0.51%
                  </div>
                </td>
                <td width="10%">
                  3%{' '}
                  <div className="decrease-rate">
                    <img
                      className="red-arrow"
                      src={ArrowDownIcon}
                      alt="arrow-up"
                    />
                    0.15%
                  </div>
                </td>
                <td width="20%">
                  <img
                    className="user-profile-circle"
                    src={DefaultUser}
                    alt="user"
                  />
                  <div className="user-name"> Anton</div>
                  <div className="user-name"> Brownstein</div>
                </td>
              </tr>
              <tr>
                <td width="20%">
                  <img className="company-logo" src={DefaultUser} alt="logo" />

                  <div className="company-name">Viking Farmer</div>
                  <div className="status">Active</div>
                </td>
                <td width="40%">
                  <p className="black-heading-title mt-0 mb-0">
                    {' '}
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
                        <img
                          className="clock-icon"
                          src={ClockIcon}
                          alt="clock"
                        />{' '}
                        96 days
                      </div>
                    </li>
                  </ul>
                </td>
                <td width="10%">
                  $3,000
                  <div className="increase-rate">
                    <img width="14px" src={ArrowUpIcon} alt="arrow-up" /> 0.51%
                  </div>
                </td>
                <td width="10%">
                  3%{' '}
                  <div className="decrease-rate">
                    <img
                      className="red-arrow"
                      src={ArrowDownIcon}
                      alt="arrow-up"
                    />
                    0.15%
                  </div>
                </td>
                <td width="20%">
                  <img
                    className="user-profile-circle"
                    src={DefaultUser}
                    alt="user"
                  />
                  <div className="user-name"> Anton</div>
                  <div className="user-name"> Brownstein</div>
                </td>
              </tr>
              <tr>
                <td width="20%">
                  <img className="company-logo" src={DefaultUser} alt="logo" />

                  <div className="company-name">Viking Farmer</div>
                  <div className="status">Active</div>
                </td>
                <td width="40%">
                  <p className="black-heading-title mt-0 mb-0">
                    {' '}
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
                        <img
                          className="clock-icon"
                          src={ClockIcon}
                          alt="clock"
                        />{' '}
                        96 days
                      </div>
                    </li>
                  </ul>
                </td>
                <td width="10%">
                  $3,000
                  <div className="increase-rate">
                    <img width="14px" src={ArrowUpIcon} alt="arrow-up" /> 0.51%
                  </div>
                </td>
                <td width="10%">
                  3%{' '}
                  <div className="decrease-rate">
                    <img
                      className="red-arrow"
                      src={ArrowDownIcon}
                      alt="arrow-up"
                    />
                    0.15%
                  </div>
                </td>
                <td width="20%">
                  <img
                    className="user-profile-circle"
                    src={DefaultUser}
                    alt="user"
                  />
                  <div className="user-name"> Anton</div>
                  <div className="user-name"> Brownstein</div>
                </td>
              </tr>
              <tr>
                <td width="20%">
                  <img className="company-logo" src={DefaultUser} alt="logo" />

                  <div className="company-name">Viking Farmer</div>
                  <div className="status">Active</div>
                </td>
                <td width="40%">
                  <p className="black-heading-title mt-0 mb-0">
                    {' '}
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
                        <img
                          className="clock-icon"
                          src={ClockIcon}
                          alt="clock"
                        />{' '}
                        96 days
                      </div>
                    </li>
                  </ul>
                </td>
                <td width="10%">
                  $3,000
                  <div className="increase-rate">
                    <img width="14px" src={ArrowUpIcon} alt="arrow-up" /> 0.51%
                  </div>
                </td>
                <td width="10%">
                  3%{' '}
                  <div className="decrease-rate">
                    <img
                      className="red-arrow"
                      src={ArrowDownIcon}
                      alt="arrow-up"
                    />
                    0.15%
                  </div>
                </td>
                <td width="20%">
                  <img
                    className="user-profile-circle"
                    src={DefaultUser}
                    alt="user"
                  />
                  <div className="user-name"> Anton</div>
                  <div className="user-name"> Brownstein</div>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      ) : (
        <CustomerListTablet />
      )}
    </CustomerListPage>
  );
}

const CustomerListPage = styled.div`
  padding-left: 62px;

  .table-part {
    padding-left: 290px;
    height: 550px;
    overflow: auto;
  }

  @media only screen and (max-width: 991px) {
    padding-left: 10px;
    .filter-slider {
      border: 1px solid #8798ad;
      padding: 8px 15px;
      border-radius: 25px;
      color: #000000;
      font-size: 15px;
      float: right;
      top: -16px;
      right: 40px;
      position: absolute;
      margin-top: -94px;
      font-weight: 600;

      img {
        width: 16px;
        margin-right: 7px;
        vertical-align: text-top;
      }
    }
  }
`;

const CustomerLeftPannel = styled.div`
  max-width: 290px;
  height: 80%;
  position: absolute;
  top: 127px;
  width: 100%;
  left: 62px;
  padding: 15px;
  border-right: 1px solid ${Theme.gray5};

  .label {
    color: ${Theme.gray40};
    text-transform: uppercase;
    line-height: 22px;
    font-family: ${Theme.titleFontFamily};
    font-size: 11px;
    margin-bottom: 3px;
  }

  .check-box-list {
    list-style-type: none;
    padding: 0;
    marging: 0;

    li {
      color: #171725;
      font-size: 14px;
      margin-bottom: 15px;
    }
  }

  .unselected {
    color: #556178;
    font-size: 14px;
    float: right;
    margin-top: -19px;
    cursor: pointer;
  }
  @media only screen and (max-width: 991px) {
    dispaly: none;
  }
`;
const MobileLeftSidebar = styled.div`
  display: none;
  #tabletmenu-check {
    display: none;
  }

  @media only screen and (max-width: 991px) {
    background-color: ${Theme['$base-color']};
    display: block;
    #responsive-button {
      display: block;
      position: absolute;
      left: 0px;
      top: 43px;
      z-index: 999;
      .menu-icon {
        width: 24px;
        margin-top: -52px;
        margin-left: -20px;
      }
    }
    #ifp-sidebar-responsive {
      display: none;
      height: 100%;
      position: absolute;
      z-index: 999;
      top: 0px;
      left: 0;
      .close-icon {
        color: ${Theme['$a-white']};
        font-size: ${Theme['$base-f-size-res']};
        font-family: ${Theme['$title-font-family']};
        position: absolute;
        right: 20px;
        top: 10px;
        z-index: 999;

        img {
          width: 18px;
          margin-top: 8px;
        }
      }
    }
    #tabletmenu-check:checked ~ #ifp-sidebar-responsive {
      display: block;
    }
    #mobilemenu-close:checked ~ #ifp-sidebar-responsive {
      display: none;
    }
    .content-header {
      padding: 30px 30px 10px !important;
    }
  }
  @media only screen and (max-width: 768px) {
    #responsive-button {
      .menu-icon {
        width: 24px;
        margin-top: -16px;
        position: absolute;
        margin-left: -20px;
      }
    }
  }
`;

const SideContent = styled.div`
  @media (max-width: 991px) {
    width: 300px;
    min-height: 100%;
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    background: white;
    padding: 15px;
    box-shadow: ${Theme.commonShadow};

    .label {
      color: ${Theme.gray40};
      text-transform: uppercase;
      line-height: 22px;
      font-family: ${Theme.titleFontFamily};
      font-size: 11px;
      margin-bottom: 3px;
    }

    .check-box-list {
      list-style-type: none;
      padding: 0;
      marging: 0;

      li {
        color: #171725;
        font-size: 14px;
        margin-bottom: 15px;
      }
    }

    .unselected {
      color: #556178;
      font-size: 14px;
      float: right;
      margin-top: -19px;
      cursor: pointer;
    }
  }
`;
