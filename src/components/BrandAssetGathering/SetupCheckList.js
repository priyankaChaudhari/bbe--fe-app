/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import Theme from '../../theme/Theme';
import { Button, PageLoader, WhiteCard } from '../../common';
import {
  DspOnlyIcon,
  RecurringIcon,
  ServiceIcon,
  SignatureIcon,
  WhiteArrowRight,
  CircleBellIcon,
} from '../../theme/images';
import { getAgreementList, getAssigneeCount } from '../../api';
import {
  PATH_CHOOSE_BRAND_DELEGATE,
  PATH_UPLOAD_PRODUCT_ASSET,
} from '../../constants';

// import { UploadProductAsset } from '../../components/Customer/UploadProductAsset';

export default function SetupCheckList({ id, brandId, productAssetsId }) {
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [agreementData, setAgreementData] = useState({
    data: [],
    count: null,
    assigneeCount: null,
  });

  useEffect(() => {
    setIsLoading({ loader: true, type: 'page' });
    getAgreementList(id).then((response) => {
      setAgreementData({
        data: response.data && response.data.results,
        count: response.data && response.data.count,
      });
      getAssigneeCount(id).then((res) => {
        setAgreementData({
          data: response.data && response.data.results,
          count: response.data && response.data.count,
          assigneeCount: res && res.data,
        });
        setIsLoading({ loader: false, type: 'page' });
      });
    });
  }, [id]);

  const checkList = [
    {
      label: 'Sign Contract',
      active: true,
      subtitle: '1/1 Step completed by you',
      property: '',
    },
    {
      label: 'Complete Account Setup',
      active: true,
      subtitle:
        agreementData.assigneeCount && agreementData.assigneeCount.re_assigned
          ? `${
              agreementData.assigneeCount &&
              agreementData.assigneeCount.total_steps
            }/3 Steps completed by you and ${
              agreementData.assigneeCount.re_assigned
            } other`
          : `${
              agreementData.assigneeCount &&
              agreementData.assigneeCount.total_steps
            }/3 Steps completed by you`,
      property: 'mt-3',
    },
  ];

  const countDays = (value) => {
    const date1 = new Date();
    const date2 = new Date(value);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="col-lg-6  col-12 mb-3">
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader
          component="agrement-details"
          color="#FF5933"
          type="detail"
          width={40}
          height={40}
        />
      ) : (
        <>
          <fieldset className="shape-without-border extra-radius">
            <div className="row mb-3">
              <div className="col-lg-6 col-md-6 col-12">
                <p className="black-heading-title mt-2 mb-2">Setup Checklist</p>
              </div>
              <div className="col-lg-6 col-md-6 col-12 text-lg-right text-md-right text-sm-left">
                <div className="progress-bar-value">
                  <progress
                    value={
                      agreementData &&
                      agreementData.assigneeCount &&
                      agreementData.assigneeCount
                        .brand_asset_completed_count === 5
                        ? '100'
                        : '67'
                    }
                    max="100"
                  />
                  <div className="progress-range-text">
                    {' '}
                    {agreementData &&
                    agreementData.assigneeCount &&
                    agreementData.assigneeCount.brand_asset_completed_count ===
                      5
                      ? '100%'
                      : '67%'}{' '}
                    Complete
                  </div>
                </div>
              </div>
            </div>
            <div className="checklist-setup">
              {checkList.map((item) => (
                <GreenCheckBox className={item.property} key={item.label}>
                  <label className="">
                    {item.label}
                    <div className="steps-completed">
                      {item.subtitle && item.subtitle.includes(undefined)
                        ? ''
                        : item.subtitle}
                    </div>
                    <input type="checkbox" checked={item.active} readOnly />
                    <span className="checkmark" />
                  </label>
                </GreenCheckBox>
              ))}

              <div className="row">
                <div className="col-lg-7 col-md-6 col-12  ">
                  {' '}
                  <GreenCheckBox className="mt-3">
                    <label className="">
                      Upload Brand Assets
                      {agreementData &&
                      agreementData.assigneeCount &&
                      agreementData.assigneeCount ? (
                        <>
                          {agreementData.assigneeCount
                            .brand_asset_completed_count === 0 ? (
                            <div className="steps-completed gray-color">
                              0/5 Steps completed by you
                            </div>
                          ) : (
                            <div className="steps-completed">
                              {`${agreementData.assigneeCount.brand_asset_completed_count}/5 Steps completed`}{' '}
                              {agreementData.assigneeCount
                                .is_assigned_brand_asset
                                ? ''
                                : 'by you'}{' '}
                            </div>
                          )}
                          <input
                            type="checkbox"
                            checked={
                              agreementData.assigneeCount
                                .brand_asset_completed_count === 5
                            }
                            readOnly
                          />
                          <span className="checkmark" />
                        </>
                      ) : (
                        ''
                      )}
                    </label>
                  </GreenCheckBox>
                </div>

                <div className="col-lg-5 col-md-6 col-12 mt-3  text-lg-right text-md-right text-sm-left ">
                  {agreementData &&
                  agreementData.assigneeCount &&
                  agreementData.assigneeCount &&
                  agreementData.assigneeCount.is_completed ? (
                    ''
                  ) : (
                    <Link
                      to={PATH_CHOOSE_BRAND_DELEGATE.replace(':id', id).replace(
                        ':brandId',
                        brandId,
                      )}>
                      <Button className="btn-primary upload-asset  w-sm-100">
                        Upload Assets{' '}
                        <img
                          className="btn-icon ml-2"
                          width="16px"
                          src={WhiteArrowRight}
                          alt=""
                        />{' '}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </fieldset>
          <WhiteCard className="mt-3">
            <p className="black-heading-title mt-2 ">Creative Schedule</p>
            <fieldset className="shape-without-border extra-radius">
              <div className="row">
                <div className="col-5">
                  <img
                    className="solid-icon"
                    width="34px"
                    src={CircleBellIcon}
                    alt="bell"
                  />
                  <div className="image-title">
                    <p className="black-heading-title recurring-service mt-0  mb-0">
                      Product Assets Requested
                    </p>
                    <p className="gray-normal-text m-0">
                      0/5 product assets uploaded
                    </p>
                  </div>
                </div>

                <div className="col-7 text-right">
                  <Link
                    to={PATH_UPLOAD_PRODUCT_ASSET.replace(':id', id).replace(
                      ':productId',
                      productAssetsId,
                    )}>
                    <Button className="btn-primary upload-asset w-sm-100">
                      {' '}
                      Upload Assets{' '}
                      <img
                        className="btn-icon ml-2"
                        width="16px"
                        src={WhiteArrowRight}
                        alt=""
                      />{' '}
                    </Button>
                  </Link>
                </div>
              </div>
            </fieldset>
            <p style={{ fontSize: '14px' }} className="  text-center mt-5 mb-4">
              Your creative schedule is being generated
            </p>
          </WhiteCard>
          <WhiteCard className="mt-3">
            <p className="black-heading-title mt-2 ">
              Active Agreement(s) ({agreementData.count})
            </p>
            <ActiveAgreementTable>
              <div className="d-lg-block d-md-block d-none">
                <table>
                  <tbody>
                    <tr className="label-heading ">
                      <th width="40%">Agreement Type</th>
                      <th width="24%">Contract Status</th>
                      <th width="18%">Start Date</th>
                      <th width="18%">Expires in</th>
                    </tr>

                    {agreementData.data.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img
                            className="solid-icon"
                            src={
                              item &&
                              item.contract_type &&
                              item.contract_type.toLowerCase().includes('one')
                                ? ServiceIcon
                                : item &&
                                  item.contract_type &&
                                  item.contract_type
                                    .toLowerCase()
                                    .includes('dsp')
                                ? DspOnlyIcon
                                : RecurringIcon
                            }
                            alt="recurring"
                          />
                          <p className="black-heading-title recurring-service mt-2 mb-0">
                            {item &&
                            item.contract_type &&
                            item.contract_type.toLowerCase().includes('one')
                              ? 'One Time Service Agreement'
                              : item &&
                                item.contract_type &&
                                item.contract_type.toLowerCase().includes('dsp')
                              ? 'DSP Service Agreement'
                              : 'Recurring Service Agreement'}
                          </p>
                        </td>
                        <td>
                          <div className="sign-box">
                            {item.contract_status &&
                            item.contract_status.value === 'active' ? (
                              <>
                                <img
                                  width="14px"
                                  src={SignatureIcon}
                                  alt="signature"
                                />{' '}
                                Signed
                              </>
                            ) : (
                              item.contract_status && item.contract_status.label
                            )}
                          </div>
                        </td>
                        <td>{dayjs(item.start_date).format('MMM DD, YYYY')}</td>
                        <td>
                          {item.contract_type &&
                          item.contract_type.includes('one')
                            ? 'N/A'
                            : `${countDays(item && item.end_date)} days`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-lg-none d-md-none d-block">
                {agreementData.data.map((item) => (
                  <React.Fragment key={item.id}>
                    <div>
                      <div className="label-heading ">Agreement Type</div>
                      <div className="straight-line horizontal-line  mt-2 mb-2" />
                      <img
                        className="solid-icon"
                        src={
                          item &&
                          item.contract_type &&
                          item.contract_type.toLowerCase().includes('one')
                            ? ServiceIcon
                            : item &&
                              item.contract_type &&
                              item.contract_type.toLowerCase().includes('dsp')
                            ? DspOnlyIcon
                            : RecurringIcon
                        }
                        alt="recurring"
                      />
                      <p className="black-heading-title recurring-service mt-3 mb-0">
                        {item &&
                        item.contract_type &&
                        item.contract_type.toLowerCase().includes('one')
                          ? 'One Time Service Agreement'
                          : item &&
                            item.contract_type &&
                            item.contract_type.toLowerCase().includes('dsp')
                          ? 'DSP Service Agreement'
                          : 'Recurring Service Agreement'}
                      </p>
                    </div>
                    <div className="row mt-4 pt-1">
                      <div className="col-5">
                        <div className="label-heading  mb-2">
                          Contract Status
                        </div>
                        <div className="sign-box">
                          {item.contract_status &&
                          item.contract_status.value === 'active' ? (
                            <>
                              <img
                                width="14px"
                                src={SignatureIcon}
                                alt="signature"
                              />{' '}
                              Signed
                            </>
                          ) : (
                            item.contract_status && item.contract_status.label
                          )}
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="label-heading mb-2">Start Date</div>
                        <div>
                          {' '}
                          {dayjs(item.start_date).format('MMM DD, YYYY')}{' '}
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="label-heading mb-2">Expires in</div>

                        <div>
                          {' '}
                          {item.contract_type &&
                          item.contract_type.includes('one')
                            ? 'N/A'
                            : `${countDays(item && item.end_date)} days`}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </ActiveAgreementTable>
          </WhiteCard>
        </>
      )}
    </div>
  );
}

SetupCheckList.defaultProps = {
  brandId: '',
  productAssetsId: '',
};

SetupCheckList.propTypes = {
  id: PropTypes.string.isRequired,
  brandId: PropTypes.string,
  productAssetsId: PropTypes.string,
};

const GreenCheckBox = styled.div`
  
    display: block;
    position: relative;
    padding-left: 35px;
    padding-bottom: 15px;
    font-size: ${Theme.extraNormal};
    color : ${Theme.black};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-weight: 600;
    border-bottom: 1px dotted ${Theme.gray25};

    &:last-child {
      border-bottom: none;
      padding-bottom:0;
    }
  }
  .steps-completed {
    color: ${Theme.lighterGreen};
    font-weight: 500;

    &.gray-color{
      color: ${Theme.gray40};
    }
  }

   input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    top: 4px;
    left: 0;
    border: 1px solid ${Theme.gray35};
    border-radius: 100%;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    
  }

   input:checked ~ .checkmark {
    background-color: #e5f1e5;
  }
  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }


  input:checked ~ .checkmark:after {
    display: block;
  }
   .checkmark:after {
    left: 9px;
    top: 4px;
    width: 5px;
    height: 12px;
    border: solid ${Theme.lighterGreen};
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  

`;

const ActiveAgreementTable = styled.div`
  position: relative;
  width: 100%;
  margin-top: 20px;
  ${Theme.extraNormal};
  color: ${Theme.black};

  table {
    width: 100%;

    tr {
      text-align: left;
      background: ${Theme.white};
      border: 1px solid rgba(46, 91, 255, 0.08);
      border-radius: 1px;
      font-family: ${Theme.baseFontFamily};
      width: 100%;

      th {
        padding: 5px 0px 12px 0px;
        vertical-align: middle;
        position: relative;

        vertical-align: top;
        border-bottom: 1px solid #e2e2ea;
      }

      td {
        padding: 12px 0;

        // .sign-box {
        //   background-color: #ffffff;
        //   border: 1px solid #d5d8e1;
        //   border-radius: 2px;
        //   max-width: 100px;
        //   height: 32px;
        //   text-align: center;
        //   padding: 6px;
        // }
        // .solid-icon {
        //   width: 36px;
        //   height: 36px;
        //   margin-right: 10px;
        // }
        // .recurring-service {
        //   font-size: 14px;
        // }
      }
    }
  }
  .solid-icon {
    width: 36px;
    height: 36px;
    margin-right: 10px;
  }
  .recurring-service {
    font-size: ${Theme.extraNormal};
  }
  .sign-box {
    background-color: ${Theme.white};
    border: 1px solid ${Theme.gray45};
    border-radius: 2px;
    max-width: 100px;
    height: 32px;
    text-align: center;
    padding: 6px;
  }
`;
