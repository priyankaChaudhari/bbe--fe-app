import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import queryString from 'query-string';
import styled from 'styled-components';
import Modal from 'react-modal';
import queryString from 'query-string';
import dayjs from 'dayjs';
import Theme from '../../theme/Theme';

import AgreementSidePanel from '../../common/AgreementSidePanel';
import Agreement from './Agreement';
import ServicesAmendment from './ServicesAmendment';
import DSPAddendum from './DSPAddendum';
import Addendum from './Addendum';
import Statement from './Statement';
import {
  PageLoader,
  PageNotFound,
  SuccessMsg,
  Button,
  ModalBox,
} from '../../common';
import { getAccountDetails } from '../../store/actions/accountState';
import { agreementTemplate } from '../../api/AgreementApi';
import RequestSignature from './RequestSignature';
import { CloseIcon, ArrowIcons, OrangeChecked } from '../../theme/images';
import { PATH_CUSTOMER_DETAILS } from '../../constants';

import {
  updateAccountDetails,
  createMarketplace,
  updateMarketplace,
  createAdditionalServices,
  updateAdditionalServices,
  createAddendum,
  getAddendum,
  updateAddendum,
} from '../../api';
import { AgreementSign, AddendumSign } from '../../constants/AgreementSign';

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

export default function ContractContainer() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const id = location.pathname.split('/')[2];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [formData, setFormData] = useState({});
  const details = useSelector((state) => state.accountState.data);
  const loader = useSelector((state) => state.accountState.isLoading);
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [showModal, setShowModal] = useState(false);
  const [editContractFlag, setEditContractFlag] = useState(true);
  const [oneTimeService, setOneTimeService] = useState([]);
  const [isFooter, showFooter] = useState(false);
  const [newAddendumData, setNewAddendum] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [pdfData, setPDFData] = useState('');
  const [notIncludedOneTimeServices, setNotIncludedOneTimeServices] = useState(
    [],
  );
  const [notIncludedMonthlyServices, setNotIncludedMonthlyServices] = useState(
    [],
  );
  const [apiError, setApiError] = useState({});
  const [showSuccessContact, setShowSuccessContact] = useState({
    show: false,
    message: '',
  });

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

  const clearSuccessMessage = () => {
    history.location.state.message = '';
    history.replace(history.location.pathname);
  };

  useEffect(() => {
    if (
      history &&
      history.location &&
      history.location.state &&
      history.location.state.message
    ) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setShowSuccessContact({
        show: true,
        message: history.location.state.message,
      });
      setTimeout(clearSuccessMessage(), 100000);
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

    getAddendum({ customer_id: id }).then((addendum) => {
      setNewAddendum(
        addendum &&
          addendum.data &&
          addendum.data.results &&
          addendum.data.results[0],
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  useEffect(() => {
    if (
      (details && details.additional_one_time_services) ||
      (details && details.sales_threshold)
    ) {
      setFormData({
        ...formData,
        additional_one_time_services:
          details && details.additional_one_time_services,
        sales_threshold: details && details.sales_threshold,
      });
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  const onEditAddendum = () => {
    setShowEditor(true);
  };

  const saveAdditionalOneTimeService = (field, serviceId, index) => {
    const oneTimeServiceData = {
      name: (field && field.service && field.service).name
        ? field.service.name
        : '',
      service: (field && field.service && field.service).id
        ? field.service.id
        : field.service,
      quantity: field && field.quantity,
      contract: details.id,
    };
    if (field && field.service && field.service.name) {
      oneTimeServiceData.custom_amazon_store_price =
        field && field.custom_amazon_store_price;
    }

    setIsLoading({ loader: true, type: 'page' });
    if (serviceId) {
      updateAdditionalServices(serviceId, oneTimeServiceData).then((res) => {
        dispatch(getAccountDetails(id));
        if (res && res.status === 400) {
          setIsLoading({ loader: false, type: 'page' });
          setApiError(res && res.data);
        }
        if (res && res.status === 200) {
          // console.log("res", res.data);
        }

        setIsLoading({ loader: false, type: 'page' });
      });
    } else {
      createAdditionalServices(oneTimeServiceData).then((res) => {
        dispatch(getAccountDetails(id));

        if (res && res.status === 400) {
          setIsLoading({ loader: false, type: 'page' });
          setApiError(res && res.data);
        }
        if (res && res.status === 201) {
          const originalList = [...formData.additional_one_time_services];
          originalList[index] = res.data;
          setFormData({
            ...formData,
            additional_one_time_services: originalList,
          });

          const list = oneTimeService.filter(
            (item) => item.value !== res.data.service.id,
          );
          setOneTimeService(list);
          setNotIncludedOneTimeServices(list);
        }
        setIsLoading({ loader: false, type: 'page' });
      });
    }
  };

  const nextStep = () => {
    showFooter(false);

    if (history.location.pathname.includes('agreement')) {
      if (formData && Object.keys(formData).length) {
        if (formData && formData.start_date) {
          formData.start_date = dayjs(formData.start_date).format('YYYY-MM-DD');
        }
        setIsLoading({ loader: true, type: 'page' });
        const agreementData = {
          ...formData,
          steps_completed: {
            ...details.steps_completed,
            agreement: true,
          },
        };
        updateAccountDetails(details.id, agreementData).then((response) => {
          if (response && response.status === 400) {
            setIsLoading({ loader: false, type: 'page' });
            setApiError(response && response.data);
          } else if (response && response.status === 200) {
            dispatch(getAccountDetails(id));
            setIsLoading({ loader: false, type: 'page' });
            setFormData({});
          }
        });
      } else {
        const stepsCompletedData = {
          steps_completed: {
            ...details.steps_completed,
            agreement: true,
          },
        };
        updateAccountDetails(details.id, stepsCompletedData).then(
          (response) => {
            if (response && response.status === 200) {
              dispatch(getAccountDetails(id));
            }
          },
        );
      }
    }

    if (history.location.pathname.includes('statement')) {
      if (formData && Object.keys(formData).length) {
        setIsLoading({ loader: true, type: 'button' });

        if (formData && formData.primary_marketplace) {
          const statementData = {
            id:
              (details &&
                details.primary_marketplace &&
                details.primary_marketplace.id) ||
              '',
            contract: details.id,
            name: formData && formData.primary_marketplace,
            is_primary: true,
          };
          if (details.primary_marketplace && details.primary_marketplace.id) {
            updateMarketplace(
              details.primary_marketplace.id,
              statementData,
            ).then((res) => {
              if (res && res.status === 200) {
                setIsLoading({ loader: false, type: 'button' });
              }
              if (res && res.status === 400) {
                setApiError(res && res.data);
              }
            });
          } else {
            createMarketplace(statementData).then((res) => {
              if (res && res.status === 201) {
                setIsLoading({ loader: false, type: 'button' });
              }
            });
          }
        }

        if (formData.additional_one_time_services) {
          formData.additional_one_time_services.forEach((service, index) =>
            saveAdditionalOneTimeService(service, service.id, index),
          );
        }
        const num = ['monthly_retainer', 'dsp_fee', 'sales_threshold'];
        for (const val of num) {
          if (formData && formData[val]) {
            formData[val] = formData[val].substring(1).replace(/,/g, '');
          }
        }
        const detail = {
          ...formData,
          steps_completed: {
            ...details.steps_completed,
            agreement: true,
            statement: true,
          },
        };
        updateAccountDetails(details.id, detail).then((response) => {
          if (response && response.status === 400) {
            setIsLoading({ loader: false, type: 'button' });
            setApiError(response && response.data);
            setFormData({});
          } else if (response && response.status === 200) {
            dispatch(getAccountDetails(id));
            setIsLoading({ loader: false, type: 'button' });
            setFormData({});
          }
        });
      } else {
        setIsLoading({ loader: true, type: 'button' });
        const stepData = {
          steps_completed: { agreement: true, statement: true },
        };
        updateAccountDetails(details.id, stepData).then((response) => {
          if (response && response.status === 200) {
            dispatch(getAccountDetails(id));
            setIsLoading({ loader: false, type: 'button' });
          }
        });
      }
    }
    if (history.location.pathname.includes('addendum')) {
      if (newAddendumData.id) {
        setIsLoading({ loader: true, type: 'page' });

        updateAddendum(newAddendumData.id, {
          addendum: newAddendumData.addendum,
        }).then(() => {
          setIsLoading({ loader: false, type: 'page' });
          setShowEditor(false);
        });
      } else {
        const addendumData = {
          customer_id: id,
          addendum: newAddendumData && newAddendumData.addendum,
          contract: details.id,
        };
        setIsLoading({ loader: true, type: 'page' });

        createAddendum(addendumData).then((res) => {
          setIsLoading({ loader: false, type: 'page' });
          if (res && res.status === 201) {
            setNewAddendum(res && res.data);
            setShowEditor(false);
          }
        });
      }
    }
  };

  const discardAgreementChanges = () => {
    setFormData({});
    showFooter(false);
    if (history.location.pathname.includes('addendum')) {
      setShowEditor(false);
    } else {
      dispatch(getAccountDetails(id));
    }
  };

  const mapDefaultValues = (key, label, type) => {
    if (key === 'contract_company_name') {
      return details && details[key]
        ? details && details[key]
        : `Enter ${label}.`;
    }
    if (key === 'length') {
      return details && details.length.label;
    }
    if (key === 'primary_marketplace') {
      return (
        details &&
        details.primary_marketplace &&
        details.primary_marketplace.name
      );
    }
    if (key === 'start_date') {
      return details && dayjs(details[key]).format('MM-DD-YYYY');
    }
    if (key === 'current_date') {
      return dayjs(Date()).format('MM-DD-YYYY');
    }

    if (type && type.includes('number')) {
      return `${type === 'number-currency' ? '$' : '%'} ${
        details && details[key]
          ? details[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : ''
      }`;
    }
    return key === 'rev_share' || key === 'seller_type'
      ? details && details[key] && details[key].label
      : details && details[key];

    // return details && details[key];
  };

  const showRevTable = () => {
    if (details && details.sales_threshold) {
      return `<table class="contact-list " style="width: 100%;
    border-collapse: collapse;"><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Type</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Description</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;"> Rev Share %</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;"> Sales Threshold</th>
      </tr><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><td style="border: 1px solid black;
    padding: 13px;">% Of Incremental Sales</td>
      <td style="border: 1px solid black;
    padding: 13px;">A percentage of all Managed Channel Sales (retail dollars, net customer returns) for all sales over the sales 
      threshold each month through the Amazon Seller Central and Vendor Central account(s) that BBE manages for Client.</td><td style="border: 1px solid black;
    padding: 13px;"> REVENUE_SHARE </td><td style="border: 1px solid black;
    padding: 13px;">REV_THRESHOLD</td></tr></table>`;
    }
    return `<table class="contact-list"  style="width: 100%;
    border-collapse: collapse;"><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Type</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Description</th>
    <th style="text-align: left;border: 1px solid black;
    padding: 13px;"> Rev Share %</th></tr><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><td style="border: 1px solid black;
    padding: 13px;">% Of Sales</td><td style="border: 1px solid black;
    padding: 13px;">A percentage of all Managed Channel Sales (retail dollars, net customer returns) for all sales each month 
    through the Amazon Seller Central and Vendor Central account(s) that BBE manages for Client. </td><td style="border: 1px solid black;
    padding: 13px;"> REVENUE_SHARE</td></tr></table>`;
  };

  const mapMonthlyServices = (key) => {
    if (details && details[key]) {
      const fields = [];
      for (const item of details[key]) {
        if (key !== 'additional_one_time_services') {
          if (
            (item.service && item.service.name !== undefined) ||
            item.name !== undefined
          ) {
            if (
              item.service.name !== 'DSP Advertising' &&
              item.service.name !== 'Inventory Reconciliation'
            ) {
              fields.push(
                `<tr>
                <td style="border: 1px solid black;padding: 13px;">${
                  item.service ? item.service.name : item && item.name
                }</td>
                <td style="border: 1px solid black;padding: 13px;">$ ${
                  item.service
                    ? item.service.fee
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : item.fee
                    ? item.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : ''
                } /month
                </td>
                </tr>`,
              );
            }
          }
        } else {
          fields.push(
            `<tr>
                <td style="border: 1px solid black;padding: 13px;">${
                  item && item.quantity
                    ? item.quantity
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0
                }</td>
            <td style="border: 1px solid black;padding: 13px;">${
              item.service ? item.service.name : item && item.name
            }</td>
            <td style="border: 1px solid black;padding: 13px;">$ ${
              item.service &&
              item.service.fee &&
              item.service.name !== 'Amazon Store Package Custom'
                ? item.service.fee
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : item.custom_amazon_store_price
                ? item.custom_amazon_store_price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : ''
            } /month
            </td>
            <td style="border: 1px solid black;padding: 13px;">$ ${(item.service
              .name !== 'Amazon Store Package Custom'
              ? item.quantity * item.service.fee
              : item.quantity * item.custom_amazon_store_price
            )
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </td>
            </tr>`,
          );
        }
      }
      // return null;

      return fields.length ? fields.toString().replaceAll(',', '') : '';
    }
    return '';
    // return `Enter ${label}.`;
  };

  const mapAdditionalMarketPlaces = () => {
    const fields = [];
    if (details && details.additional_marketplaces) {
      for (const item of details.additional_marketplaces) {
        fields.push(
          `<tr>
      <td style="border: 1px solid black;padding: 13px;">${
        item.service ? item.service.name : item && item.name
      }</td>
                    <td style="border: 1px solid black;padding: 13px;">$ ${
                      item.service
                        ? item.service.fee
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : item.fee
                        ? item.fee
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : ''
                    } /month
                    </td>
      </tr>`,
        );
      }
    }

    return fields.length ? fields.toString().replaceAll(',', '') : '';
  };

  const mapVariableMonthlyService = () => {
    const fields = [
      `<tr ><td colspan="2" style ="text-align: center; border: 1px solid black;padding: 13px;">
                  Variable Monthly Services</td>
                  </tr>`,
    ];
    if (details && details.additional_monthly_services) {
      for (const item of details.additional_monthly_services) {
        if (item.service.name === 'DSP Advertising') {
          fields.push(
            `<tr>
                 <td style="border: 1px solid black;padding: 13px;">${
                   item.service ? item.service.name : item && item.name
                 }
                  </td>
                  <td style="border: 1px solid black;padding: 13px;">
                  Included
                  </td>
                </tr>`,
          );
        }
        if (item.service.name === 'Inventory Reconciliation') {
          fields.push(
            `<tr>
                 <td style="border: 1px solid black;padding: 13px;">${
                   item.service ? item.service.name : item && item.name
                 }</td>
                    <td style="border: 1px solid black;padding: 13px;"> 
                  25% of recovered $s
                  </td>
                    </tr>`,
          );
        }
      }

      return fields.length > 1 ? fields.toString().replaceAll(',', '') : '';
    }
    return '';
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

  const showMonthlyServiceTable = () => {
    if (
      details &&
      details.additional_monthly_services &&
      details.additional_monthly_services.length
    ) {
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center"><span style="font-weight: 800;
    font-family: Arial-bold;">Additional Monthly Services </span><br> The following additional monthly services will be provided to Client in addition to the Monthly Retainer.</div><br><table class="contact-list " style="width: 100%;
    border-collapse: collapse;><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Service</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Service Fee</th></tr>${mapMonthlyServices(
      'additional_monthly_services',
      'Monthly Services',
    )} ${mapAdditionalMarketPlaces()}<tr><td class="total-service" style="border: 1px solid black;padding: 13px;"> Total</td><td class="total-service text-right" style="border: 1px solid black;padding: 13px; text-align: right;">${mapServiceTotal(
        'additional_monthly_services',
      )}
                              </td></tr>
                              ${mapVariableMonthlyService()}
                                </table>`;
    }
    return '';
  };

  const showOneTimeServiceTable = () => {
    if (
      details &&
      details.additional_one_time_services &&
      details.additional_one_time_services.length
    ) {
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center;"><span style="font-weight: 800;
    font-family: Arial-bold;">Additional One Time Services </span><br>The following additional monthly services will be provided to Client as a one time service in addition to the Monthly Retainer and any Additional Monthly services.</div><br><table class="contact-list " style="width: 100%;
    border-collapse: collapse;
"><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Quantity</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Service</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Service Fee</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Total Service Fee</th></tr>${mapMonthlyServices(
      'additional_one_time_services',
      'One Time Services',
    )}<tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><td class="total-service" colspan="3" style="border: 1px solid black;padding: 13px;"> Total</td><td class="total-service text-right" style="border: 1px solid black;padding: 13px; text-align: right;">${mapServiceTotal(
      'additional_one_time_services',
    )}
                              </td></tr>
                                </table>`;
    }
    return '';
  };

  const getAgreementAccorType = (index) => {
    if (data && details && details.contract_type === 'one time') {
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

  const displayNotIncludedServices = () => {
    const fields = [];
    for (const item of notIncludedMonthlyServices) {
      fields.push(
        `<tr>
          <td style="border: 1px solid black;padding: 13px;"> ${
            item.label ? item.label : 'N/A'
          }</td>
          <td style="border: 1px solid black;padding: 13px;"> ${' Monthly'}</td>
         </tr>`,
      );
    }
    for (const item of notIncludedOneTimeServices) {
      fields.push(
        `<tr>
          <td style="border: 1px solid black;padding: 13px;"> ${
            item.label ? item.label : 'N/A'
          }</td>
          <td style="border: 1px solid black;padding: 13px;"> ${'One Time'}</td>
         </tr>`,
      );
    }
    return fields.length ? fields.toString().replaceAll(',', '') : '';
  };

  const createAgreementDoc = () => {
    const agreementData = getAgreementAccorType(0)
      .replace(
        'CUSTOMER_NAME',
        mapDefaultValues('contract_company_name', 'Customer Name'),
      )
      .replace('START_DATE', mapDefaultValues('start_date', 'Start Date'))
      .replace('CUSTOMER_ADDRESS', mapDefaultValues('address', 'Address, '))
      .replace('CUSTOMER_CITY', mapDefaultValues('city', 'City, '))
      .replace('CUSTOMER_STATE', mapDefaultValues('state', 'State, '))
      .replace('CUSTOMER_POSTAL', mapDefaultValues('zip_code', 'Postal Code, '))
      .replace(
        'AGREEMENT_LENGTH',
        mapDefaultValues('length', 'Contract Length'),
      )
      .replace(
        'ONE_TIME_SERVICE_TABLE',
        `<table class="contact-list " style="width: 100%;
    border-collapse: collapse;"><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Quantity</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Service</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Service Fee</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Total Service Fee</th></tr>${mapMonthlyServices(
      'additional_one_time_services',
      'One Time Services',
    )}<tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><td class="total-service" colspan="3" style="border: 1px solid black;
    padding: 13px; font-weight: 800;"> Total</td><td class="total-service text-right" style="border: 1px solid black;
    padding: 13px; font-weight: 800;">${mapServiceTotal(
      'additional_one_time_services',
    )}
                              </td></tr>
                                </table>`,
      )
      .replace(
        'ADDITIONAL_ONE_TIME_SERVICES_TOTAL',
        `${mapServiceTotal('additional_one_time_services')}`,
      );

    const agreementSignatureData = AgreementSign.replace(
      'CUSTOMER_NAME',
      mapDefaultValues('contract_company_name', 'Customer Name'),
    )
      .replace('AGREEMENT_DATE', mapDefaultValues('start_date', 'Start Date'))
      .replace('CUSTOMER_ADDRESS', mapDefaultValues('address', 'Address, '))
      .replace('CUSTOMER_CITY', mapDefaultValues('city', 'City, '))
      .replace('CUSTOMER_STATE', mapDefaultValues('state', 'State, '))
      .replace('CUSTOMER_POSTAL', mapDefaultValues('zip_code', 'Postal Code, '))
      .replace('BBE_DATE', mapDefaultValues('current_date', 'Current Date'));

    const statmentData =
      data.statement_of_work &&
      data.statement_of_work[0]
        .replace(
          'CUSTOMER_NAME',
          mapDefaultValues('contract_company_name', 'Customer Name'),
        )
        .replace('START_DATE', mapDefaultValues('start_date', 'Start Date'))
        .replace(
          'MONTHLY_RETAINER_AMOUNT',
          mapDefaultValues(
            'monthly_retainer',
            'Monthly Retainer',
            'number-currency',
          ),
        )
        .replace('REV_SHARE_TABLE', showRevTable())
        .replace('REVENUE_SHARE', mapDefaultValues('rev_share', 'Rev Share'))
        .replace(
          'REV_THRESHOLD',
          mapDefaultValues(
            'sales_threshold',
            'Rev Threshold',
            'number-currency',
          ),
        )
        .replace('SELLER_TYPE', mapDefaultValues('seller_type', 'Seller Type'))
        .replace(
          'PRIMARY_MARKETPLACE',
          mapDefaultValues('primary_marketplace', 'Primary Marketplace'),
        )

        .replace('MAP_MONTHLY_SERVICES', showMonthlyServiceTable())
        .replace('ONE_TIME_SERVICES', showOneTimeServiceTable())
        .replace(
          'ADDITIONAL_SERVICES_NOT_INCLUDED',
          `<table class="contact-list " style="width: 100%;border-collapse: collapse;">
                                <tr>
                                  <th style="text-align: left; border: 1px solid black;padding: 13px;">Service</th>
                                  <th style="text-align: left; border: 1px solid black;padding: 13px;">Service Type</th>
                                  </tr>
                                  ${displayNotIncludedServices()}
                                  </table>
                                  `,
        );

    const addendumData =
      data.addendum &&
      data.addendum[0]
        .replace(
          'CUSTOMER_NAME',
          mapDefaultValues('contract_company_name', 'Customer Name'),
        )
        .replace(
          'AGREEMENT_DATE',
          mapDefaultValues('start_date', 'Start Date'),
        );

    const newAddendumAddedData =
      newAddendumData && newAddendumData.addendum
        ? newAddendumData.addendum
        : '';

    const addendumSignatureData = AddendumSign.replace(
      'CUSTOMER_NAME',
      mapDefaultValues('contract_company_name', 'Customer Name'),
    ).replace('BBE_DATE', mapDefaultValues('current_date', 'Current Date'));
    const finalAgreement = `${agreementData} ${agreementSignatureData} ${statmentData} ${addendumData} ${newAddendumAddedData} ${addendumSignatureData}`;
    setPDFData(finalAgreement);
  };

  const checkApprovalCondition = () => {
    const rev = Number(details && details.rev_share && details.rev_share.value);
    const contractTermLength = parseInt(
      details && details.length && details.length.value,
      10,
    );
    if (
      (rev < 3 || contractTermLength < 12) &&
      !(userInfo && userInfo.role === 'Team Manager - TAM')
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

  return (
    <>
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader
          className="modal-loader"
          color="#FF5933"
          type="page"
          width={40}
        />
      ) : checkPermission() ? (
        details ? (
          <>
            <div className="on-boarding-container">
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
                <div>
                  {history.location.pathname.includes('agreement') &&
                  details ? (
                    <Agreement
                      formData={formData}
                      details={details}
                      templateData={data}
                    />
                  ) : (
                    ''
                  )}
                </div>
                <div>
                  {history.location.pathname.includes('statement') &&
                  details ? (
                    <Statement
                      formData={formData}
                      details={details}
                      templateData={data}
                      notIncludedOneTimeServices={notIncludedOneTimeServices}
                      notIncludedMonthlyServices={notIncludedMonthlyServices}
                    />
                  ) : (
                    ''
                  )}
                </div>
                <div>
                  {history.location.pathname.split('/')[3] === 'addendum' ? (
                    <Addendum
                      formData={formData}
                      details={details}
                      templateData={data}
                      notIncludedOneTimeServices={notIncludedOneTimeServices}
                      notIncludedMonthlyServices={notIncludedMonthlyServices}
                      newAddendumData={newAddendumData}
                      setNewAddendum={setNewAddendum}
                      showEditor={showEditor}
                      setShowEditor={setShowEditor}
                      onEditAddendum={onEditAddendum}
                    />
                  ) : (
                    ''
                  )}
                </div>{' '}
                <div>
                  {history.location.pathname.split('/')[3] ===
                  'dsp-addendum' ? (
                    <DSPAddendum
                      formData={formData}
                      details={details}
                      templateData={data}
                    />
                  ) : (
                    ''
                  )}
                </div>{' '}
                <div>
                  {history.location.pathname.includes('service-amendment') ? (
                    <ServicesAmendment
                      formData={formData}
                      details={details}
                      templateData={data}
                    />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          ''
        )
      ) : (
        <PageNotFound />
      )}
      <AgreementSidePanel
        id={id}
        setFormData={setFormData}
        formData={formData}
        loader={loader}
        apiError={apiError}
        agreementData={details}
        editContractFlag={editContractFlag}
        setEditContractFlag={setEditContractFlag}
        setNotIncludedOneTimeServices={setNotIncludedOneTimeServices}
        setNotIncludedMonthlyServices={setNotIncludedMonthlyServices}
        showFooter={showFooter}
        newAddendumData={newAddendumData}
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        onEditAddendum={onEditAddendum}
        setApiError={setApiError}
      />
      {isFooter || (newAddendumData && newAddendumData.id && showEditor) ? (
        <div className="mt-5 pt-5">
          <Footer className="sticky mt-5">
            <div className="container">
              <Button
                className="light-orange  on-boarding  mt-3 mr-5"
                onClick={() => nextStep()}>
                <img src={OrangeChecked} alt="checked" /> Save Changes
              </Button>

              <Button
                className="btn-borderless on-boarding  mt-3 mr-5"
                onClick={() => discardAgreementChanges()}>
                Discard Changes
              </Button>
            </div>
          </Footer>
        </div>
      ) : details &&
        details.steps_completed &&
        details.steps_completed.agreement &&
        details.steps_completed.statement ? (
        <div className="mt-5 pt-5">
          <Footer className="sticky">
            <div className="container">
              {checkApprovalCondition() ? (
                <Button
                  className="btn-primary on-boarding w-320 mt-3 mr-5"
                  onClick={() => {
                    createAgreementDoc();
                    setParams('request-approve');
                    setShowModal(true);
                  }}>
                  Request Approval
                </Button>
              ) : userInfo && userInfo.role === 'Team Manager - TAM' ? (
                <Button
                  className="btn-primary on-boarding w-320 mt-3 mr-5"
                  onClick={() => {
                    createAgreementDoc();
                    setParams('select-contact');
                    setShowModal(true);
                  }}>
                  Approve and Request Signature
                </Button>
              ) : (
                <Button
                  className="btn-primary on-boarding w-320 mt-3 mr-5"
                  onClick={() => {
                    createAgreementDoc();
                    setParams('select-contact');
                    setShowModal(true);
                  }}>
                  Request Signature
                </Button>
              )}
            </div>
          </Footer>
        </div>
      ) : (
        ''
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
            pdfData={pdfData}
          />
        </ModalBox>
      </Modal>
    </>
  );
}

const Footer = styled.div`
  border: 1px solid ${Theme.gray7};
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
