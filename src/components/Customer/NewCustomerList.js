/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import Select, { components } from 'react-select';
import $ from 'jquery';
import ReactTooltip from 'react-tooltip';
import Theme from '../../theme/Theme';
import {
  CheckBox,
  CommonPagination,
  DropDownSelect,
  GetInitialName,
  InputSearchWithRadius,
  PageLoader,
  Table,
  ModalRadioCheck,
} from '../../common';
import NoRecordFound from '../../common/NoRecordFound';
import {
  SearchIcon,
  CountDayClock,
  SliderHIcon,
  CloseIcon,
  CompanyDefaultUser,
  InfoIcon,
  ArrowUpIcon,
  CaretUp,
  EditFileIcon,
  CheckFileIcon,
  FileIcon,
  ArrowDownIcon,
  UpDowGrayArrow,
} from '../../theme/images/index';
import CustomerListTablet from './CustomerListTablet';
import {
  getCustomerList,
  // getCustomers,
  getGrowthStrategist,
  getStatus,
} from '../../api';

import { getManagersList } from "../../api/ChoicesApi";
import { getcontract } from '../../api/AgreementApi';

import { PATH_AGREEMENT, PATH_CUSTOMER_DETAILS } from '../../constants';
import { sortOptions, timeFrameFilters } from '../../constants/FieldConstants';

