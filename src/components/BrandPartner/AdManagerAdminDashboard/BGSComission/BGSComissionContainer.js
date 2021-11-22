import React, { useState, useRef } from 'react';

import Select from 'react-select';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import { func } from 'prop-types';
import { CSVLink } from 'react-csv';

import ComissionsMetrics from './ComissionsMetrics';
import TableMobileView from '../../../../common/TableMobileView';
import { FinanceDateTypeOptions, monthNames } from '../../../../constants';
import { CaretUp, CloseIcon, RightArrowIcons } from '../../../../theme/images';
import {
  ComissionHeader,
  CommissionNav,
  CommissionTabletView,
  DateRangeDropDown,
  DropDownSelectMonthPicker,
  CommissionResseque,
} from './BGSComissionContainerStyle';
import {
  WhiteCard,
  CheckBox,
  DropDownSelect,
  Button,
  CustomDateRange,
  HeaderDownloadFuntionality,
  TableGap,
} from '../../../../common';

const customStyles = {
  content: {
    top: '50%',
    right: '0px',
    bottom: 'auto',
    maxWidth: '700px ',
    width: '100% ',
    maxHeight: '100%',
    overlay: ' {zIndex: 1000}',
    inset: '0% 0% 0% auto',
    marginRight: '0',
    borderRadius: '0px !important',
  },
};
const currentDate = new Date();

