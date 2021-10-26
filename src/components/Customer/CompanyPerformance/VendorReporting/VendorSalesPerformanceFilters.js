import React from 'react';

import Select from 'react-select';
import styled from 'styled-components';
import { arrayOf, bool, func, instanceOf, oneOfType, string } from 'prop-types';

import Theme from '../../../../theme/Theme';
import { DropDown } from '../DropDown';
import { DropDownSelect, WhiteCard, Tabs } from '../../../../common';

const VendorSalesPerformanceFilters = ({
  viewComponent,
  setViewComponent,
  marketplaceDefaultValue,
  marketplaceOptions,
  handleMarketplaceOptions,
  dateOptions,
  getSelectComponents,
  DropDownIndicator,
  handleDailyFact,
  selectedSalesDF,
  isApiCall,
}) => {
  return (
    <WhiteCard className="mb-3">
      <Tabs>
        <ul className="tabs">
          <li
            className={viewComponent === 'salePerformance' ? 'active' : ''}
            onClick={() => setViewComponent('salePerformance')}
            role="presentation">
            Sales Performance
          </li>
          <li
            className={viewComponent === 'adPerformance' ? 'active' : ''}
            onClick={() => setViewComponent('adPerformance')}
            role="presentation">
            Ad Performance
          </li>
        </ul>
      </Tabs>
      <ViewData>
        <div className="row">
          <div className="col-md-4  col-sm-12 ">
            <div className="view-data-for mt-4 ">View data for</div>{' '}
          </div>
          <div className="col-md-4 col-sm-6 mt-2 pt-1 pl-0">
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
            className="col-md-4 col-sm-6  mt-2 pt-1 pl-0 "
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
  viewComponent: '',
  setViewComponent: () => {},
  marketplaceDefaultValue: {},
  marketplaceOptions: {},
  handleMarketplaceOptions: () => {},
  dateOptions: {},
  getSelectComponents: () => {},
  isApiCall: false,
  DropDownIndicator: () => {},
  handleDailyFact: () => {},
  selectedSalesDF: {},
};

VendorSalesPerformanceFilters.propTypes = {
  viewComponent: string,
  setViewComponent: func,
  marketplaceDefaultValue: oneOfType(Object, Array),
  marketplaceOptions: arrayOf(Array),
  handleMarketplaceOptions: func,
  dateOptions: arrayOf(Array),
  getSelectComponents: func,
  isApiCall: bool,
  DropDownIndicator: func,
  handleDailyFact: func,
  selectedSalesDF: instanceOf(Object),
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
      text-align: center;
      padding-bottom: 10px;
    }
  }
`;
