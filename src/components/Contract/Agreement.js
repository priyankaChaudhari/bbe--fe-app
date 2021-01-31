/* eslint-disable react/no-danger */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import queryString from 'query-string';
import styled from 'styled-components';
import dayjs from 'dayjs';

import Modal from 'react-modal';

import { PATH_CUSTOMER_DETAILS } from '../../constants';
import AgreementSidePanel from '../../common/AgreementSidePanel';
import { agreementTemplate } from '../../api/AgreementApi';
import {
  PageLoader,
  PageNotFound,
  SuccessMsg,
  Button,
  ModalBox,
} from '../../common';
import { CloseIcon, AlarmBellIcon, ArrowIcons } from '../../theme/images';
import Theme from '../../theme/Theme';

import { getAccountDetails } from '../../store/actions/accountState';
import RequestSignature from './RequestSignature';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '600px ',
    width: '100% ',
    minHeight: '200px',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
export default function Agreement() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const id = location.pathname.split('/')[2];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [formData, setFormData] = useState({});
  const details = useSelector((state) => state.accountState.data);
  const loader = useSelector((state) => state.accountState.isLoading);
  const [showModal, setShowModal] = useState(false);
  const [editContractFlag, setEditContractFlag] = useState(true);

  const [showSuccessContact, setShowSuccessContact] = useState({
    show: false,
    message: '',
  });

  useEffect(() => {
    if (
      history &&
      history.location &&
      history.location.state &&
      history.location.state.message
    ) {
      setShowSuccessContact({
        show: true,
        message: history.location.state.message,
      });
      history.location.state.message = '';
      history.replace(history.location.pathname);
    }
    dispatch(getAccountDetails(id));
    agreementTemplate().then((response) => {
      setIsLoading({ loader: true, type: 'page' });
      setData(
        response &&
          response.data &&
          response.data.results &&
          response.data.results[0],
      );
      setIsLoading({ loader: false, type: 'page' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  const mapDefaultValues = (key, label) => {
    if (
      (formData[key] === undefined || formData[key] === '') &&
      details &&
      Object.keys(details).length === 0
    ) {
      return `Enter ${label}.`;
    }
    if (formData[key] === undefined || formData[key] === '') {
      // if (key === 'company_name') {
      //   return customerData && customerData[key];
      // }
      if (key === 'length') {
        return details && details.length.label;
      }
      if (key === 'start_date') {
        return details && dayjs(details[key]).format('MM-DD-YYYY');
      }
      if (key === 'current_date') {
        return dayjs(Date()).format('MM-DD-YYYY');
      }

      return details && details[key];
    }

    return formData[key];
  };

  const checkPermission = () => {
    if (
      details &&
      details.contract_status &&
      (details.contract_status !== null || details.contract_status !== '')
    ) {
      return true;
    }
    return false;
  };

  const setParams = (param) => {
    const stringified =
      queryString &&
      queryString.stringify({
        step: param,
      });
    history.push({
      pathname: `${history.location.pathname}`,
      search: `${stringified}`,
    });
  };

  const enableEditContract = () => {
    setEditContractFlag(true);
  };
  const getAgreementAccorType = (index) => {
    if (details && details.contract_type === 'one time') {
      return (
        data &&
        data.one_time_service_agreement &&
        data.one_time_service_agreement[index]
      );
    }
    return (
      data &&
      data.recurring_service_agreement &&
      data.recurring_service_agreement[index]
    );
  };
  const mapMonthlyServices = (key, label) => {
    if (details && details[key]) {
      const fields = [];
      for (const item of details[key]) {
        if (key !== 'additional_one_time_services') {
          if (
            (item.service && item.service.name !== undefined) ||
            item.name !== undefined
          ) {
            fields.push(
              `<tr>
            <td>${
              item.service ? item.service.name : item && item.name
            }</td><td>$ ${
                item.service
                  ? item.service.fee
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : item.fee
                  ? item.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : ''
              } /month</td></tr>`,
            );
          }
        } else {
          fields.push(
            `<tr>
                <td style="border: 1px solid black;
    padding: 13px;">${
      item && item.quantity
        ? item.quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        : 0
    }</td>
            <td style="border: 1px solid black;
    padding: 13px;">${
      item.service ? item.service.name : item && item.name
    }</td><td style="border: 1px solid black;
    padding: 13px;">$ ${
      item.service
        ? item.service.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        : item.fee
        ? item.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        : ''
    } /month</td>
            <td style="border: 1px solid black;
    padding: 13px;">$ ${(item.quantity * item.service.fee)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            </tr>`,
          );
        }
      }
      return fields;
    }
    return `Enter ${label}.`;
  };

  const mapServiceTotal = (key) => {
    if (key === 'additional_one_time_services') {
      return `$ ${
        details && details.total_fee.onetime_service
          ? details.total_fee.onetime_service
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : 0
      }`;
    }
    const market = details.total_fee.additional_marketplaces
      ? details.total_fee.additional_marketplaces
      : 0;
    const month = details.total_fee.monthly_service
      ? details.total_fee.monthly_service
      : 0;
    return `$ ${(market + month)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  return (
    <div>
      {checkPermission() ? (
        <>
          <div className="on-boarding-container">
            <div className="row">
              <div className=" col-10">
                <div className="text-container ">
                  <p className="m-0 p-0 mt-2">
                    {' '}
                    <Link
                      to={PATH_CUSTOMER_DETAILS.replace(':id', id)}
                      className="link">
                      <img
                        src={ArrowIcons}
                        alt="aarow-back"
                        className="arrow-icon mt-3"
                      />
                      Back to Customer Details
                    </Link>
                    <div className="success-msg">
                      {showSuccessContact.show ? (
                        <SuccessMsg
                          property=" "
                          message={showSuccessContact.message}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  </p>
                  {/* <h3 className="mt-5 mb-4 text-center"> Service Agreement </h3> */}
                  {isLoading.loader && isLoading.type === 'page' ? (
                    <PageLoader
                      className="modal-loader"
                      color="#FF5933"
                      type="page"
                      width={40}
                    />
                  ) : (
                    <Paragraph>
                      <p className="mb-4 long-text ">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: getAgreementAccorType(0)
                              .replace(
                                'CUSTOMER_NAME',
                                mapDefaultValues(
                                  'contract_company_name',
                                  'Customer Name',
                                ),
                              )
                              .replace(
                                'START_DATE',
                                mapDefaultValues('start_date', 'Start Date'),
                              )
                              .replace(
                                'CUSTOMER_ADDRESS',
                                mapDefaultValues('address', 'Address, '),
                              )
                              .replace(
                                'CUSTOMER_CITY',
                                mapDefaultValues('city', 'City, '),
                              )
                              .replace(
                                'CUSTOMER_STATE',
                                mapDefaultValues('state', 'State, '),
                              )
                              .replace(
                                'CUSTOMER_POSTAL',
                                mapDefaultValues('zip_code', 'Postal Code, '),
                              )
                              .replace(
                                'AGREEMENT_LENGTH',
                                mapDefaultValues('length', 'Contract Length'),
                              )
                              .replace(
                                'ONE_TIME_SERVICE_TABLE',
                                `<table class="contact-list " style="width: 100%;
    border-collapse: collapse;"><tr><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Quantity</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Service</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Service Fee</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Total Service Fee</th></tr>${mapMonthlyServices(
      'additional_one_time_services',
      'One Time Services',
    )}<tr><td class="total-service" colspan="3" style="border: 1px solid black;
    padding: 13px; font-weight: 800;"> Total</td><td class="total-service text-right" style="border: 1px solid black;
    padding: 13px; font-weight: 800;">${mapServiceTotal(
      'additional_one_time_services',
    )}
                              </td></tr>
                                </table>`,
                              )
                              .replace(
                                'ADDITIONAL_ONE_TIME_SERVICES_TOTAL',
                                `${mapServiceTotal(
                                  'additional_one_time_services',
                                )}`,
                              ),
                          }}
                        />
                      </p>
                      <p
                        className="long-text"
                        dangerouslySetInnerHTML={{
                          __html: getAgreementAccorType(1)
                            .replace(
                              'CUSTOMER_NAME',
                              mapDefaultValues(
                                'contract_company_name',
                                'Customer Name',
                              ),
                            )
                            .replace(
                              'AGREEMENT_DATE',
                              mapDefaultValues('start_date', 'Start Date'),
                            )
                            .replace(
                              'CUSTOMER_ADDRESS',
                              mapDefaultValues('address', 'Address, '),
                            )
                            .replace(
                              'CUSTOMER_CITY',
                              mapDefaultValues('city', 'City, '),
                            )
                            .replace(
                              'CUSTOMER_STATE',
                              mapDefaultValues('state', 'State, '),
                            )
                            .replace(
                              'CUSTOMER_POSTAL',
                              mapDefaultValues('zip_code', 'Postal Code, '),
                            )
                            .replace(
                              'BBE_DATE',
                              mapDefaultValues('current_date', 'Current Date'),
                            ),
                        }}
                      />
                    </Paragraph>
                  )}
                </div>
              </div>
            </div>
          </div>
          <AgreementSidePanel
            id={id}
            setFormData={setFormData}
            formData={formData}
            loader={loader}
            agreementData={details}
            editContractFlag={editContractFlag}
            setEditContractFlag={setEditContractFlag}
          />{' '}
          {(details &&
            details.contract_status &&
            details.contract_status.value === 'pending contract approval') ||
          (details &&
            details.contract_status &&
            details.contract_status.value === 'pending contract signature') ? (
            <Footer className="sticky">
              <div className="container">
                <Button
                  className="btn-primary on-boarding w-320 mt-3 mr-5 w-100 sticky-btn-primary sidepanel"
                  onClick={() => enableEditContract()}>
                  Edit Contract{' '}
                </Button>
                {details &&
                details.contract_status &&
                details.contract_status.value !==
                  'pending contract signature' ? (
                  <Button
                    className="light-orange on-boarding w-320 mt-3 mr-5 w-100 sticky-btn "
                    onClick={() => {
                      setParams('send-remainder');
                      setShowModal(true);
                    }}>
                    <img src={AlarmBellIcon} alt="alarm" />
                    Send Reminder
                  </Button>
                ) : (
                  ''
                )}
              </div>
            </Footer>
          ) : (
            ''
          )}
        </>
      ) : (
        <PageNotFound />
      )}

      <Modal
        isOpen={showModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => setShowModal(false)}
          role="presentation"
        />
        <ModalBox>
          <RequestSignature
            id={id}
            agreementData={details}
            setShowModal={setShowModal}
          />
        </ModalBox>
      </Modal>
    </div>
  );
}

const Paragraph = styled.div`
  .first-sub-category {
    margin: 0;
    padding-inline-start: 30px;
    li {
      margin-bottom: 17px;
      padding-left: 5px;
    }
  }
  &.testing {
    color: red !important;
  }
`;

const Footer = styled.div`
  border: 1px solid ${Theme.gray15};
  bottom: 0;
  width: 100%;
  background: #fff;
  box-shadow: ${Theme.boxShadow};
  position: fixed;
  min-height: 80px;

  .w-320 {
    float: left;
    max-width: 320px;
    width: 100%;
  }

  p {
    float: left;
    margin-top: 30px;
  }
`;
