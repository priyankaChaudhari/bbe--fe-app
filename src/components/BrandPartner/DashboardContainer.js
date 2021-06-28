/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import Select, { components } from 'react-select';
import Modal from 'react-modal';
import { DateRange } from 'react-date-range';
import { enGB } from 'react-date-range/src/locale';
import Dashboard from './Dashboard';
import AdManagerDashboard from './AdManagerDashboard';
import DspAdDashboard from './DspAdDashboard';

import { BrandPartnerDashboard } from '../../theme/Global';
import getBGSCustomerList from '../../api/BgsApi';
import { getManagersList } from '../../api';

import {
  DropDownSelect,
  GetInitialName,
  CommonPagination,
  ModalBox,
  Button,
} from '../../common';

import { CaretUp, CloseIcon } from '../../theme/images';

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

function DashboardContainer() {
  const userInfo = useSelector((state) => state.userState.userInfo);
  const { Option, SingleValue, MultiValue } = components;

  const [brandGrowthStrategist, setBrandGrowthStrategist] = useState([]);
  const [selectedBgsUser, setSelectedBgsUser] = useState(userInfo.id);

  const [selectedValue, setSelectedValue] = useState({
    type: 'week',
    group: 'weekly',
    bgs: '',
  });
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });

  const timeOptions = [
    { value: 'week', label: 'Recent 7 days', sub: 'vs Previous 7 days' },
    { value: 'month', label: 'Recent Month', sub: 'vs Previous month' },
    { value: '30days', label: 'Recent 30 Days', sub: 'vs Previous 30 days' },
    // { value: 'year', label: 'Year to Date', sub: 'vs previous year' },
    {
      value: 'custom',
      label: 'Custom Range',
      sub: 'Select start and end dates',
    },
  ];

  const hybridDropdown = [
    { value: 'sponsored_ad_dashboard', label: 'Sponsored Ad Partners' },
    { value: 'dsp_ad_performance', label: 'DSP Ad Partners' },
  ];
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState();
  const [count, setCount] = useState(null);
  const [showBgsCustomDateModal, setShowBgsCustomDateModal] = useState(false);
  const [hybridView, setHybridView] = useState('sponsored_ad_dashboard');

  const selectInputRef = useRef();

  const currentDate = new Date();

  const [bgsData, setBgsData] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'bgsSelection',
    },
  ]);

  const bgsCustomerList = useCallback(
    (
      currentPage,
      selectedUser,
      dateFilter,
      hybridSelectedDashboard = null,
      startDate = null,
      endDate = null,
    ) => {
      setIsLoading({ loader: true, type: 'page' });
      getBGSCustomerList(
        currentPage,
        selectedUser || userInfo.id,
        dateFilter,
        userInfo && userInfo.role,
        hybridSelectedDashboard,
        startDate,
        endDate,
      ).then((response) => {
        setData(response && response.data && response.data.results);
        setPageNumber(currentPage);
        setCount(response && response.data && response.data.count);
        getManagersList(
          userInfo && userInfo.role,
          hybridSelectedDashboard,
        ).then((gs) => {
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
          setIsLoading({ loader: false, type: 'page' });
        });
      });
    },
    [userInfo.id],
  );

  useEffect(() => {
    bgsCustomerList(1, userInfo.id, selectedValue, hybridView);
  }, []);

  const handleOnchange = (event, type) => {
    if (type === 'bgs') {
      setSelectedValue({ ...selectedValue, bgs: event && event.value });
      setSelectedBgsUser({ ...event });
      bgsCustomerList(1, event && event.value, selectedValue, hybridView);
    } else if (type === 'dashboard') {
      setHybridView(event.value);
      setSelectedValue({ ...selectedValue, bgs: '' });
      setSelectedBgsUser(null);
      bgsCustomerList(1, userInfo.id, selectedValue, event.value);
    } else if (type === 'date') {
      if (event && event.value === 'custom') {
        setShowBgsCustomDateModal(true);
      } else {
        setSelectedValue({
          ...selectedValue,
          type: event.value,
          group: event.group,
        });
        bgsCustomerList(
          pageNumber,
          selectedValue.bgs,
          {
            type: event.value,
          },
          hybridView,
        );
      }
    }
  };

  const filterOption = (props) => (
    <Option {...props}>
      <div className="pb-2">
        <span style={{ fontSize: '15px', color: '#000000' }}>
          {props.data.label}
        </span>

        <div style={{ fontSize: '12px', color: '#556178' }}>
          {props.data.sub}
        </div>
      </div>
    </Option>
  );

  const singleFilterOption = (props) => (
    <SingleValue {...props}>
      <span style={{ fontSize: '15px', color: '#000000' }}>
        {props.data.label}
      </span>

      <div style={{ fontSize: '12px', color: '#556178' }}>{props.data.sub}</div>
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
  const IconOption = (props) => (
    <Option {...props}>
      {props.data.icon ? (
        <img
          className="drop-down-user"
          src={props.data.icon}
          alt="user"
          style={{
            borderRadius: 50,
            marginRight: '6px',
            height: '30px',
            verticalAlign: 'middle',
            float: 'left',
          }}
        />
      ) : (
        <GetInitialName
          userInfo={props.data.label}
          type="list"
          property="mr-2 float-left "
          style={{
            verticalAlign: 'middle',
          }}
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
            width: '30px',
            marginBottom: '',
            verticalAlign: 'middle',
          }}
        />
      ) : (
        <GetInitialName userInfo={props.data.label} type="list" property="" />
      )}{' '}
      &nbsp;
      <span style={{ lineHeight: 0, fontSize: '15px' }}>
        {props.data.label}
      </span>
    </MultiValue>
  );

  const getSelectComponents = (type) => {
    if (type === 'user') {
      return {
        Option: IconOption,
        MultiValue: IconSingleOption,
        DropdownIndicator,
      };
    }
    if (type === 'dashboard') {
      return {
        Option: filterOption,
        MultiValue: singleFilterOption,
        DropdownIndicator,
      };
    }
    return {
      Option: filterOption,
      SingleValue: singleFilterOption,
      DropdownIndicator,
    };
  };

  const BgsYearAndCustomDateFilter = (startDate, endDate, type) => {
    let sd = startDate;
    let ed = endDate;

    if (type === 'custom') {
      sd = `${startDate.getDate()}-${
        startDate.getMonth() + 1
      }-${startDate.getFullYear()}`;
      ed = `${endDate.getDate()}-${
        endDate.getMonth() + 1
      }-${endDate.getFullYear()}`;

      bgsCustomerList(
        pageNumber,
        selectedValue.bgs,
        {
          type,
        },
        hybridView,
        sd,
        ed,
      );
    }
  };

  const applyCustomDate = () => {
    BgsYearAndCustomDateFilter(
      bgsData[0].startDate,
      bgsData[0].endDate,
      'custom',
    );
    setShowBgsCustomDateModal(false);
  };

  const setMaxDate = () => {
    const d = currentDate;
    if (
      (userInfo && userInfo.role === 'Growth Strategist') ||
      (userInfo && userInfo.role === 'BGS')
    ) {
      d.setDate(d.getDate() - 4);
    } else {
      d.setDate(d.getDate() - 3);
    }
    return d;
  };

  const renderBgsCustomDateModal = () => {
    return (
      <Modal
        isOpen={showBgsCustomDateModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => {
            setShowBgsCustomDateModal(false);
            setBgsData([
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
                setBgsData([item.bgsSelection]);
              }}
              showMonthAndYearPickers={false}
              ranges={bgsData}
              moveRangeOnFirstSelection={false}
              showDateDisplay={false}
              maxDate={setMaxDate()}
              rangeColors={['#FF5933']}
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

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    bgsCustomerList(currentPage, selectedValue.bgs, selectedValue, hybridView);
  };

  // const handleOnHybridDropdown = (event) => {
  //   setHybridView(event.value);
  //   setSelectedValue({ ...selectedValue, bgs: '' });
  //   if (selectInputRef && selectInputRef.current)
  //     selectInputRef.current.select.clearValue();
  //   bgsCustomerList(1, event.value, selectedValue, event.value);
  // };

  const displayHeader = () => {
    return (
      <>
        {renderBgsCustomDateModal()}
        <div className="dashboard-header-sticky">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-md-12">
                <p className="black-heading-title ml-1 pt-1">
                  {(userInfo && userInfo.role === 'Growth Strategist') ||
                  (userInfo && userInfo.role === 'BGS')
                    ? 'BGS Dashboard'
                    : userInfo && userInfo.role === 'DSP Ad Manager'
                    ? 'Dsp Dashboard'
                    : (userInfo &&
                        userInfo.role === 'Sponsored Advertising Ad Manager') ||
                      (userInfo && userInfo.role === 'Ad Manager')
                    ? 'Ad Manager Dashboard'
                    : userInfo &&
                      userInfo.role === 'Hybrid Ad Manager' &&
                      hybridView === 'sponsored_ad_dashboard'
                    ? 'Ad Manager Dashboard'
                    : userInfo &&
                      userInfo.role === 'Hybrid Ad Manager' &&
                      hybridView === 'dsp_ad_performance'
                    ? 'Dsp Dashboard'
                    : 'Dashboard'}
                </p>
              </div>
              <div className="straight-line horizontal-line spacing d-lg-none d-md-block" />
              <div className="col-lg-9 col-md-12 text-md-center text-lg-right mb-2 ">
                <ul className="partner-select">
                  <li
                    className={
                      isLoading.loader ? 'my-partner disabled' : 'my-partner '
                    }>
                    <DropDownSelect>
                      <Select
                        ref={selectInputRef}
                        className="text-left active"
                        classNamePrefix="react-select"
                        placeholder="My Partners"
                        options={brandGrowthStrategist}
                        components={getSelectComponents('user')}
                        componentsValue={{ Option: IconOption }}
                        value={selectedBgsUser}
                        onChange={(event) => {
                          handleOnchange(event, 'bgs');
                        }}
                      />
                    </DropDownSelect>
                  </li>
                  {userInfo && userInfo.role === 'Hybrid Ad Manager' ? (
                    <li className={isLoading.loader ? 'disabled' : ''}>
                      <DropDownSelect>
                        <Select
                          className="text-left active"
                          classNamePrefix="react-select"
                          placeholder="Hybrid Dashboard type"
                          options={hybridDropdown}
                          components={getSelectComponents('dashboard')}
                          defaultValue={hybridDropdown[0]}
                          onChange={(event) =>
                            handleOnchange(event, 'dashboard')
                          }
                        />
                      </DropDownSelect>
                    </li>
                  ) : (
                    ''
                  )}
                  <li className={isLoading.loader ? 'disabled' : ''}>
                    <DropDownSelect className="days-performance">
                      <Select
                        classNamePrefix="react-select"
                        className="active"
                        components={getSelectComponents()}
                        options={timeOptions}
                        defaultValue={timeOptions[0]}
                        onChange={(event) => handleOnchange(event, 'date')}
                      />
                    </DropDownSelect>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="straight-line horizontal-line mt-n2" />
        </div>
      </>
    );
  };

  return (
    <BrandPartnerDashboard>
      {displayHeader()}
      {(userInfo && userInfo.role === 'Growth Strategist') ||
      (userInfo && userInfo.role === 'BGS') ? (
        <Dashboard isLoading={isLoading} data={data} />
      ) : (
        ''
      )}
      {(userInfo && userInfo.role === 'Sponsored Advertising Ad Manager') ||
      (userInfo && userInfo.role === 'Ad Manager') ? (
        <AdManagerDashboard isLoading={isLoading} data={data} />
      ) : (
        ''
      )}
      {userInfo && userInfo.role === 'DSP Ad Manager' ? (
        <DspAdDashboard isLoading={isLoading} data={data} />
      ) : (
        ''
      )}

      {userInfo.role === 'Hybrid Ad Manager' &&
      hybridView === 'sponsored_ad_dashboard' ? (
        <AdManagerDashboard isLoading={isLoading} data={data} />
      ) : (
        ''
      )}
      {userInfo.role === 'Hybrid Ad Manager' &&
      hybridView === 'dsp_ad_performance' ? (
        <DspAdDashboard isLoading={isLoading} data={data} />
      ) : (
        ''
      )}
      <div className="footer-sticky">
        <div className="straight-line horizontal-line" />
        <div className="container-fluid">
          <CommonPagination
            count={count}
            pageNumber={pageNumber}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </BrandPartnerDashboard>
  );
}

export default DashboardContainer;
