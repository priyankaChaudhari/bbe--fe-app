/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';

import { DashboardCard, BrandPartnerDashboard } from '../../theme/Global';
import { PageLoader, WhiteCard } from '../../common';
import { getDspPacingData } from '../../api';

import {
  ArrowUpIcon,
  ArrowDownIcon,
  CloseIcon,
  CompanyDefaultUser,
  UpDowGrayArrow,
  ArrowRightBlackIcon,
} from '../../theme/images';
import { PATH_CUSTOMER_DETAILS } from '../../constants';
import NoRecordFound from '../../common/NoRecordFound';
import DspAdPacing from './DspAdPacing';

const customDspAdPacingStyles = {
  content: {
    top: '50%',
    right: '0px',
    bottom: 'auto',
    maxWidth: '600px ',
    width: '100%',
    maxHeight: '100%',
    overlay: ' {zIndex: 1000}',
    inset: '0% 0% 0% auto',
    marginRight: '0',
    borderRadius: '1px !important',
    // transform: 'translate(-50%, -50%)',
  },
};

function DspAdDashboard({ isLoading, data }) {
  const history = useHistory();
  const [showDspAdPacingModal, setShowDspAdPacingModal] = useState({
    show: false,
  });
  const [dspData, setDspData] = useState({});
  const [isDspPacingLoading, setDspPacingLoading] = useState({
    loader: false,
    type: 'modal',
  });

  const getDspData = (id) => {
    setDspData({});
    getDspPacingData(id).then((res) => {
      setDspPacingLoading({ loader: true, type: 'modal' });
      if (res && res.status === 200) {
        setDspPacingLoading({ loader: false, type: 'modal' });
        setDspData(res.data);
      }
    });
  };

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
          <div className={grayArrow ? 'increase-rate grey' : 'increase-rate'}>
            <img
              className="green-arrow"
              src={grayArrow ? UpDowGrayArrow : ArrowUpIcon}
              width="14px"
              alt="arrow-up"
            />
            {value}
          </div>
        </>
      );
    }
    return <div className="perentage-value down">N/A</div>;
  };

  const renderDspAdPacingModal = () => {
    return (
      <Modal
        isOpen={showDspAdPacingModal.show}
        style={customDspAdPacingStyles}
        ariaHideApp={false}
        onRequestClose={(e) => {
          setShowDspAdPacingModal({ show: false });
          e.stopPropagation();
        }}
        contentLabel="Add team modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={(e) => {
            setShowDspAdPacingModal({ show: false });
            e.stopPropagation();
          }}
          role="presentation"
        />
        <DspAdPacing
          dspData={dspData}
          isDspPacingLoading={isDspPacingLoading}
        />
      </Modal>
    );
  };

  const onPacingClick = (e, id) => {
    getDspData(id);
    setShowDspAdPacingModal({ show: true });
    e.stopPropagation();
  };

  return (
    <BrandPartnerDashboard>
      <DashboardCard>
        <div className="dashboard-body">
          {isLoading.loader && isLoading.type === 'page' ? (
            <PageLoader component="modal" color="#FF5933" type="page" />
          ) : (
            <div className="row">
              {data && data.length === 0 ? (
                <NoRecordFound type="brand" />
              ) : (
                <>
                  {renderDspAdPacingModal()}
                  {data &&
                    data.map((item) => (
                      <div
                        key={item.id}
                        className="col-lg-3 mb-4 col-md-6 col-sm-12 "
                        role="presentation">
                        <WhiteCard
                          className="cursor"
                          onClick={() =>
                            history.push(
                              PATH_CUSTOMER_DETAILS.replace(':id', item.id),
                              'adManager',
                            )
                          }>
                          <img
                            className="company-logo"
                            src={
                              item &&
                              item.documents &&
                              item.documents[0] &&
                              Object.values(item.documents[0])
                                ? Object.values(item.documents[0])[0]
                                : CompanyDefaultUser
                            }
                            alt="logo"
                          />

                          <div
                            className="company-name"
                            title={item && item.company_name}>
                            {item && item.company_name}
                          </div>
                          <div
                            className="status"
                            title={
                              item && item.category && item.category.label
                            }>
                            {item && item.category && item.category.label}
                          </div>
                          <div className="row">
                            {/* <div className="straight-line horizontal-line spacing " />
                        <div className="col-12 pt-1 pb-1">
                          <img
                            className="solid-icon "
                            src={
                              item &&
                              item.contract &&
                              item.contract[0] &&
                              (item.contract[0].contract_type === 'One Time' ||
                                item.contract[0].contract_type === 'one time')
                                ? ServiceIcon
                                : RecurringIcon
                            }
                            alt=""
                          />
                          <p className="black-heading-title mt-0 mb-0 capitalize">
                            {item &&
                              item.contract &&
                              item.contract[0] &&
                              item.contract[0].contract_type}{' '}
                            Service Agreement
                          </p>

                          <ul className="recurring-contact ">
                            <li>
                              <p className="basic-text ">
                                {item &&
                                  item.contract &&
                                  item.contract[0] &&
                                  item.contract[0].length}
                              </p>
                            </li>

                            <li>
                              {' '}
                              <div className="dot" />
                              <p className="basic-text ">
                                Started{' '}
                                {item &&
                                item.contract &&
                                item.contract[0] &&
                                item.contract[0].start_date
                                  ? dayjs(item.contract[0].start_date).format(
                                      'MMM DD, YYYY',
                                    )
                                  : ''}
                              </p>
                            </li>
                          </ul>
                        </div> */}

                            {item && item.dsp_ad_pacing ? (
                              <>
                                <div className="straight-line horizontal-line spacing " />
                                <div className="col-12">
                                  <div className="card-label">
                                    Monthly DSP Budget
                                  </div>
                                  <div
                                    className="monthly-dsp-budget"
                                    role="presentation"
                                    onClick={(e) => onPacingClick(e, item.id)}>
                                    <span className="currency-amount on-track">
                                      $
                                      {item &&
                                        item.dsp_ad_pacing &&
                                        item.dsp_ad_pacing.total_budget
                                          .toFixed(2)
                                          .toString()
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ',',
                                          )}
                                    </span>{' '}
                                    <span className="dot" />
                                    &nbsp;&nbsp;{' '}
                                    <span
                                      className={
                                        item &&
                                        item.dsp_ad_pacing &&
                                        item.dsp_ad_pacing.dsp_pacing_flag === 0
                                          ? 'on-track'
                                          : ''
                                      }>
                                      {item &&
                                      item.dsp_ad_pacing &&
                                      item.dsp_ad_pacing.dsp_pacing_flag === 0
                                        ? 'On Track'
                                        : item &&
                                          item.dsp_ad_pacing &&
                                          item.dsp_ad_pacing.dsp_pacing_flag ===
                                            1
                                        ? 'Overspending'
                                        : 'Underspending'}{' '}
                                    </span>
                                    <img
                                      className="right-arrow-icon"
                                      width="18px"
                                      src={ArrowRightBlackIcon}
                                      alt="arrow"
                                    />
                                  </div>
                                </div>
                              </>
                            ) : (
                              ''
                            )}
                          </div>

                          <div className="straight-line horizontal-line spacing " />
                          <div className="row">
                            <div className="col-6">
                              <div className="card-label">IMPRESSIONS</div>

                              {renderAdPerformanceDifference(
                                item &&
                                  item.dsp_ad_performance &&
                                  item.dsp_ad_performance.difference_data &&
                                  item.dsp_ad_performance.difference_data
                                    .impressions,
                                false,
                                'impressions',
                              )}
                            </div>
                            <div className="col-6 text-right">
                              <div className="sold-price ">
                                {item &&
                                item.dsp_ad_performance &&
                                item.dsp_ad_performance.current_sum &&
                                item.dsp_ad_performance.current_sum.impressions
                                  ? `$${item.dsp_ad_performance.current_sum.impressions
                                      .toFixed(2)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                                  : '$0'}
                              </div>
                              <div className="vs">
                                vs{' '}
                                {item &&
                                item.dsp_ad_performance &&
                                item.dsp_ad_performance.previous_sum &&
                                item.dsp_ad_performance.previous_sum.impressions
                                  ? `$${item.dsp_ad_performance.previous_sum.impressions
                                      .toFixed(2)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                                  : '$0'}
                              </div>
                            </div>
                            <div className="straight-line horizontal-line spacing" />
                            <div className="col-6">
                              <div className="card-label">DSP Spend</div>
                              {renderAdPerformanceDifference(
                                item &&
                                  item.dsp_ad_performance &&
                                  item.dsp_ad_performance.difference_data &&
                                  item.dsp_ad_performance.difference_data
                                    .dsp_spend,
                                true,
                                'dsp_spend',
                              )}
                            </div>
                            <div className="col-6 text-right">
                              <div className="sold-price ">
                                {item &&
                                item.dsp_ad_performance &&
                                item.dsp_ad_performance.current_sum &&
                                item.dsp_ad_performance.current_sum.dsp_spend
                                  ? `$${item.dsp_ad_performance.current_sum.dsp_spend
                                      .toFixed(2)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                                  : '$0'}
                              </div>
                              <div className="vs">
                                vs{' '}
                                {item &&
                                item.dsp_ad_performance &&
                                item.dsp_ad_performance.previous_sum &&
                                item.dsp_ad_performance.previous_sum.dsp_spend
                                  ? `$${item.dsp_ad_performance.previous_sum.dsp_spend
                                      .toFixed(2)
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                                  : '$0'}
                              </div>
                            </div>
                            <div className="straight-line horizontal-line spacing" />

                            <div className="col-6">
                              <div className="card-label">
                                TOTAL PRODUCT SALES
                              </div>
                              {renderAdPerformanceDifference(
                                item &&
                                  item.dsp_ad_performance &&
                                  item.dsp_ad_performance.difference_data &&
                                  item.dsp_ad_performance.difference_data
                                    .total_product_sales,
                                false,
                                'total_product_sales',
                              )}
                            </div>
                            <div className="col-6 text-right">
                              <div className="sold-price ">
                                {item &&
                                item.dsp_ad_performance &&
                                item.dsp_ad_performance.current_sum &&
                                item.dsp_ad_performance.current_sum
                                  .total_product_sales
                                  ? item.dsp_ad_performance.current_sum.total_product_sales
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  : 0}
                              </div>
                              <div className="vs">
                                vs{' '}
                                {item &&
                                item.dsp_ad_performance &&
                                item.dsp_ad_performance.previous_sum &&
                                item.dsp_ad_performance.previous_sum
                                  .total_product_sales
                                  ? item.dsp_ad_performance.previous_sum.total_product_sales
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  : 0}
                              </div>
                            </div>

                            <div className="straight-line horizontal-line spacing" />
                            <div className="col-6">
                              <div className="card-label">TOTAL ROAS</div>
                              {renderAdPerformanceDifference(
                                item &&
                                  item.dsp_ad_performance &&
                                  item.dsp_ad_performance.difference_data &&
                                  item.dsp_ad_performance.difference_data
                                    .total_roas,
                                false,
                                'total_roas',
                              )}
                            </div>
                            <div className="col-6 text-right">
                              <div className="sold-price">
                                {item &&
                                item.dsp_ad_performance &&
                                item.dsp_ad_performance.current_sum &&
                                item.dsp_ad_performance.current_sum.total_roas
                                  ? `${item.dsp_ad_performance.current_sum.total_roas.toFixed(
                                      2,
                                    )}%`
                                  : '0%'}
                              </div>
                              <div className="vs">
                                vs{' '}
                                {item &&
                                item.dsp_ad_performance &&
                                item.dsp_ad_performance.previous_sum &&
                                item.dsp_ad_performance.previous_sum.total_roas
                                  ? `${item.dsp_ad_performance.previous_sum.total_roas.toFixed(
                                      2,
                                    )}%`
                                  : '0%'}
                              </div>
                            </div>
                          </div>
                        </WhiteCard>
                      </div>
                    ))}
                </>
              )}
            </div>
          )}
        </div>
      </DashboardCard>
    </BrandPartnerDashboard>
  );
}

export default DspAdDashboard;
