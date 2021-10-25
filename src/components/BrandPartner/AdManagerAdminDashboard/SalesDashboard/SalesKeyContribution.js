import React from 'react';

import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { arrayOf, bool, func, string, objectOf, number } from 'prop-types';

import { TabletViewManager } from '../../../../theme/Global';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CompanyDefaultUser,
  UpDowGrayArrow,
} from '../../../../theme/images';
import {
  keyContributionConstant,
  noGraphDataMessage,
  keyContributionHeaders,
  metricsCurrency,
  PATH_CUSTOMER_DETAILS,
} from '../../../../constants';
import {
  Tabs,
  WhiteCard,
  Table,
  PageLoader,
  Status,
  NoData,
  ToggleButton,
  CommonPagination,
} from '../../../../common';

const SalesKeyContribution = ({
  keyContributionLoader,
  isDesktop,
  contributionData,
  selectedContributionOption,
  handleContributionOptions,
  selectedTabMetrics,
  handleOnMetricsTabChange,
  currencySymbol,
  selectedSalesDF,
  handlePageChange,
  pageNumber,
  count,
  isApiCall,
}) => {
  const history = useHistory();

  const contributionColorSet = {
    High: '#E3F2D2',
    Medium: '#FDF3D7',
    Low: '#F4F6FC',
  };

  const tabOptions = [
    { value: 'revenue', label: 'Total Sales' },
    { value: 'traffic', label: 'Traffic' },
    { value: 'conversion', label: 'Conversion' },
    { value: 'unitsSold', label: 'Units Sold' },
  ];

  const returnMetricsValue = (value) => {
    let decimalDigits = 2;
    if (
      selectedTabMetrics === 'adClicks' ||
      selectedTabMetrics === 'impressions' ||
      selectedTabMetrics === 'unitsSold' ||
      selectedTabMetrics === 'traffic'
    ) {
      decimalDigits = 0;
    }
    if (metricsCurrency[selectedTabMetrics]) {
      if (metricsCurrency[selectedTabMetrics].type === 'currency') {
        return `${currencySymbol}${value
          .toFixed(decimalDigits)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
      }
      if (metricsCurrency[selectedTabMetrics].type === 'percentage') {
        return `${value
          .toFixed(decimalDigits)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} %`;
      }
      return `${value
        .toFixed(decimalDigits)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} `;
    }
    return '0';
  };

  const renderAdPerformanceDifference = (value) => {
    if (value) {
      if (value.toString().includes('-')) {
        return (
          <>
            <div className="decrease-rate">
              {' '}
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-up" />
              {`${Number(value.toString().split('-')[1]).toFixed(2)} %`}
            </div>
          </>
        );
      }

      return (
        <>
          <div className="increase-rate">
            <img
              className="green-arrow"
              src={ArrowUpIcon}
              width="14px"
              alt="arrow-up"
            />
            {Number(value)} %
          </div>
        </>
      );
    }
    return '';
  };

  const renderKeyContributionOptions = () => {
    const keyTabOptions = keyContributionConstant.adManagerSelected;

    return (
      <div className="col-md-6 col-sm1-12  mb-3">
        <ToggleButton>
          <div className="days-container ">
            <ul className={isApiCall ? 'days-tab disabled' : 'days-tab'}>
              {keyTabOptions.map((item) => (
                <li key={item.id}>
                  {' '}
                  <input
                    className="d-none"
                    type="radio"
                    id={item.id}
                    name="flexRadioDefault2"
                    value={selectedContributionOption}
                    checked={item.id === selectedContributionOption}
                    onClick={() => handleContributionOptions(item.id)}
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
    const selectedTab = selectedTabMetrics;

    return (
      <Tabs>
        <ul className={isApiCall ? 'tabs disabled' : 'tabs'}>
          {tabOptions.map((item) => (
            <li
              key={item.value}
              className={selectedTab === item.value ? 'active' : ''}
              onClick={() => handleOnMetricsTabChange(item.value)}
              role="presentation">
              {item.label}
            </li>
          ))}
        </ul>
      </Tabs>
    );
  };

  const renderChangeValue = (itemData) => {
    let selectedArrow = '';
    let selectedClass = '';
    const value = itemData.change;
    if (selectedTabMetrics === 'adSpend') {
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
    return selectedContributionOption === 'keyMetrics' ? (
      <thead>
        <tr>
          <th width="38%" className="product-header">
            CUSTOMER
          </th>
          <th width="18%" className="product-header">
            TOTAL SALES
          </th>
          <th width="18%" className="product-header">
            TRAFFIC
          </th>
          <th width="18%" className="product-header">
            {' '}
            CONVERSION
          </th>
          <th width="28%" className="product-header">
            {' '}
            UNITS SOLD
          </th>
        </tr>
      </thead>
    ) : (
      <thead>
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
      </thead>
    );
  };

  const renderTableData = (itemData) => {
    return selectedContributionOption === 'keyMetrics' ? (
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
            {itemData &&
            itemData.brand_growth_strategist &&
            itemData.brand_growth_strategist.length === 0
              ? ''
              : `${
                  itemData &&
                  itemData.brand_growth_strategist &&
                  itemData.brand_growth_strategist.first_name
                }
            ${
              itemData &&
              itemData.brand_growth_strategist &&
              itemData.brand_growth_strategist.last_name
            }`}
          </div>
        </td>
        <td className="product-body">
          {' '}
          {itemData &&
          itemData.sales_performance &&
          itemData.sales_performance.current_sum &&
          itemData.sales_performance.current_sum.revenue
            ? `${currencySymbol}${itemData.sales_performance.current_sum.revenue
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
            : `${currencySymbol}0`}
          {renderAdPerformanceDifference(
            itemData &&
              itemData.sales_performance &&
              itemData.sales_performance.difference_data &&
              itemData.sales_performance.difference_data.revenue,
          )}
        </td>
        <td className="product-body">
          {itemData &&
          itemData.sales_performance &&
          itemData.sales_performance.current_sum &&
          itemData.sales_performance.current_sum.traffic
            ? `${itemData.sales_performance.current_sum.traffic
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
            : `0`}
          {renderAdPerformanceDifference(
            itemData &&
              itemData.sales_performance &&
              itemData.sales_performance.difference_data &&
              itemData.sales_performance.difference_data.traffic,
          )}
        </td>
        <td>
          {itemData &&
          itemData.sales_performance &&
          itemData.sales_performance.current_sum &&
          itemData.sales_performance.current_sum.conversion
            ? `${Number(
                itemData.sales_performance.current_sum.conversion
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
              )}%`
            : '0%'}
          {renderAdPerformanceDifference(
            itemData &&
              itemData.sales_performance &&
              itemData.sales_performance.difference_data &&
              itemData.sales_performance.difference_data.conversion,
          )}
        </td>
        <td>
          {itemData &&
          itemData.sales_performance &&
          itemData.sales_performance.current_sum &&
          itemData.sales_performance.current_sum.units_sold
            ? `${itemData.sales_performance.current_sum.units_sold.toFixed(0)}`
            : '0'}
          {renderAdPerformanceDifference(
            itemData &&
              itemData.sales_performance &&
              itemData.sales_performance.difference_data &&
              itemData.sales_performance.difference_data.units_sold,
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
      <>
        <Table className="mt-0 ">
          {renderTableHeader()}
          {contributionData.length >= 1 ? (
            <>
              <tbody>
                {contributionData &&
                  contributionData.map((item) => renderTableData(item))}
              </tbody>
            </>
          ) : null}
        </Table>
        {!contributionData ||
        (contributionData && contributionData.length === 0) ? (
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
              {contributionData &&
                contributionData.map((itemData) => (
                  <div
                    className="col-md-6 col-12 mt-4"
                    role="presentation"
                    key={itemData.id}
                    onClick={() =>
                      history.push(
                        PATH_CUSTOMER_DETAILS.replace(':id', itemData.id),
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
                      itemData.brand_growth_strategist &&
                      itemData.brand_growth_strategist.length === 0
                        ? ''
                        : `${
                            itemData &&
                            itemData.brand_growth_strategist &&
                            itemData.brand_growth_strategist.first_name
                          }
            ${
              itemData &&
              itemData.brand_growth_strategist &&
              itemData.brand_growth_strategist.last_name
            }`}
                    </div>
                    <div className="clear-fix" />
                    <div className=" straight-line horizontal-line pt-3 mb-3 " />
                    <div className="row">
                      <div className="col-6 pb-3">
                        {' '}
                        <div className="label">Total Sales</div>
                        <div className="label-info ">
                          {itemData &&
                          itemData.sales_performance &&
                          itemData.sales_performance.current_sum &&
                          itemData.sales_performance.current_sum.revenue
                            ? `${currencySymbol}${itemData.sales_performance.current_sum.revenue
                                .toFixed(2)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                            : `${currencySymbol}0`}
                          {renderAdPerformanceDifference(
                            itemData &&
                              itemData.sales_performance &&
                              itemData.sales_performance.difference_data &&
                              itemData.sales_performance.difference_data
                                .revenue,
                          )}
                        </div>
                      </div>
                      <div className="col-6 pb-3">
                        {' '}
                        <div className="label">Traffic</div>
                        <div className="label-info ">
                          {itemData &&
                          itemData.sales_performance &&
                          itemData.sales_performance.current_sum &&
                          itemData.sales_performance.current_sum.traffic
                            ? `${itemData.sales_performance.current_sum.traffic
                                .toFixed(0)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                            : `0`}
                          {renderAdPerformanceDifference(
                            itemData &&
                              itemData.sales_performance &&
                              itemData.sales_performance.difference_data &&
                              itemData.sales_performance.difference_data
                                .traffic,
                          )}
                        </div>
                      </div>
                      <div className="col-6 pb-3">
                        {' '}
                        <div className="label">Conversion</div>
                        <div className="label-info ">
                          {itemData &&
                          itemData.sales_performance &&
                          itemData.sales_performance.current_sum &&
                          itemData.sales_performance.current_sum.conversion
                            ? `${Number(
                                itemData.sales_performance.current_sum.conversion
                                  .toFixed(2)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                              )}%`
                            : '0%'}
                          {renderAdPerformanceDifference(
                            itemData &&
                              itemData.sales_performance &&
                              itemData.sales_performance.difference_data &&
                              itemData.sales_performance.difference_data
                                .conversion,
                          )}
                        </div>
                      </div>
                      <div className="col-6 pb-3">
                        {' '}
                        <div className="label">Units Sold</div>
                        <div className="label-info ">
                          {itemData &&
                          itemData.sales_performance &&
                          itemData.sales_performance.current_sum &&
                          itemData.sales_performance.current_sum.units_sold
                            ? `${itemData.sales_performance.current_sum.units_sold.toFixed(
                                0,
                              )}`
                            : '0'}
                          {renderAdPerformanceDifference(
                            itemData &&
                              itemData.sales_performance &&
                              itemData.sales_performance.difference_data &&
                              itemData.sales_performance.difference_data
                                .units_sold,
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
      <TabletViewManager className="d-lg-none d-md-block d-sm-block">
        <div className="container-fluid">
          <div className="row cursor">
            {contributionData &&
              contributionData.map((itemData) => (
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

  const renderKeyContributors = () => {
    return (
      <WhiteCard className="mb-3">
        <div className="row">
          <div className="col-md-6 col-sm1-12">
            {' '}
            <p className="black-heading-title mt-2 mb-4">
              {keyContributionHeaders[selectedContributionOption]}
            </p>
          </div>
          {renderKeyContributionOptions()}
        </div>
        {selectedSalesDF.value === 'custom' &&
        selectedContributionOption !== 'keyMetrics' ? (
          <NoData>
            Top contributors cannot be calculated when using custom dates.
          </NoData>
        ) : (
          <>
            {selectedContributionOption !== 'keyMetrics'
              ? renderKeyContributionTabs()
              : null}

            {keyContributionLoader ? (
              <PageLoader
                component="performance-graph"
                color="#FF5933"
                type="detail"
                width={40}
                height={40}
              />
            ) : isDesktop ? (
              renderDesktopKeyContributions()
            ) : contributionData.length >= 1 ? (
              renderTabletKeyContributions()
            ) : (
              <NoData>{noGraphDataMessage}</NoData>
            )}

            {selectedContributionOption === 'keyMetrics' &&
            contributionData.length >= 1 ? (
              <CommonPagination
                count={count}
                pageNumber={pageNumber}
                handlePageChange={handlePageChange}
              />
            ) : null}
          </>
        )}
      </WhiteCard>
    );
  };

  return <Wrapper>{renderKeyContributors()}</Wrapper>;
};

export default SalesKeyContribution;

SalesKeyContribution.defaultProps = {
  keyContributionLoader: false,
  isDesktop: false,
  isApiCall: false,
  currencySymbol: '',
  contributionData: {},
  selectedContributionOption: {},
  selectedTabMetrics: {},
  selectedSalesDF: {},
  count: null,
  pageNumber: 1,
  handleOnMetricsTabChange: () => {},
  handleContributionOptions: () => {},
  handlePageChange: () => {},
};

SalesKeyContribution.propTypes = {
  keyContributionLoader: bool,
  isDesktop: bool,
  isApiCall: bool,
  selectedContributionOption: string,
  selectedTabMetrics: string,
  currencySymbol: string,
  count: number,
  pageNumber: number,
  selectedSalesDF: objectOf(Object),
  contributionData: arrayOf(Array),
  handleContributionOptions: func,
  handleOnMetricsTabChange: func,
  handlePageChange: func,
};

const Wrapper = styled.div`
  td {
    padding: 20px 10px 3px 0px !important;
  }
  .statusContainer {
    margin-top: 0px !important;
  }
`;
