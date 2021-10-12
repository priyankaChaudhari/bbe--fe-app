import React, { useState } from 'react';

import Select from 'react-select';
import { arrayOf, bool, func, shape } from 'prop-types';
import { useMediaQuery } from 'react-responsive';

import { CaretUp } from '../../../../theme/images';
import { DropDownSelect, WhiteCard, ModalRadioCheck } from '../../../../common';

const SalesFilter = ({
  handleResetFilter,
  DropdownIndicator,
  marketplaceOptions,
  handleMarketplace,
  bgsList,
  handleBgsList,
  selectedBgs,
  isApiCall,
  selectedMarketplace,
  isBGSManager,
}) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

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

  const renderBgsUsersList = () => {
    return bgsList.map((item, index) => (
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
            onChange={(event) => handleBgsList(event)}
            defaultChecked={item.value === selectedBgs.value}
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

          {renderMarketplaceDropdown()}
          {isBGSManager ? (
            <>
              <div className="col-12">
                <div className="label mt-4 mb-2">BGS</div>
              </div>
              <div className="col-12">{renderBgsUsersList()}</div>
            </>
          ) : null}
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
            <div className="col-lg-6 col-md-6 pl-md-5 col-sm-12">
              <div className="row ">
                <div className="col-12">
                  <div className="label mt-4 mb-2">BGS</div>
                </div>
                <div className="col-12">{renderBgsUsersList()}</div>
              </div>
            </div>
          </div>
        ) : null}
      </WhiteCard>
    );
  };

  return <>{isDesktop ? renderDekstopView() : renderTabletView()}</>;
};

export default SalesFilter;

SalesFilter.defaultProps = {
  isApiCall: false,
  marketplaceOptions: [],
  bgsList: [],
  selectedBgs: {},
  selectedMarketplace: {},
  isBGSManager: false,
  DropdownIndicator: () => {},
  handleBgsList: () => {},
  handleMarketplace: () => {},
  handleResetFilter: () => {},
};

SalesFilter.propTypes = {
  isApiCall: bool,
  isBGSManager: bool,
  selectedBgs: shape({}),
  selectedMarketplace: shape({}),
  marketplaceOptions: arrayOf(Array),
  bgsList: arrayOf(Array),
  handleMarketplace: func,
  handleResetFilter: func,
  DropdownIndicator: func,
  handleBgsList: func,
};
