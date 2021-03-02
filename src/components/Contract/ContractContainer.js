import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
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
import { CloseIcon, LeftArrowIcon } from '../../theme/images';
import { PATH_CUSTOMER_DETAILS } from '../../constants';
import THAD_SIGN_IMG from '../../constants/ThadSignImg';
import {
  updateAccountDetails,
  createMarketplace,
  updateMarketplace,
  // createAdditionalServices,
  // updateAdditionalServices,
  createAddendum,
  getAddendum,
  updateAddendum,
  createMarketplaceBulk,
  createAdditionalServiceBulk,
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

const customStylesForAlert = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '435px ',
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
  const id = location.pathname.split('/')[2];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [updatedFormData, setUpdatedFormData] = useState({});
  const details = useSelector((state) => state.accountState.data);
  const loader = useSelector((state) => state.accountState.isLoading);
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [showModal, setShowModal] = useState(false);
  const [amazonStoreCustom, setAmazonStoreCustom] = useState(false);
  const [showAmazonPlanDropdown, setShowAmazonPlanDropdown] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState({
    clickedBtn: '',
    show: false,
  });

  const [editContractFlag, setEditContractFlag] = useState(true);
  // const [oneTimeService, setOneTimeService] = useState([]);
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
  const [additionalMarketplaceError, setAdditionalMarketplaceError] = useState(
    {},
  );
  const [additionalMonthlySerError, setAdditionalMonthlySerError] = useState(
    {},
  );
  const [additionalOnetimeSerError, setAdditionalOnetimeSerError] = useState(
    {},
  );
  const [contractError, setContractError] = useState({});
  const [showAdditionalMarketplace, setShowAdditionalMarketplace] = useState(
    false,
  );
  const [showSuccessContact, setShowSuccessContact] = useState({
    show: false,
    message: '',
  });
  const [showSection, setShowCollpase] = useState({
    addendum: true,
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
  const [calculatedDate, setCalculatedDate] = useState('');
  const [firstMonthDate, setFirstMonthDate] = useState('');
  const [secondMonthDate, setSecondMonthDate] = useState('');
  const [thirdMonthDate, setThirdMonthDate] = useState('');
  const [endMonthDate, setEndDate] = useState('');

  const executeScroll = (eleId) => {
    const element = document.getElementById(eleId);
    // if (eleId !== 'addendum') {
    const y =
      element &&
      element.getBoundingClientRect() &&
      element.getBoundingClientRect().top + window.pageYOffset + -150;

    window.scrollTo({ top: y });
    // } else {
    //   const y =
    //     element &&
    //     element.getBoundingClientRect() &&
    //     element.getBoundingClientRect().top + window.pageYOffset + -150;
    //   window.scrollTo({ top: y });
    // }
    // window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const checkPermission = () => {
    if (
      details &&
      details.contract_status &&
      (details.contract_status !== null || details.contract_status !== '')
    ) {
      return true;
    }
    return true;
  };

  const clearSuccessMessage = () => {
    setShowSuccessContact({ show: false, message: '' });
  };

  useEffect(() => {
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
      setOriginalAddendumData(
        addendum &&
          addendum.data &&
          addendum.data.results &&
          addendum.data.results[0],
      );
    });

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
      // setShowSuccessContact({
      //   show: true,
      //   message: history.location.state.message,
      // });

      // setTimeout(clearSuccessMessage(), 50000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  useEffect(() => {
    // if (
    //   (details && details.additional_one_time_services) ||
    //   (details && details.additional_marketplaces) ||
    //   (details && details.additional_monthly_services) ||
    //   (details && details.sales_threshold)
    // ) {
    //   setFormData({
    //     ...formData,
    //     additional_one_time_services:
    //       details && details.additional_one_time_services,
    //     additional_marketplaces: details && details.additional_marketplaces,
    //     additional_monthly_services:
    //       details && details.additional_monthly_services,
    //     sales_threshold: details && details.sales_threshold,
    //   });
    if (details) {
      setFormData({ ...formData, ...details });
      setOriginalData({ ...formData, ...details });
    }
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
        update: [...details.additional_one_time_services],
        delete: [],
      });
    } else {
      setAdditionalOnetimeServices({
        create: [],
        update: [],
        delete: [],
      });
    }
    if (
      details &&
      details.additional_monthly_services &&
      details.additional_monthly_services.length &&
      details.additional_monthly_services.find(
        (item) => item.service.name === 'DSP Advertising',
      )
    ) {
      setShowCollpase({ ...showSection, dspAddendum: true });
    } else {
      setShowCollpase({ ...showSection, dspAddendum: false });
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details, setShowSuccessContact]);

  const onEditAddendum = () => {
    setShowEditor(true);
  };

  const nextStep = () => {
    // if (history.location.pathname.includes('agreement')) {

    let additionalMarketplacesApi = null;
    let additionalMonthlyApi = null;
    let additionalOneTimeApi = null;
    let AccountApi = null;
    let primaryMarketPlaceApi = null;
    let AddendumApi = null;

    if (updatedFormData && Object.keys(updatedFormData).length) {
      // for start date
      if (updatedFormData && updatedFormData.start_date) {
        updatedFormData.start_date = dayjs(updatedFormData.start_date).format(
          'YYYY-MM-DD',
        );
      }

      setIsLoading({ loader: true, type: 'button' });

      // for primary market place
      if (updatedFormData && updatedFormData.primary_marketplace) {
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
          primaryMarketPlaceApi = updateMarketplace(
            details.primary_marketplace.id,
            statementData,
          );
        } else {
          primaryMarketPlaceApi = createMarketplace(statementData);
        }
      }

      // for additionL MARKETPLACE
      if (updatedFormData.additional_marketplaces) {
        additionalMarketplacesApi = createMarketplaceBulk(
          updatedFormData.additional_marketplaces,
        );
      }

      // for additionL service
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

      // for 'monthly_retainer', 'dsp_fee', 'sales_threshold'
      const num = ['monthly_retainer', 'dsp_fee', 'sales_threshold'];
      for (const val of num) {
        if (updatedFormData && updatedFormData[val]) {
          updatedFormData[val] = updatedFormData[val]
            // .substring(1)
            .replace(/,/g, '');
        }
      }
      const detail = {
        ...updatedFormData,
        steps_completed: {
          ...details.steps_completed,
          agreement: true,
          statement: true,
        },
      };

      AccountApi = updateAccountDetails(details.id, detail);

      if (newAddendumData && newAddendumData.id) {
        //  setIsLoading({ loader: true, type: 'page' });

        AddendumApi = updateAddendum(newAddendumData.id, {
          addendum: newAddendumData.addendum,
        });
        //  .then(() => {
        //    setIsLoading({ loader: false, type: 'page' });
        //    setShowEditor(false);
        //  });
      } else {
        const addendumData = {
          customer_id: id,
          addendum: newAddendumData && newAddendumData.addendum,
          contract: details.id,
        };
        //  setIsLoading({ loader: true, type: 'page' });

        AddendumApi = createAddendum(addendumData);
        // .then((res) => {
        //    setIsLoading({ loader: false, type: 'page' });
        //    if (res && res.status === 201) {
        //      setNewAddendum(res && res.data);
        //      setShowEditor(false);
        //    }
        //  });
      }

      axios
        .all([
          additionalMarketplacesApi,
          additionalMonthlyApi,
          additionalOneTimeApi,
          AccountApi,
          primaryMarketPlaceApi,
          AddendumApi,
        ])
        .then(
          axios.spread((...responses) => {
            const additionalMarketplaceRes = responses[0];
            const additionalMonthlySerRes = responses[1];
            const additionalOneTimeServRes = responses[2];
            const contractRes = responses[3];
            const primaryMarketplaceRes = responses[4];
            const addendumRes = responses[5];
            setIsLoading({ loader: false, type: 'button' });

            if (
              additionalMarketplaceRes &&
              additionalMarketplaceRes.status === 200 &&
              additionalMonthlySerRes &&
              additionalMonthlySerRes.status === 200 &&
              additionalOneTimeServRes &&
              additionalOneTimeServRes.status === 200 &&
              contractRes &&
              contractRes.status === 200 &&
              primaryMarketplaceRes &&
              primaryMarketplaceRes.status === 200 &&
              addendumRes &&
              addendumRes.status === 200
            ) {
              // use/access the results
              showFooter(false);
              setUpdatedFormData({});
              dispatch(getAccountDetails(id));
            }

            if (
              additionalMarketplaceRes &&
              additionalMarketplaceRes.status === 200
            ) {
              if (updatedFormData && updatedFormData.additional_marketplaces) {
                delete updatedFormData.additional_marketplaces;
              }
              if (
                !(
                  formData &&
                  formData.additional_marketplace &&
                  formData.additional_marketplace.length
                )
              ) {
                setShowAdditionalMarketplace(false);
              }
            }
            if (
              additionalMonthlySerRes &&
              additionalMonthlySerRes.status === 200
            ) {
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
              if (
                updatedFormData &&
                updatedFormData.additional_one_time_services
              ) {
                delete updatedFormData.additional_one_time_services;
                setAmazonStoreCustom(false);
              }
            }
            if (
              (primaryMarketplaceRes && primaryMarketplaceRes.status === 200) ||
              (primaryMarketplaceRes && primaryMarketplaceRes.status === 201)
            ) {
              if (updatedFormData && updatedFormData.primary_marketplace) {
                delete updatedFormData.primary_marketplace;
              }
            }

            if (
              (addendumRes && addendumRes.status === 200) ||
              (addendumRes && addendumRes.status === 201)
            ) {
              if (addendumRes && addendumRes.status === 201) {
                setNewAddendum(addendumRes && addendumRes.data);
              }
              setOriginalAddendumData(addendumRes && addendumRes.data);
              setShowEditor(false);
              if (updatedFormData && updatedFormData.addendum) {
                delete updatedFormData.addendum;
              }
            }

            if (contractRes && contractRes.status === 200) {
              const updatedKeys = Object.keys(updatedFormData);
              if (updatedKeys && updatedKeys.length) {
                const fieldsToDeleteList = updatedKeys
                  .filter((item) => item !== 'additional_one_time_services')
                  .filter((item) => item !== 'additional_monthly_services')
                  .filter((item) => item !== 'additional_marketplaces')
                  .filter((item) => item !== 'primary_marketplace')
                  .filter((item) => item !== 'addendum');
                // fieldsToDeleteList.map(item => delete updatedFormData.item)
                for (const item of fieldsToDeleteList) {
                  delete updatedFormData[item];
                }
              }
            }

            if (!Object.keys(updatedFormData).length) {
              showFooter(false);
              dispatch(getAccountDetails(id));
            }
            setUpdatedFormData({ ...updatedFormData });

            if (
              additionalMarketplaceRes &&
              additionalMarketplaceRes.status === 400
            ) {
              setAdditionalMarketplaceError({
                ...additionalMarketplaceError,
                ...additionalMarketplaceRes.data,
              });
            }
            if (
              additionalMonthlySerRes &&
              additionalMonthlySerRes.status === 400
            ) {
              setAdditionalMonthlySerError({
                ...additionalMonthlySerError,
                ...additionalMonthlySerRes.data,
              });
            }
            if (
              additionalOneTimeServRes &&
              additionalOneTimeServRes.status === 400
            ) {
              setAdditionalOnetimeSerError({
                ...additionalOnetimeSerError,
                ...additionalOneTimeServRes.data,
              });

              if (
                additionalOneTimeServRes &&
                additionalOneTimeServRes.data &&
                Object.values(additionalOneTimeServRes.data) &&
                Object.values(additionalOneTimeServRes.data).length &&
                Object.values(additionalOneTimeServRes.data)[0] ===
                  'Object does not exists'
              ) {
                showFooter(false);
                setUpdatedFormData({});
                dispatch(getAccountDetails(id));
              }
            }
            if (contractRes && contractRes.status === 400) {
              setContractError({
                ...contractError,
                ...contractRes.data,
              });
            }
            if (primaryMarketplaceRes && primaryMarketplaceRes.status === 400) {
              setApiError({
                ...apiError,
                ...(primaryMarketplaceRes && primaryMarketplaceRes.data),
              });
            }
          }),
        )
        .catch({
          // console.log("error")
        });

      //  .then((response) => {
      //     if (response && response.status === 400) {
      //       setIsLoading({ loader: false, type: 'button' });
      //       setApiError(response && response.data);
      //       // setFormData({});
      //     } else if (response && response.status === 200) {
      //       setTimeout(() => dispatch(getAccountDetails(id)), 800);
      //       setIsLoading({ loader: false, type: 'button' });
      //       setFormData(response && response.data);
      //       setUpdatedFormData({});
      //     }
      //   });
    } else {
      const stepsCompletedData = {
        steps_completed: {
          ...details.steps_completed,
          agreement: true,
          statement: true,
        },
      };
      setIsLoading({ loader: true, type: 'button' });

      updateAccountDetails(details.id, stepsCompletedData).then((response) => {
        setIsLoading({ loader: false, type: 'button' });

        if (response && response.status === 200) {
          dispatch(getAccountDetails(id));
        }
      });
    }

    // }
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
      if (showDiscardModal.clickedBtn === 'back') {
        // console.log("!!!")
      }
    }

    if (flag === 'Yes') {
      setShowDiscardModal({ ...showDiscardModal, show: false, clickedBtn: '' });
      setUpdatedFormData({});
      if (showDiscardModal.clickedBtn === 'back') {
        history.push(PATH_CUSTOMER_DETAILS.replace(':id', id));
      }

      // setFormData({});
      showFooter(false);
      setShowEditor(false);
      setStartDate('');
      setNewAddendum(originalAddendumData);
      clearError();
      setShowAmazonPlanDropdown(false);
      setAmazonStoreCustom(false);

      // if (openCollapse.agreement) {
      //   executeScroll('agreement');
      // }
      // if (openCollapse.statement) {
      //   executeScroll('statement');
      // }
      // if (openCollapse.dspAddendum) {
      //   executeScroll('dspAddendum');
      // }
      // if (openCollapse.addendum) {
      //   executeScroll('addendum');
      // }

      if (
        details &&
        details.additional_marketplaces &&
        details.additional_marketplaces.length
      ) {
        setShowAdditionalMarketplace(true);
      } else {
        setShowAdditionalMarketplace(false);
      }
      dispatch(getAccountDetails(id));
    }
  };

  const calculateTotalDays = () => {
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
    return firstMonthdays + extraDays + secondMonthdays + thirdMonthdays;
  };

  const mapDefaultValues = (key, label, type) => {
    // console.log(key, label, type, details && details[key]);

    if (key === 'contract_company_name') {
      return details && details[key] ? details && details[key] : `Client Name`;
    }

    // if (key === 'contract_company_name') {
    //   return details && details[key]
    //     ? details && details[key]
    //     : `Enter ${label}.`;
    // }
    if (key === 'length' && label === 'Initial Period') {
      return (
        formData &&
        formData.length &&
        formData.length.label &&
        parseInt(formData.length.label, 10)
      );
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
    if (key === 'calculated_no_of_days') {
      return calculateTotalDays();
    }

    if (key === 'address') {
      if (
        details &&
        details.address === '' &&
        details &&
        details.state === '' &&
        details &&
        details.city === '' &&
        details &&
        details.zip_code === ''
      ) {
        return `Enter Location`;
      }
      return `${details && details.address}${
        details && details.address ? ',' : ''
      }
      ${details && details.state}${details && details.state ? ',' : ''}
      ${details && details.city}${details && details.city ? ',' : ''}
      ${details && details.zip_code}
      `;
    }
    const result =
      key === 'rev_share' || key === 'seller_type'
        ? details && details[key] && details[key].label
        : details && details[key];

    if (details[key] === undefined || details[key] === '') {
      return `Enter ${label}`;
    }

    if (type && type.includes('number')) {
      return `${type === 'number-currency' ? '$' : '%'}${
        details && details[key]
          ? details[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : ''
      }`;
    }

    // console.log(result);
    return result;
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
              item.service.name !== 'DSP Advertising' &&
              item.service.name !== 'Inventory Reconciliation'
            ) {
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
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} /month
                               </td>`
                     : `<td style="border: 1px solid black;padding: 13px;">Yet to save</td>`
                   : item && item.service && item.service.fee
                   ? `<td style="border: 1px solid black;padding: 13px;">
                           $${(item && item.service && item.service.fee
                             ? item.service.fee
                             : ''
                           )
                             .toString()
                             .replace(
                               /\B(?=(\d{3})+(?!\d))/g,
                               ',',
                             )} /month </td>`
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
      return `$${
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
    return `$${(market + month)
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
          ${dayjs(firstMonthDate).format('MM-DD-YYYY')}
        </td>
        <td
          style="border: 1px solid black;
    padding: 13px;">
     DSP_FEE
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
    // return (
    if (formData && formData.dsp_fee) {
      return `$${
        formData &&
        formData.dsp_fee &&
        formData.dsp_fee.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }`;
    }
    return 'Enter Dsp Fee ';

    // );
  };

  const mapBudgetBreakdownTable = () => {
    return `
    
    
    <div class="table-responsive">  <table class="contact-list " style="width: 100%;
    border-collapse: collapse;"><tr><th style="text-align: left; border: 1px solid black;
    padding: 13px;">${dayjs(firstMonthDate).format('MMM D, YYYY')} ${
      new Date(firstMonthDate).getDate() !== 1 ? '-' : ''
    } ${
      new Date(firstMonthDate).getDate() !== 1
        ? dayjs(endMonthDate).format('MMM D, YYYY')
        : ''
    } </th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">${dayjs(secondMonthDate).format(
      'MMMM YYYY',
    )}</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">${dayjs(thirdMonthDate).format('MMMM YYYY')} </th></tr>
    <tr>
        <td style="border: 1px solid black;
    padding: 13px;"> ${displayFirstMonthFee()}</td>
        <td
          style="border: 1px solid black;
    padding: 13px;">
               DSP_FEE

        </td><td
          style="border: 1px solid black;
    padding: 13px;">
              DSP_FEE

        </td>
      </tr>
      
      </table></div>`;
  };

  const showRightTick = (section) => {
    if (section === 'service_agreement') {
      if (
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
          formData.rev_share &&
          formData.sales_threshold
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
          formData.primary_marketplace &&
          formData.dsp_fee
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
    const dataToUpdate = {
      contract_status: 'pending contract',
    };
    setIsLoading({ loader: true, type: 'button' });

    updateAccountDetails(details.id, dataToUpdate).then((response) => {
      setIsLoading({ loader: false, type: 'button' });

      if (response && response.status === 200) {
        dispatch(getAccountDetails(id));
      }
    });
  };
  const createAgreementDoc = () => {
    const agreementData = getAgreementAccorType(0)
      .replace(
        'CUSTOMER_NAME',
        mapDefaultValues('contract_company_name', 'Customer Name'),
      )
      .replace('START_DATE', mapDefaultValues('start_date', 'Start Date'))
      .replace('CUSTOMER_ADDRESS', mapDefaultValues('address', 'Address, '))
      // .replace('CUSTOMER_CITY', mapDefaultValues('city', 'City, '))
      // .replace('CUSTOMER_STATE', mapDefaultValues('state', 'State, '))
      // .replace('CUSTOMER_POSTAL', mapDefaultValues('zip_code', 'Postal Code, '))
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
    // }
    const agreementSignatureData = AgreementSign.replace(
      'CUSTOMER_NAME',
      mapDefaultValues('contract_company_name', 'Customer Name'),
    )
      .replaceAll(
        'AGREEMENT_DATE',
        mapDefaultValues('start_date', 'Start Date'),
      )
      .replace('CUSTOMER_ADDRESS', mapDefaultValues('address', 'Address, '))
      // .replace('CUSTOMER_CITY', mapDefaultValues('city', 'City, '))
      // .replace('CUSTOMER_STATE', mapDefaultValues('state', 'State, '))
      // .replace('CUSTOMER_POSTAL', mapDefaultValues('zip_code', 'Postal Code, '))
      .replace('BBE_DATE', mapDefaultValues('current_date', 'Current Date'))
      .replace('THAD_SIGN', mapThadSignImg());

    const statmentData =
      data.statement_of_work &&
      data.statement_of_work[0]
        .replace(
          'CUSTOMER_NAME',
          mapDefaultValues('contract_company_name', 'Customer Name'),
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
          showNotIncludedServicesTable(),
        );

    const dspAddendum =
      showSection && showSection.dspAddendum
        ? data.dsp_addendum &&
          data.dsp_addendum[0]
            .replace(
              'CUSTOMER_NAME',
              mapDefaultValues('contract_company_name', 'Customer Name'),
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
            mapDefaultValues('contract_company_name', 'Customer Name'),
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
          mapDefaultValues('contract_company_name', 'Customer Name'),
        )
        .replaceAll(
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
    )
      .replace('BBE_DATE', mapDefaultValues('current_date', 'Current Date'))
      .replace('THAD_SIGN', mapThadSignImg());

    const finalAgreement = `${agreementData} ${agreementSignatureData} ${
      details && details.contract_type.toLowerCase().includes('one')
        ? ''
        : statmentData
    } ${
      details && details.contract_type.toLowerCase().includes('one')
        ? ''
        : dspAddendum
    } ${
      details && details.contract_type.toLowerCase().includes('one')
        ? ''
        : dspAddendumSignature
    } ${addendumData} ${newAddendumAddedData} ${addendumSignatureData}`;
    setPDFData(finalAgreement);
  };

  const checkApprovalCondition = () => {
    const rev = Number(details && details.rev_share && details.rev_share.value);
    const contractTermLength = parseInt(
      details && details.length && details.length.value,
      10,
    );
    if (details && details.contract_type.toLowerCase().includes('one')) {
      if (
        contractTermLength < 12 &&
        !(userInfo && userInfo.role === 'Team Manager - TAM')
      ) {
        return true;
      }
    } else if (
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

  const onClickOfBackToCustomerDetail = () => {
    if (isFooter) {
      setShowDiscardModal({
        ...showDiscardModal,
        show: true,
        clickedBtn: 'back',
      });
    } else {
      history.push(PATH_CUSTOMER_DETAILS.replace(':id', id));
    }
  };
  return (
    <>
      {loader || (isLoading.loader && isLoading.type === 'page') ? (
        // <div className="page-is-loading">
        //   <div className="loader-outer">
        //     <PageLoader
        //       color="#FF5933"
        //       width={40}
        //       />
        //   </div>
        // </div>
        <PageLoader
          className="modal-loader"
          color="#FF5933"
          type="page"
          width={40}
          component="agreement"
        />
      ) : checkPermission() ? (
        details ? (
          <>
            <div className="success-msg-pop-up contract">
              {showSuccessContact.show ? (
                <SuccessMsg property=" " message={showSuccessContact.message} />
              ) : (
                ''
              )}
            </div>
            <div className="on-boarding-container">
              <div className="row">
                <div className="col-12">
                  <div className="m-0 sticky">
                    {' '}
                    <div
                      onClick={() => onClickOfBackToCustomerDetail()}
                      role="presentation"
                      // to={PATH_CUSTOMER_DETAILS.replace(':id', id)}
                      className="back-link">
                      <img
                        src={LeftArrowIcon}
                        alt="aarow-back"
                        className="arrow-back-icon "
                      />
                      Back to Customer Details
                    </div>
                  </div>
                  <ContractTab className="d-lg-none d-block">
                    <ul className="tabs">
                      <li>Edit Fields</li>
                      <li>View Contract</li>
                    </ul>
                  </ContractTab>
                </div>
              </div>
              <div className="text-container ">
                <div id="agreement">
                  {/* {history.location.pathname.includes('agreement') &&
                  details ? ( */}
                  <Agreement
                    // myRef={myRef}

                    formData={formData}
                    details={details}
                    templateData={data}
                  />
                  {/* ) : (
                    ''
                  )} */}
                </div>

                {details &&
                details.contract_type.toLowerCase().includes('one') ? (
                  ''
                ) : (
                  <div id="statement">
                    <Statement
                      formData={formData}
                      details={details}
                      templateData={data}
                      notIncludedOneTimeServices={notIncludedOneTimeServices}
                      notIncludedMonthlyServices={notIncludedMonthlyServices}
                    />
                  </div>
                )}

                {showSection.dspAddendum ? (
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
                  />
                </div>

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
            </div>
          </>
        ) : (
          ''
        )
      ) : (
        <PageNotFound />
      )}
      {/* {loader ? (
        <div className="page-is-loading">
          <div className="loader-outer">
            <PageLoader  
              color="#FF5933"
              width={40}
              />
          </div>
        </div>
      ) : ( */}
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
        // notIncludedOneTimeServices={notIncludedOneTimeServices}
        // setNotIncludedOneTimeServices={setNotIncludedOneTimeServices}
        notIncludedMonthlyServices={notIncludedMonthlyServices}
        // setNotIncludedMonthlyServices={setNotIncludedMonthlyServices}
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
      />
      {/* )} */}
      {details &&
      details.contract_status &&
      details.contract_status.value === 'pending contract signature' ? (
        <div className="mt-4 pt-5">
          <Footer className=" mt-5 ">
            <Button
              className="btn-primary  sticky-btn-primary sidepanel mt-3 mr-5 on-boarding"
              onClick={() => onEditcontract()}>
              {isLoading.loader && isLoading.type === 'button' ? (
                <PageLoader color="#fff" type="button" />
              ) : (
                'Edit Contract'
              )}
            </Button>
            <Button
              className="light-orange sticky-btn   mt-3 mr-3 on-boarding"
              onClick={() => {
                setParams('send-remainder');
                setShowModal(true);
              }}>
              Send Reminder
            </Button>
            {/* {updatedFormData && Object.keys(updatedFormData).length ? (
              <span>
                {Object.keys(updatedFormData).length} unsaved changes.
              </span>
            ) : (
              ''
            )} */}
          </Footer>
        </div>
      ) : isFooter ||
        (newAddendumData &&
          newAddendumData.id &&
          showEditor &&
          updatedFormData &&
          updatedFormData.addendum) ? (
        <div className="mt-4 pt-5">
          <Footer className=" mt-5">
            <Button
              className={
                formData &&
                formData.additional_one_time_services &&
                formData.additional_one_time_services.length &&
                formData.additional_one_time_services.find(
                  (item) => item.name === 'Amazon Store Package',
                )
                  ? 'light-orange  on-boarding  mt-3 mr-3  '
                  : 'light-orange  on-boarding  mt-3 mr-3 '
              }
              disabled={
                (!(
                  formData &&
                  formData.contract_type &&
                  formData.contract_type.toLowerCase().includes('one')
                ) &&
                  formData &&
                  formData.additional_one_time_services &&
                  formData.additional_one_time_services.length &&
                  formData.additional_one_time_services.find(
                    (item) => item.name === 'Amazon Store Package',
                  )) ||
                !(
                  showRightTick('service_agreement') &&
                  showRightTick('statement') &&
                  showRightTick('dspAddendum')
                )
              }
              onClick={() => nextStep()}>
              {isLoading.loader && isLoading.type === 'button' ? (
                <PageLoader color="#fff" type="button" />
              ) : (
                <>Save Changes</>
              )}
            </Button>

            <Button
              className="btn-borderless contract-btn on-boarding  mt-3 mr-3"
              onClick={() =>
                setShowDiscardModal({
                  ...showDiscardModal,
                  show: true,
                  clickedBtn: 'discard',
                })
              }>
              Discard Changes
            </Button>
            {updatedFormData && Object.keys(updatedFormData).length ? (
              <span>
                {Object.keys(updatedFormData).length} unsaved changes.
              </span>
            ) : (
              ''
            )}
          </Footer>
        </div>
      ) : (
        //  details &&
        //   details.steps_completed &&
        //   details.steps_completed.agreement &&
        //   details.steps_completed.statement ?
        <div className="mt-4 pt-5">
          <Footer>
            {checkApprovalCondition() ? (
              <Button
                className="btn-primary on-boarding mt-3 mr-3  "
                disabled={
                  !(
                    showRightTick('service_agreement') &&
                    showRightTick('statement') &&
                    showRightTick('dspAddendum')
                  )
                }
                onClick={() => {
                  createAgreementDoc();
                  setParams('request-approve');
                  setShowModal(true);
                }}>
                Request Approval
              </Button>
            ) : userInfo && userInfo.role === 'Team Manager - TAM' ? (
              <Button
                className="btn-primary on-boarding w-320 mt-3 mr-3 "
                onClick={() => {
                  createAgreementDoc();
                  setParams('select-contact');
                  setShowModal(true);
                }}>
                Approve and Request Signature
              </Button>
            ) : (
              <Button
                className="btn-primary on-boarding  mt-3 mr-3 "
                disabled={
                  !(
                    showRightTick('service_agreement') &&
                    showRightTick('statement') &&
                    showRightTick('dspAddendum')
                  )
                }
                onClick={() => {
                  createAgreementDoc();
                  setParams('select-contact');
                  setShowModal(true);
                }}>
                Request Signature
              </Button>
            )}
            <span className="last-update">
              Last updated by You on{' '}
              {dayjs(details && details.updated_at).format('MMM D, h:mm A')}
            </span>
          </Footer>
        </div>
      )}

      {/* // : ( // '' // )} */}
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
            setShowSuccessContact={setShowSuccessContact}
            clearSuccessMessage={clearSuccessMessage}
            setOpenCollapse={setOpenCollapse}
          />
        </ModalBox>
      </Modal>
      <Modal
        isOpen={showDiscardModal.show}
        style={customStylesForAlert}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <ModalBox className="small-alert-modal">
          <div className="modal-body">
            <div className="alert-msg ">
              <span>Are you sure you want to discard all the changes?</span>
            </div>
            <div className="text-center mb-3">
              <Button
                onClick={() => discardAgreementChanges('No')}
                type="button"
                className="btn-primary on-boarding  mr-3">
                Keep Editing
              </Button>
              <Button
                onClick={() => discardAgreementChanges('Yes')}
                type="button"
                className=" btn-transparent w-50 on-boarding">
                Discard Changes
              </Button>

              {/* </Link> */}
            </div>
          </div>
        </ModalBox>
      </Modal>
    </>
  );
}

const Footer = styled.div`
  border: 1px solid ${Theme.gray7};
  bottom: 0;
  width: 100%;
  background: ${Theme.white};
  box-shadow: ${Theme.boxShadow};
  position: fixed;
  min-height: 80px;
  padding-left: 90px;
  z-index: 2;
  .w-320 {
    float: left;
    max-width: 320px;
    width: 100%;
  }

  .last-update {
    margin-top: 30px;
    color: ${Theme.gray40};
    margin-left: 20px;
    font-size: ${Theme.extraNormal};
  }

  @media only screen and (max-width: 540px) {
    padding-left: 20px;
  }
`;

const ContractTab = styled.div`
  background: #fafafb;
  padding-top: 60px;
  position: fixed;
  width: 100%;

  .tabs {
    padding: 0;
    margin: 0;
    list-style-type: none;
    border-bottom: 1px solid ${Theme.gray5};

    li {
      display: inline-block;
      color: #000000;
      font-size: 15px;
      padding: 20px 40px;
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        padding-bottom: 18px;
        border-bottom: 2px solid ${Theme.orange};
        color: ${Theme.black};
        font-family: ${Theme.titleFontFamily};
      }

      &.active {
        padding-bottom: 18px;
        border-bottom: 2px solid ${Theme.orange};
        color: ${Theme.black};
        font-family: ${Theme.titleFontFamily};
      }
    }
  }
`;
