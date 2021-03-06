import React from 'react';

import _ from 'lodash';
import styled from 'styled-components';
import { arrayOf, bool, func, number, objectOf, string } from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import { useHistory } from 'react-router-dom';

import Theme from '../../../../theme/Theme';
import { TabletViewManager } from '../../../../theme/Global';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CompanyDefaultUser,
  UpDowGrayArrow,
} from '../../../../theme/images';
import {
  PATH_CUSTOMER_DETAILS,
  contributionColorSet,
  dspTabOptions,
  noGraphDataMessage,
  keyContributionHeaders,
  metricsCurrency,
  keyContributionConstant,
} from '../../../../constants';

import {
  PageLoader,
  Status,
  Table,
  Tabs,
  WhiteCard,
  ToggleButton,
  CommonPagination,
} from '../../../../common';

const DSPKeyContributors = ({
  selectedContributionOption,
  selectedManager,
  handleContribution,
  selectedDSPMatrics,
  handleOnMatricsTabChange,
  selectedTabMatrics,
  data,
  loader,
  currencySymbol,
  selectedAdDF,
  isAdManagerAdmin,
  isBGSAdmin,
  handlePageChange,
  pageNumber,
  count,
}) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const history = useHistory();

  const returnMetricsValue = (value) => {
    let decimalDigits = 2;
    if (selectedTabMatrics === 'dspImpressions') {
      decimalDigits = 0;
    }
    if (metricsCurrency[selectedTabMatrics]) {
      if (metricsCurrency[selectedTabMatrics].type === 'currency') {
        return `${currencySymbol}${value
          .toFixed(decimalDigits)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
      }
      if (metricsCurrency[selectedTabMatrics].type === 'percentage') {
        return `${value
          .toFixed(decimalDigits)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}%`;
      }
      return `${value
        .toFixed(decimalDigits)
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
      if (value && value.toString().includes('-')) {
        selectedClass = 'decrease-rate large grey';
        selectedArrow = UpDowGrayArrow;
      } else {
        selectedClass = 'increase-rate large grey';
        selectedArrow = UpDowGrayArrow;
      }
    } else if (value && value.toString().includes('-')) {
      selectedClass = 'decrease-rate large';
      selectedArrow = ArrowDownIcon;
    } else {
      selectedClass = 'increase-rate large';
      selectedArrow = ArrowUpIcon;
    }

    return itemData &&
      itemData.change &&
      itemData.change.toString().includes('-') ? (
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
    return selectedContributionOption === 'keyMetrics' ? (
      <tr>
        <th width="38%" className="product-header">
          CUSTOMER
        </th>
        <th width="18%" className="product-header">
          Impressions
        </th>
        <th width="18%" className="product-header">
          DSP Spend
        </th>
        <th width="18%" className="product-header">
          {' '}
          Total Product Sales
        </th>
        <th width="28%" className="product-header">
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
    return selectedContributionOption === 'keyMetrics' ? (
      <tr
        key={itemData.id}
        className="cursor"
        onClick={() =>
          history.push(
            PATH_CUSTOMER_DETAILS.replace(':id', itemData.id),
            'adManager',
          )
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
          <div className="company-name ">
            {itemData && itemData.company_name}
          </div>
          <div className="status">
            {itemData && itemData.ad_manager && itemData.ad_manager.length === 0
              ? ''
              : `${
                  itemData &&
                  itemData.ad_manager &&
                  itemData.ad_manager.first_name
                }
            ${
              itemData && itemData.ad_manager && itemData.ad_manager.last_name
            }`}
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
            'adManager',
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
          <div className="company-info-details">
            <div className="company-name">{itemData.customer_name}</div>
            <div className="status">{itemData.ad_manager}</div>
          </div>
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
      <>
        <Table className="mt-0">
          <thead>{renderTableHeader()}</thead>
          {data && data.length >= 1 ? (
            <tbody>{data.map((item) => renderTableData(item))}</tbody>
          ) : null}
        </Table>
        {!data ||
        (data && data.length === 0) ||
        (data && typeof data.result === 'object') ? (
          <NoData>{noGraphDataMessage}</NoData>
        ) : null}
      </>
    );
  };

  const renderTabletKeyContributions = () => {
    if (selectedContributionOption === 'keyMetrics') {
      return (
        <TabletViewManager className="d-lg-none d-md-block d-sm-block">
          <div className="container-fluid">
            <div className="row cursor">
              {data &&
                data.map((itemData) => (
                  <div
                    className="col-md-6 col-12 mt-4"
                    role="presentation"
                    key={itemData.id}
                    onClick={() =>
                      history.push(
                        PATH_CUSTOMER_DETAILS.replace(':id', itemData.id),
                        'adManager',
                      )
                    }>
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
                      {itemData &&
                      itemData.ad_manager &&
                      itemData.ad_manager.length === 0
                        ? ''
                        : `${
                            itemData &&
                            itemData.ad_manager &&
                            itemData.ad_manager.first_name
                          }${
                            itemData &&
                            itemData.ad_manager &&
                            itemData.ad_manager.last_name
                          }`}
                    </div>
                    <div className="clear-fix" />
                    <div className=" straight-line horizontal-line pt-3 mb-3 " />
                    <div className="row">
                      <div className="col-6 pb-3">
                        {' '}
                        <div className="label">Impressions</div>
                        <div className="label-info ">
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
                              itemData.dsp_ad_performance.difference_data
                                .impressions,
                            false,
                            'impressions',
                          )}
                        </div>
                      </div>
                      <div className="col-6 pb-3">
                        {' '}
                        <div className="label">dsp Spend</div>
                        <div className="label-info ">
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
                              itemData.dsp_ad_performance.difference_data
                                .dsp_spend,
                            true,
                            'DspSpend',
                          )}
                        </div>
                      </div>
                      <div className="col-6 pb-3">
                        {' '}
                        <div className="label">total Product Sales</div>
                        <div className="label-info ">
                          {itemData &&
                          itemData.dsp_ad_performance &&
                          itemData.dsp_ad_performance.current_sum &&
                          itemData.dsp_ad_performance.current_sum
                            .total_product_sales
                            ? `${currencySymbol}${itemData.dsp_ad_performance.current_sum.total_product_sales
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                            : `${currencySymbol}0`}
                          {renderAdPerformanceDifference(
                            itemData &&
                              itemData.dsp_ad_performance &&
                              itemData.dsp_ad_performance.difference_data &&
                              itemData.dsp_ad_performance.difference_data
                                .total_product_sales,
                            false,
                            'totalProductSales',
                          )}
                        </div>
                      </div>
                      <div className="col-6 pb-3">
                        {' '}
                        <div className="label">total Roas</div>
                        <div className="label-info ">
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
                              itemData.dsp_ad_performance.difference_data
                                .total_roas,
                            false,
                            'totalRoas',
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </TabletViewManager>
      );
    }
    return (
      <>
        {data && data.length >= 1 ? (
          <TabletViewManager className="d-lg-none d-md-block d-sm-block">
            <div className="container-fluid">
              <div className="row cursor">
                {data &&
                  data.map((itemData) => (
                    <div
                      className="col-md-6 col-12 mt-4"
                      role="presentation"
                      key={itemData.customer_id}
                      onClick={() =>
                        history.push(
                          PATH_CUSTOMER_DETAILS.replace(
                            ':id',
                            itemData.customer_id,
                          ),
                          'adManager',
                        )
                      }>
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
                      <div className="company-name">
                        {itemData.customer_name}
                      </div>
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
                              contributionColorSet[
                                itemData.contribution_bracket
                              ]
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabletViewManager>
        ) : (
          <NoData>{noGraphDataMessage}</NoData>
        )}
      </>
    );
  };

  const renderKeyContributionOptions = () => {
    const keyTabOptions =
      (isAdManagerAdmin || isBGSAdmin) && selectedManager === 'all'
        ? keyContributionConstant.noManagerSelected
        : keyContributionConstant.managerSelected;

    return (
      <div className="col-md-6 col-sm1-12  mb-3">
        <ToggleButton>
          <div className="days-container">
            <ul className={loader ? 'days-tab disabled' : 'days-tab'}>
              {keyTabOptions.map((item) => (
                <li key={item.id}>
                  {' '}
                  <input
                    className="d-none"
                    type="radio"
                    id={item.id}
                    name="flexRadioDefault3"
                    value={selectedContributionOption}
                    checked={item.id === selectedContributionOption}
                    onClick={() => handleContribution(item.id)}
                    onChange={() => {}}
                  />
                  <label htmlFor={item.id}>{item.label}</label>
                </li>
              ))}
            </ul>
          </div>
        </ToggleButton>
      </div>
    );
  };

  const renderKeyContributionTabs = () => {
    let selectedTab = selectedTabMatrics;
    if (selectedDSPMatrics[selectedTabMatrics] === undefined) {
      const selctedArray = _.keys(selectedDSPMatrics);
      // eslint-disable-next-line prefer-destructuring
      selectedTab = selctedArray[0];
      handleOnMatricsTabChange(selectedTab);
    }
    return (
      <Tabs>
        <ul className={loader ? 'tabs disabled' : 'tabs'}>
          {_.keys(selectedDSPMatrics).map((item) => (
            <li
              key={item}
              className={selectedTabMatrics === item ? 'active' : ''}
              onClick={() => handleOnMatricsTabChange(item)}
              role="presentation">
              {dspTabOptions[item]}
            </li>
          ))}
        </ul>
      </Tabs>
    );
  };

  return (
    <Wrapper>
      <WhiteCard className="mb-3">
        <div className="row">
          <div className="col-md-6 col-sm1-12">
            <p className="black-heading-title mt-2 mb-4">
              {keyContributionHeaders[selectedContributionOption]}
            </p>
          </div>
          {renderKeyContributionOptions()}
        </div>
        {selectedAdDF.value === 'custom' &&
        selectedContributionOption !== 'keyMetrics' ? (
          <NoData>
            Top contributors cannot be calculated when using custom dates.
          </NoData>
        ) : (
          <>
            {selectedContributionOption !== 'keyMetrics'
              ? renderKeyContributionTabs()
              : null}
            {loader ? (
              <PageLoader
                component="performance-graph"
                color={Theme.orange}
                type="detail"
                width={40}
                height={40}
              />
            ) : isDesktop ? (
              renderDesktopKeyContributions()
            ) : (
              renderTabletKeyContributions()
            )}
            {selectedContributionOption === 'keyMetrics' &&
            data &&
            data.length >= 1 ? (
              <div className="mt-0">
                <CommonPagination
                  count={count}
                  pageNumber={pageNumber}
                  handlePageChange={handlePageChange}
                />
              </div>
            ) : null}
          </>
        )}
      </WhiteCard>
    </Wrapper>
  );
};

export default DSPKeyContributors;

DSPKeyContributors.defaultProps = {
  isAdManagerAdmin: false,
  isBGSAdmin: false,
  selectedDSPMatrics: {
    dspImpressions: true,
  },
  selectedManager: '',
  selectedContributionOption: '',
  currencySymbol: '',
  selectedTabMatrics: 'dspImpression',
  data: null,
  selectedAdDF: {},
  count: null,
  pageNumber: 1,
  handleOnMatricsTabChange: () => {},
  handlePageChange: () => {},
  handleContribution: () => {},
};

DSPKeyContributors.propTypes = {
  isAdManagerAdmin: bool,
  isBGSAdmin: bool,
  loader: bool.isRequired,
  selectedManager: string,
  selectedContributionOption: string,
  selectedTabMatrics: string,
  currencySymbol: string,
  count: number,
  pageNumber: number,
  selectedDSPMatrics: objectOf(Object),
  data: arrayOf(Array),
  selectedAdDF: objectOf(Object),
  handlePageChange: func,
  handleOnMatricsTabChange: func,
  handleContribution: func,
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
