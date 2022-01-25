import React from 'react';

import Select from 'react-select';
import styled from 'styled-components';
import { arrayOf, bool, func, instanceOf, shape } from 'prop-types';

import Theme from '../../../../theme/Theme';
import { DropDown } from '../DropDown';
import { DropDownSelect, WhiteCard } from '../../../../common';

const VendorSalesPerformanceFilters = ({
  marketplaceDefaultValue,
  marketplaceOptions,
  handleMarketplaceOptions,
  dateOptions,
  getSelectComponents,
  DropdownIndicator,
  handleDailyFact,
  selectedSalesDF,
  isApiCall,
}) => {
  return (
    <WhiteCard className="mb-3">
      <ViewData>
        <div className="row">
          <div className="col-md-4  col-sm-12 ">
            <div className="view-data-for mt-2 pt-2 ">View data for:</div>{' '}
          </div>
          <div className="col-md-4 col-6 pl-0 mb-2">
            {' '}
            <DropDownSelect
              id="BT-adperformancedata-countryfilter"
              className={isApiCall ? `cursor  disabled` : 'cursor '}>
              <Select
                classNamePrefix="react-select"
                className="active"
                components={DropdownIndicator}
                options={marketplaceOptions}
                defaultValue={
                  marketplaceDefaultValue && marketplaceDefaultValue[0]
                }
                onChange={(event) => handleMarketplaceOptions(event)}
                placeholder={
                  marketplaceDefaultValue && marketplaceDefaultValue[0]?.label
                }
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    neutral50: '#1A1A1A',
                  },
                })}
              />
            </DropDownSelect>
          </div>
          <div
            className="col-md-4 col-6 pl-0 "
            id="BT-adperformancedata-daysfilter">
            {' '}
            {DropDown(
              'days-performance',
              dateOptions,
              dateOptions[0].label,
              getSelectComponents,
              dateOptions[0],
              handleDailyFact,
              isApiCall,
              null,
              selectedSalesDF,
            )}
          </div>
        </div>
      </ViewData>
    </WhiteCard>
  );
};

export default VendorSalesPerformanceFilters;

VendorSalesPerformanceFilters.defaultProps = {
  selectedSalesDF: {},
  marketplaceDefaultValue: [],
  marketplaceOptions: {},
  dateOptions: {},
  isApiCall: false,
  DropdownIndicator: () => {},
  getSelectComponents: () => {},
  handleMarketplaceOptions: () => {},
  handleDailyFact: () => {},
};

VendorSalesPerformanceFilters.propTypes = {
  isApiCall: bool,
  DropdownIndicator: shape({}),
  marketplaceDefaultValue: arrayOf(shape({})),
  selectedSalesDF: instanceOf(Object),
  marketplaceOptions: arrayOf(Array),
  dateOptions: arrayOf(Array),
  handleMarketplaceOptions: func,
  getSelectComponents: func,
  handleDailyFact: func,
};

const ViewData = styled.div`
  .view-data-for {
    margin-right: 60px;
    font-weight: normal;
    color: ${Theme.black};
    font-size: ${Theme.extraMedium};
    font-family: ${Theme.baseFontFamily};
    width: 100%;
  }

  @media only screen and (max-width: 767px) {
    .tabs {
      li {
        font-size: 14px;
        margin-right: 25px;
      }
    }
    .view-data-for {
      text-align: left;
      padding-bottom: 10px;
    }
  }
`;
