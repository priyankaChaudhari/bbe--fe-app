/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint array-callback-return: "error" */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint no-unused-expressions: "error" */
/* eslint consistent-return: "error" */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Collapse } from 'react-collapse';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import DatePicker from 'react-date-picker';
import dayjs from 'dayjs';
import Select, { components } from 'react-select';

import Theme from '../theme/Theme';
import {
  ServiceAgreement,
  CreateAddendum,
  StatementWork,
  EditFileIcons,
  GreenCheck,
  MinusIcon,
  PlusIcon,
  Advertise,
  CaretUp,
  RedCross,
  DefaultUser,
  FileIcon,
  CheckFileIcon,
  EditFileIcon,
  SignatureIcon,
} from '../theme/images/index';
import { Button, ContractFormField, CommonPagination } from './index';
import {
  AgreementDetails,
  StatementDetails,
  DSPAddendumDetails,
  ListingOptimization,
} from '../constants/FieldConstants';
import {
  getLength,
  // updateAccountDetails,
  getRevenueShare,
  // getMarketplaces,
  getMonthlyService,
  getOneTimeService,
  createAddendum,
  getContractActivityLog,
  getDocumentList,
  // getAmazonDetails,
  // getCustomerMembers,
} from '../api';
import ContractInputSelect from './ContractInputSelect';

import PageLoader from './PageLoader';
import ErrorMsg from './ErrorMsg';
// import { getAccountDetails } from '../store/actions/accountState';
import CheckBox from './CheckBox';

const _ = require('lodash');