export default function NewCustomerList() {
  const history = useHistory();
  const selectInputRef = useRef();
  const selectInputRefMobile = useRef();

  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [data, setData] = useState([]);
  const [count, setCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const [brandGrowthStrategist, setBrandGrowthStrategist] = useState([]);
  const [searchQuery, setSearchQuery] = useState(
    JSON.parse(localStorage.getItem('filters'))
      ? JSON.parse(localStorage.getItem('filters')).searchQuery
      : '',
  );
  const { Option, MultiValue, SingleValue } = components;
  // const [customDateModal, setCustomDateModal] = useState(false);
  const [status, setStatus] = useState([]);
  const [selectedValue, setSelectedValue] = useState(
    JSON.parse(localStorage.getItem('filters'))
      ? {
          view: null,
          'order-by': JSON.parse(localStorage.getItem('filters')).sort_by,
        }
      : {
          view: null,
          'order-by': null,
        },
  );
  const [filters, setFilters] = useState(
    JSON.parse(localStorage.getItem('filters')) || {
      status: [],
      contract_status: [],
      user: [],
      ad_user: [],
      dsp_user: [],
      contract_type: [],
    },
  );
  const [showPerformance, setShowPerformance] = useState(
    JSON.parse(localStorage.getItem('filters'))
      ? JSON.parse(localStorage.getItem('filters')).showPerformance
      : false,
  );

  const [showAdPerformance, setShowAdPerformance] = useState(
    JSON.parse(localStorage.getItem('filters'))
      ? JSON.parse(localStorage.getItem('filters')).showAdPerformance
      : false,
  );
  const [showDspAdPerformance, setShowDspAdPerformance] = useState(
    JSON.parse(localStorage.getItem('filters'))
      ? JSON.parse(localStorage.getItem('filters')).showDspAdPerformance
      : false,
  );
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('week');
  const options = [
    { value: 'contract_details', label: 'Contract Details' },
    { value: 'performance', label: 'Sales Performance' },
    { value: 'sponsored_ad_performance', label: 'Sponsored Ad Performance' },
    { value: 'dsp_ad_performance', label: 'DSP Ad Performance' },
  ];
  const contractChoices = [
    { value: 'any', label: 'Any' },
    { value: 'recurring', label: 'Recurring' },
    { value: 'one time', label: 'One Time' },
    { value: 'dsp only', label: 'DSP Only' },
  ];
  const contractStatus = [
    { value: 'active', label: 'Signed' },
    { value: 'pending contract signature', label: 'Pending Signature' },
    { value: 'pending contract approval', label: 'Pending Approval' },
    { value: 'pending contract', label: 'Pending Contract' },
  ];
  const isDesktop = useMediaQuery({ minWidth: 992 });

  const [expiringSoon, setExpiringSoon] = useState(
    !!(
      JSON.parse(localStorage.getItem('filters')) &&
      JSON.parse(localStorage.getItem('filters')).sort_by === 'expiring_soon'
    ),
  );

  const IconOption = (props) => (
    <Option {...props}>
      {props.data.icon ? (
        <img
          className="drop-down-user"
          src={props.data.icon}
          alt="user"
          style={{
            borderRadius: 50,
            marginRight: '9px',
            height: '32px',
            verticalAlign: 'middle',
          }}
        />
      ) : (
        <GetInitialName
          userInfo={props.data.label}
          type="list"
          property="mr-2"
        />
      )}{' '}
      {props.data.label}
    </Option>
  );
  const IconSingleOption = (props) => (
    <MultiValue {...props}>
      {props.data.icon ? (
        <img
          className="drop-down-user"
          src={props.data.icon}
          alt="user"
          style={{
            borderRadius: 50,
            width: '32px',
            verticalAlign: 'middle',
            marginBottom: '',
          }}
        />
      ) : (
        <GetInitialName userInfo={props.data.label} type="list" property="" />
      )}{' '}
      {/* &nbsp; */}
      <span style={{ lineHeight: 0, fontSize: '15px' }}>
        {props.data.label}
      </span>
    </MultiValue>
  );

  const SortOption = (props) => (
    <SingleValue {...props}>
      {props.data.label === 'Sales Performance' ||
      props.data.label === 'Contract Details' ||
      props.data.label === 'Sponsored Ad Performance' ||
      props.data.label === 'DSP Ad Performance'
        ? 'View:'
        : 'Sort by:'}
      &nbsp;
      <span style={{ lineHeight: 0, fontSize: '15px' }}>
        {props.data.label}
      </span>
    </SingleValue>
  );

  const TimeFrameFilters = (props) => (
    <SingleValue {...props}>
      Stats For: &nbsp;
      <span style={{ lineHeight: 0, fontSize: '15px' }}>
        {props.data.label}
      </span>
    </SingleValue>
  );

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

  const getSelectComponents = (key) => {
    if (key === 'user') {
      return {
        Option: IconOption,
        MultiValue: IconSingleOption,
        DropdownIndicator,
      };
    }
    if (key === 'sort') {
      if (isDesktop) {
        return {
          SingleValue: SortOption,
          DropdownIndicator,
        };
      }
      return DropdownIndicator;
    }
    if (key === 'stats') {
      if (isDesktop) {
        return {
          SingleValue: TimeFrameFilters,
          DropdownIndicator,
        };
      }
      return DropdownIndicator;
    }
    if (key === 'view') {
      if (isDesktop) {
        return {
          SingleValue: SortOption,
          DropdownIndicator,
        };
      }
      return DropdownIndicator;
    }
    return DropdownIndicator;
  };

  const customerList = useCallback(
    (currentPage) => {
      setIsLoading({ loader: true, type: 'page' });
      getCustomerList(
        currentPage,
        selectedValue,
        JSON.parse(localStorage.getItem('filters')),
        // filters,
        searchQuery,
        showPerformance,
        showAdPerformance,
        showDspAdPerformance,
        expiringSoon,
        selectedTimeFrame,
      ).then((response) => {
        setData(response && response.data && response.data.results);
        setPageNumber(currentPage);
        setCount(response && response.data && response.data.count);
        setIsLoading({ loader: false, type: 'page' });
      });
    },
    [
      searchQuery,
      selectedValue,
      filters,
      showPerformance,
      expiringSoon,
      showAdPerformance,
      showDspAdPerformance,
      selectedTimeFrame,
    ],
  );

  // const customerListByView = useCallback(
  //   (currentPage, dailyFacts, dashboard, orderBy, sort) => {
  //     // daily_facts=[week/month/30days/custom]
  //     // order-by=[revenue/units_sold/traffic/converion]
  //     // sequence=[asc/desc]
  //     // dashboard=sale_performance
  //     // setIsLoading({ loader: true, type: 'page' });
  //     getCustomers(currentPage, dashboard, dailyFacts, orderBy, sort).then(
  //       (response) => {
  //         setData(response && response.data && response.data.results);
  //         setPageNumber(currentPage);
  //         setCount(response && response.data && response.data.count);
  //         setIsLoading({ loader: false, type: 'page' });
  //       },
  //     );
  //   },
  //   [
  //     searchQuery,
  //     selectedValue,
  //     filters,
  //     showPerformance,
  //     expiringSoon,
  //     showAdPerformance,
  //     showDspAdPerformance,
  //   ],
  // );

  useEffect(() => {
    getStatus().then((statusResponse) => {
      if (statusResponse && statusResponse.status === 200) {
        setStatus(statusResponse.data);
      }
    });
    if (showAdPerformance || showDspAdPerformance) {
      const type = showAdPerformance
        ? 'Sponsored Advertising Ad Manager'
        : 'DSP Ad Manager';
      getManagersList(type).then((adm) => {
        if (adm && adm.data) {
          const list = [];
          for (const brand of adm.data) {
            list.push({
              value: brand.id,
              label: `${brand.first_name} ${brand.last_name}`,
              icon:
                brand.documents &&
                brand.documents[0] &&
                Object.values(brand.documents[0]) &&
                Object.values(brand.documents[0])[0],
            });
            setBrandGrowthStrategist(list);
          }
        }
      });
    } else {
      getGrowthStrategist().then((gs) => {
        if (gs && gs.data) {
          const list = [];
          for (const brand of gs.data) {
            list.push({
              value: brand.id,
              label: `${brand.first_name} ${brand.last_name}`,
              icon:
                brand.documents &&
                brand.documents[0] &&
                Object.values(brand.documents[0]) &&
                Object.values(brand.documents[0])[0],
            });
            setBrandGrowthStrategist(list);
          }
        }
      });
    }
    customerList(1);
  }, [customerList]);

  const handlePageChange = (currentPage) => {
    localStorage.setItem('page', currentPage || 1);
    setPageNumber(currentPage);
    customerList(currentPage, selectedValue, filters, searchQuery);
  };

  const handleFilters = (event, key, type, action) => {
    localStorage.setItem('page', 1);
    if (key === 'unselected') {
      $('.checkboxes input:checkbox').prop('checked', false);
      $('.checkboxes input:radio').prop('checked', false);
      if (selectInputRef && selectInputRef.current)
        selectInputRef.current.select.clearValue();
      if (selectInputRefMobile && selectInputRefMobile.current)
        selectInputRefMobile.current.select.clearValue();

      // setShowPerformance(false);
      // setSearchQuery('');
      // setSelectedValue({
      //     'view': null,
      //     'order-by': null,
      //   });

      setFilters({
        ...filters,
        status: [],
        contract_status: [],
        contract_type: [],
        user: [],
        ad_user: [],
        dsp_user: [],
        // sort_by: '',
        // searchQuery: '',
        // showPerformance: false
      });
      localStorage.setItem(
        'filters',
        JSON.stringify({
          ...filters,
          status: [],
          contract_status: [],
          contract_type: [],
          user: [],
          // sort_by: '',
          // searchQuery: '',
          // showPerformance: false
        }),
      );
    }

    if (type === 'status' && key !== 'unselected') {
      if (
        event.target.checked &&
        filters.status.indexOf(event.target.name) === -1
      ) {
        setFilters({
          ...filters,
          status: [...filters.status, event.target.name],
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            status: [...filters.status, event.target.name],
          }),
        );
      } else {
        setFilters({
          ...filters,
          status: filters.status.filter((op) => op !== event.target.name),
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            status: filters.status.filter((op) => op !== event.target.name),
          }),
        );
      }
    }

    if (type === 'contract_status' && key !== 'unselected') {
      if (
        event.target.checked &&
        filters.contract_status.indexOf(event.target.name) === -1
      ) {
        setFilters({
          ...filters,
          contract_status: [...filters.contract_status, event.target.name],
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            contract_status: [...filters.contract_status, event.target.name],
          }),
        );
      } else {
        setFilters({
          ...filters,
          contract_status: filters.contract_status.filter(
            (op) => op !== event.target.name,
          ),
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            contract_status: filters.contract_status.filter(
              (op) => op !== event.target.name,
            ),
          }),
        );
      }
    }

    if (type === 'brand') {
      if (action.action === 'clear') {
        setFilters({
          ...filters,
          user: [],
          ad_user: [],
          dsp_user: [],
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            user: [],
            ad_user: [],
            dsp_user: [],
          }),
        );
      }
      if (action.action === 'remove-value') {
        const list = filters.user.filter(
          (op) => op !== action.removedValue.value,
        );

        const adList = filters.ad_user.filter(
          (op) => op !== action.removedValue.value,
        );

        const dspList = filters.dsp_user.filter(
          (op) => op !== action.removedValue.value,
        );
        setFilters({
          ...filters,
          user: list,
          ad_user: adList,
          dsp_user: dspList,
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            user: list,
            ad_user: adList,
            dsp_user: dspList,
          }),
        );
      }
      if (event && event.length && action.action === 'select-option') {
        const list = [...filters.user];
        const adList = [...filters.ad_user];
        const dspList = [...filters.dsp_user];

        if (!showAdPerformance && !showDspAdPerformance) {
          for (const bgs of event) {
            if (list.indexOf(bgs.value) === -1) list.push(bgs.value);
          }
        }

        if (showAdPerformance) {
          for (const adm of event) {
            if (adList.indexOf(adm.value) === -1) adList.push(adm.value);
          }
        }

        if (showDspAdPerformance) {
          for (const adm of event) {
            if (dspList.indexOf(adm.value) === -1) dspList.push(adm.value);
          }
        }

        setFilters({
          ...filters,
          user: list,
          ad_user: adList,
          dsp_user: dspList,
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            user: list,
            ad_user: adList,
            dsp_user: dspList,
          }),
        );
      }
    }
    if (type === 'radio') {
      if (event.target.checked) {
        setFilters({
          ...filters,
          contract_type:
            event.target.value === 'any'
              ? event.target.value
              : event.target.value,
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            contract_type:
              event.target.value === 'any'
                ? event.target.value
                : event.target.value,
          }),
        );
      }
    }
  };

  const countDays = (item) => {
    const date1 = new Date();
    const date2 = new Date(item);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSearch = (event, type) => {
    localStorage.setItem('page', 1);
    if (type === 'view') {
      if (event.value === 'contract_details') {
        customerList(pageNumber);
      }
      if (event.value === 'performance') {
        setShowPerformance(true);
        setShowAdPerformance(false);
        setShowDspAdPerformance(false);
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            showPerformance: true,
            showAdPerformance: false,
            showDspAdPerformance: false,
          }),
        );

        // customerListByView(
        //   pageNumber,
        //   selectedTimeFrame,
        //   'sale_performance',
        //   'revenue',
        //   'asc',
        // );
        // customerList(
        //   pageNumber,
        //   selectedValue,
        //   filters,
        //   searchQuery,
        //   true,
        //   false,
        // );
      } else if (event.value === 'sponsored_ad_performance') {
        setShowPerformance(false);
        setShowAdPerformance(true);
        setShowDspAdPerformance(false);
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            showPerformance: false,
            showAdPerformance: true,
            showDspAdPerformance: false,
          }),
        );
        // customerListByView(
        //   pageNumber,
        //   selectedTimeFrame,
        //   'sponsored_ad_performance',
        //   'ad_spend',
        //   'asc',
        // );
        // customerList(
        //   pageNumber,
        //   selectedValue,
        //   filters,
        //   searchQuery,
        //   false,
        //   true,
        // );
      } else if (event.value === 'dsp_ad_performance') {
        setShowPerformance(false);
        setShowAdPerformance(false);
        setShowDspAdPerformance(true);
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            showPerformance: false,
            showAdPerformance: false,
            showDspAdPerformance: true,
          }),
        );
        // customerListByView(
        //   pageNumber,
        //   selectedTimeFrame,
        //   'dsp_ad_performance',
        //   'dsp_spend',
        //   'asc',
        // );
        // customerList(
        //   pageNumber,
        //   selectedValue,
        //   filters,
        //   searchQuery,
        //   false,
        //   true,
        // );
      } else {
        setShowPerformance(false);
        setShowAdPerformance(false);
        setShowDspAdPerformance(false);
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            showPerformance: false,
            showAdPerformance: false,
            showDspAdPerformance: false,
          }),
        );
      }
    }
    if (type === 'sort') {
      if (event.value === 'expiring_soon') {
        setExpiringSoon(true);
        setSelectedValue({ ...selectedValue, 'order-by': '' });
        setFilters({
          ...filters,
          sort_by: event.value,
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            sort_by: event.value,
          }),
        );
      } else {
        setExpiringSoon(false);
        setSelectedValue({ ...selectedValue, 'order-by': event.value });
        setFilters({
          ...filters,
          sort_by: event.value,
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            sort_by: event.value,
          }),
        );
        // customerList(
        //   pageNumber,
        //   event.value,
        //   filters,
        //   searchQuery,
        //   showPerformance,
        // );
      }
    }
    if (type === 'stats') {
      if (event.value === 'custom') {
        // setCustomDateModal(true);
      } else {
        setSelectedTimeFrame(event.value);
        // customerListByView(
        //   pageNumber,
        //   event.value,
        //   'sale_performance',
        //   'revenue',
        //   'asc',
        // );
      }
    }
    if (type === 'search') {
      setTimeout(() => {
        customerList(
          pageNumber,
          selectedValue,
          filters,
          event && event.target && event.target.value ? event.target.value : '',
          showPerformance,
        );
      }, 1000);
    }
  };

  const getSelectPlaceholder = (item) => {
    if (item === 'user') {
      return 'Any';
    }

    if (item === 'sort') {
      if (isDesktop) {
        return 'Sort by: Recently Added';
      }
      return 'Sort by';
    }
    if (item === 'view') {
      if (isDesktop) {
        return 'View: Contract Details';
      }
      return 'View';
    }
    if (item === 'stats') {
      if (isDesktop) {
        return 'Stats For: Last 7 days';
      }
      return 'Stats For';
    }
    return '';
  };
  const redirectIfContractExists = (type, id) => {
    getcontract(type.contract_id).then((res) => {
      if (res && res.status === 200) {
        if (res && res.data && res.data.contract_url) {
          history.push({
            pathname: `${PATH_AGREEMENT.replace(':id', id).replace(
              ':contract_id',
              type.contract_id,
            )}`,
            state: `${history.location.pathname}`,
          });
        }
      }
    });
  };

  const generateContractHTML = (type, id) => {
    if (
      countDays(type.end_date) <= 90 &&
      type.contract_type !== 'one time' &&
      type.contract_status !== 'inactive'
    ) {
      return (
        <li
          data-tip={type.contract_status}
          onClickCapture={(e) => {
            e.stopPropagation();
            history.push({
              pathname: `${PATH_AGREEMENT.replace(':id', id).replace(
                ':contract_id',
                type.contract_id,
              )}`,
              state: `${history.location.pathname}`,
            });
          }}
          role="presentation">
          <div className="recurring-service count-days">
            {type.contract_type === 'dsp only'
              ? 'DSP only Service Agreement'
              : `${type.contract_type} Service Agreement`}
            <span className="count-clock-icon active-contract-icon">
              <img className="clock-icon" src={CountDayClock} alt="clock" />
              {countDays(type.end_date)}d
            </span>
          </div>
        </li>
      );
    }
    if (type && type.contract_status === 'pending contract') {
      return (
        <li
          onClickCapture={(e) => {
            e.stopPropagation();
            history.push({
              pathname: `${PATH_AGREEMENT.replace(':id', id).replace(
                ':contract_id',
                type.contract_id,
              )}`,
              state: `${history.location.pathname}`,
            });
          }}
          role="presentation"
          data-tip={type.contract_status}
          style={{ textTransform: 'capitalize' }}>
          <div className="recurring-service file">
            {type.contract_type === 'dsp only'
              ? 'DSP only Service Agreement'
              : `${type.contract_type} Service Agreement`}
            <span className=" active-contract-icon file-icon">
              <img src={FileIcon} alt="file" />{' '}
            </span>
          </div>
        </li>
      );
    }
    if (type && type.contract_status === 'pending contract approval') {
      return (
        <li
          onClickCapture={(e) => {
            e.stopPropagation();
            history.push({
              pathname: `${PATH_AGREEMENT.replace(':id', id).replace(
                ':contract_id',
                type.contract_id,
              )}`,
              state: `${history.location.pathname}`,
            });
          }}
          role="presentation"
          data-tip={type.contract_status}
          style={{ textTransform: 'capitalize' }}>
          <div className="recurring-service file-check">
            {type.contract_type === 'dsp only'
              ? 'DSP only Service Agreement'
              : `${type.contract_type} Service Agreement`}
            <span className=" active-contract-icon file-check-icon ">
              <img src={CheckFileIcon} alt="check-file" />{' '}
            </span>
          </div>
        </li>
      );
    }
    if (type && type.contract_status === 'pending contract signature') {
      return (
        <li
          onClickCapture={(e) => {
            e.stopPropagation();
            history.push({
              pathname: `${PATH_AGREEMENT.replace(':id', id).replace(
                ':contract_id',
                type.contract_id,
              )}`,
              state: `${history.location.pathname}`,
            });
          }}
          role="presentation"
          data-tip={type.contract_status}
          style={{ textTransform: 'capitalize' }}>
          <div className="recurring-service edit">
            {type.contract_type === 'dsp only'
              ? 'DSP only Service Agreement'
              : `${type.contract_type} Service Agreement`}
            <span className="edit-file-icon  active-contract-icon">
              <img width="16px" src={EditFileIcon} alt="edit" />{' '}
            </span>
          </div>
        </li>
      );
    }
    if (type && type.contract_status === 'active') {
      return (
        <li
          data-tip="Signed"
          style={{ textTransform: 'capitalize' }}
          onClickCapture={(e) => {
            e.stopPropagation();
            redirectIfContractExists(type, id);
            // history.push(PATH_AGREEMENT.replace(':id', id));
            // localStorage.setItem('agreementID', type.contract_id);
          }}
          role="presentation">
          <div className="recurring-service agreement">
            {type.contract_type === 'dsp only'
              ? 'DSP only Service Agreement'
              : `${type.contract_type} Service Agreement`}
          </div>
        </li>
      );
    }
    return (
      <li
        onClickCapture={(e) => {
          e.stopPropagation();
          redirectIfContractExists(type, id);

          // history.push(PATH_AGREEMENT.replace(':id', id));
          // localStorage.setItem('agreementID', type.contract_id);
        }}
        role="presentation"
        data-tip={type.contract_status}
        style={{ textTransform: 'capitalize' }}>
        <div className="recurring-service agreement">
          {type.contract_type} Service Agreement
        </div>
      </li>
    );
  };

  const bindDropDownValue = (item) => {
    if (item === 'user') {
      if (filters.user && !showAdPerformance && !showDspAdPerformance) {
        return brandGrowthStrategist.filter((option) =>
          filters.user.some((op) => op === option.value),
        );
      }
      if (filters.ad_user && showAdPerformance) {
        return brandGrowthStrategist.filter((option) =>
          filters.ad_user.some((op) => op === option.value),
        );
      }

      if (filters.dsp_user && showDspAdPerformance) {
        return brandGrowthStrategist.filter((option) =>
          filters.dsp_user.some((op) => op === option.value),
        );
      }

      // if (
      //   filters.ad_user &&
      //   (showPerformance || showAdPerformance || showDspAdPerformance)
      // ) {
      //   return timeFrameFilters;
      // }

      return [{ value: 'any', label: 'Any' }];
    }
    if (item === 'sort') {
      return (
        selectedValue[item.key] ||
        sortOptions.filter((op) => op.value === filters.sort_by)
      );
    }
    if (item === 'stats') {
      return timeFrameFilters.filter((op) => op.value === selectedTimeFrame);
    }

    if (showPerformance) {
      return [{ value: 'performance', label: 'Sales Performance' }];
    }
    if (showAdPerformance) {
      return [
        {
          value: 'sponsored_ad_performance',
          label: 'Sponsored Ad Performance',
        },
      ];
    }
    if (showDspAdPerformance) {
      return [
        {
          value: 'dsp_ad_performance',
          label: 'DSP Ad Performance',
        },
      ];
    }
    return [{ value: 'contract_details', label: 'Contract Details' }];
  };

  const getDropDownOptions = (optionsFor) => {
    switch (optionsFor) {
      case 'user':
        return brandGrowthStrategist;
      case 'sort':
        return sortOptions;
      case 'stats':
        return timeFrameFilters;
      default:
        return options;
    }
  };

  const generateDropdown = (item, reff = null) => {
    const searchFor =
      item === 'sort' ? 'sort' : item === 'stats' ? 'stats' : 'view';
    return (
      <>
        <Select
          classNamePrefix="react-select"
          isClearable={false}
          className="active"
          ref={reff}
          placeholder={getSelectPlaceholder(item)}
          options={getDropDownOptions(item)}
          // {
          //   item === 'user'
          //     ? brandGrowthStrategist
          //     : item === 'sort'
          //     ? sortOptions
          //     : options
          // }
          onChange={(event, action) =>
            item === 'user'
              ? handleFilters(event, item, 'brand', action)
              : handleSearch(event, searchFor)
          }
          value={bindDropDownValue(item)}
          // value={
          //   item === 'user'
          //     ? filters.user
          //       ? brandGrowthStrategist.filter((option) =>
          //           filters.user.some((op) => op === option.value),
          //         )
          //       : ''
          //     : item === 'sort'
          //     ? selectedValue[item.key] ||
          //       sortOptions.filter((op) => op.value === filters.sort_by)
          //     : showPerformance
          //     ? [{ value: 'performance', label: 'Sales Performance' }]
          //     : showAdPerformance
          //     ? [{ value: 'sponsored_ad_performance', label: 'Sponsored Ad Performance' }]
          //     : [{ value: 'contract_details', label: 'Contract Details' }]
          //   // : selectedValue[item.key] === null
          //   // ? null
          //   // : selectedValue[item.key] || sortOptions.filter(item => item.value === filters.sort_by)
          // }
          isMulti={item === 'user'}
          components={getSelectComponents(item)}
          componentsValue={item === 'user' ? { Option: IconOption } : ''}
        />
      </>
    );
  };

  const calculatePercentage = (current, previous, type) => {
    if (current && previous) {
      let percentage = '';
      if (type === 'conversion') {
        const diff = current - previous;
        percentage = diff / 2;
      }
      const diff = current - previous;
      const mean = diff / previous;
      percentage = mean * 100;

      if (percentage.toString().includes('-')) {
        return (
          <>
            <br />
            <span className="decrease-rate">
              {' '}
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-up" />
              {percentage
                ? `${Number(percentage.toString().split('-')[1]).toFixed(2)} %`
                : ''}
            </span>
          </>
        );
      }
      return (
        <>
          <br />
          <span className="increase-rate">
            <img
              className="green-arrow"
              src={ArrowUpIcon}
              width="14px"
              alt="arrow-up"
            />
            {percentage ? `${percentage.toFixed(2)} %` : ''}
          </span>
        </>
      );
    }
    return '';
  };

  const renderAdPerformanceDifference = (actualValue, grayArrow, matrics) => {
    // let flag;
    const value = -20;
    let selectedClass = '';
    // let arrow = '';

    if (matrics === 'ACOS') {
      // if (value.toString().includes('-')) {
      //   selectedClass = 'increase-rate';
      // } else {
      //   selectedClass = 'decrease-rate';
      // }
      if (value.toString().includes('-')) {
        selectedClass = 'decrease-rate';
      } else {
        selectedClass = 'increase-rate';
      }
    } else if (grayArrow) {
      // arrow = UpDowGrayArrow;
      if (value.toString().includes('-')) {
        selectedClass = 'decrease-rate grey';
      } else {
        selectedClass = 'increase-rate grey';
      }
    } else if (value.toString().includes('-')) {
        selectedClass = 'decrease-rate';
      } else {
        selectedClass = 'increase-rate';
      }

    if (value) {
      if (value.toString().includes('-')) {
        return (
          <>
            <br />
            <span className={selectedClass}>
              {' '}
              <img
                className="red-arrow"
                src={grayArrow ? UpDowGrayArrow : ArrowDownIcon}
                alt="arrow-up"
              />
              {value
                ? `${Number(value.toString().split('-')[1]).toFixed(2)} %`
                : ''}
            </span>
          </>
        );
      }
      return (
        <>
          <br />
          <div className={selectedClass}>
            <img
              className="green-arrow"
              src={grayArrow ? UpDowGrayArrow : ArrowUpIcon}
              width="14px"
              alt="arrow-up"
            />
            {value ? `${value.toFixed(2)} %` : ''}
          </div>
        </>
      );
    }
    return '';
    // if (value) {
    //   if (matrics === 'ACOS') {
    //     if (value.toString().includes('-')) {
    //       flag = 'green';
    //       value = value
    //         ? `${Number(value.toString().split('-')[1]).toFixed(2)} %`
    //         : '';
    //     } else {
    //       flag = 'red';
    //       value = value ? `${value.toFixed(2)} %` : '';
    //     }
    //   } else if (value.toString().includes('-')) {
    //     flag = 'red';
    //     value = value
    //       ? `${Number(value.toString().split('-')[1]).toFixed(2)} %`
    //       : '';
    //   } else {
    //     flag = 'green';
    //     value = value ? `${value.toFixed(2)} %` : '';
    //   }

    //   if (flag === 'red') {
    //     return (
    //       <>
    //         <span
    //           className={grayArrow ? 'decrease-rate grey' : 'decrease-rate'}>
    //           {' '}
    //           <img
    //             className="red-arrow"
    //             src={grayArrow ? UpDowGrayArrow : ArrowDownIcon}
    //             alt="arrow-up"
    //           />
    //           {value}
    //         </span>
    //       </>
    //     );
    //   }
    //   return (
    //     <>
    //       <span
    //         className={grayArrow ? 'increase-rate grey' : 'increase-rate'}>
    //         <img
    //           className="green-arrow"
    //           src={grayArrow ? UpDowGrayArrow : ArrowUpIcon}
    //           width="14px"
    //           alt="arrow-up"
    //         />
    //         {value}
    //       </span>
    //     </>
    //   );
    // }
    // return '';
  };

  const renderHeaders = () => {
    if (showPerformance) {
      return (
        <div className="row">
          <div className="col-lg-2 col-12 customer-header">Customer</div>
          <div className="col-lg-2 col-12 Revenue">Revenue</div>
          <div className="col-lg-2 col-12 unit-sold ">Units Sold</div>
          <div className="col-lg-2 col-12 traffic">Traffic</div>
          <div className="col-lg-2 col-12 conversion">Conversion</div>
          <div className="col-lg-2 col-12 Brand_Strategist">
            Brand Strategist
          </div>
        </div>
      );
    }
    if (showAdPerformance) {
      return (
        <div className="row">
          <div className="col-lg-2 col-12 customer-header">Customer</div>
          <div className="col-lg-2 col-12 Revenue">Ad Sales</div>
          <div className="col-lg-2 col-12 unit-sold ">Ad Spend</div>
          <div className="col-lg-2 col-12 traffic">Ad Impressions</div>
          <div className="col-lg-2 col-12 conversion">Acos</div>
          <div className="col-lg-2 col-12 Brand_Strategist">
            Sponsored Ad Manager
          </div>
        </div>
      );
    }
    if (showDspAdPerformance) {
      return (
        <div className="row">
          <div className="col-lg-2 col-12 customer-header">Customer</div>
          <div className="col-lg-2 col-12 Revenue">IMPRESSIONS</div>
          <div className="col-lg-2 col-12 unit-sold ">DSP Spend</div>
          <div className="col-lg-2 col-12 traffic">TOTAL PRODUCT SALES</div>
          <div className="col-lg-2 col-12 conversion">TOTAL ROAS</div>
          <div className="col-lg-2 col-12 Brand_Strategist">DSP AD MANAGER</div>
        </div>
      );
    }
    return (
      <div className="row">
        <div className="col-lg-3 col-12 customer-header">Customer</div>
        <div className="col-lg-7 col-12">Active Contracts</div>
        <div className="col-lg-2 col-12 Brand_Strategist">Brand Strategist</div>
      </div>
    );
  };

  const renderCustomerDetails = (item) => {
    if (showPerformance) {
      return (
        <tr
          className="cursor"
          key={Math.random()}
          onClick={() =>
            history.push(PATH_CUSTOMER_DETAILS.replace(':id', item.id))
          }>
          <td width="20%">
            <img
              className="company-logo"
              src={
                item &&
                item.documents &&
                item.documents[0] &&
                Object.values(item.documents[0])
                  ? Object.values(item.documents[0])[0]
                  : CompanyDefaultUser
              }
              alt="logo"
            />

            <div className="company-name">{item && item.company_name}</div>
            <div className="status" style={{ textTransform: 'capitalize' }}>
              {item && item.status}
            </div>
          </td>
          <td width="15%">
            $
            {item &&
              item.daily_facts &&
              item.daily_facts.current &&
              item.daily_facts.current.length &&
              item.daily_facts.current
                .map((rev) => (rev.revenue === null ? 0 : rev.revenue))
                .reduce((val, rev) => rev + val)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            {calculatePercentage(
              item &&
                item.daily_facts &&
                item.daily_facts.current &&
                item.daily_facts.current.length
                ? item.daily_facts.current
                    .map((rev) => rev.revenue)
                    .reduce((val, rev) => rev + val)
                : 0,
              item &&
                item.daily_facts &&
                item.daily_facts.previous &&
                item.daily_facts.previous.length
                ? item.daily_facts.previous
                    .map((rev) => rev.revenue)
                    .reduce((val, rev) => rev + val)
                : 0,
            )}
          </td>

          <td width="15%">
            <>
              {item &&
                item.daily_facts &&
                item.daily_facts.current &&
                item.daily_facts.current.length &&
                item.daily_facts.current
                  .map((rev) => (rev.units_sold === null ? 0 : rev.units_sold))
                  .reduce((val, rev) => rev + val)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              {calculatePercentage(
                item &&
                  item.daily_facts &&
                  item.daily_facts.current &&
                  item.daily_facts.current.length
                  ? item.daily_facts.current
                      .map((rev) => rev.units_sold)
                      .reduce((val, rev) => rev + val)
                  : 0,
                item &&
                  item.daily_facts &&
                  item.daily_facts.previous &&
                  item.daily_facts.previous.length
                  ? item.daily_facts.previous
                      .map((rev) => rev.units_sold)
                      .reduce((val, rev) => rev + val)
                  : 0,
              )}
            </>
          </td>

          <td width="15%">
            <>
              {item &&
                item.daily_facts &&
                item.daily_facts.current &&
                item.daily_facts.current.length &&
                item.daily_facts.current
                  .map((rev) => (rev.traffic === null ? 0 : rev.traffic))
                  .reduce((val, rev) => rev + val)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              {calculatePercentage(
                item &&
                  item.daily_facts &&
                  item.daily_facts.current &&
                  item.daily_facts.current.length
                  ? item.daily_facts.current
                      .map((rev) => rev.traffic)
                      .reduce((val, rev) => rev + val)
                  : 0,
                item &&
                  item.daily_facts &&
                  item.daily_facts.previous &&
                  item.daily_facts.previous.length
                  ? item.daily_facts.previous
                      .map((rev) => rev.traffic)
                      .reduce((val, rev) => rev + val)
                  : 0,
              )}
            </>
          </td>

          <td width="15%">
            <>
              {item &&
              item.daily_facts &&
              item.daily_facts.current &&
              item.daily_facts.current.length &&
              item.daily_facts.current !== null ? (
                <>
                  {item &&
                    item.daily_facts.current
                      .map((rev) =>
                        rev.conversion === null ? 0 : rev.conversion,
                      )
                      .reduce((val, rev) => rev + val)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  %
                  {calculatePercentage(
                    item &&
                      item.daily_facts &&
                      item.daily_facts.current &&
                      item.daily_facts.current.length
                      ? item &&
                          item.daily_facts.current
                            .map((rev) => rev.conversion)
                            .reduce((val, rev) => rev + val)
                      : 0,
                    item &&
                      item.daily_facts &&
                      item.daily_facts.previous &&
                      item.daily_facts.previous.length
                      ? item.daily_facts.previous
                          .map((rev) => rev.conversion)
                          .reduce((val, rev) => rev + val)
                      : 0,
                    'conversion',
                  )}
                </>
              ) : (
                ''
              )}
            </>
          </td>

          <td width="15%">
            {item &&
            item.brand_growth_strategist &&
            item.brand_growth_strategist.length !== 0 ? (
              <>
                {item.brand_growth_strategist.profile_photo ? (
                  <img
                    className="user-profile-circle"
                    src={item.brand_growth_strategist.profile_photo}
                    alt="user"
                  />
                ) : (
                  <GetInitialName
                    property="float-left mr-3"
                    userInfo={item.brand_growth_strategist}
                  />
                )}
              </>
            ) : (
              ''
            )}
            <div className="user-name">
              {item &&
                item.brand_growth_strategist &&
                item.brand_growth_strategist.first_name}
              <br />
              {item &&
                item.brand_growth_strategist &&
                item.brand_growth_strategist.last_name}
            </div>
          </td>
        </tr>
      );
    }
    if (showAdPerformance) {
      return (
        <tr
          className="cursor"
          key={Math.random()}
          onClick={() =>
            history.push(PATH_CUSTOMER_DETAILS.replace(':id', item.id))
          }>
          <td width="20%">
            <img
              className="company-logo"
              src={
                item &&
                item.documents &&
                item.documents[0] &&
                Object.values(item.documents[0])
                  ? Object.values(item.documents[0])[0]
                  : CompanyDefaultUser
              }
              alt="logo"
            />

            <div className="company-name">{item && item.company_name}</div>
            <div className="status" style={{ textTransform: 'capitalize' }}>
              {item && item.status}
            </div>
          </td>
          <td width="15%">
            {item &&
            item.ad_performace &&
            item.ad_performace.current_sum &&
            item.ad_performace.current_sum.ad_sales
              ? `$${item.ad_performace.current_sum.ad_sales
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
              : '$0'}
            {renderAdPerformanceDifference(
              item &&
                item.ad_performace &&
                item.ad_performace.difference_data &&
                item.ad_performace.difference_data.ad_sales,
              false,
              'AdSales',
            )}
          </td>

          <td width="15%">
            <>
              {item &&
              item.ad_performace &&
              item.ad_performace.current_sum &&
              item.ad_performace.current_sum.ad_spend
                ? `$${item.ad_performace.current_sum.ad_spend
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                : '$0'}
              {renderAdPerformanceDifference(
                item &&
                  item.ad_performace &&
                  item.ad_performace.difference_data &&
                  item.ad_performace.difference_data.ad_spend,
                true,
                'AdSpend',
              )}
            </>
          </td>

          <td width="15%">
            <>
              {item &&
              item.ad_performace &&
              item.ad_performace.current_sum &&
              item.ad_performace.current_sum.impressions
                ? item.ad_performace.current_sum.impressions
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : 0}
              {renderAdPerformanceDifference(
                item &&
                  item.ad_performace &&
                  item.ad_performace.difference_data &&
                  item.ad_performace.difference_data.impressions,
                false,
                'AdImpressions',
              )}
            </>
          </td>

          <td width="15%">
            <>
              {item &&
              item.ad_performace &&
              item.ad_performace.current_sum &&
              item.ad_performace.current_sum.acos
                ? `${item.ad_performace.current_sum.acos.toFixed(2)}%`
                : '0%'}
              {renderAdPerformanceDifference(
                item &&
                  item.ad_performace &&
                  item.ad_performace.difference_data &&
                  item.ad_performace.difference_data.acos,
                false,
                'ACOS',
              )}
            </>
          </td>

          <td width="15%">
            {item && item.ad_manager && item.ad_manager.length !== 0 ? (
              <>
                {item.ad_manager.profile_photo ? (
                  <img
                    className="user-profile-circle"
                    src={item.ad_manager.profile_photo}
                    alt="user"
                  />
                ) : (
                  <GetInitialName
                    property="float-left mr-3"
                    userInfo={item.ad_manager}
                  />
                )}
              </>
            ) : (
              ''
            )}
            <div className="user-name">
              {item && item.ad_manager && item.ad_manager.first_name}
              <br />
              {item && item.ad_manager && item.ad_manager.last_name}
            </div>
          </td>
        </tr>
      );
    }
    if (showDspAdPerformance) {
      return (
        <tr
          className="cursor"
          key={Math.random()}
          onClick={() =>
            history.push(PATH_CUSTOMER_DETAILS.replace(':id', item.id))
          }>
          <td width="20%">
            <img
              className="company-logo"
              src={
                item &&
                item.documents &&
                item.documents[0] &&
                Object.values(item.documents[0])
                  ? Object.values(item.documents[0])[0]
                  : CompanyDefaultUser
              }
              alt="logo"
            />

            <div className="company-name">{item && item.company_name}</div>
            <div className="status" style={{ textTransform: 'capitalize' }}>
              {item && item.status}
            </div>
          </td>
          <td width="15%">
            {item &&
            item.dsp_ad_performance &&
            item.dsp_ad_performance.current_sum &&
            item.dsp_ad_performance.current_sum.impressions
              ? `$${item.dsp_ad_performance.current_sum.impressions
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
              : '$0'}
            {renderAdPerformanceDifference(
              item &&
                item.dsp_ad_performance &&
                item.dsp_ad_performance.difference_data &&
                item.dsp_ad_performance.difference_data.impressions,
              false,
              'impressions',
            )}
          </td>

          <td width="15%">
            <>
              {item &&
              item.dsp_ad_performance &&
              item.dsp_ad_performance.current_sum &&
              item.dsp_ad_performance.current_sum.dsp_spend
                ? `$${item.dsp_ad_performance.current_sum.dsp_spend
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                : '$0'}
              {renderAdPerformanceDifference(
                item &&
                  item.dsp_ad_performance &&
                  item.dsp_ad_performance.difference_data &&
                  item.dsp_ad_performance.difference_data.dsp_spend,
                true,
                'DspSpend',
              )}
            </>
          </td>

          <td width="15%">
            <>
              {item &&
              item.dsp_ad_performance &&
              item.dsp_ad_performance.current_sum &&
              item.dsp_ad_performance.current_sum.total_product_sales
                ? item.dsp_ad_performance.current_sum.total_product_sales
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : 0}
              {renderAdPerformanceDifference(
                item &&
                  item.dsp_ad_performance &&
                  item.dsp_ad_performance.difference_data &&
                  item.dsp_ad_performance.difference_data.total_product_sales,
                false,
                'totalProductSales',
              )}
            </>
          </td>

          <td width="15%">
            <>
              {item &&
              item.dsp_ad_performance &&
              item.dsp_ad_performance.current_sum &&
              item.dsp_ad_performance.current_sum.total_roas
                ? `${item.dsp_ad_performance.current_sum.total_roas.toFixed(
                    2,
                  )}%`
                : '0%'}
              {renderAdPerformanceDifference(
                item &&
                  item.dsp_ad_performance &&
                  item.dsp_ad_performance.difference_data &&
                  item.dsp_ad_performance.difference_data.total_roas,
                false,
                'totalRoas',
              )}
            </>
          </td>

          <td width="15%">
            {item && item.ad_manager && item.ad_manager.length !== 0 ? (
              <>
                {item.ad_manager.profile_photo ? (
                  <img
                    className="user-profile-circle"
                    src={item.ad_manager.profile_photo}
                    alt="user"
                  />
                ) : (
                  <GetInitialName
                    property="float-left mr-3"
                    userInfo={item.ad_manager}
                  />
                )}
              </>
            ) : (
              ''
            )}
            <div className="user-name">
              {item && item.ad_manager && item.ad_manager.first_name}
              <br />
              {item && item.ad_manager && item.ad_manager.last_name}
            </div>
          </td>
        </tr>
      );
    }
    // for view-contract Details
    return (
      <tr
        className="cursor"
        key={Math.random()}
        onClick={() =>
          history.push(PATH_CUSTOMER_DETAILS.replace(':id', item.id))
        }>
        <td width="25%">
          <img
            className="company-logo"
            src={
              item &&
              item.documents &&
              item.documents[0] &&
              Object.values(item.documents[0])
                ? Object.values(item.documents[0])[0]
                : CompanyDefaultUser
            }
            alt="logo"
          />

          <div className="company-name">{item && item.company_name}</div>
          <div className="status" style={{ textTransform: 'capitalize' }}>
            {item && item.status}
          </div>
        </td>
        <td width="60%">
          <ul
            className="recurring-contact"
            style={{ textTransform: 'capitalize' }}>
            {item && item.contract && item.contract.length ? (
              item &&
              item.contract &&
              item.contract.map((type) => (
                <React.Fragment key={Math.random()}>
                  <ReactTooltip />
                  {generateContractHTML(type, item.id)}
                </React.Fragment>
              ))
            ) : (
              <li className="no-active-contract">No active contracts</li>
            )}
          </ul>
        </td>

        <td width="15%">
          {item &&
          item.brand_growth_strategist &&
          item.brand_growth_strategist.length !== 0 ? (
            <>
              {item.brand_growth_strategist.profile_photo ? (
                <img
                  className="user-profile-circle"
                  src={item.brand_growth_strategist.profile_photo}
                  alt="user"
                />
              ) : (
                <GetInitialName
                  property="float-left mr-3"
                  userInfo={item.brand_growth_strategist}
                />
              )}
            </>
          ) : (
            ''
          )}
          <div className="user-name">
            {item &&
              item.brand_growth_strategist &&
              item.brand_growth_strategist.first_name}
            <br />
            {item &&
              item.brand_growth_strategist &&
              item.brand_growth_strategist.last_name}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <CustomerListPage>
      <div className="customer-list-header-sticky">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-12 ">
              {' '}
              <p className="black-heading-title  pt-1"> Customers</p>
              <div className=" mb-3  d-lg-none d-block ">
                <label
                  className="filter-slider mt-3 cursor "
                  htmlFor="tabletmenu-check"
                  id="responsive-button">
                  <img src={SliderHIcon} alt="Menu Lines" />
                  Filter
                </label>
              </div>
              <MobileLeftSidebar>
                <input type="checkbox" id="tabletmenu-check" />
                <div id="ifp-sidebar-responsive">
                  <SideContent>
                    <p className="black-heading-title mt-0 mb-4">
                      {' '}
                      Filter Customers
                    </p>
                    <label
                      htmlFor="tabletmenu-check"
                      className="close-icon d-xl-none d-block cursor">
                      <img width="25px" src={CloseIcon} alt="cross" />
                    </label>
                    <div className="row mt-2 mb-4">
                      <div className="col-4">
                        <div className="customer-list-filter">Filters</div>
                      </div>
                      <div className="col-8 text-right">
                        <div
                          className="clear-filter"
                          onClick={(event) =>
                            handleFilters(event, 'unselected')
                          }
                          role="presentation">
                          {' '}
                          Clear filters
                        </div>
                      </div>
                    </div>

                    {showAdPerformance ? (
                      <div className="label">Sponsored Ad Manager</div>
                    ) : showDspAdPerformance ? (
                      <div className="label">DSP Ad Manager</div>
                    ) : (
                      <div className="label">Brand Strategist</div>
                    )}
                    <DropDownSelect className="w-250">
                      {generateDropdown('user', selectInputRefMobile)}
                    </DropDownSelect>

                    <div className="label mt-4 pt-2">Customer Status</div>

                    <div className="clear-fix" />
                    {!isDesktop ? (
                      <ul className="check-box-list checkboxes">
                        {status &&
                          status.map((item) => (
                            <li key={item.value}>
                              <CheckBox>
                                <label
                                  className="check-container customer-pannel"
                                  htmlFor={item.value}>
                                  {item.label}
                                  <input
                                    type="checkbox"
                                    id={item.value}
                                    name={item.value}
                                    onChange={(event) =>
                                      handleFilters(event, item, 'status')
                                    }
                                    defaultChecked={
                                      filters.status
                                        ? filters.status.find(
                                            (op) => op === item.value,
                                          )
                                        : ''
                                    }
                                  />
                                  <span className="checkmark" />
                                </label>
                              </CheckBox>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      ''
                    )}
                    <div className="label mt-4">Contract Type</div>
                    <div className="clear-fix" />
                    {!isDesktop ? (
                      <ul className="check-box-list">
                        {contractChoices.map((item) => (
                          <li key={item.value}>
                            {' '}
                            <ModalRadioCheck>
                              <label
                                className="checkboxes radio-container customer-list"
                                htmlFor={item.value}>
                                {item.label}
                                <input
                                  type="radio"
                                  name="radio"
                                  id={item.value}
                                  value={item.value}
                                  onChange={(event) =>
                                    handleFilters(event, item, 'radio')
                                  }
                                  defaultChecked={
                                    filters.contract_type
                                      ? filters.contract_type === item.value
                                      : ''
                                  }
                                />
                                <span className="checkmark checkmark-customer-list" />
                              </label>
                            </ModalRadioCheck>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      ''
                    )}

                    {!isDesktop ? (
                      <>
                        {' '}
                        <div className="label mt-4 pt-2">Contract Status</div>
                        <div className="clear-fix" />
                        <ul className="check-box-list checkboxes">
                          {contractStatus.map((item) => (
                            <li key={item.value}>
                              <CheckBox>
                                <label
                                  className="check-container customer-pannel"
                                  htmlFor={item.label}>
                                  <input
                                    type="checkbox"
                                    id={item.label}
                                    name={item.value}
                                    onChange={(event) =>
                                      handleFilters(
                                        event,
                                        item,
                                        'contract_status',
                                      )
                                    }
                                    defaultChecked={
                                      filters.contract_status
                                        ? filters.contract_status.find(
                                            (op) => op === item.value,
                                          )
                                        : ''
                                    }
                                  />
                                  <span className="checkmark" />
                                  {item.label}
                                </label>
                              </CheckBox>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      ''
                    )}
                  </SideContent>
                </div>
                <div className="straight-line horizontal-line mb-2" />
              </MobileLeftSidebar>
            </div>

            <div className="col-lg-4 col-md-6 col-12 col-8  mb-2 pr-2 pl-2">
              <InputSearchWithRadius className="customer-list-header w-80">
                <input
                  className=" form-control search-filter"
                  placeholder="Search"
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setFilters({
                      ...filters,
                      searchQuery: event.target.value,
                    });
                    localStorage.setItem('page', 1);
                    localStorage.setItem(
                      'filters',
                      JSON.stringify({
                        ...filters,
                        searchQuery: event.target.value,
                      }),
                    );
                  }}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      handleSearch(event, 'search');
                    }
                  }}
                  value={searchQuery || (filters && filters.searchQuery) || ''}
                />

                <img
                  src={InfoIcon}
                  alt="search cursor"
                  data-tip="Search by Company Name, Contact First, Last Name or Email"
                  data-for="info"
                  className="info-icon"
                />
                <ReactTooltip id="info" aria-haspopup="true" place="bottom" />

                <img
                  src={SearchIcon}
                  alt="search"
                  className="search-input-icon"
                />
              </InputSearchWithRadius>
            </div>

            <div className="col-lg-2 col-md-6 col-12 pl-2 pr-2">
              <DropDownSelect className="customer-list-header">
                {generateDropdown('sort')}
              </DropDownSelect>{' '}
            </div>
            <div className="col-lg-2 col-md-6 col-12   mb-2 pl-2 pr-2 ">
              <DropDownSelect className="customer-list-header">
                {generateDropdown('stats')}
              </DropDownSelect>{' '}
            </div>
            <div className="col-lg-2 col-md-6  col-12   mb-2  pl-2 pr-2 ">
              <DropDownSelect className="customer-list-header">
                {generateDropdown('view')}
              </DropDownSelect>{' '}
            </div>
          </div>
        </div>
        <div className="straight-line horizontal-line mt-n2 d-lg-block d-none" />
        <div className="straight-line horizontal-line  d-lg-none d-block" />
      </div>

      <CustomerLeftPannel className="d-none d-lg-block">
        <div className="row mt-2 mb-4">
          <div className="col-4">
            <div className="customer-list-filter">Filters</div>
          </div>
          <div className="col-8 text-right">
            <div
              className="clear-filter"
              onClick={(event) => handleFilters(event, 'unselected', 'status')}
              role="presentation">
              Clear filters
            </div>
          </div>
        </div>
        {/* //for ad manager dropdown 
        {showAdPerformance ? (
          <>
            <div className="label mt-2 mb-2">Sponsored Ad Manager</div>
            <DropDownSelect className="w-250">
              {generateAdManagerDropdown('user', selectInputRef)}
            </DropDownSelect>{' '}
          </>
        ) : (
          <>
            <div className="label mt-2 mb-2">Brand Strategist</div>
            <DropDownSelect className="w-250">
              {generateDropdown('user', selectInputRef)}
            </DropDownSelect>{' '}
          </>
        )} */}
        {showAdPerformance ? (
          <div className="label mt-2 mb-2">Sponsored Ad Manager</div>
        ) : showDspAdPerformance ? (
          <div className="label mt-2 mb-2">DSP Ad Manager</div>
        ) : (
          <div className="label mt-2 mb-2">Brand Strategist</div>
        )}
        <DropDownSelect className="w-250">
          {generateDropdown('user', selectInputRef)}
        </DropDownSelect>{' '}
        <div className="label mt-4 pt-2">Customer Status</div>
        <div className="clear-fix" />
        <ul className="check-box-list checkboxes">
          {status &&
            status.map((item) => (
              <li key={item.value}>
                <CheckBox>
                  <label
                    className="check-container customer-pannel"
                    htmlFor={item.value}>
                    {item.label}
                    <input
                      type="checkbox"
                      id={item.value}
                      name={item.value}
                      onChange={(event) => handleFilters(event, item, 'status')}
                      defaultChecked={
                        filters.status
                          ? filters.status.find((op) => op === item.value)
                          : ''
                      }
                    />
                    <span className="checkmark" />
                  </label>
                </CheckBox>
              </li>
            ))}
        </ul>
        <div className="label mt-4 pt-2">Contract Type</div>
        <div className="clear-fix" />
        <ul className="check-box-list">
          {contractChoices.map((item) => (
            <li key={item.value}>
              {' '}
              <ModalRadioCheck>
                <label
                  className=" checkboxes radio-container customer-list"
                  htmlFor={item.value}>
                  {item.label}
                  <input
                    type="radio"
                    name="radio"
                    id={item.value}
                    value={item.value}
                    onChange={(event) => handleFilters(event, item, 'radio')}
                    defaultChecked={
                      filters && filters.contract_type
                        ? filters &&
                          filters.contract_type &&
                          filters.contract_type === item.value
                        : ''
                    }
                  />
                  <span className="checkmark checkmark-customer-list" />
                </label>
              </ModalRadioCheck>
            </li>
          ))}
        </ul>
        <div className="label mt-4 pt-2">Contract Status</div>
        <div className="clear-fix" />
        <ul className="check-box-list checkboxes">
          {contractStatus.map((item) => (
            <li key={item.value}>
              <CheckBox>
                <label
                  className="check-container customer-pannel"
                  htmlFor={item.label}>
                  <input
                    type="checkbox"
                    id={item.label}
                    name={item.value}
                    onChange={(event) =>
                      handleFilters(event, item, 'contract_status')
                    }
                    defaultChecked={
                      filters.status
                        ? filters.contract_status.find(
                            (op) => op === item.value,
                          )
                        : ''
                    }
                  />
                  <span className="checkmark" />
                  {item.label}
                </label>
              </CheckBox>
            </li>
          ))}
        </ul>
      </CustomerLeftPannel>

      <>
        {isDesktop ? (
          <div className="table-container">
            <div className="table-part">
              <div className="sticky-header">
                <div className="table-header">
                  {renderHeaders()}
                  {/* <div className="row">
                    <div
                      // className="customer-header "
                      // width={showPerformance ? '20%' : '25%'}
                      className={
                        showPerformance
                          ? 'col-lg-2 col-12 customer-header'
                          : 'col-lg-3 col-12 customer-header'
                      }>
                      Customer
                    </div>
                    <div
                      // width={showPerformance ? '15%' : '60%'}
                      className={
                        showPerformance
                          ? 'col-lg-2 col-12 Revenue'
                          : 'col-lg-7 col-12'
                      }>
                      {showPerformance ? 'Revenue' : 'Active Contracts'}
                    </div>
                    {showPerformance ? (
                      <div className="col-lg-2 col-12 unit-sold ">
                        Units Sold
                      </div>
                    ) : null}
                    {showPerformance ? (
                      <div className="col-lg-2 col-12 traffic">Traffic</div>
                    ) : null}
                    {showPerformance ? (
                      <div className="col-lg-2 col-12 conversion">
                        Conversion
                      </div>
                    ) : null}
                    <div className="col-lg-2 col-12 Brand_Strategist">
                      Brand Strategist
                    </div>
                  </div> */}
                </div>
              </div>
              {isLoading.loader && isLoading.type === 'page' ? (
                <PageLoader
                  component="customer-list-loader"
                  color="#FF5933"
                  type="page"
                />
              ) : (
                <Table>
                  <tbody>
                    {data && data.length === 0 ? (
                      <NoRecordFound />
                    ) : (
                      data &&
                      data.map(
                        (item) => renderCustomerDetails(item),
                        // <tr
                        //   className="cursor"
                        //   key={Math.random()}
                        //   onClick={() =>
                        //     history.push(
                        //       PATH_CUSTOMER_DETAILS.replace(':id', item.id),
                        //     )
                        //   }>
                        //   <td width={showPerformance ? '20%' : '25%'}>
                        //     <img
                        //       className="company-logo"
                        //       src={
                        //         item &&
                        //         item.documents &&
                        //         item.documents[0] &&
                        //         Object.values(item.documents[0])
                        //           ? Object.values(item.documents[0])[0]
                        //           : CompanyDefaultUser
                        //       }
                        //       alt="logo"
                        //     />

                        //     <div className="company-name">
                        //       {item &&
                        //         item.contract &&
                        //         item.contract[0] &&
                        //         item.contract[0].contract_company_name}
                        //     </div>
                        //     <div
                        //       className="status"
                        //       style={{ textTransform: 'capitalize' }}>
                        //       {item && item.status}
                        //     </div>
                        //   </td>
                        //   <td width={showPerformance ? '15%' : '60%'}>
                        //     {showPerformance ? (
                        //       <>
                        //         $
                        //         {item &&
                        //           item.daily_facts &&
                        //           item.daily_facts.current &&
                        //           item.daily_facts.current.length &&
                        //           item.daily_facts.current
                        //             .map((rev) =>
                        //               rev.revenue === null ? 0 : rev.revenue,
                        //             )
                        //             .reduce((val, rev) => rev + val)
                        //             .toString()
                        //             .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        //         {calculatePercentage(
                        //           item &&
                        //             item.daily_facts &&
                        //             item.daily_facts.current &&
                        //             item.daily_facts.current.length
                        //             ? item.daily_facts.current
                        //                 .map((rev) => rev.revenue)
                        //                 .reduce((val, rev) => rev + val)
                        //             : 0,
                        //           item &&
                        //             item.daily_facts &&
                        //             item.daily_facts.previous &&
                        //             item.daily_facts.previous.length
                        //             ? item.daily_facts.previous
                        //                 .map((rev) => rev.revenue)
                        //                 .reduce((val, rev) => rev + val)
                        //             : 0,
                        //         )}
                        //       </>
                        //     ) : (
                        //       <ul
                        //         className="recurring-contact"
                        //         style={{ textTransform: 'capitalize' }}>
                        //         {item &&
                        //         item.contract &&
                        //         item.contract.length ? (
                        //           item &&
                        //           item.contract &&
                        //           item.contract.map((type) => (
                        //             <React.Fragment key={Math.random()}>
                        //               <ReactTooltip />
                        //               {generateContractHTML(type, item.id)}
                        //             </React.Fragment>
                        //           ))
                        //         ) : (
                        //           <li className="no-active-contract">
                        //             No active contracts
                        //           </li>
                        //         )}
                        //       </ul>
                        //     )}
                        //   </td>
                        //   {showPerformance ? (
                        //     <td width="15%">
                        //       <>
                        //         {item &&
                        //           item.daily_facts &&
                        //           item.daily_facts.current &&
                        //           item.daily_facts.current.length &&
                        //           item.daily_facts.current
                        //             .map((rev) =>
                        //               rev.units_sold === null
                        //                 ? 0
                        //                 : rev.units_sold,
                        //             )
                        //             .reduce((val, rev) => rev + val)
                        //             .toString()
                        //             .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        //         {calculatePercentage(
                        //           item &&
                        //             item.daily_facts &&
                        //             item.daily_facts.current &&
                        //             item.daily_facts.current.length
                        //             ? item.daily_facts.current
                        //                 .map((rev) => rev.units_sold)
                        //                 .reduce((val, rev) => rev + val)
                        //             : 0,
                        //           item &&
                        //             item.daily_facts &&
                        //             item.daily_facts.previous &&
                        //             item.daily_facts.previous.length
                        //             ? item.daily_facts.previous
                        //                 .map((rev) => rev.units_sold)
                        //                 .reduce((val, rev) => rev + val)
                        //             : 0,
                        //         )}
                        //       </>
                        //     </td>
                        //   ) : null}
                        //   {showPerformance ? (
                        //     <td width="15%">
                        //       <>
                        //         {item &&
                        //           item.daily_facts &&
                        //           item.daily_facts.current &&
                        //           item.daily_facts.current.length &&
                        //           item.daily_facts.current
                        //             .map((rev) =>
                        //               rev.traffic === null ? 0 : rev.traffic,
                        //             )
                        //             .reduce((val, rev) => rev + val)
                        //             .toString()
                        //             .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        //         {calculatePercentage(
                        //           item &&
                        //             item.daily_facts &&
                        //             item.daily_facts.current &&
                        //             item.daily_facts.current.length
                        //             ? item.daily_facts.current
                        //                 .map((rev) => rev.traffic)
                        //                 .reduce((val, rev) => rev + val)
                        //             : 0,
                        //           item &&
                        //             item.daily_facts &&
                        //             item.daily_facts.previous &&
                        //             item.daily_facts.previous.length
                        //             ? item.daily_facts.previous
                        //                 .map((rev) => rev.traffic)
                        //                 .reduce((val, rev) => rev + val)
                        //             : 0,
                        //         )}
                        //       </>
                        //     </td>
                        //   ) : null}
                        //   {showPerformance ? (
                        //     <td width="15%">
                        //       <>
                        //         {item &&
                        //         item.daily_facts &&
                        //         item.daily_facts.current &&
                        //         item.daily_facts.current.length &&
                        //         item.daily_facts.current !== null ? (
                        //           <>
                        //             {item &&
                        //               item.daily_facts.current
                        //                 .map((rev) =>
                        //                   rev.conversion === null
                        //                     ? 0
                        //                     : rev.conversion,
                        //                 )
                        //                 .reduce((val, rev) => rev + val)
                        //                 .toString()
                        //                 .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        //             %
                        //             {calculatePercentage(
                        //               item &&
                        //                 item.daily_facts &&
                        //                 item.daily_facts.current &&
                        //                 item.daily_facts.current.length
                        //                 ? item &&
                        //                     item.daily_facts.current
                        //                       .map((rev) => rev.conversion)
                        //                       .reduce((val, rev) => rev + val)
                        //                 : 0,
                        //               item &&
                        //                 item.daily_facts &&
                        //                 item.daily_facts.previous &&
                        //                 item.daily_facts.previous.length
                        //                 ? item.daily_facts.previous
                        //                     .map((rev) => rev.conversion)
                        //                     .reduce((val, rev) => rev + val)
                        //                 : 0,
                        //               'conversion',
                        //             )}
                        //           </>
                        //         ) : (
                        //           ''
                        //         )}
                        //       </>
                        //     </td>
                        //   ) : null}

                        //   <td width="15%">
                        //     {item &&
                        //     item.brand_growth_strategist &&
                        //     item.brand_growth_strategist.length !== 0 ? (
                        //       <>
                        //         {item.brand_growth_strategist.profile_photo ? (
                        //           <img
                        //             className="user-profile-circle"
                        //             src={
                        //               item.brand_growth_strategist.profile_photo
                        //             }
                        //             alt="user"
                        //           />
                        //         ) : (
                        //           <GetInitialName
                        //             property="float-left mr-3"
                        //             userInfo={item.brand_growth_strategist}
                        //           />
                        //         )}
                        //       </>
                        //     ) : (
                        //       ''
                        //     )}
                        //     <div className="user-name">
                        //       {item &&
                        //         item.brand_growth_strategist &&
                        //         item.brand_growth_strategist.first_name}
                        //       <br />
                        //       {item &&
                        //         item.brand_growth_strategist &&
                        //         item.brand_growth_strategist.last_name}
                        //     </div>
                        //   </td>
                        // </tr>
                      )
                    )}
                  </tbody>
                </Table>
              )}
            </div>

            <div className="footer-sticky">
              <div className="straight-line horizontal-line" />
              <div className="container-fluid">
                <CommonPagination
                  count={count}
                  pageNumber={
                    JSON.parse(localStorage.getItem('page')) || pageNumber
                  }
                  handlePageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        ) : (
          <CustomerListTablet
            data={data}
            history={history}
            count={count}
            pageNumber={pageNumber}
            handlePageChange={handlePageChange}
            isLoading={isLoading}
            showPerformance={showPerformance}
            showAdPerformance={showAdPerformance}
          />
        )}
      </>
    </CustomerListPage>
  );
}

const CustomerListPage = styled.div`
  .table-header {
    box-shadow: none;
    position: sticky !important;
    top: 130px;
    left: 353px;
    right: 0px;
    margin: 0;
    height: 40px;
    margin-top: 3px;
    color: ${Theme.gray40};
    font-size: 11px;
    background: ${Theme.white};
    font-family: ${Theme.baseFontFamily};
    text-transform: uppercase;
    border-bottom: 1px solid ${Theme.gray7};
    padding: 13px;
    font-weight: 600;
    vertical-align: top;
  }

  .Revenue {
    padding-left: 5%;
  }

  .unit-sold {
    padding-left: 4%;
  }
  .traffic {
    padding-left: 3%;
  }
  .conversion {
    padding-left: 2%;
  }
  .Brand_Strategist {
    padding-left: 2%;
  }

  .customer-header {
    padding-left: 66px;
  }

  .sticky-header {
    position: fixed;
    top: 130px;
    left: 353px;
    right: 0;
    background: white;
    height: 40px;
    z-index: 1;
    display: inline;
  }

  padding-left: 62px;
  .table-container {
    padding-left: 290px;
  }

  .customer-list-header-sticky {
    position: fixed;
    left: 64px;
    right: 0;
    z-index: 2;
    background-color: ${Theme.white};
  }

  .table-part {
    // min-height: 560px;
    padding-top: 65px;
    overflow: auto;
    min-height: 892px;
    height: 100%;

    padding-bottom: 69px;
    position: relative;
  }
  .customer-list-header {
    margin: 10px 0;
    &.w-80 {
      float: right;
      width: 94%;
    }
  }

  .footer-sticky {
    position: fixed;
    bottom: 0;
    left: 353px;
    right: 0;
    background: white;
  }
  @media only screen and (min-width: 1920px) {
    .customer-list-header {
      &.w-80 {
        width: 106% !important;
      }
    }
  }
  @media only screen and (min-width: 1600px) {
    .customer-list-header {
      &.w-80 {
        width: 97%;
      }
    }
  }

  @media only screen and (max-width: 991px) {
    padding-left: 0px;

    .customer-list-header-sticky {
      left: 0;
      right: 0;
      // padding: 0 15px;
    }
    .customer-list-header {
      &.w-80 {
        width: 100%;
      }
    }

    .filter-slider {
      border: 1px solid #8798ad;
      padding: 8px 15px;
      border-radius: 25px;
      color: ${Theme.black};
      font-size: ${Theme.normal};
      float: right;
      top: -7px;
      right: 40px;
      position: absolute;
      margin-top: -94px;
      font-weight: 600;

      img {
        width: 16px;
        margin-right: 7px;
        vertical-align: text-top;
      }
    }

    .customer-list-header {
      margin: 5px 0;
    }
  }

  .selectAll {
    border-right: 1px solid black;
  }
`;

const CustomerLeftPannel = styled.div`
  max-width: 290px;
  height: 85%;
  position: fixed;
  overflow-y: auto;
  overflow-x: hidden;
  // padding-bottom: 200px;
  top: 130px;
  width: 100%;
  left: 62px;
  padding: 15px;
  padding-bottom: 80px;
  border-right: 1px solid ${Theme.gray5};

  .label {
    color: ${Theme.gray40};
    text-transform: uppercase;
    line-height: 22px;
    font-family: ${Theme.titleFontFamily};
    font-size: 11px;
    margin-bottom: 3px;
  }

  .check-box-list {
    list-style-type: none;
    padding: 0;
    margin: 10px 0 5px 0;

    li {
      color: ${Theme.gray85};
      font-size: 14px;
      margin-bottom: 15px;
    }
  }

  // .unselected {
  //   color: ${Theme.gray40};
  //   font-size: 14px;
  //   float: right;
  //   cursor: pointer;
  // }
  // .selected {
  //   float: right;
  //   color: ${Theme.gray40};
  //   border-right: 2px solid ${Theme.gray4};
  //   padding-right: 8px;
  //   cursor: pointer;
  // }
  .customer-list-filter {
    color: ${Theme.black};
    font-size: 16px;
    font-weight: 600;
  }
  .clear-filter {
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
    font-family: ${Theme.baseFontFamily};
    cursor: pointer;
  }
  .btn-apply {
    color: ${Theme.white};
    bottom: 20px;
    position: fixed;
  }
  @media only screen and (max-width: 991px) {
    dispaly: none;
  }
`;
const MobileLeftSidebar = styled.div`
  display: none;
  #tabletmenu-check {
    display: none;
  }

  @media only screen and (max-width: 991px) {
    background-color: ${Theme['$base-color']};
    display: block;
    #responsive-button {
      display: block;
      position: absolute;
      left: 0px;
      top: 43px;
      z-index: 999;
      .menu-icon {
        width: 24px;
        margin-top: -52px;
        margin-left: -20px;
      }
    }
    #ifp-sidebar-responsive {
      display: none;
      height: 100%;
      position: absolute;
      z-index: 999;
      top: 0px;
      left: 0;
      .close-icon {
        color: ${Theme.white};
        font-size: ${Theme.normalRes};
        font-family: ${Theme.titleFontFamily};
        position: absolute;
        right: 20px;
        top: 10px;
        z-index: 999;

        img {
          width: 18px;
          margin-top: 8px;
        }
      }
    }
    #tabletmenu-check:checked ~ #ifp-sidebar-responsive {
      display: block;
    }
    #mobilemenu-close:checked ~ #ifp-sidebar-responsive {
      display: none;
    }
    .content-header {
      padding: 30px 30px 10px !important;
    }
    .customer-list-filter {
      color: ${Theme.black};
      font-size: 16px;
      font-weight: 600;
    }
    .clear-filter {
      color: ${Theme.gray40};
      font-size: ${Theme.extraNormal};
      font-family: ${Theme.baseFontFamily};
      cursor: pointer;
    }
  }
  @media only screen and (max-width: 767px) {
    #responsive-button {
      .menu-icon {
        width: 24px;
        margin-top: -16px;
        position: absolute;
        margin-left: -20px;
      }
    }
  }
`;

const SideContent = styled.div`
  @media (max-width: 991px) {
    width: 300px;
    min-height: 100%;
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    background: white;
    padding: 15px;
    box-shadow: ${Theme.commonShadow};

    .label {
      color: ${Theme.gray40};
      text-transform: uppercase;
      line-height: 22px;
      font-family: ${Theme.titleFontFamily};
      font-size: 11px;
      margin-bottom: 3px;
    }

    .check-box-list {
      list-style-type: none;
      padding: 0;
      margin: 0;

      li {
        color: ${Theme.gray85};
        font-size: 14px;
        margin-bottom: 15px;
      }
    }

    .unselected {
      color: ${Theme.gray40};
      font-size: 14px;
      float: right;
      cursor: pointer;
    }
    .selected {
      float: right;
      color: ${Theme.gray40};
      border-right: 2px solid ${Theme.gray4};
      padding-right: 8px;
      cursor: pointer;
    }
  }
`;
