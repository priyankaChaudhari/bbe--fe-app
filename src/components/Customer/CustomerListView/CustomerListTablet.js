import React from 'react';

import PropTypes from 'prop-types';

import NoRecordFound from '../../../common/NoRecordFound';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  UpDowGrayArrow,
} from '../../../theme/images';
import { PATH_CUSTOMER_DETAILS } from '../../../constants';
import { CommonPagination, PageLoader, WhiteCard } from '../../../common';
import { CustomerListTabletView } from '../../../theme/CustomerListStyle';

export default function CustomerListTablet({
  data,
  history,
  count,
  pageNumber,
  handlePageChange,
  isLoading,
  showContractDetails,
  showPerformance,
  showAdPerformance,
  showDspAdPerformance,
  generateLogoCompanyNameAndGs,
  generateCompanyStatus,
  generatePerformance,
  showContractsList,
}) {
  const renderAdPerformanceDifference = (actualValue, grayArrow, matrics) => {
    let flag = '';
    let value = actualValue;
    if (value) {
      if (matrics === 'ACOS') {
        if (value.toString().includes('-')) {
          flag = 'green';
          value = value
            ? `${Number(value.toString().split('-')[1]).toFixed(2)} %`
            : '';
        } else {
          flag = 'red';
          value = value ? `${value.toFixed(2)} %` : '';
        }
      } else if (value.toString().includes('-')) {
        flag = 'red';
        value = value
          ? `${Number(value.toString().split('-')[1]).toFixed(2)} %`
          : '';
      } else {
        flag = 'green';
        value = value ? `${value.toFixed(2)} %` : '';
      }

      if (flag === 'red') {
        return (
          <>
            <span
              className={grayArrow ? 'decrease-rate grey' : 'decrease-rate'}>
              {' '}
              <img
                className="red-arrow"
                src={grayArrow ? UpDowGrayArrow : ArrowDownIcon}
                alt="arrow-up"
              />
              {value}
            </span>
          </>
        );
      }
      return (
        <>
          <span className={grayArrow ? 'increase-rate grey' : 'increase-rate'}>
            <img
              className="green-arrow"
              src={grayArrow ? UpDowGrayArrow : ArrowUpIcon}
              width="14px"
              alt="arrow-up"
            />
            {value}
          </span>
        </>
      );
    }
    return '';
  };
  const generateContractDetails = (item) => {
    return (
      <WhiteCard className="mt-2">
        {generateLogoCompanyNameAndGs(
          item,
          item && item.company_name,
          item && item.brand_growth_strategist,
        )}
        <div className="clear-fix" />
        <div className=" straight-line horizontal-line pt-3" />
        <div className="row">
          <div className="col-12 col-md-6 mt-3">
            <div className="label">Account type</div>
            <div className="label-info">
              {item && item.customer_account_type}
            </div>
          </div>
          <div className="col-12 col-md-6 mt-3">
            <div className="label">Status</div>
            <div className="label-info">
              {generateCompanyStatus(item.status)}
            </div>
          </div>
        </div>
        <div className=" straight-line horizontal-line pt-3 mb-3 " />
        {showContractsList(item)}
      </WhiteCard>
    );
  };
  const renderCustomerDetails = (item) => {
    if (showPerformance) {
      return (
        <WhiteCard className="mt-2">
          {generateLogoCompanyNameAndGs(
            item,
            item && item.company_name,
            item && item.brand_growth_strategist,
          )}
          <div className="clear-fix" />
          <div className=" straight-line horizontal-line pt-3 mb-3 " />

          <div className="row">
            <div className="col-6 pb-2">
              <div className="label">Revenue</div>
              <div className="label-info ">
                <>
                  {generatePerformance(
                    item &&
                      item.sales_performance &&
                      item.sales_performance.current_sum &&
                      item.sales_performance.current_sum.revenue,
                    2,
                    'isTwiceReplace',
                    '$',
                  )}
                  {renderAdPerformanceDifference(
                    item &&
                      item.sales_performance &&
                      item.sales_performance.difference_data &&
                      item.sales_performance.difference_data.revenue,
                    false,
                    'revenue',
                  )}
                </>
              </div>
            </div>
            <div className="col-6 pb-2">
              <div className="label">Units Sold</div>
              <div className="label-info ">
                <>
                  {generatePerformance(
                    item &&
                      item.sales_performance &&
                      item.sales_performance.current_sum &&
                      item.sales_performance.current_sum.units_sold,
                    0,
                    '',
                    '',
                  )}
                  {renderAdPerformanceDifference(
                    item &&
                      item.sales_performance &&
                      item.sales_performance.difference_data &&
                      item.sales_performance.difference_data.units_sold,
                    false,
                    'units_sold',
                  )}
                </>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="label">Traffic</div>
              <div className="label-info">
                <>
                  {generatePerformance(
                    item &&
                      item.sales_performance &&
                      item.sales_performance.current_sum &&
                      item.sales_performance.current_sum.traffic,
                    0,
                    '',
                    '',
                  )}
                  {renderAdPerformanceDifference(
                    item &&
                      item.sales_performance &&
                      item.sales_performance.difference_data &&
                      item.sales_performance.difference_data.traffic,
                    false,
                    'traffic',
                  )}
                </>
              </div>
            </div>

            <div className="col-6">
              <div className="label">Conversion</div>
              <div className="label-info">
                <>
                  {generatePerformance(
                    item &&
                      item.sales_performance &&
                      item.sales_performance.current_sum &&
                      item.sales_performance.current_sum.conversion,
                    2,
                    '',
                    '%',
                  )}
                  {renderAdPerformanceDifference(
                    item &&
                      item.sales_performance &&
                      item.sales_performance.difference_data &&
                      item.sales_performance.difference_data.conversion,
                    false,
                    'conversion',
                  )}
                </>
              </div>
            </div>

            {/* <div className="straight-line horizontal-line pt-3 " /> */}
          </div>
        </WhiteCard>
      );
    }
    if (showAdPerformance) {
      return (
        <WhiteCard className="mt-2">
          {generateLogoCompanyNameAndGs(
            item,
            item && item.company_name,
            item && item.ad_manager,
          )}
          <div className="clear-fix" />
          <div className=" straight-line horizontal-line pt-3 mb-3 " />

          <div className="row">
            <div className="col-6 pb-2">
              <div className="label">Ad Sales</div>
              <div className="label-info ">
                <>
                  {generatePerformance(
                    item &&
                      item.sponsored_ad_performance &&
                      item.sponsored_ad_performance.current_sum &&
                      item.sponsored_ad_performance.current_sum.ad_sales,
                    2,
                    '',
                    '$',
                  )}
                  {renderAdPerformanceDifference(
                    item &&
                      item.sponsored_ad_performance &&
                      item.sponsored_ad_performance.difference_data &&
                      item.sponsored_ad_performance.difference_data.ad_sales,
                    false,
                    'AdSales',
                  )}
                </>
              </div>
            </div>
            <div className="col-6 pb-2">
              <div className="label">Ad Spend</div>
              <div className="label-info ">
                <>
                  {generatePerformance(
                    item &&
                      item.sponsored_ad_performance &&
                      item.sponsored_ad_performance.current_sum &&
                      item.sponsored_ad_performance.current_sum.ad_spend,
                    2,
                    '',
                    '$',
                  )}
                  {renderAdPerformanceDifference(
                    item &&
                      item.sponsored_ad_performance &&
                      item.sponsored_ad_performance.difference_data &&
                      item.sponsored_ad_performance.difference_data.ad_spend,
                    true,
                    'AdSpend',
                  )}
                </>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="label">Ad Impressions</div>
              <div className="label-info">
                <>
                  {item &&
                  item.sponsored_ad_performance &&
                  item.sponsored_ad_performance.current_sum &&
                  item.sponsored_ad_performance.current_sum.impressions
                    ? item.sponsored_ad_performance.current_sum.impressions
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                  {renderAdPerformanceDifference(
                    item &&
                      item.sponsored_ad_performance &&
                      item.sponsored_ad_performance.difference_data &&
                      item.sponsored_ad_performance.difference_data.impressions,
                    false,
                    'AdImpressions',
                  )}
                </>
              </div>
            </div>

            <div className="col-6">
              <div className="label">Acos</div>
              <div className="label-info">
                <>
                  {item &&
                  item.sponsored_ad_performance &&
                  item.sponsored_ad_performance.current_sum &&
                  item.sponsored_ad_performance.current_sum.acos
                    ? `${item.sponsored_ad_performance.current_sum.acos.toFixed(
                        2,
                      )}%`
                    : '0%'}
                  {renderAdPerformanceDifference(
                    item &&
                      item.sponsored_ad_performance &&
                      item.sponsored_ad_performance.difference_data &&
                      item.sponsored_ad_performance.difference_data.acos,
                    false,
                    'ACOS',
                  )}
                </>
              </div>
            </div>
          </div>
        </WhiteCard>
      );
    }
    if (showDspAdPerformance) {
      return (
        <WhiteCard className="mt-2">
          {generateLogoCompanyNameAndGs(
            item,
            item && item.company_name,
            item && item.ad_manager,
          )}
          <div className="clear-fix" />
          <div className=" straight-line horizontal-line pt-3 mb-3 " />

          <div className="row">
            <div className="col-6 pb-2">
              <div className="label">IMPRESSIONS</div>
              <div className="label-info ">
                <>
                  {generatePerformance(
                    item.dsp_ad_performance &&
                      item.dsp_ad_performance.current_sum &&
                      item.dsp_ad_performance.current_sum.impressions,
                    2,
                    '',
                    '',
                  )}

                  {renderAdPerformanceDifference(
                    item &&
                      item.dsp_ad_performance &&
                      item.dsp_ad_performance.difference_data &&
                      item.dsp_ad_performance.difference_data.impressions,
                    false,
                    'impressions',
                  )}
                </>
              </div>
            </div>
            <div className="col-6 pb-2">
              <div className="label">DSP Spend</div>
              <div className="label-info ">
                <>
                  {generatePerformance(
                    item &&
                      item.dsp_ad_performance &&
                      item.dsp_ad_performance.current_sum &&
                      item.dsp_ad_performance.current_sum.dsp_spend,
                    2,
                    '',
                    '$',
                  )}
                  {renderAdPerformanceDifference(
                    item &&
                      item.dsp_ad_performance &&
                      item.dsp_ad_performance.difference_data &&
                      item.dsp_ad_performance.difference_data.dsp_spend,
                    true,
                    'DspSpend',
                  )}
                </>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="label">Total Product Sales</div>
              <div className="label-info">
                <>
                  {generatePerformance(
                    item &&
                      item.dsp_ad_performance &&
                      item.dsp_ad_performance.current_sum &&
                      item.dsp_ad_performance.current_sum.total_product_sales,
                    2,
                    '',
                    '$',
                  )}
                  {renderAdPerformanceDifference(
                    item &&
                      item.dsp_ad_performance &&
                      item.dsp_ad_performance.difference_data &&
                      item.dsp_ad_performance.difference_data
                        .total_product_sales,
                    false,
                    'totalProductSales',
                  )}
                </>
              </div>
            </div>

            <div className="col-6">
              <div className="label">ROAS</div>
              <div className="label-info">
                <>
                  {item &&
                  item.dsp_ad_performance &&
                  item.dsp_ad_performance.current_sum &&
                  item.dsp_ad_performance.current_sum.total_roas
                    ? item.dsp_ad_performance.current_sum.total_roas.toFixed(2)
                    : '0'}
                  {renderAdPerformanceDifference(
                    item &&
                      item.dsp_ad_performance &&
                      item.dsp_ad_performance.difference_data &&
                      item.dsp_ad_performance.difference_data.total_roas,
                    false,
                    'totalRoas',
                  )}
                </>
              </div>
            </div>
          </div>
        </WhiteCard>
      );
    }
    // for- view contract details
    if (showContractDetails) {
      return <>{generateContractDetails(item)}</>;
    }
    return <>{generateContractDetails(item)}</>;
  };

  return (
    <CustomerListTabletView
      showPerformance={
        !!(showPerformance || showAdPerformance || showDspAdPerformance)
      }>
      {data && data.length === 0 ? (
        <NoRecordFound />
      ) : (
        <div className="container-fluid">
          <div className="row cursor">
            {data &&
              data.map((item) => (
                <div
                  key={Math.random()}
                  className="col-md-6 col-12"
                  onClick={() =>
                    history.push(PATH_CUSTOMER_DETAILS.replace(':id', item.id))
                  }
                  role="presentation">
                  {isLoading.loader && isLoading.type === 'page' ? (
                    <PageLoader color="#FF5933" type="page" />
                  ) : (
                    renderCustomerDetails(item)
                  )}
                </div>
              ))}
          </div>

          {isLoading.loader && isLoading.type === 'page' ? (
            <PageLoader color="#FF5933" type="page" />
          ) : (
            <CommonPagination
              count={count}
              pageNumber={pageNumber}
              handlePageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </CustomerListTabletView>
  );
}

CustomerListTablet.defaultProps = {
  count: null,
  pageNumber: 1,
  handlePageChange: () => {},
  showContractDetails: true,
  showPerformance: false,
  showAdPerformance: false,
  showDspAdPerformance: false,
};

CustomerListTablet.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.shape({
    length: PropTypes.number,
    push: PropTypes.func,
  }).isRequired,
  count: PropTypes.number,
  pageNumber: PropTypes.number,
  handlePageChange: PropTypes.func,
  isLoading: PropTypes.shape({
    loader: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  showContractDetails: PropTypes.bool,
  showPerformance: PropTypes.bool,
  showAdPerformance: PropTypes.bool,
  showDspAdPerformance: PropTypes.bool,
  generateLogoCompanyNameAndGs: PropTypes.func.isRequired,
  generateCompanyStatus: PropTypes.func.isRequired,
  generatePerformance: PropTypes.func.isRequired,
  showContractsList: PropTypes.func.isRequired,
};