export default function AgreementSidePanel({
  id,
  setFormData,
  formData,
  agreementData,
  loader,
  newAddendumData,
  onEditAddendum,
  showEditor,
  setShowEditor,
  setNewAddendum,
  setNotIncludedOneTimeServices,
  setNotIncludedMonthlyServices,
  // sendNotIncludedOneTimeServToAdd,
  // sendNotIncludedMonthlyServToAdd,
  apiError,
  showFooter,
  setApiError,
  executeScroll,
  showSection,
  setShowCollpase,
  updatedFormData,
  setUpdatedFormData,
  additionalMonthlyServices,
  setMonthlyAdditionalServices,
  originalData,
  additionalMarketplacesData,
  setAdditionalMarketplace,
  additionalOnetimeServices,
  setAdditionalOnetimeServices,
  additionalMarketplaceError,
  setAdditionalMarketplaceError,
  additionalMonthlySerError,
  setAdditionalMonthlySerError,
  additionalOnetimeSerError,
  setAdditionalOnetimeSerError,
  contractError,
  setContractError,
  setOriginalAddendumData,
  openCollapse,
  setOpenCollapse,
  notIncludedOneTimeServices,
  amazonStoreCustom,
  setAmazonStoreCustom,
  showAmazonPlanDropdown,
  setShowAmazonPlanDropdown,
  showAdditionalMarketplace,
  setShowAdditionalMarketplace,
  startDate,
  setStartDate,
  setShowDiscountModal,
  sectionError,
  setSectionError,
  setDiscountFlag,
  isEditContract,
  marketplacesResult,
  // setMarketplacesResult,
  marketPlaces,
  setMarketPlaces,
  additionalMarketplaces,
  setAdditionalMarketplaces,
  firstMonthDate,
}) {
  const [accountLength, setAccountLength] = useState([]);
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const [revShare, setRevShare] = useState([]);
  const [oneTimeService, setOneTimeService] = useState([]);
  const [monthlyService, setMonthlyService] = useState([]);
  // const [marketPlaces, setMarketPlaces] = useState([]);
  // const [additionalMarketplaces, setAdditionalMarketplaces] = useState([]);

  // const agreement = useSelector((state) => state.accountState.data);
  // const [showAdditionalMarketplace, setShowAdditionalMarketplace] = useState(
  //   false,
  // );
  // const [amazonStoreCustom, setAmazonStoreCustom] = useState(false);
  // const [showAmazonPlanDropdown, setShowAmazonPlanDropdown] = useState(false);
  const [AmazonStoreOptions, setAmazonStoreOptions] = useState(false);
  const [amazonService, setSelectedAmazonStorePackService] = useState(false);

  const [activityData, setActivityData] = useState([]);
  const [activityCount, setActivityCount] = useState([]);
  const [pageNumber, setPageNumber] = useState();
  const [images, setImages] = useState([]);
  const [activityLoader, setActivityLoader] = useState(false);
  const [isApicalled, setIsApicalled] = useState(false);
  const getActivityInitials = (userInfo) => {
    if (userInfo && userInfo === 'Contract initiated') {
      return 'SU';
    }
    const firstName =
      (userInfo &&
        userInfo.split(' ').slice(0, 2) &&
        userInfo.split(' ').slice(0, 2)[0].charAt(0)) ||
      '';
    const lastName =
      (userInfo &&
        userInfo.split(' ').slice(0, 2) &&
        userInfo.split(' ').slice(0, 2)[1].charAt(0)) ||
      '';

    return firstName + lastName;
  };

  console.log('firstMonthDateeeeee', firstMonthDate);

  // const activityDetail = (item) => {
  //   const newRecord = item.message.includes(
  //     'created new record by company name',
  //   )
  //     ? item.message.split('created new record by company name')
  //     : '';
  //   const updatedField = item.message.includes('updated')
  //     ? item.message.split('updated')
  //     : '';

  //   const deleteRecord = item.message.includes('deleted record')
  //     ? item.message.split('deleted record')
  //     : '';

  //   const requestRecord = item.message.includes('requested for')
  //     ? item.message.split('requested for')
  //     : '';

  //   if (newRecord || deleteRecord) {
  //     return (
  //       <>
  //         {newRecord[0] || deleteRecord[0]}
  //         <span>
  //           {newRecord
  //             ? 'created new record by company name'
  //             : 'deleted record'}
  //         </span>
  //         {newRecord[1] || deleteRecord[1]}
  //       </>
  //     );
  //   }

  //   if (requestRecord) {
  //     return (
  //       <>
  //         {requestRecord && requestRecord[0]}
  //         <span>requested for</span>
  //         {requestRecord && requestRecord[1]}
  //       </>
  //     );
  //   }

  //   return (
  //     <>
  //       {updatedField && updatedField[0]}
  //       <span>
  //         updated {updatedField && updatedField[1].split(' from ')[0]} from{' '}
  //       </span>{' '}
  //       {updatedField && updatedField[1].split(' from ')[1].split(' to ')[0]}
  //       <span> to </span>{' '}
  //       {updatedField && updatedField[1].split(' from ')[1].split(' to ')[1]}
  //     </>
  //   );
  // };

  const activityDetail = (item) => {
    let activityMessage = '';
    if (item.message.includes('created new record by company name')) {
      activityMessage = item.message.split(
        'created new record by company name',
      );
      return (
        <>
          {activityMessage[0]}
          <span>created new record by company name</span>
          {activityMessage[1]}
        </>
      );
    }
    if (item.message.includes('deleted record')) {
      activityMessage = item.message.split('deleted record');
      return (
        <>
          {activityMessage[0]}
          <span>deleted record</span>
          {activityMessage[1]}
        </>
      );
    }
    if (item.message.includes('updated')) {
      activityMessage = item.message.split('updated');
      if (
        item.message.includes('fee') ||
        item.message.includes('discount amount') ||
        item.message.includes('monthly retainer') ||
        item.message.includes('sales threshold')
      ) {
        return (
          <>
            {activityMessage && activityMessage[0]}
            <span>
              updated {activityMessage && activityMessage[1].split(' from ')[0]}{' '}
              from{' '}
            </span>{' '}
            {activityMessage &&
              activityMessage[1]
                .split(' from ')[1]
                .split(' to ')[0]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            <span> to </span>{' '}
            {activityMessage &&
              activityMessage[1]
                .split(' from ')[1]
                .split(' to ')[1]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </>
        );
      }
      return (
        <>
          {activityMessage && activityMessage[0]}
          <span>
            updated {activityMessage && activityMessage[1].split(' from ')[0]}{' '}
            from{' '}
          </span>{' '}
          {activityMessage &&
            activityMessage[1].split(' from ')[1].split(' to ')[0]}
          <span> to </span>{' '}
          {activityMessage &&
            activityMessage[1].split(' from ')[1].split(' to ')[1]}
        </>
      );
    }
    if (item.message.includes('requested for')) {
      activityMessage = item.message.split('requested for');
      return (
        <>
          {activityMessage && activityMessage[0]}
          <span>requested for</span>
          {activityMessage && activityMessage[1]}
        </>
      );
    }
    return item && item.message ? item.message : '';
  };

  const getContractActivityLogInfo = useCallback(
    (currentPage) => {
      setActivityLoader(true);
      getContractActivityLog(currentPage, agreementData.id).then((response) => {
        setActivityData(response && response.data && response.data.results);
        setActivityCount(response && response.data && response.data.count);
        setPageNumber(currentPage);
        getDocumentList().then((picResponse) => {
          setImages(picResponse);
        });
        setActivityLoader(false);
        setIsApicalled(true);
      });
    },
    [agreementData],
  );

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getContractActivityLogInfo(currentPage);
  };

  const fetchUncommonOptions = (options, alreadySelected, type) => {
    let result = [];
    if (alreadySelected && alreadySelected.length) {
      for (const option of options) {
        let isFound = true;
        for (const service of alreadySelected) {
          if (
            service && service.service && service.service.id
              ? service.service.id !== option.value
              : service.service_id !== option.value
          ) {
            isFound = false;
          } else {
            isFound = true;
            break;
          }
        }

        if (isFound === false) {
          // result.push(option);
          if (type === 'monthly_service') {
            result.push(option);
          } else if (
            alreadySelected.find((item) =>
              item.name
                ? item.name.includes('Amazon Store Package')
                : item.service.name.includes('Amazon Store Package'),
            )
          ) {
            if (!option.label.includes('Amazon Store Package')) {
              result.push(option);
            }
          } else if (!option.label.includes('Amazon Store Package')) {
            result.push(option);
          } else if (
            result.find((item) => item.label.includes('Amazon Store Package'))
          ) {
            // dfgdfgh
          } else {
            result.push({
              value: 'Amazon Store Package',
              label: 'Amazon Store Package',
            });
          }
        }
      }
    } else if (type === 'monthly_service') {
      result = options;
    } else {
      result = options.filter(
        (item) => !item.label.includes('Amazon Store Package'),
      );
      result.push({
        value: 'Amazon Store Package',
        label: 'Amazon Store Package',
      });
    }
    // }
    // func(result);
    if (type === 'one_time_service') {
      if (setNotIncludedOneTimeServices) {
        setNotIncludedOneTimeServices(result);
      }
    }
    if (type === 'monthly_service') {
      if (setNotIncludedMonthlyServices) {
        setNotIncludedMonthlyServices(result);
      }
    }
  };

  useEffect(() => {
    getLength().then((len) => {
      setAccountLength(len.data);
    });
    getRevenueShare().then((rev) => {
      setRevShare(rev.data);
    });

    getMonthlyService().then((res) => {
      setMonthlyService(res.data);

      fetchUncommonOptions(
        res && res.data,
        agreementData.additional_monthly_services,
        'monthly_service',
      );
      // if (
      //   agreementData &&
      //   agreementData.additional_monthly_services &&
      //   agreementData.additional_monthly_services.length
      // ) {
      //   getMonthlyServiceOptions(res.data);
      // }
    });

    getOneTimeService().then((r) => {
      setOneTimeService(r && r.data);

      if (r && r.data) {
        const result = [];
        r.data.forEach((item) => {
          if (item.label.includes('Amazon Store Package')) {
            result.push({ value: item.value, label: item.label });
          }
        });
        const list = result.filter((item) =>
          item.label.includes('Amazon Store Package'),
        );
        list.filter((item) => {
          const serviceName = item.label.split(' ')[3];
          item.label = serviceName;
          return item;
        });

        setAmazonStoreOptions(list);

        fetchUncommonOptions(
          r && r.data,
          agreementData.additional_one_time_services,
          'one_time_service',
        );
      }
    });
    // getMarketplaces().then((market) => {
    //   setMarketPlaces(market.data);
    //   setAdditionalMarketplaces(market.data);
    //   setMarketplacesResult(market.data);
    // });
  }, []);

  const DropdownIndicator = (props) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <img
            src={CaretUp}
            alt="caret"
            style={{
              transform: props.selectProps.menuIsOpen ? 'rotate(180deg)' : '',
              width: '25px',
              height: '25px',
            }}
          />
        </components.DropdownIndicator>
      )
    );
  };

  const goToSection = () => {
    if (openCollapse.agreement) {
      executeScroll('agreement');
    }
    if (openCollapse.statement) {
      executeScroll('statement');
    }
    if (openCollapse.dspAddendum) {
      executeScroll('dspAddendum');
    }
    if (openCollapse.addendum) {
      executeScroll('addendum');
    }
  };

  useEffect(() => {
    goToSection();
    const serviceData =
      agreementData &&
      agreementData.additional_one_time_services &&
      agreementData.additional_one_time_services.length &&
      agreementData.additional_one_time_services.find(
        (item) =>
          item.service && item.service.name.includes('Amazon Store Package'),
      );
    if (serviceData) {
      setShowAmazonPlanDropdown(true);
      const serviceName = serviceData.service.name.split(' ')[3];
      if (serviceName === 'Custom') {
        setAmazonStoreCustom(true);
      }
    }
    setSelectedAmazonStorePackService(serviceData);
    // }

    // if (agreementData && agreementData.additional_one_time_services) {
    fetchUncommonOptions(
      oneTimeService,
      agreementData.additional_one_time_services,
      'one_time_service',
    );

    // if (agreementData && agreementData.additional_monthly_services) {
    fetchUncommonOptions(
      monthlyService,
      agreementData.additional_monthly_services,
      'monthly_service',
    );
    if (
      agreementData &&
      agreementData.additional_marketplaces &&
      agreementData.additional_marketplaces.length
    ) {
      setShowAdditionalMarketplace(true);
    }

    if (agreementData && agreementData.id) {
      getContractActivityLogInfo();
    }

    // if (
    //   agreementData &&
    //   agreementData.primary_marketplace &&
    //   agreementData.primary_marketplace.name
    // ) {
    //   setAdditionalMarketplaces(
    //     marketPlaces.filter(
    //       (op) => op.value !== agreementData.primary_marketplace.name,
    //     ),
    //   );
    // } else {
    //   setAdditionalMarketplaces(marketPlaces);
    // }

    // if (agreementData && agreementData.additional_marketplaces) {
    //   setMarketPlaces(
    //     additionalMarketplaces.filter(
    //       (choice) =>
    //         !(agreementData && agreementData.additional_marketplaces).some(
    //           (item) => item.name === choice.value,
    //         ),
    //     ),
    //   );
    // }

    // console.log(agreementData, additionalMarketplaces, marketPlaces);
  }, [agreementData]);
  const clearOneTimeQntyError = (val) => {
    const itemFound =
      additionalOnetimeSerError &&
      additionalOnetimeSerError.quantity &&
      additionalOnetimeSerError.quantity.length &&
      additionalOnetimeSerError.quantity.find((item) =>
        item.service_id === val.value
          ? val.value
          : val && val.service
          ? val.service.id
          : '',
      );

    if (itemFound) {
      const updatedQntyError = additionalOnetimeSerError.quantity;

      const list = updatedQntyError.filter(
        (item) => item.service_id !== itemFound.service_id,
      );

      setAdditionalOnetimeSerError({
        ...additionalOnetimeSerError,
        quantity: list,
      });
    }
  };

  const clearError = (event, key, type) => {
    if (type === 'date') {
      if (
        AgreementDetails.find((item) => item.key === key && item.isMandatory) ||
        key === 'address' ||
        key === 'state' ||
        key === 'city' ||
        key === 'zip_code'
      ) {
        AgreementDetails.forEach((item) => {
          if (item.key !== 'contract_address') {
            if (event) {
              if (item.key === key && !(formData && formData[item.key])) {
                item.error = false;

                setSectionError({
                  ...sectionError,
                  agreement: sectionError.agreement - 1,
                  dsp: sectionError.dsp - 1,
                  // ? sectionError.agreement - 1
                  // : 0,
                });
              }
            } else if (formData && formData[key]) {
              item.error = true;

              setSectionError({
                ...sectionError,
                agreement: sectionError.agreement + 1,
                dsp: sectionError.dsp + 1,

                // ? sectionError.agreement + 1
                // : 0,
              });
            }
          }
          return null;
        });
      }
    }

    if (type === 'choice') {
      if (
        StatementDetails.find((item) => item.key === key && item.isMandatory)
      ) {
        StatementDetails.forEach((item) => {
          if (event && event.value) {
            if (item.key === key && !(formData && formData[item.key])) {
              item.error = false;
              setSectionError({
                ...sectionError,
                statement: sectionError.statement - 1,
                // ? sectionError.statement - 1
                // : 0,
              });
            }
          } else {
            item.error = true;

            if (formData && formData[key]) {
              setSectionError({
                ...sectionError,
                statement: sectionError.statement + 1,
                //  ? sectionError.statement + 1 : 0,
              });
            }
          }
        });
      } else if (
        DSPAddendumDetails.find((item) => item.key === key && item.isMandatory)
      ) {
        DSPAddendumDetails.forEach((item) => {
          if (event && event.value) {
            if (item.key === key && !(formData && formData[item.key])) {
              item.error = false;

              setSectionError({
                ...sectionError,
                dsp: sectionError.dsp - 1,
                // ? sectionError.statement - 1
                // : 0,
              });
            }
          } else if (formData && formData[key]) {
            item.error = true;
            setSectionError({
              ...sectionError,
              dsp: sectionError.dsp + 1,
              //  ? sectionError.statement + 1 : 0,
            });
          }
        });
      } else if (
        AgreementDetails.find((item) => item.key === key && item.isMandatory) ||
        key === 'address' ||
        key === 'state' ||
        key === 'city' ||
        key === 'zip_code'
      ) {
        AgreementDetails.forEach((item) => {
          if (item.key !== 'contract_address') {
            if (event && event.value) {
              if (item.key === key && !(formData && formData[item.key])) {
                item.error = false;

                setSectionError({
                  ...sectionError,
                  agreement: sectionError.agreement - 1,
                  // ? sectionError.agreement - 1
                  // : 0,
                });
              }
            } else if (formData && formData[key]) {
              item.error = true;

              setSectionError({
                ...sectionError,
                agreement: sectionError.agreement + 1,
                // ? sectionError.agreement + 1
                // : 0,
              });
            }
          }
        });
      }
    }

    if (event && event.target && event.target.name) {
      if (
        StatementDetails.find(
          (item) => item.key === event.target.name && item.isMandatory,
        )
      ) {
        StatementDetails.forEach((item) => {
          if (event && event.target && event.target.value) {
            if (
              item.key === event.target.name &&
              !(formData && formData[item.key])
            ) {
              item.error = false;
              setSectionError({
                ...sectionError,
                statement: sectionError.statement - 1,
                // ? sectionError.statement - 1
                // : 0,
              });
            }
          } else {
            item.error = true;

            if (formData && formData[event.target.name]) {
              setSectionError({
                ...sectionError,
                statement: sectionError.statement + 1,
                //  ? sectionError.statement + 1 : 0,
              });
            }
          }
        });
      } else if (
        DSPAddendumDetails.find(
          (item) => item.key === event.target.name && item.isMandatory,
        )
      ) {
        DSPAddendumDetails.forEach((item) => {
          if (event && event.target && event.target.value) {
            if (
              item.key === event.target.name &&
              !(formData && formData[item.key])
            ) {
              item.error = false;

              setSectionError({
                ...sectionError,
                dsp: sectionError.dsp - 1,
                // ? sectionError.statement - 1
                // : 0,
              });
            }
          } else if (formData && formData[event.target.name]) {
            item.error = true;
            setSectionError({
              ...sectionError,
              dsp: sectionError.dsp + 1,
              //  ? sectionError.statement + 1 : 0,
            });
          }
        });
      } else if (
        AgreementDetails.find(
          (item) => item.key === event.target.name && item.isMandatory,
        ) ||
        event.target.name === 'address' ||
        event.target.name === 'state' ||
        event.target.name === 'city' ||
        event.target.name === 'zip_code'
      ) {
        return AgreementDetails.forEach((item) => {
          if (item.key !== 'contract_address') {
            if (event && event.target && event.target.value) {
              if (
                item.key === event.target.name &&
                !(formData && formData[item.key])
              ) {
                item.error = false;

                setSectionError({
                  ...sectionError,
                  agreement: sectionError.agreement - 1,
                  // ? sectionError.agreement - 1
                  // : 0,
                });
              }
            } else if (formData && formData[event.target.name]) {
              item.error = true;

              setSectionError({
                ...sectionError,
                agreement: sectionError.agreement + 1,
                // ? sectionError.agreement + 1
                // : 0,
              });
            }
          } else {
            return (
              item &&
              item.sections.forEach((subItem) => {
                if (event && event.target && event.target.value) {
                  if (
                    subItem.key === event.target.name &&
                    !(formData && formData[subItem.key]) &&
                    event.target.value
                  ) {
                    subItem.error = false;

                    setSectionError({
                      ...sectionError,
                      agreement: sectionError.agreement - 1,
                      // ? sectionError.agreement - 1
                      // : 0,
                    });
                  }
                } else if (formData && formData[event.target.name]) {
                  subItem.error = true;
                  setSectionError({
                    ...sectionError,
                    agreement: sectionError.agreement + 1,
                    // ? sectionError.agreement + 1
                    // : 0,
                  });
                }
              })
            );
          }
          return null;
        });
      }
    }
    return null;
  };

  const handleChange = (event, key, type, val) => {
    showFooter(true);
    clearError(event, key, type);
    if (
      additionalOnetimeSerError.custom_amazon_store_price &&
      key === 'amazon_store_package'
    ) {
      setSectionError({
        ...sectionError,
        statement: sectionError.statement ? sectionError.statement - 1 : 0,
      });

      // if (
      //   formData &&
      //   formData.contract_type &&
      //   formData.contract_type.toLowerCase().includes('one')
      // ) {
      //   setSectionError({
      //     ...sectionError,
      //     agreement: sectionError.agreement ? sectionError.agreement - 1 : 0,
      //   });
      // }
      setAdditionalOnetimeSerError({
        ...additionalOnetimeSerError,
        custom_amazon_store_price: '',
      });
    }
    if (apiError.non_field_errors && key === 'primary_marketplace') {
      setSectionError({
        ...sectionError,
        statement: sectionError.statement ? sectionError.statement - 1 : 0,
      });

      setApiError({
        ...apiError,
        non_field_errors: '',
      });
    }

    if (type === 'quantity') {
      // setSectionError({
      //   ...sectionError,
      //   statement: sectionError.statement ? sectionError.statement - 1 : 0,
      // });
      if (
        formData &&
        formData.contract_type &&
        formData.contract_type.toLowerCase().includes('one')
      ) {
        // setSectionError({
        //   ...sectionError,
        //   agreement: sectionError.agreement ? sectionError.agreement : 0,
        // });
      }
      clearOneTimeQntyError(val);
    }

    if (type === 'date') {
      setStartDate(event);
      setFormData({ ...formData, [key]: dayjs(event).format('YYYY-MM-DD') });
      setUpdatedFormData({
        ...updatedFormData,
        [key]: dayjs(event).format('YYYY-MM-DD'),
      });
    } else if (type === 'choice') {
      if (key === 'primary_marketplace') {
        setAdditionalMarketplaces(
          marketPlaces.filter((op) => op.value !== event.value),
        );
        // setMarketPlaces();
      }

      setFormData({ ...formData, [key]: event.value });
      setUpdatedFormData({ ...updatedFormData, [key]: event.value });
    } else if (type === 'qty') {
      setFormData({ ...formData, quantity: event.target.value });
      setUpdatedFormData({
        ...updatedFormData,
        quantity: event.target.value,
      });
    } else if (key === 'additional_marketplaces_checkbox') {
      if (event.target.checked) {
        setFormData({
          ...formData,
          additional_marketplaces: [],
        });

        if (
          agreementData &&
          agreementData.primary_marketplace &&
          agreementData.primary_marketplace.name
        ) {
          setAdditionalMarketplaces(
            marketplacesResult.filter(
              (op) => op.value !== agreementData.primary_marketplace.name,
            ),
          );
        } else {
          setAdditionalMarketplaces(marketplacesResult);
        }

        // }

        // if (
        //   originalData &&
        //   originalData.additional_marketplaces &&
        //   originalData.additional_marketplaces.length
        // ) {
        //   additionalMarketplacesData.create =
        //     originalData.additional_marketplaces;
        //   additionalMarketplacesData.delete = [];

        //   setFormData({
        //     ...formData,
        //     additional_marketplaces: additionalMarketplacesData.create,
        //   });
        // }

        // if (originalData.additional_marketplaces) {
        //   setMarketPlaces(
        //     marketplacesResult.filter(
        //       (choice) =>
        //         !originalData.additional_marketplaces.some(
        //           (item) => item.name === choice.value,
        //         ),
        //     ),
        //   );
        // } else {
        //   setMarketPlaces(marketplacesResult);
        // }
      } else {
        const itemsToBeDelete =
          additionalMarketplacesData &&
          additionalMarketplacesData.create &&
          additionalMarketplacesData.create.length &&
          additionalMarketplacesData.create.filter((item) => {
            if (item.id) {
              return item;
            }
            return null;
          });
        if (itemsToBeDelete && itemsToBeDelete.length) {
          const list = itemsToBeDelete.map((item) => item.id);
          additionalMarketplacesData.delete = list;
          additionalMarketplacesData.create = [];
        }

        setFormData({
          ...formData,
          additional_marketplaces: [],
        });
      }

      setUpdatedFormData({
        ...updatedFormData,
        additional_marketplaces: additionalMarketplacesData,
      });
      setAdditionalMarketplace({
        ...additionalMarketplacesData,
      });

      setMarketPlaces(marketplacesResult);

      // if (updatedCreateList) {
      //   setMarketPlaces(
      //     marketplacesResult.filter(
      //       (choice) =>
      //         !updatedCreateList.some((item) => item.name === choice.value),
      //     ),
      //   );
      // }
    } else if (type === 'multichoice') {
      // setFormData({ ...formData, [key]: event });
      // setUpdatedFormData({ ...updatedFormData, [key]: event });

      if (val.action === 'select-option') {
        // setMarketPlaces(
        //   // additionalMarketplaces.filter((op) => op.value !== val.option.value),
        //   formData && formData.additional_marketplaces.filter((op) => op.value !== val.option.value),
        // );
        const itemInFormData =
          originalData &&
          originalData.additional_marketplaces &&
          originalData.additional_marketplaces.length &&
          originalData.additional_marketplaces.find(
            (item) => item && item.name === val.option.value,
          );
        // checked whether checked item present in newly created list
        // if (
        //   additionalMarketplacesData &&
        //   additionalMarketplacesData.create &&
        //   additionalMarketplacesData.create.length
        // ) {
        if (
          additionalMarketplacesData &&
          additionalMarketplacesData.create &&
          additionalMarketplacesData.create.find(
            (item) =>
              item.name
                ? item.name === val.option.value
                : item.value === val.option.value,
            // item.name === val.option.value,
          )
        ) {
          // if checked item is already present in newly created list then don't do anything
        } else {
          // if checked item not found in newly created list then  again check whether it is present in original formData variable because if it is found in formData then we need to add that found item in newly created list bcoz we need id and all of that item to push in newly created list.

          // here we check whether checked item present in orginal formDAta list then add that found item in newly created list
          if (itemInFormData) {
            additionalMarketplacesData.create.push(itemInFormData);
            const list = formData.additional_marketplaces;
            list.push(itemInFormData);
            setFormData({
              ...formData,
              additional_marketplaces: list,
            });

            setUpdatedFormData({
              ...updatedFormData,
              additional_marketplaces: additionalMarketplacesData,
            });
          }
          // else we create dict as BE required for new item and we push that in newly created list
          else {
            additionalMarketplacesData.create.push({
              name: val.option.value,
              contract_id: originalData && originalData.id,
            });
            // let list = formData.additional_marketplaces;
            // if (!list) {
            //   list = [];
            // }
            // list.push({
            //   name: val.option.value,
            //   contract_id: originalData && originalData.id,
            // });
            setFormData({
              ...formData,
              additional_marketplaces: additionalMarketplacesData.create,
            });
            setUpdatedFormData({
              ...updatedFormData,
              additional_marketplaces: additionalMarketplacesData,
            });
          }

          // here we fnally update state variable
          setAdditionalMarketplace({
            ...additionalMarketplacesData,
          });
        }
        // }

        // suppose checked item present in original formData then we have to remove its id from newly created delete list.

        if (itemInFormData) {
          const updatedDeleteList = additionalMarketplacesData.delete.filter(
            (item) => item !== itemInFormData.id,
          );
          additionalMarketplacesData.delete = updatedDeleteList;
        }

        setAdditionalMarketplace({
          ...additionalMarketplacesData,
        });

        if (additionalMarketplacesData.create) {
          setMarketPlaces(
            marketplacesResult.filter(
              (choice) =>
                !additionalMarketplacesData.create.some(
                  (item) => item.name === choice.value,
                ),
            ),
          );
        }
      }
      if (val.action === 'remove-value') {
        const itemInFormData =
          originalData &&
          originalData.additional_marketplaces &&
          originalData.additional_marketplaces.length &&
          originalData.additional_marketplaces.find(
            (item) => item && item.name === val.removedValue.value,
          );

        // if unchecked item found in original list then add its id to newly created delte list
        if (itemInFormData && itemInFormData.id) {
          additionalMarketplacesData.delete.push(itemInFormData.id);
        }

        // now we filter newly created list with removed unchecked item from it
        const updatedCreateList = additionalMarketplacesData.create.filter(
          (item) =>
            item.name
              ? item.name !== val.removedValue.value
              : item.value !== val.removedValue.value,
        );

        additionalMarketplacesData.create = updatedCreateList;

        const list = formData.additional_marketplaces;
        const deletedUncheckedItemList = list.filter((item) =>
          item.name
            ? item.name !== val.removedValue.value
            : item.value !== val.removedValue.value,
        );

        setFormData({
          ...formData,
          additional_marketplaces: deletedUncheckedItemList,
        });

        setUpdatedFormData({
          ...updatedFormData,
          additional_marketplaces: additionalMarketplacesData,
        });

        setAdditionalMarketplace({
          ...additionalMarketplacesData,
        });

        if (updatedCreateList) {
          setMarketPlaces(
            marketplacesResult.filter(
              (choice) =>
                !updatedCreateList.some((item) => item.name === choice.value),
            ),
          );
        }
        // if (
        //   !(
        //     formData &&
        //     formData.additional_marketplace &&
        //     formData.additional_marketplace.length
        //   )
        // ) {
        //   setShowAdditionalMarketplace(false);
        // }
      }
    } else if (key === 'additional_monthly_services') {
      const itemInFormData =
        originalData &&
        originalData.additional_monthly_services &&
        originalData.additional_monthly_services.length &&
        originalData.additional_monthly_services.find(
          (item) =>
            item && item.service && item.service.name === event.target.name,
        );

      // if item checked
      if (event.target.checked) {
        if (event.target.name === 'DSP Advertising') {
          setShowCollpase({ ...showSection, dspAddendum: true });
        }
        // if (
        //   additionalMonthlyServices &&
        //   additionalMonthlyServices.create &&
        //   additionalMonthlyServices.create.length
        // ) {
        // checked whether checked item present in newly created list
        if (
          additionalMonthlyServices &&
          additionalMonthlyServices.create &&
          additionalMonthlyServices.create.length &&
          additionalMonthlyServices.create.find((item) =>
            item.name
              ? item.name === event.target.name
              : item.service.name === event.target.name,
          )
        ) {
          // if checked item is already present in newly created list then don't do anything
        } else {
          // if checked item not found in newly created list then  again check whether it is present in original formData variable because if it is found in formData then we need to add that found item in newly created list bcoz we need id and all of that item to push in newly created list.

          // here we check whether checked item present in orginal formDAta list then add that found item in newly created list
          if (itemInFormData) {
            additionalMonthlyServices.create.push(itemInFormData);
            const list = formData.additional_monthly_services;
            list.push(itemInFormData);
            setFormData({
              ...formData,
              additional_monthly_services: list,
            });

            setUpdatedFormData({
              ...updatedFormData,
              additional_monthly_services: additionalMonthlyServices,
            });
          }
          // else we create dict as BE required for new item and we push that in newly created list
          else {
            additionalMonthlyServices.create.push({
              name: event.target.name,
              service_id: val.value,
              contract_id: originalData && originalData.id,
            });

            let list = formData.additional_monthly_services;
            if (!list) {
              list = [];
            }
            list.push({
              name: event.target.name,
              service_id: val.value,
              contract_id: originalData && originalData.id,
            });
            setFormData({
              ...formData,
              additional_monthly_services: list,
            });
            setUpdatedFormData({
              ...updatedFormData,
              additional_monthly_services: additionalMonthlyServices,
            });
          }

          // here we fnally update state variable
          setMonthlyAdditionalServices({
            ...additionalMonthlyServices,
          });
        }
        // }

        // suppose checked item present in original formData then we have to remove its id from newly created delete list.

        if (itemInFormData) {
          const updatedDeleteList = additionalMonthlyServices.delete.filter(
            (item) => item !== itemInFormData.id,
          );
          additionalMonthlyServices.delete = updatedDeleteList;
        }

        setMonthlyAdditionalServices({
          ...additionalMonthlyServices,
        });
        fetchUncommonOptions(
          monthlyService,
          additionalMonthlyServices.create,
          'monthly_service',
        );
      }
      // if item unchecked or removed
      else {
        if (event.target.name === 'DSP Advertising') {
          setShowCollpase({ ...showSection, dspAddendum: false });
        }

        // if unchecked item found in original list then add its id to newly created delte list
        if (itemInFormData) {
          additionalMonthlyServices.delete.push(itemInFormData.id);
        }

        // now we filter newly created list with removed unchecked item from it
        const updatedCreateList = additionalMonthlyServices.create.filter(
          (item) =>
            item.name
              ? item.name !== event.target.name
              : item.service.name !== event.target.name,
        );

        additionalMonthlyServices.create = updatedCreateList;

        const list = formData.additional_monthly_services;
        const deletedUncheckedItemList = list.filter((item) =>
          item.name
            ? item.name !== event.target.name
            : item.service.name !== event.target.name,
        );

        setFormData({
          ...formData,
          additional_monthly_services: deletedUncheckedItemList,
        });

        setUpdatedFormData({
          ...updatedFormData,
          additional_monthly_services: additionalMonthlyServices,
        });

        setMonthlyAdditionalServices({
          ...additionalMonthlyServices,
        });
        fetchUncommonOptions(
          monthlyService,
          additionalMonthlyServices.create,
          'monthly_service',
        );
      }
    } else if (key === 'amazon_store_package') {
      if (type === 'quantity') {
        const selectedData =
          additionalOnetimeServices &&
          additionalOnetimeServices.create &&
          additionalOnetimeServices.create.length &&
          additionalOnetimeServices.create.filter((item) => {
            if (
              item.name
                ? item.name.includes('Amazon Store Package')
                : item.service.name.includes('Amazon Store Package')
            ) {
              if (event.target.value) {
                item.quantity = parseInt(event.target.value, 10);
              } else {
                item.quantity = 1;
              }
            }
            return item;
          });

        if (selectedData) {
          setFormData({
            ...formData,
            additional_one_time_services: selectedData,
          });

          setAdditionalOnetimeServices({
            ...additionalOnetimeServices,
            create: selectedData,
          });
          setUpdatedFormData({
            ...updatedFormData,
            additional_one_time_services: {
              ...additionalOnetimeServices,
              create: selectedData,
            },
          });
        }
      }

      if (type === 'dropdown') {
        let selectedData = [];
        selectedData =
          additionalOnetimeServices &&
          additionalOnetimeServices.create &&
          additionalOnetimeServices.create.length &&
          additionalOnetimeServices.create.filter((item) => {
            if (
              !(item.name
                ? item.name.includes('Amazon Store Package')
                : item.service.name.includes('Amazon Store Package'))
            ) {
              return item;
              //  item.quantity = event.target.value;
            }
            return false;
          });

        const itemInOriginalData =
          originalData &&
          originalData.additional_one_time_services &&
          originalData.additional_one_time_services.length &&
          originalData.additional_one_time_services.find((item) =>
            item.name
              ? item.name.includes('Amazon Store Package')
              : item.service.name.includes('Amazon Store Package'),
          );

        if (
          itemInOriginalData &&
          itemInOriginalData.service &&
          itemInOriginalData.service.name.includes(event.label)
        ) {
          selectedData.push(itemInOriginalData);
        } else if (event.label === 'Custom') {
          if (selectedData === 0) {
            selectedData = [];
          }
          selectedData.push({
            name: `Amazon Store Package ${event.label}`,
            quantity: 1,
            service_id: event.value,
            contract_id: originalData && originalData.id,
            // custom_amazon_store_price: 0,
          });
        } else {
          if (selectedData === 0) {
            selectedData = [];
          }
          selectedData.push({
            name: `Amazon Store Package ${event.label}`,
            quantity: 1,
            service_id: event.value,
            contract_id: originalData && originalData.id,
          });
        }

        setFormData({
          ...formData,
          additional_one_time_services: selectedData,
        });

        additionalOnetimeServices.create = selectedData;

        setAdditionalOnetimeServices({
          ...additionalOnetimeServices,
        });

        setUpdatedFormData({
          ...updatedFormData,
          additional_one_time_services: {
            ...additionalOnetimeServices,
            create: selectedData,
          },
        });

        if (
          itemInOriginalData &&
          itemInOriginalData.service &&
          itemInOriginalData.service.name.includes(event.label)
        ) {
          if (
            additionalOnetimeServices.delete.find(
              (item) => item === itemInOriginalData.id,
            )
          ) {
            const list = additionalOnetimeServices.delete.filter(
              (item) => item !== itemInOriginalData.id,
            );
            additionalOnetimeServices.delete = list;
          }
        } else if (itemInOriginalData) {
          if (
            additionalOnetimeServices.delete.find(
              (item) => item === itemInOriginalData.id,
            )
          ) {
            // console
          } else {
            additionalOnetimeServices.delete.push(itemInOriginalData.id);
          }
        }
        setUpdatedFormData({
          ...updatedFormData,
          additional_one_time_services: {
            ...additionalOnetimeServices,
          },
        });
        setAdditionalOnetimeServices({
          ...additionalOnetimeServices,
        });

        // remove Amazon Store Package entries from notincludedService
        const listWithoutAmazonStorePack = notIncludedOneTimeServices.filter(
          (item) => !item.label.includes('Amazon Store Package'),
        );
        setNotIncludedOneTimeServices(listWithoutAmazonStorePack);
      }

      if (type === 'custom_amazon_store_price') {
        const itemInList =
          additionalOnetimeServices &&
          additionalOnetimeServices.create &&
          additionalOnetimeServices.create.length &&
          additionalOnetimeServices.create.find((item) =>
            item.name
              ? item.name.includes('Amazon Store Package')
              : item.service.name.includes('Amazon Store Package'),
          );

        if (itemInList) {
          if (event.target.value && event.target.value.includes('$')) {
            let value = event.target.value.slice(1);
            value = value.replace(/,/g, '');
            itemInList[event.target.name] = value;
          } else {
            itemInList[event.target.name] = event.target.value;
          }
        }

        setFormData({
          ...formData,
          additional_one_time_services: additionalOnetimeServices.create,
        });
        setUpdatedFormData({
          ...updatedFormData,
          additional_one_time_services: {
            ...additionalOnetimeServices,
          },
        });
        setAdditionalOnetimeServices({
          ...additionalOnetimeServices,
        });
      }

      if (type === 'checkbox') {
        if (event.target.checked) {
          const itemInOriginalData =
            originalData &&
            originalData.additional_one_time_services &&
            originalData.additional_one_time_services.length &&
            originalData.additional_one_time_services.find((item) =>
              item.name
                ? item.name.includes('Amazon Store Package')
                : item.service.name.includes('Amazon Store Package'),
            );
          // console.log('in amazon checked', itemInOriginalData);

          if (itemInOriginalData) {
            additionalOnetimeServices.create.push(itemInOriginalData);

            const list = additionalOnetimeServices.delete.filter(
              (item) => item !== itemInOriginalData.id,
            );

            additionalOnetimeServices.delete = list;

            setFormData({
              ...formData,
              additional_one_time_services: additionalOnetimeServices.create,
            });

            setUpdatedFormData({
              ...updatedFormData,
              additional_one_time_services: {
                ...additionalOnetimeServices,
              },
            });

            setAdditionalOnetimeServices({
              ...additionalOnetimeServices,
            });

            // if item selected and if it is custom then show price input field else not
            if (
              itemInOriginalData && itemInOriginalData.name
                ? itemInOriginalData &&
                  itemInOriginalData.name.includes(
                    'Amazon Store Package Custom',
                  )
                : itemInOriginalData &&
                  itemInOriginalData.service &&
                  itemInOriginalData.service.name.includes(
                    'Amazon Store Package Custom',
                  )
            ) {
              setAmazonStoreCustom(true);
              //
            } else {
              setAmazonStoreCustom(false);
            }
          } else {
            // const defaultVar = oneTimeService.find((item) =>
            //   item.label.includes('Amazon Store Package Basic'),
            // );
            additionalOnetimeServices.create.push({
              name: `Amazon Store Package`,
              quantity: 1,
              // service_id: defaultVar.value,
              contract_id: originalData && originalData.id,
            });

            // const list = additionalOnetimeServices.delete.filter(
            //   (item) => item !== itemInOriginalData && itemInOriginalData.id,
            // );

            // additionalOnetimeServices.delete = list;

            setFormData({
              ...formData,
              additional_one_time_services: additionalOnetimeServices.create,
            });

            setUpdatedFormData({
              ...updatedFormData,
              additional_one_time_services: {
                ...additionalOnetimeServices,
              },
            });

            setAdditionalOnetimeServices({
              ...additionalOnetimeServices,
            });
            // if item not already exist in orginal data then it will be new so dont show custom price input if you choose any amazon service
            // then custom price input condition will get handle in onchange of drop down of basic ,plus, and custom
            setAmazonStoreCustom(false);
          }

          // remove Amazon Store Package entries from notincludedService
          const listWithoutAmazonStorePack = notIncludedOneTimeServices.filter(
            (item) => !item.label.includes('Amazon Store Package'),
          );
          setNotIncludedOneTimeServices(listWithoutAmazonStorePack);
        } else {
          const itemInList =
            additionalOnetimeServices &&
            additionalOnetimeServices.create &&
            additionalOnetimeServices.create.length &&
            additionalOnetimeServices.create.find((item) =>
              item.name
                ? item.name.includes('Amazon Store Package')
                : item.service.name.includes('Amazon Store Package'),
            );
          if (itemInList) {
            const removedEle =
              additionalOnetimeServices &&
              additionalOnetimeServices.create &&
              additionalOnetimeServices.create.length &&
              additionalOnetimeServices.create.filter((item) =>
                item.name
                  ? item.name !==
                    (itemInList.name
                      ? itemInList.name
                      : itemInList.service.name)
                  : item.service.name !==
                    (itemInList.name
                      ? itemInList.name
                      : itemInList.service.name),
              );

            additionalOnetimeServices.create = removedEle;

            if (itemInList.id) {
              additionalOnetimeServices.delete.push(itemInList.id);
            }

            setFormData({
              ...formData,
              additional_one_time_services: additionalOnetimeServices.create,
            });
            // additionalOnetimeServices.delete.push(itemInList.id);

            setUpdatedFormData({
              ...updatedFormData,
              additional_one_time_services: {
                ...additionalOnetimeServices,
              },
            });

            setAdditionalOnetimeServices({
              ...additionalOnetimeServices,
            });
          }

          // if previously custom service is selected then when we uncheck this Amazon Store PAckage then we need to disable 'custom store price' input
          if (
            itemInList && itemInList.name
              ? itemInList &&
                itemInList.name.includes('Amazon Store Package Custom')
              : itemInList &&
                itemInList.service &&
                itemInList.service.name.includes('Amazon Store Package Custom')
          ) {
            //
          } else {
            setAmazonStoreCustom(false);
          }

          // add amazon Store package to notIncludedService array
          // const listWithAmazonStorePAck = oneTimeService.filter((item) =>
          //   item.label.includes('Amazon Store Package'),
          // );
          if (
            notIncludedOneTimeServices.find((item) =>
              item.label.includes('Amazon Store Package'),
            )
          ) {
            // don't do anything
          } else {
            setNotIncludedOneTimeServices(
              notIncludedOneTimeServices.concat([
                {
                  value: 'Amazon Store Package',
                  label: 'Amazon Store Package',
                },
              ]),
            );
          }
        }
      }
    } else if (key === 'additional_one_time_services') {
      let itemInFormData = {};

      itemInFormData =
        originalData &&
        originalData.additional_one_time_services &&
        originalData.additional_one_time_services.length &&
        originalData.additional_one_time_services.find(
          (item) =>
            item && item.service && item.service.name === event.target.name,
        );

      if (type === 'quantity') {
        const selectedItem =
          additionalOnetimeServices &&
          additionalOnetimeServices.create &&
          additionalOnetimeServices.create.length &&
          additionalOnetimeServices.create.filter((item) => {
            if (
              item.name
                ? item.name === event.target.name
                : item.service.name === event.target.name
            ) {
              if (event.target.value) {
                item.quantity = parseInt(event.target.value, 10);
              } else {
                item.quantity = 1;
              }
            }
            return item;
          });

        if (selectedItem) {
          setFormData({
            ...formData,
            additional_one_time_services: selectedItem,
          });

          setUpdatedFormData({
            ...updatedFormData,
            additional_one_time_services: additionalOnetimeServices,
          });
        }
      }
      // if item checked
      else if (event.target.checked) {
        // checked whether checked item present in newly created list

        if (
          additionalOnetimeServices &&
          additionalOnetimeServices.create &&
          additionalOnetimeServices.create.length &&
          additionalOnetimeServices.create.find((item) =>
            item.name
              ? item.name === event.target.name
              : item.service.name === event.target.name,
          )
        ) {
          // if checked item is already present in newly created list then don't do anything
        } else {
          // if checked item not found in newly created list then  again check whether it is present in original formData variable because if it is found in formData then we need to add that found item in newly created list bcoz we need id and all of that item to push in newly created list.

          // here we check whether checked item present in orginal formDAta list then add that found item in newly created list
          if (itemInFormData) {
            if (
              additionalOnetimeServices &&
              additionalOnetimeServices.create &&
              additionalOnetimeServices.create.length &&
              additionalOnetimeServices.create.find((item) =>
                item.name
                  ? item.name === itemInFormData.service.name
                  : item.service.name === itemInFormData.service.name,
              )
            ) {
              // !!!
            } else {
              additionalOnetimeServices.create.push(itemInFormData);

              // const list = formData.additional_one_time_services;
              // list.push(itemInFormData);
              setFormData({
                ...formData,
                additional_one_time_services: additionalOnetimeServices.create,
              });

              setUpdatedFormData({
                ...updatedFormData,
                additional_one_time_services: additionalOnetimeServices,
              });
              // console.log('original data found', additionalOnetimeServices);
            }
          }

          // else we create dict as BE required for new item and we push that in newly created list
          else if (
            additionalOnetimeServices &&
            additionalOnetimeServices.create &&
            additionalOnetimeServices.create.length &&
            additionalOnetimeServices.create.find((item) =>
              item.service_id
                ? item.service_id === val.value
                : item.service && item.service.id === val.value,
            )
          ) {
            //
          } else {
            additionalOnetimeServices.create.push({
              name: event.target.name,
              service_id: val.value,
              contract_id: originalData && originalData.id,
              quantity: 1,
            });

            // let list = formData.additional_one_time_services;
            // if (!list) {
            //   list = [];
            // }
            // list.push({
            //   name: event.target.name,
            //   service_id: val.value,
            //   contract_id: originalData && originalData.id,
            //   quantity: 1,
            // });
            setFormData({
              ...formData,
              additional_one_time_services: additionalOnetimeServices.create,
            });

            setUpdatedFormData({
              ...updatedFormData,
              additional_one_time_services: additionalOnetimeServices,
            });
          }

          // here we fnally update state variable
          setAdditionalOnetimeServices({
            ...additionalOnetimeServices,
          });
        }
        // }

        // suppose checked item present in original formData then we have to remove its id from newly created delete list.

        if (itemInFormData) {
          const updatedDeleteList = additionalOnetimeServices.delete.filter(
            (item) => item !== itemInFormData.id,
          );
          additionalOnetimeServices.delete = updatedDeleteList;
        }

        setAdditionalOnetimeServices({
          ...additionalOnetimeServices,
        });

        fetchUncommonOptions(
          oneTimeService,
          additionalOnetimeServices.create,
          'one_time_service',
        );
      }
      // if item unchecked or removed
      else {
        // if unchecked item found in original list then add its id to newly created delte list
        if (itemInFormData) {
          additionalOnetimeServices.delete.push(itemInFormData.id);
        }

        // now we filter newly created list with removed unchecked item from it
        const updatedCreateList = additionalOnetimeServices.create.filter(
          (item) =>
            item.name
              ? item.name !== event.target.name
              : item.service.name !== event.target.name,
        );

        additionalOnetimeServices.create = updatedCreateList;

        const list = formData.additional_one_time_services;
        const deletedUncheckedItemList = list.filter((item) =>
          item.name
            ? item.name !== event.target.name
            : item.service.name !== event.target.name,
        );

        setFormData({
          ...formData,
          additional_one_time_services: deletedUncheckedItemList,
        });

        setUpdatedFormData({
          ...updatedFormData,
          additional_one_time_services: additionalOnetimeServices,
        });

        setAdditionalOnetimeServices({
          ...additionalOnetimeServices,
        });
      }

      fetchUncommonOptions(
        oneTimeService,
        additionalOnetimeServices.create,
        'one_time_service',
      );
      // }
    } else {
      if (event.target.name === 'zip_code') {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value.trim(),
        });
        setUpdatedFormData({
          ...updatedFormData,
          [event.target.name]: event.target.value.trim(),
        });
      } else if (event.target.value.includes('$')) {
        let value = event.target.value.slice(1);
        if (event.target.name === 'dsp_fee') {
          value = value.replace(/,/g, '');
        }
        setFormData({
          ...formData,
          [event.target.name]: value,
        });
        setUpdatedFormData({
          ...updatedFormData,
          [event.target.name]: value,
        });
      } else if (
        event.target.name === 'monthly_retainer' &&
        event.target.value === ''
      ) {
        setFormData({ ...formData, [event.target.name]: null });
        setUpdatedFormData({
          ...updatedFormData,
          [event.target.name]: null,
        });
      } else {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        setUpdatedFormData({
          ...updatedFormData,
          [event.target.name]: event.target.value,
        });
      }
      // }
      if (
        Object.keys(apiError).includes('non_field_errors') ||
        Object.keys(apiError).includes(event.target.name)
      ) {
        // setSectionError({
        //   ...sectionError,
        //   statement: sectionError.statement ? sectionError.statement - 1 : 0,
        // });

        setApiError({
          ...apiError,
          [event.target.name]: '',
        });
      }
      if (
        additionalMarketplaceError &&
        Object.keys(additionalMarketplaceError).includes(event.target.name)
      ) {
        // setSectionError({
        //   ...sectionError,
        //   statement: sectionError.statement ? sectionError.statement - 1 : 0,
        // });

        setAdditionalMarketplaceError({
          ...additionalMarketplaceError,
          [additionalMarketplaceError]: '',
        });
      }

      if (
        additionalMonthlySerError &&
        Object.keys(additionalMonthlySerError).includes(event.target.name)
      ) {
        // setSectionError({
        //   ...sectionError,
        //   statement: sectionError.statement ? sectionError.statement - 1 : 0,
        // });

        setAdditionalMonthlySerError({
          ...additionalMonthlySerError,
          [event.target.name]: '',
        });
      }

      if (
        additionalOnetimeSerError &&
        Object.keys(additionalOnetimeSerError).includes(event.target.name)
      ) {
        // setSectionError({
        //   ...sectionError,
        //   statement: sectionError.statement ? sectionError.statement - 1 : 0,
        // });

        setAdditionalOnetimeSerError({
          ...additionalOnetimeSerError,
          [event.target.name]: '',
        });
      }
      if (
        contractError &&
        Object.keys(contractError).includes(event.target.name)
      ) {
        if (
          event.target.name === 'zip_code' &&
          contractError &&
          contractError.zip_code
        ) {
          if (event.target.value) {
            setSectionError({
              ...sectionError,
              agreement: sectionError.agreement
                ? sectionError.agreement - 1
                : 0,
            });
          } else {
            setSectionError({
              ...sectionError,
              agreement: sectionError.agreement ? sectionError.agreement : 0,
            });
          }
        }
        if (
          event.target.name === 'dsp_fee' &&
          contractError &&
          contractError.dsp_fee
        ) {
          if (event.target.value) {
            setSectionError({
              ...sectionError,
              dsp: sectionError.dsp ? sectionError.dsp - 1 : 0,
            });
          } else {
            setSectionError({
              ...sectionError,
              dsp: sectionError.dsp ? sectionError.dsp : 0,
            });
          }
        }

        setContractError({
          ...contractError,
          [event.target.name]: '',
        });
      }
    }
  };

  const mapSelectValues = (item) => {
    const multi = [];
    if (formData && formData[item.key] && formData[item.key].length) {
      for (const month of formData[item.key]) {
        multi.push({
          label:
            item.key === 'additional_marketplaces'
              ? month.name
              : month.service.name,
          value:
            item.key === 'additional_marketplaces'
              ? month.name
              : month.service.id,
        });
      }
      return multi;
    }
    return formData && formData[item.key];
  };

  const getOptions = (key, type) => {
    if (type === 'multi') {
      if (key === 'additional_marketplaces') return additionalMarketplaces;
      if (key === 'additional_monthly_services') return monthlyService;
      // if (monthlyService && monthlyService.length) return monthlyService;
    }
    if (key === 'rev_share') return revShare;
    if (key === 'primary_marketplace') return marketPlaces;
    if (key === 'additional_one_time_services') return oneTimeService;
    return accountLength;
  };

  const getContractStatusData = (type) => {
    const status =
      (agreementData &&
        agreementData.contract_status &&
        agreementData.contract_status.value) ||
      '';
    let statusClass = '';
    let statusSrc = '';
    let dispalyStatus = '';

    if (status !== '') {
      switch (status) {
        case 'pending contract':
          statusClass = 'pending-contract';
          statusSrc = FileIcon;
          dispalyStatus = 'Pending Contract';
          break;

        case 'pending contract approval':
          statusClass = '';
          statusSrc = CheckFileIcon;
          dispalyStatus = 'Pending Approval';
          break;

        case 'pending contract signature':
          statusClass = 'pending-signature';
          statusSrc = EditFileIcon;
          dispalyStatus = 'Pending Signature';
          break;

        case 'pending account setup':
          statusClass = 'signature';
          statusSrc = SignatureIcon;
          dispalyStatus = 'Signed';
          break;

        case 'active':
          statusClass = 'signature';
          statusSrc = SignatureIcon;
          dispalyStatus = 'Signed';
          break;

        case 'inactive':
          statusClass = '';
          statusSrc = '';
          dispalyStatus = 'Inactive';
          break;

        default:
          statusClass = 'pending-contract';
          statusSrc = 'FileIcon';
          dispalyStatus = 'Signed';
          break;
      }
    }

    if (type === 'class') {
      return statusClass;
    }
    if (type === 'src') {
      return statusSrc;
    }
    if (type === 'status') {
      return dispalyStatus;
    }
    return '';
  };

  const generateMultiChoice = (item) => {
    return (
      <Select
        classNamePrefix="react-select"
        // styles={customStyles}
        options={getOptions(item.key, 'multi')}
        isMulti
        name={item.key}
        onChange={(event, value) =>
          handleChange(event, item.key, 'multichoice', value)
        }
        defaultValue={mapSelectValues(item)}
        components={{ DropdownIndicator }}
        isClearable={false}
      />
    );
  };

  const generateDropdown = (item) => {
    if (
      // item.key === 'length' &&
      formData &&
      formData.contract_type !== 'one time'
    )
      return (
        <Select
          classNamePrefix={
            (apiError && apiError[item.key]) ||
            (!(formData && formData[item.key]) && item.isMandatory)
              ? 'react-select  form-control-error'
              : 'react-select'
          }
          styles={{
            control: (base, state) => ({
              ...base,
              background:
                (apiError &&
                  apiError.non_field_errors &&
                  apiError.non_field_errors[0] &&
                  item.key === 'primary_marketplace') ||
                (!(formData && formData[item.key]) && item.isMandatory)
                  ? '#FBF2F2'
                  : '#F4F6FC',
              // match with the menu
              // borderRadius: state.isFocused ? '3px 3px 0 0' : 3,
              // Overwrittes the different states of border
              borderColor:
                (apiError &&
                  apiError.non_field_errors &&
                  apiError.non_field_errors[0] &&
                  item.key === 'primary_marketplace') ||
                (!(formData && formData[item.key]) && item.isMandatory)
                  ? '#D63649'
                  : '#D5D8E1',

              // Removes weird border around container
              boxShadow: state.isFocused ? null : null,
              '&:hover': {
                // Overwrittes the different states of border
                boxShadow: state.isFocused ? null : null,
                outlineColor: state.isFocused ? null : null,
              },
            }),
            placeholder: (defaultStyles) => {
              return {
                ...defaultStyles,
                color: '556178',
              };
            },
          }}
          placeholder={item.placeholder ? item.placeholder : 'Select'}
          defaultValue={
            item.key === 'primary_marketplace'
              ? formData.primary_marketplace &&
                formData.primary_marketplace.name
                ? {
                    value: formData.primary_marketplace.name,
                    label: formData.primary_marketplace.name,
                  }
                : formData && formData.primary_marketplace
                ? {
                    value: formData.primary_marketplace,
                    label: formData.primary_marketplace,
                  }
                : null
              : formData[item.key]
          }
          options={getOptions(item.key, 'single')}
          name={item.key}
          components={{ DropdownIndicator }}
          onChange={(event) => handleChange(event, item.key, 'choice')}
        />
      );
    return '';
  };

  const generateHTML = (item) => {
    if (item.type.includes('number')) {
      return (
        <NumberFormat
          className={
            (contractError && contractError[item.key]) ||
            (!(formData && formData[item.key]) && item.isMandatory)
              ? 'form-control form-control-error'
              : 'form-control '
          }
          format={item.key === 'zip_code' ? '##########' : null}
          name={item.key}
          defaultValue={formData[item.key]}
          placeholder={item.placeholder ? item.placeholder : item.label}
          prefix={item.type === 'number-currency' ? '$' : ''}
          suffix={item.type === 'number-percent' ? '%' : ''}
          onChange={(event) => handleChange(event, item.key)}
          thousandSeparator={item.key !== 'zip_code'}
          decimalScale={2}
        />
      );
    }
    if (item.type === 'date') {
      if (
        formData &&
        formData.contract_type &&
        formData.contract_type.toLowerCase().includes('dsp') &&
        item.part === 'dsp'
      ) {
        return (
          <DatePicker
            disabled
            className={
              formData && formData[item.key] && item.isMandatory
                ? 'form-control'
                : 'form-control form-control-error'
            }
            id="date"
            // minDate={
            //   item.key && formData[item.key] && formData[item.key] !== null
            //     ? new Date(formData[item.key])
            //     : new Date()
            // }
            value={firstMonthDate}
            format="MM/dd/yyyy"
            clearIcon={null}
            dayPlaceholder="DD"
            monthPlaceholder="MM"
            yearPlaceholder="YYYY"
            placeholderText="Select Date"
          />
        );
      }

      return (
        <DatePicker
          // disabled={
          //   formData &&
          //   formData.contract_type &&
          //   formData.contract_type.toLowerCase().includes('dsp') &&
          //   item.part === 'dsp'
          // }
          className={
            formData && formData[item.key] && item.isMandatory
              ? 'form-control'
              : 'form-control form-control-error'
          }
          id="date"
          minDate={
            item.key && formData[item.key] && formData[item.key] !== null
              ? new Date(formData[item.key])
              : new Date()
          }
          value={
            startDate ||
            ('' ||
            (item.key && formData[item.key] && formData[item.key] !== null)
              ? new Date(formData[item.key])
              : '')
          }
          onChange={(date) => handleChange(date, 'start_date', 'date')}
          format="MM/dd/yyyy"
          clearIcon={null}
          dayPlaceholder="DD"
          monthPlaceholder="MM"
          yearPlaceholder="YYYY"
          //  formatPlaceholder={{ year: ' y', month: 'M', day: '' }}
          // formatPlaceholder="wide"
          placeholderText="Select Date"
          // {item.placeholder ? item.placeholder : item.label}
        />
      );
    }
    if (item.type === 'choice') {
      return (
        <ContractInputSelect>{generateDropdown(item)}</ContractInputSelect>
      );
    }
    if (item && item.type === 'multichoice') {
      return (
        <ContractInputSelect>{generateMultiChoice(item)}</ContractInputSelect>
      );
    }
    return (
      <input
        className={
          formData && formData[item.key] && item.isMandatory
            ? 'form-control'
            : 'form-control form-control-error'
        }
        type="text"
        placeholder={item.placeholder ? item.placeholder : item.label}
        onChange={(event) => handleChange(event, item.key)}
        name={item.key}
        defaultValue={formData[item.key]}
      />
    );
    // }
  };

  const showRightTick = (section) => {
    if (section === 'service_agreement') {
      if (
        formData &&
        formData.contract_type &&
        formData.contract_type.toLowerCase().includes('one')
      ) {
        if (
          formData &&
          formData.contract_company_name &&
          formData.start_date &&
          formData.address &&
          formData.state &&
          formData.city &&
          formData.zip_code
        ) {
          return true;
        }
      } else if (
        formData &&
        formData.contract_company_name &&
        formData.start_date &&
        formData.length &&
        formData.address &&
        formData.state &&
        formData.city &&
        formData.zip_code
      ) {
        return true;
      }
    }

    if (section === 'statement') {
      if (
        !(
          formData &&
          formData.contract_type &&
          formData.contract_type.toLowerCase().includes('one')
        )
      ) {
        if (
          formData &&
          formData.monthly_retainer &&
          formData.primary_marketplace &&
          formData.rev_share
          //  &&
          // formData.sales_threshold
        ) {
          return true;
        }
      } else return true;
    }

    if (section === 'dspAddendum') {
      if (
        showSection &&
        showSection.dspAddendum &&
        !(
          formData &&
          formData.contract_type &&
          formData.contract_type.toLowerCase().includes('one')
        )
      ) {
        if (
          formData &&
          formData.start_date &&
          formData.dsp_fee &&
          formData.dsp_length
        ) {
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  };

  const nextStep = (key) => {
    if (key === 'statement') {
      setOpenCollapse({
        agreement: false,
        statement: true,
        dspAddendum: false,
        addendum: false,
      });
      executeScroll('statement');
    }
    if (key === 'dspAddendum') {
      setOpenCollapse({
        ...openCollapse,
        agreement: false,
        statement: false,
        dspAddendum: true,
        addendum: false,
      });
      executeScroll('dspAddendum');
    }
    if (key === 'addendum') {
      // if (showSection.addendum) {
      setOpenCollapse({
        ...openCollapse,
        agreement: false,
        statement: false,
        dspAddendum: false,
        addendum: true,
      });
      executeScroll('addendum');
      // }
    }
    if (key === 'final') {
      if (newAddendumData) {
        const addendumData = {
          customer_id: id,
          addendum: newAddendumData && newAddendumData.addendum,
          contract: agreementData.id,
        };
        setIsLoading({ loader: true, type: 'button' });

        createAddendum(addendumData).then((res) => {
          setIsLoading({ loader: false, type: 'button' });
          if (res && res.status === 201) {
            setNewAddendum(res && res.data);
            setOpenCollapse({
              ...openCollapse,
              statement: false,
              dspAddendum: false,
              addendum: true,
            });
            executeScroll('addendum');
            setShowEditor(false);
            setOriginalAddendumData(res && res.data);
          }
        });
      }
    }
  };
  const changeQuantity = (oneTimeServiceData, flag) => {
    showFooter(true);
    // setSectionError({ ...sectionError, statement: 0 });
    // if (
    //   formData &&
    //   formData.contract_type &&
    //   formData.contract_type.toLowerCase().includes('one')
    // ) {
    //   setSectionError({ ...sectionError, agreement: 0 });
    // }

    clearOneTimeQntyError(oneTimeServiceData);
    if (
      formData &&
      formData.additional_one_time_services &&
      formData.additional_one_time_services.length
    ) {
      const changedService = formData.additional_one_time_services.filter(
        (item) => {
          if (
            item.service_id
              ? item.service_id === oneTimeServiceData.value
              : item.service && item.service.id === oneTimeServiceData.value
          ) {
            let quantity = 0;
            if (item.quantity) {
              quantity = parseInt(item.quantity, 10);
            }
            if (flag === 'add') {
              if (quantity < 999) {
                quantity += 1;
                item.quantity = quantity;
              }
            }
            if (flag === 'minus') {
              if (quantity > 1) {
                quantity -= 1;
                item.quantity = quantity;
              }
            }
          }
          return item;
        },
      );

      setFormData({
        ...formData,
        additional_one_time_services: changedService,
      });
      setUpdatedFormData({
        ...updatedFormData,
        additional_one_time_services: {
          ...additionalOnetimeServices,
          create: changedService,
        },
      });
    }
  };

  const handleAmazonServiceQuantity = (flag) => {
    showFooter(true);
    let amazonStoreItem = {};
    // if (flag === 'add') {
    const selectedData =
      additionalOnetimeServices &&
      additionalOnetimeServices.create &&
      additionalOnetimeServices.create.length &&
      additionalOnetimeServices.create.filter((item) => {
        if (
          item.name
            ? item.name.includes('Amazon Store Package')
            : item.service.name.includes('Amazon Store Package')
        ) {
          amazonStoreItem = item;
          let itemQuantity = 0;
          if (item.quantity) {
            itemQuantity = parseInt(item.quantity, 10);
          }

          if (flag === 'add') {
            item.quantity = itemQuantity + 1;
          }
          if (flag === 'minus') {
            if (itemQuantity > 1) {
              item.quantity = itemQuantity - 1;
            }
          }
        }
        return item;
      });

    clearOneTimeQntyError(amazonStoreItem);

    if (selectedData) {
      setFormData({
        ...formData,
        additional_one_time_services: selectedData,
      });

      setAdditionalOnetimeServices({
        ...additionalOnetimeServices,
        create: selectedData,
      });
      setUpdatedFormData({
        ...updatedFormData,
        additional_one_time_services: {
          ...additionalOnetimeServices,
          create: selectedData,
        },
      });
    }
    // }
  };

  const handleAmazonPlanChange = (event) => {
    if (event.label === 'Custom') {
      setAmazonStoreCustom(true);
    } else {
      setAmazonStoreCustom(false);
    }
  };

  const setDefaultAmazonPlanValue = () => {
    const serviceData =
      formData &&
      formData.additional_one_time_services &&
      formData.additional_one_time_services.length &&
      formData.additional_one_time_services.find((item) =>
        item.name
          ? item.name.includes('Amazon Store Package')
          : item.service && item.service.name.includes('Amazon Store Package'),
      );
    if (
      (serviceData && serviceData.service_id) ||
      (serviceData && serviceData.service && serviceData.service.id)
    ) {
      const serviceName = serviceData.name
        ? serviceData.name.split(' ')[3]
        : serviceData.service.name.split(' ')[3];

      return {
        value: serviceData.service_id
          ? serviceData.service_id
          : serviceData.service.id,
        label: serviceName,
      };
    }
    return null;
    // return {
    //   value: '',
    //   label: '',
    // };
  };

  const displayError = (item) => {
    if (item === 'non_field_errors') {
      return (
        <ErrorMsg>
          {apiError &&
            apiError.non_field_errors &&
            apiError.non_field_errors[0]}
        </ErrorMsg>
      );
    }
    if (item === 'custom_amazon_store_price') {
      return (
        <ErrorMsg>
          {additionalOnetimeSerError &&
            additionalOnetimeSerError.custom_amazon_store_price}
        </ErrorMsg>
      );
    }

    return (
      <>
        <ErrorMsg>
          {apiError && apiError[item.key] && apiError[item.key][0]}
        </ErrorMsg>
        <ErrorMsg>
          {contractError &&
            contractError[item.key] &&
            contractError[item.key][0]}
        </ErrorMsg>
        <ErrorMsg>
          {additionalOnetimeSerError &&
            additionalOnetimeSerError[item.key] &&
            additionalOnetimeSerError[item.key][0]}
        </ErrorMsg>
        <ErrorMsg>
          {additionalMonthlySerError &&
            additionalMonthlySerError[item.key] &&
            additionalMonthlySerError[item.key][0]}
        </ErrorMsg>
        <ErrorMsg>
          {additionalMarketplaceError &&
            additionalMarketplaceError[item.key] &&
            additionalMarketplaceError[item.key][0]}
        </ErrorMsg>
      </>
    );
    // </>
  };

  const getSelectedAmazonStorePackage = () => {
    const selectedAmazonStore =
      formData &&
      formData.additional_one_time_services &&
      formData.additional_one_time_services.length &&
      formData.additional_one_time_services.find((item) =>
        item.name
          ? item.name.includes('Amazon Store Package')
          : item.service && item.service.name.includes('Amazon Store Package'),
      );
    return selectedAmazonStore && selectedAmazonStore.service
      ? selectedAmazonStore.service && selectedAmazonStore.service.id
      : selectedAmazonStore && selectedAmazonStore.service_id;
  };
  const onAddDiscount = (flag) => {
    setDiscountFlag(flag);
    setShowDiscountModal(true);
    // if (section === 'monthly') {
    // }
    // if (section === 'onetime') {
    // }
  };
  const checkDisableCondition = () => {
    return formData &&
      formData.additional_one_time_services &&
      formData.additional_one_time_services.length &&
      formData.additional_one_time_services.find((item) =>
        item.name
          ? item.name.includes('Amazon Store Package')
          : item.service && item.service.name.includes('Amazon Store Package'),
      )
      ? parseInt(
          formData &&
            formData.additional_one_time_services &&
            formData.additional_one_time_services.length &&
            formData.additional_one_time_services.find((item) =>
              item.name
                ? item.name.includes('Amazon Store Package')
                : item.service &&
                  item.service.name.includes('Amazon Store Package'),
            ).quantity,
          10,
        ) === 999
      : false;
  };

  const displayOneTimeServices = () => {
    return (
      <li>
        <ContractFormField className="mb-3">
          <label htmlFor="additional_one_time_services">
            One Time Services
          </label>
          <div
            className="add-discount"
            role="presentation"
            onClick={() => onAddDiscount('one-time')}>
            {formData &&
            formData.one_time_discount_amount &&
            formData.one_time_discount_type
              ? 'Edit Discount'
              : 'Add Discount'}
          </div>
        </ContractFormField>
        <div className="row">
          {oneTimeService &&
            oneTimeService.map((oneTimeServiceData) =>
              !oneTimeServiceData.label.includes('Amazon Store Package') ? (
                <React.Fragment key={oneTimeServiceData.value}>
                  <div className="col-7 ">
                    {' '}
                    <CheckBox>
                      <label
                        className="check-container customer-pannel"
                        htmlFor={oneTimeServiceData.value}>
                        {oneTimeServiceData.label}
                        <input
                          type="checkbox"
                          name={oneTimeServiceData.label}
                          id={oneTimeServiceData.value}
                          onClick={(event) =>
                            handleChange(
                              event,
                              'additional_one_time_services',
                              'checkbox',
                              oneTimeServiceData,
                            )
                          }
                          defaultChecked={
                            (formData &&
                              formData.additional_one_time_services &&
                              formData.additional_one_time_services.length &&
                              formData.additional_one_time_services.find(
                                (item) =>
                                  item.service &&
                                  item.service.id === oneTimeServiceData.value,
                              )) ||
                            (agreementData &&
                              agreementData.additional_one_time_services &&
                              agreementData.additional_one_time_services
                                .length &&
                              agreementData.additional_one_time_services.find(
                                (item) =>
                                  item.service &&
                                  item.service.id === oneTimeServiceData.value,
                              ))
                          }
                        />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>
                  </div>
                  {formData &&
                  formData.additional_one_time_services &&
                  formData.additional_one_time_services.length &&
                  formData.additional_one_time_services.find((item) =>
                    item.service_id
                      ? item.service_id === oneTimeServiceData.value
                      : item.service &&
                        item.service.id === oneTimeServiceData.value,
                  ) ? (
                    <>
                      <div className="col-5 pl-0 text-end">
                        <button
                          type="button"
                          className="decrement"
                          onClick={() => {
                            changeQuantity(oneTimeServiceData, 'minus');
                            // handleChange(
                            //   event,
                            //   'additional_one_time_services',
                            //   'quantity',
                            //   oneTimeServiceData,
                            // );
                          }}>
                          {' '}
                          <img className="minus-icon" src={MinusIcon} alt="" />
                        </button>

                        <NumberFormat
                          name={oneTimeServiceData.label}
                          className="form-control max-min-number"
                          value={
                            formData.additional_one_time_services.find((item) =>
                              item.service_id
                                ? item.service_id === oneTimeServiceData.value
                                : item.service &&
                                  item.service.id === oneTimeServiceData.value,
                            ).quantity
                          }
                          id={oneTimeServiceData.value}
                          onChange={(event) =>
                            handleChange(
                              event,
                              'additional_one_time_services',
                              'quantity',
                              oneTimeServiceData,
                            )
                          }
                          isAllowed={(values) => {
                            const { formattedValue, floatValue } = values;
                            if (floatValue == null) {
                              return formattedValue === '';
                            }
                            return floatValue <= 999;
                          }}
                        />

                        <button
                          type="button"
                          className="increment"
                          disabled={
                            formData.additional_one_time_services.find((item) =>
                              item.service_id
                                ? item.service_id === oneTimeServiceData.value
                                : item.service &&
                                  item.service.id === oneTimeServiceData.value,
                            ).quantity
                              ? parseInt(
                                  formData.additional_one_time_services.find(
                                    (item) =>
                                      item.service_id
                                        ? item.service_id ===
                                          oneTimeServiceData.value
                                        : item.service &&
                                          item.service.id ===
                                            oneTimeServiceData.value,
                                  ).quantity,
                                  10,
                                ) === 999
                              : false
                          }
                          onClick={() => {
                            changeQuantity(oneTimeServiceData, 'add');
                            // handleChange(
                            //   event,
                            //   'additional_one_time_services',
                            //   'quantity',
                            //   oneTimeServiceData,
                            // );
                          }}>
                          <img className="plus-icon" src={PlusIcon} alt="" />
                        </button>
                      </div>
                      <div className="col-12 text-left ">
                        {additionalOnetimeSerError &&
                        additionalOnetimeSerError.quantity &&
                        additionalOnetimeSerError.quantity.length &&
                        additionalOnetimeSerError.quantity.find(
                          (item) =>
                            item.service_id === oneTimeServiceData.value,
                        ) ? (
                          <ErrorMsg className="mb-3">
                            {additionalOnetimeSerError &&
                              additionalOnetimeSerError.quantity &&
                              additionalOnetimeSerError.quantity.length &&
                              additionalOnetimeSerError.quantity.find(
                                (item) =>
                                  item.service_id === oneTimeServiceData.value,
                              ).error}
                          </ErrorMsg>
                        ) : (
                          ''
                        )}
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </React.Fragment>
              ) : (
                ''
              ),
            )}
          <>
            <div className="col-7 ">
              {' '}
              <CheckBox>
                <label
                  className="check-container customer-pannel"
                  htmlFor="contract-copy-check">
                  Amazon Store
                  <input
                    type="checkbox"
                    id="contract-copy-check"
                    onClick={(event) => {
                      setShowAmazonPlanDropdown(event.target.checked);

                      handleChange(
                        event,
                        'amazon_store_package',
                        'checkbox',
                        amazonService,
                      );
                    }}
                    defaultChecked={
                      formData &&
                      formData.additional_one_time_services &&
                      formData.additional_one_time_services.length &&
                      formData.additional_one_time_services.find((item) =>
                        item.name
                          ? item.name.includes('Amazon Store Package')
                          : item.service &&
                            item.service.name.includes('Amazon Store Package'),
                      )
                    }
                  />
                  <span className="checkmark" />
                </label>
              </CheckBox>
            </div>
            {showAmazonPlanDropdown ? (
              <>
                <div className="col-5 pl-0 text-end">
                  <button
                    type="button"
                    className="decrement"
                    onClick={() => {
                      handleAmazonServiceQuantity('minus');
                      // handleChange(
                      //   event,
                      //   'amazon_store_package',
                      //   'quantity',
                      //   amazonService,
                      // );
                    }}>
                    {' '}
                    <img className="minus-icon" src={MinusIcon} alt="" />
                  </button>

                  <NumberFormat
                    name="amazon service"
                    className="form-control max-min-number"
                    value={
                      formData &&
                      formData.additional_one_time_services &&
                      formData.additional_one_time_services.length &&
                      formData.additional_one_time_services.find((item) =>
                        item.name
                          ? item.name.includes('Amazon Store Package')
                          : item.service &&
                            item.service.name.includes('Amazon Store Package'),
                      )
                        ? formData &&
                          formData.additional_one_time_services &&
                          formData.additional_one_time_services.length &&
                          formData.additional_one_time_services.find((item) =>
                            item.name
                              ? item.name.includes('Amazon Store Package')
                              : item.service &&
                                item.service.name.includes(
                                  'Amazon Store Package',
                                ),
                          ).quantity
                        : ''
                    }
                    // id={
                    //   amazonService.name
                    //     ? amazonService.name
                    //     : amazonService.service.name
                    // }
                    onChange={(event) =>
                      handleChange(
                        event,
                        'amazon_store_package',
                        'quantity',
                        amazonService,
                      )
                    }
                    isAllowed={(values) => {
                      const { formattedValue, floatValue } = values;
                      if (floatValue == null) {
                        return formattedValue === '';
                      }
                      return floatValue <= 999;
                    }}
                  />

                  <button
                    type="button"
                    className="increment"
                    disabled={checkDisableCondition()}
                    onClick={() => {
                      handleAmazonServiceQuantity('add');
                      // handleChange(
                      //   event,
                      //   'amazon_store_package',
                      //   'quantity',
                      //   amazonService,
                      // );
                    }}>
                    <img className="plus-icon" src={PlusIcon} alt="" />
                  </button>
                </div>

                <div className="col-12 text-left">
                  {additionalOnetimeSerError &&
                  additionalOnetimeSerError.quantity &&
                  additionalOnetimeSerError.quantity.length &&
                  additionalOnetimeSerError.quantity.find(
                    (item) =>
                      item.service_id === getSelectedAmazonStorePackage(),
                  ) ? (
                    <ErrorMsg className="mb-3">
                      {additionalOnetimeSerError &&
                        additionalOnetimeSerError.quantity &&
                        additionalOnetimeSerError.quantity.length &&
                        additionalOnetimeSerError.quantity.find(
                          (item) =>
                            item.service_id === getSelectedAmazonStorePackage(),
                        ).error}
                    </ErrorMsg>
                  ) : (
                    ''
                  )}
                </div>
              </>
            ) : (
              ''
            )}
            {showAmazonPlanDropdown ? (
              <div className="col-12">
                <ContractInputSelect>
                  <Select
                    classNamePrefix="react-select"
                    defaultValue={setDefaultAmazonPlanValue()}
                    options={AmazonStoreOptions}
                    name="amazon_store_plan"
                    components={{ DropdownIndicator }}
                    onChange={(event) => {
                      handleAmazonPlanChange(event);
                      handleChange(event, 'amazon_store_package', 'dropdown');
                    }}
                    placeholder="Select Package"
                  />
                </ContractInputSelect>
                {amazonStoreCustom ? (
                  <ContractFormField className="w-100 mt-1">
                    <NumberFormat
                      className={
                        additionalOnetimeSerError &&
                        additionalOnetimeSerError.custom_amazon_store_price
                          ? 'form-control form-control-error'
                          : 'form-control '
                      }
                      type="text"
                      prefix="$"
                      value={
                        formData &&
                        formData.additional_one_time_services &&
                        formData.additional_one_time_services.length &&
                        formData.additional_one_time_services.find((item) =>
                          item.name
                            ? item.name.includes('Amazon Store Package')
                            : item.service &&
                              item.service.name.includes(
                                'Amazon Store Package',
                              ),
                        )
                          ? formData &&
                            formData.additional_one_time_services &&
                            formData.additional_one_time_services.length &&
                            formData.additional_one_time_services.find((item) =>
                              item.name
                                ? item.name.includes('Amazon Store Package')
                                : item.service &&
                                  item.service.name.includes(
                                    'Amazon Store Package',
                                  ),
                            ).custom_amazon_store_price
                          : ''
                      }
                      placeholder="Enter Custom Store Price"
                      name="custom_amazon_store_price"
                      onChange={(event) =>
                        handleChange(
                          event,
                          'amazon_store_package',
                          'custom_amazon_store_price',
                        )
                      }
                      thousandSeparator
                      isAllowed={(values) => {
                        const { formattedValue, floatValue } = values;
                        if (floatValue == null) {
                          return formattedValue === '';
                        }
                        return floatValue <= 100000000;
                      }}
                      decimalScale={2}
                    />
                    {displayError('custom_amazon_store_price')}
                  </ContractFormField>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}
          </>
        </div>
      </li>
    );
  };

  const changeListOptimization = (key, flag) => {
    showFooter(true);
    // setSectionError({ ...sectionError, statement: 0 });

    let updatedData = 0;
    if (
      Object.keys(contractError).includes('content_optimization') ||
      Object.keys(contractError).includes('design_optimization')
    ) {
      setContractError({
        ...contractError,
        [key]: '',
      });
    }
    if (flag === 'minus') {
      if (formData && formData[key]) {
        updatedData = parseInt(formData[key], 10) - 1;
      } else {
        updatedData = 0;
      }
    }
    if (flag === 'plus') {
      if (formData && formData[key]) {
        if (parseInt(formData[key], 10) < 20) {
          updatedData = parseInt(formData[key], 10) + 1;
        }
      } else {
        updatedData = 1;
      }
    }
    setFormData({
      ...formData,
      [key]: updatedData,
    });
    setUpdatedFormData({
      ...updatedFormData,
      [key]: updatedData,
    });
  };

  const renderContractActivityPanel = () => {
    return (
      <>
        {agreementData &&
        agreementData.contract_status &&
        agreementData.contract_status.value ? (
          <div className={`contract-status ${getContractStatusData('class')}`}>
            <img
              width="16px"
              className="contract-file-icon"
              src={getContractStatusData('src')}
              alt=""
            />
            {_.startCase(getContractStatusData('status'))}
          </div>
        ) : null}

        <div className="activity-log">Contract Activity</div>

        {activityLoader === true ? (
          <PageLoader component="activityLog" color="#FF5933" type="page" />
        ) : activityData && activityData.length !== 0 ? (
          <>
            {activityData.map((item) => (
              <ul className="menu">
                <li>
                  {images.find((op) => op.entity_id === item.user_id) &&
                  images.find((op) => op.entity_id === item.user_id)
                    .presigned_url ? (
                    <img
                      src={
                        isLoading.loader && isLoading.type === 'page'
                          ? DefaultUser
                          : images.find((op) => op.entity_id === item.user_id)
                              .presigned_url
                      }
                      className="default-user-activity"
                      alt="pic"
                    />
                  ) : (
                    <div className="avatarName float-left mr-3">
                      {getActivityInitials(item.message)}
                    </div>
                  )}

                  <div className="activity-user">
                    {activityDetail(item)}
                    <div className="time-date mt-1">
                      {item && item.time ? item.time : ''}
                    </div>
                  </div>
                  <div className="clear-fix" />
                </li>
              </ul>
            ))}
            {activityCount > 10 ? (
              <Footer className="pdf-footer">
                <CommonPagination
                  count={activityCount}
                  pageNumber={pageNumber || 1}
                  handlePageChange={handlePageChange}
                  showLessItems
                />
              </Footer>
            ) : null}
          </>
        ) : isApicalled ? (
          <div className="ml-2 mt-3">No activity log found.</div>
        ) : null}
      </>
    );
  };

  const displayListingOptimizations = () => {
    return (
      <>
        <ContractFormField className="mb-3">
          <label htmlFor="additional_one_time_services ">
            LISTING OPTIMIZATIONS (ASIN&rsquo;s PER MONTH)
          </label>
        </ContractFormField>
        {ListingOptimization.map((field) => {
          return (
            <>
              <div className="row">
                <div className="col-7 mb-3 ">
                  <label className="listing-optimazation">
                    {field && field.label}
                  </label>
                </div>
                <div className="col-5 pl-0 text-end">
                  <button
                    type="button"
                    className="decrement"
                    onClick={() => changeListOptimization(field.key, 'minus')}>
                    <img className="minus-icon" src={MinusIcon} alt="" />
                  </button>

                  <NumberFormat
                    name={field.key}
                    className="form-control max-min-number"
                    value={(formData && formData[field.key]) || 0}
                    // id={oneTimeServiceData.value}
                    onChange={(event) =>
                      handleChange(event, 'listing_optimization')
                    }
                    isAllowed={(values) => {
                      const { formattedValue, floatValue } = values;
                      if (floatValue == null) {
                        return formattedValue === '';
                      }
                      return floatValue <= 20;
                    }}
                  />

                  <button
                    type="button"
                    className="increment"
                    disabled={
                      formData &&
                      formData[field.key] &&
                      parseInt(formData[field.key], 10) === 20
                    }
                    onClick={() => changeListOptimization(field.key, 'plus')}>
                    <img className="plus-icon" src={PlusIcon} alt="" />
                  </button>
                </div>
                <div className="col-12">
                  {contractError &&
                  contractError[field.key] &&
                  contractError[field.key][0] ? (
                    <ErrorMsg className="mb-3">
                      {contractError &&
                        contractError[field.key] &&
                        contractError[field.key][0]}
                    </ErrorMsg>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </>
          );
        })}
      </>
    );
  };

  return (
    <SidePanel>
      <div className="sidebar">
        <>
          {/* {formData &&
          formData.contract_status &&
          formData.contract_status.value === 'pending contract signature' ? (
            ''
          ) :  */}
          {isEditContract ? (
            <>
              <div
                className="collapse-btn "
                role="presentation"
                type="button"
                onClick={() => {
                  executeScroll('agreement');
                  setOpenCollapse({ agreement: !openCollapse.agreement });
                }}>
                <img
                  className="service-agre"
                  src={ServiceAgreement}
                  alt="pdf"
                />

                <h4
                  className={
                    (sectionError && sectionError.agreement) ||
                    (sectionError.statement &&
                      formData &&
                      formData.contract_type &&
                      formData.contract_type.toLowerCase().includes('one'))
                      ? 'sendar-details error-container'
                      : 'sendar-details'
                  }>
                  {formData &&
                  formData.contract_type &&
                  formData.contract_type.toLowerCase().includes('one') ? (
                    <>
                      One Time Service Agreement
                      {sectionError &&
                      (sectionError.agreement || sectionError.statement) ? (
                        openCollapse.agreement ? (
                          <img
                            className="red-cross  "
                            src={RedCross}
                            alt="right-check"
                          />
                        ) : (
                          <div className="error-bg">
                            <img
                              className="red-cross "
                              src={RedCross}
                              alt="right-check"
                            />
                          </div>
                        )
                      ) : showRightTick('service_agreement') ? (
                        <img
                          className="green-check-select"
                          src={GreenCheck}
                          alt="right-check"
                        />
                      ) : (
                        ''
                      )}
                      <div className="error-found">
                        {sectionError &&
                        (sectionError.agreement || sectionError.statement)
                          ? `
                          ${sectionError.agreement + sectionError.statement} ${
                              sectionError.agreement +
                                sectionError.statement ===
                              1
                                ? 'error found'
                                : 'errors found'
                            }`
                          : ''}
                      </div>
                    </>
                  ) : (
                    <>
                      Service Agreement
                      {sectionError && sectionError.agreement ? (
                        openCollapse.agreement ? (
                          <img
                            className="red-cross  "
                            src={RedCross}
                            alt="right-check"
                          />
                        ) : (
                          <div className="error-bg">
                            <img
                              className="red-cross "
                              src={RedCross}
                              alt="right-check"
                            />
                          </div>
                        )
                      ) : showRightTick('service_agreement') ? (
                        <img
                          className="green-check-select"
                          src={GreenCheck}
                          alt="right-check"
                        />
                      ) : (
                        ''
                      )}
                      <div className="error-found">
                        {sectionError && sectionError.agreement
                          ? `${sectionError.agreement} ${
                              sectionError.agreement === 1
                                ? 'error found'
                                : 'errors found'
                            }`
                          : ''}
                      </div>
                    </>
                  )}
                </h4>

                {/* <h4
                  className={
                    sectionError && sectionError.agreement
                      ? 'sendar-details error-container'
                      : 'sendar-details'
                  }>
                  {formData &&
                  formData.contract_type &&
                  formData.contract_type.toLowerCase().includes('one')
                    ? 'One Time Service Agreement'
                    : 'Service Agreement'}
                  {sectionError && sectionError.agreement ? (
                    openCollapse.agreement ? (
                      <img
                        className="red-cross  "
                        src={RedCross}
                        alt="right-check"
                      />
                    ) : (
                      <div className="error-bg">
                        <img
                          className="red-cross "
                          src={RedCross}
                          alt="right-check"
                        />
                      </div>
                    )
                  ) : showRightTick('service_agreement') ? (
                    <img
                      className="green-check-select"
                      src={GreenCheck}
                      alt="right-check"
                    />
                  ) : (
                    ''
                  )}
                  <div className="error-found">
                    {sectionError && sectionError.agreement
                      ? `${sectionError.agreement} ${
                          sectionError.agreement === 1
                            ? 'error found'
                            : 'errors found'
                        }`
                      : ''}
                  </div>
                  {/* {checkError()} *
                  {/* {isSectionError ? } 
                </h4> */}

                <div className="clear-fix" />
              </div>
              <Collapse isOpened={openCollapse.agreement}>
                {loader ? (
                  <PageLoader
                    component="activityLog"
                    color="#FF5933"
                    type="page"
                  />
                ) : (
                  <ul className="collapse-inner">
                    {AgreementDetails.map((item) =>
                      item.key !== 'contract_address' ? (
                        <>
                          {item.key === 'length' &&
                          formData &&
                          formData.contract_type === 'one time' ? null : (
                            <li key={item.key}>
                              <ContractFormField>
                                <label htmlFor={item.key}>{item.label}</label>
                                {generateHTML(item)}
                                {displayError(item)}
                              </ContractFormField>
                            </li>
                          )}
                        </>
                      ) : (
                        <>
                          <li key={item.key}>
                            <ContractFormField>
                              <label>{item.label}</label>
                              {item.sections.map((subFields) => (
                                <React.Fragment key={subFields.key}>
                                  <label htmlFor={subFields.key}>
                                    {generateHTML(subFields)}
                                  </label>
                                  {displayError(subFields)}
                                </React.Fragment>
                              ))}
                            </ContractFormField>
                          </li>
                          {formData &&
                          formData.contract_type &&
                          formData.contract_type
                            .toLowerCase()
                            .includes('one') ? (
                            <>{displayOneTimeServices()}</>
                          ) : (
                            ''
                          )}
                        </>
                      ),
                    )}

                    <li>
                      <Button
                        className="btn-primary sidepanel btn-next-section mt-2 mb-3 w-100"
                        disabled={
                          !(
                            showRightTick('service_agreement')
                            // &&
                            // showRightTick('statement') &&
                            // showRightTick('dspAddendum')
                          ) ||
                          (formData &&
                            formData.additional_one_time_services &&
                            formData.additional_one_time_services.length &&
                            formData.additional_one_time_services.find(
                              (item) => item.name === 'Amazon Store Package',
                            ) &&
                            formData &&
                            formData.contract_type &&
                            formData.contract_type
                              .toLowerCase()
                              .includes('one'))
                        }
                        onClick={() =>
                          nextStep(
                            formData &&
                              formData.contract_type &&
                              formData.contract_type
                                .toLowerCase()
                                .includes('one')
                              ? 'addendum'
                              : formData &&
                                formData.contract_type &&
                                formData.contract_type
                                  .toLowerCase()
                                  .includes('dsp')
                              ? 'dspAddendum'
                              : 'statement',
                          )
                        }>
                        {' '}
                        {isLoading.loader && isLoading.type === 'button' ? (
                          <PageLoader color="#fff" type="button" />
                        ) : (
                          'Proceed to Next Section'
                        )}
                      </Button>
                    </li>
                  </ul>
                )}
              </Collapse>
              {(formData &&
                formData.contract_type &&
                formData.contract_type.toLowerCase().includes('one')) ||
              (formData &&
                formData.contract_type &&
                formData.contract_type.toLowerCase().includes('dsp')) ? null : (
                <>
                  <div className="straight-line sidepanel " />
                  <div
                    className="collapse-btn"
                    role="presentation"
                    type="button"
                    onClick={() => {
                      executeScroll('statement');
                      setOpenCollapse({ statement: !openCollapse.statement });
                    }}>
                    <img
                      className="service-agre"
                      src={StatementWork}
                      alt="pdf"
                    />

                    <h4
                      className={
                        sectionError && sectionError.statement
                          ? 'sendar-details error-container'
                          : 'sendar-details '
                      }>
                      Statement of Work{' '}
                      {sectionError && sectionError.statement ? (
                        openCollapse.statement ? (
                          <img
                            className="red-cross  "
                            src={RedCross}
                            alt="right-check"
                          />
                        ) : (
                          <div className="error-bg">
                            <img
                              className="red-cross "
                              src={RedCross}
                              alt="right-check"
                            />
                          </div>
                        )
                      ) : showRightTick('statement') ? (
                        <img
                          className="green-check-select "
                          src={GreenCheck}
                          alt="right-check"
                        />
                      ) : (
                        ''
                      )}
                      <div className="error-found">
                        {sectionError && sectionError.statement
                          ? `${sectionError.statement} ${
                              sectionError.statement === 1
                                ? 'error found'
                                : 'errors found'
                            } `
                          : ''}
                      </div>
                    </h4>
                    <div className="clear-fix" />
                  </div>
                  <Collapse isOpened={openCollapse.statement}>
                    {loader ? (
                      //  ||
                      // (isLoading.loader && isLoading.type === 'page')
                      <PageLoader
                        component="activityLog"
                        color="#FF5933"
                        type="page"
                      />
                    ) : (
                      // ''
                      <>
                        <ul className="collapse-inner">
                          {StatementDetails.map((item) => (
                            <React.Fragment key={item.key}>
                              <>
                                <li>
                                  <ContractFormField>
                                    <label htmlFor={item.key}>
                                      {item.label}
                                    </label>
                                    {generateHTML(item)}
                                    {displayError(item)}
                                    {item.key === 'primary_marketplace' &&
                                    apiError &&
                                    apiError.non_field_errors &&
                                    apiError.non_field_errors[0]
                                      ? displayError('non_field_errors')
                                      : ''}
                                  </ContractFormField>
                                </li>
                              </>
                            </React.Fragment>
                          ))}
                          <li>{displayListingOptimizations()}</li>
                          <li>
                            <ContractFormField className="mb-3">
                              <label htmlFor="additional_one_time_services ">
                                Monthly Services
                              </label>
                              <div
                                className="add-discount"
                                role="presentation"
                                onClick={() => onAddDiscount('monthly')}>
                                {formData &&
                                formData.monthly_discount_amount &&
                                formData.monthly_discount_type
                                  ? 'Edit Discount'
                                  : 'Add Discount'}
                              </div>
                            </ContractFormField>
                            {monthlyService &&
                              monthlyService.map((serviceData) => (
                                <CheckBox
                                  key={serviceData && serviceData.value}>
                                  <label
                                    className="check-container customer-pannel"
                                    htmlFor={serviceData.value}>
                                    {serviceData.label}
                                    <input
                                      type="checkbox"
                                      name={serviceData.label}
                                      id={serviceData.value}
                                      onClick={(event) =>
                                        handleChange(
                                          event,
                                          'additional_monthly_services',
                                          'checkbox',
                                          serviceData,
                                        )
                                      }
                                      defaultChecked={
                                        (formData &&
                                          formData.additional_monthly_services &&
                                          formData.additional_monthly_services
                                            .length &&
                                          formData.additional_monthly_services.find(
                                            (item) =>
                                              item.service &&
                                              item.service.id ===
                                                serviceData.value,
                                          )) ||
                                        (agreementData &&
                                          agreementData.additional_monthly_services &&
                                          agreementData
                                            .additional_monthly_services
                                            .length &&
                                          agreementData.additional_monthly_services.find(
                                            (item) =>
                                              item.service &&
                                              item.service.id ===
                                                serviceData.value,
                                          ))
                                      }
                                    />
                                    <span className="checkmark" />
                                  </label>
                                </CheckBox>
                              ))}

                            <CheckBox>
                              <label
                                className="check-container customer-pannel"
                                htmlFor="additional_marketplaces">
                                Additional Marketplaces
                                <input
                                  type="checkbox"
                                  id="additional_marketplaces"
                                  onClick={(event) => {
                                    setShowAdditionalMarketplace(
                                      event.target.checked,
                                    );
                                    handleChange(
                                      event,
                                      'additional_marketplaces_checkbox',
                                      'checkbox',
                                    );
                                  }}
                                  defaultChecked={
                                    (agreementData &&
                                      agreementData.additional_marketplaces &&
                                      agreementData.additional_marketplaces
                                        .length) ||
                                    (formData &&
                                      formData.additional_marketplaces &&
                                      formData.additional_marketplaces.length)
                                  }
                                />
                                <span className="checkmark" />
                              </label>
                            </CheckBox>

                            {showAdditionalMarketplace ? (
                              <>
                                <ContractFormField>
                                  {generateHTML({
                                    key: 'additional_marketplaces',
                                    label: 'Additional Market Places',
                                    type: 'multichoice',
                                  })}
                                </ContractFormField>
                              </>
                            ) : (
                              ''
                            )}
                          </li>
                          {displayOneTimeServices()}
                          <li>
                            <Button
                              className={
                                formData &&
                                formData.additional_one_time_services &&
                                formData.additional_one_time_services.length &&
                                formData.additional_one_time_services.find(
                                  (item) =>
                                    item.name === 'Amazon Store Package',
                                )
                                  ? 'btn-primary btn-next-section sidepanel  mt-1 mb-3 w-100 '
                                  : 'btn-primary btn-next-section sidepanel mt-1 mb-3 w-100 '
                              }
                              disabled={
                                (formData &&
                                  formData.additional_one_time_services &&
                                  formData.additional_one_time_services
                                    .length &&
                                  formData.additional_one_time_services.find(
                                    (item) =>
                                      item.name === 'Amazon Store Package',
                                  )) ||
                                !(
                                  // showRightTick('service_agreement') &&
                                  showRightTick('statement')
                                  // &&
                                  // showRightTick('dspAddendum')
                                )
                              }
                              onClick={() =>
                                showSection && showSection.dspAddendum
                                  ? nextStep('dspAddendum')
                                  : nextStep('addendum')
                              }>
                              {isLoading.loader &&
                              isLoading.type === 'button' ? (
                                <PageLoader color="#fff" type="button" />
                              ) : (
                                'Proceed to Next Section'
                              )}
                            </Button>
                          </li>
                        </ul>
                      </>
                    )}
                  </Collapse>
                </>
              )}

              {loader ? (
                //  || (isLoading.loader && isLoading.type === 'page')
                <PageLoader
                  component="activityLog"
                  color="#FF5933"
                  type="page"
                />
              ) : (formData &&
                  formData.contract_type &&
                  formData.contract_type.toLowerCase().includes('dsp')) ||
                (showSection &&
                  showSection.dspAddendum &&
                  !(
                    formData &&
                    formData.contract_type &&
                    formData.contract_type.toLowerCase().includes('one')
                  )) ? (
                <>
                  <div className="straight-line sidepanel " />

                  <div
                    className={
                      showSection && showSection.dspAddendum
                        ? 'collapse-btn   '
                        : 'collapse-btn  disabled '
                    }
                    role="presentation"
                    type="button"
                    onClick={() => {
                      executeScroll('dspAddendum');
                      setOpenCollapse({
                        dspAddendum: !openCollapse.dspAddendum,
                      });
                    }}>
                    <img className="service-agre" src={Advertise} alt="pdf" />
                    <h4
                      className={
                        sectionError && sectionError.dsp
                          ? 'sendar-details error-container '
                          : 'sendar-details'
                      }>
                      DSP Advertising
                      {sectionError && sectionError.dsp ? (
                        openCollapse.dspAddendum ? (
                          <img
                            className="red-cross  "
                            src={RedCross}
                            alt="right-check"
                          />
                        ) : (
                          <div className="error-bg">
                            <img
                              className="red-cross "
                              src={RedCross}
                              alt="right-check"
                            />
                          </div>
                        )
                      ) : showRightTick('dspAddendum') ? (
                        <img
                          className="green-check-select "
                          src={GreenCheck}
                          alt="right-check"
                        />
                      ) : (
                        ''
                      )}
                      <div className="error-found">
                        {sectionError && sectionError.dsp
                          ? `${sectionError.dsp} ${
                              sectionError.dsp === 1
                                ? 'error found'
                                : 'errors found'
                            }`
                          : ''}
                      </div>
                    </h4>
                    <div className="clear-fix" />
                  </div>

                  <Collapse isOpened={openCollapse.dspAddendum}>
                    <ul className="collapse-inner">
                      {DSPAddendumDetails.map((item) => (
                        <>
                          {item.key === 'dsp_length' &&
                          formData &&
                          formData.contract_type === 'dsp only' ? null : (
                            <li key={item.key}>
                              <ContractFormField>
                                <label htmlFor={item.key}>{item.label}</label>
                                {generateHTML(item)}
                                {displayError(item)}
                              </ContractFormField>
                              <p className="m-0  pt-1 small-para">
                                {' '}
                                {item.info ? item.info : ''}
                              </p>
                            </li>
                          )}
                        </>
                      ))}
                      <li>
                        <Button
                          className={
                            formData.additional_one_time_services
                              ? 'btn-primary btn-next-section sidepanel mt-1 mb-3 w-100 '
                              : 'btn-primary btn-next-section  mt-1 mb-3 w-100 '
                          }
                          disabled={
                            !(
                              // showRightTick('service_agreement') &&
                              // showRightTick('statement') &&
                              showRightTick('dspAddendum')
                            )
                          }
                          onClick={() => nextStep('addendum')}>
                          {isLoading.loader && isLoading.type === 'button' ? (
                            <PageLoader color="#fff" type="button" />
                          ) : (
                            'Proceed to Next Section'
                          )}
                        </Button>
                      </li>
                    </ul>
                  </Collapse>
                </>
              ) : (
                ''
              )}
              <div className="straight-line sidepanel " />
              <div
                className={
                  showSection && showSection.addendum
                    ? 'collapse-btn '
                    : 'collapse-btn '
                }
                role="presentation"
                type="button"
                onClick={() => {
                  executeScroll('addendum');
                  setOpenCollapse({ addendum: !openCollapse.addendum });
                }}>
                <img className="service-agre" src={CreateAddendum} alt="pdf" />
                <h4 className="sendar-details ">Create Addendum </h4>
                <div className="clear-fix" />
              </div>
              <Collapse isOpened={openCollapse.addendum}>
                {loader ? (
                  // || (isLoading.loader && isLoading.type === 'page')
                  <PageLoader
                    component="activityLog"
                    color="#FF5933"
                    type="page"
                  />
                ) : (
                  <ul className="collapse-inner">
                    <li>
                      <p className="small-para  mt-0">
                        [Optional] Document any terms of the contract that are
                        not covered in the service agreement.
                      </p>

                      {newAddendumData && newAddendumData.id ? (
                        <Button
                          className=" btn-transparent sidepanel mt-1 mb-3 w-100"
                          onClick={() => onEditAddendum()}>
                          <img
                            className="edit-folder-icon mr-2"
                            src={EditFileIcons}
                            alt="edit "
                          />
                          Edit Addendum
                        </Button>
                      ) : !showEditor &&
                        !(
                          newAddendumData && Object.keys(newAddendumData).length
                        ) ? (
                        <Button
                          className=" sidepanel btn-transparent create-addendum mt-1 mb-3 w-100"
                          onClick={() => setShowEditor(true)}>
                          Create Addendum
                        </Button>
                      ) : (
                        <>
                          <Button
                            className={
                              (newAddendumData &&
                                !Object.keys(newAddendumData).length) ||
                              (newAddendumData &&
                                newAddendumData.addendum &&
                                newAddendumData.addendum.startsWith('<p></p>'))
                                ? ' btn-gray sidepanel on-boarding mt-1 mb-3 w-100 disabled'
                                : 'btn-primary sidepanel on-boarding mt-1 mb-3 w-100  '
                            }
                            onClick={() => nextStep('final')}>
                            {isLoading.loader && isLoading.type === 'button' ? (
                              <PageLoader color="#fff" type="button" />
                            ) : (
                              'Save Addendum'
                            )}
                          </Button>
                          <Button
                            className="btn-transparent sidepanel on-boarding mt-1 mb-3 w-100"
                            onClick={() => {
                              setShowEditor(false);
                              setNewAddendum({});
                            }}>
                            Cancel
                          </Button>
                        </>
                      )}
                    </li>
                  </ul>
                )}
              </Collapse>
            </>
          ) : (
            renderContractActivityPanel()
          )}
          {/* 
                    <div className="straight-line sidepanel " />
                    <div className="row">
                      <div className="col-10 ">
                        <div
                          className={
                            showSection && showSection.amendment
                              ? 'collapse-btn   '
                              : 'collapse-btn  disabled '
                          }
                          role="presentation"
                          type="button"
                          onClick={() => {
                            executeScroll('amendment');
                            setOpenCollapse({ amendment: !openCollapse.amendment });
                          }}>
                          <img className="service-agre" src={CreateAddendum} alt="pdf" />
                          <h4 className="sendar-details mt-1 ml-5">
                            One time Amendment{' '}
                          </h4>
                          <div className="clear-fix" />
                        </div>
                      </div>
                    
                    </div>
                    <Collapse isOpened={openCollapse.amendment} /> */}
          {/* <p className="gray-text">
                  The Contract has been sent for review and signature to the client on
                    08/10/2020.
                  </p>

                  <h4 className="sendar-details mb-3"> Sender Details</h4>
                  <div className="sender-profile mb-2" />
                  <h4 className="sender-name">Preston Rawlings</h4>
                  <p className="small-para mt-1 mb-0">Senior Amazon Consultant</p>
                  <p className="small-para mt-1 mb-0">preston@buyboxexperts.com</p>
                  <Button className="btn-primary w-100 sticky-btn-primary sidepanel">
                    Edit Contract{' '}
                  </Button>
                  <Button className="light-orange w-100 sticky-btn ">
                    <img src={AlarmBellIcon} alt="alarm" />
                    Send Reminder
                  </Button> */}
          {/* <div className="contract-status">Pending Approval</div> */}

          {/* <div className=" activity-log current-agreement-title">
            Current Agreement
          </div>
          <ul className="menu">
            <li>
              <div className="activity-user">
                Asher’s Apparel Amazon Service Agreement with Buy Box Experts
                <br />
                08/08/2020
              </div>
              <img className="pdf-download" src={PdfDownload} alt="" />
              <div className="clear-fix" />
            </li>
            <li>
              <div className=" activity-user">
                Asher’s Apparel Amazon Service Agreement with Buy Box Experts
                <br />
                08/08/2020
              </div>
              <img className="pdf-download" src={PdfDownload} alt="" />
              <div className="clear-fix" />
            </li>
          </ul>
          <div className=" activity-log current-agreement-title">
            Previous Agreements
          </div>
          <ul className="menu">
            <li>
              <div className="activity-user">
                Asher’s Apparel Amazon Service Agreement with Buy Box Experts
                <br />
                08/08/2020
              </div>
              <img className="pdf-download" src={PdfDownload} alt="" />
              <div className="clear-fix" />
            </li>
            <li>
              <div className=" activity-user">
                Asher’s Apparel Amazon Service Agreement with Buy Box Experts
                <br />
                08/08/2020
              </div>
              <img className="pdf-download" src={PdfDownload} alt="" />
              <div className="clear-fix" />
            </li>
          </ul> */}
        </>
      </div>
    </SidePanel>
  );
}
AgreementSidePanel.defaultProps = {
  setFormData: () => {},
  formData: {},
  loader: false,
  agreementData: {},
  // accountURL: {},
  // customerData: {},
  newAddendumData: {},
  onEditAddendum: () => {},
  setShowEditor: () => {},
  setNewAddendum: () => {},
  setNotIncludedOneTimeServices: () => {},
  setNotIncludedMonthlyServices: () => {},
  // sendNotIncludedOneTimeServToAdd: () => {},
  // sendNotIncludedMonthlyServToAdd: () => {},
  apiError: {},
  showFooter: () => {},
  setApiError: () => {},
  executeScroll: () => {},
  showSection: {},
  setShowCollpase: () => {},
  updatedFormData: {},
  setUpdatedFormData: () => {},
  additionalMonthlyServices: [],
  setMonthlyAdditionalServices: () => {},
  originalData: {},
  additionalMarketplacesData: [],
  setAdditionalMarketplace: () => {},
  additionalOnetimeServices: [],
  setAdditionalOnetimeServices: () => {},
  additionalMarketplaceError: {},
  setAdditionalMarketplaceError: () => {},
  additionalMonthlySerError: {},
  setAdditionalMonthlySerError: () => {},
  additionalOnetimeSerError: {},
  setAdditionalOnetimeSerError: () => {},
  contractError: {},
  setContractError: () => {},
  setOriginalAddendumData: () => {},
  showEditor: false,
  openCollapse: PropTypes.shape({
    agreement: false,
    statement: false,
    addendum: false,
    dspAddendum: false,
    amendment: false,
  }),
  setOpenCollapse: () => {},
  amazonStoreCustom: false,
  setAmazonStoreCustom: () => {},
  showAmazonPlanDropdown: false,
  setShowAmazonPlanDropdown: () => {},
  showAdditionalMarketplace: false,
  setShowAdditionalMarketplace: () => {},
  startDate: '',
  setStartDate: () => {},
  sectionError: {},
  setSectionError: () => {},
};

AgreementSidePanel.propTypes = {
  id: PropTypes.string.isRequired,
  setFormData: PropTypes.func,
  formData: PropTypes.shape({
    additional_services: PropTypes.arrayOf(PropTypes.array),
    start_date: PropTypes.string,
    company_name: PropTypes.string,
    primary_marketplace: PropTypes.string,
    additional_marketplaces: PropTypes.arrayOf(PropTypes.array),
    additional_monthly_services: PropTypes.arrayOf(PropTypes.object),
    additional_one_time_services: PropTypes.arrayOf(PropTypes.object),
    quantity: PropTypes.number,
    contract_status: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  }),
  agreementData: PropTypes.shape({
    id: PropTypes.string,
    contract_type: PropTypes.string,
    primary_marketplace: PropTypes.shape({
      fee: PropTypes.number,
      name: PropTypes.string,
      id: PropTypes.string,
    }),
    additional_monthly_services: PropTypes.arrayOf(PropTypes.object),
    additional_marketplaces: PropTypes.arrayOf(PropTypes.object),
    steps_completed: PropTypes.objectOf(PropTypes.bool),
    additional_one_time_services: PropTypes.arrayOf(PropTypes.object),
    sales_threshold: PropTypes.string,
  }),
  loader: PropTypes.bool,
  // accountURL: PropTypes.objectOf(PropTypes.object),
  newAddendumData: PropTypes.shape({
    id: PropTypes.string,
    addendum: PropTypes.string,
  }),
  onEditAddendum: PropTypes.func,
  setShowEditor: PropTypes.func,
  setNewAddendum: PropTypes.func,
  setNotIncludedOneTimeServices: PropTypes.func,
  setNotIncludedMonthlyServices: PropTypes.func,
  // sendNotIncludedOneTimeServToAdd: PropTypes.func,
  // sendNotIncludedMonthlyServToAdd: PropTypes.func,
  apiError: PropTypes.shape({
    quantity: PropTypes.arrayOf(PropTypes.string),
    service: PropTypes.arrayOf(PropTypes.string),
    non_field_errors: PropTypes.arrayOf(PropTypes.string),
    amazon_store_package_custom: PropTypes.arrayOf(PropTypes.string),
  }),
  showFooter: PropTypes.func,
  setApiError: PropTypes.func,
  executeScroll: PropTypes.func,
  showSection: PropTypes.shape({
    addendum: PropTypes.bool,
    dspAddendum: PropTypes.bool,
    amendment: PropTypes.bool,
  }),
  setShowCollpase: PropTypes.func,
  updatedFormData: PropTypes.shape({
    additional_services: PropTypes.arrayOf(PropTypes.array),
    start_date: PropTypes.string,
    company_name: PropTypes.string,
    primary_marketplace: PropTypes.string,
    additional_marketplaces: PropTypes.arrayOf(PropTypes.array),
    additional_monthly_services: PropTypes.arrayOf(PropTypes.object),
    additional_one_time_services: PropTypes.arrayOf(PropTypes.object),
    quantity: PropTypes.number,
  }),
  setUpdatedFormData: PropTypes.func,
  additionalMonthlyServices: PropTypes.arrayOf(PropTypes.object),
  setMonthlyAdditionalServices: PropTypes.func,
  originalData: PropTypes.shape({
    id: PropTypes.string,
    additional_services: PropTypes.arrayOf(PropTypes.array),
    start_date: PropTypes.string,
    company_name: PropTypes.string,
    primary_marketplace: PropTypes.string,
    additional_marketplaces: PropTypes.arrayOf(PropTypes.array),
    additional_monthly_services: PropTypes.arrayOf(PropTypes.object),
    additional_one_time_services: PropTypes.arrayOf(PropTypes.object),
    quantity: PropTypes.number,
  }),
  additionalMarketplacesData: PropTypes.arrayOf(PropTypes.object),
  setAdditionalMarketplace: PropTypes.func,
  additionalOnetimeServices: PropTypes.arrayOf(PropTypes.object),
  setAdditionalOnetimeServices: PropTypes.func,
  additionalMarketplaceError: PropTypes.shape(PropTypes.object),
  setAdditionalMarketplaceError: PropTypes.func,
  additionalMonthlySerError: PropTypes.shape(PropTypes.object),
  setAdditionalMonthlySerError: PropTypes.func,
  additionalOnetimeSerError: PropTypes.shape({
    quantity: PropTypes.number,
  }),
  setAdditionalOnetimeSerError: PropTypes.func,
  contractError: PropTypes.shape(PropTypes.object),
  setContractError: PropTypes.func,
  setOriginalAddendumData: PropTypes.func,
  showEditor: PropTypes.bool,
  openCollapse: PropTypes.shape({
    agreement: PropTypes.bool,
    statement: PropTypes.bool,
    addendum: PropTypes.bool,
    dspAddendum: PropTypes.bool,
    amendment: PropTypes.bool,
  }),
  setOpenCollapse: PropTypes.func,
  amazonStoreCustom: PropTypes.bool,
  setAmazonStoreCustom: PropTypes.func,
  showAmazonPlanDropdown: PropTypes.bool,
  setShowAmazonPlanDropdown: PropTypes.func,
  showAdditionalMarketplace: PropTypes.bool,
  setShowAdditionalMarketplace: PropTypes.func,
  startDate: PropTypes.instanceOf(Date),
  setStartDate: PropTypes.func,
  sectionError: PropTypes.shape(PropTypes.object),
  setSectionError: PropTypes.func,
};

const SidePanel = styled.div`
    min-width: 60px;
    z-index: 1;
    padding-bottom: 250px;
    width: 336px;
    position: fixed;
    top: 130px;
    right: 0;
    height: 100%;
    background: ${Theme.white};
    border-left: 1px solid ${Theme.gray7};
    overflow-y:auto;
    
    .sidebar {
      /* width: 335px; */
    }
    
    // @media screen and (-webkit-min-device-pixel-ratio: 0) {
    //   .sidebar {
    //     padding-bottom: 400px;
    //   }
    // }
    .error-found {
      color: ${Theme.red};
      font-size: ${Theme.small};
      word-spacing: normal;
      font-weight: 300;
    }
    
  .sendar-details {
    color: ${Theme.black};
    font-size: ${Theme.extraMedium};
    font-family: ${Theme.baseFontFamily};
    text-transform: inherit;
    margin-top: 6px;
    margin-left: 16px;
    float: left;
    word-spacing: 3px;
   
    &.error-container {
    margin-top: -3px;
  }
   
  
   .green-check-select {
     width: 16px;
     position: absolute;
     right: 21px;
     top: 22px;
    }

    .red-cross {
      width: 16px;
      position: absolute;
      right: 21px;
      top: 25px;
    }
    
   .error-bg {
      height: 63px;
      background: ${Theme.lightRed};
      right: 0px;
      border-right: 2px solid #D63649;
      z-index: -2;
      top: 0px;
      position: absolute;
      width: 46px;

      .red-cross {
        width: 16px;
        position: absolute;
        right: 13px;
        top: 25px;
      }
    }
}

  .sender-profile {
    border: 1px solid ${Theme.gray9};
    border-radius: 100%;
    width: 48px;
    height: 48px;
  }
  .sender-name {
    text-transform: capitalize;
    color: ${Theme.gray90};
    font-size: ${Theme.medium};
  }

  .sticky-btn {
    bottom: 100px;
    position: absolute;
  }
  .service-detail {
    padding:20px 20px 0 20px;
  }
  .service-agre {
    float: left;
    width: 32px;
  }
  h4 .sendar-details {
    float: left;
    margin: 9px 0px 0px 20px;
  }
}
  
.add-market-place {
  font-size: 12px;
  color:${Theme.orange};
}

.collapse-btn {
  width:100%;
  padding: 15px;
  cursor:pointer;
  position: relative;

}
.collapse-container {
  padding: 15px;
}

.collapse-inner {
    margin:0;
    padding:0;
    list-style-type:none;
   
    li {
        padding: 8px 20px;

        &:focus {
          background: ${Theme.lightOrange};
        }
         .small-para {
          font-size: ${Theme.extraNormal};
          color: ${Theme.gray40};
          line-height: 22px;
         }
        .edit-folder-icon {
          vertical-align: text-top;
          width: 17px;
        }

        .service-heading {
          text-transform: uppercase;
          letter-spacing: 1.13px;
          text-transform: uppercase;
          font-family: ${Theme.baseFontFamily};
          font-size:${Theme.extraSmall};
          color: ${Theme.gray30};
          font-weight: bold;
        }
        .listing-optimazation {
          color:  ${Theme.gray85};
          font-size: ${Theme.extraNormal};
        }

        .text-end {
          text-align: end;
        }

        .increment {
           border: 1px solid ${Theme.gray45};
            border-radius: 0 2px 2px 0;
            width: 26px;
            height: 26px;
            padding 4px;
            background: ${Theme.gray8};
            vertical-align: bottom;
            cursor: pointer;

           .plus-icon{
             width: 10px;
           }

           &:focus{
             outline: none;
           }
        }
        .decrement {
           border: 1px solid ${Theme.gray45};
            border-radius: 2px 0 0 2px;
            width: 26px;
            height: 26px;
            vertical-align: bottom;
            padding: 4px;
            background: ${Theme.gray8};
            font-family: ${Theme.titleFontFamily};
            cursor:pointer;

           .minus-icon {
              width: 10px;
           }
             &:focus{
             outline:none;
           }
        }
        .max-min-number {
          width: 26px;
          border: 1px solid ${Theme.gray45};
          vertical-align: bottom;
          color: ${Theme.black};
          height: 26px;
          font-size: 14px;
          font-family: ${Theme.titleFontFamily};
          text-align: center;
        }

        .contract-info-date {
          line-height: 22px;
          font-size: 14px;
          color: ${Theme.gray40};
        }
        .add-discount {
          color: #FF4817;
          font-size: 11px;
          position: absolute;
          right: 0;
          top: 4px;
          cursor: pointer;
        }
     }
   } 
   .contract-status {
      color: ${Theme.gray85};
      font-size: 14px;
      border-radius: 2px;
      text-align: center;
      background: ${Theme.extraLightYellow};
      padding: 12px 0;
      min-height: 40px;
      margin: 10px 0px 10px 10px;

      &.pending-contract {
        background: ${Theme.gray8};
      }
      &.pending-signature {
        background: #FFDED6;
      }
      &.signature {
        background: ${Theme.white};
        border: 1px solid ${Theme.gray45};
      }
   }

   .contract-file-icon {
      vertical-align: bottom;
      margin-right: 7px;
   }

  .activity-log {
    font-size: ${Theme.extraMedium};
    padding: 20px 20px 0 15px;
    color: ${Theme.black};
    font-weight: 600;
  }
  .current-agreement-title {
      padding: 20px;
      text-transform: uppercase;
      border-bottom: 1px solid ${Theme.gray9};
  }
  .menu{
     padding:0;
      li {
        color:${Theme.white};
        text-align: center;
        font-size: 18px;
        font-weight: 900;
        list-style: none;
        display: flex;
        text-decoration: none;
        padding: 10px 0px 15px 15px;
      
        &:last-child {
          border-bottom:none;
        }

        .default-user-activity {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          float: left;
          margin-right: 15px;
          margin-top: -2px;
        }

        .activity-user {
          font-size: ${Theme.normal};
          color:${Theme.gray90};
          float: left;
          word-break: break-word;
          width: 85%;
          text-align: left;
          span {
            color:${Theme.gray35};
            font-weight: 500;
          }
        }

        .default-user {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          float: left;
          margin-right: 10px;
        }

        .time-date {
          color:${Theme.gray40};
          font-size: ${Theme.small};
          font-weight: 500;
          text-align: left;
        }
         .pdf-download {
          width:33px;
          height:33px;
          margin-left: 10px;
          padding:6px;
          cursor:pointer;
          float:right;

          &:hover{
            background:${Theme.gray8};
            border-radius: 50%;
            width:33px;
            height:33px;
            padding:6px;
          }
          
        }
        
      }

    }
  }

  @media only screen and (max-width: 991px) {  
    z-index: 1;
    padding-bottom: 390px;
    width: 100%;
    position: fixed;
    top: 200px;
    right: 0;
    left:0;

  }

   @media only screen and (min-width: 1500px)  {
     width: 406px;
     .sidebar {
      width: 400px;
    }
    
   }
`;

const Footer = styled.div`
  // border: 1px solid ${Theme.gray7};
  // bottom: 79px;
  // background: ${Theme.white};
  // box-shadow: ${Theme.boxShadow};
  // position: fixed;
  // min-height: 60px;
  // z-index: 2;

  // &.pdf-footer {
  //   bottom: 0px;
  // }
  // @media only screen and (max-width: 991px) {
  //   width: 100%;
  //   bottom: 134px;
  // }
`;
