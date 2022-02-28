import React from 'react';

import Select from 'react-select';

import { DropDownSelect } from '../../../common';

export const DropDown = (
  className,
  options,
  placeholder,
  components,
  defaultValue,
  handleOnChange,
  isDisabled,
  reff = null,
  selectedValue,
) => {
  const YearOverYearOptionStyles = {
    menuList: (styles) => ({
      ...styles,
      maxHeight: '340px !important',
    }),
  };

  return (
    <DropDownSelect
      className={isDisabled ? `${className} disabled` : className}>
      <Select
        classNamePrefix="react-select"
        className="active"
        options={options}
        ref={reff}
        placeholder={placeholder}
        components={components !== null ? components() : null}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            neutral50: '#1A1A1A',
          },
        })}
        value={selectedValue}
        // defaultValue={defaultValue}
        onChange={(event) => handleOnChange(event)}
        styles={YearOverYearOptionStyles}
      />
    </DropDownSelect>
  );
};

export default DropDown;