const BGSComissionContainer = ({
  setTimeFrame,
  setTimeFrameType,
  setIsTimeFrameChange,
  setShowNotesModal,
}) => {
  const dropdownRef = useRef(null);

  const [state, setState] = useState([currentDate, currentDate]);
  const [showDropdown, setShowDropdown] = useState({ show: false });
  const [range, setRange] = useState([currentDate, currentDate]);
  const [selectedDateType, setSelectedDateType] = useState(
    FinanceDateTypeOptions[1].value,
  );
  const [dummyDateType, setDummayDateType] = useState(
    FinanceDateTypeOptions[1].value,
  );
  const [dummayDateRange, setDummayDateRange] = useState([
    currentDate,
    currentDate,
  ]);
  const [showModal, setShowModal] = useState(false);

  const csvData = [
    { firstname: 'Ahmed', lastname: 'Tomi', email: 'ah@smthing.co.com' },
    { firstname: 'Raed', lastname: 'Labes', email: 'rl@smthing.co.com' },
    { firstname: 'Yezzi', lastname: 'Min l3b', email: 'ymin@cocococo.com' },
  ];

  const csvData = [
    { firstname: 'Ahmed', lastname: 'Tomi', email: 'ah@smthing.co.com' },
    { firstname: 'Raed', lastname: 'Labes', email: 'rl@smthing.co.com' },
    { firstname: 'Yezzi', lastname: 'Min l3b', email: 'ymin@cocococo.com' },
  ];

  const handleApply = () => {
    if (dummayDateRange !== null) {
      setState(dummayDateRange);
      let sd = dummayDateRange[0];
      let ed = dummayDateRange[1];
      setSelectedDateType(dummyDateType);
      setTimeFrameType(dummyDateType);
      setShowDropdown({ show: !showDropdown.show });
      setIsTimeFrameChange(true);
      if (dummyDateType === 'custom') {
        sd = `${
          dummayDateRange[0].getMonth() + 1
        }-${dummayDateRange[0].getFullYear()}`;
        ed = `${
          dummayDateRange[1].getMonth() + 1
        }-${dummayDateRange[1].getFullYear()}`;
        setTimeFrame({
          startDate: sd,
          endDate: ed,
        });
      }
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
    const startMonth = `${
      monthNames[state[0].getMonth()]
    } '${state[0].getFullYear()}`;

    const endMonth = `${
      monthNames[state[1].getMonth()]
    } '${state[1].getFullYear()}`;

    if (startMonth === endMonth) {
      return startMonth;
    }
    return `${startMonth} - ${endMonth}`;
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
        <CustomDateRange id="BT-dspinvoices-daterange">
          {dummyDateType === 'custom' ? (
            <div className="text-left">
              <DatePicker
                selected={new Date()}
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
          ) : null}
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
            setRange(state);
            setDummayDateRange(state);
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
      <div className="row mb-4 mt-4">
        <div className=" col-md-5 col-sm-12">
          <div className="medium-text-title ">Commissions</div>
        </div>
        <div className="col-md-7 col-sm-12 ">
          <CommissionNav>
            <ul className="drop-down-nav">
              <li>
                <Button className=" btn-with-radius gray-btn p-2" type="button">
                  <CSVLink data={csvData}>
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
      <ComissionsMetrics />
      <WhiteCard className="header-table">
        <ComissionHeader>
          <div className=" d-md-block d-none">
            <div className="row ">
              <div className="col-4">
                <div
                  className="black-heading-title"
                  onClick={() => setShowModal(true)}
                  role="presentation">
                  {' '}
                  Commissions{' '}
                </div>
              </div>
              <div className="col-8">
                <ul className="comission-header">
                  <li>
                    <CheckBox className="mt-1 mb-4 ">
                      <label
                        className="check-container customer-pannel "
                        htmlFor="step">
                        Group by BGS Manager
                        <input
                          className="checkboxes"
                          type="checkbox"
                          id="step"
                        />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>
                  </li>
                  <li className="w-10">
                    <DropDownSelect>
                      <Select />
                    </DropDownSelect>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="d-md-none d-block">
            <div className="row ">
              <div className="col-6">
                <div className="black-heading-title "> Commissions </div>
              </div>
              <div className="col-6 ">
                <CheckBox style={{ float: 'right' }} className="mt-1 mb-4 ">
                  <label
                    className="check-container customer-pannel "
                    htmlFor="step">
                    Group by BGS Manager
                    <input className="checkboxes" type="checkbox" id="step" />
                    <span className="checkmark" />
                  </label>
                </CheckBox>
                <div className="clear-fix" />
              </div>
              <div className="col-12">
                <DropDownSelect>
                  <Select />
                </DropDownSelect>
              </div>
            </div>
          </div>
        </ComissionHeader>
        <CommissionTabletView className="mt-4 d-md-none d-block">
          <TableMobileView
            label="retainer"
            labelInfo="$52,000.00"
            label1="rev share"
            labelInfo1="$52,000.00"
            label2="DSP (15%)"
            labelInfo2="$52,000.00"
            label3="total book size"
            labelInfo3="$52,000.00"
            label4="total book size"
            labelInfo4="$52,000.00"
            label5="Book Size comm."
            labelInfo5="$52,000.00"
            label6="upsells"
            labelInfo6="$52,000.00"
            label7="Upsells comm."
            labelInfo7="$52,000.00"
          />
        </CommissionTabletView>
      </WhiteCard>
      <TableGap className="d-md-block d-none">
        <WhiteCard className="table-card">
          <thead style={{ width: '100%', display: 'table' }}>
            <tr>
              <th width="10%" className=" text-left">
                team member
              </th>
              <th width="10%" className=" text-left">
                retainer
              </th>
              <th width="10%" className=" text-left">
                rev share
              </th>
              <th width="5%" className=" text-left">
                dsp
              </th>
              <th width="12%" className=" text-left">
                {' '}
                total book size
              </th>
              <th width="15%" className=" text-left">
                {' '}
                BOOK Size commission
              </th>
              <th width="8%" className=" text-left">
                {' '}
                upsells
              </th>
              <th width="12%" className=" text-left">
                {' '}
                Upsells commission
              </th>
              <th width="10%" className=" text-left">
                {' '}
                total commission
              </th>
            </tr>
          </thead>
        </WhiteCard>

        <WhiteCard className="mt-3 ">
          <tbody style={{ width: '100%', display: 'table' }}>
            <tr>
              <td width="10%" className="text-bold">
                Team Jake
              </td>
              <td width="10%">$2,597.20</td>
              <td width="10%">$2,597.20</td>
              <td width="5%">$2,597.20</td>
              <td width="12%">$805.00</td>
              <td width="15%" className="text-bold">
                0
              </td>
              <td width="8%">$805.00</td>
              <td width="12%" className="text-bold">
                $805.00
              </td>
              <td width="10%" className="text-bold">
                {' '}
                $1,714.59
              </td>
            </tr>
            <tr>
              <td width="10%">Team Jake</td>
              <td width="10%">$2,597.20</td>
              <td width="10%">$2,597.20</td>
              <td width="5%">$2,597.20</td>
              <td width="12%">$805.00</td>
              <td width="15%" className="text-bold">
                0
              </td>
              <td width="8%">$805.00</td>
              <td width="12%" className="text-bold">
                $805.00
              </td>
              <td width="10%" className="text-bold">
                {' '}
                $1,714.59
              </td>
            </tr>
          </tbody>
        </WhiteCard>
      </TableGap>

      <Modal
        isOpen={showModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Add team modal">
        <CommissionResseque>
          {' '}
          <HeaderDownloadFuntionality>
            <div className="container-fluid">
              {' '}
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="header-title large-header-title ml-3 ">
                    {' '}
                    Julia Resseque
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <ul className="contract-download-nav">
                    <li>
                      <img
                        width="18px"
                        src={CloseIcon}
                        alt="close"
                        className="float-right cursor remove-cross-icon"
                        onClick={() => {
                          setShowNotesModal(false);
                        }}
                        role="presentation"
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </HeaderDownloadFuntionality>
          <div className="container-fluid">
            <ul className="commission-Resseque mt-3">
              <li>
                <div className="label">Brand Partner</div>
                <div className="label-info">Ripley Tools LLC</div>
              </li>
              <li>
                <div className="label">retainer</div>
                <div className="label-info">$21,000.00</div>
              </li>
              <li>
                <div className="label">rev share</div>
                <div className="label-info">$21,000.00</div>
              </li>
              <li>
                <div className="label">DSP</div>
                <div className="label-info">0</div>
              </li>
              <li>
                <div className="label">total Book Size</div>
                <div className="label-info ">$21,000.00</div>
              </li>
              <li>
                <div className="label">BOOK Size Comm.</div>
                <div className="label-info label-info-dark">$21,000.00</div>
              </li>
              <li>
                <div className="label">upsells </div>
                <div className="label-info label-info-dark">$21,000.00</div>
              </li>
              <li>
                <div className="label">Upsells comm.</div>
                <div className="label-info label-info-dark ">$2,597.20</div>
              </li>
              <li>
                <div className="label">total commission</div>
                <div className="label-info label-info-dark ">$2,597.20</div>
              </li>
            </ul>
            <div className="straight-line horizontal-line " />
            <ul className="commission-Resseque  active pt-3">
              <li>
                <div className="label">Brand Partner</div>
                <div className="label-info">Ripley Tools LLC</div>
              </li>
              <li>
                <div className="label">retainer</div>
                <div className="label-info">$21,000.00</div>
              </li>
              <li>
                <div className="label">rev share</div>
                <div className="label-info">$21,000.00</div>
              </li>
              <li>
                <div className="label">DSP</div>
                <div className="label-info">0</div>
              </li>
              <li>
                <div className="label">total Book Size</div>
                <div className="label-info ">$21,000.00</div>
              </li>
              <li>
                <div className="label">BOOK Size Comm.</div>
                <div className="label-info label-info-dark">$21,000.00</div>
              </li>
              <li>
                <div className="label">upsells </div>
                <div className="label-info label-info-dark">$21,000.00</div>
              </li>
              <li>
                <div className="label">Upsells comm.</div>
                <div className="label-info label-info-dark ">$2,597.20</div>
              </li>
              <li>
                <div className="label">total commission</div>
                <div className="label-info label-info-dark ">$2,597.20</div>
              </li>
            </ul>
            <div className="straight-line horizontal-line " />
          </div>
        </CommissionResseque>
      </Modal>
    </>
  );
};

export default BGSComissionContainer;

BGSComissionContainer.defaultProps = {
  setShowNotesModal: () => {},
  setTimeFrame: () => {},
  setTimeFrameType: () => {},
  setIsTimeFrameChange: () => {},
};

BGSComissionContainer.propTypes = {
  setShowNotesModal: func,
  setTimeFrame: func,
  setTimeFrameType: func,
  setIsTimeFrameChange: func,
};
