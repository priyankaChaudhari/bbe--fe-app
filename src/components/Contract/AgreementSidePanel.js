/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';

import NumberFormat from 'react-number-format';
import DatePicker from 'react-date-picker';
import dayjs from 'dayjs';
import Select, { components } from 'react-select';

import ContractInputSelect from '../../common/ContractInputSelect';
import ContractActivityLog from './ContractActivityLog';
import ServicesAmendment from './ServicesAmendment';
import { SidePanel } from '../../theme/AgreementStyle';
import {
  agreementDefaultProptypes,
  agreementSidePanelPropTypes,
} from './PropTypesConstants/AgreementSidePanelProptypes';
import { getLength, getRevenueShare, createAddendum } from '../../api';
import {
  AgreementDetails,
  StatementDetails,
  DSPAddendumDetails,
} from '../../constants';
import { ErrorMsg, Tabs } from '../../common';
import { GreenCheck, RedCross, CaretUp } from '../../theme/images';
import {
  ServiceAgreementSection,
  StatementOfWork,
  DspAdvertising,
  AddendumSection,
  FeeStructureContainer,
} from './AgreementSidebarSections';

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
  setMarketplaceDropdownData,
  discountData,
  setSelectedDiscount,
  feeStructureErrors,
  setFeeStructureErrors,
  getMonthlyServices,
  showRightTick,
}) {
  const [accountLength, setAccountLength] = useState([]);
  const [revShare, setRevShare] = useState([]);
  const [amazonService, setSelectedAmazonStorePackService] = useState({});
  const [selectedThreshold, setSelectedThreshold] = useState('');

  const customer = formData?.customer_id;
  const additionalOneTimeServicesLength =
    formData?.additional_one_time_services?.length;

  const formDataAdditionalMarketplacesLength =
    formData?.additional_marketplaces?.length;

  const originalDataAdditionalOneTimeServicesLength =
    originalData?.additional_one_time_services?.length;
  const additionalOneTimeServicesCreateLength =
    additionalOnetimeServices?.create?.length;
  const contractType = formData?.contract_type;
  const agreementDataContractStatusValue =
    agreementData?.contract_status?.value;
  const contractErrorSalesThreshold = contractError?.sales_threshold;
  const agreementErrCount = sectionError?.agreement;
  const statementErrCount = sectionError?.statement;
  const dspErrCount = sectionError?.dsp;

  const updateAgreementErrorValue = (value) => {
    setSectionError({
      ...sectionError,
      agreement: value,
    });
  };
  const updateAgreementErrorMinusValue = (value) => {
    const agreementErrvalue = sectionError.agreement ? value : 0;
    updateAgreementErrorValue(agreementErrvalue);
  };

  const updateStatementErrorValue = (value) => {
    setSectionError({
      ...sectionError,
      statement: value,
    });
  };
  const updateStatementErrorMinusValue = (value) => {
    const statementErrValue = sectionError.statement ? value : 0;
    updateStatementErrorValue(statementErrValue);
  };

  const updateDspErrorValue = (value) => {
    setSectionError({
      ...sectionError,
      dsp: value,
    });
  };
  const updateDspErrorMinusValue = (value) => {
    const dspErrorValue = sectionError.dsp ? value : 0;
    updateDspErrorValue(dspErrorValue);
  };

  const updateAdditionalOnetimeServices = (isCreate, isArray) => {
    if (isCreate) {
      setFormData({
        ...formData,
        additional_one_time_services: additionalOnetimeServices.create,
      });
    }
    if (isArray) {
      setUpdatedFormData({
        ...updatedFormData,
        additional_one_time_services: {
          ...additionalOnetimeServices,
        },
      });
      setAdditionalOnetimeServices({
        ...additionalOnetimeServices,
      });
    } else {
      setUpdatedFormData({
        ...updatedFormData,
        additional_one_time_services: additionalOnetimeServices,
      });
    }
  };

  const updateAdditionalOnetimeServicesSelectedData = (selectedData) => {
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
  };

  const updateAdditionalMarketplaces = () => {
    setUpdatedFormData({
      ...updatedFormData,
      additional_marketplaces: additionalMarketplacesData,
    });
  };
  const updateAdditionalMonthlyServices = () => {
    setUpdatedFormData({
      ...updatedFormData,
      additional_monthly_services: additionalMonthlyServices,
    });
  };

  const handleUpdatedFormDataEvent = (isCustomerId, eventName, eventValue) => {
    if (isCustomerId) {
      const customerData = formData.customer_id;
      setFormData({
        ...formData,
        customer_id: {
          ...customerData,
          [eventName]: eventValue,
        },
      });
    } else {
      setFormData({ ...formData, [eventName]: eventValue });
    }
    setUpdatedFormData({
      ...updatedFormData,
      [eventName]: eventValue,
    });
  };

  useEffect(() => {
    getLength().then((len) => {
      setAccountLength(len?.data);
    });
    getRevenueShare().then((rev) => {
      setRevShare(rev?.data);
    });
  }, []);

  const customStyleDesktopTabs = {
    width: '50%',
    margin: '0',
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
    if (openCollapse.feeStructure) {
      executeScroll('statement');
    }
  };

  useEffect(() => {
    goToSection();

    const serviceData =
      additionalOneTimeServicesLength &&
      formData.additional_one_time_services.find((item) =>
        item.service?.name.includes('Amazon Store Package'),
      );
    if (serviceData) {
      setShowAmazonPlanDropdown(true);
      const serviceName = serviceData.service.name.split(' ')[3];
      if (serviceName === 'Custom') {
        setAmazonStoreCustom(true);
      }
    }

    setSelectedAmazonStorePackService(serviceData);

    if (formDataAdditionalMarketplacesLength) {
      setMarketplaceDropdownData(true);
    }
  }, [agreementData, isDocRendered]);

  const clearOneTimeQntyError = (val) => {
    const itemFound =
      additionalOnetimeSerError?.quantity?.length &&
      additionalOnetimeSerError.quantity.find((item) =>
        item.service_id === val.value
          ? val.value
          : val?.service
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
                });
              }
            } else if (formData && formData[key]) {
              item.error = true;

              setSectionError({
                ...sectionError,
                agreement: sectionError.agreement + 1,
                dsp: sectionError.dsp + 1,
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
              updateStatementErrorMinusValue(sectionError.statement - 1);
            }
          } else {
            item.error = true;

            if (formData && formData[key]) {
              updateStatementErrorValue(sectionError.statement + 1);
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
                updateDspErrorMinusValue(sectionError.dsp - 1);
              }
            }
          } else if (formData && formData[key]) {
            item.error = true;
            updateDspErrorValue(sectionError.dsp + 1);
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
            if (event?.value) {
              if (item.key === key && !(formData && formData[item.key])) {
                item.error = false;
                updateAgreementErrorMinusValue(sectionError.agreement - 1);
              }
            } else if (formData && formData[key]) {
              item.error = true;
              updateAgreementErrorValue(sectionError.agreement + 1);
            }
          }
        });
      }
    }

    if (event?.target?.name) {
      if (
        StatementDetails.find(
          (item) => item.key === event.target.name && item.isMandatory,
        )
      ) {
        StatementDetails.forEach((item) => {
          if (event?.target?.value) {
            if (
              item.key === event.target.name &&
              !(formData && formData[item.key])
            ) {
              item.error = false;
              updateStatementErrorMinusValue(sectionError.statement - 1);
            }
          } else {
            item.error = true;
            if (formData && formData[event.target.name]) {
              updateStatementErrorValue(sectionError.statement + 1);
            }
          }
        });
      } else if (
        DSPAddendumDetails.find(
          (item) => item.key === event.target.name && item.isMandatory,
        )
      ) {
        DSPAddendumDetails.forEach((item) => {
          if (event?.target?.value) {
            if (
              item.key === event.target.name &&
              !(formData && formData[item.key])
            ) {
              item.error = false;
              if (sectionError.dsp > 0) {
                updateDspErrorMinusValue(sectionError.dsp - 1);
              }
            }
          } else if (formData && formData[event.target.name]) {
            item.error = true;
            updateDspErrorValue(sectionError.dsp + 1);
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
            if (event?.target?.value) {
              if (
                item.key === event.target.name &&
                item.field === 'customer' &&
                !customer[item.key]
              ) {
                item.error = false;
                updateAgreementErrorMinusValue(sectionError.agreement - 1);
              }

              if (
                item.key === event.target.name &&
                item.field !== 'customer' &&
                !(formData && formData[item.key])
              ) {
                item.error = false;
                updateAgreementErrorMinusValue(sectionError.agreement - 1);
              }
            } else if (
              formData &&
              formData[event.target.name] &&
              item.field !== 'customer'
            ) {
              item.error = true;
              updateAgreementErrorValue(sectionError.agreement + 1);
            } else if (
              customer[event.target.name] &&
              item.field === 'customer'
            ) {
              item.error = true;
              updateAgreementErrorValue(sectionError.agreement + 1);
            }
          } else {
            return (
              item &&
              item.sections.forEach((subItem) => {
                if (event?.target?.value) {
                  if (
                    subItem.key === event.target.name &&
                    !customer[subItem.key] &&
                    event.target.value
                  ) {
                    subItem.error = false;
                    updateAgreementErrorMinusValue(sectionError.agreement - 1);
                  }
                } else if (customer[event.target.name]) {
                  subItem.error = true;
                  updateAgreementErrorValue(sectionError.agreement + 1);
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
      updateStatementErrorMinusValue(sectionError.statement - 1);
      setAdditionalOnetimeSerError({
        ...additionalOnetimeSerError,
        custom_amazon_store_price: '',
      });
    }
    if (apiError.non_field_errors && key === 'primary_marketplace') {
      updateStatementErrorMinusValue(sectionError.statement - 1);

      setApiError({
        ...apiError,
        non_field_errors: '',
      });
    }

    if (type === 'quantity') {
      if (contractType?.toLowerCase()?.includes('one')) {
        //
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
      }
      if (key === 'yoy_percentage') {
        setContractError({
          ...contractError,
          [key]: '',
        });
        updateStatementErrorMinusValue(sectionError.statement - 1);
      }
      setFormData({ ...formData, [key]: event.value });
      setUpdatedFormData({ ...updatedFormData, [key]: event.value });
    } else if (type === 'qty') {
      setFormData({ ...formData, quantity: event.target.value });
      setUpdatedFormData({
        ...updatedFormData,
        quantity: event.target.value,
      });
    } else if (key === 'amazon_store_package') {
      if (type === 'quantity') {
        const selectedData =
          additionalOneTimeServicesCreateLength &&
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
          updateAdditionalOnetimeServicesSelectedData(selectedData);
        }
      }

      if (type === 'dropdown') {
        let selectedData = [];
        selectedData =
          additionalOneTimeServicesCreateLength &&
          additionalOnetimeServices.create.filter((item) => {
            if (
              !(item.name
                ? item.name.includes('Amazon Store Package')
                : item.service.name.includes('Amazon Store Package'))
            ) {
              return item;
            }
            return false;
          });

        const itemInOriginalData =
          originalDataAdditionalOneTimeServicesLength &&
          originalData.additional_one_time_services.find((item) =>
            item.name
              ? item.name.includes('Amazon Store Package')
              : item.service.name.includes('Amazon Store Package'),
          );

        if (itemInOriginalData?.service?.name.includes(event.label)) {
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
          });
        } else {
          if (selectedData === 0) {
            selectedData = [];
          }
          selectedData.push({
            name: `Amazon Store Package ${event.label}`,
            quantity: 1,
            service_id: event.value,
            contract_id: originalData?.id,
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

        if (itemInOriginalData?.service?.name.includes(event.label)) {
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
        updateAdditionalOnetimeServices(false, 'isArray');
        // remove Amazon Store Package entries from notincludedService
        const listWithoutAmazonStorePack = notIncludedOneTimeServices.filter(
          (item) => !item.label.includes('Amazon Store Package'),
        );
        setNotIncludedOneTimeServices(listWithoutAmazonStorePack);
      }

      if (type === 'custom_amazon_store_price') {
        const itemInList =
          additionalOneTimeServicesCreateLength &&
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
        updateAdditionalOnetimeServices('isCreate', 'isArray');
      }

      if (type === 'checkbox') {
        if (event.target.checked) {
          const itemInOriginalData =
            originalDataAdditionalOneTimeServicesLength &&
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
            updateAdditionalOnetimeServices('isCreate', 'isArray');
            // if item selected and if it is custom then show price input field else not
            if (
              itemInOriginalData?.name
                ? itemInOriginalData?.name.includes(
                    'Amazon Store Package Custom',
                  )
                : itemInOriginalData?.service?.name.includes(
                    'Amazon Store Package Custom',
                  )
            ) {
              setAmazonStoreCustom(true);
            } else {
              setAmazonStoreCustom(false);
            }
          } else {
            additionalOnetimeServices.create.push({
              name: `Amazon Store Package`,
              quantity: 1,
              contract_id: originalData?.id,
            });
            updateAdditionalOnetimeServices('isCreate', 'isArray');
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
            contractType?.toLowerCase()?.includes('one') &&
            (additionalOnetimeServices.create !== null ||
              additionalOneTimeServicesCreateLength)
          ) {
            setAdditionalMonthlySerError({
              ...additionalMonthlySerError,
              required: '',
            });
            updateAgreementErrorMinusValue(sectionError.agreement - 1);
          }
        } else {
          const itemInList =
            additionalOneTimeServicesCreateLength &&
            additionalOnetimeServices.create.find((item) =>
              item.name
                ? item.name.includes('Amazon Store Package')
                : item.service.name.includes('Amazon Store Package'),
            );
          if (itemInList) {
            const removedEle =
              additionalOneTimeServicesCreateLength &&
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
            updateAdditionalOnetimeServices('isCreate', 'isArray');
          }
          // if previously custom service is selected then when we uncheck this Amazon Store PAckage then we need to disable 'custom store price' input
          if (
            itemInList?.name
              ? itemInList?.name.includes('Amazon Store Package Custom')
              : itemInList?.service?.name.includes(
                  'Amazon Store Package Custom',
                )
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
            contractType?.toLowerCase()?.includes('one') &&
            (additionalOnetimeServices.create === null ||
              !additionalOneTimeServicesCreateLength)
          ) {
            setAdditionalMonthlySerError({
              ...additionalMonthlySerError,
              required: 'At least 1 one time service required',
            });
            updateAgreementErrorValue(sectionError.agreement + 1);
          }
        }
      }
    } else if (key === 'additional_one_time_services') {
      let itemInFormData = {};
      itemInFormData =
        originalDataAdditionalOneTimeServicesLength &&
        originalData.additional_one_time_services.find(
          (item) => item?.service?.name === event.target.name,
        );

      if (type === 'quantity') {
        const selectedItem =
          additionalOneTimeServicesCreateLength &&
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
          updateAdditionalOnetimeServices();
        }
      }
      // if item checked
      else if (event.target.checked) {
        // checked whether checked item present in newly created list
        if (
          additionalOneTimeServicesCreateLength &&
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
              additionalOneTimeServicesCreateLength &&
              additionalOnetimeServices.create.find((item) =>
                item.name
                  ? item.name === itemInFormData.service.name
                  : item.service.name === itemInFormData.service.name,
              )
            ) {
              // !!!
            } else {
              additionalOnetimeServices.create.push(itemInFormData);
              updateAdditionalOnetimeServices('isCreate', false);
            }
          }
          // else we create dict as BE required for new item and we push that in newly created list
          else if (
            additionalOneTimeServicesCreateLength &&
            additionalOnetimeServices.create.find((item) =>
              item.service_id
                ? item.service_id === val.value
                : item.service?.id === val.value,
            )
          ) {
            //
          } else {
            additionalOnetimeServices.create.push({
              name: event.target.name,
              service_id: val.value,
              contract_id: originalData?.id,
              quantity: 1,
            });
            updateAdditionalOnetimeServices('isCreate', false);
          }
          // here we fnally update state variable
          setAdditionalOnetimeServices({
            ...additionalOnetimeServices,
          });
        }
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
          contractType?.toLowerCase()?.includes('one') &&
          (additionalOnetimeServices.create !== null ||
            additionalOneTimeServicesCreateLength)
        ) {
          setAdditionalMonthlySerError({
            ...additionalMonthlySerError,
            required: '',
          });
          updateAgreementErrorMinusValue(sectionError.agreement - 1);
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
        updateAdditionalOnetimeServices();
        setAdditionalOnetimeServices({
          ...additionalOnetimeServices,
        });

        if (
          contractType?.toLowerCase()?.includes('one') &&
          (deletedUncheckedItemList === null ||
            !deletedUncheckedItemList?.length)
        ) {
          setAdditionalMonthlySerError({
            ...additionalMonthlySerError,
            required: 'At least 1 one time service required',
          });
          updateAgreementErrorValue(sectionError.agreement + 1);
        }
      }

      fetchUncommonOptions(
        oneTimeService,
        additionalOnetimeServices.create,
        'one_time_service',
      );
    } else {
      if (event.target.name === 'zip_code') {
        handleUpdatedFormDataEvent(
          'isCustomerId',
          event.target.name,
          event.target.value.trim(),
        );
      } else if (event.target.value.includes('$')) {
        let value = event.target.value.slice(1);

        if (event.target.name === 'dsp_fee') {
          value = value.replace(/,/g, '');
        }
        handleUpdatedFormDataEvent(false, event.target.name, value);
      } else if (
        event.target.name === 'monthly_retainer' &&
        event.target.value === ''
      ) {
        handleUpdatedFormDataEvent(false, event.target.name, null);
      } else if (
        event.target.name === 'billing_cap' &&
        event.target.value === ''
      ) {
        handleUpdatedFormDataEvent(false, event.target.name, null);
      } else if (
        event.target.name === 'company_name' ||
        event.target.name === 'state' ||
        event.target.name === 'city' ||
        event.target.name === 'address'
      ) {
        handleUpdatedFormDataEvent(
          'isCustomerId',
          event.target.name,
          event.target.value,
        );
      } else if (
        event?.target?.name === 'content_optimization' ||
        event?.target?.name === 'design_optimization'
      ) {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value ? event.target.value : null,
        });
        setUpdatedFormData({
          ...updatedFormData,
          [event.target.name]: event.target.value ? event.target.value : null,
        });
      } else {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        setUpdatedFormData({
          ...updatedFormData,
          [event.target.name]: event.target.value,
        });
      }

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
        if (event.target.name === 'zip_code' && customerError?.zip_code) {
          if (event.target.value) {
            updateAgreementErrorMinusValue(sectionError.agreement - 1);
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
      if (event.target.name === 'dsp_fee' && contractError?.dsp_fee) {
        if (event.target.value) {
          updateDspErrorMinusValue(sectionError.dsp - 1);
        } else {
          setSectionError({
            ...sectionError,
            dsp: sectionError.dsp ? sectionError.dsp : 0,
          });
        }
      }

      if (
        (key === 'threshold_type' && contractErrorSalesThreshold) ||
        contractError?.yoy_percentage
      ) {
        setContractError({
          ...contractError,
          sales_threshold: '',
          yoy_percentage: '',
        });
        updateStatementErrorMinusValue(sectionError.statement - 1);
      } else if (event.target.name === 'sales_threshold') {
        if (contractErrorSalesThreshold) {
          setContractError({
            ...contractError,
            sales_threshold: '',
            yoy_percentage: '',
          });
          updateStatementErrorMinusValue(sectionError.statement - 1);
        }
      } else {
        setContractError({
          ...contractError,
          [event.target.name]: '',
        });
      }
    }
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

  const DropdownIndicator = (props) => {
    const { selectProps } = props;
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <img
            src={CaretUp}
            alt="caret"
            style={{
              transform: selectProps.menuIsOpen ? 'rotate(180deg)' : '',
              width: '25px',
              height: '25px',
            }}
          />
        </components.DropdownIndicator>
      )
    );
  };

  const generateDropdown = (item) => {
    if (contractType !== 'one time')
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
                (apiError?.non_field_errors &&
                  apiError.non_field_errors[0] &&
                  item.key === 'primary_marketplace') ||
                (!(formData && formData[item.key]) && item.isMandatory)
                  ? '#FBF2F2'
                  : '#F4F6FC',
              // match with the menu
              // borderRadius: state.isFocused ? '3px 3px 0 0' : 3,
              // Overwrittes the different states of border
              borderColor:
                (apiError?.non_field_errors &&
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
              ? formData.primary_marketplace?.name
                ? {
                    value: formData.primary_marketplace.name,
                    label: formData.primary_marketplace.name,
                  }
                : formData?.primary_marketplace
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

  const tileDisabled = (date, agreementStartDate) => {
    if (formData?.draft_from) {
      return (
        dayjs(date.date).get('date') !== dayjs(agreementStartDate).get('date')
      );
    }
    return false;
  };

  const displayContractType = () => {
    switch (formData && formData.contract_type) {
      case 'recurring':
        return 'Recurring Service Agreement';

      case 'recurring (90 day notice)':
        return 'Recurring (90 day notice) Service Agreement';

      case 'one time':
        return 'One Time Service Agreement';

      case 'dsp only':
        return 'DSP Only Service Agreement';

      default:
        break;
    }
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
          isAllowed={(values) => {
            const { formattedValue, floatValue } = values;
            if (floatValue == null) {
              return formattedValue === '';
            }
            return floatValue <= 100000000;
          }}
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
            agreementData?.start_date
              ? new Date(agreementData?.start_date) > new Date()
                ? new Date()
                : new Date(agreementData?.start_date)
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
          tileDisabled={(date) => tileDisabled(date, agreementData?.start_date)}
        />
      );
    }
    if (item.type === 'choice') {
      return (
        <ContractInputSelect>{generateDropdown(item)}</ContractInputSelect>
      );
    }

    if (item && item.field === 'customer') {
      return (
        <input
          className={
            (customerError && customerError[item?.key]) ||
            (!customer?.[item?.key] && item.isMandatory)
              ? 'form-control form-control-error'
              : 'form-control '
          }
          type="text"
          placeholder={item.placeholder ? item.placeholder : item.label}
          onChange={(event) => handleChange(event, item.key)}
          name={item.key}
          defaultValue={customer?.[item.key]}
        />
      );
    }
    return (
      <input
        className={`form-control ${
          formData && formData[item.key] && item.isMandatory
            ? ''
            : 'form-control-error'
        } ${item.key === 'contract_type' ? 'disabled' : ''}`}
        disabled={item.key === 'contract_type'}
        type="text"
        placeholder={item.placeholder ? item.placeholder : item.label}
        onChange={(event) => handleChange(event, item.key)}
        name={item.key}
        defaultValue={
          item.key === 'contract_type'
            ? displayContractType()
            : formData[item.key]
        }
      />
    );
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
      setOpenCollapse({
        ...openCollapse,
        agreement: false,
        statement: false,
        dspAddendum: false,
        addendum: true,
      });
      executeScroll('addendum');
    }
    if (key === 'feeStructure') {
      setOpenCollapse({
        ...openCollapse,
        agreement: false,
        statement: false,
        dspAddendum: false,
        addendum: false,
        feeStructure: true,
      });
      executeScroll('feeStructure');
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

          if (res?.status === 201) {
            setNewAddendum(res && res.data);
            setOpenCollapse({
              ...openCollapse,
              statement: false,
              dspAddendum: false,
              addendum: true,
            });
            if (updatedFormData?.addendum) {
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
            setOriginalAddendumData(res?.data);
          }
        });
      }
    }
  };

  const changeQuantity = (oneTimeServiceData, flag) => {
    showFooter(true);

    clearOneTimeQntyError(oneTimeServiceData);
    if (additionalOneTimeServicesLength) {
      const changedService = formData.additional_one_time_services.filter(
        (item) => {
          if (
            item.service_id
              ? item.service_id === oneTimeServiceData.value
              : item.service?.id === oneTimeServiceData.value
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

  const displayError = (item) => {
    if (item === 'non_field_errors') {
      return (
        <ErrorMsg>
          {apiError?.non_field_errors && apiError.non_field_errors[0]}
        </ErrorMsg>
      );
    }
    if (item === 'custom_amazon_store_price') {
      return (
        <ErrorMsg>
          {additionalOnetimeSerError?.custom_amazon_store_price}
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
  };

  const onAddDiscount = (flag, accntType = '') => {
    setDiscountFlag({ serviceType: flag, accountType: accntType });
    const result =
      discountData?.length &&
      discountData.filter(
        (item) => item.service_type === flag && item.account_type === accntType,
      );
    if (result) {
      setSelectedDiscount(result);
    }

    setShowDiscountModal(true);
  };

  const onThresholdTypeChange = (event, key, threshold) => {
    setSelectedThreshold(threshold);
    handleChange(event, key);
  };

  const renderRedCrossImgHtml = () => {
    return <img className="red-cross" src={RedCross} alt="right-check" />;
  };
  const renderGreenCheckImgHtml = () => {
    return (
      <img className="green-check-select" src={GreenCheck} alt="right-check" />
    );
  };

  const renderCollapseBtnErrorHtml = (
    isOneTimeService,
    errorTypeCount,
    collapseType,
    RightTickValue,
  ) => {
    return (
      <>
        {errorTypeCount ? (
          collapseType ? (
            renderRedCrossImgHtml()
          ) : (
            <div
              className={
                isOneTimeService ? 'error-bg one-time-service' : 'error-bg'
              }>
              {renderRedCrossImgHtml()}
            </div>
          )
        ) : showRightTick(RightTickValue) ? (
          renderGreenCheckImgHtml()
        ) : (
          ''
        )}
        {isOneTimeService ? (
          <div className="error-found">
            {errorTypeCount
              ? `${agreementErrCount + statementErrCount} ${
                  agreementErrCount + statementErrCount === 1
                    ? 'error found'
                    : 'errors found'
                }`
              : ''}
          </div>
        ) : (
          <div className="error-found">
            {errorTypeCount
              ? `${errorTypeCount} ${
                  errorTypeCount === 1 ? 'error found' : 'errors found'
                } `
              : ''}
          </div>
        )}
      </>
    );
  };

  const displayEditFields = () => {
    return (
      <div className="sidebar">
        <>
          {isEditContract ? (
            <>
              <ServiceAgreementSection
                executeScroll={executeScroll}
                setOpenCollapse={setOpenCollapse}
                openCollapse={openCollapse}
                agreementErrCount={agreementErrCount}
                statementErrCount={statementErrCount}
                renderCollapseBtnErrorHtml={renderCollapseBtnErrorHtml}
                loader={loader}
                generateHTML={generateHTML}
                displayError={displayError}
                showRightTick={showRightTick}
                additionalOneTimeServicesLength={
                  additionalOneTimeServicesLength
                }
                formData={formData}
                nextStep={nextStep}
                onAddDiscount={onAddDiscount}
                additionalMonthlySerError={additionalMonthlySerError}
                oneTimeService={oneTimeService}
                handleChange={handleChange}
                changeQuantity={changeQuantity}
                additionalOnetimeSerError={additionalOnetimeSerError}
                setShowAmazonPlanDropdown={setShowAmazonPlanDropdown}
                amazonService={amazonService}
                showAmazonPlanDropdown={showAmazonPlanDropdown}
                AmazonStoreOptions={AmazonStoreOptions}
                amazonStoreCustom={amazonStoreCustom}
                setAmazonStoreCustom={setAmazonStoreCustom}
                showFooter={showFooter}
                additionalOnetimeServices={additionalOnetimeServices}
                clearOneTimeQntyError={clearOneTimeQntyError}
                updateAdditionalOnetimeServicesSelectedData={
                  updateAdditionalOnetimeServicesSelectedData
                }
                discountData={discountData}
              />

              {agreementData &&
              agreementData.contract_type.includes('recurring') ? (
                <FeeStructureContainer
                  setOpenCollapse={setOpenCollapse}
                  openCollapse={openCollapse}
                  executeScroll={executeScroll}
                  formData={formData}
                  setFormData={setFormData}
                  setUpdatedFormData={setUpdatedFormData}
                  updatedFormData={updatedFormData}
                  loader={loader}
                  nextStep={nextStep}
                  DropdownIndicator={DropdownIndicator}
                  renderCollapseBtnErrorHtml={renderCollapseBtnErrorHtml}
                  revShareOptions={revShare}
                  marketPlacesOptions={marketPlaces}
                  setAdditionalMarketplaces={setAdditionalMarketplaces}
                  thresholdTypeOptions={thresholdTypeOptions}
                  selectedThreshold={selectedThreshold}
                  showFooter={showFooter}
                  sectionError={sectionError}
                  setSectionError={setSectionError}
                  feeStructureErrors={feeStructureErrors}
                  setFeeStructureErrors={setFeeStructureErrors}
                  getMonthlyServices={getMonthlyServices}
                  showRightTick={showRightTick}
                />
              ) : (
                ''
              )}

              <StatementOfWork
                executeScroll={executeScroll}
                setOpenCollapse={setOpenCollapse}
                openCollapse={openCollapse}
                statementErrCount={statementErrCount}
                renderCollapseBtnErrorHtml={renderCollapseBtnErrorHtml}
                loader={loader}
                generateHTML={generateHTML}
                displayError={displayError}
                apiError={apiError}
                thresholdTypeOptions={thresholdTypeOptions}
                onThresholdTypeChange={onThresholdTypeChange}
                selectedThreshold={selectedThreshold}
                formData={formData}
                contractErrorSalesThreshold={contractErrorSalesThreshold}
                contractError={contractError}
                handleChange={handleChange}
                onAddDiscount={onAddDiscount}
                monthlyService={monthlyService}
                showRightTick={showRightTick}
                nextStep={nextStep}
                showAdditionalMarketplace={showAdditionalMarketplace}
                setShowAdditionalMarketplace={setShowAdditionalMarketplace}
                showSection={showSection}
                yoyPercentageOptions={yoyPercentageOptions}
                additionalMonthlySerError={additionalMonthlySerError}
                oneTimeService={oneTimeService}
                changeQuantity={changeQuantity}
                additionalOnetimeSerError={additionalOnetimeSerError}
                setShowAmazonPlanDropdown={setShowAmazonPlanDropdown}
                amazonService={amazonService}
                showAmazonPlanDropdown={showAmazonPlanDropdown}
                amazonStoreCustom={amazonStoreCustom}
                setAmazonStoreCustom={setAmazonStoreCustom}
                AmazonStoreOptions={AmazonStoreOptions}
                showFooter={showFooter}
                setContractError={setContractError}
                setFormData={setFormData}
                setUpdatedFormData={setUpdatedFormData}
                updatedFormData={updatedFormData}
                additionalOnetimeServices={additionalOnetimeServices}
                clearOneTimeQntyError={clearOneTimeQntyError}
                updateAdditionalOnetimeServicesSelectedData={
                  updateAdditionalOnetimeServicesSelectedData
                }
                DropdownIndicator={DropdownIndicator}
                setShowCollpase={setShowCollpase}
                originalData={originalData}
                additionalMonthlyServices={additionalMonthlyServices}
                updateAdditionalMonthlyServices={
                  updateAdditionalMonthlyServices
                }
                setMonthlyAdditionalServices={setMonthlyAdditionalServices}
                fetchUncommonOptions={fetchUncommonOptions}
                getOptions={getOptions}
                additionalMarketplacesData={additionalMarketplacesData}
                agreementData={agreementData}
                setAdditionalMarketplaces={setAdditionalMarketplaces}
                updateAdditionalMarketplaces={updateAdditionalMarketplaces}
                setAdditionalMarketplace={setAdditionalMarketplace}
                setMarketPlaces={setMarketPlaces}
                marketplacesResult={marketplacesResult}
                discountData={discountData}
              />
              <DspAdvertising
                executeScroll={executeScroll}
                loader={loader}
                showSection={showSection}
                setOpenCollapse={setOpenCollapse}
                openCollapse={openCollapse}
                dspErrCount={dspErrCount}
                renderCollapseBtnErrorHtml={renderCollapseBtnErrorHtml}
                showRightTick={showRightTick}
                generateHTML={generateHTML}
                displayError={displayError}
                formData={formData}
                nextStep={nextStep}
              />
              <div className="straight-line sidepanel " />
              <AddendumSection
                showSection={showSection}
                executeScroll={executeScroll}
                setOpenCollapse={setOpenCollapse}
                openCollapse={openCollapse}
                loader={loader}
                newAddendumData={newAddendumData}
                onEditAddendum={onEditAddendum}
                showEditor={showEditor}
                setShowEditor={setShowEditor}
                setNewAddendum={setNewAddendum}
                nextStep={nextStep}
                setShowCollpase={setShowCollpase}
                setUpdatedFormData={setUpdatedFormData}
                showFooter={showFooter}
                updatedFormData={updatedFormData}
                originalAddendumData={originalAddendumData}
              />
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

  return (
    <SidePanel
      className={
        agreementDataContractStatusValue === 'pending account setup' ||
        agreementDataContractStatusValue === 'active' ||
        agreementDataContractStatusValue === 'inactive'
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
AgreementSidePanel.defaultProps = agreementDefaultProptypes;

AgreementSidePanel.propTypes = agreementSidePanelPropTypes;
