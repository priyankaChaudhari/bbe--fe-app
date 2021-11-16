import React from 'react';

import styled from 'styled-components';
import Select, { components } from 'react-select';
import { func, shape, arrayOf } from 'prop-types';

import Theme from '../theme/Theme';
import { AddIcons } from '../theme/images';

const DropDownUncontained = ({
  options,
  setSelectedOption,
  extraAction,
  DropdownIndicator,
}) => {
  const { Option, SingleValue } = components;

  const onChange = (selected) => {
    setSelectedOption(selected);
    extraAction(selected);
  };

  const IconOption = (dataProps) => (
    <Option {...dataProps}>
      <div style={{ fontSize: '14px', fontWeight: '500', color: '#000000' }}>
        {dataProps.data.label}
        <div
          style={{ fontSize: '12px', color: '#556178', paddingBottom: '8px' }}
          className="sub-title">
          {' '}
          {dataProps.data.sub}
        </div>{' '}
      </div>
    </Option>
  );

  const IconSingleOption = (dataProps) => (
    <SingleValue {...dataProps}>
      <AddNewAgreement className=" mt-4 mb-3  checkbox" role="presentation">
        <span className="cursor check-container-label">
          <img src={AddIcons} className="mr-2 add-icon" alt="add" />
          Add New Agreement
        </span>
      </AddNewAgreement>
    </SingleValue>
  );

  const getSelectComponents = () => {
    return {
      Option: IconOption,
      SingleValue: IconSingleOption,
      DropdownIndicator,
    };
  };

  return (
    <AddNewAgreementDropDown className="w-50">
      <Select
        classNamePrefix="react-select"
        options={options}
        value={{
          value: 'standard_cancellation',
          label: 'Recurring Service Agreement',
          sub: 'Standard Cancellation',
        }}
        isSearchable={false}
        onChange={onChange}
        components={getSelectComponents()}
        componentsValue={{ Option: IconOption }}
      />
    </AddNewAgreementDropDown>
  );
};

export default DropDownUncontained;

DropDownUncontained.defaultProps = {
  extraAction: () => {},
};

DropDownUncontained.propTypes = {
  options: arrayOf(shape({})).isRequired,
  extraAction: func,
  DropdownIndicator: func.isRequired,
  setSelectedOption: func.isRequired,
};

const AddNewAgreement = styled.div`
  color: ${Theme.gray85};
  font-size: ${Theme.extraNormal};

  .dropdown-arrow-icon {
    vertical-align: middle;
    margin-left: 6px;
    transform: ${(props) =>
      props.showAgreementOptions ? 'rotate(180deg)' : ''};
  }
  .check-container-label input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    height: 10px;
    width: 170px;
  }
  .add-icon {
    vertical-align: text-top;
    width: 14px;
  }
`;
const AddNewAgreementDropDown = styled.div`
  &.w-50 {
    width: 175px;
  }
  .css-2b097c-container {
    .css-yk16xz-control {
      background-color: transparent;
      border-style: none;
      min-height: 40px;
      margin: 0;
      border-width: 0px;
      .css-g1d714-ValueContainer {
        padding: 4px 0;
      }
      .css-tlfecz-indicatorContainer {
        padding: 10px 0 0 0;
        cursor: pointer;
        img {
          width: 18px !important;
          height: 18px !important;
        }
      }
      &:hover {
        border-color: none !important;
      }
    }
    .css-1pahdxg-control {
      border-color: transparent !important;
      box-shadow: none !important;
      outline: none;
      background-color: transparent;
      border-width: 0px;
      margin: 0;
      caret-color: transparent;
      min-height: 40px;
      .css-g1d714-ValueContainer {
        padding: 4px 0;
      }
      .css-1gtu0rj-indicatorContainer {
        padding: 10px 0 0 0;
        cursor: pointer;

        img {
          width: 18px !important;
          height: 18px !important;
        }
      }
      /* .css-1uccc91-singleValue {
        margin: 0;
      } */
      &:hover {
        border-color: none !important;
      }
    }

    .css-1okebmr-indicatorSeparator {
      display: none;
    }
    .react-select__menu {
      width: 220px !important;
      width: 100%;

      .css-26l3qy-menu {
        max-width: 220px !important;
        width: 100%;
      }
    }
  }
`;
