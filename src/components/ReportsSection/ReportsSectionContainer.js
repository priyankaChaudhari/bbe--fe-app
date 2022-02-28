import React, { useCallback, useEffect, useRef, useState } from 'react';

import dayjs from 'dayjs';
import { components } from 'react-select';
import { DebounceInput } from 'react-debounce-input';
import { shape, string } from 'prop-types';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';

import ReportSectionFilters from './ReportSectionFilters';
import ReportSectionList from './ReportSectionList';
import { SearchIcon } from '../../theme/images';
import { DropDown } from '../Customer/CompanyPerformance/DropDown';
import { BrandPartnerDashboard, DashboardCard } from '../../theme/Global';
import {
  getBPUserList,
  getReportDownload,
  getReportsSectionData,
  getReportTypes,
} from '../../api';
import {
  WhiteCard,
  DropdownIndicator,
  InputSearchWithRadius,
  CustomDateModal,
} from '../../common';

const _ = require('lodash');

function ReportsSectionContainer() {
  const mounted = useRef(false);
  const { Option, SingleValue } = components;
  const isDesktop = useMediaQuery({ minWidth: 767 });
  const [bpList, setBpList] = useState([{}, {}]);
  const [reportsData, setReportsData] = useState([]);
  const [isApiCall, setIsApiCall] = useState(false);
  const [reportsLoader, setReportsLoader] = useState(false);
  const [isCustomDateApply, setIsCustomDateApply] = useState(false);
  const [showAdCustomDateModal, setShowAdCustomDateModal] = useState(false);
  const [itemLoader, setItemLoader] = useState({});
  const [selectedBp, setSelectedBp] = useState({
    value: 'Select-BP',
    label: 'Select BP',
  });
  const [selectedReportType, setSelectedReportType] = useState([
    {
      value: 'reportType',
      label: 'Report Type',
    },
  ]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState({
    value: 'week',
    label: 'Recent 7 days',
  });
  const [reportTypeOptions, setReportTypesOptions] = useState([]);
  const [reportCount, setReportCount] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const currentDate = new Date();
  const [customDateState, setCustomDateState] = useState([
    {
      startDate: currentDate,
      endDate: currentDate,
      key: 'reportSection',
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const generateCustomDate = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const getReportType = useCallback(() => {
    getReportTypes().then((res) => {
      if (mounted.current) {
        if (res && res.status === 400) {
          setIsApiCall(false);
        }
        if (res && res.status === 200) {
          if (res?.data) {
            setReportTypesOptions(
              _.concat(
                [
                  {
                    value: 'reportType',
                    label: 'Report Type',
                  },
                ],
                res?.data,
              ),
            );
          } else {
            setReportTypesOptions([]);
          }
        }
        setIsApiCall(false);
      }
    });
  }, []);

  const getReportsData = useCallback((reportType, searchString, page) => {
    setReportsLoader(true);
    getReportsSectionData(reportType, searchString, page).then((res) => {
      if (mounted.current) {
        if (res && res.status === 400) {
          setReportsLoader(false);
        }
        if (res && res.status === 200) {
          if (res.data && res.data.results) {
            setReportsData(res.data.results);
            setReportCount(res.data.count);
          } else {
            setReportsData([]);
          }
        }

        setReportsLoader(false);
      }
    });
  }, []);

  const getBpList = useCallback((query) => {
    getBPUserList(query).then((res) => {
      if (mounted.current) {
        if (res && res.status === 400) {
          setBpList([]);
        }
        if (res && res.status === 200) {
          if (res?.data?.results) {
            const list = [
              {
                value: 'Select-BP',
                label: 'Select BP',
              },
            ];
            if (res?.data?.results?.length > 0)
              for (const option of res?.data?.results) {
                list.push({
                  value: option.id,
                  label: option.company_name,
                });
              }
            setBpList(list);
            setSelectedBp(list[0]);
          } else {
            setBpList([]);
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    getBpList();
    return () => {
      mounted.current = false;
    };
  }, [getBpList]);

  useEffect(() => {
    mounted.current = true;
    getReportType();
    return () => {
      mounted.current = false;
    };
  }, [getReportType]);

  useEffect(() => {
    getReportsData(selectedReportType.value, searchQuery, 1);
  }, [getReportsData, searchQuery, selectedReportType.value]);

  const handleBPList = (event) => {
    if (event.value !== selectedBp.value) {
      setSelectedBp(event);
    }
  };

  const handleTimeFrame = (event) => {
    const { value } = event;
    if (value !== selectedTimeFrame.value) {
      setSelectedTimeFrame(event);
      setIsCustomDateApply(false);
      if (value !== 'custom') {
        setCustomDateState([
          {
            startDate: currentDate,
            endDate: currentDate,
            key: 'reportSection',
          },
        ]);
      }
    }
    if (value === 'custom') {
      setShowAdCustomDateModal(true);
    }
  };

  const handleReportType = (event) => {
    const { value } = event;
    if (value !== selectedReportType) {
      setSelectedReportType(event);
    }
  };

  const handleResetFilter = () => {
    setSelectedReportType([
      {
        value: 'reportType',
        label: 'Report Type',
      },
    ]);
    setPageNumber(1);
    setSearchQuery('');
  };

  const handleSearch = (event) => {
    setTimeout(() => {
      setSearchQuery(event.target.value);
    }, 1000);
  };

  const handlePageChange = (currentPage) => {
    getReportsData(selectedReportType.value, searchQuery, currentPage);
    setPageNumber(currentPage);
  };

  const applyCustomDate = () => {
    setIsCustomDateApply(true);
    setShowAdCustomDateModal(false);
  };

  const onDownload = (id, index) => {
    let sd = null;
    let ed = null;

    if (selectedTimeFrame.value === 'custom') {
      sd = generateCustomDate(customDateState[0].startDate);
      ed = generateCustomDate(customDateState[0].endDate);
    }
    setItemLoader({ ...itemLoader, [index]: true });
    getReportDownload(
      selectedBp.value,
      selectedTimeFrame.value,
      sd,
      ed,
      id,
    ).then((res) => {
      if (res?.status === 200) {
        const csvLink = res?.data?.url;
        if (csvLink) {
          window.open(csvLink);
        }
        if (res?.data?.message) {
          toast.error(res?.data?.message, {
            position: isDesktop ? 'top-center' : 'top-right',
          });
        }
      } else {
        toast.error('Something went wrong', {
          position: isDesktop ? 'top-center' : 'top-right',
        });
      }
      setItemLoader((oldLoadingState) => ({
        ...oldLoadingState,
        [index]: false,
      }));
    });
  };

  const reportTypeFilterOption = (props) => (
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

  const singleReportTypeFilterOption = (props) => (
    <SingleValue {...props}>
      <span style={{ fontSize: '15px', color: '#000000' }}>
        {props.data.label}
      </span>

      <div style={{ fontSize: '12px', color: '#556178' }}>{props.data.sub}</div>
    </SingleValue>
  );

  const getTypeComponents = () => {
    return {
      Option: reportTypeFilterOption,
      SingleValue: singleReportTypeFilterOption,
      DropdownIndicator,
    };
  };

  const renderCustomDateSubLabel = (props) => {
    if (selectedTimeFrame.value === 'custom' && isCustomDateApply) {
      return `From- ${dayjs(customDateState[0].startDate).format(
        'MMM D, YYYY',
      )}  To- ${dayjs(customDateState[0].endDate).format('MMM D, YYYY')}`;
    }
    return props.data.sub;
  };

  const timeFrameFilterOption = (props) => (
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

  const singleTimeFrameFilterOption = (props) => (
    <SingleValue {...props}>
      <span style={{ fontSize: '15px', color: '#000000' }}>
        {props.data.label}
      </span>

      <div style={{ fontSize: '12px', color: '#556178' }}>
        {renderCustomDateSubLabel(props)}
      </div>
    </SingleValue>
  );

  const getTimeFrameSelectComponents = () => {
    return {
      Option: timeFrameFilterOption,
      SingleValue: singleTimeFrameFilterOption,
      DropdownIndicator,
    };
  };

  const displayHeader = () => {
    return (
      <>
        <div className="dashboard-header-sticky">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-md-12">
                <p className="black-heading-title ml-1 pt-1">Reports</p>
              </div>

              <div className="straight-line horizontal-line  d-lg-none d-md-block" />
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderReportListFilters = () => {
    return (
      <div className="row">
        <div className="col-md-6 col-sm1-12 px-2 mb-3">
          <InputSearchWithRadius className="customer-list-header">
            <DebounceInput
              minLength={3}
              debounceTimeout={600}
              className=" form-control search-filter form-control-info"
              placeholder="Search"
              onChange={(event) => {
                handleSearch(event);
              }}
              value={searchQuery || ''}
            />

            <img src={SearchIcon} alt="search" className="search-input-icon" />
          </InputSearchWithRadius>
        </div>
        <div className="col-md-3 col-sm1-12  px-2 mb-3">
          {DropDown(
            'days-performance',
            reportTypeOptions,
            reportTypeOptions[0]?.label,
            getTypeComponents,
            reportTypeOptions[0],
            handleReportType,
            isApiCall,
            null,
            selectedReportType,
          )}
          <div className="clear-fix" />
        </div>
        <div className="col-md-3 col-sm1-12 d-md-block d-none text-right cursor">
          <p
            onClick={() => handleResetFilter()}
            role="presentation"
            className="gray-normal-text mt-2">
            Reset filters
          </p>
        </div>
        <div className="straight-line horizontal-line  d-md-block d-none mx-3" />
      </div>
    );
  };

  return (
    <BrandPartnerDashboard>
      {displayHeader()}
      <DashboardCard className="ad-manager-dashboard">
        <div className="dashboard-container-body">
          {' '}
          <div className="row mt-3">
            <div className="col-lg-3 col-md-12">
              <ReportSectionFilters
                bpList={bpList}
                handleBPList={handleBPList}
                isApiCall={isApiCall}
                selectedBp={selectedBp}
                setBpList={setBpList}
                handleTimeFrame={handleTimeFrame}
                selectedTimeFrame={selectedTimeFrame}
                getBpList={getBpList}
                setSelectedBp={setSelectedBp}
                getTimeFrameSelectComponents={getTimeFrameSelectComponents}
              />
            </div>
            <div className="col-lg-9 col-md-12">
              <WhiteCard className="mb-3">
                <div className="row">
                  <div className="col-md-12 col-6">
                    <p className="black-heading-title  mt-0 mb-3">
                      Report List
                    </p>
                  </div>
                  <div className=" col-6 d-md-none d-block text-right">
                    <p
                      onClick={() => handleResetFilter()}
                      role="presentation"
                      className="gray-normal-text mt-0 mb-3">
                      Reset filters
                    </p>
                  </div>
                </div>
                {renderReportListFilters()}
                <ReportSectionList
                  loader={reportsLoader}
                  itemLoader={itemLoader}
                  reportsData={reportsData}
                  selectedBp={selectedBp?.value}
                  selectedTimeFrame={selectedTimeFrame}
                  generateCustomDate={generateCustomDate}
                  onDownload={onDownload}
                  count={reportCount}
                  pageNumber={pageNumber}
                  handlePageChange={handlePageChange}
                />
              </WhiteCard>
            </div>
          </div>
        </div>
        <CustomDateModal
          id="BT-salesSponsoredDashboard-daterange"
          isOpen={showAdCustomDateModal}
          range={customDateState}
          onClick={() => {
            setShowAdCustomDateModal(false);
            setCustomDateState([
              {
                startDate: currentDate,
                endDate: currentDate,
                key: 'reportSection',
              },
            ]);
          }}
          onChange={(item) => {
            setCustomDateState([item.reportSection]);
          }}
          onApply={() => applyCustomDate()}
          currentDate={currentDate}
        />
      </DashboardCard>
    </BrandPartnerDashboard>
  );
}

export default ReportsSectionContainer;

ReportsSectionContainer.defaultProps = { data: {} };

ReportsSectionContainer.propTypes = {
  data: shape({ sub: string, label: string }),
};
