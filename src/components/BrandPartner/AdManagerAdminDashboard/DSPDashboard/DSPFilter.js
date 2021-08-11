import React, { useState } from 'react';

import Select from 'react-select';
import { arrayOf, bool, func, shape } from 'prop-types';
import { useMediaQuery } from 'react-responsive';

import {
  DropDownSelect,
  WhiteCard,
  DropDownIndicator,
} from '../../../../common';
import { DropDown } from '../../../Customer/CompanyPerformance/DropDown';
import { CaretUp } from '../../../../theme/images/index';

const DSPFilter = ({
  options,
  handleMarketplaceOptions,
  adManagerList,
  getSelectComponents,
  handleAdManagerFilter,
  isApiCall,
  handleResetFilter,
  selectInputRef,
  selectedAdManager,
  selectedMarketplace,
}) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const renderFilters = () => {
    return (
      <>
        <div className="col-lg-12 col-md-6">
          <div className="label mt-3">Ad Manager</div>
          {DropDown(
            'cursor',
            adManagerList,
            adManagerList && adManagerList[0] && adManagerList[0].label,
            getSelectComponents,
            adManagerList && adManagerList[0],
            handleAdManagerFilter,
            isApiCall,
            selectInputRef,
            selectedAdManager,
          )}
        </div>
        <div className="col-lg-12 col-md-6">
          <div className="label mt-3">Marketplace</div>
          <DropDownSelect
            id="BT-DSPadver-countryfilter"
            className={isApiCall ? `cursor  disabled` : 'cursor '}>
            <Select
              classNamePrefix="react-select"
              className="active"
              components={DropDownIndicator}
              options={options}
              defaultValue={options && options[0]}
              value={selectedMarketplace}
              onChange={(event) => handleMarketplaceOptions(event)}
              placeholder={options && options[0] && options[0].label}
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
      </>
    );
  };
  return (
    <div>
      <WhiteCard
        onClick={() => setIsCollapseOpen(!isCollapseOpen)}
        className={
          isDesktop ? 'mb-3 d-lg-block d-none' : 'mb-3 d-lg-none d-block'
        }>
        <div className="row ">
          <div className="col-6">
            <div className="black-heading-title ">Filters</div>
          </div>
          <div className={isDesktop ? 'col-6 text-right' : 'col-5 text-right'}>
            <div
              onClick={() => handleResetFilter()}
              role="presentation"
              className="gray-normal-text cursor">
              Reset filters
            </div>
          </div>
          {!isDesktop ? (
            <div className="col-1" role="presentation">
              <div className="black-heading-title ">
                <img
                  src={CaretUp}
                  alt="caret"
                  style={{
                    transform: isCollapseOpen ? 'rotate(180deg)' : '',
                    width: '25px',
                    height: '25px',
                  }}
                />
              </div>
            </div>
          ) : null}

          {isDesktop
            ? renderFilters()
            : isCollapseOpen
            ? renderFilters()
            : null}
        </div>
      </WhiteCard>
      {/* <WhiteCard className="mb-3 d-lg-none d-block">
        <div className="row ">
          <div className="col-6">
            <div className="black-heading-title ">Filters</div>
          </div>
          <div className="col-6 text-right">
            <div className="gray-normal-text ">Reset filters</div>
          </div>
        </div>
        <div className="row ">
          <div className="col-12">
            <div className="col-12">
              <div className="label mt-3">Ad Manager</div>
              <DropDownSelect className="customer-list-header">
                <Select />
              </DropDownSelect>
            </div>
            <div className="col-12">
              <div className="label mt-3">Marketplace</div>
              <DropDownSelect className="customer-list-header">
                <Select />
              </DropDownSelect>
            </div>
          </div>
        </div>
      </WhiteCard> */}
    </div>
  );
};

export default DSPFilter;

DSPFilter.defaultProps = {
  selectProps: {
    menuIsOpen: false,
  },
  handleMarketplaceOptions: () => {},
  options: [],
  adManagerList: [],
  getSelectComponents: null,
  handleAdManagerFilter: () => {},
  isApiCall: false,
  handleResetFilter: () => {},
  selectInputRef: {},
  selectedAdManager: {},
  selectedMarketplace: {},
};

DSPFilter.propTypes = {
  handleMarketplaceOptions: func,
  options: arrayOf(Array),
  // eslint-disable-next-line react/no-unused-prop-types
  selectProps: shape({
    menuIsOpen: bool,
  }),
  adManagerList: arrayOf(Array),
  getSelectComponents: func,
  handleAdManagerFilter: func,
  isApiCall: bool,
  handleResetFilter: func,
  selectInputRef: arrayOf(Array),
  selectedAdManager: arrayOf(Array),
  selectedMarketplace: arrayOf(Array),
};
