/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint array-callback-return: "error" */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint no-unused-expressions: "error" */
/* eslint consistent-return: "error" */
/* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
import { Collapse } from 'react-collapse';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import DatePicker from 'react-date-picker';
import dayjs from 'dayjs';
import Select, { components } from 'react-select';
import SidePanel from './AgreementSidePanelStyle';
// import Theme from '../theme/Theme';
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
  // ArrowRightIcon,
} from '../theme/images/index';
import { Button, ContractFormField } from './index';
import {
  AgreementDetails,
  StatementDetails,
  DSPAddendumDetails,
  ListingOptimization,
} from '../constants/FieldConstants';
import { getLength, getRevenueShare, createAddendum } from '../api';
import ContractInputSelect from './ContractInputSelect';
import ContractActivityLog from '../components/Contract/ContractActivityLog';
import ServicesAmendment from '../components/Contract/ServicesAmendment';
import ErrorMsg from './ErrorMsg';
import CheckBox from './CheckBox';
import Tabs from './Tabs';

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
  marketPlaces,
  setMarketPlaces,
  additionalMarketplaces,
  setAdditionalMarketplaces,
  firstMonthDate,
  setPageNumber,
  getContractActivityLogInfo,
  activityLoader,
  activityData,
  images,
  activityCount,
  pageNumber,
  isApicalled,
  getContractDetails,
  setIsEditContract,
  setShowSaveSuccessMsg,
  setContractLoading,
  customerError,
  setCustomerErrors,
  isDocRendered,
  oneTimeService,
  monthlyService,
  AmazonStoreOptions,
  fetchUncommonOptions,
  originalAddendumData,
  thresholdTypeOptions,
  yoyPercentageOptions,
  amendmentData,
  sidebarSection,
  setSidebarSection,
  checkContractStatus,
}) {
  const [accountLength, setAccountLength] = useState([]);
  const [revShare, setRevShare] = useState([]);
  const [amazonService, setSelectedAmazonStorePackService] = useState(false);
  const [selectedThreshold, setSelectedThreshold] = useState('');

  useEffect(() => {
    getLength().then((len) => {
      setAccountLength(len.data);
    });
    getRevenueShare().then((rev) => {
      setRevShare(rev.data);
    });
  }, []);

  const customStyleDesktopTabs = {
    width: '50%',
    margin: '0',
  };

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
      formData &&
      formData.additional_one_time_services &&
      formData.additional_one_time_services.length &&
      formData.additional_one_time_services.find(
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

    fetchUncommonOptions(
      oneTimeService,
      formData.additional_one_time_services,
      'one_time_service',
    );

    fetchUncommonOptions(
      monthlyService,
      formData.additional_monthly_services,
      'monthly_service',
    );

    if (
      formData &&
      formData.additional_marketplaces &&
      formData.additional_marketplaces.length
    ) {
      setShowAdditionalMarketplace(true);
    }
  }, [agreementData, isDocRendered]);

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
                const dspErrorCount =
                  sectionError.dsp > 0 ? sectionError.dsp - 1 : 0;
                setSectionError({
                  ...sectionError,
                  agreement: sectionError.agreement - 1,
                  dsp: dspErrorCount,
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
              if (sectionError.dsp > 0) {
                setSectionError({
                  ...sectionError,
                  dsp: sectionError.dsp - 1,
                  // ? sectionError.statement - 1
                  // : 0,
                });
              }
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
              if (sectionError.dsp > 0) {
                setSectionError({
                  ...sectionError,
                  dsp: sectionError.dsp - 1,
                  // ? sectionError.statement - 1
                  // : 0,
                });
              }
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
                item.field === 'customer' &&
                !(
                  formData &&
                  formData.customer_id &&
                  formData.customer_id[item.key]
                )
              ) {
                item.error = false;

                setSectionError({
                  ...sectionError,
                  agreement: sectionError.agreement
                    ? sectionError.agreement - 1
                    : 0,
                  // ? sectionError.agreement - 1
                  // : 0,
                });
              }

              if (
                item.key === event.target.name &&
                item.field !== 'customer' &&
                !(formData && formData[item.key])
              ) {
                item.error = false;

                setSectionError({
                  ...sectionError,
                  agreement: sectionError.agreement
                    ? sectionError.agreement - 1
                    : 0,
                  // ? sectionError.agreement - 1
                  // : 0,
                });
              }
            } else if (
              formData &&
              formData[event.target.name] &&
              item.field !== 'customer'
            ) {
              item.error = true;
              setSectionError({
                ...sectionError,
                agreement: sectionError.agreement
                  ? sectionError.agreement + 1
                  : 0,
                // ? sectionError.agreement + 1
                // : 0,
              });
            } else if (
              formData &&
              formData.customer_id &&
              formData.customer_id[event.target.name] &&
              item.field === 'customer'
            ) {
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
                    !(
                      formData &&
                      formData.customer_id &&
                      formData.customer_id[subItem.key]
                    ) &&
                    event.target.value
                  ) {
                    subItem.error = false;

                    setSectionError({
                      ...sectionError,
                      agreement: sectionError.agreement
                        ? sectionError.agreement - 1
                        : 0,
                      // ? sectionError.agreement - 1
                      // : 0,
                    });
                  }
                } else if (
                  formData &&
                  formData.customer_id &&
                  formData.customer_id[event.target.name]
                ) {
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
      if (key === 'yoy_percentage') {
        setContractError({
          ...contractError,
          [key]: '',
        });
        const statmentErr = sectionError.statement
          ? sectionError.statement - 1
          : 0;
        setSectionError({
          ...sectionError,
          statement: statmentErr,
        });
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
          (agreementData &&
            agreementData.primary_marketplace &&
            agreementData.primary_marketplace.name) ||
          (formData && formData.primary_marketplace)
        ) {
          // setAdditionalMarketplaces(
          //   marketplacesResult.filter(
          //     (op) => op.value !== agreementData.primary_marketplace.name,
          //   ),
          // );
          setAdditionalMarketplaces(
            marketplacesResult.filter(
              (op) =>
                op.value !==
                (formData.primary_marketplace.name
                  ? formData.primary_marketplace.name
                  : formData.primary_marketplace),
            ),
          );
        } else {
          setAdditionalMarketplaces(marketplacesResult);
        }
      } else {
        // const itemsToBeDelete =
        //   additionalMarketplacesData &&
        //   additionalMarketplacesData.create &&
        //   additionalMarketplacesData.create.length &&
        //   additionalMarketplacesData.create.filter((item) => {
        //     if (item.id) {
        //       return item;
        //     }
        //     return null;
        //   });
        const itemsToBeDelete =
          originalData &&
          originalData.additional_marketplaces &&
          originalData.additional_marketplaces.length &&
          originalData.additional_marketplaces.filter((item) => {
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

          if (
            formData &&
            formData.contract_type &&
            formData.contract_type.toLowerCase().includes('one') &&
            (additionalOnetimeServices.create !== null ||
              (additionalOnetimeServices.create &&
                additionalOnetimeServices.create.length))
          ) {
            setAdditionalMonthlySerError({
              ...additionalMonthlySerError,
              required: '',
            });
            setSectionError({
              ...sectionError,
              agreement: sectionError.agreement
                ? sectionError.agreement - 1
                : 0,
            });
          }
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

          if (
            formData &&
            formData.contract_type &&
            formData.contract_type.toLowerCase().includes('one') &&
            (additionalOnetimeServices.create === null ||
              !(
                additionalOnetimeServices.create &&
                additionalOnetimeServices.create.length
              ))
          ) {
            setAdditionalMonthlySerError({
              ...additionalMonthlySerError,
              required: 'At least 1 one time service required',
            });
            setSectionError({
              ...sectionError,
              agreement: sectionError.agreement + 1,
            });
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

        if (
          formData &&
          formData.contract_type &&
          formData.contract_type.toLowerCase().includes('one') &&
          (additionalOnetimeServices.create !== null ||
            (additionalOnetimeServices.create &&
              additionalOnetimeServices.create.length))
        ) {
          setAdditionalMonthlySerError({
            ...additionalMonthlySerError,
            required: '',
          });
          setSectionError({
            ...sectionError,
            agreement: sectionError.agreement ? sectionError.agreement - 1 : 0,
          });
        }
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
          // deletedUncheckedItemList,
        });

        if (
          formData &&
          formData.contract_type &&
          formData.contract_type.toLowerCase().includes('one') &&
          (deletedUncheckedItemList === null ||
            !(deletedUncheckedItemList && deletedUncheckedItemList.length))
        ) {
          setAdditionalMonthlySerError({
            ...additionalMonthlySerError,
            required: 'At least 1 one time service required',
          });
          setSectionError({
            ...sectionError,
            agreement: sectionError.agreement + 1,
          });
        }
      }

      fetchUncommonOptions(
        oneTimeService,
        additionalOnetimeServices.create,
        'one_time_service',
      );

      // }
    } else {
      if (event.target.name === 'zip_code') {
        const customerData = formData.customer_id;
        // setUpdatedCustomerFields({
        //   ...updatedCustomerFields,
        //   [event.target.name]: event.target.value.trim(),
        // });
        setFormData({
          ...formData,
          customer_id: {
            ...customerData,
            [event.target.name]: event.target.value.trim(),
          },
        });
        setUpdatedFormData({
          ...updatedFormData,
          // customer_id: {
          //   ...customerData,
          [event.target.name]: event.target.value.trim(),
          // },
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
      } else if (
        event.target.name === 'billing_cap' &&
        event.target.value === ''
      ) {
        setFormData({ ...formData, [event.target.name]: null });
        setUpdatedFormData({
          ...updatedFormData,
          [event.target.name]: null,
        });
      } else if (
        event.target.name === 'company_name' ||
        event.target.name === 'state' ||
        event.target.name === 'city' ||
        event.target.name === 'address'
      ) {
        const customerData = formData.customer_id;
        // setUpdatedCustomerFields({
        //   ...updatedCustomerFields,
        //   [event.target.name]: event.target.value.trim(),
        // });
        setFormData({
          ...formData,
          customer_id: {
            ...customerData,
            [event.target.name]: event.target.value,
          },
        });
        setUpdatedFormData({
          ...updatedFormData,
          // customer_id: {
          //   ...customerData,
          [event.target.name]: event.target.value,
          // },
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
        setApiError({
          ...apiError,
          [event.target.name]: '',
        });
      }
      if (
        additionalMarketplaceError &&
        Object.keys(additionalMarketplaceError).includes(event.target.name)
      ) {
        setAdditionalMarketplaceError({
          ...additionalMarketplaceError,
          [additionalMarketplaceError]: '',
        });
      }

      if (
        additionalMonthlySerError &&
        Object.keys(additionalMonthlySerError).includes(event.target.name)
      ) {
        setAdditionalMonthlySerError({
          ...additionalMonthlySerError,
          [event.target.name]: '',
        });
      }

      if (
        additionalOnetimeSerError &&
        Object.keys(additionalOnetimeSerError).includes(event.target.name)
      ) {
        setAdditionalOnetimeSerError({
          ...additionalOnetimeSerError,
          [event.target.name]: '',
        });
      }
      if (
        customerError &&
        Object.keys(customerError).includes(event.target.name)
      ) {
        if (
          event.target.name === 'zip_code' &&
          customerError &&
          customerError.zip_code
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
          setCustomerErrors({
            ...customerError,
            [event.target.name]: '',
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

      if (
        (key === 'threshold_type' &&
          contractError &&
          contractError.sales_threshold) ||
        (contractError && contractError.yoy_percentage)
      ) {
        const statementErr = sectionError.statement
          ? sectionError.statement - 1
          : 0;
        setContractError({
          ...contractError,
          sales_threshold: '',
          yoy_percentage: '',
        });
        setSectionError({
          ...sectionError,
          statement: statementErr,
        });
      } else if (event.target.name === 'sales_threshold') {
        if (contractError && contractError.sales_threshold) {
          const statementErr = sectionError.statement
            ? sectionError.statement - 1
            : 0;
          setContractError({
            ...contractError,
            sales_threshold: '',
            yoy_percentage: '',
          });
          setSectionError({
            ...sectionError,
            statement: statementErr,
          });
        }
      } else {
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
              : formData[item.key] && formData[item.key].label
              ? {
                  value: formData[item.key].label,
                  label: formData[item.key].value,
                }
              : formData[item.key]
              ? {
                  value: formData[item.key],
                  label: formData[item.key],
                }
              : null
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
          allowNegative={false}
        />
      );
    }
    if (item.type === 'date') {
      if (item.part === 'dsp') {
        return (
          <DatePicker
            disabled
            className="form-control"
            id="date"
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
          className={
            formData && formData[item.key] && item.isMandatory
              ? 'form-control'
              : 'form-control form-control-error'
          }
          id="date"
          minDate={
            agreementData && agreementData.start_date
              ? new Date(agreementData && agreementData.start_date) > new Date()
                ? new Date()
                : new Date(agreementData && agreementData.start_date)
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
          placeholderText="Select Date"
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
    if (item && item.field === 'customer') {
      return (
        <input
          className={
            (customerError && customerError[item.key]) ||
            (!(
              formData &&
              formData.customer_id &&
              formData.customer_id[item.key]
            ) &&
              item.isMandatory)
              ? 'form-control form-control-error'
              : 'form-control '
          }
          type="text"
          placeholder={item.placeholder ? item.placeholder : item.label}
          onChange={(event) => handleChange(event, item.key)}
          name={item.key}
          defaultValue={
            formData && formData.customer_id && formData.customer_id[item.key]
          }
        />
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
        setContractLoading({ loader: true, type: 'page' });

        createAddendum(addendumData).then((res) => {
          setContractLoading({ loader: false, type: 'page' });

          if (res && res.status === 201) {
            setNewAddendum(res && res.data);
            setOpenCollapse({
              ...openCollapse,
              statement: false,
              dspAddendum: false,
              addendum: true,
            });
            if (updatedFormData && updatedFormData.addendum) {
              delete updatedFormData.addendum;
            }

            setUpdatedFormData({ ...updatedFormData });
            if (!Object.keys(updatedFormData).length) {
              getContractDetails();
              setIsEditContract(false);
            }
            setShowSaveSuccessMsg(true);
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
          {customerError &&
            customerError[item.key] &&
            customerError[item.key][0]}
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
          {additionalMonthlySerError.required ? (
            <ErrorMsg>{additionalMonthlySerError.required}</ErrorMsg>
          ) : (
            ''
          )}
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
                            formData &&
                            formData.additional_one_time_services &&
                            formData.additional_one_time_services.length &&
                            formData.additional_one_time_services.find(
                              (item) =>
                                (item.service &&
                                  item.service.id ===
                                    oneTimeServiceData.value) ||
                                item.service_id === oneTimeServiceData.value,
                            )
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
                    isSearchable={false}
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

  const onCheckOfAddendum = (flag) => {
    setShowCollpase({
      ...showSection,
      addendum: flag,
    });
    setShowEditor(false);
    // if (updatedFormData && updatedFormData.addendum) {
    if (!flag) {
      if (newAddendumData.addendum && newAddendumData.addendum.length > 7) {
        setNewAddendum({ ...newAddendumData, addendum: '<p></p>' });
        setUpdatedFormData({ ...updatedFormData, addendum: '<p></p>' });
        showFooter(true);
      }
    } else if (Object.keys(updatedFormData).length) {
      showFooter(true);
    } else {
      showFooter(false);
      delete updatedFormData.addendum;
      setNewAddendum(originalAddendumData);
    }
    // }
  };

  const displayAddendum = () => {
    return newAddendumData && newAddendumData.id ? (
      <Button
        className=" btn-transparent sidepanel mt-3 mb-3 w-100"
        onClick={() => {
          onEditAddendum();
          executeScroll('addendum');
        }}>
        <img
          className="edit-folder-icon mr-2"
          src={EditFileIcons}
          alt="edit "
        />
        Edit Addendum
      </Button>
    ) : !showEditor &&
      !(newAddendumData && Object.keys(newAddendumData).length) ? (
      <Button
        className=" sidepanel btn-transparent create-addendum mt-1 mb-3 w-100"
        onClick={() => {
          onEditAddendum();
          executeScroll('addendum');
        }}>
        Create Addendum
      </Button>
    ) : (
      <>
        <Button
          className={
            (newAddendumData && !Object.keys(newAddendumData).length) ||
            (newAddendumData &&
              newAddendumData.addendum &&
              newAddendumData.addendum.startsWith('<p></p>'))
              ? ' btn-gray sidepanel on-boarding mt-1 mb-3 w-100 disabled'
              : 'btn-primary sidepanel on-boarding mt-1 mb-3 w-100  '
          }
          onClick={() => nextStep('final')}>
          {/* {isLoading.loader && isLoading.type === 'button' ? (
                              <PageLoader color="#fff" type="button" />
                            ) : ( */}
          Save Addendum
          {/* )} */}
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

  const onThresholdTypeChange = (event, key, threshold) => {
    setSelectedThreshold(threshold);
    handleChange(event, key);
  };

  const displayEditFields = () => {
    return (
      <div className="sidebar">
        <>
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
                          <div className="error-bg one-time-service">
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

                <div className="clear-fix" />
              </div>
              <Collapse isOpened={openCollapse.agreement}>
                {loader ? null : (
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
                            .includes('one') &&
                          !(
                            formData &&
                            formData.draft_from &&
                            formData.draft_from
                          ) ? (
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
                        {/* {isLoading.loader && isLoading.type === 'button' ? (
                          <PageLoader color="#fff" type="button" />
                        ) : ( */}
                        Proceed to Next Section
                        {/* )} */}
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
                    {loader ? null : ( // /> //   type="page" //   color="#FF5933" //   component="activityLog" // <PageLoader // (isLoading.loader && isLoading.type === 'page') //  ||
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
                          <li>
                            <div className="label-heading mb-2">
                              Revenue Share Threshold
                            </div>
                            <div className="thershold">
                              <ul className="days-tab">
                                {thresholdTypeOptions.map((threshold) => {
                                  return (
                                    <>
                                      <li
                                        className={
                                          selectedThreshold.value ===
                                            threshold.value ||
                                          formData.threshold_type ===
                                            threshold.value ||
                                          (!formData.threshold_type &&
                                            threshold.value === 'None')
                                            ? 'p-0 thresholdChecked'
                                            : 'p-0'
                                        }>
                                        <input
                                          className="d-none "
                                          type="radio"
                                          id={threshold.label}
                                          name="threshold_type"
                                          value={threshold.value}
                                          onClick={(event) => {
                                            onThresholdTypeChange(
                                              event,
                                              'threshold_type',
                                              threshold,
                                            );
                                          }}
                                        />
                                        <label
                                          className={
                                            threshold.label
                                              .toLowerCase()
                                              .includes('yoy')
                                              ? 'radio-container customer-list thresholdLable'
                                              : 'radio-container customer-list'
                                          }
                                          htmlFor={threshold.label}>
                                          {threshold.label}
                                        </label>
                                      </li>
                                    </>
                                  );
                                })}
                              </ul>
                            </div>
                            {formData && formData.threshold_type === 'Fixed' ? (
                              <div>
                                <ContractFormField>
                                  <div className="input-container  ">
                                    <span
                                      className={
                                        contractError &&
                                        contractError.sales_threshold
                                          ? 'input-icon error-msg'
                                          : 'input-icon'
                                      }>
                                      ${' '}
                                    </span>
                                    <NumberFormat
                                      name="sales_threshold"
                                      className={
                                        contractError &&
                                        contractError.sales_threshold
                                          ? 'form-control modal-input-control form-control-error'
                                          : 'form-control modal-input-control'
                                      }
                                      placeholder="Enter threshold"
                                      onChange={(event) =>
                                        handleChange(event, 'sales_threshold')
                                      }
                                      defaultValue={
                                        formData && formData.sales_threshold
                                      }
                                      thousandSeparator
                                      allowNegative={false}
                                    />
                                  </div>
                                  {displayError({ key: 'sales_threshold' })}
                                </ContractFormField>
                              </div>
                            ) : (
                              ''
                            )}
                            {formData &&
                            formData.threshold_type === 'YoY + %' ? (
                              <div>
                                <ContractInputSelect>
                                  <Select
                                    classNamePrefix="react-select"
                                    styles={{
                                      control: (base, state) => ({
                                        ...base,
                                        background:
                                          contractError &&
                                          contractError.yoy_percentage
                                            ? '#FBF2F2'
                                            : '#F4F6FC',
                                        // match with the menu
                                        // borderRadius: state.isFocused ? '3px 3px 0 0' : 3,
                                        // Overwrittes the different states of border
                                        borderColor:
                                          contractError &&
                                          contractError.yoy_percentage
                                            ? '#D63649'
                                            : '#D5D8E1',

                                        // Removes weird border around container
                                        boxShadow: state.isFocused
                                          ? null
                                          : null,
                                        '&:hover': {
                                          // Overwrittes the different states of border
                                          boxShadow: state.isFocused
                                            ? null
                                            : null,
                                          outlineColor: state.isFocused
                                            ? null
                                            : null,
                                        },
                                      }),
                                      placeholder: (defaultStyles) => {
                                        return {
                                          ...defaultStyles,
                                          color: '556178',
                                        };
                                      },
                                    }}
                                    isSearchable={false}
                                    defaultValue={
                                      formData && formData.yoy_percentage
                                        ? [
                                            {
                                              label:
                                                formData &&
                                                formData.yoy_percentage,
                                              value:
                                                formData &&
                                                formData.yoy_percentage,
                                            },
                                          ]
                                        : []
                                    }
                                    options={yoyPercentageOptions}
                                    name="yoy_percentage"
                                    components={{ DropdownIndicator }}
                                    onChange={(event) => {
                                      handleChange(
                                        event,
                                        'yoy_percentage',
                                        'choice',
                                      );
                                    }}
                                    placeholder="Select percentage"
                                  />
                                  {displayError({ key: 'yoy_percentage' })}
                                </ContractInputSelect>
                              </div>
                            ) : (
                              ''
                            )}
                          </li>

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
                                        formData &&
                                        formData.additional_monthly_services &&
                                        formData.additional_monthly_services
                                          .length &&
                                        formData.additional_monthly_services.find(
                                          (item) =>
                                            (item.service &&
                                              item.service.id ===
                                                serviceData.value) ||
                                            item.service_id ===
                                              serviceData.value,
                                        )
                                        //   ||
                                        // (agreementData &&
                                        //   agreementData.additional_monthly_services &&
                                        //   agreementData
                                        //     .additional_monthly_services
                                        //     .length &&
                                        //   agreementData.additional_monthly_services.find(
                                        //     (item) =>
                                        //       item.service &&
                                        //       item.service.id ===
                                        //         serviceData.value,
                                        //   ))
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
                                    // (agreementData &&
                                    //   agreementData.additional_marketplaces &&
                                    //   agreementData.additional_marketplaces
                                    //     .length) ||
                                    formData &&
                                    formData.additional_marketplaces &&
                                    formData.additional_marketplaces.length
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
                          {!(
                            formData &&
                            formData.draft_from &&
                            formData.draft_from
                          )
                            ? displayOneTimeServices()
                            : ''}
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
                              {/* {isLoading.loader &&
                              isLoading.type === 'button' ? (
                                <PageLoader color="#fff" type="button" />
                              ) : ( */}
                              Proceed to Next Section
                              {/* )} */}
                            </Button>
                          </li>
                        </ul>
                      </>
                    )}
                  </Collapse>
                </>
              )}

              {loader ? null : (formData && // /> //   type="page" //   color="#FF5933" //   component="activityLog" // <PageLoader //  || (isLoading.loader && isLoading.type === 'page')
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
                    className="collapse-btn "
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
                          {/* {isLoading.loader && isLoading.type === 'button' ? (
                            <PageLoader color="#fff" type="button" />
                          ) : ( */}
                          Proceed to Next Section
                          {/* )} */}
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
                  if (showSection && showSection.addendum) {
                    executeScroll('addendum');
                  }
                  setOpenCollapse({ addendum: !openCollapse.addendum });
                }}>
                <img className="service-agre" src={CreateAddendum} alt="pdf" />
                <h4 className="sendar-details ">Addendum </h4>
                <div className="clear-fix" />
              </div>
              <Collapse isOpened={openCollapse.addendum}>
                {loader ? null : ( // /> //   type="page" //   color="#FF5933" //   component="activityLog" // <PageLoader // || (isLoading.loader && isLoading.type === 'page')
                  <ul className="collapse-inner">
                    <li>
                      <p className="small-para  mt-0">
                        [Optional] Use this to modify, clarify, or nullify a
                        portion of the original agreement.
                      </p>

                      <CheckBox>
                        <label
                          className="check-container customer-pannel"
                          htmlFor="add-addendum">
                          Add Addendum
                          <input
                            type="checkbox"
                            id="add-addendum"
                            onClick={(event) => {
                              onCheckOfAddendum(event.target.checked);
                              //  executeScroll('addendum');
                              // setNewAddendum({});
                            }}
                            defaultChecked={showSection && showSection.addendum}
                          />
                          <span className="checkmark" />
                        </label>
                      </CheckBox>
                      {showSection && showSection.addendum
                        ? displayAddendum()
                        : ''}
                    </li>
                  </ul>
                )}
              </Collapse>
            </>
          ) : (
            <ContractActivityLog
              activityLoader={activityLoader}
              activityData={activityData}
              images={images}
              activityCount={activityCount}
              pageNumber={pageNumber}
              isApicalled={isApicalled}
              agreementData={agreementData}
              setPageNumber={setPageNumber}
              getContractActivityLogInfo={getContractActivityLogInfo}
              loader={loader}
              checkContractStatus={checkContractStatus}
            />
          )}
        </>
      </div>
    );
  };

  const displaySection = () => {
    if (sidebarSection === 'amendment') {
      return <ServicesAmendment amendmentData={amendmentData} />;
    }
    if (sidebarSection === 'edit') {
      return displayEditFields();
    }
    return '';
  };

  const isDraftContract = (agreement) => {
    if (
      agreement &&
      agreement.draft_from &&
      agreement.contract_status &&
      (agreement.contract_status.value === 'pending contract' ||
        agreement.contract_status.value === 'pending contract approval' ||
        agreement.contract_status.value === 'pending contract signature')
    ) {
      return true;
    }
    return false;
  };

  return (
    <SidePanel
      className={
        (agreementData &&
          agreementData.contract_status &&
          agreementData.contract_status.value === 'pending account setup') ||
        (agreementData &&
          agreementData.contract_status &&
          agreementData.contract_status.value === 'active') ||
        (agreementData &&
          agreementData.contract_status &&
          agreementData.contract_status.value === 'inactive')
          ? 'pdf-sidebar'
          : 'contract-sidebar'
      }>
      {isDraftContract(agreementData) ? (
        <>
          <Tabs className="mt-4 d-none d-lg-block">
            <ul style={{ textAlign: 'center' }} className="tabs ">
              <li
                style={customStyleDesktopTabs}
                className={sidebarSection === 'edit' ? 'active' : ''}
                role="presentation"
                onClick={() => {
                  setSidebarSection('edit');
                }}>
                {isEditContract ? 'Edit Fields' : 'Activity'}
              </li>
              <li
                style={customStyleDesktopTabs}
                className={sidebarSection === 'amendment' ? 'active' : ''}
                role="presentation"
                onClick={() => {
                  setSidebarSection('amendment');
                }}>
                Amendment
              </li>
            </ul>
          </Tabs>
          {displaySection()}
        </>
      ) : (
        displayEditFields()
      )}
    </SidePanel>
  );
}
AgreementSidePanel.defaultProps = {
  setFormData: () => {},
  formData: {},
  loader: false,
  agreementData: {},
  newAddendumData: {},
  onEditAddendum: () => {},
  setShowEditor: () => {},
  setNewAddendum: () => {},
  setNotIncludedOneTimeServices: () => {},
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
  setPageNumber: () => {},
  getContractActivityLogInfo: () => {},
  activityLoader: false,
  activityData: [],
  images: [],
  activityCount: 0,
  pageNumber: 1,
  isApicalled: false,
  getContractDetails: () => {},
  setIsEditContract: () => {},
  setShowSaveSuccessMsg: () => {},
  setContractLoading: () => {},
  customerError: {},
  setCustomerErrors: () => {},
  isDocRendered: false,
  oneTimeService: [],
  monthlyService: [],
  AmazonStoreOptions: [],
  fetchUncommonOptions: () => {},
  originalAddendumData: {},
  checkContractStatus: () => {},
};

