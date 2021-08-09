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
import {
  keyContributionHeaders,
  noGraphDataMessage,
} from '../../../../constants/CompanyPerformanceConstants';
import { TabletViewManager } from '../../../../theme/Global';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CompanyDefaultUser,
} from '../../../../theme/images';

const DSPKeyContributors = ({
  selectedKeyContribution,
  selectedAdManager,
  handleContribution,
  selectedDSPMatrics,
  handleOnMatricsTabChange,
  selectedTabMatrics,
  data,
  loader,
  currencySymbol,
  isDesktop,
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

        {data && data.length >= 1 ? (
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
                        ? `${currencySymbol}${item.current
                            .toFixed(2)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                        : `${currencySymbol}0`}
                    </td>
                    <td className="product-body">
                      {' '}
                      {item && item.previous
                        ? `${currencySymbol}${item.previous
                            .toFixed(2)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                        : `${currencySymbol}0`}
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
                            ? `${currencySymbol}${Number(
                                item.change.toString().split('-')[1],
                              )
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                            : `${currencySymbol}0`}
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
                            ? `${currencySymbol}${item.change
                                .toFixed(2)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                            : `${currencySymbol}0`}
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
        ) : (
          <NoData>{noGraphDataMessage}</NoData>
        )}
      </Table>
    );
  };

  const renderContributionTablet = () => {
    return (
      <TabletViewManager className="d-lg-none d-md-block d-sm-block">
        <div className="container-fluid">
          <div className="row cursor">
            {data &&
              data.map((itemData) => (
                <div className="col-md-6 col-12 mt-4" role="presentation">
                  {' '}
                  <img
                    className="company-logo"
                    src={
                      itemData && itemData.document
                        ? itemData.document
                        : CompanyDefaultUser
                    }
                    alt="logo"
                  />
                  <div className="company-name">{itemData.customer_name}</div>
                  <div className="status">{itemData.ad_manager}</div>
                  <div className="clear-fix" />
                  <div className=" straight-line horizontal-line pt-3 mb-3 " />
                  <div className="row">
                    <div className="col-6 pb-3">
                      {' '}
                      <div className="label">This Period</div>
                      <div className="label-info ">
                        {itemData && itemData.current
                          ? `${currencySymbol}${itemData.current
                              .toFixed(2)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                          : `${currencySymbol}0`}
                      </div>
                    </div>
                    <div className="col-6 pb-3">
                      {' '}
                      <div className="label">Prev. Period</div>
                      <div className="label-info ">
                        {itemData && itemData.previous
                          ? `${currencySymbol}${itemData.previous
                              .toFixed(2)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                          : `${currencySymbol}0`}
                      </div>
                    </div>
                    <div className="col-6 pb-3">
                      {' '}
                      <div className="label">Change</div>
                      {itemData && itemData.change.toString().includes('-') ? (
                        <div className="decrease-rate large">
                          {' '}
                          <img
                            className="red-arrow"
                            src={ArrowDownIcon}
                            alt="arrow"
                          />{' '}
                          {itemData && itemData.change
                            ? `${currencySymbol}${Number(
                                itemData.change.toString().split('-')[1],
                              )
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                            : `${currencySymbol}0`}
                        </div>
                      ) : (
                        <div className="increase-rate large">
                          {' '}
                          <img
                            className="green-arrow"
                            src={ArrowUpIcon}
                            alt="arrow"
                          />{' '}
                          {itemData && itemData.change
                            ? `${currencySymbol}${itemData.change
                                .toFixed(2)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                            : `${currencySymbol}0`}
                        </div>
                      )}
                    </div>
                    <div className="col-6 pb-3">
                      {' '}
                      <div className="label">Contribution</div>
                      <Status
                        label={itemData.contribution_bracket}
                        backgroundColor={
                          contributionColorSet[itemData.contribution_bracket]
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
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
            <p className="black-heading-title mt-2 mb-4">
              {selectedKeyContribution
                ? keyContributionHeaders[keyContribution.id]
                : keyContributionHeaders[keyContribution.id2]}
            </p>
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
            color="#FF5933"
            type="detail"
            width={40}
            height={40}
          />
        ) : isDesktop ? (
          renderContribution()
        ) : data && data.length >= 1 ? (
          renderContributionTablet()
        ) : (
          <NoData>{noGraphDataMessage}</NoData>
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
  currencySymbol: '',
  isDesktop: false,
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
  currencySymbol: string,
  isDesktop: bool,
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
