import React, { useState, useEffect, useCallback, useRef } from 'react';

import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import $ from 'jquery';
import dayjs from 'dayjs';
import Select, { components } from 'react-select';
import { DateRange } from 'react-date-range';
import { enGB } from 'react-date-range/src/locale';
import { useHistory } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import Theme from '../../../theme/Theme';
import NoRecordFound from '../../../common/NoRecordFound';
import CustomerListTablet from './CustomerListTablet';
import CustomerListFilters from './CustomerListFilters';
import CustomerListLeftSidePanel from './CustomerListLeftSidePanel';
import {
  CommonPagination,
  PageLoader,
  Table,
  ModalBox,
  Button,
  GetInitialName,
} from '../../../common';
import {
  PATH_AGREEMENT,
  PATH_CUSTOMER_DETAILS,
  performanceSortOptions,
  sadSortOptions,
  dadSortOptions,
  sortOptions,
  sortByOrderOptions,
  options,
  timeFrameFilters,
} from '../../../constants';
import {
  CountDayClock,
  CloseIcon,
  CompanyDefaultUser,
  ArrowUpIcon,
  EditFileIcon,
  CheckFileIcon,
  FileIcon,
  ArrowDownIcon,
  UpDowGrayArrow,
  SortUp,
  CaretUp,
} from '../../../theme/images';
import {
  getCustomerList,
  getGrowthStrategist,
  getStatus,
  getManagersList,
  getSellerType,
  getcontract,
} from '../../../api';
import { CustomerListPage } from './CustomerListStyle';

