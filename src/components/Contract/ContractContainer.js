/* eslint no-param-reassign: "error" */
/* eslint consistent-return: "error" */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import cloneDeep from 'lodash/cloneDeep';
import styled from 'styled-components';
import Modal from 'react-modal';
import queryString from 'query-string';
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-toastify';
import PdfViewer from '../../common/PdfViewer';
import Theme from '../../theme/Theme';

import AgreementSidePanel from '../../common/AgreementSidePanel';
import Agreement from './Agreement';
import ServicesAmendment from './ServicesAmendment';
import DSPAddendum from './DSPAddendum';
import Addendum from './Addendum';
import Statement from './Statement';
import Discount from './Discount';
import ContractFooter from './ContractFooter';
import {
  PageLoader,
  PageNotFound,
  Button,
  ModalBox,
  HeaderDownloadFuntionality,
} from '../../common';
import {
  agreementTemplate,
  getcontract,
  getServicesFee,
} from '../../api/AgreementApi';
import RequestSignature from './RequestSignature';
import { CloseIcon, OrangeDownloadPdf } from '../../theme/images';
import { PATH_CUSTOMER_DETAILS, PATH_CUSTOMER_LIST } from '../../constants';
import THAD_SIGN_IMG from '../../constants/ThadSignImg';
import {
  updateAccountDetails,
  createMarketplace,
  updateMarketplace,
  createAddendum,
  getAddendum,
  updateAddendum,
  createMarketplaceBulk,
  createAdditionalServiceBulk,
  getMarketplaces,
  getContractActivityLog,
  getDocumentList,
  createContractDesign,
  updateCustomerDetails,
  getMonthlyService,
  getOneTimeService,
  getThresholdType,
  getYoyPercentage,
} from '../../api';
import { AgreementSign, AddendumSign } from '../../constants/AgreementSign';
import {
  AgreementDetails,
  StatementDetails,
  DSPAddendumDetails,
} from '../../constants/FieldConstants';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '600px ',
    width: '100% ',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const customStylesForAlert = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '474px ',
    width: '100% ',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
