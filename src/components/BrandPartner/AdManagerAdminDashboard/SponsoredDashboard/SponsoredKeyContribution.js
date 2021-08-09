import React from 'react';
import { arrayOf, bool, func, string } from 'prop-types';
import styled from 'styled-components';
import { Tabs, WhiteCard, Table, PageLoader, Status } from '../../../../common';
import { TabletViewManager } from '../../../../theme/Global';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CompanyDefaultUser,
  UpDowGrayArrow,
} from '../../../../theme/images/index';

import {
  keyContributionConstant,
  noGraphDataMessage,
} from '../../../../constants/CompanyPerformanceConstants';

const _ = require('lodash');

const SponsoredKeyContribution = ({
  keyContributionLoader,
  isDesktop,
  contributionData,
  selectedContributionOption,
  selectedAdManager,
  handleContributionOptions,
  selectedAdMetrics,
  selectedTabMetrics,
  handleOnMetricsTabChange,
}) => {
  const contributionColorSet = {
    High: '#E3F2D2',
    Medium: '#FDF3D7',
    Low: '#F4F6FC',
  };

  const tabOptions = {
    adSales: 'Ad Sales',
    adSpend: 'Ad Spend',
    adConversion: 'Ad Conversion Rate',
    impressions: 'Impressions',
    adCos: 'Acos',
    adRoas: 'Roas',
    adClicks: 'Clicks',
    adClickRate: 'Click Through Rate',
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

  const renderKeyContributionOptions = () => {
    const keyTabOptions =
      selectedAdManager === 'all'
        ? keyContributionConstant.noAdManagerSelected
        : keyContributionConstant.adManagerSelected;

    return (
      <div className="col-md-6 col-sm1-12  mb-3">
        <div className="days-container ">
          <ul className="days-tab">
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
                />
                <label htmlFor={item.id}>{item.label}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderKeyContributionTabs = () => {
    let selectedTab = selectedTabMetrics;
    if (selectedAdMetrics[selectedTabMetrics] === undefined) {
      const selctedArray = _.keys(selectedAdMetrics);
      // eslint-disable-next-line prefer-destructuring
      selectedTab = selctedArray[0];
      handleOnMetricsTabChange(selectedTab);
    }
    return (
      <Tabs>
        <ul className="tabs">
          {_.keys(selectedAdMetrics).map((item) => (
            <li
              className={selectedTab === item ? 'active' : ''}
              onClick={() => handleOnMetricsTabChange(item)}
              role="presentation">
              {tabOptions[item]}
            </li>
          ))}
        </ul>
      </Tabs>
    );
  };

  const renderTableHeader = () => {
    return selectedContributionOption === 'keyMetrics' ? (
      <tr>
        <th width="40%" className="product-header">
          CUSTOMER
        </th>
        <th width="20%" className="product-header">
          AD SALES
        </th>
        <th width="20%" className="product-header">
          AD SPEND
        </th>
        <th width="20%" className="product-header">
          {' '}
          AD IMPRESSIONS
        </th>
        <th width="60%" className="product-header">
          {' '}
          ACOS
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
      <tr>
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
          itemData.sponsored_ad_performance &&
          itemData.sponsored_ad_performance.current_sum &&
          itemData.sponsored_ad_performance.current_sum.ad_sales
            ? `$${itemData.sponsored_ad_performance.current_sum.ad_sales
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
            : '$0'}
          {renderAdPerformanceDifference(
            itemData &&
              itemData.sponsored_ad_performance &&
              itemData.sponsored_ad_performance.difference_data &&
              itemData.sponsored_ad_performance.difference_data.ad_sales,
            false,
            'AdSales',
          )}
        </td>
        <td className="product-body">
          {itemData &&
          itemData.sponsored_ad_performance &&
          itemData.sponsored_ad_performance.current_sum &&
          itemData.sponsored_ad_performance.current_sum.ad_spend
            ? `$${itemData.sponsored_ad_performance.current_sum.ad_spend
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
            : '$0'}
          {renderAdPerformanceDifference(
            itemData &&
              itemData.sponsored_ad_performance &&
              itemData.sponsored_ad_performance.difference_data &&
              itemData.sponsored_ad_performance.difference_data.ad_spend,
            true,
            'AdSpend',
          )}
        </td>
        <td>
          {itemData &&
          itemData.sponsored_ad_performance &&
          itemData.sponsored_ad_performance.current_sum &&
          itemData.sponsored_ad_performance.current_sum.impressions
            ? itemData.sponsored_ad_performance.current_sum.impressions
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : 0}
          {renderAdPerformanceDifference(
            itemData &&
              itemData.sponsored_ad_performance &&
              itemData.sponsored_ad_performance.difference_data &&
              itemData.sponsored_ad_performance.difference_data.impressions,
            false,
            'AdImpressions',
          )}
        </td>
        <td>
          {itemData &&
          itemData.sponsored_ad_performance &&
          itemData.sponsored_ad_performance.current_sum &&
          itemData.sponsored_ad_performance.current_sum.acos
            ? `${itemData.sponsored_ad_performance.current_sum.acos.toFixed(
                2,
              )}%`
            : '0%'}
          {renderAdPerformanceDifference(
            itemData &&
              itemData.sponsored_ad_performance &&
              itemData.sponsored_ad_performance.difference_data &&
              itemData.sponsored_ad_performance.difference_data.acos,
            false,
            'ACOS',
          )}
        </td>
      </tr>
    ) : (
      <tr>
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
          {' '}
          {itemData && itemData.current
            ? `$${itemData.current
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
            : '$0'}
        </td>
        <td className="product-body">
          {' '}
          {itemData && itemData.previous
            ? `$${itemData.previous
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
            : '$0'}
        </td>
        <td className="product-body">
          {' '}
          {itemData && itemData.change.toString().includes('-') ? (
            <div className="decrease-rate large">
              {' '}
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow" />
              {itemData && itemData.change
                ? `$${Number(itemData.change.toString().split('-')[1])
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                : '$0'}
            </div>
          ) : (
            <div className="increase-rate large">
              {' '}
              <img className="green-arrow" src={ArrowUpIcon} alt="arrow" />
              {itemData && itemData.change
                ? `$${itemData.change
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                : '$0'}
            </div>
          )}
        </td>
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
        {contributionData.length >= 1 ? (
          <tbody>
            {contributionData &&
              contributionData.map((item) => renderTableData(item))}
          </tbody>
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
            {contributionData &&
              contributionData.map((itemData) => (
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
                          ? `$${itemData.current
                              .toFixed(2)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                          : '$0'}
                      </div>
                    </div>
                    <div className="col-6 pb-3">
                      {' '}
                      <div className="label">Prev. Period</div>
                      <div className="label-info ">
                        {itemData && itemData.previous
                          ? `$${itemData.previous
                              .toFixed(2)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                          : '$0'}
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
                            ? `$${Number(
                                itemData.change.toString().split('-')[1],
                              )
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
                          />{' '}
                          {itemData && itemData.change
                            ? `$${itemData.change
                                .toFixed(2)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                            : '$0'}
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

  const renderKeyContributors = () => {
    return (
      <WhiteCard className="mb-3">
        <div className="row">
          <div className="col-md-6 col-sm1-12">
            {' '}
            <p className="black-heading-title mt-2 mb-4">Key Contributors</p>
          </div>
          {renderKeyContributionOptions()}
        </div>
        {selectedContributionOption !== 'keyMetrics'
          ? renderKeyContributionTabs()
          : ''}

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
      </WhiteCard>
    );
  };
  return renderKeyContributors();
};

export default SponsoredKeyContribution;

SponsoredKeyContribution.defaultProps = {
  keyContributionLoader: false,
  isDesktop: false,
  contributionData: {},
  selectedContributionOption: {},
  selectedAdManager: {},
  handleContributionOptions: () => {},
  selectedAdMetrics: {},
  selectedTabMetrics: {},
  handleOnMetricsTabChange: () => {},
};

SponsoredKeyContribution.propTypes = {
  keyContributionLoader: bool,
  isDesktop: bool,
  contributionData: arrayOf(Array),
  selectedContributionOption: string,
  selectedAdManager: string,
  handleContributionOptions: func,
  selectedAdMetrics: string,
  selectedTabMetrics: string,
  handleOnMetricsTabChange: func,
};

const NoData = styled.div`
  margin: 3em;
  text-align: center;
`;
