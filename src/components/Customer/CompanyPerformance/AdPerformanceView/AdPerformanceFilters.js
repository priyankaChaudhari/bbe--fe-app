import React from 'react';

import Select from 'react-select';
import styled from 'styled-components';
import { arrayOf, bool, func, instanceOf, shape } from 'prop-types';

import Theme from '../../../../theme/Theme';
import { DropDown } from '../DropDown';
import { DropDownSelect, WhiteCard } from '../../../../common';

const AdPerformanceFilters = ({
  marketplaceDefaultValue,
  marketplaceOptions,
  handleMarketplaceOptions,
  dateOptions,
  getSelectComponents,
  DropDownIndicator,
  handleAdDailyFact,
  selectedAdDF,
  isApiCall,
}) => {
  return (
    <WhiteCard className="mb-3">
      <ViewData>
        <div className="row">
          <div className="col-md-4  col-sm-12 ">
            <div className="view-data-for mt-2 pt-1 ">View data for:</div>{' '}
          </div>
          <div className="col-md-4 col-6  pl-0">
            {' '}
            <DropDownSelect
              id="BT-adperformancedata-countryfilter"
              className={isApiCall ? `cursor  disabled` : 'cursor '}>
              <Select
                classNamePrefix="react-select"
                className="active"
                components={DropDownIndicator}
                options={marketplaceOptions}
                defaultValue={
                  marketplaceDefaultValue && marketplaceDefaultValue[0]
                }
                onChange={(event) => handleMarketplaceOptions(event)}
                placeholder={
                  marketplaceDefaultValue &&
                  marketplaceDefaultValue[0] &&
                  marketplaceDefaultValue[0].label
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
            className="col-md-4 col-6   pl-0 "
            id="BT-adperformancedata-daysfilter">
            {' '}
            {DropDown(
              'days-performance',
              dateOptions,
              dateOptions[0].label,
              getSelectComponents,
              dateOptions[0],
              handleAdDailyFact,
              isApiCall,
              null,
              selectedAdDF,
            )}
          </div>
        </div>
      </ViewData>
    </WhiteCard>
  );
};

export default AdPerformanceFilters;

AdPerformanceFilters.defaultProps = {
  marketplaceDefaultValue: [],
  marketplaceOptions: {},
  handleMarketplaceOptions: () => {},
  dateOptions: {},
  getSelectComponents: () => {},
  isApiCall: false,
  DropDownIndicator: () => {},
  handleAdDailyFact: () => {},
  selectedAdDF: {},
};

AdPerformanceFilters.propTypes = {
  marketplaceDefaultValue: arrayOf(shape({})),
  marketplaceOptions: arrayOf(Array),
  handleMarketplaceOptions: func,
  dateOptions: arrayOf(Array),
  getSelectComponents: func,
  isApiCall: bool,
  DropDownIndicator: func,
  handleAdDailyFact: func,
  selectedAdDF: instanceOf(Object),
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
