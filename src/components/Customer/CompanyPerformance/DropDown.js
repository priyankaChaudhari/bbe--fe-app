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
) => {
  return (
    <DropDownSelect
      className={isDisabled ? `${className} disabled` : className}>
      <Select
        classNamePrefix="react-select"
        className="active"
        options={options}
        placeholder={placeholder}
        components={components !== null ? components() : null}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            neutral50: '#1A1A1A',
          },
        })}
        defaultValue={defaultValue}
        onChange={(event) => handleOnChange(event)}
      />
    </DropDownSelect>
  );
};

export default DropDown;