const salesSortOptions = sortOptions.concat(performanceSortOptions);
const sponsorAdSortOptions = sortOptions.concat(sadSortOptions);
const dspAdSortOptions = sortOptions.concat(dadSortOptions);

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '420px ',
    width: '100% ',
    minHeight: '390px',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function CustomerList() {
  const history = useHistory();
  const selectInputRefMobile = useRef();
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [data, setData] = useState([]);
  const [count, setCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const [brandGrowthStrategist, setBrandGrowthStrategist] = useState([]);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    JSON.parse(localStorage.getItem('filters'))
      ? JSON.parse(localStorage.getItem('filters')).searchQuery
      : '',
  );
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
      cd_user: [],
      user: [],
      ad_user: [],
      dsp_user: [],
      contract_type: [],
      customer_account_type: [],
    },
  );

  const [showContractDetails, setShowContractDetails] = useState(
    !(
      JSON.parse(localStorage.getItem('filters')) &&
      (JSON.parse(localStorage.getItem('filters')).showPerformance ||
        JSON.parse(localStorage.getItem('filters')).showAdPerformance ||
        JSON.parse(localStorage.getItem('filters')).showDspAdPerformance)
    ),
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
  const [selectedTimeFrame, setSelectedTimeFrame] = useState({
    daily_facts: JSON.parse(localStorage.getItem('filters'))
      ? JSON.parse(localStorage.getItem('filters')).daily_facts
      : 'week',
  });
  const [orderByFlag, setOrderByFlag] = useState(
    JSON.parse(localStorage.getItem('filters'))
      ? JSON.parse(localStorage.getItem('filters')).sequence
      : false,
  );
  const [showOrderOption, setShowOrderOption] = useState(false);

  const isDesktop = useMediaQuery({ minWidth: 992 });
  const currentDate = new Date();
  const [isCustomDateApply, setIsCustomDateApply] = useState(false);
  const [customDateData, setCustomDateData] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'bgsSelection',
    },
  ]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [expiringSoon, setExpiringSoon] = useState(
    !!(
      JSON.parse(localStorage.getItem('filters')) &&
      JSON.parse(localStorage.getItem('filters')).sort_by === 'expiring_soon'
    ),
  );
  const selectInputRef = useRef();
  const { Option, SingleValue } = components;
  const [showContracts, setShowContracts] = useState(false);
  const [accountType, setAccountType] = useState([]);

  const CustomDateFilter = (startDate, endDate, type) => {
    let sd = startDate;
    let ed = endDate;

    if (type === 'custom') {
      sd = `${startDate.getDate()}-${
        startDate.getMonth() + 1
      }-${startDate.getFullYear()}`;
      ed = `${endDate.getDate()}-${
        endDate.getMonth() + 1
      }-${endDate.getFullYear()}`;

      setSelectedTimeFrame({
        daily_facts: 'custom',
        start_date: sd,
        end_date: ed,
        startDate,
        endDate,
      });
    }
  };

  const applyCustomDate = () => {
    CustomDateFilter(
      customDateData[0].startDate,
      customDateData[0].endDate,
      'custom',
    );
    setIsCustomDateApply(true);
    setShowCustomDateModal(false);
  };

  const setMaxDate = () => {
    const d = currentDate;
    if (showPerformance) {
      d.setDate(d.getDate() - 4);
    }
    if (showAdPerformance || showDspAdPerformance) {
      d.setDate(d.getDate() - 3);
    }

    return d;
  };

  const renderCustomDateModal = () => {
    return (
      <Modal
        isOpen={showCustomDateModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => {
            setShowCustomDateModal(false);
            setCustomDateData([
              {
                startDate: currentDate,
                endDate: currentDate,
                key: 'bgsSelection',
              },
            ]);
          }}
          role="presentation"
        />
        <ModalBox>
          <div className="modal-body">
            <h4>Select Date Range</h4>
            <DateRange
              editableDateInputs
              onChange={(item) => {
                setCustomDateData([item.bgsSelection]);
              }}
              showMonthAndYearPickers={false}
              ranges={customDateData}
              moveRangeOnFirstSelection={false}
              showDateDisplay={false}
              maxDate={setMaxDate()}
              rangeColors={[Theme.baseColor]}
              weekdayDisplayFormat="EEEEE"
              locale={enGB}
            />
            <div className="text-center mt-3">
              <Button
                onClick={() => applyCustomDate()}
                type="button"
                className="btn-primary on-boarding   w-100">
                Apply
              </Button>
            </div>
          </div>
        </ModalBox>
      </Modal>
    );
  };

  const customerList = useCallback(
    (currentPage) => {
      setIsLoading({ loader: true, type: 'page' });
      getCustomerList(
        currentPage,
        selectedValue,
        JSON.parse(localStorage.getItem('filters')) || filters,
        searchQuery,
        showContractDetails,
        showPerformance,
        showAdPerformance,
        showDspAdPerformance,
        expiringSoon,
        selectedTimeFrame,
        orderByFlag ? { sequence: 'desc' } : { sequence: 'asc' },
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
      orderByFlag,
      expiringSoon,
      showContractDetails,
      showPerformance,
      showAdPerformance,
      showDspAdPerformance,
      selectedTimeFrame,
    ],
  );

  useEffect(() => {
    if (showAdPerformance || showDspAdPerformance) {
      const type = showAdPerformance
        ? 'sponsored_ad_dashboard'
        : 'dsp_ad_performance';
      getManagersList(type).then((adm) => {
        if (adm && adm.data) {
          const list = [{ value: 'any', label: 'All' }]; // for select one user
          for (const brand of adm.data) {
            list.push({
              value: brand.id,
              label: `${brand.first_name} ${brand.last_name}`,
              icon:
                brand.documents &&
                brand.documents[0] &&
                Object.values(brand.documents[0]),
            });
          }
          setBrandGrowthStrategist(list);
        }
      });
    } else {
      getGrowthStrategist().then((gs) => {
        if (gs && gs.data) {
          const list = [{ value: 'any', label: 'All' }]; // for select one use
          for (const brand of gs.data) {
            list.push({
              value: brand.id,
              label: `${brand.first_name} ${brand.last_name}`,
              icon:
                brand.documents &&
                brand.documents[0] &&
                Object.values(brand.documents[0]),
            });
          }
          setBrandGrowthStrategist(list);
        }
      });
    }
  }, [showAdPerformance, showDspAdPerformance]);

  useEffect(() => {
    getStatus().then((statusResponse) => {
      if (statusResponse && statusResponse.status === 200) {
        setStatus(statusResponse.data);
      }
    });

    getSellerType().then((sellerResponse) => {
      if (sellerResponse && sellerResponse.status === 200) {
        setAccountType(sellerResponse.data);
      }
    });

    customerList(1);
  }, [customerList]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowSortDropdown(false);
    }
  };

  useEffect(() => {
    if (showSortDropdown)
      document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showSortDropdown]);

  const handlePageChange = (currentPage) => {
    localStorage.setItem('page', currentPage || 1);
    setPageNumber(currentPage);
    customerList(currentPage, selectedValue, filters, searchQuery);
  };
  const handleSortFilters = (orderKey) => {
    setOrderByFlag(!orderByFlag);
    setExpiringSoon(false);
    setSelectedValue({
      ...selectedValue,
      'order-by': orderKey,
      sequence: !orderByFlag,
    });
    setFilters({
      ...filters,
      sort_by: orderKey,
      sequence: !orderByFlag,
    });
    localStorage.setItem(
      'filters',
      JSON.stringify({
        ...filters,
        sort_by: orderKey,
        sequence: !orderByFlag,
      }),
    );
  };

  const countDays = (item) => {
    const date1 = new Date();
    const date2 = new Date(item);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const IconOption = (dataProps) => (
    <Option {...dataProps}>
      {/* {props.data.icon ? ( // for multi slect iser */}
      {dataProps.data && dataProps.data.label !== 'All' ? (
        dataProps.data.icon ? ( // for single user select
          <img
            className="drop-down-user"
            src={dataProps.data.icon}
            alt="user"
            style={{
              borderRadius: 50,
              marginRight: '9px',
              height: '28px',
              verticalAlign: 'middle',
            }}
          />
        ) : (
          <GetInitialName
            userInfo={dataProps.data.label}
            type="list"
            property="mr-2"
          />
        )
      ) : null}
      {dataProps.data.label}
    </Option>
  );

  const IconSingleOption = (dataProps) => (
    <SingleValue {...dataProps}>
      {dataProps.data && dataProps.data.label !== 'All' ? (
        dataProps.data.icon ? (
          <img
            className="drop-down-user"
            src={dataProps.data.icon}
            alt="user"
            style={{
              borderRadius: 50,
              width: '28px',
              verticalAlign: 'middle',
              marginBottom: '',
            }}
          />
        ) : (
          <GetInitialName
            userInfo={dataProps.data.label}
            type="list"
            property=""
          />
        )
      ) : null}
      <span style={{ lineHeight: 0, fontSize: '15px', marginLeft: '8px' }}>
        {dataProps.data.label}
      </span>
    </SingleValue>
  );
  const SortOption = (dataProps) => (
    <SingleValue {...dataProps}>
      {dataProps.data.label === 'Sales Performance' ||
      dataProps.data.label === 'Accounts' ||
      dataProps.data.label === 'Sponsored Ad Performance' ||
      dataProps.data.label === 'DSP Ad Performance'
        ? 'View:'
        : 'Sort by:'}
      &nbsp;
      <span style={{ lineHeight: 0, fontSize: '15px' }}>
        {dataProps.data.label}
      </span>
    </SingleValue>
  );

  const handleSearch = (event, type) => {
    localStorage.setItem('page', 1);
    if (type === 'view') {
      setShowOrderOption(false);
      setExpiringSoon(false);
      localStorage.setItem(
        'filters',
        JSON.stringify({
          ...filters,
          sort_by: '-created_at',
        }),
      );
      setSelectedValue({
        ...selectedValue,
        'order-by': '-created_at',
      });
      setFilters({
        ...filters,
        sort_by: '-created_at',
      });

      if (event.value === 'contract_details') {
        setShowContractDetails(true);
        setShowPerformance(false);
        setShowAdPerformance(false);
        setShowDspAdPerformance(false);
        setFilters({
          ...filters,
          showContractDetails: true,
          showPerformance: false,
          showAdPerformance: false,
          showDspAdPerformance: false,
          sort_by: '-created_at',
          sequence: false,
          daily_facts: 'week',
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            showContractDetails: true,
            showPerformance: false,
            showAdPerformance: false,
            showDspAdPerformance: false,
            sort_by: '-created_at',
            sequence: false,
            daily_facts: 'week',
          }),
        );
      } else if (event.value === 'performance') {
        setShowContractDetails(false);
        setShowPerformance(true);
        setShowAdPerformance(false);
        setShowDspAdPerformance(false);
        setFilters({
          ...filters,
          showContractDetails: false,
          showPerformance: true,
          showAdPerformance: false,
          showDspAdPerformance: false,
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            showContractDetails: false,
            showPerformance: true,
            showAdPerformance: false,
            showDspAdPerformance: false,
          }),
        );
      } else if (event.value === 'sponsored_ad_performance') {
        setShowContractDetails(false);
        setShowPerformance(false);
        setShowAdPerformance(true);
        setShowDspAdPerformance(false);
        setFilters({
          ...filters,
          showContractDetails: false,
          showPerformance: false,
          showAdPerformance: true,
          showDspAdPerformance: false,
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            showContractDetails: false,
            showPerformance: false,
            showAdPerformance: true,
            showDspAdPerformance: false,
          }),
        );
      } else if (event.value === 'dsp_ad_performance') {
        setShowContractDetails(false);
        setShowPerformance(false);
        setShowAdPerformance(false);
        setShowDspAdPerformance(true);
        setFilters({
          ...filters,
          showContractDetails: false,
          showPerformance: false,
          showAdPerformance: false,
          showDspAdPerformance: true,
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            showContractDetails: false,
            showPerformance: false,
            showAdPerformance: false,
            showDspAdPerformance: true,
          }),
        );
      }
    }
    if (type === 'sort') {
      setShowOrderOption(false);
      if (event && event.order) {
        setShowOrderOption(true);
      }
      if (event.value === 'expiring_soon') {
        setExpiringSoon(true);
        setSelectedValue({ ...selectedValue, 'order-by': 'expiring_soon' });
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
      }
    }
    if (type === 'stats') {
      setIsCustomDateApply(false);
      if (event.value === 'custom') {
        setShowCustomDateModal(true);
      } else {
        setSelectedTimeFrame({ daily_facts: event.value });
        setFilters({
          ...filters,
          daily_facts: event.value,
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            daily_facts: event.value,
          }),
        );
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

    if (type === 'order') {
      setOrderByFlag(event.value);
      setSelectedValue({
        ...selectedValue,
        sequence: event.value,
      });
      setFilters({
        ...filters,
        sequence: event.value,
      });
      localStorage.setItem(
        'filters',
        JSON.stringify({
          ...filters,
          sequence: event.value,
        }),
      );
    }
  };
  const handleFilters = (event, key, type, action) => {
    // for multi select user
    // const handleFilters = (event, key, type) => {
    // for one select user

    // if (key === 'user')
    //   localStorage.setItem(
    //     'filters',
    //     JSON.stringify({
    //       ...filters,
    //       cd_user: event,
    //     }),
    //   );

    if (key === 'user') {
      if (showContractDetails) {
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            cd_user: event.value,
          }),
        );
      }
      if (showPerformance) {
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            user: event.value,
          }),
        );
      }
      if (showAdPerformance) {
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            ad_user: event.value,
          }),
        );
      }
      if (showDspAdPerformance) {
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            dsp_user: event.value,
          }),
        );
      }
    }
    localStorage.setItem('page', 1);
    if (key === 'unselected') {
      $('.checkboxes input:checkbox').prop('checked', false);
      $('.checkboxes input:radio').prop('checked', false);
      if (selectInputRef && selectInputRef.current)
        selectInputRef.current.select.clearValue();
      if (selectInputRefMobile && selectInputRefMobile.current)
        selectInputRefMobile.current.select.clearValue();
      setSearchQuery('');
      setFilters({
        ...filters,
        status: [],
        contract_status: [],
        contract_type: [],
        customer_account_type: [],
        cd_user: [],
        user: [],
        ad_user: [],
        dsp_user: [],
        searchQuery: '',
      });
      localStorage.setItem(
        'filters',
        JSON.stringify({
          ...filters,
          status: [],
          contract_status: [],
          contract_type: [],
          customer_account_type: [],
          cd_user: [],
          user: [],
          ad_user: [],
          dsp_user: [],
          searchQuery: '',
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
    // for account type
    if (type === 'customer_account_type' && key !== 'unselected') {
      if (
        event.target.checked &&
        filters.customer_account_type.indexOf(event.target.name) === -1
      ) {
        setFilters({
          ...filters,
          customer_account_type: [
            ...filters.customer_account_type,
            event.target.name,
          ],
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            customer_account_type: [
              ...filters.customer_account_type,
              event.target.name,
            ],
          }),
        );
      } else {
        setFilters({
          ...filters,
          customer_account_type: filters.customer_account_type.filter(
            (op) => op !== event.target.name,
          ),
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            customer_account_type: filters.customer_account_type.filter(
              (op) => op !== event.target.name,
            ),
          }),
        );
      }
    }

    // for single user selected
    if (type === 'brand') {
      if (action.action === 'clear') {
        setFilters({
          ...filters,
          cd_user: [],
          user: [],
          ad_user: [],
          dsp_user: [],
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            cd_user: [],
            user: [],
            ad_user: [],
            dsp_user: [],
          }),
        );
      } else {
        if (showContractDetails) {
          if (event.value === 'any') {
            setFilters({
              ...filters,
              cd_user: [],
            });
            localStorage.setItem(
              'filters',
              JSON.stringify({
                ...filters,
                cd_user: [],
              }),
            );
          } else {
            setFilters({
              ...filters,

              cd_user: event.value,
            });
            localStorage.setItem(
              'filters',
              JSON.stringify({
                ...filters,

                cd_user: event.value,
              }),
            );
          }
        }
        if (showPerformance) {
          if (event.value === 'any') {
            setFilters({
              ...filters,
              user: [],
            });
            localStorage.setItem(
              'filters',
              JSON.stringify({
                ...filters,
                user: [],
              }),
            );
          } else {
            setFilters({
              ...filters,
              user: event.value,
            });
            localStorage.setItem(
              'filters',
              JSON.stringify({
                ...filters,

                user: event.value,
              }),
            );
          }
        }

        if (showAdPerformance) {
          if (event.value === 'any') {
            setFilters({
              ...filters,
              ad_user: [],
            });
            localStorage.setItem(
              'filters',
              JSON.stringify({
                ...filters,
                ad_user: [],
              }),
            );
          } else {
            setFilters({
              ...filters,

              ad_user: event.value,
            });
            localStorage.setItem(
              'filters',
              JSON.stringify({
                ...filters,

                ad_user: event.value,
              }),
            );
          }
        }

        if (showDspAdPerformance) {
          if (event.value === 'any') {
            setFilters({
              ...filters,
              dsp_user: [],
            });
            localStorage.setItem(
              'filters',
              JSON.stringify({
                ...filters,
                dsp_user: [],
              }),
            );
          } else {
            setFilters({
              ...filters,

              dsp_user: event.value,
            });
            localStorage.setItem(
              'filters',
              JSON.stringify({
                ...filters,

                dsp_user: event.value,
              }),
            );
          }
        }
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

  const getSelectPlaceholder = (item) => {
    if (item === 'user') {
      return 'All';
    }

    if (item === 'sort') {
      if (isDesktop) {
        return 'Sort by: Recently Added';
      }
      return 'Sort by';
    }
    if (item === 'view') {
      if (isDesktop) {
        return 'View: Accounts';
      }
      return 'View';
    }
    if (item === 'stats') {
      if (isDesktop) {
        return 'Stats For: Last 7 days';
      }
      return 'Stats For';
    }
    if (item === 'order') {
      return 'Highest to Lowest';
    }
    return '';
  };
  const DropdownIndicator = (dataProps) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...dataProps}>
          <img
            src={CaretUp}
            alt="caret"
            style={{
              transform: dataProps.selectProps.menuIsOpen
                ? 'rotate(180deg)'
                : '',
              width: '25px',
              height: '25px',
            }}
          />
        </components.DropdownIndicator>
      )
    );
  };

  const renderCustomDateSubLabel = (dataProps) => {
    if (selectedTimeFrame.daily_facts === 'custom' && isCustomDateApply) {
      return `From- ${dayjs(selectedTimeFrame.startDate).format(
        'D MMM, YYYY',
      )}  To- ${dayjs(selectedTimeFrame.endDate).format('D MMM, YYYY')}`;
    }

    return dataProps.data.sub;
  };

  const filterOption = (dataProps) => (
    <Option {...dataProps}>
      <div className="pb-2">
        <span style={{ fontSize: '15px', color: '#000000' }}>
          {dataProps.data.label}
        </span>

        <div style={{ fontSize: '12px', color: '#556178' }}>
          {dataProps.data.sub}
        </div>
      </div>
    </Option>
  );

  const TimeFrameFilters = (dataProps) => (
    <SingleValue {...dataProps}>
      Stats For:&nbsp;
      <span style={{ lineHeight: 0, fontSize: '15px' }}>
        {dataProps.data.label}
      </span>
      <div style={{ fontSize: '12px', color: '#556178' }}>
        {renderCustomDateSubLabel(dataProps)}
      </div>
    </SingleValue>
  );
  const getSelectComponents = (key) => {
    if (key === 'user') {
      return {
        Option: IconOption,
        SingleValue: IconSingleOption,
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
          Option: filterOption,
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
  const bindDropDownValue = (item) => {
    if (item === 'user') {
      if (filters.cd_user && showContractDetails) {
        return brandGrowthStrategist.filter(
          (option) => filters.cd_user === option.value,
        );
      }
      if (filters.user && showPerformance) {
        return brandGrowthStrategist.filter(
          (option) => filters.user === option.value,
        );
      }
      if (filters.ad_user && showAdPerformance) {
        return brandGrowthStrategist.filter(
          (option) => filters.ad_user === option.value,
        );
      }

      if (filters.dsp_user && showDspAdPerformance) {
        return brandGrowthStrategist.filter(
          (option) => filters.dsp_user === option.value,
        );
      }
      // return [{ value: 'any', label: 'Any' }];
      return brandGrowthStrategist.filter(
        (option) => filters.cd_user === option.value,
      );
    }

    if (item === 'sort') {
      if (!isDesktop) {
        if (showPerformance) {
          return (
            selectedValue[item.key] ||
            salesSortOptions.filter(
              (op) => op.value === selectedValue['order-by'],
            )
          );
        }
        if (showAdPerformance) {
          return (
            selectedValue[item.key] ||
            sponsorAdSortOptions.filter(
              (op) => op.value === selectedValue['order-by'],
            )
          );
        }
        if (showDspAdPerformance) {
          return (
            selectedValue[item.key] ||
            dspAdSortOptions.filter(
              (op) => op.value === selectedValue['order-by'],
            )
          );
        }
        return (
          selectedValue[item.key] ||
          sortOptions.filter((op) => op.value === selectedValue['order-by'])
        );
      }
      return (
        selectedValue[item.key] ||
        sortOptions.filter((op) => op.value === selectedValue['order-by'])
      );
    }

    if (item === 'stats') {
      return timeFrameFilters.filter(
        (op) => op.value === selectedTimeFrame.daily_facts,
      );
    }

    if (item === 'order') {
      return sortByOrderOptions.filter((op) => op.value === orderByFlag);
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
    return [{ value: 'contract_details', label: 'Accounts' }];
  };

  const getDropDownOptions = (optionsFor) => {
    switch (optionsFor) {
      case 'user':
        return brandGrowthStrategist;
      case 'sort':
        if (!isDesktop) {
          if (showPerformance) {
            return salesSortOptions;
          }
          if (showAdPerformance) {
            return sponsorAdSortOptions;
          }
          if (showDspAdPerformance) {
            return dspAdSortOptions;
          }
          return sortOptions;
        }
        return sortOptions;
      case 'stats':
        return timeFrameFilters;

      case 'order':
        return sortByOrderOptions;
      default:
        return options;
    }
  };
  const generateDropdown = (item, reff = null) => {
    const searchFor =
      item === 'order'
        ? 'order'
        : item === 'sort'
        ? 'sort'
        : item === 'stats'
        ? 'stats'
        : 'view';
    return (
      <>
        <Select
          classNamePrefix="react-select"
          isClearable={false}
          className="active"
          ref={reff}
          placeholder={getSelectPlaceholder(item)}
          options={getDropDownOptions(item)}
          onChange={(event, action) =>
            item === 'user'
              ? handleFilters(event, item, 'brand', action)
              : handleSearch(event, searchFor)
          }
          value={bindDropDownValue(item)}
          // isMulti={item === 'user'}
          isMulti={false}
          components={getSelectComponents(item)}
          componentsValue={item === 'user' ? { Option: IconOption } : ''}
        />
      </>
    );
  };

  useEffect(() => {
    if (!isDesktop && selectedValue['order-by'] !== null) {
      sortOptions.forEach((element) => {
        if (selectedValue['order-by'] !== element.value) {
          setShowOrderOption(true);
        }
      });
    }
  }, [isDesktop, selectedValue, setShowOrderOption]);

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
              <img src={FileIcon} alt="file" />
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
              <img src={CheckFileIcon} alt="check-file" />
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

  const renderAdPerformanceDifference = (actualValue, grayArrow, matrics) => {
    const value = actualValue;
    let selectedClass = '';
    let selectedArrow = '';

    if (value) {
      if (matrics === 'ACOS') {
        if (value.toString().includes('-')) {
          selectedClass = 'increase-rate';
          selectedArrow = ArrowUpIcon;
        } else {
          selectedClass = 'decrease-rate';
          selectedArrow = ArrowDownIcon;
        }
      } else if (grayArrow) {
        if (value.toString().includes('-')) {
          selectedClass = 'decrease-rate grey';
          selectedArrow = UpDowGrayArrow;
        } else {
          selectedClass = 'increase-rate grey';
          selectedArrow = UpDowGrayArrow;
        }
      } else if (value.toString().includes('-')) {
        selectedClass = 'decrease-rate';
        selectedArrow = ArrowDownIcon;
      } else {
        selectedClass = 'increase-rate';
        selectedArrow = ArrowUpIcon;
      }

      if (value.toString().includes('-')) {
        return (
          <>
            <div className={selectedClass}>
              {' '}
              <img className="red-arrow" src={selectedArrow} alt="arrow-up" />
              {`${Number(value.toString().split('-')[1]).toFixed(2)} %`}
            </div>
          </>
        );
      }

      return (
        <>
          <div className={selectedClass}>
            <img
              className="green-arrow"
              src={selectedArrow}
              width="14px"
              alt="arrow-up"
            />
            {value} %
          </div>
        </>
      );
    }
    return '';
  };

  const renderHeaders = () => {
    if (showPerformance) {
      return (
        <div className="row position-relative">
          <div className="col-lg-4 col-md-12 customer-header">Customer</div>

          {performanceSortOptions.map((item) => {
            return (
              <div
                key={item.label}
                style={{
                  cursor: 'pointer',
                  color:
                    item.value === selectedValue['order-by']
                      ? Theme.red
                      : Theme.gray40,
                }}
                className={`col-lg-2 col-12 ${item.class}`}
                onClick={() => handleSortFilters(item.value)}
                aria-hidden="true">
                {item.label}
                <img
                  className={`sort-arrow-up ${
                    item.value === selectedValue['order-by'] && orderByFlag
                      ? 'rotate'
                      : ''
                  }`}
                  src={SortUp}
                  alt="arrow-up"
                />
              </div>
            );
          })}
        </div>
      );
    }
    if (showAdPerformance) {
      return (
        <div className="row">
          <div className="col-lg-4 col-12 customer-header">Customer</div>
          {sadSortOptions.map((item) => {
            return (
              <div
                key={item.label}
                style={{
                  cursor: 'pointer',
                  color:
                    item.value === selectedValue['order-by']
                      ? Theme.red
                      : Theme.gray40,
                }}
                className={`col-lg-2 col-12 ${item.class}`}
                onClick={() => handleSortFilters(item.value)}
                aria-hidden="true">
                {item.label}
                <img
                  className={`sort-arrow-up ${
                    item.value === selectedValue['order-by'] && orderByFlag
                      ? 'rotate'
                      : ''
                  }`}
                  src={SortUp}
                  alt="arrow-up"
                />
              </div>
            );
          })}
        </div>
      );
    }
    if (showDspAdPerformance) {
      return (
        <div className="row">
          <div className="col-lg-4 col-12 customer-header">Customer</div>
          {dadSortOptions.map((item) => {
            return (
              <div
                key={item.label}
                style={{
                  cursor: 'pointer',
                  color:
                    item.value === selectedValue['order-by']
                      ? Theme.red
                      : Theme.gray40,
                }}
                className={`col-lg-2 col-12 ${item.class}`}
                onClick={() => handleSortFilters(item.value)}
                aria-hidden="true">
                {item.label}
                <img
                  className={`sort-arrow-up ${
                    item.value === selectedValue['order-by'] && orderByFlag
                      ? 'rotate'
                      : ''
                  }`}
                  src={SortUp}
                  alt="arrow-up"
                />
              </div>
            );
          })}
        </div>
      );
    }
    return (
      <div className="row">
        <div className="col-lg-3 col-12 customer-header">Customer</div>
        <div className="col-lg-2 col-12 account-type ">Account Type</div>
        <div className="col-lg-2 col-12 status">Status</div>
        <div className="col-lg-5 col-12 active-contracts">Active Contracts</div>
      </div>
    );
  };

  const generateLogoCompanyNameAndGs = (item, name, bgs) => {
    return (
      <>
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
        <div className="company-info-details customer-details">
          <div className="company-name">{name}</div>
          <div className="user-name">
            {bgs.first_name} {bgs.last_name}
          </div>
        </div>
      </>
    );
  };
  const generateCompanyStatus = (companyStatus) => {
    return (
      <>
        {companyStatus === 'at risk' ? (
          <div className="status">At Risk</div>
        ) : (
          <div className="status" style={{ textTransform: 'capitalize' }}>
            {companyStatus}
          </div>
        )}
      </>
    );
  };
  const generatePerformance = (value, toFixedValue, isTwiceReplace, prefix) => {
    if (isTwiceReplace) {
      return value
        ? `${
            prefix +
            value
              .toFixed(toFixedValue)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              .replace('.00', '')
          }`
        : `${prefix}0`;
    }
    return value
      ? `${prefix === '$' ? '$' : ''} ${value
          .toFixed(toFixedValue)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${prefix === '%' ? '%' : ''}`
      : `${prefix === '$' ? '$0' : prefix === '%' ? '0%' : 0}`;
  };

  const showContractsList = (item) => {
    const contractLength = item.contract.length;
    const reduceContractLength = item.contract.length - 2;

    return (
      <ul className="recurring-contact" style={{ textTransform: 'capitalize' }}>
        {item && item.contract && item.contract.length ? (
          <>
            {!showContracts
              ? item.contract.slice(0, 2).map((type) => (
                  <React.Fragment key={Math.random()}>
                    <ReactTooltip />
                    {generateContractHTML(type, item.id)}
                  </React.Fragment>
                ))
              : item.contract.map((type) => (
                  <React.Fragment key={Math.random()}>
                    <ReactTooltip />
                    {generateContractHTML(type, item.id)}
                  </React.Fragment>
                ))}
          </>
        ) : (
          <li className="no-active-contract">No active contracts</li>
        )}
        {reduceContractLength > 0 ? (
          <span
            style={{ fontSize: '14px', color: '#000000', fontWeight: '300 ' }}
            onClickCapture={(e) => {
              e.stopPropagation();
              setShowContracts(!showContracts);
            }}
            aria-hidden="true">
            {showContracts ? 'show less' : `+ ${contractLength - 2} more`}
          </span>
        ) : (
          ''
        )}
      </ul>
    );
  };
  const generateContractDetails = (item) => {
    return (
      <tr
        className="cursor"
        key={Math.random()}
        onClick={() =>
          history.push(PATH_CUSTOMER_DETAILS.replace(':id', item.id))
        }>
        <td width="25.5%">
          {generateLogoCompanyNameAndGs(
            item,
            item && item.company_name,
            item && item.brand_growth_strategist,
          )}
        </td>
        <td width="16%">
          <div className="status"> {item && item.customer_account_type}</div>
        </td>
        <td width="17%">{generateCompanyStatus(item.status)}</td>
        <td width="41%">{showContractsList(item)}</td>
      </tr>
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
          <td width="38%">
            {generateLogoCompanyNameAndGs(
              item,
              item && item.company_name,
              item && item.brand_growth_strategist,
            )}
          </td>
          <td width="15.5%">
            {generatePerformance(
              item &&
                item.sales_performance &&
                item.sales_performance.current_sum &&
                item.sales_performance.current_sum.revenue,
              2,
              'isTwiceReplace',
              '$',
            )}
            {renderAdPerformanceDifference(
              item &&
                item.sales_performance &&
                item.sales_performance.difference_data &&
                item.sales_performance.difference_data.revenue,
              false,
              'revenue',
            )}
          </td>
          <td width="15.5%">
            {generatePerformance(
              item &&
                item.sales_performance &&
                item.sales_performance.current_sum &&
                item.sales_performance.current_sum.units_sold,
              0,
              '',
              '',
            )}
            {renderAdPerformanceDifference(
              item &&
                item.sales_performance &&
                item.sales_performance.difference_data &&
                item.sales_performance.difference_data.units_sold,
              false,
              'units_sold',
            )}
          </td>
          <td width="16%">
            {generatePerformance(
              item &&
                item.sales_performance &&
                item.sales_performance.current_sum &&
                item.sales_performance.current_sum.traffic,
              0,
              '',
              '',
            )}
            {renderAdPerformanceDifference(
              item &&
                item.sales_performance &&
                item.sales_performance.difference_data &&
                item.sales_performance.difference_data.traffic,
              false,
              'traffic',
            )}
          </td>
          <td width="15%">
            {generatePerformance(
              item &&
                item.sales_performance &&
                item.sales_performance.current_sum &&
                item.sales_performance.current_sum.conversion,
              2,
              '',
              '%',
            )}
            {renderAdPerformanceDifference(
              item &&
                item.sales_performance &&
                item.sales_performance.difference_data &&
                item.sales_performance.difference_data.conversion,
              false,
              'conversion',
            )}
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
          <td width="38%">
            {generateLogoCompanyNameAndGs(
              item,
              item && item.company_name,
              item && item.ad_manager,
            )}
          </td>
          <td width="15.5%">
            {generatePerformance(
              item &&
                item.sponsored_ad_performance &&
                item.sponsored_ad_performance.current_sum &&
                item.sponsored_ad_performance.current_sum.ad_sales,
              2,
              '',
              '$',
            )}
            {renderAdPerformanceDifference(
              item &&
                item.sponsored_ad_performance &&
                item.sponsored_ad_performance.difference_data &&
                item.sponsored_ad_performance.difference_data.ad_sales,
              false,
              'AdSales',
            )}
          </td>
          <td width="15.5%">
            <>
              {generatePerformance(
                item &&
                  item.sponsored_ad_performance &&
                  item.sponsored_ad_performance.current_sum &&
                  item.sponsored_ad_performance.current_sum.ad_spend,
                2,
                '',
                '$',
              )}
              {renderAdPerformanceDifference(
                item &&
                  item.sponsored_ad_performance &&
                  item.sponsored_ad_performance.difference_data &&
                  item.sponsored_ad_performance.difference_data.ad_spend,
                true,
                'AdSpend',
              )}
            </>
          </td>
          <td width="16%">
            <>
              {item &&
              item.sponsored_ad_performance &&
              item.sponsored_ad_performance.current_sum &&
              item.sponsored_ad_performance.current_sum.impressions
                ? item.sponsored_ad_performance.current_sum.impressions
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : 0}
              {renderAdPerformanceDifference(
                item &&
                  item.sponsored_ad_performance &&
                  item.sponsored_ad_performance.difference_data &&
                  item.sponsored_ad_performance.difference_data.impressions,
                false,
                'AdImpressions',
              )}
            </>
          </td>
          <td width="15%">
            <>
              {item &&
              item.sponsored_ad_performance &&
              item.sponsored_ad_performance.current_sum &&
              item.sponsored_ad_performance.current_sum.acos
                ? `${item.sponsored_ad_performance.current_sum.acos.toFixed(
                    2,
                  )}%`
                : '0%'}
              {renderAdPerformanceDifference(
                item &&
                  item.sponsored_ad_performance &&
                  item.sponsored_ad_performance.difference_data &&
                  item.sponsored_ad_performance.difference_data.acos,
                false,
                'ACOS',
              )}
            </>
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
          <td width="38%">
            {generateLogoCompanyNameAndGs(
              item,
              item && item.company_name,
              item && item.ad_manager,
            )}
          </td>
          <td width="15.5%">
            {generatePerformance(
              item.dsp_ad_performance &&
                item.dsp_ad_performance.current_sum &&
                item.dsp_ad_performance.current_sum.impressions,
              2,
              '',
              '',
            )}

            {renderAdPerformanceDifference(
              item &&
                item.dsp_ad_performance &&
                item.dsp_ad_performance.difference_data &&
                item.dsp_ad_performance.difference_data.impressions,
              false,
              'impressions',
            )}
          </td>
          <td width="15.5%">
            <>
              {generatePerformance(
                item &&
                  item.dsp_ad_performance &&
                  item.dsp_ad_performance.current_sum &&
                  item.dsp_ad_performance.current_sum.dsp_spend,
                2,
                '',
                '$',
              )}
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
          <td width="16%">
            <>
              {generatePerformance(
                item &&
                  item.dsp_ad_performance &&
                  item.dsp_ad_performance.current_sum &&
                  item.dsp_ad_performance.current_sum.total_product_sales,
                2,
                '',
                '$',
              )}
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
                ? item.dsp_ad_performance.current_sum.total_roas.toFixed(2)
                : '0'}
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
        </tr>
      );
    }
    if (showContractDetails) {
      return <>{generateContractDetails(item)}</>;
    }
    return <>{generateContractDetails(item)}</>;
  };
  return (
    <CustomerListPage>
      <div className="main-body-container">
        {' '}
        {renderCustomDateModal()}
        <div className="row">
          <div className="col-12 col-lg-3">
            <CustomerListLeftSidePanel
              handleFilters={handleFilters}
              handleSearch={handleSearch}
              generateDropdown={generateDropdown}
              filters={filters}
              setFilters={setFilters}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              status={status}
              showAdPerformance={showAdPerformance}
              showDspAdPerformance={showDspAdPerformance}
              accountType={accountType}
            />
          </div>
          <div className="col-md-12 col-lg-9">
            <div className="table-container">
              <div className="fixed-customer-header ">
                <CustomerListFilters
                  handleFilters={handleFilters}
                  handleSearch={handleSearch}
                  generateDropdown={generateDropdown}
                  filters={filters}
                  setFilters={setFilters}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  showContractDetails={showContractDetails}
                  showPerformance={showPerformance}
                  showAdPerformance={showAdPerformance}
                  showDspAdPerformance={showDspAdPerformance}
                  showOrderOption={showOrderOption}
                  status={status}
                  selectInputRefMobile={selectInputRefMobile}
                  accountType={accountType}
                />
              </div>
              <>
                {isDesktop ? (
                  <>
                    <div className="table-part">
                      <div className="sticky-header">
                        <div className="table-header">{renderHeaders()}</div>
                      </div>
                      {isLoading.loader && isLoading.type === 'page' ? (
                        <PageLoader
                          component="customer-list-loader"
                          color={Theme.baseColor}
                          type="page"
                        />
                      ) : (
                        <Table className="customer-list">
                          <tbody>
                            {data && data.length === 0 ? (
                              <NoRecordFound type="customer-list" />
                            ) : (
                              data &&
                              data.map((item) => renderCustomerDetails(item))
                            )}
                          </tbody>
                        </Table>
                      )}
                    </div>
                    {data && data.length > 0 ? (
                      <div className="footer-sticky">
                        <div
                          className={
                            data.length < 9 && count < 10
                              ? ''
                              : 'straight-line horizontal-line'
                          }
                        />

                        <CommonPagination
                          count={count}
                          pageNumber={
                            JSON.parse(localStorage.getItem('page')) ||
                            pageNumber
                          }
                          handlePageChange={handlePageChange}
                        />
                      </div>
                    ) : null}
                  </>
                ) : (
                  <CustomerListTablet
                    data={data}
                    history={history}
                    count={count}
                    pageNumber={pageNumber}
                    handlePageChange={handlePageChange}
                    isLoading={isLoading}
                    showContractDetails={showContractDetails}
                    setShowContractDetails={setShowContractDetails}
                    showPerformance={showPerformance}
                    setShowPerformance={setShowPerformance}
                    showAdPerformance={showAdPerformance}
                    setShowAdPerformance={setShowAdPerformance}
                    showDspAdPerformance={showDspAdPerformance}
                    setShowDspAdPerformance={setShowDspAdPerformance}
                    setStatus={status}
                    brandGrowthStrategist={brandGrowthStrategist}
                    salesSortOptions={salesSortOptions}
                    sponsorAdSortOptions={sponsorAdSortOptions}
                    dspAdSortOptions={dspAdSortOptions}
                    showContracts={showContracts}
                    setShowContracts={setShowContracts}
                    accountType={accountType}
                    generateLogoCompanyNameAndGs={generateLogoCompanyNameAndGs}
                    generateCompanyStatus={generateCompanyStatus}
                    generatePerformance={generatePerformance}
                    showContractsList={showContractsList}
                  />
                )}
              </>
            </div>
          </div>
        </div>
      </div>
    </CustomerListPage>
  );
}