AgreementSidePanel.propTypes = {
  id: PropTypes.string.isRequired,
  setFormData: PropTypes.func,
  formData: PropTypes.shape({
    additional_services: PropTypes.arrayOf(PropTypes.array),
    start_date: PropTypes.string,
    company_name: PropTypes.string,
    primary_marketplace: PropTypes.shape({
      fee: PropTypes.number,
      name: PropTypes.string,
      id: PropTypes.string,
    }),
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

  newAddendumData: PropTypes.shape({
    id: PropTypes.string,
    addendum: PropTypes.string,
  }),
  onEditAddendum: PropTypes.func,
  setShowEditor: PropTypes.func,
  setNewAddendum: PropTypes.func,
  setNotIncludedOneTimeServices: PropTypes.func,

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
    primary_marketplace: PropTypes.shape(PropTypes.object),
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
    primary_marketplace: PropTypes.shape({
      fee: PropTypes.number,
      name: PropTypes.string,
      id: PropTypes.string,
    }),
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
  setPageNumber: PropTypes.func,
  getContractActivityLogInfo: PropTypes.func,
  activityLoader: PropTypes.bool,
  activityData: PropTypes.arrayOf(PropTypes.object),
  images: PropTypes.arrayOf(PropTypes.object),
  activityCount: PropTypes.number,
  pageNumber: PropTypes.number,
  isApicalled: PropTypes.bool,
  getContractDetails: PropTypes.func,
  setIsEditContract: PropTypes.func,
  setShowSaveSuccessMsg: PropTypes.func,
  setContractLoading: PropTypes.func,
  customerError: PropTypes.shape(PropTypes.object),
  setCustomerErrors: PropTypes.func,
  isDocRendered: PropTypes.bool,
  oneTimeService: PropTypes.arrayOf(PropTypes.object),
  monthlyService: PropTypes.arrayOf(PropTypes.object),
  AmazonStoreOptions: PropTypes.arrayOf(PropTypes.object),
  fetchUncommonOptions: PropTypes.func,
  originalAddendumData: PropTypes.shape(PropTypes.object),
  checkContractStatus: PropTypes.func,
};
