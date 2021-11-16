import React, { useState } from 'react';

import { useMediaQuery } from 'react-responsive';
import { arrayOf, bool, func, shape } from 'prop-types';

import { DropDown } from '../../../Customer/CompanyPerformance/DropDown';
import { CaretUp } from '../../../../theme/images';
import { WhiteCard } from '../../../../common';

const SalesFilter = ({
  handleResetFilter,
  getSelectComponents,
  marketplaceOptions,
  handleMarketplace,
  managersList,
  handleManagerList,
  handleBGSList,
  selectedBgs,
  bgsList,
  selectedManager,
  isApiCall,
  selectedMarketplace,
  isBGSManager,
  isAdManagerAdmin,
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
          getSelectComponents,
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
          managersList,
          managersList && managersList[0] && managersList[0].label,
          getSelectComponents,
          managersList && managersList[0],
          handleManagerList,
          isApiCall,
          null,
          selectedManager,
        )}
      </div>
    );
  };

  const renderMarketplaceDropdown = (className) => {
    return (
      <div className="col-12 ">
        <div className="label mt-3">Marketplace</div>
        {DropDown(
          className,
          marketplaceOptions,
          marketplaceOptions &&
            marketplaceOptions[0] &&
            marketplaceOptions[0].label,
          getSelectComponents,
          marketplaceOptions && marketplaceOptions[0],
          handleMarketplace,
          isApiCall,
          null,
          selectedMarketplace,
        )}
      </div>
    );
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

          {renderMarketplaceDropdown('cursor')}
          {isBGSAdmin || isAdManagerAdmin
            ? renderManagerDropdown('cursor')
            : null}
          {isBGSManager || isBGSAdmin ? renderBGSDropdown('cursor') : null}
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
  isAdManagerAdmin: false,
  isBGSManager: false,
  isBGSAdmin: false,
  marketplaceOptions: [],
  managersList: [],
  selectedManager: {},
  bgsList: {},
  selectedBgs: {},
  selectedMarketplace: {},
  getSelectComponents: () => {},
  handleManagerList: () => {},
  handleMarketplace: () => {},
  handleResetFilter: () => {},
  handleBGSList: () => {},
};

SalesFilter.propTypes = {
  isApiCall: bool,
  isBGSManager: bool,
  isAdManagerAdmin: bool,
  isBGSAdmin: bool,
  selectedManager: shape({}),
  selectedMarketplace: shape({}),
  marketplaceOptions: arrayOf(Array),
  managersList: arrayOf(Array),
  bgsList: arrayOf(Array),
  selectedBgs: shape({}),
  handleMarketplace: func,
  handleResetFilter: func,
  getSelectComponents: func,
  handleManagerList: func,
  handleBGSList: func,
};
