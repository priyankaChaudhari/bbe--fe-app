/* eslint no-param-reassign: "error" */
/* eslint consistent-return: "error" */

import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
// import { Document, Page } from 'react-pdf/dist/entry.webpack';
// import 'react-pdf/dist/Page/AnnotationLayer.css';

import styled from 'styled-components';
import Modal from 'react-modal';
import queryString from 'query-string';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import PdfViewer from '../../common/PdfViewer';
// import samplePDF from './sample1.pdf';
import Theme from '../../theme/Theme';

import AgreementSidePanel from '../../common/AgreementSidePanel';
import Agreement from './Agreement';
import ServicesAmendment from './ServicesAmendment';
import DSPAddendum from './DSPAddendum';
import Addendum from './Addendum';
import Statement from './Statement';
import Discount from './Discount';
import {
  PageLoader,
  // PageNotFound,
  // SuccessMsg,
  Button,
  ModalBox,
} from '../../common';
// import { getAccountDetails } from '../../store/actions/accountState';
import { agreementTemplate, getcontract } from '../../api/AgreementApi';
import RequestSignature from './RequestSignature';
import { CloseIcon, LeftArrowIcon, InfoIcon } from '../../theme/images';
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
  getMarketplaces,
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
    // minHeight: '200px',
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
  const id = location.pathname.split('/')[2];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [updatedFormData, setUpdatedFormData] = useState({});
  // const details = useSelector((state) => state.accountState.data);
  // const loader = useSelector((state) => state.accountState.isLoading);
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
  const [contractError, setContractError] = useState({});
  const [showAdditionalMarketplace, setShowAdditionalMarketplace] = useState(
    false,
  );
  // const [showSuccessContact, setShowSuccessContact] = useState({
  //   show: false,
  //   message: '',
  // });

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
  const [loaderFlag, setLoaderFlag] = useState(true);
  const [calculatedDate, setCalculatedDate] = useState(null);
  const [firstMonthDate, setFirstMonthDate] = useState(null);
  const [secondMonthDate, setSecondMonthDate] = useState(null);
  const [thirdMonthDate, setThirdMonthDate] = useState(null);
  const [endMonthDate, setEndDate] = useState(null);
  const [tabInResponsive, setShowtabInResponsive] = useState('view-contract');
  const [discountFlag, setDiscountFlag] = useState('');
  const [contractID, setContractID] = useState('');
  const [marketPlaces, setMarketPlaces] = useState([]);
  const [additionalMarketplaces, setAdditionalMarketplaces] = useState([]);
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const executeScroll = (eleId) => {
    const element = document.getElementById(eleId);
    // if (eleId !== 'addendum') {

    const offset = isDesktop ? -150 : isMobile ? -220 : -220;
    const y =
      element &&
      element.getBoundingClientRect() &&
      element.getBoundingClientRect().top + window.pageYOffset + offset;

    window.scrollTo({ top: y });
  };

  // const clearSuccessMessage = () => {
  //   setShowSuccessContact({ show: false, message: '' });
  // };

  if (contractID === '' && contractID !== undefined) {
    setContractID(location.state);
  }

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

  const getContractDetails = () => {
    setIsLoading({ loader: true, type: 'page' });
    if (contractID || localStorage.getItem('agreementID')) {
      getcontract(contractID || localStorage.getItem('agreementID')).then(
        (res) => {
          // setIsLoading({ loader: false, type: 'page' });
          setLoaderFlag(true);
          if (res && res.status === 200) {
            setDetails(res && res.data);
          }
        },
      );
    } else {
      const path = location.pathname.slice(
        0,
        location.pathname.lastIndexOf('/'),
      );
      history.push(path);
    }
  };

  useEffect(() => {
    // dispatch(getAccountDetails(id));

    agreementTemplate().then((response) => {
      // setIsLoading({ loader: true, type: 'page' });
      setData(
        response &&
          response.data &&
          response.data.results &&
          response.data.results[0],
      );
      getContractDetails();

      // setIsLoading({ loader: false, type: 'page' });
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

    getMarketplaces().then((market) => {
      setMarketPlaces(market.data);
      setAdditionalMarketplaces(market.data);
      setMarketplacesResult(market.data);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  useEffect(() => {
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
        delete: [],
      });
    } else {
      setAdditionalOnetimeServices({
        create: [],
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

    if (details && details.contract_type === 'dsp only') {
      setShowCollpase({ ...showSection, dspAddendum: true });
    }
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

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

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

  const updateMarketplaces = async () => {
    let flag = false;
    const result = await createMarketplaceBulk(
      updatedFormData.additional_marketplaces,
    ).then(() => {
      flag = true;
    });
    if (flag) {
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
        await updateMarketplace(
          details.primary_marketplace.id,
          statementData,
        ).then((updateMarketplaceRes) => {
          if (updateMarketplaceRes && updateMarketplaceRes.status === 200) {
            if (updatedFormData && updatedFormData.primary_marketplace) {
              delete updatedFormData.primary_marketplace;
              // setUpdatedFormData({ ...updatedFormData });
              // if (!Object.keys(updatedFormData).length) {
              //   showFooter(false);
              //   setIsEditContract(false);
              //   getContractDetails();
              // }
            }
          }
        });
      } else {
        createMarketplace(statementData).then((createMarketplaceRes) => {
          setIsLoading({ loader: false, type: 'button' });
          if (createMarketplaceRes && createMarketplaceRes.status === 201) {
            if (updatedFormData && updatedFormData.primary_marketplace) {
              delete updatedFormData.primary_marketplace;
            }
          }
        });
      }
      setUpdatedFormData({ ...updatedFormData });
    }
    return result;
  };

  const saveChanges = (apis) => {
    axios
      .all(apis)
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
            setIsEditContract(false);
            setUpdatedFormData({});
            // dispatch(getAccountDetails(id));
            getContractDetails();
            setIsEditContract(false);
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
            setIsEditContract(false);
            // dispatch(getAccountDetails(id));
            getContractDetails();
          }
          setUpdatedFormData({ ...updatedFormData });

          let agreementErrCount = 0;
          let statementErrCount = 0;
          let dspErrCount = 0;

          if (
            (additionalMarketplaceRes &&
              additionalMarketplaceRes.status === 400) ||
            (additionalMonthlySerRes &&
              additionalMonthlySerRes.status === 400) ||
            (additionalOneTimeServRes &&
              additionalOneTimeServRes.status === 400) ||
            (contractRes && contractRes.status === 400) ||
            (primaryMarketplaceRes && primaryMarketplaceRes.status === 400)
          ) {
            toast.error(
              'Changes have not been saved. Please fix errors and try again',
            );
          }
          if (
            additionalMarketplaceRes &&
            additionalMarketplaceRes.status === 400
          ) {
            setAdditionalMarketplaceError({
              ...additionalMarketplaceError,
              ...additionalMarketplaceRes.data,
            });

            if (additionalMarketplaceRes.data) {
              statementErrCount += Object.keys(additionalMarketplaceRes.data)
                .length;
            }
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
              // dispatch(getAccountDetails(id));
              getContractDetails();
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
                if (
                  Object.keys(contractRes.data).includes('zip_code') &&
                  !contractError.zip_code
                )
                  agreementErrCount += 1;
                if (
                  Object.keys(contractRes.data).includes('dsp_fee') &&
                  !contractError.dsp_fee
                )
                  dspErrCount += 1;
              }
            }
          }
          if (primaryMarketplaceRes && primaryMarketplaceRes.status === 400) {
            setApiError({
              ...apiError,
              ...(primaryMarketplaceRes && primaryMarketplaceRes.data),
            });

            if (primaryMarketplaceRes.data && !apiError.non_field_errors) {
              statementErrCount += Object.keys(primaryMarketplaceRes.data)
                .length;
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
  };

  const nextStep = async () => {
    // if (history.location.pathname.includes('agreement')) {

    // setSectionError({});

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
          if (
            !(
              updatedFormData &&
              updatedFormData.primary_marketplace &&
              updatedFormData.additional_marketplaces
            )
          ) {
            primaryMarketPlaceApi = updateMarketplace(
              details.primary_marketplace.id,
              statementData,
            );
          }
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
        // steps_completed: {
        //   ...details.steps_completed,
        //   agreement: true,
        //   statement: true,
        // },
      };

      AccountApi = updateAccountDetails(details.id, detail);

      if (newAddendumData && newAddendumData.id) {
        //  setIsLoading({ loader: true, type: 'page' });

        AddendumApi = updateAddendum(newAddendumData.id, {
          addendum: newAddendumData && newAddendumData.addendum,
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

      let apis = [
        additionalMarketplacesApi,
        additionalMonthlyApi,
        additionalOneTimeApi,
        AccountApi,
        primaryMarketPlaceApi,
        AddendumApi,
      ];

      if (
        updatedFormData &&
        updatedFormData.primary_marketplace &&
        updatedFormData.additional_marketplaces
      ) {
        setIsLoading({ loader: true, type: 'button' });

        apis = [
          null,
          additionalMonthlyApi,
          additionalOneTimeApi,
          AccountApi,
          null,
          AddendumApi,
        ];

        await updateMarketplaces();
      }
      saveChanges(apis);
      // if (
      //   updatedFormData &&
      //   updatedFormData.primary_marketplace &&
      //   updatedFormData.additional_marketplaces
      // ) {
      //   setTimeout(() => saveChanges(apis), 30000);
      // } else {
      //   saveChanges(apis);
      // }

      // else {
      //   const stepsCompletedData = {
      //     steps_completed: {
      //       ...details.steps_completed,
      //       agreement: true,
      //       statement: true,
      //     },
      //   };
      //   setIsLoading({ loader: true, type: 'button' });

      //   updateAccountDetails(details.id, stepsCompletedData).then((response) => {
      //     setIsLoading({ loader: false, type: 'button' });

      //     if (response && response.status === 200) {
      //       // dispatch(getAccountDetails(id));
      //       getContractDetails();
      //     }
      //   });
      // }

      // }
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
      // if (showDiscardModal.clickedBtn === 'back') {
      // }
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

      // setMarketplacesResult(marketplacesResult)

      // if (
      //   details &&
      //   details.primary_marketplace &&
      //   details.primary_marketplace.name
      // ) {
      //   setAdditionalMarketplaces(
      //     marketPlaces.filter(
      //       (op) => op.value !== details.primary_marketplace.name,
      //     ),
      //   );
      // } else {
      //   setAdditionalMarketplaces(marketPlaces);
      // }

      // if (details && details.additional_marketplaces) {
      //   setMarketPlaces(
      //     additionalMarketplaces.filter(
      //       (choice) =>
      //         !(details && details.additional_marketplaces).some(
      //           (item) => item.name === choice.value,
      //         ),
      //     ),
      //   );
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
      // dispatch(getAccountDetails(id));
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
      setIsLoading({ loader: true, type: 'button' });

      updateAccountDetails(details.id, dataToUpdate).then((response) => {
        setIsLoading({ loader: false, type: 'button' });

        if (response && response.status === 200) {
          // dispatch(getAccountDetails(id));
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
    // return firstMonthdays + extraDays + secondMonthdays + thirdMonthdays;
  };

  const mapDefaultValues = (key, label, type) => {
    if (key === 'contract_company_name') {
      return details && details[key] ? details && details[key] : `Client Name`;
    }

    // if (key === 'contract_company_name') {
    //   return details && details[key]
    //     ? details && details[key]
    //     : `Enter ${label}.`;
    // }
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
      return details && dayjs(details[key]).format('MM / DD / YYYY');
    }
    if (key === 'current_date') {
      return dayjs(Date()).format('MM / DD / YYYY');
    }
    if (key === 'calculated_no_of_days') {
      return calculateTotalDays();
    }

    if (key === 'address') {
      if (
        ((formData && formData.address === '') ||
          (formData && formData.address === null)) &&
        ((formData && formData.state === '') ||
          (formData && formData.state === null)) &&
        ((formData && formData.city === '') ||
          (formData && formData.city === null)) &&
        ((formData && formData.zip_code === '') ||
          (formData && formData.zip_code === null))
      ) {
        return `Enter Location`;
      }
      return `${details && details.address ? details && details.address : ''}${
        details &&
        details.address &&
        ((details && details.state) ||
          (details && details.city) ||
          (details && details.zip_code))
          ? ','
          : ''
      }
      ${details && details.city ? details && details.city : ''}${
        details &&
        details.city &&
        (details.state || (details && details.zip_code))
          ? ','
          : ''
      }
      ${details && details.state ? details && details.state : ''}${
        details && details.state && details && details.zip_code ? ',' : ''
      }
      
      ${details && details.zip_code ? details && details.zip_code : ''}
      `;
    }
    const result =
      key === 'rev_share' || key === 'seller_type'
        ? details && details[key] && details[key].label
        : details && details[key];

    if (details[key] === undefined || details[key] === '') {
      if (label === 'Dsp Fee') {
        return `Enter DSP Fee`;
      }
      return `Enter ${label}`;
    }

    if (type && type.includes('number')) {
      return `${type === 'number-currency' ? '$' : '%'}${
        details && details[key]
          ? details[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : ''
      }`;
    }
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
    padding: 13px;"> <span style=" background:#ffe5df;padding: 4px 9px;"> REVENUE_SHARE</span> </td><td style="border: 1px solid black;
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
    padding: 13px;"> <span style=" background:#ffe5df;padding: 4px 9px;"> REVENUE_SHARE</span></td></tr></table>`;
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
              item &&
              item.service &&
              item.service.name !== 'DSP Advertising' &&
              item &&
              item.service &&
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
      // return null;

      // return fields.length ? fields.toString().replaceAll(',', '') : '';
      return fields.length ? fields.toString().replaceAll('>,<', '><') : '';
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

    // return fields.length ? fields.toString().replaceAll(',', '') : '';
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
        details && details.total_fee.onetime_service_after_discount
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
    return 'Enter DSP Fee ';

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
          // &&
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
    // const dataToUpdate = {
    //   contract_status: 'pending contract',
    // };
    // setIsLoading({ loader: true, type: 'button' });

    // updateAccountDetails(details.id, dataToUpdate).then((response) => {
    //   setIsLoading({ loader: false, type: 'button' });

    //   if (response && response.status === 200) {
    //     // dispatch(getAccountDetails(id));
    //     getContractDetails();
    //     setIsEditContract(true);
    //   }
    // });
  };

  const showStandardServicesTable = () => {
    return `
   <div class="table-responsive"><table class=" contact-list " style="width: 100%; overflow:auto;
    border-collapse: collapse;"><tr><th colspan="3" style="text-align: left; border: 1px solid black;
    padding: 13px;  ">Service Components</th></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Expert Strategy and Consultation (AGS)</td><td style="border: 1px solid black;
    padding: 13px;">Strategic Plan (Audit, SWOT Analysis, Critical Issues)</td><td style="border: 1px solid black;
    padding: 13px;">Weekly Call</td></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Listing Optimization - Content <br> <span style="font-weight: 800;"> ASIN&rsquo;s per month: <span style=" background: #ffe5df;padding: 4px 9px;"> ${
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
    const serviceData = getAgreementAccorType(0);
    const agreementData =
      serviceData &&
      serviceData
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
        .replace('ONE_TIME_SERVICE_TABLE', showOneTimeTable())
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
        .replace('MAP_STANDARD_SERVICE_TABLE', showStandardServicesTable())
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
        ? newAddendumAddedData.length <= 7
          ? ''
          : addendumData + newAddendumAddedData + addendumSignatureData
        : ''
    } `;

    setPDFData(finalAgreement);
  };

  const checkApprovalCondition = () => {
    const rev = Number(details && details.rev_share && details.rev_share.value);
    const dspFee = Number(details && details.dsp_fee);
    const contractTermLength = parseInt(
      details && details.length && details.length.value,
      10,
    );
    // if (
    //   details &&
    //   details.contract_type &&
    //   details.contract_type.toLowerCase().includes('one')
    // ) {
    //   if (
    //     contractTermLength < 12
    //     // &&
    //     // !(userInfo && userInfo.role === 'Team Manager - TAM')
    //   ) {
    //     return true;
    //   }
    // } else
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
      // state: `${location.state}`
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

  const viewContract = () => {
    return (
      <div className="text-container ">
        <div id="agreement">
          <Agreement
            formData={formData}
            details={details}
            templateData={data}
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
          if (item.isMandatory && !(formData && formData[item.key])) {
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
              !(formData && formData[subItem.key])
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
          // ||
          // formData.dsp_fee && formData.dsp_fee < 10000
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
        // className={`${btnClass} on-boarding  mt-3  `}
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
      />
    );
  };

  const displayFooter = () => {
    return details &&
      details.contract_status &&
      details.contract_status.value === 'pending contract signature' ? (
      <div className="mt-4 pt-5">
        <Footer className=" mt-5 ">
          <div className="container-fluid ">
            <Button
              // className="btn-primary  sticky-btn-primary sidepanel mt-3 mr-5  on-boarding w-sm-50"
              className={`btn-primary sticky-btn-primary sidepanel mt-3  ${
                isEditContract ? 'w-sm-100 ml-0 mr-0' : 'w-sm-50 ml-0'
              }`}
              onClick={() => onEditcontract()}>
              {isLoading.loader && isLoading.type === 'button' ? (
                <PageLoader color="#fff" type="button" />
              ) : (
                'Edit Contract'
              )}
            </Button>
            {details &&
            details.contract_status &&
            details.contract_status.value &&
            details.contract_status.value === 'pending contract signature' ? (
              <Button
                className="light-orange sticky-btn   mt-3 mr-0 ml-5  on-boarding w-sm-50"
                onClick={() => {
                  setParams('send-remainder');
                  setShowModal(true);
                }}>
                Send Reminder
              </Button>
            ) : (
              ''
            )}
          </div>
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
          <div className="container-fluid">
            <Button
              className={
                formData &&
                formData.additional_one_time_services &&
                formData.additional_one_time_services.length &&
                formData.additional_one_time_services.find(
                  (item) => item.name === 'Amazon Store Package',
                )
                  ? 'light-orange  on-boarding  mt-3 mr-0  ml-0 w-sm-50 '
                  : 'light-orange  on-boarding  mt-3  mr-0 ml-0 w-sm-50'
              }
              disabled={
                formData &&
                formData.additional_one_time_services &&
                formData.additional_one_time_services.length &&
                formData.additional_one_time_services.find(
                  (item) => item.name === 'Amazon Store Package',
                )
                //   ||
                // (newAddendumData &&
                //   newAddendumData.addendum &&
                //   newAddendumData.addendum) ===
                //   `<p></p>
                //   `
              }
              onClick={() => nextStep()}>
              {isLoading.loader && isLoading.type === 'button' ? (
                <PageLoader color="#fff" type="button" />
              ) : (
                <>Save Changes</>
              )}
            </Button>

            <Button
              className="btn-borderless contract-btn on-boarding  mt-3  w-sm-50 ml-5"
              // className={`btn-primary sticky-btn-primary sidepanel mt-3 mr-5 ${
              //   isEditContract ? 'w-sm-100' : 'w-sm-50'
              // }`}
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
              <span className="unsave-changes">
                {Object.keys(updatedFormData).length} unsaved changes.
              </span>
            ) : (
              ''
            )}
          </div>
        </Footer>
      </div>
    ) : (
      <div className="mt-4 pt-5">
        <Footer>
          <div className="container-fluid">
            {checkApprovalCondition() ? (
              userInfo && userInfo.role === 'Team Manager - TAM' ? (
                showRightTick('service_agreement') &&
                showRightTick('statement') &&
                showRightTick('dspAddendum') ? (
                  <>
                    <Button
                      className={`btn-primary on-boarding  w-320 mt-3 ml-0 ${
                        isEditContract ? 'w-sm-100' : 'w-sm-50'
                      }`}
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
                        setIsEditContract(false);
                      }}>
                      Approve and Request Signature
                    </Button>
                    {!isEditContract
                      ? renderEditContractBtn('light-orange w-sm-50 ml-5')
                      : null}
                    <span className="last-update ">
                      Last updated by You on{' '}
                      {dayjs(details && details.updated_at).format(
                        'MMM D, h:mm A',
                      )}
                    </span>
                  </>
                ) : !isEditContract ? (
                  <>
                    {renderEditContractBtn('btn-primary')}

                    <span className="last-update">
                      <img src={InfoIcon} alt="info" className="info-icon" />
                      This contract is missing mandatory information.
                    </span>
                  </>
                ) : (
                  <Button
                    className={`btn-primary on-boarding  w-320 mt-3 ml-0 ${
                      isEditContract ? 'w-sm-100' : 'w-sm-50'
                    }`}
                    disabled>
                    Approve and Request Signature
                  </Button>
                )
              ) : showRightTick('service_agreement') &&
                showRightTick('statement') &&
                showRightTick('dspAddendum') ? (
                <>
                  <Button
                    className={`btn-primary on-boarding mt-3  ${
                      isEditContract ? 'w-sm-100' : 'w-sm-50 ml-0'
                    }`}
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
                  {!isEditContract
                    ? renderEditContractBtn('light-orange w-sm-50 ml-5')
                    : null}
                  <span className="last-update  ">
                    Last updated by You on{' '}
                    {dayjs(details && details.updated_at).format(
                      'MMM D, h:mm A',
                    )}
                  </span>
                </>
              ) : !isEditContract ? (
                <>
                  {renderEditContractBtn('btn-primary')}

                  <span className="last-update">
                    <img src={InfoIcon} alt="info" className="info-icon" />
                    This contract is missing mandatory information.
                  </span>
                </>
              ) : (
                <Button
                  className="btn-primary on-boarding  mt-3 mr-4 w-sm-100"
                  disabled>
                  Request Approval
                </Button>
              )
            ) : showRightTick('service_agreement') &&
              showRightTick('statement') &&
              showRightTick('dspAddendum') ? (
              <>
                <Button
                  // className="btn-primary on-boarding  mt-3 mr-5 w-sm-50"
                  className={`btn-primary on-boarding mt-3 ml-0 ${
                    isEditContract ? 'w-sm-100 ' : 'w-sm-50 '
                  }`}
                  onClick={() => {
                    createAgreementDoc();
                    setParams('select-contact');
                    setShowModal(true);
                    setIsEditContract(false);
                  }}>
                  Request Signature
                </Button>
                {!isEditContract
                  ? renderEditContractBtn('light-orange w-sm-50 ml-5')
                  : null}
                <span className="last-update">
                  Last updated by You on{' '}
                  {dayjs(details && details.updated_at).format('MMM D, h:mm A')}
                </span>
              </>
            ) : !isEditContract ? (
              <>
                {renderEditContractBtn('btn-primary w-sm-100')}

                <span className="last-update">
                  <img src={InfoIcon} alt="info" className="info-icon" />
                  This contract is missing mandatory information.
                </span>
              </>
            ) : (
              <Button
                className="btn-primary on-boarding  mt-3 mr-5 w-sm-100"
                disabled>
                Request Signature
              </Button>
            )}
          </div>
        </Footer>
      </div>
    );
  };

  const closeDiscountModal = () => {
    getContractDetails();
    setShowDiscountModal(false);
  };

  return (details &&
    details.contract_status &&
    details.contract_status.value === 'pending account setup') ||
    (details &&
      details.contract_status &&
      details.contract_status.value === 'active') ? (
    <>
      <ContractTab className="d-lg-none d-block">
        <ul className="tabs">
          <li
            className={tabInResponsive === 'view-contract' ? 'active' : ''}
            role="presentation"
            onClick={() => showTabInResponsive('view-contract')}>
            View Contract
          </li>
          {/* {formData &&
          formData.contract_status &&
          formData.contract_status.value === 'pending contract signature' ? (
            '' */}

          <li
            className={tabInResponsive === 'edit-fields' ? 'active' : ''}
            role="presentation"
            onClick={() => showTabInResponsive('edit-fields')}>
            {isEditContract ? 'Edit Fields' : 'Activity'}
          </li>
          {/* )} */}
        </ul>
      </ContractTab>
      <div className="on-boarding-container">
        <div className="row">
          <div className="col-12">
            <div className="m-0 sticky">
              {' '}
              <div
                onClick={() => onClickOfBackToCustomerDetail()}
                role="presentation"
                className="back-link">
                <img
                  src={LeftArrowIcon}
                  alt="aarow-back"
                  className="arrow-back-icon "
                />
                Back to Customer Details
              </div>
            </div>
          </div>
        </div>
        {isDesktop ||
        (isTablet && tabInResponsive === 'view-contract') ||
        (isMobile && tabInResponsive === 'view-contract') ? (
          <PdfViewer pdf={details && details.contract_url} />
        ) : (
          ''
        )}
        {isDesktop ||
        (isTablet && tabInResponsive === 'edit-fields') ||
        (isMobile && tabInResponsive === 'edit-fields')
          ? displayRightSidePanel()
          : ''}
      </div>
    </>
  ) : (
    <>
      {/* {setMandatoryFieldsErrors()} */}
      {/* <ToastContainer position="top-center" autoClose={8000} /> */}
      <ContractTab className="d-lg-none d-block">
        <ul className="tabs">
          <li
            className={tabInResponsive === 'view-contract' ? 'active' : ''}
            role="presentation"
            onClick={() => showTabInResponsive('view-contract')}>
            View Contract
          </li>
          {/* {formData &&
          formData.contract_status &&
          formData.contract_status.value === 'pending contract signature' ? (
            '' */}

          <li
            className={tabInResponsive === 'edit-fields' ? 'active' : ''}
            role="presentation"
            onClick={() => showTabInResponsive('edit-fields')}>
            {isEditContract ? 'Edit Fields' : 'Activity'}
          </li>
          {/* )} */}
        </ul>
      </ContractTab>
      {/* <div className="success-msg-pop-up contract">
        {showSuccessContact.show ? (
          <SuccessMsg property=" " message={showSuccessContact.message} />
        ) : (
          ''
        )}
      </div> */}
      {/* <div className="success-msg-pop-up contract">
        {showErrorMsg.show ? (
          <SuccessMsg property=" " message={showErrorMsg.message} />
        ) : (
          ''
        )}
      </div> */}
      <div className="on-boarding-container">
        <div className="row">
          <div className="col-12">
            <div className="m-0 sticky">
              {' '}
              <div
                onClick={() => onClickOfBackToCustomerDetail()}
                role="presentation"
                className="back-link">
                <img
                  src={LeftArrowIcon}
                  alt="aarow-back"
                  className="arrow-back-icon "
                />
                Back to Customer Details
              </div>
            </div>
          </div>
        </div>
        {isDesktop ||
        (isTablet && tabInResponsive === 'view-contract') ||
        (isMobile && tabInResponsive === 'view-contract') ? (
          isLoading.loader && isLoading.type === 'page' ? (
            <PageLoader
              className="modal-loader"
              color="#FF5933"
              type="page"
              width={40}
              component="agreement"
            />
          ) : details && details.id ? (
            viewContract()
          ) : (
            ''
          )
        ) : (
          ''
        )}
      </div>
      {isDesktop ||
      (isTablet && tabInResponsive === 'edit-fields') ||
      (isMobile && tabInResponsive === 'edit-fields')
        ? displayRightSidePanel()
        : ''}
      {details && details.id ? displayFooter() : null}
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
            // setShowSuccessContact={setShowSuccessContact}
            // clearSuccessMessage={clearSuccessMessage}
            setOpenCollapse={setOpenCollapse}
            getContractDetails={getContractDetails}
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
            getContractDetails={getContractDetails}
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
  padding-left: 78px;
  z-index: 2;
  .w-320 {
    width: 320px;
    // width: 100%;
  }

  .last-update {
    margin-top: 30px;
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
    margin-left: 40px;

    &:first-child {
      margin-left: 20px;
    }

    .info-icon {
      vertical-align: text-bottom;
      width: 16px;
      margin-right: 8px;
    }
  }
  .unsave-changes {
    margin-left: 40px;
  }
  @media only screen and (max-width: 991px) {
    padding-left: 0px;
    // padding-right: 17px;
    .w-sm-100 {
      width: 100%;
      margin-bottom: 10px;
    }
    .w-sm-50 {
      width: 47% !important;
      margin-bottom: 10px;
    }
    .last-update {
      margin-top: 20px;
      margin: 0 auto;
      display: table;
    }
    .unsave-changes {
      margin-top: 20px;
      margin: 0 auto;
      display: table;
    }
  }
  @media only screen and (max-width: 831px) {
    .w-sm-50 {
      width: 46% !important;
      margin-bottom: 10px;
    }
  }
  @media only screen and (max-width: 632px) {
    .w-sm-50 {
      width: 47.5% !important;
      margin-left: 25px !important;
      margin-bottom: 10px;
    }
    .ml-0 {
      margin-left: 0 !important;
    }
  }
  @media only screen and (max-width: 530px) {
    .w-sm-50 {
      width: 47.3% !important;
      margin-bottom: 10px;
    }
  }
  @media only screen and (max-width: 491px) {
    .w-sm-50 {
      width: 45.7% !important;
      margin-bottom: 10px;
    }
  }

  // @media only screen and (max-width: 767px) {
  //   padding: 0 10px;
  // }
`;

const ContractTab = styled.div`
  background: ${Theme.gray6};
  padding-top: 60px;
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
      font-size: 15px;
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
`;
