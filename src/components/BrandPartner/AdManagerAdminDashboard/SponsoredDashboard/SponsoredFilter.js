import React, { useState } from 'react';

import Select from 'react-select';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { useMediaQuery } from 'react-responsive';

import { DropDownSelect, WhiteCard, ModalRadioCheck } from '../../../../common';
import { DropDown } from '../../../Customer/CompanyPerformance/DropDown';
import { CaretUp } from '../../../../theme/images';

const SponsoredFilter = ({
  isAdManagerAdmin,
  isBGSManager,
  isBGSAdmin,
  isApiCall,
  DropdownIndicator,
  marketplaceOptions,
  managerList,
  selectedManager,
  selectedBgs,
  bgsList,
  selectedMarketplace,
  selectInputRef,
  selectedAdType,
  SponsoredAdTypeOptions,
  handleResetFilter,
  handleMarketplace,
  getAdManagerComponents,
  handleAdManagerFilter,
  handleBGSList,
  handleAdType,
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

  const renderManagerDropdown = (className) => {
    return (
      <div className="col-12 ">
        <div className="label mt-3">
          {isBGSAdmin ? 'BGS Manager' : 'Ad Manager'}
        </div>
        {DropDown(
          className,
          managerList,
          managerList && managerList[0] && managerList[0].label,
          getAdManagerComponents,
          managerList && managerList[0],
          handleAdManagerFilter,
          isApiCall,
          selectInputRef,
          selectedManager,
        )}
      </div>
    );
  };

  const renderMarketplaceDropdown = () => {
    return (
      <div className="col-12 ">
        <div className="label mt-3">Marketplace</div>
        <DropDownSelect
          id="BT-sponsoredadver-countryfilter"
          className={isApiCall ? `cursor  disabled` : 'cursor '}>
          <Select
            classNamePrefix="react-select"
            className="active"
            components={DropdownIndicator}
            options={marketplaceOptions}
            defaultValue={marketplaceOptions && marketplaceOptions[0]}
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

          {isBGSAdmin || isAdManagerAdmin
            ? renderManagerDropdown('cursor')
            : null}
          {isBGSManager || isBGSAdmin ? renderBGSDropdown('cursor') : null}

          {renderMarketplaceDropdown()}
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
      <WhiteCard
        onClick={() => setIsCollapseOpen(!isCollapseOpen)}
        className="mb-3 d-lg-none d-block">
        <div className="row ">
          <div className="col-6">
            <div className="black-heading-title ">Filters</div>
          </div>
          <div className="col-5 text-right">
            <p
              className="gray-normal-text m-0 cursor "
              role="presentation"
              onClick={() => handleResetFilter()}>
              Reset filters
            </p>
          </div>
          <div
            className="col-1"
            role="presentation"
            onClick={() => setIsCollapseOpen(!isCollapseOpen)}>
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
        </div>
        {isCollapseOpen ? (
          <div className="row ">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="row">
                {renderMarketplaceDropdown('customer-list-header')}
              </div>
            </div>
            {isBGSAdmin || isAdManagerAdmin ? (
              <div className="col-lg-6 col-md-6 pl-md-5 col-sm-12">
                <div className="row ">
                  {renderManagerDropdown('customer-list-header')}
                </div>
              </div>
            ) : null}

            {isBGSManager || isBGSAdmin ? (
              <div className="col-lg-6 col-md-6 pl-md-5 col-sm-12">
                <div className="row ">
                  {renderBGSDropdown('customer-list-header')}
                </div>
              </div>
            ) : null}
            <div className="col-lg-6 col-md-6 pl-md-5 col-sm-12">
              <div className="row ">
                <div className="col-12">
                  <div className="label mt-4 mb-2">Sponsored Ad Type</div>
                </div>
                <div className="col-12">{renderSponsoredAdTypes()}</div>
              </div>
            </div>
          </div>
        ) : null}
      </WhiteCard>
    );
  };

  return <>{isDesktop ? renderDekstopView() : renderTabletView()}</>;
};

export default SponsoredFilter;

SponsoredFilter.defaultProps = {
  marketplaceOptions: [],
  SponsoredAdTypeOptions: [],
  managerList: [],
  bgsList: [],
  getAdManagerComponents: null,
  DropdownIndicator: null,
  handleMarketplace: () => {},
  handleResetFilter: () => {},
  handleAdManagerFilter: () => {},
  handleAdType: () => {},
  selectedAdType: {},
  isApiCall: false,
  isBGSAdmin: false,
  selectedManager: {},
  selectedMarketplace: {},
  selectInputRef: {},
  isAdManagerAdmin: false,
  isBGSManager: false,
  selectedBgs: {},
  handleBGSList: () => {},
};

SponsoredFilter.propTypes = {
  isBGSAdmin: bool,
  handleMarketplace: func,
  handleResetFilter: func,
  marketplaceOptions: arrayOf(Array),
  SponsoredAdTypeOptions: arrayOf(Array),
  managerList: arrayOf(Array),
  bgsList: arrayOf(Array),
  DropdownIndicator: shape({}),
  getAdManagerComponents: func,
  handleAdManagerFilter: func,
  handleBGSList: func,
  handleAdType: func,
  selectedAdType: string,
  isApiCall: bool,
  selectedBgs: shape({}),
  selectedManager: shape({}),
  selectedMarketplace: shape({}),
  selectInputRef: shape({}),
  isAdManagerAdmin: bool,
  isBGSManager: bool,
};
