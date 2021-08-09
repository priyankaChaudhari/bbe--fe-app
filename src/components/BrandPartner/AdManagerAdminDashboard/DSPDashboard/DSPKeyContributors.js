/* eslint-disable jsx-a11y/label-has-associated-control */
import _ from 'lodash';
import { arrayOf, bool, func, objectOf, string } from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PageLoader, Status, Table, Tabs, WhiteCard } from '../../../../common';
import {
  contributionColorSet,
  dspTabOptions,
} from '../../../../constants/AdManagerAdminDashboardConstants';
import { TabletViewManager } from '../../../../theme/Global';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CompanyDefaultUser,
} from '../../../../theme/images';
import Theme from '../../../../theme/Theme';

const DSPKeyContributors = ({
  selectedKeyContribution,
  selectedAdManager,
  handleContribution,
  selectedDSPMatrics,
  handleOnMatricsTabChange,
  selectedTabMatrics,
  data,
  loader,
}) => {
  const [keyContribution, setKeyContribution] = useState({
    id: 'positive',
    label: 'Positive',
    id2: 'negative',
    label2: 'Negative',
  });

  useEffect(() => {
    if (selectedAdManager !== 'all') {
      setKeyContribution({
        id: 'contribution',
        label: 'Contribution',
        id2: 'keyMetrics',
        label2: 'Key Metrics',
      });
    } else {
      setKeyContribution({
        id: 'positive',
        label: 'Positive',
        id2: 'negative',
        label2: 'Negative',
      });
    }
  }, [loader, selectedAdManager]);

  const renderContribution = () => {
    return (
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
          <th width="60%" className="product-header">
            Contribution
          </th>
        </tr>
        <tbody>
          {data &&
            data.map((item) => {
              return (
                <tr>
                  <td className="product-body">
                    {' '}
                    <img
                      className="company-logo"
                      src={CompanyDefaultUser}
                      alt="logo"
                    />
                    <div className="company-name">{item.customer_name}</div>
                    <div className="status">{item.ad_manager}</div>
                  </td>
                  <td className="product-body">
                    {' '}
                    {item && item.current
                      ? `$${item.current
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                      : '$0'}
                  </td>
                  <td className="product-body">
                    {' '}
                    {item && item.previous
                      ? `$${item.previous
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                      : '$0'}
                  </td>
                  <td className="product-body">
                    {item && item.change.toString().includes('-') ? (
                      <div className="decrease-rate large">
                        {' '}
                        <img
                          className="red-arrow"
                          src={ArrowDownIcon}
                          alt="arrow"
                        />
                        {item && item.change
                          ? `$${Number(item.change.toString().split('-')[1])
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                          : '$0'}
                      </div>
                    ) : (
                      <div className="increase-rate large">
                        {' '}
                        <img
                          className="green-arrow"
                          src={ArrowUpIcon}
                          alt="arrow"
                        />
                        {item && item.change
                          ? `$${item.change
                              .toFixed(2)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                          : '$0'}
                      </div>
                    )}
                  </td>
                  <td className="product-body">
                    <Status
                      className="statusContainer"
                      label={item.contribution_bracket}
                      backgroundColor={
                        contributionColorSet[item.contribution_bracket]
                      }
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    );
  };

  const renderContributionTablet = () => {
    return (
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
    );
  };

  return (
    <Wrapper>
      <WhiteCard className="mb-3">
        <div className="row">
          <div className="col-md-6 col-sm1-12">
            <p className="black-heading-title mt-2 mb-4"> Contribution</p>
          </div>
          <div className="col-md-6 col-sm1-12  mb-3">
            <div className="days-container ">
              <ul className="days-tab">
                <li>
                  {' '}
                  <input
                    className="d-none"
                    type="radio"
                    id={keyContribution.id}
                    name="flexRadioDefault"
                    value={selectedKeyContribution}
                    checked={selectedKeyContribution}
                    onClick={() => {
                      handleContribution(true);
                    }}
                  />
                  <label htmlFor={keyContribution.id}>
                    {keyContribution.label}{' '}
                  </label>
                </li>

                <li>
                  <input
                    className="d-none"
                    type="radio"
                    id={keyContribution.id2}
                    name="flexRadioDefault"
                    value={!selectedKeyContribution}
                    checked={!selectedKeyContribution}
                    onClick={() => {
                      handleContribution(false);
                    }}
                  />
                  <label htmlFor={keyContribution.id2}>
                    {keyContribution.label2}{' '}
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Tabs>
          <ul className="tabs">
            {_.keys(selectedDSPMatrics).map((item) => (
              <li
                className={selectedTabMatrics === item ? 'active' : ''}
                onClick={() => handleOnMatricsTabChange(item)}
                role="presentation">
                {dspTabOptions[item]}
              </li>
            ))}
          </ul>
        </Tabs>

        {loader ? (
          <PageLoader
            component="performance-graph"
            color={Theme.orange}
            type="detail"
            width={40}
            height={40}
          />
        ) : data && data.length >= 1 ? (
          <>
            {renderContribution()}
            {renderContributionTablet()}
          </>
        ) : (
          <NoData>No data avilable!</NoData>
        )}
      </WhiteCard>
    </Wrapper>
  );
};

export default DSPKeyContributors;

DSPKeyContributors.defaultProps = {
  selectedKeyContribution: true,
  selectedAdManager: 'all',
  handleContribution: () => {},
  selectedDSPMatrics: {
    dspImpressions: true,
  },
  handleOnMatricsTabChange: () => {},
  selectedTabMatrics: 'dspImpression',
  data: null,
};

DSPKeyContributors.propTypes = {
  selectedKeyContribution: bool,
  selectedAdManager: string,
  handleContribution: func,
  selectedDSPMatrics: objectOf(Object),
  handleOnMatricsTabChange: func,
  selectedTabMatrics: string,
  data: arrayOf(Array),
  loader: bool.isRequired,
};

const Wrapper = styled.div`
  td {
    padding: 20px 10px 3px 0px !important;
  }
  .statusContainer {
    margin-top: 0px !important;
  }
`;

const NoData = styled.div`
  margin: 3em;
  text-align: center;
`;