export default function ContractContainer() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const params = queryString.parse(history.location.search);

  const id = location.pathname.split('/')[2];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [updatedFormData, setUpdatedFormData] = useState({});
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [showModal, setShowModal] = useState(false);
  const [amazonStoreCustom, setAmazonStoreCustom] = useState(false);
  const [showAmazonPlanDropdown, setShowAmazonPlanDropdown] = useState(false);

  const [showDiscardModal, setShowDiscardModal] = useState({
    clickedBtn: '',
    show: false,
  });
  const [isEditContract, setIsEditContract] = useState(false);
  const [details, setDetails] = useState({});
  const [marketplacesResult, setMarketplacesResult] = useState([]);

  const [editContractFlag, setEditContractFlag] = useState(true);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [
    showEditContractConfirmationModal,
    setShowEditContractConfirmationModal,
  ] = useState(false);

  const [isFooter, showFooter] = useState(false);
  const [newAddendumData, setNewAddendum] = useState(null);
  const [originalAddendumData, setOriginalAddendumData] = useState(null);

  const [showEditor, setShowEditor] = useState(false);
  const [pdfData, setPDFData] = useState('');
  const [startDate, setStartDate] = useState();

  const [notIncludedOneTimeServices, setNotIncludedOneTimeServices] = useState(
    [],
  );
  const [notIncludedMonthlyServices, setNotIncludedMonthlyServices] = useState(
    [],
  );
  const [additionalMonthlyServices, setMonthlyAdditionalServices] = useState(
    [],
  );
  const [additionalMarketplacesData, setAdditionalMarketplace] = useState({});
  const [additionalOnetimeServices, setAdditionalOnetimeServices] = useState(
    [],
  );

  const [apiError, setApiError] = useState({});
  const [sectionError, setSectionError] = useState({});
  const [additionalMarketplaceError, setAdditionalMarketplaceError] = useState(
    {},
  );
  const [additionalMonthlySerError, setAdditionalMonthlySerError] = useState(
    {},
  );
  const [additionalOnetimeSerError, setAdditionalOnetimeSerError] = useState(
    {},
  );
  const [customerError, setCustomerErrors] = useState({});

  const [contractError, setContractError] = useState({});
  const [showAdditionalMarketplace, setShowAdditionalMarketplace] = useState(
    false,
  );

  const [downloadApiCall, setDownloadApiCall] = useState(false);
  const [isDocRendered, setIsDocRendered] = useState(false);

  const [showPageNotFound, setPageNotFoundFlag] = useState(false);
  const [showSection, setShowCollpase] = useState({
    addendum: false,
    dspAddendum: false,
    amendment: false,
  });
  const [openCollapse, setOpenCollapse] = useState({
    agreement: false,
    statement: false,
    addendum: false,
    dspAddendum: false,
    amendment: false,
  });
  const [loaderFlag, setLoaderFlag] = useState(true);
  const [contractDesignLoader, setContractDesignLoader] = useState(null);
  const [calculatedDate, setCalculatedDate] = useState(null);
  const [firstMonthDate, setFirstMonthDate] = useState(null);
  const [secondMonthDate, setSecondMonthDate] = useState(null);
  const [thirdMonthDate, setThirdMonthDate] = useState(null);
  const [endMonthDate, setEndDate] = useState(null);
  const [tabInResponsive, setShowtabInResponsive] = useState('view-contract');
  const [discountFlag, setDiscountFlag] = useState('');
  const [marketPlaces, setMarketPlaces] = useState([]);
  const [additionalMarketplaces, setAdditionalMarketplaces] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [activityCount, setActivityCount] = useState([]);
  const [pageNumber, setPageNumber] = useState();
  const [images, setImages] = useState([]);
  const [activityLoader, setActivityLoader] = useState(false);
  const [isApicalled, setIsApicalled] = useState(false);
  const [showSignSuccessMsg, setShowSignSuccessMsg] = useState(false);
  const [showSaveSuccessMsg, setShowSaveSuccessMsg] = useState(false);

  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [oneTimeService, setOneTimeService] = useState([]);
  const [monthlyService, setMonthlyService] = useState([]);
  const [AmazonStoreOptions, setAmazonStoreOptions] = useState(false);
  const [thresholdTypeOptions, setThresholdTypeOptions] = useState(false);
  const [yoyPercentageOptions, setYoyPercentageOptions] = useState(false);
  const [servicesFees, setServicesFees] = useState({});

  const executeScroll = (eleId) => {
    const element = document.getElementById(eleId);
    const offset = isDesktop ? -150 : isMobile ? -220 : -220;
    const y =
      element &&
      element.getBoundingClientRect() &&
      element.getBoundingClientRect().top + window.pageYOffset + offset;

    window.scrollTo({ top: y });
  };

  if (
    isLoading.loader === true &&
    isLoading.type === 'page' &&
    details &&
    details.id &&
    loaderFlag === true
  ) {
    setIsLoading({ loader: false, type: 'page' });
    setLoaderFlag(false);
  }

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

  const splittedPath =
    location && location.pathname && location.pathname.split('/');

  const getContractActivityLogInfo = useCallback(
    (currentPage) => {
      setActivityLoader(true);
      getContractActivityLog(currentPage, splittedPath && splittedPath[4]).then(
        (response) => {
          setActivityData(response && response.data && response.data.results);
          setActivityCount(response && response.data && response.data.count);
          setPageNumber(currentPage);
          getDocumentList().then((picResponse) => {
            setImages(picResponse);
          });
          setActivityLoader(false);
          setIsApicalled(true);
        },
      );
    },
    [splittedPath],
  );

  if (!isLoading.loader && !activityLoader) {
    if (showSignSuccessMsg) {
      toast.success('Signature Requested Successfully!');
      setShowSignSuccessMsg(false);
    }
    if (showSaveSuccessMsg) {
      toast.success('Changes Saved!');
      setShowSaveSuccessMsg(false);
    }
  }

  if (isDocRendered && formData && formData.id) {
    if (
      (formData &&
        formData.contract_status &&
        formData.contract_status.value === 'active') ||
      (formData &&
        formData.contract_status &&
        formData.contract_status.value === 'inactive')
    ) {
      setIsDocRendered(false);
      setDownloadApiCall(true);
    }

    if (
      ((formData &&
        formData.contract_type &&
        formData.contract_type.toLowerCase().includes('dsp')) ||
        (formData &&
          formData.contract_type &&
          formData.contract_type.toLowerCase().includes('recurring') &&
          showSection.dspAddendum)) &&
      (!formData.start_date ||
        (formData.start_date &&
          firstMonthDate &&
          secondMonthDate &&
          thirdMonthDate))
    ) {
      setIsDocRendered(false);
      setDownloadApiCall(true);
    }

    if (
      !(
        formData &&
        formData.contract_type &&
        formData.contract_type.toLowerCase().includes('dsp')
      ) &&
      formData &&
      formData.contract_type &&
      formData.contract_type.toLowerCase().includes('recurring') &&
      !showSection.dspAddendum
    ) {
      setIsDocRendered(false);
      setDownloadApiCall(true);
    }

    if (
      formData &&
      formData.contract_type &&
      formData.contract_type.toLowerCase().includes('one')
    ) {
      setIsDocRendered(false);
      setDownloadApiCall(true);
    }
  }

  const getContractDetails = (showSuccessToastr = false) => {
    setIsLoading({ loader: true, type: 'page' });

    if (splittedPath) {
      getcontract(splittedPath[4]).then((res) => {
        if (res && res.status === 200) {
          setDetails(res.data);
          setFormData(res.data);
          setOriginalData(res.data);
          if (showSuccessToastr) {
            setShowSignSuccessMsg(showSuccessToastr);
          }
          // setIsDocRendered(true);
        } else {
          setIsLoading({ loader: false, type: 'page' });

          setLoaderFlag(false);
          setPageNotFoundFlag(true);
        }
      });
      getContractActivityLogInfo();
      setLoaderFlag(true);
    } else {
      const path = location.pathname.slice(
        0,
        location.pathname.lastIndexOf('/'),
      );
      history.push(path);
    }
  };
  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current) {
      setIsLoading({ loader: true, type: 'page' });
      setTimeout(() => setIsLoading({ loader: false, type: 'page' }), 500);
    } else {
      isMounted.current = true;
    }
  }, [isTablet, isMobile]);

  useEffect(() => {
    agreementTemplate().then((response) => {
      setData(
        response &&
          response.data &&
          response.data.results &&
          response.data.results[0],
      );

      getContractDetails();
    });

    getAddendum({ customer_id: id }).then((addendum) => {
      setNewAddendum(
        addendum &&
          addendum.data &&
          addendum.data.results &&
          addendum.data.results[0],
      );
      setOriginalAddendumData(
        addendum &&
          addendum.data &&
          addendum.data.results &&
          addendum.data.results[0],
      );
    });

    getThresholdType().then((thresholdType) => {
      setThresholdTypeOptions(thresholdType);
    });

    getYoyPercentage().then((yoyPercentage) => {
      setYoyPercentageOptions(yoyPercentage);
    });

    getMarketplaces().then((market) => {
      setMarketPlaces(market.data);
      setAdditionalMarketplaces(market.data);
      setMarketplacesResult(market.data);
    });
    getMonthlyService().then((res) => {
      setMonthlyService(res.data);

      // fetchUncommonOptions(
      //   res && res.data,
      //   formData.additional_monthly_services,
      //   'monthly_service',
      // );
    });

    getServicesFee().then((res) => {
      setServicesFees(res.data);
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
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  const showTabInResponsive = (section) => {
    if (section === 'edit-fields') {
      setShowtabInResponsive('edit-fields');
    }
    if (section === 'view-contract') {
      setShowtabInResponsive('view-contract');
    }
  };

  const onEditAddendum = () => {
    setShowEditor(true);
    if (isTablet || isMobile) {
      showTabInResponsive('view-contract');
      setTimeout(() => executeScroll('addendum'), 500);
    }
  };

  const clearError = () => {
    setApiError({});
    setAdditionalMarketplaceError({});
    setAdditionalMonthlySerError({});
    setAdditionalOnetimeSerError({});
    setContractError({});
  };
  const discardAgreementChanges = (flag) => {
    if (flag === 'No') {
      setShowDiscardModal({ ...showDiscardModal, show: false, clickedBtn: '' });
    }

    if (flag === 'Yes') {
      setShowDiscardModal({ ...showDiscardModal, show: false, clickedBtn: '' });
      setUpdatedFormData({});
      if (showDiscardModal.clickedBtn === 'back') {
        history.push(PATH_CUSTOMER_DETAILS.replace(':id', id));
      }
      setSectionError({});
      setFormData(details);
      showFooter(false);
      setIsEditContract(false);
      setShowEditor(false);
      setStartDate('');
      setNewAddendum(originalAddendumData);
      clearError();
      setShowAmazonPlanDropdown(false);
      setAmazonStoreCustom(false);

      setCalculatedDate(null);
      setFirstMonthDate(null);
      setSecondMonthDate(null);
      setThirdMonthDate(null);
      setEndDate(null);

      if (
        originalData &&
        originalData.additional_marketplaces &&
        originalData.additional_marketplaces.length
      ) {
        setShowAdditionalMarketplace(true);
      } else {
        setShowAdditionalMarketplace(false);
      }
      getContractDetails();
    }
  };

  const editAgreementChanges = (flag) => {
    if (flag === 'No') {
      setShowEditContractConfirmationModal(false);
    }

    if (flag === 'Yes') {
      const dataToUpdate = {
        contract_status: 'pending contract',
      };
      setIsLoading({ loader: true, type: 'page' });
      setLoaderFlag(false);
      updateAccountDetails(details.id, dataToUpdate).then((response) => {
        if (response && response.status === 200) {
          getContractDetails();
          setIsEditContract(true);
        }
      });
      setShowEditContractConfirmationModal(false);
    }
  };

  const calculateTotalDays = (flag = '') => {
    let firstMonthdays = 0;
    if (new Date(firstMonthDate).getDate() !== 1) {
      const totalDays = new Date(
        new Date(firstMonthDate).getFullYear(),
        new Date(firstMonthDate).getMonth() + 1,
        0,
      ).getDate();
      const currentDate = new Date(firstMonthDate).getDate();
      firstMonthdays = totalDays - currentDate;
    } else {
      firstMonthdays = new Date(
        new Date(firstMonthDate).getFullYear(),
        new Date(firstMonthDate).getMonth() + 1,
        0,
      ).getDate();
    }

    let extraDays = 0;
    if (new Date(firstMonthDate).getDate() !== 1) {
      extraDays = new Date(
        new Date(endMonthDate).getFullYear(),
        new Date(endMonthDate).getMonth() + 1,
        0,
      ).getDate();
    }
    const secondMonthdays = new Date(
      new Date(secondMonthDate).getFullYear(),
      new Date(secondMonthDate).getMonth() + 1,
      0,
    ).getDate();
    const thirdMonthdays = new Date(
      new Date(thirdMonthDate).getFullYear(),
      new Date(thirdMonthDate).getMonth() + 1,
      0,
    ).getDate();

    const totaldays =
      firstMonthdays + extraDays + secondMonthdays + thirdMonthdays;

    if (flag === 'initial') {
      if (totaldays < 105) {
        return '3';
      }
      return '3.5';
    }
    if (totaldays < 105) {
      return `90 days (3 months)`;
    }
    return `105 days (3.5 months)`;
  };

  const mapDefaultValues = (key, label, type) => {
    if (key === 'company_name') {
      return details && details.customer_id && details.customer_id[key]
        ? details && details.customer_id && details.customer_id[key]
        : `Client Name`;
    }

    if (key === 'length' && label === 'Initial Period') {
      if (
        formData &&
        formData.contract_type &&
        formData.contract_type.toLowerCase().includes('dsp')
      ) {
        return calculateTotalDays('initial');
      }
      if (
        formData[key] === undefined ||
        formData[key] === '' ||
        formData[key] === null
      ) {
        return `Enter ${label}`;
      }
      return (
        formData &&
        formData.length &&
        formData.length.label &&
        parseInt(formData.length.label, 10)
      );
    }
    if (key === 'length') {
      // return details && details.length && details.length.label;

      return formData && formData.length && formData.length.label
        ? formData.length.label
        : formData.length
        ? formData.length
        : 'Select Length';
    }
    if (key === 'primary_marketplace') {
      if (details && details.primary_marketplace) {
        return details &&
          details.primary_marketplace &&
          details.primary_marketplace.name
          ? details.primary_marketplace.name
          : details.primary_marketplace;
      }
      return `Enter ${label}.`;
    }

    if (key === 'start_date') {
      // return
      return formData && formData[key] !== null
        ? formData && dayjs(formData[key]).format('MM / DD / YYYY')
        : 'Select Date';
      // details && dayjs(details[key]).format('MM / DD / YYYY');
    }
    if (key === 'current_date') {
      return dayjs(Date()).format('MM / DD / YYYY');
    }
    if (key === 'calculated_no_of_days') {
      return calculateTotalDays();
    }

    if (key === 'address') {
      if (
        ((formData &&
          formData.customer_id &&
          formData.customer_id.address === '') ||
          (formData &&
            formData.customer_id &&
            formData.customer_id.address === null)) &&
        ((formData &&
          formData.customer_id &&
          formData.customer_id.state === '') ||
          (formData &&
            formData.customer_id &&
            formData.customer_id.state === null)) &&
        ((formData &&
          formData.customer_id &&
          formData.customer_id.city === '') ||
          (formData &&
            formData.customer_id &&
            formData.customer_id.city === null)) &&
        ((formData &&
          formData.customer_id &&
          formData.customer_id.zip_code === '') ||
          (formData &&
            formData.customer_id &&
            formData.customer_id.zip_code === null))
      ) {
        return `Enter Location`;
      }
      return `${
        formData && formData.customer_id && formData.customer_id.address
          ? formData && formData.customer_id && formData.customer_id.address
          : ''
      }${
        formData &&
        formData.customer_id &&
        formData.customer_id.address &&
        ((formData && formData.customer_id && formData.customer_id.state) ||
          (formData && formData.customer_id && formData.customer_id.city) ||
          (formData && formData.customer_id && formData.customer_id.zip_code))
          ? ','
          : ''
      }
       ${
         formData && formData.customer_id && formData.customer_id.city
           ? formData && formData.customer_id && formData.customer_id.city
           : ''
       }${
        formData &&
        formData.customer_id &&
        formData.customer_id.city &&
        (formData.customer_id.state ||
          (formData && formData.customer_id && formData.customer_id.zip_code))
          ? ','
          : ''
      }
      ${
        formData && formData.customer_id && formData.customer_id.state
          ? formData && formData.customer_id && formData.customer_id.state
          : ''
      }${
        formData &&
        formData.customer_id &&
        formData.customer_id.state &&
        formData &&
        formData.customer_id &&
        formData.customer_id.zip_code
          ? ','
          : ''
      }
     
      ${
        formData && formData.customer_id && formData.customer_id.zip_code
          ? formData && formData.customer_id && formData.customer_id.zip_code
          : ''
      }
      `;
    }

    if (details[key] === undefined || details[key] === '') {
      if (label === 'Dsp Fee') {
        return `Enter DSP Fee`;
      }
      return `Enter ${label}`;
    }

    if (key === 'threshold_type') {
      if (details && details[key] === 'YoY') {
        return 'YoY: All channel sales above previous year channel sales.';
      }
      if (details && details[key] === 'YoY + %') {
        return `YoY + %: All channel sales above a <span style=" background:#ffe5df;padding: 4px 9px;font-weight: bold">${
          details && details.yoy_percentage
            ? details && details.yoy_percentage
            : `Enter ${label}.`
        }</span> growth on previous year channel sales.`;
      }
      if (details && details[key] === 'Fixed') {
        return `Fixed: <span style=" background:#ffe5df;padding: 4px 9px;font-weight: bold">${
          details && details.sales_threshold
            ? `$${
                details &&
                details.sales_threshold
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }`
            : `Enter ${label}.`
        }</span>`;
      }
    }

    if (type && type.includes('number')) {
      if (details && details[key]) {
        return `${type === 'number-currency' ? '$' : '%'}${details[key]
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
      }
      return `Enter ${label}`;
    }

    const result =
      key === 'rev_share' || key === 'seller_type'
        ? details && details[key] && details[key].label
          ? details && details[key] && details[key].label
          : (details && details[key] === null) ||
            (details && details[key] === '') ||
            (details && details[key] === undefined)
          ? `Enter ${label}`
          : details && details[key]
        : details && details[key];

    return result;
    // return details && details[key];
  };

  const showRevTable = () => {
    if (
      details &&
      details.threshold_type &&
      details.threshold_type !== 'None'
    ) {
      return `<table class="contact-list " style="width: 100%;
    border-collapse: collapse;"><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Type</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Description</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;"> Rev Share %</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;"> Sales Threshold Type</th>
      </tr><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><td style="border: 1px solid black;
    padding: 13px;">% Of Incremental Sales</td>
      <td style="border: 1px solid black;
    padding: 13px;">A percentage of all Managed Channel Sales (retail dollars, net customer returns) for all sales over the sales 
      threshold each month through the Amazon Seller Central and Vendor Central account(s) that BBE manages for Client.</td><td style="border: 1px solid black;
    padding: 13px;"> <span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold;"> REVENUE_SHARE</span> </td><td style="border: 1px solid black;
    padding: 13px; "> <span >REV_THRESHOLD </span></td></tr></table>`;
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
    padding: 13px;"> <span style=" background:#ffe5df;padding: 4px 9px;font-weight: bold;"> REVENUE_SHARE</span></td></tr></table>`;
  };

  const mapThadSignImg = () => {
    return THAD_SIGN_IMG;
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
              // item &&
              // item.service &&
              // item.service.name !== 'DSP Advertising' &&
              item &&
              item.service &&
              item.service.name !== 'Inventory Reconciliation'
            ) {
              fields.push(
                `<tr>
                <td style="border: 1px solid black;padding: 13px;">${
                  item.service ? item.service.name : item && item.name
                }</td>
                ${
                  item.name
                    ? item.name === 'DSP Advertising'
                    : item.service.name === 'DSP Advertising'
                    ? `<td style="border: 1px solid black;padding: 13px;">N/A</td>`
                    : `<td style="border: 1px solid black;padding: 13px;">$${
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
                </td>`
                }
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
               ${
                 (
                   item.name
                     ? item.name.includes('Amazon Store Package Custom')
                     : item.service.name.includes('Amazon Store Package Custom')
                 )
                   ? item.custom_amazon_store_price
                     ? `<td style="border: 1px solid black;padding: 13px;">
                                $${item.custom_amazon_store_price
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                               </td>`
                     : `<td style="border: 1px solid black;padding: 13px;">Yet to save</td>`
                   : item && item.service && item.service.fee
                   ? `<td style="border: 1px solid black;padding: 13px;">
                           $${(item && item.service && item.service.fee
                             ? item.service.fee
                             : ''
                           )
                             .toString()
                             .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} </td>`
                   : `<td style="border: 1px solid black;padding: 13px;">Yet to save</td>`
               }

     
            <td style="border: 1px solid black;padding: 13px;">$${(item.service
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
      return fields.length ? fields.toString().replaceAll('>,<', '><') : '';
    }
    return '';
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
                    <td style="border: 1px solid black;padding: 13px;">$${
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
    return fields.length ? fields.toString().replaceAll('>,<', '><') : '';
  };

  const mapVariableMonthlyService = () => {
    const fields = [
      `<tr ><td colspan="2" style ="text-align: center; border: 1px solid black;padding: 13px; font-weight: 800">
                  Variable Monthly Services</td>
                  </tr>`,
    ];
    if (details && details.additional_monthly_services) {
      for (const item of details.additional_monthly_services) {
        if (
          item &&
          item.service &&
          item.service.name === 'Inventory Reconciliation'
        ) {
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
      return `$${
        details &&
        details.total_fee &&
        details.total_fee.onetime_service_after_discount
          ? details.total_fee.onetime_service_after_discount
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

    return `$${(market + month)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const mapMonthlyServiceTotal = () => {
    return `
    ${
      details && details.total_fee && details.total_fee.monthly_service_discount
        ? `<tr style=" border: 1px solid black;">
            <td class="total-service" style="border-bottom: hidden;border-left: 1px solid black; padding: 5px 13px"> Sub-total</td>
            <td class="total-service text-right" style="border-bottom: hidden; border-left: 1px solid black; padding: 5px 13px; text-align:right">${mapServiceTotal(
              'additional_monthly_services',
            )}
            </td>
         </tr>`
        : ''
    }
    ${
      details && details.total_fee && details.total_fee.monthly_service_discount
        ? `<tr style=" border: 1px solid black;">
            <td class="total-service" style="border-bottom: hidden;border-left: 1px solid black; padding: 5px 13px"> Discount ${
              details &&
              details.monthly_discount_amount &&
              details &&
              details.monthly_discount_type === 'percentage'
                ? `(${details && details.monthly_discount_amount}%)`
                : ''
            }</td>
            <td class="total-service text-right"style="border-bottom: hidden; border-left: 1px solid black; padding: 5px 13px; text-align:right"> -$${
              details &&
              details.total_fee &&
              details.total_fee.monthly_service_discount
                ? details &&
                  details.total_fee &&
                  details.total_fee.monthly_service_discount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : 0
            }
            </td>
         </tr>`
        : ''
    }
         <tr>
            <td class="total-service" style="border: 1px solid black;padding: 5px 13px; font-weight: 800"> Total</td>
            <td class="total-service text-right" style="border: 1px solid black;padding: 5px 13px ;font-weight: 800; text-align:right"> $${
              details &&
              details.total_fee &&
              details.total_fee.monthly_service_after_discount
                ? details.total_fee.monthly_service_after_discount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : 0
            }
            </td>
         </tr>
         `;
  };

  const mapOnetimeServiceTotal = () => {
    return `
    ${
      details && details.total_fee && details.total_fee.onetime_service_discount
        ? `<tr style=" border: 1px solid black;">
            <td class="total-service" colspan="3" style="border-bottom: hidden;border-left: 1px solid black; padding: 5px 13px;"> Sub-total</td>
            <td class="total-service text-right" style="border-bottom: hidden;border-left: 1px solid black; padding: 5px 13px; text-align:right">$${
              details &&
              details.total_fee &&
              details.total_fee.onetime_service
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            </td>
         </tr>`
        : ''
    }
       ${
         details &&
         details.total_fee &&
         details.total_fee.onetime_service_discount
           ? `<tr style=" border: 1px solid black;">
            <td class="total-service" colspan="3" style="border-bottom: hidden; border-left: 1px solid black;padding: 5px 13px;"> Discount ${
              details &&
              details.one_time_discount_amount &&
              details &&
              details.one_time_discount_type === 'percentage'
                ? `(${details && details.one_time_discount_amount}%)`
                : ''
            }</td>
            <td class="total-service text-right" style="border-bottom: hidden;border-left: 1px solid black; padding: 5px 13px; text-align:right"> -$${
              details &&
              details.total_fee &&
              details.total_fee.onetime_service_discount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            </td>
         </tr>`
           : ''
       }
         
         <tr>
            <td class="total-service" colspan="3" style="border: 1px solid black;padding: 5px 13px ; font-weight: 800"> Total</td>
            <td class="total-service text-right" style="border: 1px solid black;padding: 5px 13px ;font-weight: 800; text-align:right"> $${
              details &&
              details.total_fee &&
              details.total_fee.onetime_service_after_discount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            </td>
         </tr>
         `;
  };

  const showMonthlyServiceTable = () => {
    if (
      details &&
      details.additional_monthly_services &&
      details.additional_monthly_services.length
    ) {
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center"><span style="font-weight: 800;
    font-family: Helvetica-bold;">Additional Monthly Services </span><br> The following additional monthly services will be provided to Client in addition to the Monthly Retainer.</div><br><table class="contact-list " style="width: 100%;
    border-collapse: collapse;><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Service</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Service Fee</th></tr>${mapMonthlyServices(
      'additional_monthly_services',
      'Monthly Services',
    )} ${mapAdditionalMarketPlaces()}${mapMonthlyServiceTotal()}
                              ${mapVariableMonthlyService()}
                                </table>`;
    }
    return '';
  };

  const showOneTimeTable = () => {
    if (
      details &&
      details.additional_one_time_services &&
      details.additional_one_time_services.length
    ) {
      return `<table
    class="contact-list "
    style="width: 100%;
    border-collapse: collapse;
">
    <tr
      style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;">
      <th
        style="text-align: left;border: 1px solid black;
    padding: 13px;">
        Quantity
      </th>
      <th
        style="text-align: left;border: 1px solid black;
    padding: 13px;">
        Service
      </th>
      <th
        style="text-align: left;border: 1px solid black;
    padding: 13px;">
        Service Fee
      </th>
      <th
        style="text-align: left;border: 1px solid black;
    padding: 13px;">
        Total Service Fee
      </th>
    </tr>
    ${mapMonthlyServices('additional_one_time_services', 'One Time Services')}
    ${mapOnetimeServiceTotal()}
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
    font-family: Helvetica-bold;">Additional One Time Services </span><br>The following additional monthly services will be provided to Client as a one time service in addition to the Monthly Retainer and any Additional Monthly services.</div><br>${showOneTimeTable()}`;
    }
    return '';
  };

  const showBillingCap = () => {
    if (formData && formData.billing_cap) {
      return `<br><br><div class=" text-center " style="text-align: center;"><span style="font-weight: 800;
      font-family: Helvetica-bold;"> Billing Cap </span> </div><div style="text-align: center;">Maximum amount that will be charged between the monthly retainer and revenue share.</div>
      <div class=" text-center input-contact-value mt-3" style="margin-top: 1rem!important; text-align: center;"><span style="background:#ffe5df;padding: 4px 9px; font-weight: bold"> 
      ${mapDefaultValues(
        'billing_cap',
        'Billing Cap',
        'number-currency',
      )}</span></div>`;
    }
    return '';
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

  const showNotIncludedServicesTable = () => {
    if (
      notIncludedMonthlyServices.length ||
      notIncludedOneTimeServices.length
    ) {
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center;"><span style="font-weight: 800;
    font-family: Helvetica-bold;">Additional Services Not Included</span><br>The following services are not part of this agreement, but can be purchased after signing by working with your Buy Box Experts Brand Growth Strategist or Sales Representative.</div><div class="table-responsive"><br> <table class="contact-list " style="width: 100%;border-collapse: collapse;">
                                <tr>
                                  <th style="text-align: left; border: 1px solid black;padding: 13px;">Service</th>
                                  <th style="text-align: left; border: 1px solid black;padding: 13px;">Service Type</th>
                                  </tr>
                                  ${displayNotIncludedServices()}
                                  </table></div>
                                  `;
    }
    return '';
  };

  const getAgreementAccorType = (index) => {
    if (
      data &&
      details &&
      details.contract_type &&
      details.contract_type.toLowerCase().includes('one')
    ) {
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

  const mapDspDetails = () => {
    return `<tr>
        <td style="border: 1px solid black;
    padding: 13px;">
     <span style="background:#ffe5df;padding: 4px 9px; font-weight: bold";>
          ${
            firstMonthDate
              ? dayjs(firstMonthDate).format('MM-DD-YYYY')
              : 'MM-DD-YYYY'
          }

          </span>
        </td>
        <td
          style="border: 1px solid black;
    padding: 13px;">
    <span style="background:#ffe5df;padding: 4px 9px; font-weight: bold";>
     DSP_FEE
     </span>
        </td>
      </tr>`;
  };

  const displayFirstMonthFee = () => {
    if (firstMonthDate && new Date(firstMonthDate).getDate() !== 1) {
      if (formData && formData.dsp_fee) {
        const fee = parseInt(formData && formData.dsp_fee, 10);
        const FinalFee = fee + fee / 2;
        return `$${FinalFee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
      }
    }
    if (formData && formData.dsp_fee) {
      return `$${
        formData &&
        formData.dsp_fee &&
        formData.dsp_fee.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }`;
    }
    return 'Enter DSP Fee ';
  };

  const mapBudgetBreakdownTable = () => {
    return `
    
    <div class="table-responsive">  <table class="contact-list " style="width: 100%;
    border-collapse: collapse;"><tr><th style="text-align: left; border: 1px solid black;
    padding: 13px;">${
      firstMonthDate
        ? dayjs(firstMonthDate).format('MMM D, YYYY')
        : 'MM-DD-YYYY'
    } ${new Date(firstMonthDate).getDate() !== 1 ? '-' : ''} ${
      new Date(firstMonthDate).getDate() !== 1
        ? dayjs(endMonthDate).format('MMM D, YYYY')
        : ''
    } </th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">${
      secondMonthDate
        ? dayjs(secondMonthDate).format('MMMM YYYY')
        : 'MM-DD-YYYY'
    }</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">${
      thirdMonthDate ? dayjs(thirdMonthDate).format('MMMM YYYY') : 'MM-DD-YYYY'
    } </th></tr>
    <tr>
        <td style="border: 1px solid black;
    padding: 13px;"> <span style="background:#ffe5df;padding: 4px 9px; font-weight: bold";>${displayFirstMonthFee()}</span></td>
        <td
          style="border: 1px solid black;
    padding: 13px;">
    <span style="background:#ffe5df;padding: 4px 9px; font-weight: bold";>
               DSP_FEE
</span>
        </td><td
          style="border: 1px solid black;
    padding: 13px;">
    <span style="background:#ffe5df;padding: 4px 9px; font-weight: bold";>
              DSP_FEE
</span>
        </td>
      </tr>
      
      </table></div>`;
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
          formData.customer_id &&
          formData.customer_id.company_name &&
          formData.start_date &&
          formData.customer_id.address &&
          formData.customer_id.state &&
          formData.customer_id.city &&
          formData.customer_id.zip_code
        ) {
          return true;
        }
      } else if (
        formData &&
        formData.customer_id &&
        formData.customer_id.company_name &&
        formData.start_date &&
        formData.length &&
        formData.customer_id.address &&
        formData.customer_id.state &&
        formData.customer_id.city &&
        formData.customer_id.zip_code
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
        ) &&
        !(
          formData &&
          formData.contract_type &&
          formData.contract_type.toLowerCase().includes('dsp')
        )
      ) {
        if (
          formData &&
          formData.monthly_retainer &&
          formData.primary_marketplace &&
          formData.rev_share
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
          formData.contract_type &&
          formData.contract_type.toLowerCase().includes('dsp')
        ) {
          if (formData && formData.start_date && formData.dsp_fee) {
            return true;
          }
        }
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

  const onEditcontract = () => {
    setShowEditContractConfirmationModal(true);
  };

  const showStandardServicesTable = () => {
    return `
   <div class="table-responsive"><table class=" contact-list " style="width: 100%; overflow:auto;
    border-collapse: collapse;"><tr><th colspan="3" style="text-align: left; border: 1px solid black;
    padding: 13px;  ">Service Components</th></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Expert Strategy and Consultation (AGS)</td><td style="border: 1px solid black;
    padding: 13px;">Strategic Plan (Audit, SWOT Analysis, Critical Issues)</td><td style="border: 1px solid black;
    padding: 13px;">Weekly Call</td></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Listing Optimization - Copy <br> <span style="font-weight: 800;"> ASIN&rsquo;s per month: <span style=" background: #ffe5df;padding: 4px 9px;"> ${
      details && details.content_optimization
        ? details && details.content_optimization
        : 0
    } </span></span></td><td style="border: 1px solid black;
    padding: 13px;">Listing Optimization - Design <br> <span style="font-weight: 800;"> ASIN&rsquo;s per month: <span style=" background:#ffe5df;padding: 4px 9px;"> ${
      details && details.design_optimization
        ? details && details.design_optimization
        : 0
    } </span></span></td><td style="border: 1px solid black;
    padding: 13px;">Listing Creation</td></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Listing Compliance</td><td style="border: 1px solid black;
    padding: 13px;">Brand Registry Consultation</td><td style="border: 1px solid black;
    padding: 13px;">Catalog Management and Organization</td></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Seller Performance Consultation</td><td style="border: 1px solid black;
    padding: 13px;">Reporting</td><td style="border: 1px solid black;
    padding: 13px;">Holiday and Seasonal Preparation</td></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Promotion Planning and Support</td><td style="border: 1px solid black;
    padding: 13px;">Advertising Management</td><td style="border: 1px solid black;
    padding: 13px;"> 
    ${
      details && details.seller_type && details.seller_type.label
        ? [
            details && details.seller_type && details.seller_type.label
              ? details && details.seller_type && details.seller_type.label
              : details && details.seller_type && details.seller_type,
          ]
        : ''
    } Account Management</td></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Review Strategy</td><td style="border: 1px solid black;
    padding: 13px;">Total Managed Ad Spend</td><td style="border: 1px solid black;
    padding: 13px;">Channel Governance Consultation</td></tr></table> </div>
  `;
  };

  const createAgreementDoc = () => {
    setContractDesignLoader(true);

    const serviceData = getAgreementAccorType(0);
    const agreementData =
      serviceData &&
      serviceData
        .replace(
          'CUSTOMER_NAME',
          mapDefaultValues('company_name', 'Customer Name'),
        )
        .replace('START_DATE', mapDefaultValues('start_date', 'Start Date'))
        .replace('CUSTOMER_ADDRESS', mapDefaultValues('address', 'Address, '))
        .replace(
          'AGREEMENT_LENGTH',
          mapDefaultValues('length', 'Contract Length'),
        )
        .replace('ONE_TIME_SERVICE_TABLE', showOneTimeTable())
        .replace(
          'ADDITIONAL_ONE_TIME_SERVICES_TOTAL',
          `${mapServiceTotal('additional_one_time_services')}`,
        );

    const agreementSignatureData = AgreementSign.replace(
      'CUSTOMER_NAME',
      mapDefaultValues('company_name', 'Customer Name'),
    )
      .replaceAll(
        'AGREEMENT_DATE',
        mapDefaultValues('start_date', 'Start Date'),
      )
      .replace('CUSTOMER_ADDRESS', mapDefaultValues('address', 'Address, '))
      .replace('BBE_DATE', mapDefaultValues('current_date', 'Current Date'))
      .replace('THAD_SIGN', mapThadSignImg());

    const statmentData =
      data.statement_of_work &&
      data.statement_of_work[0]
        .replace(
          'CUSTOMER_NAME',
          mapDefaultValues('company_name', 'Customer Name'),
        )
        .replaceAll('START_DATE', mapDefaultValues('start_date', 'Start Date'))
        .replace(
          'MONTHLY_RETAINER_AMOUNT',
          mapDefaultValues(
            'monthly_retainer',
            'Monthly Retainer',
            'number-currency',
          ),
        )
        .replace('BILLING_CAP_AMOUNT', showBillingCap())
        .replace('REV_SHARE_TABLE', showRevTable())
        .replace('REVENUE_SHARE', mapDefaultValues('rev_share', 'Rev Share'))
        .replace(
          'REV_THRESHOLD',
          mapDefaultValues(
            'threshold_type',
            'Rev Threshold',
            // 'number-currency',
          ),
        )
        .replace('SELLER_TYPE', mapDefaultValues('seller_type', 'Seller Type'))
        .replace(
          'PRIMARY_MARKETPLACE',
          mapDefaultValues('primary_marketplace', 'Primary Marketplace'),
        )

        .replace('MAP_MONTHLY_SERVICES', showMonthlyServiceTable())
        .replace('ONE_TIME_SERVICES', showOneTimeServiceTable())
        .replace('MAP_STANDARD_SERVICE_TABLE', showStandardServicesTable())
        .replace(
          'ADDITIONAL_SERVICES_NOT_INCLUDED',
          showNotIncludedServicesTable(),
          // notIncludedMonthlyServices,
          // notIncludedOneTimeServices,
        )
        .replace(
          'BILLING_CAP_AMOUNT',
          mapDefaultValues('billing_cap', 'Billing Cap', 'number-currency'),
        );
    // .replace(
    //   'BILLING_CAP_AMOUNT',
    //   mapDefaultValues('billing_cap', 'Billing Cap', 'number-currency'),
    // );

    const dspAddendum =
      showSection && showSection.dspAddendum
        ? data.dsp_addendum &&
          data.dsp_addendum[0]
            .replace(
              'CUSTOMER_NAME',
              mapDefaultValues('company_name', 'Customer Name'),
            )

            .replaceAll(
              'START_DATE',
              mapDefaultValues('start_date', 'Start Date'),
            )
            .replace(
              'DSP_DETAIL_TABLE',
              `<table class="contact-list " style="width: 100%;
    border-collapse: collapse;"><tr><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Start Date</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Monthly Ad Budget</th></tr>${mapDspDetails()}</table>`,
            )
            .replace('BUDGET_BREAKDOWN_TABLE', `${mapBudgetBreakdownTable()}`)
            .replaceAll(
              'CONTRACT_LENGTH',
              mapDefaultValues('length', 'Initial Period', 'number-currency'),
            )
            .replace(
              'NO_OF_DAYS_BASED_ON_DATE',
              mapDefaultValues(
                'calculated_no_of_days',
                'Calculated Days',
                'number-currency',
              ),
            )
            .replaceAll(
              'DSP_FEE',
              mapDefaultValues('dsp_fee', 'Dsp Fee', 'number-currency'),
            )
        : '';

    const dspAddendumSignature =
      showSection && showSection.dspAddendum
        ? AddendumSign.replace(
            'CUSTOMER_NAME',
            mapDefaultValues('company_name', 'Customer Name'),
          )
            .replace(
              'BBE_DATE',
              mapDefaultValues('current_date', 'Current Date'),
            )
            .replace('THAD_SIGN', mapThadSignImg())
        : '';

    const addendumData =
      data.addendum &&
      data.addendum[0]
        .replace(
          'CUSTOMER_NAME',
          mapDefaultValues('company_name', 'Customer Name'),
        )
        .replaceAll(
          'AGREEMENT_DATE',
          mapDefaultValues('start_date', 'Start Date'),
        );

    const newAddendumAddedData =
      newAddendumData && newAddendumData.addendum
        ? newAddendumData.addendum.replaceAll('<p>', '<p style="margin:0">')
        : '';

    const addendumSignatureData = AddendumSign.replace(
      'CUSTOMER_NAME',
      mapDefaultValues('company_name', 'Customer Name'),
    )
      .replace('BBE_DATE', mapDefaultValues('current_date', 'Current Date'))
      .replace('THAD_SIGN', mapThadSignImg());

    const finalAgreement = `${agreementData} ${agreementSignatureData} ${
      (details &&
        details.contract_type &&
        details.contract_type.toLowerCase().includes('one')) ||
      (details &&
        details.contract_type &&
        details.contract_type.toLowerCase().includes('dsp'))
        ? ''
        : statmentData
    } ${
      details &&
      details.contract_type &&
      details.contract_type.toLowerCase().includes('one')
        ? ''
        : dspAddendum
    } ${
      details &&
      details.contract_type &&
      details.contract_type.toLowerCase().includes('one')
        ? ''
        : dspAddendumSignature
    } ${
      newAddendumAddedData
        ? newAddendumAddedData.length <= 24
          ? ''
          : addendumData + newAddendumAddedData + addendumSignatureData
        : ''
    } `;

    setPDFData(finalAgreement);

    const contractData = {
      contract: details && details.id,
      contract_data: finalAgreement
        .replaceAll('PRINTED_NAME', '')
        .replace('CUSTOMER_ROLE', ''),
    };

    createContractDesign(contractData).then(() => {
      setContractDesignLoader(false);
    });
    // }
  };

  useEffect(() => {
    if (downloadApiCall) {
      createAgreementDoc();
      setDownloadApiCall(false);
    }
  }, [downloadApiCall]);

  useEffect(() => {
    const sectionFlag = { ...showSection };

    if (
      details &&
      details.additional_monthly_services &&
      details.additional_monthly_services.length
    ) {
      setMonthlyAdditionalServices({
        create: [...details.additional_monthly_services],
        delete: [],
      });
    } else {
      setMonthlyAdditionalServices({
        create: [],
        delete: [],
      });
    }
    if (
      details &&
      details.additional_marketplaces &&
      details.additional_marketplaces.length
    ) {
      setAdditionalMarketplace({
        create: [...details.additional_marketplaces],
        delete: [],
      });
    } else {
      setAdditionalMarketplace({
        create: [],
        delete: [],
      });
    }
    if (
      details &&
      details.additional_one_time_services &&
      details.additional_one_time_services.length
    ) {
      setAdditionalOnetimeServices({
        create: [...details.additional_one_time_services],
        delete: [],
      });
    } else {
      setAdditionalOnetimeServices({
        create: [],
        delete: [],
      });
    }

    // if (
    //   details &&
    //   details.contract_type &&
    //   details.contract_type.toLowerCase().includes('dsp')
    // ) {
    //   sectionFlag.dspAddendum = true;
    // }

    if (
      details &&
      details.primary_marketplace &&
      details.primary_marketplace.name
    ) {
      setAdditionalMarketplaces(
        marketplacesResult.filter(
          (op) => op.value !== details.primary_marketplace.name,
        ),
      );
    } else {
      setAdditionalMarketplaces(marketplacesResult);
    }

    if (details && details.additional_marketplaces) {
      setMarketPlaces(
        marketplacesResult.filter(
          (choice) =>
            !(details && details.additional_marketplaces).some(
              (item) => item.name === choice.value,
            ),
        ),
      );
    } else {
      setMarketPlaces(marketplacesResult);
    }

    if (details && details.additional_one_time_services) {
      fetchUncommonOptions(
        oneTimeService,
        details.additional_one_time_services,
        'one_time_service',
      );
    }

    if (details && details.additional_monthly_services) {
      fetchUncommonOptions(
        monthlyService,
        details.additional_monthly_services,
        'monthly_service',
      );
    }
    if (newAddendumData && newAddendumData.id) {
      if (newAddendumData.addendum && newAddendumData.addendum.length <= 7) {
        sectionFlag.addendum = false;
      } else {
        sectionFlag.addendum = true;
      }
    }

    if (
      !(
        formData &&
        formData.contract_type &&
        formData.contract_type.toLowerCase().includes('one')
      ) &&
      !(
        formData &&
        formData.contract_type &&
        formData.contract_type.toLowerCase().includes('dsp')
      ) &&
      details &&
      details.additional_monthly_services &&
      details.additional_monthly_services.length &&
      details.additional_monthly_services.find(
        (item) =>
          item &&
          item.service &&
          item.service.name &&
          item.service.name.toLowerCase().includes('dsp'),
      )
    ) {
      sectionFlag.dspAddendum = true;
    } else {
      sectionFlag.dspAddendum = false;
    }

    if (
      details &&
      details.contract_type &&
      details.contract_type.toLowerCase().includes('dsp')
    ) {
      sectionFlag.dspAddendum = true;
    }

    setIsDocRendered(true);
    setShowCollpase(sectionFlag);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  const createPrimaryMarketplace = () => {
    const statementData = {
      id:
        (details &&
          details.primary_marketplace &&
          details.primary_marketplace.id) ||
        '',
      contract: details.id,
      name: updatedFormData && updatedFormData.primary_marketplace,
      is_primary: true,
    };

    if (details.primary_marketplace && details.primary_marketplace.id) {
      updateMarketplace(details.primary_marketplace.id, statementData).then(
        (updateMarketplaceRes) => {
          if (updateMarketplaceRes && updateMarketplaceRes.status === 200) {
            setFormData({
              ...formData,
              primary_marketplace:
                updateMarketplaceRes && updateMarketplaceRes.data,
            });
            if (updatedFormData && updatedFormData.primary_marketplace) {
              delete updatedFormData.primary_marketplace;
              setUpdatedFormData({ ...updatedFormData });

              if (!Object.keys(updatedFormData).length) {
                showFooter(false);
                setIsEditContract(false);
                getContractDetails();
                setShowSaveSuccessMsg(true);
              }
            }
          }
        },
      );
    } else {
      createMarketplace(statementData).then((createMarketplaceRes) => {
        setIsLoading({ loader: false, type: 'button' });
        setIsLoading({ loader: false, type: 'page' });
        if (createMarketplaceRes && createMarketplaceRes.status === 201) {
          setFormData({
            ...formData,
            primary_marketplace:
              createMarketplaceRes && createMarketplaceRes.data,
          });
          if (updatedFormData && updatedFormData.primary_marketplace) {
            delete updatedFormData.primary_marketplace;
            setUpdatedFormData({ ...updatedFormData });
            if (!Object.keys(updatedFormData).length) {
              showFooter(false);
              setIsEditContract(false);
              getContractDetails();
              createAgreementDoc();
              setShowSaveSuccessMsg(true);
            }
          }
        }
      });
    }
    setUpdatedFormData({ ...updatedFormData });
  };

  const updateMarketplaces = async () => {
    let flag = false;
    const result = await createMarketplaceBulk(
      updatedFormData.additional_marketplaces,
    ).then((updateMarketplacesRes) => {
      flag = true;
      if (updateMarketplacesRes && updateMarketplacesRes.status === 200) {
        setFormData({
          ...formData,
          additional_marketplaces:
            updateMarketplacesRes && updateMarketplacesRes.data,
        });
        setOriginalData({
          ...originalData,
          additional_marketplaces:
            updateMarketplacesRes && updateMarketplacesRes.data,
        });
      }
    });
    if (flag) {
      if (updatedFormData && updatedFormData.additional_marketplaces) {
        delete updatedFormData.additional_marketplaces;
        setUpdatedFormData({ ...updatedFormData });
      }
      if (
        !(
          formData &&
          formData.additional_marketplaces &&
          formData.additional_marketplaces.length
        )
      ) {
        setShowAdditionalMarketplace(false);
      } else {
        setShowAdditionalMarketplace(true);
      }

      if (updatedFormData && updatedFormData.primary_marketplace) {
        createPrimaryMarketplace();
      }
    }
    return result;
  };

  const saveChanges = (apis) => {
    axios
      .all(apis)
      .then(
        axios.spread((...responses) => {
          const additionalMonthlySerRes = responses[0];
          const additionalOneTimeServRes = responses[1];
          const contractRes = responses[2];
          const addendumRes = responses[3];
          const updateCustomerRes = responses[4];

          setIsLoading({ loader: false, type: 'button' });
          setIsLoading({ loader: false, type: 'page' });

          if (
            additionalMonthlySerRes &&
            additionalMonthlySerRes.status === 200 &&
            additionalOneTimeServRes &&
            additionalOneTimeServRes.status === 200 &&
            contractRes &&
            contractRes.status === 200 &&
            addendumRes &&
            addendumRes.status === 200 &&
            updateCustomerRes &&
            updateCustomerRes.status === 200
          ) {
            // use/access the results
            showFooter(false);
            // setIsEditContract(false);
            setUpdatedFormData({});
            getContractDetails();
            setIsEditContract(false);
          }

          if (
            additionalMonthlySerRes &&
            additionalMonthlySerRes.status === 200
          ) {
            setFormData({
              ...formData,
              additional_monthly_services:
                additionalMonthlySerRes && additionalMonthlySerRes.data,
            });
            setOriginalData({
              ...originalData,
              additional_monthly_services:
                additionalMonthlySerRes && additionalMonthlySerRes.data,
            });
            if (
              updatedFormData &&
              updatedFormData.additional_monthly_services
            ) {
              delete updatedFormData.additional_monthly_services;
            }
          }
          if (
            additionalOneTimeServRes &&
            additionalOneTimeServRes.status === 200
          ) {
            setFormData({
              ...formData,
              additional_one_time_services:
                additionalOneTimeServRes && additionalOneTimeServRes.data,
            });
            setOriginalData({
              ...originalData,
              additional_one_time_services:
                additionalOneTimeServRes && additionalOneTimeServRes.data,
            });

            const service =
              additionalOneTimeServRes &&
              additionalOneTimeServRes.data &&
              additionalOneTimeServRes.data.length &&
              additionalOneTimeServRes.data.find(
                (item) =>
                  item &&
                  item.service &&
                  item.service.name &&
                  item.service.name === 'Amazon Store Package Custom',
              );
            if (service) {
              setAmazonStoreCustom(true);
            } else {
              setAmazonStoreCustom(false);
            }

            if (
              updatedFormData &&
              updatedFormData.additional_one_time_services
            ) {
              delete updatedFormData.additional_one_time_services;
            }
          }

          if (
            (addendumRes && addendumRes.status === 200) ||
            (addendumRes && addendumRes.status === 201)
          ) {
            if (addendumRes && addendumRes.status === 201) {
              setNewAddendum(addendumRes && addendumRes.data);
            }
            setNewAddendum(addendumRes && addendumRes.data);

            setOriginalAddendumData(addendumRes && addendumRes.data);
            setShowEditor(false);
            if (updatedFormData && updatedFormData.addendum) {
              delete updatedFormData.addendum;
            }
          }

          if (updateCustomerRes && updateCustomerRes.status === 200) {
            const customerData = updateCustomerRes.data;
            setFormData({ ...formData, ...customerData });
            delete updatedFormData.company_name;
            delete updatedFormData.address;
            delete updatedFormData.city;
            delete updatedFormData.state;
            delete updatedFormData.zip_code;
          }

          if (contractRes && contractRes.status === 200) {
            setFormData({ ...formData, ...contractRes.data });
            const updatedKeys = Object.keys(updatedFormData);
            if (updatedKeys && updatedKeys.length) {
              const fieldsToDeleteList = updatedKeys
                .filter((item) => item !== 'additional_one_time_services')
                .filter((item) => item !== 'additional_monthly_services')
                .filter((item) => item !== 'additional_marketplaces')
                .filter((item) => item !== 'primary_marketplace')
                .filter((item) => item !== 'addendum')
                .filter((item) => item !== 'company_name')
                .filter((item) => item !== 'address')
                .filter((item) => item !== 'city')
                .filter((item) => item !== 'state')
                .filter((item) => item !== 'zip_code');

              for (const item of fieldsToDeleteList) {
                delete updatedFormData[item];
              }
            }
          }

          if (!Object.keys(updatedFormData).length) {
            showFooter(false);
            setIsEditContract(false);
            getContractDetails();
            createAgreementDoc();
            setShowSaveSuccessMsg(true);
          }
          setUpdatedFormData({ ...updatedFormData });

          let agreementErrCount = 0;
          let statementErrCount = 0;
          let dspErrCount = 0;

          if (
            (additionalMonthlySerRes &&
              additionalMonthlySerRes.status === 400) ||
            (additionalOneTimeServRes &&
              additionalOneTimeServRes.status === 400) ||
            (contractRes && contractRes.status === 400) ||
            (updateCustomerRes && updateCustomerRes.status === 400)
          ) {
            toast.error(
              'Changes have not been saved. Please fix errors and try again',
            );
          }

          if (
            additionalMonthlySerRes &&
            additionalMonthlySerRes.status === 400
          ) {
            setAdditionalMonthlySerError({
              ...additionalMonthlySerError,
              ...additionalMonthlySerRes.data,
            });

            if (additionalMonthlySerRes.data) {
              statementErrCount += Object.keys(additionalMonthlySerRes.data)
                .length;
            }
          }
          if (
            additionalOneTimeServRes &&
            additionalOneTimeServRes.status === 400
          ) {
            setAdditionalOnetimeSerError({
              ...additionalOnetimeSerError,
              ...additionalOneTimeServRes.data,
            });

            if (additionalOneTimeServRes.data) {
              if (
                Object.keys(additionalOneTimeServRes.data).includes('quantity')
              ) {
                statementErrCount +=
                  Object.keys(additionalOneTimeServRes.data).length +
                  Object.keys(additionalOneTimeServRes.data.quantity).length -
                  1;
              } else if (!additionalOnetimeSerError.custom_amazon_store_price) {
                statementErrCount += Object.keys(additionalOneTimeServRes.data)
                  .length;
              }
            }
            if (
              additionalOneTimeServRes &&
              additionalOneTimeServRes.data &&
              Object.values(additionalOneTimeServRes.data) &&
              Object.values(additionalOneTimeServRes.data).length &&
              Object.values(additionalOneTimeServRes.data)[0] ===
                'Object does not exists'
            ) {
              showFooter(false);
              setIsEditContract(false);
              setUpdatedFormData({});
              getContractDetails();
            }
          }

          if (updateCustomerRes && updateCustomerRes.status === 400) {
            setCustomerErrors({
              ...customerError,
              ...updateCustomerRes.data,
            });
            if (
              updateCustomerRes.data &&
              Object.keys(updateCustomerRes.data).length
            ) {
              if (
                Object.keys(updateCustomerRes.data).includes('zip_code') &&
                !customerError.zip_code
              )
                agreementErrCount += 1;
            }
          }
          if (contractRes && contractRes.status === 400) {
            setContractError({
              ...contractError,
              ...contractRes.data,
            });

            if (contractRes.data) {
              if (Object.keys(contractRes.data).length) {
                if (Object.keys(contractRes.data).includes('monthly_retainer'))
                  statementErrCount += 1;
                if (
                  Object.keys(contractRes.data).includes('content_optimization')
                )
                  statementErrCount += 1;
                if (
                  Object.keys(contractRes.data).includes('design_optimization')
                )
                  statementErrCount += 1;

                if (Object.keys(contractRes.data).includes('yoy_percentage'))
                  statementErrCount += 1;

                if (Object.keys(contractRes.data).includes('sales_threshold'))
                  statementErrCount += 1;

                if (
                  Object.keys(contractRes.data).includes('dsp_fee') &&
                  !contractError.dsp_fee
                )
                  dspErrCount += 1;
              }
            }
          }

          setSectionError({
            agreement: agreementErrCount + sectionError.agreement,
            statement: statementErrCount + sectionError.statement,
            dsp: dspErrCount + sectionError.dsp,
          });
        }),
      )
      .catch(() => {});
  };

  const nextStep = async () => {
    let additionalMonthlyApi = null;
    let additionalOneTimeApi = null;
    let AccountApi = null;
    let AddendumApi = null;
    let updateCustomerApi = null;

    if (updatedFormData && Object.keys(updatedFormData).length) {
      // for start date
      if (updatedFormData && updatedFormData.start_date) {
        updatedFormData.start_date = dayjs(updatedFormData.start_date).format(
          'YYYY-MM-DD',
        );
      }
      setIsLoading({ loader: true, type: 'page' });
      setContractDesignLoader(true);
      // for additionL montlhy service
      if (updatedFormData.additional_monthly_services) {
        additionalMonthlyApi = createAdditionalServiceBulk(
          updatedFormData.additional_monthly_services,
        );
      }

      // for additional one time service
      if (updatedFormData.additional_one_time_services) {
        additionalOneTimeApi = createAdditionalServiceBulk(
          updatedFormData.additional_one_time_services,
        );
      }

      if (
        Object.keys(updatedFormData).includes('company_name') ||
        Object.keys(updatedFormData).includes('address') ||
        Object.keys(updatedFormData).includes('city') ||
        Object.keys(updatedFormData).includes('state') ||
        Object.keys(updatedFormData).includes('zip_code')
      ) {
        const customerData = {
          company_name: updatedFormData.company_name,
          address: updatedFormData.address,
          city: updatedFormData.city,
          state: updatedFormData.state,
          zip_code: updatedFormData.zip_code,
        };
        updateCustomerApi = updateCustomerDetails(id, customerData);
      }

      // for 'monthly_retainer', 'dsp_fee', 'sales_threshold'
      const num = [
        'monthly_retainer',
        'dsp_fee',
        'sales_threshold',
        'billing_cap',
      ];
      for (const val of num) {
        if (updatedFormData && updatedFormData[val]) {
          updatedFormData[val] = updatedFormData[val].replace(/,/g, '');
        }
      }
      const updatedContractFields = cloneDeep(updatedFormData);
      delete updatedContractFields.additional_one_time_services;
      delete updatedContractFields.additional_monthly_services;
      delete updatedContractFields.additional_marketplaces;
      delete updatedContractFields.primary_marketplace;
      delete updatedContractFields.addendum;
      delete updatedContractFields.company_name;
      delete updatedContractFields.address;
      delete updatedContractFields.city;
      delete updatedContractFields.state;
      delete updatedContractFields.zip_code;

      if (
        updatedContractFields &&
        updatedContractFields.threshold_type === 'Fixed'
      ) {
        updatedContractFields.yoy_percentage = null;
        if (!updatedContractFields.sales_threshold) {
          updatedContractFields.sales_threshold = formData.sales_threshold;
        }
      }

      if (
        updatedContractFields &&
        updatedContractFields.threshold_type === 'YoY + %'
      ) {
        updatedContractFields.sales_threshold = null;
        if (!updatedContractFields.yoy_percentage) {
          updatedContractFields.yoy_percentage = formData.yoy_percentage;
        }
      }

      if (
        (updatedContractFields &&
          updatedContractFields.threshold_type === 'YoY') ||
        (updatedContractFields &&
          updatedContractFields.threshold_type === 'None')
      ) {
        updatedContractFields.sales_threshold = null;
        updatedContractFields.yoy_percentage = null;
      }

      const detail = {
        ...updatedContractFields,
      };
      if (Object.keys(detail).length) {
        AccountApi = updateAccountDetails(details.id, detail);
      }

      if (newAddendumData && newAddendumData.id && updatedFormData.addendum) {
        AddendumApi = updateAddendum(newAddendumData.id, {
          addendum: newAddendumData && newAddendumData.addendum,
          contract: details.id,
        });
      } else if (updatedFormData && updatedFormData.addendum) {
        const addendumData = {
          customer_id: id,
          addendum: newAddendumData && newAddendumData.addendum,
          contract: details.id,
        };
        AddendumApi = createAddendum(addendumData);
      }

      const apis = [
        additionalMonthlyApi,
        additionalOneTimeApi,
        AccountApi,
        AddendumApi,
        updateCustomerApi,
      ];

      if (
        (updatedFormData && updatedFormData.primary_marketplace) ||
        (updatedFormData && updatedFormData.additional_marketplaces)
      ) {
        if (
          updatedFormData &&
          updatedFormData.primary_marketplace &&
          !Object.keys(updatedFormData).includes('additional_marketplaces')
        ) {
          createPrimaryMarketplace();
        } else {
          await updateMarketplaces();
        }
      }

      saveChanges(apis);
    }
  };

  const checkApprovalCondition = () => {
    const rev = Number(details && details.rev_share && details.rev_share.value);
    const dspFee = Number(details && details.dsp_fee);
    const contractTermLength = parseInt(
      details && details.length && details.length.value,
      10,
    );
    if (
      details &&
      details.contract_type &&
      details.contract_type.toLowerCase().includes('recurring')
    ) {
      if (
        (showSection.dspAddendum && dspFee < 10000) ||
        rev < 3 ||
        contractTermLength < 12
      ) {
        return true;
      }
    }
    if (
      details &&
      details.contract_type &&
      details.contract_type.toLowerCase().includes('dsp') &&
      dspFee < 10000
    ) {
      return true;
    }

    if (
      newAddendumData &&
      newAddendumData.addendum &&
      newAddendumData.addendum.length > 7
    ) {
      return true;
    }
    return false;
  };

  const setParams = (param) => {
    const stringified =
      queryString &&
      queryString.stringify({
        ...params,
        step: param,
      });

    history.push({
      pathname: `${history.location.pathname}`,
      search: `${stringified}`,
      state: `${history.location.state}`,
    });
  };

  const viewContract = () => {
    return (
      <div className="text-container ">
        <div id="agreement">
          <Agreement
            formData={formData}
            details={details}
            templateData={data}
            servicesFees={servicesFees}
          />
        </div>

        {(details &&
          details.contract_type &&
          details.contract_type.toLowerCase().includes('one')) ||
        (details &&
          details.contract_type &&
          details.contract_type.toLowerCase().includes('dsp')) ? null : (
          <div id="statement">
            <Statement
              formData={formData}
              details={details}
              templateData={data}
              notIncludedOneTimeServices={notIncludedOneTimeServices}
              notIncludedMonthlyServices={notIncludedMonthlyServices}
              servicesFees={servicesFees}
            />
          </div>
        )}

        {(details &&
          details.contract_type &&
          details.contract_type.toLowerCase().includes('dsp')) ||
        (showSection.dspAddendum &&
          !(
            details &&
            details.contract_type &&
            details.contract_type.toLowerCase().includes('one')
          )) ? (
          <div id="dspAddendum">
            <DSPAddendum
              formData={formData}
              templateData={data}
              calculatedDate={calculatedDate}
              setCalculatedDate={setCalculatedDate}
              firstMonthDate={firstMonthDate}
              setFirstMonthDate={setFirstMonthDate}
              secondMonthDate={secondMonthDate}
              setSecondMonthDate={setSecondMonthDate}
              thirdMonthDate={thirdMonthDate}
              setThirdMonthDate={setThirdMonthDate}
              endMonthDate={endMonthDate}
              setEndDate={setEndDate}
            />
          </div>
        ) : (
          ''
        )}
        {showSection && showSection.addendum ? (
          <div id="addendum">
            <Addendum
              formData={formData}
              details={details}
              templateData={data}
              notIncludedOneTimeServices={notIncludedOneTimeServices}
              notIncludedMonthlyServices={notIncludedMonthlyServices}
              newAddendumData={newAddendumData}
              setNewAddendum={setNewAddendum}
              showEditor={showEditor}
              showFooter={showFooter}
              setShowEditor={setShowEditor}
              onEditAddendum={onEditAddendum}
              setUpdatedFormData={setUpdatedFormData}
              updatedFormData={updatedFormData}
              // originalAddendumData={originalAddendumData}
            />
          </div>
        ) : (
          ''
        )}

        {showSection.amendment ? (
          <div id="amendment">
            <ServicesAmendment
              formData={formData}
              details={details}
              templateData={data}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  };

  const setMandatoryFieldsErrors = () => {
    let agreementErrors = 0;
    let statementErrors = 0;
    let dspErrors = 0;

    AgreementDetails.forEach((item) => {
      if (item.key !== 'contract_address') {
        if (
          !(
            item.key === 'length' &&
            details &&
            details.contract_type === 'one time'
          )
        ) {
          if (
            item.isMandatory &&
            item.field === 'customer' &&
            !(
              formData &&
              formData.customer_id &&
              formData.customer_id[item.key]
            )
          ) {
            agreementErrors += 1;
            item.error = true;
          }
          if (
            item.isMandatory &&
            item.field !== 'customer' &&
            !(formData && formData[item.key])
          ) {
            agreementErrors += 1;
            item.error = true;
          }
        }
      } else {
        return (
          item &&
          item.sections.forEach((subItem) => {
            if (
              subItem &&
              subItem.isMandatory &&
              !(
                formData &&
                formData.customer_id &&
                formData.customer_id[subItem.key]
              )
            ) {
              subItem.error = true;
              agreementErrors += 1;
            }
          })
        );
      }
      return null;
    });

    StatementDetails.forEach((item) => {
      if (
        item.isMandatory &&
        !(formData && formData[item.key]) &&
        !(
          formData &&
          formData.contract_type &&
          formData.contract_type.toLowerCase().includes('one')
        )
      ) {
        statementErrors += 1;
        item.error = true;
      }
    });

    DSPAddendumDetails.forEach((item) => {
      if (item.isMandatory && !(formData && formData[item.key])) {
        if (
          formData &&
          formData.contract_type &&
          formData.contract_type.toLowerCase().includes('dsp') &&
          item.key !== 'dsp_length'
        ) {
          dspErrors += 1;
          item.error = true;
        }

        if (
          formData &&
          formData.contract_type &&
          formData.contract_type.toLowerCase().includes('recurring') &&
          item.key === 'dsp_length'
        ) {
          dspErrors += 1;
          item.error = true;
        } else if (
          !(
            formData &&
            formData.contract_type &&
            formData.contract_type.toLowerCase().includes('dsp')
          )
        ) {
          dspErrors += 1;
          item.error = true;
        }
      }
    });

    setSectionError({
      ...sectionError,
      agreement: agreementErrors,
      statement: statementErrors,
      dsp: dspErrors,
    });
  };

  const renderEditContractBtn = (btnClass) => {
    return (
      <Button
        className={`${btnClass} on-boarding  mt-3  ${
          isEditContract ? 'w-sm-50' : 'w-sm-100'
        }`}
        onClick={() => {
          setIsEditContract(true);
          setMandatoryFieldsErrors();
        }}>
        Edit Contract
      </Button>
    );
  };

  const displayRightSidePanel = () => {
    return (
      <AgreementSidePanel
        id={id}
        setFormData={setFormData}
        formData={formData}
        apiError={apiError}
        loader={isLoading.loader}
        setContractLoading={setIsLoading}
        agreementData={details}
        editContractFlag={editContractFlag}
        setEditContractFlag={setEditContractFlag}
        setNotIncludedOneTimeServices={setNotIncludedOneTimeServices}
        // setNotIncludedMonthlyServices={setNotIncludedMonthlyServices}
        notIncludedOneTimeServices={notIncludedOneTimeServices}
        showFooter={showFooter}
        newAddendumData={newAddendumData}
        setNewAddendum={setNewAddendum}
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        onEditAddendum={onEditAddendum}
        setApiError={setApiError}
        executeScroll={executeScroll}
        showSection={showSection}
        setShowCollpase={setShowCollpase}
        updatedFormData={updatedFormData}
        setUpdatedFormData={setUpdatedFormData}
        additionalMonthlyServices={additionalMonthlyServices}
        setMonthlyAdditionalServices={setMonthlyAdditionalServices}
        originalData={originalData}
        additionalMarketplacesData={additionalMarketplacesData}
        setAdditionalMarketplace={setAdditionalMarketplace}
        additionalOnetimeServices={additionalOnetimeServices}
        setAdditionalOnetimeServices={setAdditionalOnetimeServices}
        notIncludedMonthlyServices={notIncludedMonthlyServices}
        additionalMarketplaceError={additionalMarketplaceError}
        setAdditionalMarketplaceError={setAdditionalMarketplaceError}
        additionalMonthlySerError={additionalMonthlySerError}
        setAdditionalMonthlySerError={setAdditionalMonthlySerError}
        additionalOnetimeSerError={additionalOnetimeSerError}
        setAdditionalOnetimeSerError={setAdditionalOnetimeSerError}
        contractError={contractError}
        setContractError={setContractError}
        setOriginalAddendumData={setOriginalAddendumData}
        openCollapse={openCollapse}
        setOpenCollapse={setOpenCollapse}
        amazonStoreCustom={amazonStoreCustom}
        setAmazonStoreCustom={setAmazonStoreCustom}
        showAmazonPlanDropdown={showAmazonPlanDropdown}
        setShowAmazonPlanDropdown={setShowAmazonPlanDropdown}
        showAdditionalMarketplace={showAdditionalMarketplace}
        setShowAdditionalMarketplace={setShowAdditionalMarketplace}
        startDate={startDate}
        setStartDate={setStartDate}
        setShowDiscountModal={setShowDiscountModal}
        sectionError={sectionError}
        setSectionError={setSectionError}
        setDiscountFlag={setDiscountFlag}
        isEditContract={isEditContract}
        setMarketplacesResult={setMarketplacesResult}
        marketplacesResult={marketplacesResult}
        marketPlaces={marketPlaces}
        setMarketPlaces={setMarketPlaces}
        additionalMarketplaces={additionalMarketplaces}
        setAdditionalMarketplaces={setAdditionalMarketplaces}
        firstMonthDate={firstMonthDate}
        setPageNumber={setPageNumber}
        getContractActivityLogInfo={getContractActivityLogInfo}
        activityLoader={activityLoader}
        activityData={activityData}
        images={images}
        activityCount={activityCount}
        pageNumber={pageNumber}
        isApicalled={isApicalled}
        getContractDetails={getContractDetails}
        setIsEditContract={setIsEditContract}
        setShowSaveSuccessMsg={setShowSaveSuccessMsg}
        customerError={customerError}
        setCustomerErrors={setCustomerErrors}
        isDocRendered={downloadApiCall}
        oneTimeService={oneTimeService}
        monthlyService={monthlyService}
        AmazonStoreOptions={AmazonStoreOptions}
        fetchUncommonOptions={fetchUncommonOptions}
        originalAddendumData={originalAddendumData}
        thresholdTypeOptions={thresholdTypeOptions}
        yoyPercentageOptions={yoyPercentageOptions}
      />
    );
  };

  const displayFooter = () => {
    return (
      <ContractFooter
        details={details}
        setParams={setParams}
        setShowModal={setShowModal}
        isEditContract={isEditContract}
        onEditcontract={onEditcontract}
        isLoading={isLoading}
        isFooter={isFooter}
        formData={formData}
        newAddendumData={newAddendumData}
        updatedFormData={updatedFormData}
        showEditor={showEditor}
        nextStep={nextStep}
        setShowDiscardModal={setShowDiscardModal}
        checkApprovalCondition={checkApprovalCondition}
        showRightTick={showRightTick}
        setIsEditContract={setIsEditContract}
        renderEditContractBtn={renderEditContractBtn}
        showDiscardModal={showDiscardModal}
        createAgreementDoc={createAgreementDoc}
      />
    );
  };

  const closeDiscountModal = () => {
    const discountUpdatedData = {
      monthly_discount_amount: details.monthly_discount_amount,
      monthly_discount_type: details.monthly_discount_type,
      one_time_discount_amount: details.one_time_discount_amount,
      one_time_discount_type: details.one_time_discount_type,
    };
    setFormData({ ...formData, ...discountUpdatedData });
    setShowDiscountModal(false);
  };

  const removeParams = (item) => {
    delete params[item];
    const stringified =
      queryString &&
      queryString.stringify({
        ...params,
      });
    history.push({
      pathname: `${history.location.pathname}`,
      search: `${stringified}`,
      state: `${history.location.state}`,
    });
    setIsEditContract(false);
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        pauseOnFocusLoss={false}
      />
      {showPageNotFound ? (
        <PageNotFound />
      ) : (details &&
          details.contract_status &&
          details.contract_status.value === 'pending account setup') ||
        (details &&
          details.contract_status &&
          details.contract_status.value === 'active') ||
        (details &&
          details.contract_status &&
          details.contract_status.value === 'inactive') ? (
        <>
          <ContractTab className="d-lg-none d-block">
            <ul className="tabs">
              <li
                className={tabInResponsive === 'view-contract' ? 'active' : ''}
                role="presentation"
                onClick={() => showTabInResponsive('view-contract')}>
                View Contract
              </li>

              <li
                className={tabInResponsive === 'edit-fields' ? 'active' : ''}
                role="presentation"
                onClick={() => showTabInResponsive('edit-fields')}>
                {isEditContract ? 'Edit Fields' : 'Activity'}
              </li>
            </ul>
          </ContractTab>
          <div className="on-boarding-container">
            <HeaderDownloadFuntionality>
              <div
                className={
                  userInfo && userInfo.role === 'Customer'
                    ? 'customer-pdf'
                    : ' '
                }>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-6 col-sm-12">
                      {' '}
                      Contract Management
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <ul className="contract-download-nav ">
                        {isFooter ||
                        (newAddendumData &&
                          newAddendumData.id &&
                          showEditor &&
                          updatedFormData &&
                          updatedFormData.addendum) ? (
                          ''
                        ) : (
                          <li
                            className={
                              details &&
                              details.id &&
                              contractDesignLoader !== null &&
                              !contractDesignLoader
                                ? 'download-pdf '
                                : 'download-pdf disabled'
                            }>
                            <a
                              className="download-pdf-link"
                              href={
                                details && details.contract_url
                                  ? details && details.contract_url
                                  : null
                              }
                              download>
                              <img
                                src={OrangeDownloadPdf}
                                alt="download"
                                className="download-pdf-icon "
                                role="presentation"
                              />
                              Download
                            </a>
                          </li>
                        )}
                        <li>
                          <span className="divide-arrow hide-mobile" />
                        </li>

                        <li>
                          <img
                            width="18px"
                            src={CloseIcon}
                            alt="close"
                            className="float-right cursor remove-cross-icon"
                            onClick={() => {
                              if (
                                history &&
                                history.location &&
                                history.location.state
                              ) {
                                history.push(
                                  history &&
                                    history.location &&
                                    history.location.state,
                                );
                              } else {
                                history.push(PATH_CUSTOMER_LIST);
                              }
                            }}
                            role="presentation"
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </HeaderDownloadFuntionality>

            {isLoading.loader && isLoading.type === 'page' ? (
              <PageLoader
                className="modal-loader"
                color="#FF5933"
                type="page"
                width={40}
                component="agreement"
              />
            ) : (
              <>
                {isDesktop ||
                (isTablet && tabInResponsive === 'view-contract') ||
                (isMobile && tabInResponsive === 'view-contract') ? (
                  <PdfViewer
                    pdf={details && details.contract_url}
                    loadingMsg="Loading Contract Document..."
                  />
                ) : (
                  ''
                )}
                {isDesktop ||
                (isTablet && tabInResponsive === 'edit-fields') ||
                (isMobile && tabInResponsive === 'edit-fields')
                  ? displayRightSidePanel()
                  : ''}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <ContractTab className="d-lg-none d-block">
            <ul className="tabs">
              <li
                className={tabInResponsive === 'view-contract' ? 'active' : ''}
                role="presentation"
                onClick={() => showTabInResponsive('view-contract')}>
                View Contract
              </li>

              <li
                className={tabInResponsive === 'edit-fields' ? 'active' : ''}
                role="presentation"
                onClick={() => showTabInResponsive('edit-fields')}>
                {isEditContract ? 'Edit Fields' : 'Activity'}
              </li>
            </ul>
          </ContractTab>

          <div className="on-boarding-container">
            <HeaderDownloadFuntionality>
              <div
                className={
                  userInfo && userInfo.role === 'Customer'
                    ? ' customer-pdf'
                    : ''
                }>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-6 col-sm-12">
                      {' '}
                      Contract Management
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <ul className="contract-download-nav ">
                        {isFooter ||
                        (newAddendumData &&
                          newAddendumData.id &&
                          showEditor &&
                          updatedFormData &&
                          updatedFormData.addendum) ? (
                          ''
                        ) : (
                          <li
                            className={
                              details &&
                              details.id &&
                              contractDesignLoader !== null &&
                              !contractDesignLoader
                                ? 'download-pdf '
                                : 'download-pdf disabled'
                            }>
                            <a
                              className="download-pdf-link"
                              href={
                                details && details.contract_url
                                  ? details && details.contract_url
                                  : null
                              }
                              download>
                              <img
                                src={OrangeDownloadPdf}
                                alt="download"
                                className="download-pdf-icon "
                                role="presentation"
                              />
                              Download
                            </a>
                          </li>
                        )}
                        <li>
                          <span className="divide-arrow" />
                        </li>
                        <li>
                          <img
                            width="18px"
                            src={CloseIcon}
                            alt="close"
                            className="float-right cursor remove-cross-icon"
                            onClick={() => {
                              // history.goBack('Agreement');
                              if (
                                history &&
                                history.location &&
                                history.location.state
                              ) {
                                history.push(
                                  history &&
                                    history.location &&
                                    history.location.state,
                                );
                              } else {
                                history.push(PATH_CUSTOMER_LIST);
                              }
                            }}
                            role="presentation"
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </HeaderDownloadFuntionality>

            {(isLoading.loader && isLoading.type === 'page') ||
            activityLoader ? (
              <PageLoader
                className="modal-loader"
                color="#FF5933"
                type="page"
                width={40}
                component="agreement"
              />
            ) : details && details.id ? (
              <>
                {isDesktop ||
                (isTablet && tabInResponsive === 'view-contract') ||
                (isMobile && tabInResponsive === 'view-contract')
                  ? viewContract()
                  : ''}
                {isDesktop ||
                (isTablet && tabInResponsive === 'edit-fields') ||
                (isMobile && tabInResponsive === 'edit-fields')
                  ? displayRightSidePanel()
                  : ''}
                {(details &&
                  details.id &&
                  isLoading.loader &&
                  isLoading.type === 'button') ||
                (!isLoading.loader && isLoading.type === 'page')
                  ? displayFooter()
                  : null}
              </>
            ) : (
              ''
            )}
          </div>

          <Modal
            isOpen={showModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Edit modal">
            <img
              src={CloseIcon}
              alt="close"
              className="float-right cursor cross-icon"
              onClick={() => {
                setShowModal(false);
                removeParams('step');
                setShowEditor(false);
              }}
              role="presentation"
            />
            <ModalBox>
              <RequestSignature
                id={id}
                agreementData={details}
                setShowModal={setShowModal}
                pdfData={pdfData}
                setOpenCollapse={setOpenCollapse}
                getContractDetails={getContractDetails}
                setContractLoading={setIsLoading}
                setShowEditor={setShowEditor}
                setIsEditContract={setIsEditContract}
              />
            </ModalBox>
          </Modal>
          <Modal
            isOpen={showDiscardModal.show}
            style={customStylesForAlert}
            ariaHideApp={false}
            contentLabel="Edit modal">
            <ModalBox>
              <div className="modal-body">
                <div className="alert-msg ">
                  <span>Are you sure you want to discard all the changes?</span>
                </div>
                <div className="text-center ">
                  <Button
                    onClick={() => discardAgreementChanges('No')}
                    type="button"
                    className="btn-primary on-boarding  mr-2 pb-2 mb-1">
                    Keep Editing
                  </Button>
                  <Button
                    onClick={() => discardAgreementChanges('Yes')}
                    type="button"
                    className=" btn-transparent w-50 on-boarding ">
                    Discard Changes
                  </Button>

                  {/* </Link> */}
                </div>
              </div>
            </ModalBox>
          </Modal>
          <Modal
            isOpen={showDiscountModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Edit modal">
            <img
              src={CloseIcon}
              alt="close"
              className="float-right cursor cross-icon"
              onClick={() => closeDiscountModal()}
              role="presentation"
            />
            <ModalBox>
              <Discount
                agreementData={details}
                setShowDiscountModal={setShowDiscountModal}
                formData={formData}
                setFormData={setFormData}
                discountFlag={discountFlag}
                // getContractDetails={getContractDetails}
                setIsEditContract={setIsEditContract}
              />
            </ModalBox>
          </Modal>
          <Modal
            isOpen={showEditContractConfirmationModal}
            style={customStylesForAlert}
            ariaHideApp={false}
            contentLabel="Edit modal">
            <ModalBox>
              <div className="modal-body">
                <div className="alert-msg  ">
                  Making any edits to this contract will void the version of the
                  contract that&apos;s out for signature.
                  <div className="sure-to-proceed">
                    Are you sure you want to proceed?
                  </div>
                </div>

                <div className="text-center ">
                  <Button
                    onClick={() => editAgreementChanges('Yes')}
                    type="button"
                    className="btn-primary on-boarding  mr-2 pb-2 mb-1">
                    Yes, Make Edits
                  </Button>
                  <Button
                    onClick={() => editAgreementChanges('No')}
                    type="button"
                    className=" btn-transparent w-50 on-boarding ">
                    Cancel
                  </Button>
                </div>
              </div>
            </ModalBox>
          </Modal>
        </>
      )}
    </>
  );
}

const ContractTab = styled.div`
  background: ${Theme.gray6};
  padding-top: 70px;
  position: fixed;
  z-index: 1;
  width: 100%;

  .tabs {
    padding: 0;
    margin: 0;
    list-style-type: none;
    border-bottom: 1px solid ${Theme.gray5};

    li {
      display: inline-block;
      color: ${Theme.black};
      font-size: ${Theme.normal};
      padding: 23px 40px;
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        padding-bottom: 23px;
        border-bottom: 2px solid ${Theme.orange};
        color: ${Theme.black};
        font-family: ${Theme.titleFontFamily};
      }

      &.active {
        padding-bottom: 23px;
        border-bottom: 2px solid ${Theme.orange};
        color: ${Theme.black};
        font-family: ${Theme.titleFontFamily};
      }
    }
  }
  @media only screen and (max-width: 767px) {
    padding-top: 107px;
  }
`;
