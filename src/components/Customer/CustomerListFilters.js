import React, { useRef, useEffect } from 'react';

import { DebounceInput } from 'react-debounce-input';
import ReactTooltip from 'react-tooltip';
import { useMediaQuery } from 'react-responsive';
import $ from 'jquery';
import dayjs from 'dayjs';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';

import {
  CheckBox,
  DropDownSelect,
  InputSearchWithRadius,
  ModalRadioCheck,
  GetInitialName,
} from '../../common';
import {
  contractChoices,
  contractStatus,
  timeFrameFilters,
  sortByOrderOptions,
  options,
  sortOptions,
} from '../../constants/FieldConstants';
import {
  CustomerLeftPannel,
  MobileLeftSidebar,
  SideContent,
} from '../../theme/CustomerListStyle';
import {
  CaretUp,
  CloseIcon,
  InfoIcon,
  SearchIcon,
  SliderHIcon,
} from '../../theme/images';

function CustomerListFilters({
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
  showPerformance,
  setShowPerformance,
  showAdPerformance,
  setShowAdPerformance,
  showDspAdPerformance,
  setShowDspAdPerformance,
  showOrderOption,
  setShowOrderOption,
  orderByFlag,
  setOrderByFlag,
  selectedValue,
  setSelectedValue,
  isCustomDateApply,
  setIsCustomDateApply,
  selectedTimeFrame,
  setSelectedTimeFrame,
  setExpiringSoon,
  setShowCustomDateModal,
  brandGrowthStrategist,
  status,
  selectInputRefMobile,
  salesSortOptions,
  sponsorAdSortOptions,
  dspAdSortOptions,
  customerList,
  pageNumber,
}) {
  const selectInputRef = useRef();
  const { Option, SingleValue } = components;
  const isDesktop = useMediaQuery({ minWidth: 991 });

  const IconOption = (dataProps) => (
    <Option {...dataProps}>
      {/* {props.data.icon ? ( // for multi select user */}
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
      {dataProps.data.icon ? (
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
      )}{' '}
      <span style={{ lineHeight: 0, fontSize: '15px' }}>
        {dataProps.data.label}
      </span>
    </SingleValue>
  );

  const SortOption = (dataProps) => (
    <SingleValue {...dataProps}>
      {dataProps.data.label === 'Sales Performance' ||
      dataProps.data.label === 'Contract Details' ||
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
        setShowPerformance(false);
        setShowAdPerformance(false);
        setShowDspAdPerformance(false);
        setFilters({
          ...filters,
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
            showPerformance: false,
            showAdPerformance: false,
            showDspAdPerformance: false,
            sort_by: '-created_at',
            sequence: false,
            daily_facts: 'week',
          }),
        );
      } else if (event.value === 'performance') {
        setShowPerformance(true);
        setShowAdPerformance(false);
        setShowDspAdPerformance(false);
        setFilters({
          ...filters,
          showPerformance: true,
          showAdPerformance: false,
          showDspAdPerformance: false,
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            showPerformance: true,
            showAdPerformance: false,
            showDspAdPerformance: false,
          }),
        );
      } else if (event.value === 'sponsored_ad_performance') {
        setShowPerformance(false);
        setShowAdPerformance(true);
        setShowDspAdPerformance(false);
        setFilters({
          ...filters,
          showPerformance: false,
          showAdPerformance: true,
          showDspAdPerformance: false,
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
            showPerformance: false,
            showAdPerformance: true,
            showDspAdPerformance: false,
          }),
        );
      } else if (event.value === 'dsp_ad_performance') {
        setShowPerformance(false);
        setShowAdPerformance(false);
        setShowDspAdPerformance(true);
        setFilters({
          ...filters,
          showPerformance: false,
          showAdPerformance: false,
          showDspAdPerformance: true,
        });
        localStorage.setItem(
          'filters',
          JSON.stringify({
            ...filters,
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
    if (key === 'user') localStorage.setItem('bgs', JSON.stringify(event));
    localStorage.setItem('page', 1);
    if (key === 'unselected') {
      $('.checkboxes input:checkbox').prop('checked', false);
      $('.checkboxes input:radio').prop('checked', false);
      if (selectInputRef && selectInputRef.current)
        selectInputRef.current.select.clearValue();
      if (selectInputRefMobile && selectInputRefMobile.current)
        selectInputRefMobile.current.select.clearValue();

      setFilters({
        ...filters,
        status: [],
        contract_status: [],
        contract_type: [],
        user: [],
        ad_user: [],
        dsp_user: [],
      });
      localStorage.setItem(
        'filters',
        JSON.stringify({
          ...filters,
          status: [],
          contract_status: [],
          contract_type: [],
          user: [],
          ad_user: [],
          dsp_user: [],
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

    // for single user selected
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
      } else {
        if (!showAdPerformance && !showDspAdPerformance) {
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
      if (filters.user && !showAdPerformance && !showDspAdPerformance) {
        if (localStorage.getItem('bgs')) {
          return JSON.parse(localStorage.getItem('bgs'));
        }
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

      return [{ value: 'any', label: 'Any' }];
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
    return [{ value: 'contract_details', label: 'Contract Details' }];
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

  return (
    <>
      {' '}
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
                    <DropDownSelect
                      id="BT-order-customerlist-dropdown"
                      className="w-250">
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
            <div
              className={
                showAdPerformance || showDspAdPerformance || showPerformance
                  ? 'col-lg-4 col-md-6 col-12 col-8  mb-2 pr-2 pl-2'
                  : 'col-lg-6 col-md-6 col-12 col-8  mb-2 pr-2 pl-2'
              }>
              <InputSearchWithRadius className="customer-list-header w-80">
                <DebounceInput
                  // minLength={2}
                  debounceTimeout={600}
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
            <div className="col-lg-2 col-md-6  col-12   mb-2  pl-2 pr-2 ">
              <DropDownSelect
                id="BT-view-customerlist-dropdown"
                className="customer-list-header">
                {generateDropdown('view')}
              </DropDownSelect>{' '}
            </div>
            {showAdPerformance || showDspAdPerformance || showPerformance ? (
              <div className="col-lg-2 col-md-4 col-12   mb-2 pl-2 pr-2 ">
                <DropDownSelect
                  id="BT-stats-customerlist-dropdown"
                  className="customer-list-header">
                  {generateDropdown('stats')}
                </DropDownSelect>{' '}
              </div>
            ) : (
              <></>
            )}
            <div className="col-lg-2 col-md-4 col-12 pl-2 pr-2">
              <DropDownSelect
                id="BT-sort-customerlist-dropdown"
                className="customer-list-header">
                {generateDropdown('sort')}
              </DropDownSelect>{' '}
            </div>
            {showOrderOption && !isDesktop ? (
              <div className="col-lg-2 col-md-4 col-12 pl-2 pr-2">
                <DropDownSelect
                  id="BT-order-customerlist-dropdown"
                  className="customer-list-header">
                  {generateDropdown('order')}
                </DropDownSelect>
              </div>
            ) : null}
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
        {showAdPerformance ? (
          <div className="label mt-2 mb-2">Sponsored Ad Manager</div>
        ) : showDspAdPerformance ? (
          <div className="label mt-2 mb-2">DSP Ad Manager</div>
        ) : (
          <div className="label mt-2 mb-2">Brand Strategist</div>
        )}
        <DropDownSelect id="BT-user-customerlist-dropdown" className="w-250">
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
    </>
  );
}

export default CustomerListFilters;
CustomerListFilters.defaultProps = {
  searchQuery: null,
  pageNumber: 1,
  orderByFlag: false,
};
CustomerListFilters.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.arrayOf(PropTypes.string),
    contract_type: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    contract_status: PropTypes.arrayOf(PropTypes.string),
    searchQuery: PropTypes.arrayOf(PropTypes.array),
    user: PropTypes.arrayOf(PropTypes.array),
    ad_user: PropTypes.arrayOf(PropTypes.array),
    dsp_user: PropTypes.arrayOf(PropTypes.array),
  }).isRequired,

  setFilters: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func.isRequired,
  showPerformance: PropTypes.bool.isRequired,
  setShowPerformance: PropTypes.func.isRequired,
  showAdPerformance: PropTypes.bool.isRequired,
  setShowAdPerformance: PropTypes.func.isRequired,
  showDspAdPerformance: PropTypes.bool.isRequired,
  setShowDspAdPerformance: PropTypes.func.isRequired,
  showOrderOption: PropTypes.bool.isRequired,
  setShowOrderOption: PropTypes.func.isRequired,
  orderByFlag: PropTypes.bool,
  setOrderByFlag: PropTypes.func.isRequired,
  isCustomDateApply: PropTypes.bool.isRequired,
  setIsCustomDateApply: PropTypes.func.isRequired,

  selectedTimeFrame: PropTypes.shape({
    daily_facts: PropTypes.string,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
  }).isRequired,

  setSelectedTimeFrame: PropTypes.func.isRequired,

  selectedValue: PropTypes.shape({
    'order-by': PropTypes.string,
  }).isRequired,

  setSelectedValue: PropTypes.func.isRequired,
  setExpiringSoon: PropTypes.func.isRequired,
  setShowCustomDateModal: PropTypes.func.isRequired,

  selectInputRefMobile: PropTypes.objectOf(PropTypes.object).isRequired,
  brandGrowthStrategist: PropTypes.arrayOf(PropTypes.object).isRequired,
  status: PropTypes.arrayOf(PropTypes.object).isRequired,
  salesSortOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  sponsorAdSortOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  dspAdSortOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  customerList: PropTypes.func.isRequired,
  pageNumber: PropTypes.number,
};
