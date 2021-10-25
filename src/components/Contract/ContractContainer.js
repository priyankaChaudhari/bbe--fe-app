/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useCallback, useRef } from 'react';

import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import queryString from 'query-string';
import dayjs from 'dayjs';
import { useMediaQuery } from 'react-responsive';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import PdfViewer from '../../common/PdfViewer';
import AgreementSidePanel from './AgreementSidePanel';
import Agreement from './Agreement';
import ServicesAmendment from './ServicesAmendment';
import DSPAddendum from './DSPAddendum';
import Addendum from './Addendum';
import Statement from './Statement';
import ContractFooter from './ContractFooter';
import THAD_SIGN_IMG from '../../constants/ThadSignImg';
import { ContractTab, SidePanel } from '../../theme/AgreementStyle';
import { CloseIcon, OrangeDownloadPdf } from '../../theme/images';
import {
  RequestSignatureModal,
  DiscardChangesConfirmation,
  DiscountModal,
  ContractEditConfirmation,
} from './ContractModals';
import {
  PageLoader,
  PageNotFound,
  Button,
  HeaderDownloadFuntionality,
} from '../../common';
import {
  agreementTemplate,
  getcontract,
  getServicesFee,
  getAmendment,
} from '../../api/AgreementApi';
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
import {
  AgreementDetails,
  StatementDetails,
  DSPAddendumDetails,
  additionaMarketplaceAmount,
  AgreementSign,
  AddendumSign,
  RecurringLanguage,
  Recurring90DaysLanguage,
  PATH_CUSTOMER_DETAILS,
  PATH_CUSTOMER_LIST,
} from '../../constants';

const customStylesForTabs = {
  width: '33%',
  margin: '0',
  paddingLeft: '0',
  paddingRight: '0',
};

const nonDraftCustomStyles = {
  width: '50%',
  margin: '0',
  paddingLeft: '0',
  paddingRight: '0',
};

