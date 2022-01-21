import React from 'react';

import { components } from 'react-select';
import { arrayOf, bool, func, shape, string } from 'prop-types';

import BGSCommissionTableDesktopView from './BGSCommissionTableDesktopView';
import BGSCommissionTableResponsiveView from './BGSCommissionTableResponsiveView';
import { DropDown } from '../../../Customer/CompanyPerformance/DropDown';
import { CommissionHeader } from './BGSCommissionContainerStyle';
import { bgsCommissionsFilterOptions } from '../../../../constants';
import { WhiteCard, CheckBox, DropDownIndicator } from '../../../../common';

const BGScommissionTable = ({
  selectedTableFilter,
  OnSetShowModal,
  handleCommissionFilter,
  isGroupBy,
  onHandleGroupBy,
  loader,
  commissionData,
}) => {
  const { Option, SingleValue } = components;

  const filterOption = ({ data, ...props }) => (
    <Option {...props}>
      <div className="pb-2">
        <span style={{ fontSize: '15px', color: '#000000' }}>{data.label}</span>

        <div style={{ fontSize: '12px', color: '#556178' }}>{data.sub}</div>
      </div>
    </Option>
  );

  const singleFilterOption = (props) => (
    <SingleValue {...props}>
      <span style={{ fontSize: '15px', color: '#000000' }}>
        {`Sort by: ${props.data.label}`}
      </span>
      <div style={{ fontSize: '12px', color: '#556178' }}>{props.data.sub}</div>
    </SingleValue>
  );

  const getSelectComponents = () => {
    return {
      Option: filterOption,
      SingleValue: singleFilterOption,
      DropDownIndicator,
    };
  };

  const renderDropDown = () => {
    return DropDown(
      '',
      bgsCommissionsFilterOptions,
      bgsCommissionsFilterOptions[0].label,
      getSelectComponents,
      bgsCommissionsFilterOptions && bgsCommissionsFilterOptions[0],
      handleCommissionFilter,
      loader,
      null,
      selectedTableFilter,
    );
  };

  return (
    <>
      <WhiteCard className="header-table d-md-block d-none">
        <CommissionHeader>
          <div className=" d-md-block d-none">
            <div className="row">
              <div className="col-4">
                <div
                  className="black-heading-title mt-2 pt-1"
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
                          disabled={loader}
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
        </CommissionHeader>
      </WhiteCard>
      <WhiteCard className="d-md-none d-block p-0 ">
        <CommissionHeader>
          <div className="d-md-none d-block pl-3 pr-3 ">
            <div className="row  ">
              <div className="col-6 pt-3">
                <div className="black-heading-title "> Commissions </div>
              </div>
              <div className="col-6 pt-3 ">
                <CheckBox style={{ float: 'right' }} className="mt-1 mb-4 ">
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
                      disabled={loader}
                    />
                    <span className="checkmark" />
                  </label>
                </CheckBox>
                <div className="clear-fix" />
              </div>
              <div className="col-12">{renderDropDown()}</div>
            </div>
          </div>
        </CommissionHeader>
        <BGSCommissionTableResponsiveView
          isGroupBy={isGroupBy}
          commissionData={commissionData}
          loader={loader}
          OnSetShowModal={OnSetShowModal}
        />
      </WhiteCard>
      <BGSCommissionTableDesktopView
        isGroupBy={isGroupBy}
        commissionData={commissionData}
        loader={loader}
        OnSetShowModal={OnSetShowModal}
      />
    </>
  );
};

export default BGScommissionTable;

BGScommissionTable.defaultProps = {
  selectedTableFilter: { name: 'bgs_manager', label: 'Team Member' },
  isGroupBy: true,
  loader: false,
  OnSetShowModal: () => {},
  handleCommissionFilter: () => {},
  onHandleGroupBy: () => {},
  commissionData: null,
  data: {},
};

BGScommissionTable.propTypes = {
  isGroupBy: bool,
  loader: bool,
  selectedTableFilter: shape({}),
  OnSetShowModal: func,
  handleCommissionFilter: func,
  onHandleGroupBy: func,
  commissionData: arrayOf(Array),
  data: shape({ sub: string, label: string }),
};
