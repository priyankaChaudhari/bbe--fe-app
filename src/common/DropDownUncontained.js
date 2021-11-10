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
    extraAction();
  };

  const IconOption = (dataProps) => (
    <Option {...dataProps}>
      <div>
        {dataProps.data.label}
        <div className="sub-title"> {dataProps.data.sub}</div>{' '}
      </div>
    </Option>
  );

  const IconSingleOption = (dataProps) => (
    <SingleValue {...dataProps}>
      <AddNewAgreement className=" mt-4 mb-3  checkbox" role="presentation">
        <span className="cursor check-container-label">
          <img
            width="16px"
            src={AddIcons}
            className="mr-2 caretup-icon"
            alt="add"
          />
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
  .caretup-icon {
    vertical-align: middle;
  }
`;
