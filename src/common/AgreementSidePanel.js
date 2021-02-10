/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import queryString from 'query-string';
import styled from 'styled-components';
import { Collapse } from 'react-collapse';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import DatePicker from 'react-date-picker';
import dayjs from 'dayjs';
import Select from 'react-select';

import Theme from '../theme/Theme';
import {
  ServiceAgreement,
  CreateAddendum,
  StatementWork,
  EditFileIcons,
  ActivityLogIcon,
  ActivityOpenIcon,
  // CompanyDefaultUser,
  GreenCheck,
  // PdfDownload,
  CloseIcon,
  SaveIcon,
  // PlusIcon,
  // MinusIcon,
  // AlarmBellIcon,
} from '../theme/images/index';
// import DefaultUser from '../theme/images/index';
import { Button, FormField } from './index';
import {
  PATH_ADDENDUM,
  PATH_AGREEMENT,
  PATH_STATEMENT,
  PATH_DSP_ADDENDUM,
  PATH_SERVICE_AMENDMENT,
} from '../constants';
import {
  AgreementDetails,
  StatementDetails,
} from '../constants/FieldConstants';
import {
  getLength,
  updateAccountDetails,
  getRevenueShare,
  getMarketplaces,
  createMarketplace,
  updateMarketplace,
  deleteMarketplace,
  createAdditionalServices,
  updateAdditionalServices,
  getMonthlyService,
  getOneTimeService,
  createAddendum,
  // getAddendum,
  // updateAdditionalServices,
} from '../api';
import InputSelect from './InputSelect';
// import CheckBox from './CheckBox';
import PageLoader from './PageLoader';
import ErrorMsg from './ErrorMsg';
import { getAccountDetails } from '../store/actions/accountState';