export default function ContractContainer() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const params = queryString.parse(history.location.search);

  const { id } = useParams();

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
    agreement: true,
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
  const [amendmentData, setAmendmentData] = useState({});
  const [sidebarSection, setSidebarSection] = useState('edit');

  const detailsId = details?.id;
  const contractStatusValue = details?.contract_status?.value;
  const contractTypeDsp = formData?.contract_type
    ?.toLowerCase()
    .includes('dsp');
  const contractTypeRecurring = formData?.contract_type
    ?.toLowerCase()
    .includes('recurring');
  const contractTypeOne = formData?.contract_type
    ?.toLowerCase()
    .includes('one');
  const additionalMonthlyServicesLength =
    details?.additional_monthly_services?.length;
  const primaryMarketplaceName = details?.primary_marketplace?.name;
  const customerCompanyName = formData?.customer_id?.company_name;
  const customerAddress = formData?.customer_id?.address;
  const customerState = formData?.customer_id?.state;
  const customerCity = formData?.customer_id?.city;
  const customerZipCode = formData?.customer_id?.zip_code;

  const displayNumber = (num) => {
    const res = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return res;
  };

  const executeScroll = (eleId) => {
    const element = document.getElementById(eleId);
    const offset = isDesktop ? -150 : isMobile ? -220 : -220;
    const y =
      element?.getBoundingClientRect()?.top + window.pageYOffset + offset;
    window.scrollTo({ top: y });
  };

  if (
    isLoading.loader === true &&
    isLoading.type === 'page' &&
    detailsId &&
    loaderFlag === true
  ) {
    setIsLoading({ loader: false, type: 'page' });
    setLoaderFlag(false);
  }

  const fetchUncommonOptions = (options, alreadySelected, type) => {
    let result = [];
    if (alreadySelected?.length) {
      for (const option of options) {
        let isFound = true;
        for (const service of alreadySelected) {
          if (
            service?.service?.id
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

  const splittedPath = location?.pathname?.split('/');

  const getContractActivityLogInfo = useCallback(
    (currentPage) => {
      setActivityLoader(true);
      getContractActivityLog(currentPage, splittedPath && splittedPath[4]).then(
        (response) => {
          setActivityData(response?.data?.results);
          setActivityCount(response?.data?.count);
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

  const checkContractStatus = () => {
    if (details?.contract_status) {
      if (
        contractStatusValue === 'pending account setup' ||
        contractStatusValue === 'active' ||
        contractStatusValue === 'renewed' ||
        contractStatusValue === 'cancel' ||
        contractStatusValue === 'pending for cancellation' ||
        contractStatusValue === 'active pending for pause' ||
        contractStatusValue === 'pause' ||
        contractStatusValue === 'inactive'
      ) {
        return true;
      }
      return false;
    }
    return false;
  };

  if (isDocRendered && formData?.id) {
    if (checkContractStatus()) {
      setIsDocRendered(false);
      setDownloadApiCall(true);
    }
    if (
      (contractTypeDsp || (contractTypeRecurring && showSection.dspAddendum)) &&
      (!formData.start_date ||
        (formData.start_date &&
          firstMonthDate &&
          secondMonthDate &&
          thirdMonthDate))
    ) {
      setIsDocRendered(false);
      setDownloadApiCall(true);
    }
    if (!contractTypeDsp && contractTypeRecurring && !showSection.dspAddendum) {
      setIsDocRendered(false);
      setDownloadApiCall(true);
    }
    if (contractTypeOne) {
      setIsDocRendered(false);
      setDownloadApiCall(true);
    }
  }

  const getAmendmentData = (contractId) => {
    getAmendment(contractId).then((amendments) => {
      setAmendmentData(amendments && amendments.data);
    });
  };

  const setMandatoryFieldsErrors = (contract) => {
    let agreementErrors = 0;
    let statementErrors = 0;
    let dspErrors = 0;

    if (
      contract?.contract_type?.toLowerCase().includes('one') &&
      (contract.additional_one_time_services === null ||
        !contract.additional_one_time_services.length)
    ) {
      agreementErrors += 1;

      setAdditionalMonthlySerError({
        ...additionalMonthlySerError,
        required: 'At least 1 one time service required',
      });
    }

    AgreementDetails.forEach((item) => {
      if (item.key !== 'contract_address') {
        if (!(item.key === 'length' && details?.contract_type === 'one time')) {
          if (
            item.isMandatory &&
            item.field === 'customer' &&
            !(contract?.customer_id && contract.customer_id[item.key])
          ) {
            agreementErrors += 1;
            item.error = true;
          }
          if (
            item.isMandatory &&
            item.field !== 'customer' &&
            !(contract && contract[item.key])
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
              !(contract?.customer_id && contract.customer_id[subItem.key])
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
        !(contract && contract[item.key]) &&
        !contract?.contract_type?.toLowerCase().includes('one')
      ) {
        statementErrors += 1;
        item.error = true;
      }
    });

    DSPAddendumDetails.forEach((item) => {
      if (item.isMandatory && !(contract && contract[item.key])) {
        if (
          contract?.contract_type?.toLowerCase().includes('dsp') &&
          item.key !== 'dsp_length'
        ) {
          dspErrors += 1;
          item.error = true;
        }

        if (
          contract?.contract_type?.toLowerCase().includes('recurring') &&
          item.key === 'dsp_length'
        ) {
          dspErrors += 1;
          item.error = true;
        } else if (!contract?.contract_type?.toLowerCase().includes('dsp')) {
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

  const showEditView = (contract) => {
    setIsEditContract(true);
    setMandatoryFieldsErrors(contract);
    setSidebarSection('edit');
  };

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
          // get amendment data
          if (res?.data?.draft_from) {
            getAmendmentData(res?.data?.id);
          }
          getAddendum({
            customer_id: id,
            contract_id: res?.data?.id,
          }).then((addendum) => {
            setNewAddendum(
              addendum?.data?.results?.length && addendum.data.results[0],
            );
            setOriginalAddendumData(
              addendum?.data?.results?.length && addendum.data.results[0],
            );
          });
          if (history?.location?.showEditView) {
            showEditView(res?.data);
          }
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
      setData(response?.data?.results && response.data.results[0]);
      getContractDetails();
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
      setMonthlyService(res?.data);
    });

    getServicesFee().then((res) => {
      setServicesFees(res?.data);
    });

    getOneTimeService().then((r) => {
      setOneTimeService(r?.data);

      if (r?.data) {
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
  }, [dispatch, id]);

  const showTabInResponsive = (section) => {
    if (section === 'edit-fields') {
      setShowtabInResponsive('edit-fields');
    }
    if (section === 'view-contract') {
      setShowtabInResponsive('view-contract');
    }
    if (section === 'amendment') {
      setShowtabInResponsive('amendment');
      setSidebarSection('edit');
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

      if (originalData?.additional_marketplaces?.length) {
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

  const handleNewDate = (monthDateOrder) => {
    const newDate = new Date(
      new Date(
        new Date(monthDateOrder).getFullYear(),
        new Date(monthDateOrder).getMonth() + 1,
        0,
      ),
    );
    return newDate;
  };

  const calculateTotalDays = (flag = '') => {
    let firstMonthdays = 0;
    if (new Date(firstMonthDate).getDate() !== 1) {
      const totalDays = handleNewDate(firstMonthDate).getDate();
      const currentDate = new Date(firstMonthDate).getDate();
      firstMonthdays = totalDays - currentDate;
    } else {
      firstMonthdays = handleNewDate(firstMonthDate).getDate();
    }

    let extraDays = 0;
    if (new Date(firstMonthDate).getDate() !== 1) {
      extraDays = handleNewDate(endMonthDate).getDate();
    }
    const secondMonthdays = handleNewDate(secondMonthDate).getDate();
    const thirdMonthdays = handleNewDate(thirdMonthDate).getDate();
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
      if (contractTypeDsp) {
        return calculateTotalDays('initial');
      }
      if (
        formData[key] === undefined ||
        formData[key] === '' ||
        formData[key] === null
      ) {
        return `Enter ${label}`;
      }
      return formData?.length?.label && parseInt(formData.length.label, 10);
    }
    if (key === 'length') {
      return formData?.length?.label
        ? formData.length.label
        : formData.length
        ? formData.length
        : 'Select Length';
    }
    if (key === 'primary_marketplace') {
      if (details?.primary_marketplace) {
        return primaryMarketplaceName
          ? details.primary_marketplace.name
          : details.primary_marketplace;
      }
      return `Enter ${label}.`;
    }

    if (key === 'start_date') {
      return formData && formData[key] !== null
        ? formData && dayjs(formData[key]).format('MM / DD / YYYY')
        : 'Select Date';
    }
    if (key === 'current_date') {
      return dayjs(Date()).format('MM / DD / YYYY');
    }
    if (key === 'calculated_no_of_days') {
      return calculateTotalDays();
    }

    if (key === 'address') {
      if (
        (customerAddress === '' || customerAddress === null) &&
        (customerState === '' || customerState === null) &&
        (customerCity === '' || customerCity === null) &&
        (customerZipCode === '' || customerZipCode === null)
      ) {
        return `Enter Location`;
      }
      return `${customerAddress || ''}${
        customerAddress && (customerState || customerCity || customerZipCode)
          ? ','
          : ''
      }
       ${customerCity || ''}${
        customerCity && (customerState || customerZipCode) ? ',' : ''
      }
      ${customerState || ''}${customerState && customerZipCode ? ',' : ''}     
      ${customerZipCode || ''}
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
            ? `$${displayNumber(details?.sales_threshold)}`
            : `Enter ${label}.`
        }</span>`;
      }
    }

    if (type && type.includes('number')) {
      if (details && details[key]) {
        return `${type === 'number-currency' ? '$' : '%'}${displayNumber(
          details[key],
        )}`;
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
  };

  const showRevTable = () => {
    if (details?.threshold_type && details.threshold_type !== 'None') {
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
            if (item?.service?.name !== 'Inventory Reconciliation') {
              fields.push(
                `<tr>
                <td style="border: 1px solid black;padding: 13px;">${
                  item.service ? item.service.name : item?.name
                }</td>
                ${
                  item.name
                    ? item.name === 'DSP Advertising'
                    : item.service.name === 'DSP Advertising'
                    ? `<td style="border: 1px solid black;padding: 13px;">N/A</td>`
                    : `<td style="border: 1px solid black;padding: 13px;">$${
                        item.service
                          ? displayNumber(item.service.fee)
                          : item.fee
                          ? displayNumber(item.fee)
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
                  item?.quantity ? displayNumber(item.quantity) : 0
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
                                $${displayNumber(
                                  item.custom_amazon_store_price,
                                )}
                               </td>`
                     : `<td style="border: 1px solid black;padding: 13px;">Yet to save</td>`
                   : item?.service?.fee
                   ? `<td style="border: 1px solid black;padding: 13px;">
                           $${(item?.service?.fee ? item.service.fee : '')
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
    if (details?.additional_marketplaces) {
      for (const item of details.additional_marketplaces) {
        fields.push(
          `<tr>
      <td style="border: 1px solid black;padding: 13px;">${
        item.service ? item.service.name : item && item.name
      }</td>
                    <td style="border: 1px solid black;padding: 13px;">$${
                      item.service
                        ? displayNumber(item.service.fee)
                        : item.fee
                        ? displayNumber(item.fee)
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
    if (details?.additional_monthly_services) {
      for (const item of details.additional_monthly_services) {
        if (item?.service?.name === 'Inventory Reconciliation') {
          fields.push(
            `<tr>
                 <td style="border: 1px solid black;padding: 13px;">${
                   item.service ? item.service.name : item?.name
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
        details?.total_fee?.onetime_service_after_discount
          ? displayNumber(details.total_fee.onetime_service_after_discount)
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
      details?.total_fee?.monthly_service_discount
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
      details?.total_fee?.monthly_service_discount
        ? `<tr style=" border: 1px solid black;">
            <td class="total-service" style="border-bottom: hidden;border-left: 1px solid black; padding: 5px 13px"> Discount ${
              details?.monthly_discount_amount &&
              details?.monthly_discount_type === 'percentage'
                ? `(${details?.monthly_discount_amount}%)`
                : ''
            }</td>
            <td class="total-service text-right"style="border-bottom: hidden; border-left: 1px solid black; padding: 5px 13px; text-align:right"> -$${
              details?.total_fee?.monthly_service_discount
                ? displayNumber(details?.total_fee?.monthly_service_discount)
                : 0
            }
            </td>
         </tr>`
        : ''
    }
         <tr>
            <td class="total-service" style="border: 1px solid black;padding: 5px 13px; font-weight: 800"> Total</td>
            <td class="total-service text-right" style="border: 1px solid black;padding: 5px 13px ;font-weight: 800; text-align:right"> $${
              details?.total_fee?.monthly_service_after_discount
                ? displayNumber(
                    details.total_fee.monthly_service_after_discount,
                  )
                : 0
            }
            </td>
         </tr>
         `;
  };

  const mapOnetimeServiceTotal = () => {
    return `
    ${
      details?.total_fee?.onetime_service_discount
        ? `<tr style=" border: 1px solid black;">
            <td class="total-service" colspan="3" style="border-bottom: hidden;border-left: 1px solid black; padding: 5px 13px;"> Sub-total</td>
            <td class="total-service text-right" style="border-bottom: hidden;border-left: 1px solid black; padding: 5px 13px; text-align:right">$${displayNumber(
              details?.total_fee?.onetime_service,
            )}
            </td>
         </tr>`
        : ''
    }
       ${
         details?.total_fee?.onetime_service_discount
           ? `<tr style=" border: 1px solid black;">
            <td class="total-service" colspan="3" style="border-bottom: hidden; border-left: 1px solid black;padding: 5px 13px;"> Discount ${
              details?.one_time_discount_amount &&
              details?.one_time_discount_type === 'percentage'
                ? `(${details?.one_time_discount_amount}%)`
                : ''
            }</td>
            <td class="total-service text-right" style="border-bottom: hidden;border-left: 1px solid black; padding: 5px 13px; text-align:right"> -$${displayNumber(
              details?.total_fee?.onetime_service_discount,
            )}
            </td>
         </tr>`
           : ''
       }
         
         <tr>
            <td class="total-service" colspan="3" style="border: 1px solid black;padding: 5px 13px ; font-weight: 800"> Total</td>
            <td class="total-service text-right" style="border: 1px solid black;padding: 5px 13px ;font-weight: 800; text-align:right"> $${displayNumber(
              details?.total_fee?.onetime_service_after_discount,
            )}
            </td>
         </tr>
         `;
  };

  const showMonthlyServiceTable = () => {
    if (additionalMonthlyServicesLength) {
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
    if (details?.additional_one_time_services?.length) {
      return `<table
    class="contact-list "
    style="width: 100%;
    border-collapse: collapse;
">
    <tr
      style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;">
      <th style="text-align: left;border: 1px solid black;padding: 13px;">Quantity</th>
      <th style="text-align: left;border: 1px solid black;padding: 13px;">Service</th>
      <th style="text-align: left;border: 1px solid black;padding: 13px;">Service Fee</th>
      <th style="text-align: left;border: 1px solid black;padding: 13px;">Total Service Fee</th>
    </tr>
    ${mapMonthlyServices('additional_one_time_services', 'One Time Services')}
    ${mapOnetimeServiceTotal()}
  </table>`;
    }
    return '';
  };

  const showOneTimeServiceTable = () => {
    if (details?.additional_one_time_services?.length) {
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center;"><span style="font-weight: 800;
    font-family: Helvetica-bold;">Additional One Time Services </span><br>The following additional monthly services will be provided to Client as a one time service in addition to the Monthly Retainer and any Additional Monthly services.</div><br>${showOneTimeTable()}`;
    }
    return '';
  };

  const showBillingCap = () => {
    if (formData?.billing_cap) {
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
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center;">
      <span style="font-weight: 800; font-family: Helvetica-bold;">Additional Services Not Included</span>
      <br>The following services are not part of this agreement, but can be purchased after signing by working with your Buy Box Experts Brand Growth Strategist or Sales Representative.
      </div>
      <div class="table-responsive"><br> 
        <table class="contact-list " style="width: 100%;border-collapse: collapse;">
          <tr>
            <th style="text-align: left; border: 1px solid black;padding: 13px;">Service</th>
            <th style="text-align: left; border: 1px solid black;padding: 13px;">Service Type</th>
          </tr>
          ${displayNotIncludedServices()}
        </table>
      </div>`;
    }
    return '';
  };

  const getAgreementAccorType = (index) => {
    if (data && details?.contract_type?.toLowerCase().includes('one')) {
      return (
        data?.one_time_service_agreement &&
        data.one_time_service_agreement[index]
      );
    }
    return (
      data?.recurring_service_agreement &&
      data.recurring_service_agreement[index]
    );
  };

  const mapDspDetails = () => {
    return `<tr>
        <td style="border: 1px solid black; padding: 13px;">
          <span style="background:#ffe5df;padding: 4px 9px; font-weight: bold";>
            ${
              firstMonthDate
                ? dayjs(firstMonthDate).format('MM-DD-YYYY')
                : 'MM-DD-YYYY'
            }
          </span>
        </td>
        <td style="border: 1px solid black; padding: 13px;">
          <span style="background:#ffe5df;padding: 4px 9px; font-weight: bold";>DSP_FEE</span>
        </td>
      </tr>`;
  };

  const displayFirstMonthFee = () => {
    if (firstMonthDate && new Date(firstMonthDate).getDate() !== 1) {
      if (formData?.dsp_fee) {
        const fee = parseInt(formData?.dsp_fee, 10);
        const FinalFee = fee + fee / 2;
        return `$${displayNumber(FinalFee)}`;
      }
    }
    if (formData?.dsp_fee) {
      return `$${formData?.dsp_fee && displayNumber(formData.dsp_fee)}`;
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
      if (contractTypeOne) {
        if (
          customerCompanyName &&
          formData.start_date &&
          customerAddress &&
          customerState &&
          customerCity &&
          customerZipCode &&
          (formData.additional_one_time_services !== null ||
            formData.additional_one_time_services?.length)
        ) {
          return true;
        }
      } else if (
        customerCompanyName &&
        formData.start_date &&
        formData.length &&
        customerState &&
        customerCity &&
        customerZipCode
      ) {
        return true;
      }
    }

    if (section === 'statement') {
      if (!contractTypeOne && !contractTypeDsp) {
        if (
          formData?.monthly_retainer &&
          formData.primary_marketplace &&
          formData.rev_share
        ) {
          return true;
        }
      } else return true;
    }

    if (section === 'dspAddendum') {
      if (showSection?.dspAddendum && !contractTypeOne) {
        if (contractTypeDsp) {
          if (formData?.start_date && formData.dsp_fee) {
            return true;
          }
        }
        if (formData?.start_date && formData.dsp_fee && formData.dsp_length) {
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
    setSidebarSection('edit');
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
      details?.content_optimization ? details?.content_optimization : 0
    } </span></span></td><td style="border: 1px solid black;
    padding: 13px;">Listing Optimization - Design <br> <span style="font-weight: 800;"> ASIN&rsquo;s per month: <span style=" background:#ffe5df;padding: 4px 9px;"> ${
      details?.design_optimization ? details?.design_optimization : 0
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
      details?.seller_type?.label
        ? [
            details?.seller_type?.label
              ? details?.seller_type?.label
              : details?.seller_type && details.seller_type,
          ]
        : ''
    } Account Management</td></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Review Strategy</td><td style="border: 1px solid black;
    padding: 13px;">Total Managed Ad Spend</td><td style="border: 1px solid black;
    padding: 13px;">Channel Governance Consultation</td></tr></table> </div>
  `;
  };

  const mapLanguage = () => {
    if (
      details?.contract_type
        ?.toLowerCase()
        .includes('recurring (90 day notice)')
    ) {
      return Recurring90DaysLanguage;
    }
    return RecurringLanguage;
  };

  const calculateTotalFee = (type) => {
    let oneTimeSubTotal = 0;
    let monthlySubTotal = 0;
    let oneTimeDiscount = 0;
    let monthlyDiscount = 0;
    let additionalMarketplacesTotal = 0;

    if (formData) {
      if (type === 'monthly') {
        // caculate the total of additional monthly serviece
        if (formData.additional_monthly_services !== null) {
          formData.additional_monthly_services.forEach((item) => {
            if (item?.service) {
              monthlySubTotal += item.service.fee;
            } else {
              const fixedFee = servicesFees.filter(
                (n) => n.id === item.service_id,
              );
              monthlySubTotal += fixedFee[0].fee;
            }
          });
        }
        if (formData.additional_marketplaces !== null) {
          // calculate the total of additional marketplaces
          formData.additional_marketplaces.forEach((item) => {
            if (item?.fee) {
              additionalMarketplacesTotal += item.fee;
            } else {
              additionalMarketplacesTotal += additionaMarketplaceAmount;
            }
          });

          monthlySubTotal += additionalMarketplacesTotal;
        }
        if (formData.monthly_discount_type !== null) {
          const discountType = formData.monthly_discount_type;
          if (discountType === 'percentage') {
            monthlyDiscount =
              (monthlySubTotal * formData.monthly_discount_amount) / 100;
          } else if (discountType === 'fixed amount') {
            monthlyDiscount = formData.monthly_discount_amount;
          }
        } else {
          monthlyDiscount = formData.monthly_discount_amount;
        }
        return {
          monthlySubTotal,
          monthlyAmountAfterDiscount: monthlyDiscount,
          monthlyTotal: monthlySubTotal - monthlyDiscount,
          monthlyDiscountType: formData.monthly_discount_type,
          monthlyDiscount: formData.monthly_discount_amount,
        };
      }
      if (
        type === 'onetime' &&
        formData.additional_one_time_services !== null
      ) {
        formData.additional_one_time_services.forEach((item) => {
          const { quantity } = item;

          if (item.custom_amazon_store_price) {
            oneTimeSubTotal += item.custom_amazon_store_price * quantity;
          } else if (item && item.service) {
            oneTimeSubTotal += item.service.fee * quantity;
          } else {
            let fixedFee = servicesFees.filter((n) => n.id === item.service_id);
            fixedFee =
              fixedFee && fixedFee[0] && fixedFee[0].fee ? fixedFee[0].fee : 0;
            oneTimeSubTotal += fixedFee * quantity;
          }
        });

        if (formData.one_time_discount_type !== null) {
          const discountType = formData.one_time_discount_type;
          if (discountType === 'percentage') {
            oneTimeDiscount =
              (oneTimeSubTotal * formData.one_time_discount_amount) / 100;
          } else if (discountType === 'fixed amount') {
            oneTimeDiscount = formData.one_time_discount_amount;
          }
        } else {
          oneTimeDiscount = formData.one_time_discount_amount;
        }
        return {
          oneTimeSubTotal,
          oneTimeAmountAfterDiscount: oneTimeDiscount,
          oneTimeTotal: oneTimeSubTotal - oneTimeDiscount,
          oneTimeDiscountType: formData.one_time_discount_type,
          oneTimeDiscount: formData.one_time_discount_amount,
        };
      }
    }
    return 0;
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
        )
        .replace('LANGUAGE_ACCORDING_TO_CONTRACT_TYPE', `${mapLanguage()}`);

    const agreementSignatureData = AgreementSign.replace(
      'CUSTOMER_NAME',
      mapDefaultValues('company_name', 'Customer Name'),
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
          mapDefaultValues('threshold_type', 'Rev Threshold'),
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
        )
        .replace(
          'BILLING_CAP_AMOUNT',
          mapDefaultValues('billing_cap', 'Billing Cap', 'number-currency'),
        );

    const dspAddendum = showSection?.dspAddendum
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

    const dspAddendumSignature = showSection?.dspAddendum
      ? AddendumSign.replace(
          'CUSTOMER_NAME',
          mapDefaultValues('company_name', 'Customer Name'),
        )
          .replace('BBE_DATE', mapDefaultValues('current_date', 'Current Date'))
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

    const newAddendumAddedData = newAddendumData?.addendum
      ? newAddendumData.addendum.replaceAll('<p>', '<p style="margin:0">')
      : '';

    const addendumSignatureData = AddendumSign.replace(
      'CUSTOMER_NAME',
      mapDefaultValues('company_name', 'Customer Name'),
    )
      .replace('BBE_DATE', mapDefaultValues('current_date', 'Current Date'))
      .replace('THAD_SIGN', mapThadSignImg());

    const finalAgreement = `${agreementData} ${agreementSignatureData} ${
      details?.contract_type?.toLowerCase().includes('one') ||
      details?.contract_type?.toLowerCase().includes('dsp')
        ? ''
        : statmentData
    } ${
      details?.contract_type?.toLowerCase().includes('one') ? '' : dspAddendum
    } ${
      details?.contract_type?.toLowerCase().includes('one')
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
      contract: detailsId,
      contract_data: finalAgreement
        .replaceAll('PRINTED_NAME', '')
        .replace('CUSTOMER_ROLE', ''),
    };

    createContractDesign(contractData).then(() => {
      setContractDesignLoader(false);
    });
  };

  useEffect(() => {
    if (downloadApiCall) {
      createAgreementDoc();
      setDownloadApiCall(false);
    }
  }, [downloadApiCall]);

  useEffect(() => {
    const sectionFlag = { ...showSection };

    if (additionalMonthlyServicesLength) {
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
    if (details?.additional_marketplaces?.length) {
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
    if (details?.additional_one_time_services?.length) {
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

    if (primaryMarketplaceName) {
      setAdditionalMarketplaces(
        marketplacesResult.filter(
          (op) => op.value !== details.primary_marketplace.name,
        ),
      );
    } else {
      setAdditionalMarketplaces(marketplacesResult);
    }

    if (details?.additional_marketplaces) {
      setMarketPlaces(
        marketplacesResult.filter(
          (choice) =>
            !(details?.additional_marketplaces).some(
              (item) => item.name === choice.value,
            ),
        ),
      );
    } else {
      setMarketPlaces(marketplacesResult);
    }

    if (details?.additional_one_time_services) {
      fetchUncommonOptions(
        oneTimeService,
        details.additional_one_time_services,
        'one_time_service',
      );
    }

    if (details?.additional_monthly_services) {
      fetchUncommonOptions(
        monthlyService,
        details.additional_monthly_services,
        'monthly_service',
      );
    }

    if (newAddendumData?.id) {
      if (newAddendumData.addendum?.length <= 7) {
        sectionFlag.addendum = false;
      } else {
        sectionFlag.addendum = true;
      }
    }

    if (
      !contractTypeOne &&
      !contractTypeDsp &&
      additionalMonthlyServicesLength &&
      details.additional_monthly_services.find(
        (item) =>
          item?.service?.name &&
          item.service.name.toLowerCase().includes('dsp'),
      )
    ) {
      sectionFlag.dspAddendum = true;
    } else {
      sectionFlag.dspAddendum = false;
    }

    if (details?.contract_type?.toLowerCase().includes('dsp')) {
      sectionFlag.dspAddendum = true;
    }

    setIsDocRendered(true);
    setShowCollpase(sectionFlag);
  }, [details, newAddendumData]);

  const createPrimaryMarketplace = () => {
    const statementData = {
      id: details?.primary_marketplace?.id || '',
      contract: detailsId,
      name: updatedFormData && updatedFormData.primary_marketplace,
      is_primary: true,
    };

    if (details.primary_marketplace?.id) {
      updateMarketplace(details.primary_marketplace.id, statementData).then(
        (updateMarketplaceRes) => {
          if (updateMarketplaceRes?.status === 200) {
            setFormData({
              ...formData,
              primary_marketplace: updateMarketplaceRes?.data,
            });
            if (updatedFormData?.primary_marketplace) {
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
            primary_marketplace: createMarketplaceRes?.data,
          });
          if (updatedFormData?.primary_marketplace) {
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
      if (updateMarketplacesRes?.status === 200) {
        setFormData({
          ...formData,
          additional_marketplaces: updateMarketplacesRes?.data,
        });
        setOriginalData({
          ...originalData,
          additional_marketplaces: updateMarketplacesRes?.data,
        });
      }
    });
    if (flag) {
      if (updatedFormData?.additional_marketplaces) {
        delete updatedFormData.additional_marketplaces;
        setUpdatedFormData({ ...updatedFormData });
      }
      if (!formData?.additional_marketplaces?.length) {
        setShowAdditionalMarketplace(false);
      } else {
        setShowAdditionalMarketplace(true);
      }

      if (updatedFormData?.primary_marketplace) {
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
          getAmendmentData(detailsId);
          if (
            additionalMonthlySerRes?.status === 200 &&
            additionalOneTimeServRes?.status === 200 &&
            contractRes?.status === 200 &&
            addendumRes?.status === 200 &&
            updateCustomerRes?.status === 200
          ) {
            showFooter(false);
            setUpdatedFormData({});
            getContractDetails();
            setIsEditContract(false);
          }

          if (additionalMonthlySerRes?.status === 200) {
            setFormData({
              ...formData,
              additional_monthly_services: additionalMonthlySerRes?.data,
            });
            setOriginalData({
              ...originalData,
              additional_monthly_services: additionalMonthlySerRes?.data,
            });
            if (updatedFormData?.additional_monthly_services) {
              delete updatedFormData.additional_monthly_services;
            }
          }
          if (additionalOneTimeServRes?.status === 200) {
            setFormData({
              ...formData,
              additional_one_time_services: additionalOneTimeServRes?.data,
            });
            setOriginalData({
              ...originalData,
              additional_one_time_services: additionalOneTimeServRes?.data,
            });

            const service =
              additionalOneTimeServRes?.data?.length &&
              additionalOneTimeServRes.data.find(
                (item) =>
                  item?.service?.name &&
                  item.service.name === 'Amazon Store Package Custom',
              );
            if (service) {
              setAmazonStoreCustom(true);
            } else {
              setAmazonStoreCustom(false);
            }
            if (updatedFormData?.additional_one_time_services) {
              delete updatedFormData.additional_one_time_services;
            }
          }

          if (addendumRes?.status === 200 || addendumRes?.status === 201) {
            if (addendumRes?.status === 201) {
              setNewAddendum(addendumRes?.data);
            }
            setNewAddendum(addendumRes?.data);
            setOriginalAddendumData(addendumRes?.data);
            setShowEditor(false);
            if (updatedFormData?.addendum) {
              delete updatedFormData.addendum;
            }
          }

          if (updateCustomerRes?.status === 200) {
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
            additionalMonthlySerRes?.status === 400 ||
            additionalOneTimeServRes?.status === 400 ||
            contractRes?.status === 400 ||
            updateCustomerRes?.status === 400
          ) {
            toast.error(
              'Changes have not been saved. Please fix errors and try again',
            );
          }

          if (additionalMonthlySerRes?.status === 400) {
            setAdditionalMonthlySerError({
              ...additionalMonthlySerError,
              ...additionalMonthlySerRes.data,
            });

            if (additionalMonthlySerRes.data) {
              statementErrCount += Object.keys(additionalMonthlySerRes.data)
                .length;
            }
          }
          if (additionalOneTimeServRes?.status === 400) {
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
              additionalOneTimeServRes?.data &&
              Object.values(additionalOneTimeServRes.data)?.length &&
              Object.values(additionalOneTimeServRes.data)[0] ===
                'Object does not exists'
            ) {
              showFooter(false);
              setIsEditContract(false);
              setUpdatedFormData({});
              getContractDetails();
            }
          }

          if (updateCustomerRes?.status === 400) {
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
          if (contractRes?.status === 400) {
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
      if (updatedFormData?.start_date) {
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

      if (updatedContractFields?.threshold_type === 'Fixed') {
        updatedContractFields.yoy_percentage = null;
        if (!updatedContractFields.sales_threshold) {
          updatedContractFields.sales_threshold = formData.sales_threshold;
        }
      }

      if (updatedContractFields?.threshold_type === 'YoY + %') {
        updatedContractFields.sales_threshold = null;
        if (!updatedContractFields.yoy_percentage) {
          updatedContractFields.yoy_percentage = formData.yoy_percentage;
        }
      }

      if (
        updatedContractFields?.threshold_type === 'YoY' ||
        updatedContractFields?.threshold_type === 'None'
      ) {
        updatedContractFields.sales_threshold = null;
        updatedContractFields.yoy_percentage = null;
      }

      // for set discount back to null if discount less than subtotal
      if (
        updatedFormData.additional_monthly_services ||
        updatedFormData.additional_marketplaces
      ) {
        const totalFees = calculateTotalFee('monthly');
        if (Math.sign(totalFees.monthlyTotal) === -1) {
          updatedContractFields.monthly_discount_amount = null;
          updatedContractFields.monthly_discount_type = null;
        }
      }

      if (updatedFormData.additional_one_time_services) {
        const totalFees = calculateTotalFee('onetime');
        if (Math.sign(totalFees.oneTimeTotal) === -1) {
          updatedContractFields.one_time_discount_amount = null;
          updatedContractFields.one_time_discount_type = null;
        }
      }

      const detail = {
        ...updatedContractFields,
      };
      if (Object.keys(detail).length) {
        AccountApi = updateAccountDetails(details.id, detail);
      }

      if (newAddendumData?.id && updatedFormData.addendum) {
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
        updatedFormData?.primary_marketplace ||
        updatedFormData?.additional_marketplaces
      ) {
        if (
          updatedFormData?.primary_marketplace &&
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
    const rev = Number(details?.rev_share?.value);
    const dspFee = Number(details?.dsp_fee);
    const contractTermLength = parseInt(details?.length?.value, 10);
    if (details?.contract_type?.toLowerCase().includes('recurring')) {
      if (details && details.draft_from) {
        return true;
      }
      if (
        (showSection.dspAddendum && dspFee < 10000) ||
        rev < 3 ||
        contractTermLength < 12
      ) {
        return true;
      }
    }
    if (
      details?.draft_from &&
      details?.contract_type?.toLowerCase().includes('dsp')
    ) {
      return true;
    }

    if (
      details?.contract_type?.toLowerCase().includes('dsp') &&
      dspFee < 10000
    ) {
      return true;
    }
    if (newAddendumData?.addendum?.length > 7) {
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

        {details?.contract_type?.toLowerCase().includes('one') ||
        details?.contract_type?.toLowerCase().includes('dsp') ? null : (
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

        {details?.contract_type?.toLowerCase().includes('dsp') ||
        (showSection.dspAddendum &&
          !details?.contract_type?.toLowerCase().includes('one')) ? (
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
        {showSection?.addendum ? (
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
      </div>
    );
  };

  const renderEditContractBtn = (btnClass) => {
    return (
      <Button
        className={`${btnClass} on-boarding  mt-3  ${
          isEditContract ? 'w-sm-50' : 'w-sm-100'
        }`}
        onClick={() => {
          showEditView(formData);
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
        amendmentData={amendmentData}
        sidebarSection={sidebarSection}
        setSidebarSection={setSidebarSection}
        checkContractStatus={checkContractStatus}
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
        setIsLoading={setIsLoading}
        getContractDetails={getContractDetails}
        amendmentData={amendmentData}
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

  const isDraftContract = (agreement = details) => {
    if (
      agreement?.draft_from &&
      agreement.contract_status &&
      (agreement.contract_status.value === 'pending contract' ||
        agreement.contract_status.value === 'pending contract approval' ||
        agreement.contract_status.value === 'pending contract signature')
    ) {
      return true;
    }
    return false;
  };

  const renderContractTabHtml = () => {
    return (
      <>
        <ContractTab className="d-lg-none d-block">
          <ul style={{ textAlign: 'center' }} className="tabs">
            <li
              style={
                isDraftContract() ? customStylesForTabs : nonDraftCustomStyles
              }
              className={tabInResponsive === 'view-contract' ? 'active' : ''}
              role="presentation"
              onClick={() => showTabInResponsive('view-contract')}>
              View Contract
            </li>

            <li
              style={
                isDraftContract() ? customStylesForTabs : nonDraftCustomStyles
              }
              className={tabInResponsive === 'edit-fields' ? 'active' : ''}
              role="presentation"
              onClick={() => showTabInResponsive('edit-fields')}>
              {isEditContract ? 'Edit Fields' : 'Activity'}
            </li>
            {isDraftContract() ? (
              <li
                style={
                  isDraftContract() ? customStylesForTabs : nonDraftCustomStyles
                }
                className={tabInResponsive === 'amendment' ? 'active' : ''}
                role="presentation"
                onClick={() => showTabInResponsive('amendment')}>
                Amendment
              </li>
            ) : (
              ''
            )}
          </ul>
        </ContractTab>
      </>
    );
  };

  const renderHeaderDownloadFuntionality = () => {
    return (
      <>
        <HeaderDownloadFuntionality>
          <div
            className={
              userInfo && userInfo.role === 'Customer' ? ' customer-pdf' : ''
            }>
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-6 col-sm-12">Contract Management</div>
                <div className="col-md-6 col-sm-12">
                  <ul className="contract-download-nav ">
                    {isFooter ||
                    (newAddendumData?.id &&
                      showEditor &&
                      updatedFormData?.addendum) ? (
                      ''
                    ) : (
                      <li
                        className={
                          detailsId &&
                          contractDesignLoader !== null &&
                          !contractDesignLoader
                            ? 'download-pdf '
                            : 'download-pdf disabled'
                        }>
                        <a
                          className="download-pdf-link"
                          href={
                            details?.contract_url ? details?.contract_url : null
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
                          if (history?.location?.state) {
                            history.push(history?.location?.state);
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
      </>
    );
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
      ) : checkContractStatus() ? (
        <>
          {renderContractTabHtml()}
          <div className="on-boarding-container">
            {renderHeaderDownloadFuntionality()}
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
                    pdf={details?.contract_url}
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
                {(contractStatusValue === 'pending for cancellation' ||
                  contractStatusValue === 'active pending for pause') &&
                userInfo &&
                userInfo.role === 'BGS Manager'
                  ? displayFooter()
                  : ''}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {renderContractTabHtml()}
          <div className="on-boarding-container">
            {renderHeaderDownloadFuntionality()}
            {(isLoading.loader && isLoading.type === 'page') ||
            activityLoader ? (
              <PageLoader
                className="modal-loader"
                color="#FF5933"
                type="page"
                width={40}
                component="agreement"
              />
            ) : detailsId ? (
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
                {(detailsId &&
                  isLoading.loader &&
                  isLoading.type === 'button') ||
                (!isLoading.loader && isLoading.type === 'page')
                  ? displayFooter()
                  : null}

                {(isTablet && tabInResponsive === 'amendment') ||
                (isMobile && tabInResponsive === 'amendment') ? (
                  <SidePanel>
                    <ServicesAmendment amendmentData={amendmentData} />
                  </SidePanel>
                ) : (
                  ''
                )}
              </>
            ) : (
              ''
            )}
          </div>

          <RequestSignatureModal
            showModal={showModal}
            setShowModal={setShowModal}
            removeParams={removeParams}
            setShowEditor={setShowEditor}
            id={id}
            details={details}
            pdfData={pdfData}
            setOpenCollapse={setOpenCollapse}
            getContractDetails={getContractDetails}
            setIsLoading={setIsLoading}
            setIsEditContract={setIsEditContract}
          />

          <DiscardChangesConfirmation
            showDiscardModal={showDiscardModal}
            discardAgreementChanges={discardAgreementChanges}
          />

          <DiscountModal
            showDiscountModal={showDiscountModal}
            closeDiscountModal={closeDiscountModal}
            details={details}
            setShowDiscountModal={setShowDiscountModal}
            formData={formData}
            setFormData={setFormData}
            discountFlag={discountFlag}
            setIsEditContract={setIsEditContract}
            setDetails={setDetails}
          />

          <ContractEditConfirmation
            showEditContractConfirmationModal={
              showEditContractConfirmationModal
            }
            editAgreementChanges={editAgreementChanges}
          />
        </>
      )}
    </>
  );
}
