import React from 'react';

import Select from 'react-select';
import { arrayOf, bool, func, string } from 'prop-types';
import { useMediaQuery } from 'react-responsive';

import { DropDownSelect, WhiteCard, ModalRadioCheck } from '../../../../common';
import { DropDown } from '../../../Customer/CompanyPerformance/DropDown';

const SponsoredFilter = ({
  handleResetFilter,
  selectInputRef,
  DropdownIndicator,
  marketplaceOptions,
  handleMarketplace,
  adManagerList,
  getSelectComponents,
  handleAdManagerFilter,
  SponsoredAdTypeOptions,
  handleAdType,
  selectedAdType,
  isApiCall,
  selectedAdManager,
  selectedMarketplace,
}) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });

  const renderAdManagerDropdown = (className) => {
    return (
      <div className="col-12 ">
        <div className="label mt-3">Ad Manager</div>
        {DropDown(
          className,
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
    );
  };

  const renderMarketplaceDropdown = (className) => {
    return (
      <div className="col-12 ">
        <div className="label mt-3">Marketplace</div>
        <DropDownSelect
          id="BT-sponsoredadver-countryfilter"
          className={isApiCall ? `${className}  disabled` : className}>
          <Select
            classNamePrefix="react-select"
            className="active"
            components={DropdownIndicator}
            options={marketplaceOptions}
            value={selectedMarketplace}
            onChange={(event) => handleMarketplace(event)}
            placeholder={
              marketplaceOptions &&
              marketplaceOptions[0] &&
              marketplaceOptions[0].label
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
    );
  };

  const renderSponsoredAdTypes = () => {
    return SponsoredAdTypeOptions.map((item, index) => (
      <ModalRadioCheck className="pb-1" key={item.value}>
        {' '}
        <label
          className={`${
            index === 0
              ? 'checkboxes radio-container customer-list'
              : 'checkboxes radio-container customer-list mt-2'
          }`}
          htmlFor={item.value}>
          {item.label}
          <input
            type="radio"
            name="radio"
            id={item.value}
            value={item.value}
            onChange={(event) => handleAdType(event)}
            defaultChecked={item.value === selectedAdType}
          />
          <span className="checkmark checkmark-customer-list" />
        </label>
      </ModalRadioCheck>
    ));
  };

  const renderDekstopView = () => {
    return (
      <WhiteCard className="mb-3 d-lg-block d-none">
        <div className="row ">
          <div className="col-6">
            <div className="black-heading-title ">Filters</div>
          </div>
          <div className="col-6 text-right">
            <p
              role="presentation"
              onClick={() => handleResetFilter()}
              className="gray-normal-text m-0 cursor">
              Reset filters
            </p>
          </div>
          {renderAdManagerDropdown('cursor')}
          {renderMarketplaceDropdown('cursor')}
          <div className="col-12">
            <div className="label mt-4 mb-2">Sponsored Ad Type</div>
          </div>
          <div className="col-12">{renderSponsoredAdTypes()}</div>
        </div>
      </WhiteCard>
    );
  };

  const renderTabletView = () => {
    return (
      <WhiteCard className="mb-3 d-lg-none d-block">
        <div className="row ">
          <div className="col-6">
            <div className="black-heading-title ">Filters</div>
          </div>
          <div className="col-6 text-right">
            <p
              className="gray-normal-text m-0 cursor "
              role="presentation"
              onClick={() => handleResetFilter()}>
              Reset filters
            </p>
          </div>
        </div>
        <div className="row ">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="row">
              {renderAdManagerDropdown('customer-list-header')}

              {renderMarketplaceDropdown('customer-list-header')}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 pl-md-5 col-sm-12">
            <div className="row ">
              <div className="col-12">
                <div className="label mt-4 mb-2">Sponsored Ad Type</div>
              </div>
              <div className="col-12">{renderSponsoredAdTypes()}</div>
            </div>
          </div>
        </div>
      </WhiteCard>
    );
  };

  return <>{isDesktop ? renderDekstopView() : renderTabletView()}</>;
};

export default SponsoredFilter;

SponsoredFilter.defaultProps = {
  handleMarketplace: () => {},
  handleResetFilter: () => {},
  marketplaceOptions: [],
  SponsoredAdTypeOptions: [],
  adManagerList: [],
  getSelectComponents: null,
  selectInputRef: {},
  DropdownIndicator: () => {},
  handleAdManagerFilter: () => {},
  handleAdType: () => {},
  selectedAdType: {},
  isApiCall: false,
  selectedAdManager: {},
  selectedMarketplace: {},
};

SponsoredFilter.propTypes = {
  handleMarketplace: func,
  handleResetFilter: func,
  marketplaceOptions: arrayOf(Array),
  SponsoredAdTypeOptions: arrayOf(Array),
  adManagerList: arrayOf(Array),
  selectInputRef: arrayOf(Array),
  DropdownIndicator: func,
  getSelectComponents: func,
  handleAdManagerFilter: func,
  handleAdType: func,
  selectedAdType: string,
  isApiCall: bool,
  selectedAdManager: arrayOf(Array),
  selectedMarketplace: string,
};
