/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import styled from 'styled-components';
import { arrayOf, bool, func, objectOf, string } from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import { useHistory } from 'react-router-dom';

import { PageLoader, Status, Table, Tabs, WhiteCard } from '../../../../common';
import {
  contributionColorSet,
  dspTabOptions,
} from '../../../../constants/AdManagerAdminDashboardConstants';
import {
  noGraphDataMessage,
  keyContributionHeaders,
  metricsCurrency,
} from '../../../../constants/CompanyPerformanceConstants';
import { TabletViewManager } from '../../../../theme/Global';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CompanyDefaultUser,
  UpDowGrayArrow,
} from '../../../../theme/images';
import Theme from '../../../../theme/Theme';
import { PATH_CUSTOMER_DETAILS } from '../../../../constants';

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
  selectedAdDF,
}) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const history = useHistory();
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
  }, [loader, selectedAdManager, selectedKeyContribution]);

  const returnMetricsValue = (value) => {
    if (metricsCurrency[selectedTabMatrics]) {
      console.log(
        'metricsCurrency[selectedDSPMatrics]',
        selectedDSPMatrics,
        metricsCurrency[selectedTabMatrics],
      );
      if (metricsCurrency[selectedTabMatrics].type === 'currency') {
        return `${currencySymbol}${value
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
      }
      if (metricsCurrency[selectedTabMatrics].type === 'percentage') {
        return `${value
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} %`;
      }
      return `${value
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} `;
    }
    return '0';
  };

  const renderAdPerformanceDifference = (actualValue, grayArrow, metrics) => {
    const value = actualValue;
    let selectedClass = '';
    let selectedArrow = '';

    if (value) {
      if (metrics === 'ACOS') {
        if (value.toString().includes('-')) {
          selectedClass = 'increase-rate';
          selectedArrow = ArrowUpIcon;
        } else {
          selectedClass = 'decrease-rate';
          selectedArrow = ArrowDownIcon;
        }
      } else if (grayArrow) {
        if (value.toString().includes('-')) {
          selectedClass = 'decrease-rate grey';
          selectedArrow = UpDowGrayArrow;
        } else {
          selectedClass = 'increase-rate grey';
          selectedArrow = UpDowGrayArrow;
        }
      } else if (value.toString().includes('-')) {
        selectedClass = 'decrease-rate';
        selectedArrow = ArrowDownIcon;
      } else {
        selectedClass = 'increase-rate';
        selectedArrow = ArrowUpIcon;
      }

      if (value.toString().includes('-')) {
        return (
          <>
            <div className={selectedClass}>
              {' '}
              <img className="red-arrow" src={selectedArrow} alt="arrow-up" />
              {`${Number(value.toString().split('-')[1]).toFixed(2)} %`}
            </div>
          </>
        );
      }

      return (
        <>
          <div className={selectedClass}>
            <img
              className="green-arrow"
              src={selectedArrow}
              width="14px"
              alt="arrow-up"
            />
            {value} %
          </div>
        </>
      );
    }
    return '';
  };

  const renderChangeValue = (itemData) => {
    let selectedArrow = '';
    let selectedClass = '';
    const value = itemData.change;
    if (selectedTabMatrics === 'dspSpend') {
      if (value.toString().includes('-')) {
        selectedClass = 'decrease-rate large grey';
        selectedArrow = UpDowGrayArrow;
      } else {
        selectedClass = 'increase-rate large grey';
        selectedArrow = UpDowGrayArrow;
      }
    } else if (value.toString().includes('-')) {
      selectedClass = 'decrease-rate large';
      selectedArrow = ArrowDownIcon;
    } else {
      selectedClass = 'increase-rate large';
      selectedArrow = ArrowUpIcon;
    }

    return itemData && itemData.change.toString().includes('-') ? (
      <div className={selectedClass}>
        {' '}
        <img className="red-arrow" src={selectedArrow} alt="arrow" />
        {itemData && itemData.change
          ? returnMetricsValue(Number(itemData.change.toString().split('-')[1]))
          : returnMetricsValue(0)}
      </div>
    ) : (
      <div className={selectedClass}>
        {' '}
        <img className="green-arrow" src={selectedArrow} alt="arrow" />
        {itemData && itemData.change
          ? returnMetricsValue(itemData.change)
          : returnMetricsValue(0)}
      </div>
    );
  };

  const renderTableHeader = () => {
    return selectedKeyContribution === false && selectedAdManager !== 'all' ? (
      <tr>
        <th width="40%" className="product-header">
          CUSTOMER
        </th>
        <th width="20%" className="product-header">
          Impressions
        </th>
        <th width="20%" className="product-header">
          DSP Spend
        </th>
        <th width="20%" className="product-header">
          {' '}
          Total Product Sales
        </th>
        <th width="60%" className="product-header">
          {' '}
          Total ROAS
        </th>
      </tr>
    ) : (
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
    );
  };

  const renderTableData = (itemData) => {
    return selectedKeyContribution === false && selectedAdManager !== 'all' ? (
      <tr
        key={itemData.id}
        className="cursor"
        onClick={() =>
          history.push(PATH_CUSTOMER_DETAILS.replace(':id', itemData.id))
        }>
        <td className="product-body">
          {' '}
          <img
            className="company-logo"
            src={
              itemData &&
              itemData.documents &&
              itemData.documents[0] &&
              Object.values(itemData.documents[0])
                ? Object.values(itemData.documents[0])[0]
                : CompanyDefaultUser
            }
            alt="logo"
          />
          <div className="company-name">
            {itemData && itemData.company_name}
          </div>
          <div className="status">
            {itemData && itemData.ad_manager && itemData.ad_manager.first_name}
            {itemData && itemData.ad_manager && itemData.ad_manager.last_name}
          </div>
        </td>
        <td className="product-body">
          {' '}
          {itemData &&
          itemData.dsp_ad_performance &&
          itemData.dsp_ad_performance.current_sum &&
          itemData.dsp_ad_performance.current_sum.impressions
            ? `${itemData.dsp_ad_performance.current_sum.impressions
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
            : `0`}
          {renderAdPerformanceDifference(
            itemData &&
              itemData.dsp_ad_performance &&
              itemData.dsp_ad_performance.difference_data &&
              itemData.dsp_ad_performance.difference_data.impressions,
            false,
            'impressions',
          )}
        </td>
        <td className="product-body">
          {itemData &&
          itemData.dsp_ad_performance &&
          itemData.dsp_ad_performance.current_sum &&
          itemData.dsp_ad_performance.current_sum.dsp_spend
            ? `${currencySymbol}${itemData.dsp_ad_performance.current_sum.dsp_spend
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
            : `${currencySymbol}0`}
          {renderAdPerformanceDifference(
            itemData &&
              itemData.dsp_ad_performance &&
              itemData.dsp_ad_performance.difference_data &&
              itemData.dsp_ad_performance.difference_data.dsp_spend,
            true,
            'DspSpend',
          )}
        </td>
        <td>
          {itemData &&
          itemData.dsp_ad_performance &&
          itemData.dsp_ad_performance.current_sum &&
          itemData.dsp_ad_performance.current_sum.total_product_sales
            ? `${currencySymbol}${itemData.dsp_ad_performance.current_sum.total_product_sales
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
            : `${currencySymbol}0`}
          {renderAdPerformanceDifference(
            itemData &&
              itemData.dsp_ad_performance &&
              itemData.dsp_ad_performance.difference_data &&
              itemData.dsp_ad_performance.difference_data.total_product_sales,
            false,
            'totalProductSales',
          )}
        </td>
        <td>
          {itemData &&
          itemData.dsp_ad_performance &&
          itemData.dsp_ad_performance.current_sum &&
          itemData.dsp_ad_performance.current_sum.total_roas
            ? `${itemData.dsp_ad_performance.current_sum.total_roas.toFixed(
                2,
              )}%`
            : '0%'}
          {renderAdPerformanceDifference(
            itemData &&
              itemData.dsp_ad_performance &&
              itemData.dsp_ad_performance.difference_data &&
              itemData.dsp_ad_performance.difference_data.total_roas,
            false,
            'totalRoas',
          )}
        </td>
      </tr>
    ) : (
      <tr
        key={itemData.customer_id}
        className="cursor"
        onClick={() =>
          history.push(
            PATH_CUSTOMER_DETAILS.replace(':id', itemData.customer_id),
          )
        }>
        <td className="product-body">
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
        </td>
        <td className="product-body">
          {itemData && itemData.current
            ? returnMetricsValue(itemData.current)
            : returnMetricsValue(0)}
        </td>
        <td className="product-body">
          {itemData && itemData.previous
            ? returnMetricsValue(itemData.previous)
            : returnMetricsValue(0)}
        </td>
        <td className="product-body"> {renderChangeValue(itemData)}</td>
        <td className="product-body">
          <Status
            label={itemData.contribution_bracket}
            backgroundColor={
              contributionColorSet[itemData.contribution_bracket]
            }
          />
        </td>
      </tr>
    );
  };

  const renderDesktopKeyContributions = () => {
    return (
      <Table className="mt-0 d-md-none d-sm-none d-lg-block">
        {renderTableHeader()}
        {data ? (
          <tbody>{data.map((item) => renderTableData(item))}</tbody>
        ) : (
          <NoData>{noGraphDataMessage}</NoData>
        )}
      </Table>
    );
  };

  const renderTabletKeyContributions = () => {
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
                      {renderChangeValue(itemData)}
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
        {selectedAdDF.value === 'custom' ? (
          <NoData>
            Top contributors cannot be calculated when using custom dates.
          </NoData>
        ) : (
          <>
            {selectedKeyContribution === false &&
            keyContribution.id2 === 'keyMetrics' ? null : (
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
            )}
            {loader ? (
              <PageLoader
                component="performance-graph"
                color={Theme.orange}
                type="detail"
                width={40}
                height={40}
              />
            ) : data ? (
              isDesktop ? (
                renderDesktopKeyContributions()
              ) : (
                renderTabletKeyContributions()
              )
            ) : (
              <NoData>{noGraphDataMessage}</NoData>
            )}
          </>
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
  selectedAdDF: {},
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
  selectedAdDF: objectOf(Object),
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
