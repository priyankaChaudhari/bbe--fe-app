import React, { useState } from 'react';

import Select from 'react-select';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { useMediaQuery } from 'react-responsive';

import {
  DropDownSelect,
  WhiteCard,
  DropDownIndicator,
} from '../../../../common';
import { DropDown } from '../../../Customer/CompanyPerformance/DropDown';
import { CaretUp } from '../../../../theme/images';

const DSPFilter = ({
  options,
  handleMarketplaceOptions,
  adManagerList,
  getAdManagerComponents,
  handleAdManagerFilter,
  isApiCall,
  handleResetFilter,
  selectInputRef,
  selectedAdManager,
  selectedMarketplace,
  isAdManagerAdmin,
  isBGSManager,
}) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const renderFilters = () => {
    return (
      <>
        {isAdManagerAdmin ? (
          <div className="col-lg-12 col-md-6">
            <div className="label mt-3">
              {isBGSManager ? 'BGS' : 'Ad Manager'}
            </div>
            {DropDown(
              'cursor',
              adManagerList,
              adManagerList && adManagerList[0] && adManagerList[0].label,
              getAdManagerComponents,
              adManagerList && adManagerList[0],
              handleAdManagerFilter,
              isApiCall,
              selectInputRef,
              selectedAdManager,
            )}
          </div>
        ) : null}
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
  selectProps: {
    menuIsOpen: false,
  },
  handleMarketplaceOptions: () => {},
  options: [],
  adManagerList: [],
  getAdManagerComponents: null,
  handleAdManagerFilter: () => {},
  isApiCall: false,
  handleResetFilter: () => {},
  selectInputRef: {},
  selectedAdManager: {},
  selectedMarketplace: {},
  isAdManagerAdmin: {},
  isBGSManager: false,
};

DSPFilter.propTypes = {
  handleMarketplaceOptions: func,
  options: arrayOf(Array),
  // eslint-disable-next-line react/no-unused-prop-types
  selectProps: shape({
    menuIsOpen: bool,
  }),
  adManagerList: arrayOf(Array),
  getAdManagerComponents: func,
  handleAdManagerFilter: func,
  isApiCall: bool,
  handleResetFilter: func,
  selectInputRef: arrayOf(Array),
  selectedAdManager: arrayOf(Array),
  selectedMarketplace: arrayOf(Array),
  isAdManagerAdmin: string,
  isBGSManager: bool,
};
