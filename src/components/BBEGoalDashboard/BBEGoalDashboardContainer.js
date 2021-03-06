import React, { useRef, useState } from 'react';

import Dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';

import BBEGoalHighLevelMetrics from './BBEGoalHighLevelMetrics';
import BBEGoalRevShareContribution from './BBEGoalRevShareContribution';
import { DashboardCard } from '../../theme/Global';
import { Button, CustomDateRange, GlobalNavbar } from '../../common';
import {
  DateRangeDropDown,
  DropDownSelectMonthPicker,
} from '../BrandPartner/AdManagerAdminDashboard/BGSCommission/BGSCommissionContainerStyle';
import { CaretUp, CloseIcon } from '../../theme/images';
import { monthNames } from '../../constants';

const currentDate = new Date();
currentDate.setMonth(currentDate.getMonth() - 1);
export default function BBEGoalDashboardContainer() {
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState({ show: false });

  const [monthYear, setMonthYear] = useState(currentDate);
  const [finalMonthYear, setFinalMonthYear] = useState(currentDate);
  const [updatedDate, setUpdatedDate] = useState(null);

  const handleApply = () => {
    setFinalMonthYear(monthYear);
    setShowDropdown({ show: !showDropdown.show });
  };

  const onDateChange = (date) => {
    setMonthYear(date);
  };

  const renderTimeFilterLabel = () => {
    const currentMonthYearLabel = `${
      monthNames[finalMonthYear.getMonth()]
    } ${finalMonthYear.getFullYear()}`;

    return currentMonthYearLabel;
  };

  const displayTimeFilterOption = () => {
    return showDropdown.show ? (
      <DateRangeDropDown style={{ zIndex: 200 }}>
        <h4 className="mb-3 text-left">Select Date Range</h4>
        <img
          className="float-right cursor cross-icon "
          src={CloseIcon}
          alt="close"
          role="presentation"
          onClick={() => {
            setShowDropdown({ show: !showDropdown.show });
          }}
        />
        <CustomDateWrapper>
          <CustomDateRange id="BT-dspinvoices-daterange">
            <div className="text-left">
              <DatePicker
                selected={finalMonthYear}
                onChange={(date, e) => onDateChange(date, e)}
                maxDate={currentDate}
                minDate={new Date('2021-01-01')}
                inline
                dateFormat="MM/yyyy"
                showMonthYearPicker
                previousMonthAriaLabel="asdasda"
              />
            </div>
          </CustomDateRange>
        </CustomDateWrapper>
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
      <GlobalNavbar />
      <DashboardCard>
        <div className="dashboard-container-body ">
          <div className="row">
            <div className="col-lg-8 col-md-8 col-6">
              <h5 style={{ fontWeight: '500' }} className="sub-title-text">
                Business Performance Snapshot
              </h5>
              {updatedDate && (
                <div className="sub-heading ">Last Updated {updatedDate}</div>
              )}
            </div>
            <div className="col-lg-4 col-md-4 col-6 text-right">
              {renderTimeFilterDropDown()}
            </div>
          </div>

          <BBEGoalHighLevelMetrics
            onSendDate={(date) =>
              setUpdatedDate(Dayjs(date).format('DD MMM, YYYY'))
            }
            selectedMonthYear={finalMonthYear}
          />
          <BBEGoalRevShareContribution monthYear={finalMonthYear} />
        </div>
      </DashboardCard>
    </>
  );
}

BBEGoalDashboardContainer.defaultProps = {};
BBEGoalDashboardContainer.propTypes = {};

const CustomDateWrapper = styled.div``;
