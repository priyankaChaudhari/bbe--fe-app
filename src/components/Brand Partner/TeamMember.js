import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import {
  DropDownSelect,
  InputSearchWithRadius,
  Table,
  ActionDropDown,
  CommonPagination,
} from '../../common';
import Theme from '../../theme/Theme';

import {
  InfoIcon,
  SearchIcon,
  CompanyDefaultUser,
  BrandLogo,
} from '../../theme/images';

export default function TeamMember() {
  return (
    <BrandPartnerTeamMember>
      <div className="dashboard-header-sticky">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2 col-sm-12">
              <p className="black-heading-title ml-1 pt-1"> Team Members</p>
            </div>
            <div className="col-md-10 col-sm-12 text-right   mb-2 ">
              <ul className="team-header">
                <li className="search-input">
                  <InputSearchWithRadius className="customer-list-header w-80">
                    <input
                      className=" form-control search-filter"
                      placeholder="Search"
                    />

                    <img
                      src={InfoIcon}
                      alt="search cursor"
                      data-tip="Search by Company Name, Contact First, Last Name or Email"
                      data-for="info"
                      className="info-icon"
                    />

                    <img
                      src={SearchIcon}
                      alt="search"
                      className="search-input-icon"
                    />
                  </InputSearchWithRadius>
                </li>
                <li className="sort-select">
                  <DropDownSelect>
                    <Select classNamePrefix="react-select" className="active" />
                  </DropDownSelect>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="straight-line horizontal-line mt-n2" />
      </div>
      <div className="table-container">
        <div className="table-part">
          <Table>
            {' '}
            <thead>
              <tr className="table-header">
                <th width="20%" className="customer-header">
                  Team Member
                </th>
                <th width="20%">Email</th>
                <th width="40%">Brand Partners</th>
                <th width="20%"> &nbsp; </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {' '}
                  <img
                    className="company-logo"
                    src={CompanyDefaultUser}
                    alt="logo"
                  />
                  <div className="company-name">Wilhelm Dowall </div>
                  <div
                    className="status"
                    style={{ textTransform: 'capitalize' }}>
                    Brand Growth Strategist
                  </div>
                </td>
                <td>
                  {' '}
                  <div className="user-email">
                    wdowall@buyboxexperts.com
                  </div>{' '}
                </td>
                <td>
                  <ul className="brand-partner">
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                  </ul>
                </td>
                <td className="text-right">
                  <ActionDropDown className="w-150">
                    {' '}
                    <Select
                      classNamePrefix="react-select"
                      placeholder="Actions"
                      className="active"
                    />
                  </ActionDropDown>
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
                  <img
                    className="company-logo"
                    src={CompanyDefaultUser}
                    alt="logo"
                  />
                  <div className="company-name">Wilhelm Dowall </div>
                  <div
                    className="status"
                    style={{ textTransform: 'capitalize' }}>
                    Brand Growth Strategist
                  </div>
                </td>
                <td>
                  {' '}
                  <div className="user-email">
                    wdowall@buyboxexperts.com
                  </div>{' '}
                </td>
                <td>
                  <ul className="brand-partner">
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                  </ul>
                </td>
                <td className="text-right">
                  <ActionDropDown className="w-150">
                    {' '}
                    <Select
                      classNamePrefix="react-select"
                      placeholder="Actions"
                      className="active"
                    />
                  </ActionDropDown>
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
                  <img
                    className="company-logo"
                    src={CompanyDefaultUser}
                    alt="logo"
                  />
                  <div className="company-name">Wilhelm Dowall </div>
                  <div
                    className="status"
                    style={{ textTransform: 'capitalize' }}>
                    Brand Growth Strategist
                  </div>
                </td>
                <td>
                  {' '}
                  <div className="user-email">
                    wdowall@buyboxexperts.com
                  </div>{' '}
                </td>
                <td>
                  <ul className="brand-partner">
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                  </ul>
                </td>
                <td className="text-right">
                  <ActionDropDown className="w-150">
                    {' '}
                    <Select
                      classNamePrefix="react-select"
                      placeholder="Actions"
                      className="active"
                    />
                  </ActionDropDown>
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
                  <img
                    className="company-logo"
                    src={CompanyDefaultUser}
                    alt="logo"
                  />
                  <div className="company-name">Wilhelm Dowall </div>
                  <div
                    className="status"
                    style={{ textTransform: 'capitalize' }}>
                    Brand Growth Strategist
                  </div>
                </td>
                <td>
                  {' '}
                  <div className="user-email">
                    wdowall@buyboxexperts.com
                  </div>{' '}
                </td>
                <td>
                  <ul className="brand-partner">
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                  </ul>
                </td>
                <td className="text-right">
                  <ActionDropDown className="w-150">
                    {' '}
                    <Select
                      classNamePrefix="react-select"
                      placeholder="Actions"
                      className="active"
                    />
                  </ActionDropDown>
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
                  <img
                    className="company-logo"
                    src={CompanyDefaultUser}
                    alt="logo"
                  />
                  <div className="company-name">Wilhelm Dowall </div>
                  <div
                    className="status"
                    style={{ textTransform: 'capitalize' }}>
                    Brand Growth Strategist
                  </div>
                </td>
                <td>
                  {' '}
                  <div className="user-email">
                    wdowall@buyboxexperts.com
                  </div>{' '}
                </td>
                <td>
                  <ul className="brand-partner">
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                  </ul>
                </td>
                <td className="text-right">
                  <ActionDropDown className="w-150">
                    {' '}
                    <Select
                      classNamePrefix="react-select"
                      placeholder="Actions"
                      className="active"
                    />
                  </ActionDropDown>
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
                  <img
                    className="company-logo"
                    src={CompanyDefaultUser}
                    alt="logo"
                  />
                  <div className="company-name">Wilhelm Dowall </div>
                  <div
                    className="status"
                    style={{ textTransform: 'capitalize' }}>
                    Brand Growth Strategist
                  </div>
                </td>
                <td>
                  {' '}
                  <div className="user-email">
                    wdowall@buyboxexperts.com
                  </div>{' '}
                </td>
                <td>
                  <ul className="brand-partner">
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                  </ul>
                </td>
                <td className="text-right">
                  <ActionDropDown className="w-150">
                    {' '}
                    <Select
                      classNamePrefix="react-select"
                      placeholder="Actions"
                      className="active"
                    />
                  </ActionDropDown>
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
                  <img
                    className="company-logo"
                    src={CompanyDefaultUser}
                    alt="logo"
                  />
                  <div className="company-name">Wilhelm Dowall </div>
                  <div
                    className="status"
                    style={{ textTransform: 'capitalize' }}>
                    Brand Growth Strategist
                  </div>
                </td>
                <td>
                  {' '}
                  <div className="user-email">
                    wdowall@buyboxexperts.com
                  </div>{' '}
                </td>
                <td>
                  <ul className="brand-partner">
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                    <li>
                      <img
                        className="brand-logo"
                        src={CompanyDefaultUser}
                        alt="brand"
                      />
                    </li>
                    <li>
                      <img className="brand-logo" src={BrandLogo} alt="brand" />
                    </li>
                  </ul>
                </td>
                <td className="text-right">
                  <ActionDropDown className="w-150">
                    {' '}
                    <Select
                      classNamePrefix="react-select"
                      placeholder="Actions"
                      className="active"
                    />
                  </ActionDropDown>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="footer-sticky">
          <div className="straight-line horizontal-line" />
          <div className="container-fluid">
            <CommonPagination />
          </div>
        </div>
      </div>
    </BrandPartnerTeamMember>
  );
}

const BrandPartnerTeamMember = styled.div`
  padding-left: 62px;

  .team-header {
    list-style-type: none;
    padding: 0;
    margin: 10px 0;
    li {
      display: inline-block;
      margin-right: 10px;

      &.sort-select {
        width: 259px;
      }
      &.search-input {
        width: 745px;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .dashboard-header-sticky {
    position: fixed;
    left: 64px;
    right: 0;
    z-index: 1;
    background-color: ${Theme.white};
  }
  .table-part {
    padding-top: 65px;
    overflow: auto;
    min-height: 892px;
    height: 100%;
    padding-bottom: 69px;
    position: relative;
  }
  .footer-sticky {
    position: fixed;
    bottom: 0;
    left: 353px;
    right: 0;
    background: white;
  }
`;
