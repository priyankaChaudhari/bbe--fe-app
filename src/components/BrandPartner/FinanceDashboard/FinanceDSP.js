/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { DateRange } from 'react-date-range';
// import { enGB } from 'react-date-range/src/locale';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import styled from 'styled-components';
import { func } from 'prop-types';
import { Card, ModalRadioCheck, Button } from '../../../common';
import { CaretUp, CloseIcon } from '../../../theme/images/index';
import ErrorMsg from '../../../common/ErrorMsg';
import {
  FinanceDateTypeOptions,
  DSPFinanceMetrics,
} from '../../../constants/DashboardConstants';
import Theme from '../../../theme/Theme';
import { getDSPFinances } from '../../../api';

export default function FinanceDSP({
  setTimeFrame,
  setTimeFrameType,
  setIsTimeFrameChange,
}) {
  const [showDropdown, setShowDropdown] = useState({ show: false });
  const [dspData, setDSPData] = useState([]);
  const dropdownRef = useRef(null);
  const [selectedDateType, setSelectedDateType] = useState(
    FinanceDateTypeOptions[0].value,
  );
  const [dummyDateType, setDummayDateType] = useState(
    FinanceDateTypeOptions[0].value,
  );
  const [dateError, setDateError] = useState(null);
  const [responseId, setResponseId] = useState(null);
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 3);
  const [state, setState] = useState([currentDate, currentDate]);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // const handleClickOutside = (event) => {
  //   if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //     setShowDropdown({ show: false });
  //     setDummayDateType(selectedDateType);
  //   }
  // };

  const getDSPdata = useCallback((dateType, startDate, endDate) => {
    getDSPFinances(dateType, startDate, endDate).then((res) => {
      if (res && res.status === 400) {
        // setInvoiceLoader(false);
      }
      if (res && res.status === 200) {
        if (res.data && res.data) {
          setDSPData(res.data);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (responseId === null) {
      getDSPdata(dummyDateType);
      setResponseId('12345');
    }
    // document.addEventListener('click', handleClickOutside, true);
    // return () => {
    //   document.removeEventListener('click', handleClickOutside, true);
    // };
  }, []);

  const handleTimeTypeChange = (event) => {
    setDummayDateType(event.target.value);
  };

  const handleApply = () => {
    console.log(state, 'handleApply', dummyDateType);
    if (state !== null) {
      setDateError(null);
      let sd = state[0];
      let ed = state[1];
      setSelectedDateType(dummyDateType);
      setTimeFrameType(dummyDateType);
      setShowDropdown({ show: !showDropdown.show });
      setIsTimeFrameChange(true);
      if (dummyDateType === 'custom') {
        sd = `${state[0].getMonth() + 1}-${state[0].getFullYear()}`;
        ed = `${state[1].getMonth() + 1}-${state[1].getFullYear()}`;
        setTimeFrame({
          startDate: sd,
          endDate: ed,
        });

        getDSPdata(dummyDateType, sd, ed);
        return;
      }
      getDSPdata(dummyDateType);
    } else {
      setDateError('Please select valid date');
    }
  };

  const bindAmount = (orignalNumber, decimalDigits = 2) => {
    const number = Number(orignalNumber);
    if (number !== undefined && number !== null) {
      return number
        .toFixed(decimalDigits)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return number;
  };

  const renderTimeFilterLabel = () => {
    if (selectedDateType === 'allTime') {
      return 'All-Time';
    }
    const customDateLabel = `${
      monthNames[state[0].getMonth()]
    } '${state[0].getFullYear()} - ${
      monthNames[state[1].getMonth()]
    } '${state[1].getFullYear()}`;
    return customDateLabel;
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
            setDummayDateType(selectedDateType);
            setShowDropdown({ show: !showDropdown.show });
          }}
        />
        <ul>
          {FinanceDateTypeOptions.map((item, index) => (
            <li className="date-range" key={item.value}>
              <ModalRadioCheck className="mb-3">
                {' '}
                <label
                  className={`${
                    index === 0
                      ? 'checkboxes radio-container customer-list'
                      : 'checkboxes radio-container customer-list mt-2'
                  }`}
                  htmlFor={item.value}>
                  {item.label}
                  <input
                    type="radio"
                    name="timeFilter"
                    label={item.label}
                    id={item.value}
                    value={item.value}
                    onChange={(event) => handleTimeTypeChange(event)}
                    defaultChecked={item.value === selectedDateType}
                  />
                  <span className="checkmark checkmark-customer-list" />
                </label>
              </ModalRadioCheck>
            </li>
          ))}
        </ul>{' '}
        {dummyDateType === 'custom' ? (
          // <DateRange
          //   ranges={state}
          //   date={new Date()}
          //   onChange={(itemData) => setState([itemData.selection])}
          //   dateFormat="MMM yyyy"
          //   showDateDisplay={false}
          //   locale={enGB}
          //   editableDateInputs
          //   showMonthAndYearPickers
          //   moveRangeOnFirstSelection={false}
          //   maxDate={currentDate}
          //   rangeColors={[Theme.orange]}
          //   weekdayDisplayFormat="EEEEE"
          // />
          <div className="text-left">
            <DateRangePicker
              onChange={setState}
              maxDetail="year"
              format="MMM yyyy"
              defaultView="year"
              maxDate={currentDate}
              value={state}
              monthPlaceholder="MMM"
              yearPlaceholder="yyyy"
              onCalendarClose={() => setDateError(null)}
            />
          </div>
        ) : null}
        <ErrorMsg className="text-left">{dateError}</ErrorMsg>
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
      <div className="col-md-6 col-lg-6 col-7 text-right">
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
      </div>
    );
  };

  const renderTitle = (data, key) => {
    if (data[key] === null) {
      return 'N/A';
    }
    if (
      key === 'total_overdue' ||
      key === 'expected_by_end_of_month' ||
      key === 'open_invoices'
    ) {
      return bindAmount(data[key], 0);
    }
    if (key === 'percentage_past_due') {
      return bindAmount(data[key], 2);
    }
    if (key === 'avg_days_past_due') {
      return bindAmount(data[key], 1);
    }

    return data[key];
  };

  const renderDSPFinanceMetrics = () => {
    return (
      <ul className="white-card-container">
        {DSPFinanceMetrics.map((item) => (
          <li key={item.value}>
            {' '}
            <Card
              className="fix-height"
              heading={item.label}
              title={renderTitle(dspData, item.key)}
              titleColor={item.titleColor}
              prefix={dspData[item.key] !== null ? item.prefix : ''}
              postfix={item.postfix}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div className="row mb-4">
        <div className="col-md-6 col-lg-6 col-5 mt-2 ">
          <div className="medium-text-title ">DSP Finances</div>{' '}
        </div>
        {renderTimeFilterDropDown()}
      </div>
      {renderDSPFinanceMetrics()}
    </>
  );
}

FinanceDSP.defaultProps = {
  setTimeFrame: () => {},
  setTimeFrameType: () => {},
  setIsTimeFrameChange: () => {},
};

FinanceDSP.propTypes = {
  setTimeFrame: func,
  setTimeFrameType: func,
  setIsTimeFrameChange: func,
};

const DateRangeDropDown = styled.div`
  background-color: ${Theme.white};
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  position: absolute;
  right: 15px;
  z-index: 22;
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.1);
  padding: 15px;
  top: 45px;

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    text-align: left;
    .date-range {
      display: inline-block;
      text-align: left;
      margin-right: 20px;
    }
  }
  .cross-icon {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 16px;
  }
`;

const DropDownSelectMonthPicker = styled.div`
  .dropdown-select-all-notes {
    background-color: rgba(224, 231, 255, 0.2);
    border: 1px solid ${Theme.gray2};
    border-radius: 20px;
    width: 230px;
    height: 40px;
    color: ${Theme.black};
    padding: 11px 2px 0 14px;
    text-align: left;
    cursor: pointer;

    @media only screen and (max-width: 450px) {
      width: 160px;
    }
  }
`;
