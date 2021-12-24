import React, { useState } from 'react';

import Select from 'react-select';
import { arrayOf, bool, func, shape } from 'prop-types';
import { useMediaQuery } from 'react-responsive';

import {
  DropDownSelect,
  WhiteCard,
  DropdownIndicator,
} from '../../../../common';
import { DropDown } from '../../../Customer/CompanyPerformance/DropDown';
import { CaretUp } from '../../../../theme/images';

const DSPFilter = ({
  options,
  handleMarketplaceOptions,
  managerList,
  getAdManagerComponents,
  handleManagerFilter,
  isApiCall,
  handleResetFilter,
  selectInputRef,
  selectedManager,
  selectedBgs,
  bgsList,
  handleBGSList,
  selectedMarketplace,
  isAdManagerAdmin,
  isBGSManager,
  isBGSAdmin,
}) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const renderBGSDropdown = (className) => {
    return (
      <div className="col-12 ">
        <div className="label mt-3">BGS</div>
        {DropDown(
          className,
          bgsList,
          bgsList && bgsList[0] && bgsList[0].label,
          getAdManagerComponents,
          bgsList && bgsList[0],
          handleBGSList,
          isApiCall,
          null,
          selectedBgs,
        )}
      </div>
    );
  };

  const renderFilters = () => {
    return (
      <>
        {isBGSAdmin || isAdManagerAdmin ? (
          <div className="col-lg-12 col-md-6">
            <div className="label mt-3">
              {isBGSAdmin ? 'BGS Manager' : 'Ad Manager'}
            </div>
            {DropDown(
              'cursor',
              managerList,
              managerList && managerList[0] && managerList[0].label,
              getAdManagerComponents,
              managerList && managerList[0],
              handleManagerFilter,
              isApiCall,
              selectInputRef,
              selectedManager,
            )}
          </div>
        ) : null}
        {isBGSManager || isBGSAdmin ? renderBGSDropdown('cursor') : null}
        <div className="col-lg-12 col-md-6">
          <div className="label mt-3">Marketplace</div>
          <DropDownSelect
            id="BT-DSPadver-countryfilter"
            className={isApiCall ? `cursor  disabled` : 'cursor '}>
            <Select
              classNamePrefix="react-select"
              className="active"
              components={{ DropdownIndicator }}
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
            <div role="presentation">
              <div className="black-heading-title ">
                <img
                  src={CaretUp}
                  alt="caret"
                  style={{
                    transform: isCollapseOpen ? 'rotate(180deg)' : '',
                    width: '25px',
                    height: '25px',
                    position: ' absolute',
                    right: '7px',
                    top: '10px',
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
    </div>
  );
};

export default DSPFilter;

DSPFilter.defaultProps = {
  isAdManagerAdmin: false,
  isBGSManager: false,
  isBGSAdmin: false,
  isApiCall: false,
  options: [],
  managerList: [],
  getAdManagerComponents: null,
  selectInputRef: {},
  selectedManager: {},
  selectedMarketplace: {},
  selectedBgs: {},
  bgsList: [],
  handleBGSList: () => {},
  handleResetFilter: () => {},
  handleManagerFilter: () => {},
  handleMarketplaceOptions: () => {},
};

DSPFilter.propTypes = {
  isApiCall: bool,
  isAdManagerAdmin: bool,
  isBGSAdmin: bool,
  isBGSManager: bool,
  selectedBgs: shape({}),
  selectInputRef: shape({}),
  selectedManager: shape({}),
  selectedMarketplace: shape({}),
  options: arrayOf(Array),
  managerList: arrayOf(Array),
  bgsList: arrayOf(Array),
  handleBGSList: func,
  handleMarketplaceOptions: func,
  getAdManagerComponents: func,
  handleManagerFilter: func,
  handleResetFilter: func,
};
