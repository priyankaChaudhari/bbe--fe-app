import React, { useState, useRef, useCallback, useEffect } from 'react';

import DatePicker from 'react-datepicker';
import { CSVLink } from 'react-csv';

import BrandPartnerModal from './Modals/BrandPartnerModal';
import BGSCommissionsMatrics from './BGSCommissionsMatrics';
import BGScommissionTable from './BGScommissionTable';
import {
  getBgsCommissionGroupByTable,
  getBgsCommissionMatrics,
  getBgsCommissionTableIndividualsData,
} from '../../../../api';
import { Button, CustomDateRange } from '../../../../common';
import { monthNames, commissionsTableheader } from '../../../../constants';
import { CaretUp, CloseIcon, RightArrowIcons } from '../../../../theme/images';
import {
  CommissionNav,
  DateRangeDropDown,
  DropDownSelectMonthPicker,
} from './BGSCommissionContainerStyle';

const BGSCommissionContainer = () => {
  const mounted = useRef(false);
  const dropdownRef = useRef(null);
  const currentDate = new Date();
  const today = currentDate.getDate();
  currentDate.setMonth(currentDate.getMonth() - (today < 4 ? 2 : 1));
  currentDate.setDate(1);

  const [showModal, setShowModal] = useState(false);
  const [groupBy, setGroupBy] = useState(true);
  const [loader, setLoader] = useState(false);
  const [showDropdown, setShowDropdown] = useState({ show: false });
  const [commissionData, setCommissionData] = useState(null);
  const [commissionMetrics, setCommissionMetrics] = useState({});
  const [bgs, setBgs] = useState({});

  const [dummayDateRange, setDummayDateRange] = useState([
    currentDate,
    currentDate,
  ]);
  const [timeFrame, setTimeFrame] = useState([currentDate, currentDate]);
  const [range, setRange] = useState([currentDate, currentDate]);

  const [selectedTableFilter, setSelectedTableFilter] = useState({
    value: 'full_name',
    label: 'Team Member',
  });

  const startMonth = `${
    monthNames[dummayDateRange[0].getMonth()]
  } '${dummayDateRange[0].getFullYear()}`;

  const endMonth = `${
    monthNames[dummayDateRange[1].getMonth()]
  } '${dummayDateRange[1].getFullYear()}`;

  const getCommissionMatrics = useCallback(() => {
    setCommissionMetrics({});
    getBgsCommissionMatrics(timeFrame).then((res) => {
      if (mounted.current) {
        if (res && (res.status === 400 || res.status === 404)) {
          setCommissionMetrics({});
        }
        if (res && res.status === 200) {
          if (res.data) {
            setCommissionMetrics(res.data);
          }
        }
      }
    });
  }, [timeFrame]);

  const getCommissionTableIndividuals = useCallback(() => {
    setCommissionData(null);
    setLoader(true);
    getBgsCommissionTableIndividualsData(
      timeFrame,
      selectedTableFilter.value,
    ).then((res) => {
      if (mounted.current) {
        if (res && (res.status === 400 || res.status === 404)) {
          setLoader(false);
          setCommissionData(null);
        }
        if (res && res.status === 200) {
          if (res.data && res.data.results && res.data.results.length > 0) {
            setCommissionData(res.data.results);
          }
        }
        setLoader(false);
      }
    });
  }, [selectedTableFilter, timeFrame]);

  const getCommissionTableGroupByBGS = useCallback(() => {
    setCommissionData(null);
    setLoader(true);
    getBgsCommissionGroupByTable(timeFrame, selectedTableFilter.value).then(
      (res) => {
        if (mounted.current) {
          if (res && (res.status === 400 || res.status === 404)) {
            setLoader(false);
            setCommissionData(null);
          }
          if (res && res.status === 200) {
            if (res.data && res.data.results && res.data.results.length > 0) {
              setCommissionData(res.data.results);
            }
          }
          setLoader(false);
        }
      },
    );
  }, [selectedTableFilter, timeFrame]);

  useEffect(() => {
    mounted.current = true;
    if (groupBy) {
      getCommissionTableGroupByBGS();
    } else {
      getCommissionTableIndividuals();
    }
    return () => {
      mounted.current = false;
    };
  }, [getCommissionTableGroupByBGS, getCommissionTableIndividuals, groupBy]);

  useEffect(() => {
    mounted.current = true;
    getCommissionMatrics();
    return () => {
      mounted.current = false;
    };
  }, [getCommissionMatrics]);

  const handleApply = () => {
    if (dummayDateRange !== null) {
      setTimeFrame([dummayDateRange[0], dummayDateRange[1]]);
      setShowDropdown({ show: !showDropdown.show });
    }
  };

  const onDateChange = (date) => {
    if (date[1] === null) {
      setDummayDateRange([date[0], date[0]]);
    } else {
      setDummayDateRange(date);
    }
    setRange(date);
  };

  const renderTimeFilterLabel = () => {
    if (startMonth === endMonth) {
      return startMonth;
    }
    return `${startMonth} - ${endMonth}`;
  };

  const returnCSVData = () => {
    if (commissionData && commissionData.length > 0) {
      if (groupBy) {
        const result = [];
        commissionData.forEach((item) => {
          if (item.bgs_manager) {
            result.push(item.bgs_manager);
          }
          if (item.members) {
            item.members.forEach((element) => {
              result.push(element);
            });
          }
          result.push({});
        });
        return result;
      }
      return commissionData;
    }
    return [];
  };

  const displayTimeFilterOption = () => {
    return showDropdown.show ? (
      <DateRangeDropDown>
        <h4 className="mb-3 text-left">Select Date Range</h4>
        <img
          className="float-right cursor cross-icon "
          src={CloseIcon}
          alt="close"
          role="presentation"
          onClick={() => {
            if (
              timeFrame[0] !== dummayDateRange[0] ||
              timeFrame[1] !== dummayDateRange[1].getMonth() + 1
            ) {
              setRange(timeFrame);
              setDummayDateRange(timeFrame);
            }

            setShowDropdown({ show: !showDropdown.show });
          }}
        />
        <CustomDateRange id="BT-dspinvoices-daterange">
          <div className="text-left">
            <DatePicker
              selected={currentDate}
              onChange={(date) => onDateChange(date)}
              startDate={range[0]}
              endDate={range[1]}
              maxDate={new Date()}
              selectsRange
              inline
              dateFormat="MM/yyyy"
              showMonthYearPicker
            />
          </div>
        </CustomDateRange>
        <Button
          className="btn-primary w-100 mt-3"
          onClick={() => handleApply()}>
          Apply
        </Button>
      </DateRangeDropDown>
    ) : null;
  };

  const renderTimeFilterDropDown = () => {
    return (
      <DropDownSelectMonthPicker
        id="BT-finance-dash-monthpicker-dropdown"
        ref={dropdownRef}>
        <div
          className="dropdown-select-all-notes"
          role="presentation"
          id="clickbox"
          onClick={() => {
            setShowDropdown({ show: !showDropdown.show });
          }}>
          {renderTimeFilterLabel()}
          <img
            src={CaretUp}
            alt="caret"
            style={{
              transform: showDropdown.show ? 'rotate(180deg)' : '',
              width: '25px',
              height: '25px',
              position: 'absolute',
              top: '8px',
              right: '21px',
            }}
          />
        </div>
        <div>{displayTimeFilterOption()}</div>
      </DropDownSelectMonthPicker>
    );
  };
  return (
    <>
      <div className="row mb-4 mt-4 ">
        <div className=" col-md-5 col-sm-12">
          <div className="medium-text-title mt-2 ">Commissions</div>
        </div>
        <div className="col-md-7 col-sm-12  ">
          <CommissionNav>
            <ul className="drop-down-nav">
              <li>
                <Button className=" btn-with-radius gray-btn p-2" type="button">
                  <CSVLink
                    target="_blank"
                    headers={commissionsTableheader}
                    data={returnCSVData()}
                    filename={
                      startMonth === endMonth
                        ? `${startMonth}Commission`
                        : `${startMonth}To${endMonth}Commission`
                    }>
                    <img
                      className="down-arrow-icon"
                      src={RightArrowIcons}
                      alt="arrow"
                    />
                    Download CSV
                  </CSVLink>
                </Button>
              </li>
              <li>{renderTimeFilterDropDown()}</li>
            </ul>
          </CommissionNav>
        </div>
      </div>
      <BGSCommissionsMatrics commissionMatrics={commissionMetrics} />

      <BGScommissionTable
        selectedTableFilter={selectedTableFilter}
        isGroupBy={groupBy}
        loader={loader}
        onHandleGroupBy={() => setGroupBy(!groupBy)}
        OnSetShowModal={(id, name, isBgsManager, managerId) => {
          setBgs({ id, name, isBgsManager, managerId });
          setShowModal(true);
        }}
        handleCommissionFilter={(event) => setSelectedTableFilter(event)}
        commissionData={commissionData}
      />
      {showModal ? (
        <BrandPartnerModal
          showModal={showModal}
          setShowModal={setShowModal}
          Bgs={bgs}
          startDate={`${timeFrame[0].getFullYear()}-${
            timeFrame[0].getMonth() + 1
          }-${timeFrame[0].getDate()}`}
          endDate={`${timeFrame[1].getFullYear()}-${
            timeFrame[1].getMonth() + 1
          }-${timeFrame[1].getDate()}`}
        />
      ) : null}
    </>
  );
};

export default BGSCommissionContainer;

BGSCommissionContainer.defaultProps = {};

BGSCommissionContainer.propTypes = {};
