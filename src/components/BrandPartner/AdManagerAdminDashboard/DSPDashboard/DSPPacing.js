import React from 'react';

import styled from 'styled-components';

import { Status, Table, WhiteCard } from '../../../../common';
import {
  ArrowRightBlackIcon,
  ArrowUpIcon,
  CompanyDefaultUser,
} from '../../../../theme/images';
import { TabletViewManager } from '../../../../theme/Global';
// import Theme from '../../../../theme/Theme';

const DSPPacing = () => {
  return (
    <Wrapper>
      <WhiteCard className="mb-3">
        <div className="row">
          <div className="col-12">
            <p className="black-heading-title mt-2 mb-0"> DSP Pacing</p>
            <p className="gray-normal-text mb-4 mt-1">
              Monthly Budget Pacing (January):
              <span className="orange-text">
                {' '}
                <span>
                  Underspending
                  <img
                    className="right-arrow-icon"
                    width="18px"
                    src={ArrowRightBlackIcon}
                    alt="arrow"
                  />
                </span>
              </span>
            </p>
          </div>
          <div className="straight-line horizontal-line mb-3" />
          <div className="col-md-8 col-sm-12 pr-0 mb-3">
            <ul className="dsp-spent-date">
              <li>
                <div className="label ">Planned Spend to date</div>
                <div className="label-range">$625,481 (68%)</div>
              </li>
              <li>
                <div className="label ">Actual Spend to date</div>
                <div className="label-range">$625,481 (68%)</div>
              </li>
              <li>
                {' '}
                <div className="label ">Overspend to date</div>
                <div className="label-range red-range">$625,481 (68%)</div>
              </li>
            </ul>
          </div>
          <div className="col-md-4 col-sm-12 pl-0 mt-2 mb-3">
            {' '}
            <div className="days-container spending  ">
              <ul className="days-tab">
                <li>
                  {' '}
                  <label htmlFor="daysCheck">
                    Overspending{' '}
                    <input
                      className="d-none"
                      type="radio"
                      id="daysCheck"
                      name="flexRadioDefault"
                    />
                  </label>
                </li>

                <li>
                  <label htmlFor="monthlyCheck">
                    Underspending <input className=" d-none" />
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <div className="straight-line horizontal-line " />
        </div>
        <Table className="mt-0 d-md-none d-sm-none d-lg-block">
          <tr>
            <th width="40%" className="product-header">
              Customer
            </th>
            <th width="20%" className="product-header">
              This Period
            </th>
            <th width="20%" className="product-header">
              {' '}
              Prev. Period
            </th>
            <th width="20%" className="product-header">
              {' '}
              Change
            </th>
            <th width="20%" className="product-header">
              Contribution
            </th>
          </tr>
          <tbody>
            {' '}
            <tr>
              <td className="product-body">
                {' '}
                <img
                  className="company-logo"
                  src={CompanyDefaultUser}
                  alt="logo"
                />
                <div className="company-name">TRX Training </div>
                <div className="status">Anton Brownstein</div>
              </td>
              <td className="product-body">
                {' '}
                $475,294.33{' '}
                {/* <div className="increase-rate ">
                {' '}
                <img
                  className="green-arrow"
                  src={ArrowUpIcon}
                  alt="arrow"
                />{' '}
                $52,849.49
              </div>{' '} */}
              </td>
              <td className="product-body"> $475,294.33</td>
              <td className="product-body">
                {' '}
                <div className="increase-rate large">
                  {' '}
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow"
                  />{' '}
                  $52,849.49
                </div>{' '}
              </td>
              <td className="product-body">
                <Status className="statusContainer" label="High" />
              </td>
            </tr>
          </tbody>
        </Table>
        <TabletViewManager className="d-lg-none d-md-block d-sm-block">
          <div className="container-fluid">
            <div className="row cursor">
              <div className="col-md-6 col-12 mt-4" role="presentation">
                {' '}
                <img
                  className="company-logo"
                  src={CompanyDefaultUser}
                  alt="logo"
                />
                <div className="company-name">TRX Training </div>
                <div className="status">Anton Brownstein</div>
                <div className="clear-fix" />
                <div className=" straight-line horizontal-line pt-3 mb-3 " />
                <div className="row">
                  <div className="col-6 pb-3">
                    {' '}
                    <div className="label">This Period</div>
                    <div className="label-info ">1,077,958</div>
                  </div>
                  <div className="col-6 pb-3">
                    {' '}
                    <div className="label">Prev. Period</div>
                    <div className="label-info ">1,077,958</div>
                  </div>
                  <div className="col-6 pb-3">
                    {' '}
                    <div className="label">Change</div>
                    <div className="increase-rate large">
                      {' '}
                      <img
                        className="green-arrow"
                        src={ArrowUpIcon}
                        alt="arrow"
                      />{' '}
                      $52,849.49
                    </div>{' '}
                  </div>
                  <div className="col-6 pb-3">
                    {' '}
                    <div className="label">Contribution</div>
                    {/* <Status label="High" backgroundColor="#E3F2D2" />
                   <Status label="Medium" backgroundColor="#FDF3D7" /> */}
                    <Status label="Low" backgroundColor="#F4F6FC" />
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 mt-4" role="presentation">
                {' '}
                <img
                  className="company-logo"
                  src={CompanyDefaultUser}
                  alt="logo"
                />
                <div className="company-name">TRX Training</div>
                <div className="status">Anton Brownstein</div>
                <div className="clear-fix" />
                <div className=" straight-line horizontal-line pt-3 mb-3 " />
                <div className="row">
                  <div className="col-6 pb-3">
                    {' '}
                    <div className="label">This Period</div>
                    <div className="label-info ">1,077,958</div>
                  </div>
                  <div className="col-6 pb-3">
                    {' '}
                    <div className="label">Prev. Period</div>
                    <div className="label-info ">1,077,958</div>
                  </div>
                  <div className="col-6 pb-3">
                    {' '}
                    <div className="label">Change</div>
                    <div className="increase-rate large">
                      {' '}
                      <img
                        className="green-arrow"
                        src={ArrowUpIcon}
                        alt="arrow"
                      />{' '}
                      $52,849.49
                    </div>{' '}
                  </div>
                  <div className="col-6 pb-3">
                    {' '}
                    <div className="label">Contribution</div>
                    {/* <Status label="High" backgroundColor="#E3F2D2" />
                   <Status label="Medium" backgroundColor="#FDF3D7" /> */}
                    <Status label="Low" backgroundColor="#F4F6FC" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabletViewManager>
      </WhiteCard>
    </Wrapper>
  );
};

export default DSPPacing;

const Wrapper = styled.div`
  td {
    padding: 20px 10px 3px 0px !important;
  }
  .statusContainer {
    margin-top: 0px !important;
    padding: 5px 30px !important;
  }
`;