export default function AgreementSidePanel({
  id,
  setFormData,
  formData,
  agreementData,
  loader,
  // accountURL,
  newAddendumData,
  onEditAddendum,

  // editContractFlag,
  // setEditContractFlag,
  setShowEditor,
  setNewAddendum,
  setNotIncludedOneTimeServices,
  setNotIncludedMonthlyServices,
  sendNotIncludedOneTimeServToAdd,
  sendNotIncludedMonthlyServToAdd,
  saveError,
  showFooter,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [openCollapse, setOpenCollapse] = useState({
    agreement: false,
    statement: false,
    addendum: false,
    dspAddendum: false,
    amendment: false,
  });
  const [showSection, setShowCollpase] = useState({
    addendum: false,
    dspAddendum: false,
    amendment: false,
  });
  const [startDate, setStartDate] = useState();
  const [accountLength, setAccountLength] = useState([]);
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const [apiError, setApiError] = useState({});
  const [revShare, setRevShare] = useState([]);
  const [oneTimeService, setOneTimeService] = useState([]);
  const [monthlyService, setMonthlyService] = useState([]);
  const [marketPlaces, setMarketPlaces] = useState([]);
  const [additionalMarketplaces, setAdditionalMarketplaces] = useState([]);
  const [showAdditionalMarketplace, setShowAdditionalMarketplace] = useState(
    false,
  );
  // const [newOneTime, setNewOneTime] = useState([]);
  // const [showSaveIcon, setShowSaveIcon] = useState(false);
  // const [showEditor, setShowEditor] = useState(false);

  const getMonthlyServiceOptions = (services) => {
    if (
      agreementData &&
      agreementData.additional_monthly_services &&
      agreementData.additional_monthly_services.length
    ) {
      if (services && services.length) {
        const result = [];
        for (const option of services) {
          let isFound = true;
          for (const service of agreementData.additional_monthly_services) {
            if (service.service.id !== option.value) {
              isFound = false;
            } else {
              isFound = true;
              break;
            }
          }
          if (isFound === false) {
            result.push(option);
          }
        }

        setMonthlyService(result);
        if (setNotIncludedMonthlyServices) {
          setNotIncludedMonthlyServices(result);
        }
        if (sendNotIncludedMonthlyServToAdd) {
          sendNotIncludedMonthlyServToAdd(result);
        }
      }
    }
  };

  const fetchUncommonOptions = (options, alreadySelected, func) => {
    let result = [];
    if (alreadySelected) {
      for (const option of options) {
        let isFound = true;
        for (const service of alreadySelected) {
          if (service.service.id !== option.value) {
            isFound = false;
          } else {
            isFound = true;
            break;
          }
        }

        if (isFound === false) {
          result.push(option);
        }
      }
    } else {
      result = options;
    }
    func(result);

    if (setNotIncludedOneTimeServices) {
      setNotIncludedOneTimeServices(result);
    }
    if (sendNotIncludedOneTimeServToAdd) {
      sendNotIncludedOneTimeServToAdd(result);
    }
  };

  useEffect(() => {
    // console.log(agreementData, ' in useeffcect of side');
    getLength().then((len) => {
      setAccountLength(len.data);
    });
    getRevenueShare().then((rev) => {
      setRevShare(rev.data);
    });

    getMonthlyService().then((res) => {
      setMonthlyService(res.data);

      if (
        agreementData &&
        agreementData.additional_monthly_services &&
        agreementData.additional_monthly_services.length
      ) {
        getMonthlyServiceOptions(res.data);
      }
    });

    getOneTimeService().then((r) => {
      setOneTimeService(r && r.data);

      fetchUncommonOptions(
        r.data,
        agreementData.additional_one_time_services,
        setOneTimeService,
      );
    });
    getMarketplaces().then((market) => {
      setMarketPlaces(market.data);
      if (
        agreementData &&
        agreementData.primary_marketplace &&
        agreementData.primary_marketplace.name
      ) {
        setAdditionalMarketplaces(
          market.data.filter(
            (op) => op.value !== agreementData.primary_marketplace.name,
          ),
        );
      } else {
        setAdditionalMarketplaces(market.data);
      }
    });

    // if (history.location.pathname.includes('agreement'))
    //   setOpenCollapse({ agreement: true });
    // if (history.location.pathname.includes('statement'))
    //   setOpenCollapse({ statement: true });
    // if (history.location.pathname.includes('addendum'))
    //   setOpenCollapse({ addendum: true });
    // if (history.location.pathname.includes('dsp-addendum'))
    //   setOpenCollapse({ dspAddendum: true });
    // if (history.location.pathname.includes('service-amendment'))
    //   setOpenCollapse({ amendment: true });
    // if (agreementData && agreementData.additional_one_time_services === null)
    //   setNewOneTime([{ service: {}, quantity: '' }]);

    if (
      (agreementData && agreementData.additional_one_time_services) ||
      (agreementData && agreementData.sales_threshold)
    ) {
      setFormData({
        ...formData,
        additional_one_time_services:
          agreementData && agreementData.additional_one_time_services,
        sales_threshold: agreementData && agreementData.sales_threshold,
      });
    }
  }, []);

  useEffect(() => {
    if (
      agreementData &&
      agreementData.additional_monthly_services &&
      agreementData.additional_monthly_services.length &&
      monthlyService
    ) {
      getMonthlyServiceOptions(monthlyService);
    }
    if (
      agreementData &&
      agreementData.additional_one_time_services &&
      agreementData.additional_one_time_services.length &&
      oneTimeService
    ) {
      fetchUncommonOptions(
        oneTimeService,
        agreementData.additional_one_time_services,
        setOneTimeService,
      );
    }
    return () => {};
  }, [agreementData]);

  const handleChange = (event, key, type, val) => {
    showFooter(true);
    // setShowSaveIcon(true);
    // if (key === 'additional_one_time_services') {
    //   setFormData({ ...formData, additional_one_time_services: event.value });
    // }
    if (type === 'date') {
      setStartDate(event);
      setFormData({ ...formData, [key]: dayjs(event).format('MM-DD-YYYY') });
    } else if (type === 'choice') {
      if (key === 'primary_marketplace') {
        setAdditionalMarketplaces(
          marketPlaces.filter((op) => op.value !== event.value),
        );
      }
      setFormData({ ...formData, [key]: event.value });
      // if (key === 'additional_one_time_services') {
      //   setFormData({ ...formData, [key]: event });
      // }
    } else if (type === 'qty') {
      setFormData({ ...formData, quantity: event.target.value });
    } else if (type === 'multichoice') {
      if (val.action === 'remove-value') {
        if (agreementData[key] !== null) {
          for (const del of agreementData[key]) {
            if (
              del.id !== undefined &&
              (key === 'additional_monthly_services'
                ? del.service.name
                : del.name) === val.removedValue.label
            ) {
              setIsLoading({ loader: true, type: 'page' });
              deleteMarketplace(del.id, key).then(() => {
                dispatch(getAccountDetails(id));
                setIsLoading({ loader: false, type: 'page' });
              });
            }
          }
          if (key === 'additional_monthly_services') {
            const list = [...monthlyService];
            if (list.every((item) => item.value !== val.removedValue.value)) {
              list.push(val.removedValue);
            }
            setMonthlyService(list);
            setNotIncludedMonthlyServices(list);
            if (sendNotIncludedMonthlyServToAdd) {
              sendNotIncludedMonthlyServToAdd(monthlyService);
            }
          }
          //  setNotIncludedServices([...oneTimeService, ...list])
        }
      }
      if (val.action === 'select-option') {
        if (key === 'additional_monthly_services') {
          const montlyserviceData = [];
          montlyserviceData.push({
            contract: agreementData.id,
            name: val.option.label,
            service: val.option.value,
          });

          createAdditionalServices(montlyserviceData).then((res) => {
            if (res && res.status === 400) {
              setIsLoading({ loader: false, type: 'button' });
            }
            if (res && res.status === 201) {
              dispatch(getAccountDetails(id));

              const list = monthlyService.filter(
                (item) => item.value !== res.data[0].service,
              );
              setMonthlyService(list);
              setNotIncludedMonthlyServices(list);
              if (sendNotIncludedMonthlyServToAdd) {
                sendNotIncludedMonthlyServToAdd(monthlyService);
              }
            }
          });
        }

        if (key === 'additional_marketplaces') {
          const marketPlaceData = [];
          // for (const market of formData.additional_marketplaces) {
          marketPlaceData.push({
            contract: agreementData.id,
            is_primary: false,
            name: val.option.label,
          });
          setIsLoading({ loader: true, type: 'page' });

          // }
          createMarketplace(marketPlaceData).then((res) => {
            setIsLoading({ loader: false, type: 'page' });
            if (res && res.status === 201) {
              dispatch(getAccountDetails(id));

              // setOpenCollapse({ ...openCollapse, addendum: true });
              // history.push(PATH_ADDENDUM.replace(':id', id));
            }
          });
        }

        if (agreementData && agreementData[key] && agreementData[key].length) {
          const multi = [].concat(
            event.filter((obj1) =>
              agreementData[key].every(
                (obj2) => obj1.label !== (obj2.name || obj2.service.name),
              ),
            ),
            agreementData[key].filter((obj2) =>
              event.every(
                (obj1) => (obj2.name || obj2.service.name) !== obj1.label,
              ),
            ),
          );

          setFormData({
            ...formData,
            [key]: multi,
          });
        } else {
          const multi = [];
          for (const market of event) {
            multi.push({ value: market.value, label: market.label });
          }
          setFormData({
            ...formData,
            [key]: multi,
          });
        }
      }
    } else {
      if (event.target.name === 'zip_code') {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value.trim(),
        });
      } else {
        setFormData({ ...formData, [event.target.name]: event.target.value });
      }
      setApiError({
        ...apiError,
        [event.target.name]: '',
      });
    }
  };

  const mapSelectValues = (item) => {
    const multi = [];
    if (
      agreementData &&
      agreementData[item.key] &&
      agreementData[item.key].length
    ) {
      for (const month of agreementData[item.key]) {
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
    return agreementData && agreementData[item.key];
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
        options={getOptions(item.key, 'multi')}
        isMulti
        name={item.key}
        onChange={(event, value) =>
          handleChange(event, item.key, 'multichoice', value)
        }
        defaultValue={mapSelectValues(item)}
        isClearable={false}
      />
    );
  };

  const generateDropdown = (item) => {
    return (
      <Select
        classNamePrefix="react-select"
        defaultValue={
          item.key === 'primary_marketplace'
            ? agreementData.primary_marketplace &&
              agreementData.primary_marketplace.name
              ? {
                  value: agreementData.primary_marketplace.name,
                  label: agreementData.primary_marketplace.name,
                }
              : ''
            : agreementData[item.key]
        }
        options={getOptions(item.key, 'single')}
        name={item.key}
        onChange={(event) => handleChange(event, item.key, 'choice')}
      />
    );
  };

  const generateHTML = (item) => {
    if (item.type.includes('number')) {
      return (
        <NumberFormat
          format={item.key === 'zip_code' ? '##########' : null}
          name={item.key}
          className="form-control"
          defaultValue={agreementData[item.key]}
          placeholder={item.label}
          prefix={item.type === 'number-currency' ? '$' : ''}
          suffix={item.type === 'number-percent' ? '%' : ''}
          onChange={(event) => handleChange(event, item.key)}
          thousandSeparator={item.key !== 'zip_code'}
        />
      );
    }
    if (item.type === 'date') {
      return (
        <DatePicker
          className="form-control"
          id="date"
          value={
            startDate ||
            ('' || agreementData[item.key]
              ? new Date(agreementData[item.key])
              : '')
          }
          onChange={(date) => handleChange(date, 'start_date', 'date')}
          format="MM-dd-yyyy"
          clearIcon={null}
        />
      );
    }
    if (item.type === 'choice') {
      return <InputSelect>{generateDropdown(item)}</InputSelect>;
    }
    if (item && item.type === 'multichoice') {
      return <InputSelect>{generateMultiChoice(item)}</InputSelect>;
    }
    return (
      <input
        className="form-control"
        type="text"
        placeholder={item.label}
        onChange={(event) => handleChange(event, item.key)}
        name={item.key}
        defaultValue={agreementData[item.key]}
      />
    );
  };

  const saveAdditionalOneTimeService = (field, serviceId, index) => {
    const data = {
      name: (field && field.service && field.service).name
        ? field.service.name
        : '',
      service: (field && field.service && field.service).id
        ? field.service.id
        : field.service,
      quantity: field && field.quantity,
      contract: agreementData.id,
    };
    if (field && field.service && field.service.name) {
      data.custom_amazon_store_price = field && field.custom_amazon_store_price;
    }

    setIsLoading({ loader: true, type: 'page' });
    if (serviceId) {
      updateAdditionalServices(serviceId, data).then((res) => {
        dispatch(getAccountDetails(id));
        if (res && res.status === 400) {
          setIsLoading({ loader: false, type: 'page' });
          setApiError(res && res.data);
        }
        if (res && res.status === 200) {
          // setOpenCollapse({ ...openCollapse, addendum: true });
        }

        setIsLoading({ loader: false, type: 'page' });
      });
    } else {
      createAdditionalServices(data).then((res) => {
        dispatch(getAccountDetails(id));

        if (res && res.status === 400) {
          setIsLoading({ loader: false, type: 'page' });
          setApiError(res && res.data);
        }
        if (res && res.status === 201) {
          // setOpenCollapse({ ...openCollapse, addendum: true });

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
          if (sendNotIncludedOneTimeServToAdd) {
            sendNotIncludedOneTimeServToAdd(oneTimeService);
          }
          //  setNotIncludedServices([...list, ...monthlyService])
        }
        setIsLoading({ loader: false, type: 'page' });
      });
    }
  };

  const nextStep = (key) => {
    if (key === 'statement') {
      if (formData && Object.keys(formData).length) {
        if (formData && formData.start_date) {
          formData.start_date = dayjs(formData.start_date).format('YYYY-MM-DD');
        }
        setIsLoading({ loader: true, type: 'button' });
        const data = {
          ...formData,
          steps_completed: {
            ...agreementData.steps_completed,
            agreement: true,
          },
        };
        updateAccountDetails(agreementData.id, data).then((response) => {
          if (response && response.status === 400) {
            setIsLoading({ loader: false, type: 'button' });
            setApiError(response && response.data);
          } else if (response && response.status === 200) {
            setOpenCollapse({ agreement: false, statement: true });
            history.push(PATH_STATEMENT.replace(':id', id));
            setIsLoading({ loader: false, type: 'button' });
          }
        });
      } else {
        const data = {
          steps_completed: {
            ...agreementData.steps_completed,
            agreement: true,
          },
        };
        updateAccountDetails(agreementData.id, data).then((response) => {
          if (response && response.status === 200) {
            setOpenCollapse({ agreement: false, statement: true });
          }
        });
        history.push(PATH_STATEMENT.replace(':id', id));
      }
    }
    if (key === 'addendum') {
      if (formData && Object.keys(formData).length) {
        setIsLoading({ loader: true, type: 'button' });
        // if (formData && formData.additional_monthly_services) {
        //   const multi = [];
        //   for (const market of formData.additional_monthly_services) {
        //     multi.push({
        //       contract: agreementData.id,
        //       name: market.label,
        //       service: market.value,
        //     });
        //   }

        //   createAdditionalServices(multi).then((res) => {
        //     if (res && res.status === 400) {
        //       setIsLoading({ loader: false, type: 'button' });
        //     }
        //     if (res && res.status === 201) {
        //       setOpenCollapse({ ...openCollapse, addendum: true });
        //     }
        //   });
        // }
        if (formData && formData.primary_marketplace) {
          const data = {
            id:
              (agreementData &&
                agreementData.primary_marketplace &&
                agreementData.primary_marketplace.id) ||
              '',
            contract: agreementData.id,
            name: formData && formData.primary_marketplace,
            is_primary: true,
          };
          if (
            agreementData.primary_marketplace &&
            agreementData.primary_marketplace.id
          ) {
            updateMarketplace(agreementData.primary_marketplace.id, data).then(
              (res) => {
                if (res && res.status === 200) {
                  setOpenCollapse({ ...openCollapse, addendum: true });
                  history.push(PATH_ADDENDUM.replace(':id', id));
                  setIsLoading({ loader: false, type: 'button' });
                }
              },
            );
          } else {
            createMarketplace(data).then((res) => {
              if (res && res.status === 201) {
                setOpenCollapse({ ...openCollapse, addendum: true });
                history.push(PATH_ADDENDUM.replace(':id', id));
                setIsLoading({ loader: false, type: 'button' });
              }
            });
          }
        }

        // if (formData && formData.additional_marketplaces) {
        //   const multi = [];
        //   for (const market of formData.additional_marketplaces) {
        //     multi.push({
        //       contract: agreementData.id,
        //       is_primary: false,
        //       name: market.value,
        //     });
        //   }
        //   createMarketplace(multi).then((res) => {
        //     if (res && res.status === 201) {
        //       setOpenCollapse({ ...openCollapse, addendum: true });
        //       history.push(PATH_ADDENDUM.replace(':id', id));
        //       setIsLoading({ loader: false, type: 'button' });
        //     }
        //   });
        // }

        // for (const service of formData.additional_one_time_services) {
        //   saveAdditionalOneTimeService(service, service.id);
        // }
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
            ...agreementData.steps_completed,
            agreement: true,
            statement: true,
          },
        };
        updateAccountDetails(agreementData.id, detail).then((response) => {
          if (response && response.status === 400) {
            setIsLoading({ loader: false, type: 'button' });
            setApiError(response && response.data);
          } else if (response && response.status === 200) {
            setOpenCollapse({
              agreement: false,
              statement: false,
              addendum: true,
            });
            history.push(PATH_ADDENDUM.replace(':id', id));
            setIsLoading({ loader: false, type: 'button' });
          }
        });
      } else {
        setIsLoading({ loader: true, type: 'button' });
        const data = {
          steps_completed: { agreement: true, statement: true },
        };
        updateAccountDetails(agreementData.id, data).then((response) => {
          if (response && response.status === 200) {
            setOpenCollapse({
              agreement: false,
              statement: false,
              addendum: true,
            });
            history.push(PATH_ADDENDUM.replace(':id', id));
            setIsLoading({ loader: false, type: 'button' });
          }
        });
        history.push(PATH_STATEMENT.replace(':id', id));
      }
    }
    if (key === 'final') {
      if (newAddendumData) {
        const addendumData = {
          customer_id: id,
          addendum: newAddendumData && newAddendumData.addendum,
          contract: agreementData.id,
          steps_completed: { agreement: true, statement: true, addendum: true },
        };
        setIsLoading({ loader: true, type: 'page' });

        createAddendum(addendumData).then((res) => {
          setIsLoading({ loader: false, type: 'page' });
          setNewAddendum(res && res.data);
        });

        const data = {
          steps_completed: {
            ...agreementData.steps_completed,
            agreement: true,
            statement: true,
            addendum: true,
          },
        };
        setIsLoading({ loader: true, type: 'page' });

        updateAccountDetails(agreementData.id, data).then((response) => {
          setIsLoading({ loader: false, type: 'page' });

          if (response && response.status === 200) {
            setOpenCollapse({
              agreement: false,
              statement: false,
              addendum: false,
            });
            setShowEditor(false);
            // setEditContractFlag(false);
          }
        });
        // setOpenCollapse({
        //   agreement: false,
        //   statement: false,
        //   addendum: false,
        // });

        const stringified = queryString.stringify({
          step: 'select-contact',
        });
        history.push({
          pathname: `${history.location.pathname}`,
          search: stringified,
        });
      }
    }
  };

  const deleteOneTimeService = (field, key) => {
    if (field.id) {
      setIsLoading({ loader: true, type: 'page' });
      deleteMarketplace(field.id, key).then(() => {
        dispatch(getAccountDetails(id));
        setIsLoading({ loader: false, type: 'page' });

        const originalList = [...formData.additional_one_time_services];
        const updatedList = originalList.filter((item) => item.id !== field.id);
        setFormData({ ...formData, additional_one_time_services: updatedList });

        const list = [...oneTimeService];
        const data = { label: field.service.name, value: field.service.id };
        list.push(data);
        setOneTimeService(list);

        setNotIncludedOneTimeServices(list);
        if (sendNotIncludedOneTimeServToAdd) {
          sendNotIncludedOneTimeServToAdd(oneTimeService);
        }
        //  setNotIncludedServices([...list, ...monthlyService])

        // setOneTimeService([...oneTimeService, ...field]);
      });
    } else {
      const list = [...formData.additional_one_time_services];
      list.pop();
      setFormData({ ...formData, additional_one_time_services: list });
      // newOneTime.pop();
      // setNewOneTime([...newOneTime]);
      // delete formData.additional_one_time_services;
      // delete formData.quantity;
      // setFormData({ ...formData });
    }
  };

  // const deleteOneTime = (index) => {
  //   if (index && index.includes('AS')) {
  //     deleteMarketplace(index, 'additional_one_time_services').then(() => {
  //       accountURL();
  //       setShowSaveIcon(false);
  //     });
  //   } else {
  //     const list = [...newOneTime];
  //     list.splice(index, 1);
  //     setNewOneTime(list);
  //   }
  // };

  // const saveOneTime = () => {
  //   const multi = {
  //     contract: agreementData.id,
  //     service: formData.additional_one_time_services,
  //     quantity: formData.quantity,
  //   };

  //   createAdditionalServices(multi).then((res) => {
  //     if (res && res.status === 400) {
  //       setIsLoading({ loader: false, type: 'button' });
  //     }
  //     if (res && res.status === 201) {
  //       accountURL();
  //       setShowSaveIcon(false);
  //     }
  //   });
  // };

  const handleOneTimeService = (event, index, field, type) => {
    showFooter(true);
    const list = [...formData.additional_one_time_services];
    if (type === 'quantity') {
      list[index][type] = event.target.value;
    } else if (type === 'service') {
      const service = { id: event.value, name: event.label };
      list[index][type] = { ...list[index], ...service };
    } else if (type === 'fee') {
      list[index] = { ...list[index], [event.target.name]: event.target.value };
    }

    setFormData({ ...formData, additional_one_time_services: list });
  };

  const generateOneTimeHTML = (field, key, index) => {
    return (
      <div className="row">
        <div
          className={
            field &&
            field.service &&
            field.service.name === 'Amazon Store Package Custom'
              ? 'col-4 mt-1 pr-0'
              : 'col-7 mt-1'
          }>
          <Select
            classNamePrefix="react-select"
            placeholder="Select"
            defaultValue={{
              label:
                field && field.service && field.service.name
                  ? field.service.name
                  : field &&
                    field.additional_services &&
                    field.additional_services.label
                  ? field.additional_services.label
                  : '',
              value:
                field && field.service && field.service.name
                  ? field.service.name
                  : field &&
                    field.additional_services &&
                    field.additional_services.label
                  ? field.additional_services.label
                  : '',
            }}
            options={oneTimeService}
            name={field}
            isDisabled={field && field.id}
            onChange={
              (event) => handleOneTimeService(event, index, field, 'service')
              // handleChange(event, 'additional_one_time_services', 'choice')
            }
          />
          <ErrorMsg>
            {apiError && apiError.service && apiError.service[0]}
            {saveError && saveError.service && saveError.service[0]}
          </ErrorMsg>
        </div>
        <div className="col-3">
          <NumberFormat
            name="quantity"
            className="form-control"
            placeholder="Qty"
            onChange={
              (event) => handleOneTimeService(event, index, field, 'quantity')
              //  handleChange(event, key, 'quantity')
            }
            defaultValue={(field && field.quantity) || ''}
            // thousandSeparator
          />
          <ErrorMsg>
            {apiError && apiError.quantity && apiError.quantity[0]}
            {saveError && saveError.quantity && saveError.quantity[0]}
          </ErrorMsg>
        </div>
        {field &&
        field.service &&
        field.service.name === 'Amazon Store Package Custom' ? (
          <div className="col-3">
            <NumberFormat
              name="custom_amazon_store_price"
              className="form-control"
              placeholder="Fee"
              onChange={
                (event) => handleOneTimeService(event, index, field, 'fee')
                //  handleChange(event, key, 'quantity')
              }
              defaultValue={(field && field.custom_amazon_store_price) || ''}
              // thousandSeparator
            />
            <ErrorMsg>
              {apiError && apiError.quantity && apiError.quantity[0]}
              {saveError && saveError.quantity && saveError.quantity[0]}
            </ErrorMsg>
          </div>
        ) : (
          ''
        )}
        <div className="col-2">
          <img
            src={CloseIcon}
            alt="close"
            className="cursor cross-icon one-time mr-2"
            onClick={() => deleteOneTimeService(field, key)}
            role="presentation"
          />
          {/* {field && field.id ? (
            ''
          ) : ( */}
          {((field && field.service && field.service.name) ||
            (field &&
              field.additional_services &&
              field.additional_services.label)) &&
          field &&
          field.quantity ? (
            <img
              className="one-time save cursor"
              src={SaveIcon}
              alt="save"
              role="presentation"
              onClick={() =>
                saveAdditionalOneTimeService(field, field && field.id, index)
              }
            />
          ) : (
            ''
          )}
          {/* )} */}
        </div>
      </div>
    );
  };

  const generateOneTimeService = () => {
    const fields = [];

    if (
      formData &&
      formData.additional_one_time_services &&
      formData.additional_one_time_services.length
    ) {
      formData.additional_one_time_services.forEach((field, index) => {
        fields.push(
          generateOneTimeHTML(field, 'additional_one_time_services', index),
        );
      });
    }
    // if (agreementData && agreementData[key] && agreementData[key].length) {
    //   agreementData[key].forEach((field, index) => {
    //     fields.push(generateOneTimeHTML(field, key, index));
    //   });
    // }
    // if (newOneTime && newOneTime.length !== 0)
    //   newOneTime.forEach((field, index) => {
    //     fields.push(generateOneTimeHTML(field, key, index));
    //   });
    return fields;
  };

  const addNewService = () => {
    let list = [];
    if (formData.additional_one_time_services) {
      list = [...formData.additional_one_time_services];
    }
    list.push({ service: {}, quantity: '' });
    setFormData({ ...formData, additional_one_time_services: list });
    // setNewOneTime([...formData,]);
  };
  const handleShowCollapse = (event, section) => {
    setShowCollpase({ ...showSection, [section]: event.target.checked });
  };

  return (
    <SidePanel>
      <input
        className="d-lg-none d-md-block"
        data-function="swipe"
        id="swipe"
        type="checkbox"
        defaultChecked
      />
      <label className="d-lg-none" data-function="swipe" htmlFor="swipe">
        <div className="activity-icon">
          <img
            data-tip="View Activity Log"
            src={ActivityLogIcon}
            alt="log-close"
          />{' '}
        </div>
      </label>
      <label
        className="d-lg-none  d-md-block"
        data-function="swipe"
        htmlFor="swipe">
        <div className="activity-icon">
          <img src={ActivityOpenIcon} alt="log-open" />{' '}
        </div>
      </label>
      <div className="sidebar">
        {/* {editContractFlag ? ( */}
        <>
          <div
            className="collapse-btn mt-3"
            role="presentation"
            type="button"
            onClick={() => {
              setOpenCollapse({ agreement: !openCollapse.agreement });
              history.push(PATH_AGREEMENT.replace(':id', id));
            }}>
            <img className="service-agre" src={ServiceAgreement} alt="pdf" />
            <h4 className="sendar-details mt-1 ml-5">
              Service Agreement{' '}
              {agreementData.steps_completed &&
              agreementData.steps_completed.agreement ? (
                <img
                  className="green-check-select ml-4"
                  src={GreenCheck}
                  alt="right-check"
                />
              ) : (
                ''
              )}
            </h4>
            <div className="clear-fix" />
          </div>
          <Collapse isOpened={openCollapse.agreement}>
            {loader ? (
              <PageLoader component="activityLog" color="#FF5933" type="page" />
            ) : (
              <ul className="collapse-inner">
                {AgreementDetails.map((item) => (
                  <li key={item.key}>
                    <FormField>
                      <label htmlFor={item.key}>
                        {item.label}
                        {generateHTML(item)}
                      </label>
                      <ErrorMsg>
                        {apiError &&
                          apiError[item.key] &&
                          apiError[item.key][0]}
                        {saveError &&
                          saveError[item.key] &&
                          saveError[item.key][0]}
                      </ErrorMsg>
                    </FormField>
                  </li>
                ))}
                {/* {agreementData && agreementData.contract_type === 'one time' ? (
                  <>
                    <li>
                      <FormField>
                        <label htmlFor="additional_one_time_services">
                          <div className="row">
                            <div className="col-10">
                              Additional One Time Services
                            </div>
                          </div>
                          {generateOneTimeService(
                            'additional_one_time_services',
                          )}
                        </label>
                      </FormField>
                    </li>
                    {oneTimeService && oneTimeService.length ? (
                      <li>
                        <div
                          className="add-market-place cursor float-right"
                          onClick={() => addNewService()}
                          role="presentation">
                          {' '}
                          + Add Additional One Time Services
                        </div>
                      </li>
                    ) : (
                      ''
                    )}
                  </>
                ) : (
                  ''
                )} */}
                <li>
                  <Button
                    className="btn-primary sidepanel mt-2 mb-3 w-100"
                    onClick={() => nextStep('statement')}>
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
          <div className="straight-line sidepanel " />
          <div
            className="collapse-btn"
            role="presentation"
            type="button"
            onClick={() => {
              setOpenCollapse({ statement: !openCollapse.statement });
              history.push(PATH_STATEMENT.replace(':id', id));
            }}>
            <img className="service-agre" src={StatementWork} alt="pdf" />
            <h4 className="sendar-details mt-1 ml-5">
              Statement of Work{' '}
              {agreementData.steps_completed &&
              agreementData.steps_completed.statement ? (
                <img
                  className="green-check-select ml-4"
                  src={GreenCheck}
                  alt="right-check"
                />
              ) : (
                ''
              )}
            </h4>
            <div className="clear-fix" />
          </div>
          <Collapse isOpened={openCollapse.statement}>
            {loader || (isLoading.loader && isLoading.type === 'page') ? (
              <PageLoader component="activityLog" color="#FF5933" type="page" />
            ) : (
              <>
                <ul className="collapse-inner">
                  {StatementDetails.map((item) => (
                    <React.Fragment key={item.key}>
                      {item.key !== 'additional_marketplaces' &&
                      item.key !== 'additional_one_time_services' ? (
                        <>
                          <li>
                            <FormField>
                              <label htmlFor={item.key}>
                                {item.label}
                                {generateHTML(item)}
                              </label>
                            </FormField>
                          </li>

                          {!showAdditionalMarketplace &&
                          item.key === 'primary_marketplace' &&
                          agreementData &&
                          agreementData.additional_marketplaces === null ? (
                            <li>
                              <div
                                className="add-market-place cursor float-right"
                                onClick={() =>
                                  setShowAdditionalMarketplace(true)
                                }
                                role="presentation">
                                {' '}
                                + Add Marketplace Channel
                              </div>
                            </li>
                          ) : (
                            ''
                          )}
                        </>
                      ) : (
                        <>
                          {showAdditionalMarketplace ||
                          (agreementData &&
                            agreementData.additional_marketplaces &&
                            agreementData.additional_marketplaces.length &&
                            item.key !== 'additional_one_time_services') ? (
                            <li>
                              {isLoading.loader && isLoading.type === 'page' ? (
                                <PageLoader
                                  component="activityLog"
                                  color="#FF5933"
                                  type="page"
                                />
                              ) : (
                                <FormField>
                                  <label htmlFor={item.key}>
                                    {item.label}
                                    {generateHTML(item)}
                                  </label>
                                </FormField>
                              )}
                            </li>
                          ) : (
                            ''
                          )}
                        </>
                      )}
                    </React.Fragment>
                  ))}
                  <li>
                    <FormField>
                      <label htmlFor="additional_one_time_services">
                        <div className="row">
                          <div className="col-10">
                            Additional One Time Services
                          </div>
                          {/* <div className="col-3">Quantity</div> */}
                        </div>
                        {generateOneTimeService('additional_one_time_services')}
                      </label>
                    </FormField>
                  </li>
                  {oneTimeService && oneTimeService.length ? (
                    <li>
                      <div
                        className="add-market-place cursor float-right"
                        onClick={() => addNewService()}
                        role="presentation">
                        {' '}
                        + Add Additional One Time Services
                      </div>
                    </li>
                  ) : (
                    ''
                  )}
                  {/* <li>
                    <FormField>
                      <label htmlFor="additional_one_time_services" />
                      Additional Monthly Services
                    </FormField>

                    <CheckBox className="gray-check mt-3">
                      <label
                        className="container customer-pannel"
                        htmlFor="contract-copy-check">
                        Customer Service
                        <input type="checkbox" id="contract-copy-check" />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>

                    <CheckBox className="gray-check mt-2">
                      <label
                        className="container customer-pannel"
                        htmlFor="contract-copy-check">
                        Logistics Management
                        <input type="checkbox" id="contract-copy-check" />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>
                    <CheckBox className="gray-check mt-2">
                      <label
                        className="container customer-pannel"
                        htmlFor="contract-copy-check">
                        Inventory Reconciliation
                        <input type="checkbox" id="contract-copy-check" />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>
                    <CheckBox className="gray-check mt-2">
                      <label
                        className="container customer-pannel"
                        htmlFor="contract-copy-check">
                        DSP Advertising
                        <input type="checkbox" id="contract-copy-check" />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>
                    <CheckBox className="gray-check mt-2">
                      <label
                        className="container customer-pannel"
                        htmlFor="contract-copy-check">
                        Additional Marketplaces
                        <input type="checkbox" id="contract-copy-check" />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>
                  </li>
                  <li>
                    <FormField>
                      <label htmlFor="additional_one_time_services" />
                      Additional One-Time Services
                    </FormField>
                    <div className="row mt-3">
                      <div className="col-7">
                        {' '}
                        <CheckBox className="gray-check">
                          <label
                            className="container customer-pannel"
                            htmlFor="contract-copy-check">
                            A+ Content
                            <input type="checkbox" id="contract-copy-check" />
                            <span className="checkmark" />
                          </label>
                        </CheckBox>
                      </div>
                      <div className="col-5 mt-2">
                        <button type="button" className="increment">
                          <img className="plus-icon" src={PlusIcon} alt="" />
                        </button>
                        <input className="max-min-number" type="number" />
                        <button type="button" className="decrement">
                          {' '}
                          <img className="minus-icon" src={MinusIcon} alt="" />
                        </button>
                      </div>
                      <div className="col-7 mt-2">
                        {' '}
                        <CheckBox className="gray-check">
                          <label
                            className="container customer-pannel"
                            htmlFor="contract-copy-check">
                            Infographics
                            <input type="checkbox" id="contract-copy-check" />
                            <span className="checkmark" />
                          </label>
                        </CheckBox>
                      </div>
                      <div className="col-5 mt-2">
                        <button type="button" className="increment">
                          <img className="plus-icon" src={PlusIcon} alt="" />
                        </button>
                        <input className="max-min-number" type="number" />
                        <button type="button" className="decrement">
                          {' '}
                          <img className="minus-icon" src={MinusIcon} alt="" />
                        </button>
                      </div>
                      <div className="col-7 mt-2">
                        {' '}
                        <CheckBox className="gray-check">
                          <label
                            className="container customer-pannel"
                            htmlFor="contract-copy-check">
                            Amazon Brand Style Guide
                            <input type="checkbox" id="contract-copy-check" />
                            <span className="checkmark" />
                          </label>
                        </CheckBox>
                      </div>
                      <div className="col-5 mt-2">
                        <button type="button" className="increment">
                          <img className="plus-icon" src={PlusIcon} alt="" />
                        </button>
                        <input className="max-min-number" type="number" />
                        <button type="button" className="decrement">
                          {' '}
                          <img className="minus-icon" src={MinusIcon} alt="" />
                        </button>
                      </div>
                      <div className="col-7 mt-2">
                        {' '}
                        <CheckBox className="gray-check">
                          <label
                            className="container customer-pannel"
                            htmlFor="contract-copy-check">
                            Product Insert
                            <input type="checkbox" id="contract-copy-check" />
                            <span className="checkmark" />
                          </label>
                        </CheckBox>
                      </div>
                      <div className="col-5 mt-2">
                        <button type="button" className="increment">
                          <img className="plus-icon" src={PlusIcon} alt="" />
                        </button>
                        <input className="max-min-number" type="number" />
                        <button type="button" className="decrement">
                          {' '}
                          <img className="minus-icon" src={MinusIcon} alt="" />
                        </button>
                      </div>
                      <div className="col-7 mt-2">
                        {' '}
                        <CheckBox className="gray-check">
                          <label
                            className="container customer-pannel"
                            htmlFor="contract-copy-check">
                            Listing Copy
                            <input type="checkbox" id="contract-copy-check" />
                            <span className="checkmark" />
                          </label>
                        </CheckBox>
                      </div>
                      <div className="col-5 mt-2">
                        <button type="button" className="increment">
                          <img className="plus-icon" src={PlusIcon} alt="" />
                        </button>
                        <input className="max-min-number" type="number" />
                        <button type="button" className="decrement">
                          {' '}
                          <img className="minus-icon" src={MinusIcon} alt="" />
                        </button>
                      </div>
                      <div className="col-7 mt-2">
                        {' '}
                        <CheckBox className="gray-check">
                          <label
                            className="container customer-pannel"
                            htmlFor="contract-copy-check">
                            Amazon Store
                            <input type="checkbox" id="contract-copy-check" />
                            <span className="checkmark" />
                          </label>
                        </CheckBox>
                      </div>
                      <div className="col-5 mt-2">
                        <button type="button" className="increment">
                          <img className="plus-icon" src={PlusIcon} alt="" />
                        </button>
                        <input className="max-min-number" type="number" />
                        <button type="button" className="decrement">
                          {' '}
                          <img className="minus-icon" src={MinusIcon} alt="" />
                        </button>
                      </div>
                    </div>
                  </li> */}

                  {/* <li>
                  <Button
                    className="btn-primary on-boarding sidepanel mt-2 mb-3 w-100"
                    onClick={() => nextStep('addendum')}>
                    {isLoading.loader && isLoading.type === 'button' ? (
                      <PageLoader color="#fff" type="button" />
                    ) : (
                      'Proceed to Next Section'
                    )}
                  </Button>
                </li> */}

                  <li>
                    <Button
                      className={
                        formData.additional_one_time_services
                          ? 'btn-primary on-boarding sidepanel mt-2 mb-3 w-100 '
                          : 'btn-primary on-boarding sidepanel mt-2 mb-3 w-100 '
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
              </>
            )}
          </Collapse>
          <div className="straight-line sidepanel " />
          <div>
            <div
              className={
                showSection && showSection.addendum
                  ? 'collapse-btn '
                  : 'collapse-btn disabled'
              }
              role="presentation"
              type="button"
              onClick={() => {
                setOpenCollapse({ addendum: !openCollapse.addendum });
                history.push(PATH_ADDENDUM.replace(':id', id));
              }}>
              <img className="service-agre" src={CreateAddendum} alt="pdf" />
              <h4 className="sendar-details mt-1 ml-5">Create Addendum </h4>
              <div className="clear-fix" />
            </div>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  onClick={(event) => handleShowCollapse(event, 'addendum')}
                />
                <span className="slider round" />
              </label>
            </div>
          </div>
          <Collapse isOpened={openCollapse.addendum}>
            <ul className="collapse-inner">
              <li>
                <p className="small-para contract mt-0">
                  Want to make changes to the contract? Create Addendum to the
                  contract.
                </p>
                {newAddendumData && newAddendumData.id ? (
                  <Button
                    className=" btn-transparent sidepanel mt-3 mb-3 w-100"
                    onClick={() => onEditAddendum()}>
                    <img
                      className="edit-folder-icon mr-2"
                      src={EditFileIcons}
                      alt="edit "
                    />
                    Edit Addendum
                  </Button>
                ) : (
                  <>
                    <Button
                      className={
                        (newAddendumData &&
                          !Object.keys(newAddendumData).length) ||
                        (newAddendumData &&
                          newAddendumData.addendum &&
                          newAddendumData.addendum.includes('<p></p>'))
                          ? ' btn-gray sidepanel on-boarding mt-3 mb-3 w-100 disabled'
                          : 'btn-primary sidepanel on-boarding mt-3 mb-3 w-100  '
                      }
                      onClick={() => nextStep('final')}>
                      Save Addendum
                    </Button>
                    <Button className="btn-transparent sidepanel on-boarding mt-3 mb-3 w-100">
                      Cancel
                    </Button>
                  </>
                )}
              </li>
            </ul>
          </Collapse>
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
              setOpenCollapse({ dspAddendum: !openCollapse.dspAddendum });
              history.push(PATH_DSP_ADDENDUM.replace(':id', id));
            }}>
            <img className="service-agre" src={CreateAddendum} alt="pdf" />
            <h4 className="sendar-details mt-1 ml-5">
              DSP Addendum{' '}
              {/* {agreementData.steps_completed &&
              agreementData.steps_completed.dspAddendum ? (
                <img
                  className="green-check-select ml-4"
                  src={GreenCheck}
                  alt="right-check"
                />
              ) : (
                ''
              )} */}
            </h4>
            <div className="clear-fix" />
          </div>
          <div>
            <label className="switch">
              <input
                type="checkbox"
                onClick={(event) => handleShowCollapse(event, 'dspAddendum')}
              />
              <span className="slider round" />
            </label>
          </div>
          <Collapse isOpened={openCollapse.dspAddendum}>
            <ul className="collapse-inner">
              <li>DSP</li>
            </ul>
          </Collapse>

          <div className="straight-line sidepanel " />
          <div
            className={
              showSection && showSection.amendment
                ? 'collapse-btn   '
                : 'collapse-btn  disabled '
            }
            role="presentation"
            type="button"
            onClick={() => {
              setOpenCollapse({ dspAddendum: !openCollapse.amendment });
              history.push(PATH_SERVICE_AMENDMENT.replace(':id', id));
            }}>
            <img className="service-agre" src={CreateAddendum} alt="pdf" />
            <h4 className="sendar-details mt-1 ml-5">
              One time Amendment{' '}
              {/* {agreementData.steps_completed &&
              agreementData.steps_completed.dspAddendum ? (
                <img
                  className="green-check-select ml-4"
                  src={GreenCheck}
                  alt="right-check"
                />
              ) : (
                ''
              )} */}
            </h4>
            <div className="clear-fix" />
          </div>
          <div>
            <label className="switch">
              <input
                type="checkbox"
                onClick={(event) => handleShowCollapse(event, 'amendment')}
              />
              <span className="slider round" />
            </label>
          </div>
          <Collapse isOpened={openCollapse.amendment}>
            <ul className="collapse-inner">
              <li>One time Amendment</li>
            </ul>
          </Collapse>

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
          {/* <div className="activity-log">Activity Log </div>
        <ul className="menu">
          <li>
            <img className="default-user" src={CompanyDefaultUser} alt="" />

            <div className="activity-user">
              Kathey <span> updated the contract </span>
              <div className="time-date mt-1">10/22/2020 at 11:20AM MST</div>
            </div>
            <div className="clear-fix" />
          </li>
          <li>
            <img className="default-user" src={CompanyDefaultUser} alt="" />

            <div className="activity-user">
              Kathey <span> updated the contract </span>
              <div className="time-date mt-1">10/22/2020 at 11:20AM MST</div>
            </div>
            <div className="clear-fix" />
          </li>
        </ul>

        <div className=" activity-log current-agreement-title">
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
  sendNotIncludedOneTimeServToAdd: () => {},
  sendNotIncludedMonthlyServToAdd: () => {},
  saveError: {},
  showFooter: () => {},
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
  sendNotIncludedOneTimeServToAdd: PropTypes.func,
  sendNotIncludedMonthlyServToAdd: PropTypes.func,
  saveError: PropTypes.shape({
    quantity: PropTypes.arrayOf(PropTypes.string),
    service: PropTypes.arrayOf(PropTypes.string),
  }),
  showFooter: PropTypes.func,
};

const SidePanel = styled.div`
  // width: 335px;
   min-width: 60px;
   padding-bottom:200px;
  max-width: 345px;
  position: fixed;
  top: 71px;
  right: 0;
  height: 100%;
  background: ${Theme.white};
  border-left: 1px solid ${Theme.gray7};
  overflow:auto;

.green-check-select {
  width:16px;
}
 
  .sendar-details {
    color: ${Theme.black};
    letter-spacing: 1.21px;
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
  padding:15px;
  cursor:pointer;

 
}
.collapse-container {
    padding:15px;
}

.collapse-inner {
    margin:0;
    padding:0;
    list-style-type:none;
   
    li {
        padding:10px 20px;

        &:focus {
            background:#ffe5df;
          
        }
         .small-para {
          max-width:218px;
          width:100%;
          margin:0 auto;
         }

        .edit-folder-icon {
          vertical-align: text-top;
          width: 17px;
        }

        .service-heading {
          text-transform:uppercase;
          letter-spacing: 1.13px;
          text-transform: uppercase;
          font-family: ${Theme.baseFontFamily};
          font-size:12px;
          color: #b0bac9;
          font-weight: bold;
        }

        .increment {
           border: 1px solid #DFE7FF;
            border-radius:  8px 0 0 8px ;
            width: 32px;
           background: ${Theme.gray5};
           cursor:pointer;

           .plus-icon{
             width:10px;
           }

           &:focus{
             outline:none;
           }
        }
        .decrement {
           border: 1px solid #DFE7FF;
            border-radius: 0 8px 8px 0;
            width: 32px;
           background: ${Theme.gray5};
           cursor:pointer;

           .minus-icon {
              width:10px;
           }
             &:focus{
             outline:none;
           }
        }
        .max-min-number {
          width:20px;
           border: 1px solid #DFE7FF;
        }
    }
} 
.activity-log {
    font-size: ${Theme.extraSmall};
    padding:20px 20px 0 20px;
    letter-spacing: 1.13px;
    color: ${Theme.gray30};
    font-weight:bold;
    text-transform: uppercase;
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
        padding: 10px 0px 15px 25px;
      
        &:last-child {
          border-bottom:none;
        }

        .activity-user {
          font-size: ${Theme.normal};
          color:${Theme.gray90};
          float: left;
          max-width: 220px;
          text-align: left;

          span {
            color:${Theme.gray35};
            font-weight: 500;
            
          }
        }

        .default-user {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          float: left;
          margin-right: 10px;
        }

        .time-date {
          color:${Theme.gray35};
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
         &:hover {
          box-shadow: ${Theme.commonShadow};
          cursor:pointer;
        }
      }

    }
  }

  
   @media only screen and (max-width: 991px) { 
     top: 70px;
   input[data-function*='swipe'] {
    position: absolute;
    opacity: 0;
  }
  label[data-function*='swipe'] {
    padding 30px 0 0 10px;
    z-index: 1;
    display: block;
    width: 42px;
    font-family: ${Theme.titleFontFamily};
    height: 42px;
    text-align: center;
    cursor: pointer;
    transform: translate3d(0, 0, 0);
    transition: transform 0.3s;
  }
  
  input[data-function*='swipe']:checked ~ label[data-function*='swipe'] {
    transform: translate3d(200px, 0, 0);
  }
  label[data-function*='swipe']:checked {
    display: block;
  }
  label:nth-child(2) {
    display: none;
  }
  input[data-function*='swipe']:checked ~ label:nth-child(2) {
    display: block;
    transform: translate3d(10px, 0px, 0px);
  }
  input[data-function*='swipe']:checked ~ label:nth-child(3) {
    display: none !important;
  }
  
  input[data-function*='swipe']:checked ~ .sidebar {
    transform: translate3d(0px, 0px, 0px);
    display: none;
  }
  input[data-function*='swipe']:checked ~ .sidebar .menu li {
    width: 70%;
  }
 
  }

   @media only screen and (min-width: 1500px)  {
     max-width: 400px;
    .sidebar {
        .menu {
          li{
            .activity-user {
              max-width: 320px;
          }
        }
    }
   }
`;

// const SidePanel = styled.div`

//   width: 335px;
//   position: absolute;
//   top: 80px;
//   right: 0;
//   min-height: 100%;
//   z-index: 98;
//   background: ${Theme.white};
//   border-left: 1px solid ${Theme.gray7};

//   &.sender-contain {
//     padding:20px;
//   }

//   .sendar-details {
//     color: ${Theme.black};
//     letter-spacing: 1.21px;
//   }

//   .sender-profile {
//     border: 1px solid ${Theme.gray9};
//     border-radius: 100%;
//     width: 48px;
//     height: 48px;
//   }
//   .sender-name {
//     text-transform: capitalize;
//     color: ${Theme.gray90};
//     font-size: ${Theme.medium};
//   }

//   .sticky-btn {
//     bottom: 100px;
//     position: absolute;
//   }
//   .sticky-btn-primary {
//     bottom: 170px;
//     position: absolute;
//   }
//   .service-detail {
//     padding:20px 20px 0 20px;
//   }
//   .service-agre {
//     float: left;
//   }
//   h4 .sendar-details {
//     float: left;
//     margin: 9px 0px 0px 20px;
//   }

// }
//   #collapse-open,
//   #show,
//   #hide:target {
//     display: none;

//   }

//   #hide:target + #show,
//   #hide:target ~ #collapse-open{
//     display: inherit;
//   }
// .add-market-place {
//   font-size: 12px;
//   color:#FF5933;
// }

// .collapse-btn {
//   width:100%;
//   padding:20px;
//   cursor:pointer;

//   .small-para {
//     max-width:218px;
//     width:100%;
//     margin:0 auto;
//   }

//   .edit-folder-icon {
//     vertical-align: text-top;
//     width: 17px;
// }

// `;
