import React from 'react';

import { bool, shape } from 'prop-types';
import { components } from 'react-select';

import { CaretUp } from '../theme/images';

const DropDownIndicator = ({ selectProps, ...props }) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <img
          src={CaretUp}
          alt="caret"
          style={{
            transform: selectProps.menuIsOpen ? 'rotate(180deg)' : '',
            width: '25px',
            height: '25px',
          }}
        />
      </components.DropdownIndicator>
    )
  );
};

export default DropDownIndicator;

DropDownIndicator.defaultProps = {};

DropDownIndicator.propTypes = {
  selectProps: shape({
    menuIsOpen: bool,
  }).isRequired,
};
