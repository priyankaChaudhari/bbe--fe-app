import React, { useEffect } from 'react';

import styled from 'styled-components';
import Select from 'react-select';
import { bool, func, string } from 'prop-types';

import TableMobileView from '../../../../common/TableMobileView';
import Theme from '../../../../theme/Theme';
import {
  WhiteCard,
  CheckBox,
  DropDownSelect,
  DropDownIndicator,
} from '../../../../common';
import {
  ComissionHeader,
  CommissionTabletView,
} from './BGSComissionContainerStyle';
import { bgsCommissionsFilterOptions } from '../../../../constants';

const BGScommissionTable = ({
  selectedTableFilter,
  OnSetShowModal,
  handleCommissionFilter,
  isGroupBy,
  onHandleGroupBy,
}) => {
  useEffect(() => {
    console.log(isGroupBy, '-----', selectedTableFilter);
  }, [isGroupBy, selectedTableFilter]);

  const renderDropDown = () => {
    return (
      <DropDownSelect>
        <Select
          classNamePrefix="react-select"
          className="active"
          components={DropDownIndicator}
          options={bgsCommissionsFilterOptions}
          placeholder={bgsCommissionsFilterOptions[0].label}
          defaultValue={bgsCommissionsFilterOptions[0]}
          onChange={handleCommissionFilter}
        />
      </DropDownSelect>
    );
  };

  const commissionTableResponsivetView = () => {
    return (
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
    );
  };
  const commissionTableDesktopView = () => {
    return (
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
    );
  };

  return (
    <>
      <WhiteCard className="header-table">
        <ComissionHeader>
          <div className=" d-md-block d-none">
            <div className="row ">
              <div className="col-4">
                <div
                  className="black-heading-title mt-2 pt-1"
                  onClick={() => OnSetShowModal()}
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
                          checked={isGroupBy}
                          onChange={onHandleGroupBy}
                        />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>
                  </li>
                  <li className="w-10">{renderDropDown()}</li>
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
              <div className="col-12">{renderDropDown()}</div>
            </div>
          </div>
        </ComissionHeader>
      </WhiteCard>
      {commissionTableDesktopView()}
      {commissionTableResponsivetView()}
    </>
  );
};

export default BGScommissionTable;

BGScommissionTable.defaultProps = {
  selectedTableFilter: 'bgs_manager',
  isGroupBy: true,
  OnSetShowModal: () => {},
  handleCommissionFilter: () => {},
  onHandleGroupBy: () => {},
};

BGScommissionTable.propTypes = {
  isGroupBy: bool,
  selectedTableFilter: string,
  OnSetShowModal: func,
  handleCommissionFilter: func,
  onHandleGroupBy: func,
};

const TableGap = styled.div`
  position: relative;
  width: 100%;
  border-spacing: 0 10px;
  border-collapse: collapse;

  tr {
    text-align: left;
    background: ${Theme.white};
    border-radius: 1px;
    font-family: ${Theme.baseFontFamily};
    width: 100%;
    border-bottom: 1px solid #e0e6e8;
    &:last-child {
      border-bottom: none;
    }
    th {
      padding: 15px 5px 15px 5px;
      text-transform: uppercase;
      color: ${Theme.gray40};
      font-size: 11px;
      background: ${Theme.white};
      font-family: ${Theme.baseFontFamily};
      border-top: 1px solid #e0e6e8;
      &:first-child {
        border-bottom-left-radius: 8px;
      }
      &:last-child {
        border-bottom-right-radius: 8px;
      }
    }
    td {
      padding: 15px 5px 15px 5px;
      vertical-align: middle;
      position: relative;
      color: ${Theme.black};
      font-size: ${Theme.extraMedium};

      &.text-bold {
        font-weight: 600;
      }
    }
  }
`;
