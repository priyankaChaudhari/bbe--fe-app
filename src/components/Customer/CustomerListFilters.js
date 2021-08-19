import React from 'react';

import { DebounceInput } from 'react-debounce-input';
import ReactTooltip from 'react-tooltip';
import { useMediaQuery } from 'react-responsive';

import PropTypes from 'prop-types';

import {
  CheckBox,
  DropDownSelect,
  InputSearchWithRadius,
  ModalRadioCheck,
} from '../../common';
import {
  contractChoices,
  contractStatus,
} from '../../constants/FieldConstants';
import { MobileLeftSidebar, SideContent } from '../../theme/CustomerListStyle';
import {
  CloseIcon,
  InfoIcon,
  SearchIcon,
  SliderHIcon,
} from '../../theme/images';

function CustomerListFilters({
  handleFilters,
  handleSearch,
  generateDropdown,
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
  showContractDetails,
  showPerformance,
  showAdPerformance,
  showDspAdPerformance,
  showOrderOption,
  status,
  selectInputRefMobile,
  accountType,
}) {
  const isDesktop = useMediaQuery({ minWidth: 991 });

  return (
    <>
      <div className="customer-list-header-sticky">
        <div className="container-fluid">
          <div className="row">
            <div
              className={
                showContractDetails ? 'col-lg-8 col-12' : 'col-lg-6 col-12'
              }>
              <p className="black-heading-title  pt-1"> Customers</p>
              <div className=" mb-3  d-lg-none d-block ">
                <label
                  className="filter-slider mt-3 cursor "
                  htmlFor="tabletmenu-check"
                  id="responsive-button">
                  <img src={SliderHIcon} alt="Menu Lines" />
                  Filter
                </label>
              </div>
              <MobileLeftSidebar>
                <input type="checkbox" id="tabletmenu-check" />
                <div id="ifp-sidebar-responsive">
                  <SideContent>
                    <p className="black-heading-title mt-0 mb-4">
                      {' '}
                      Filter Customers
                    </p>
                    <label
                      htmlFor="tabletmenu-check"
                      className="close-icon d-xl-none d-block cursor">
                      <img width="25px" src={CloseIcon} alt="cross" />
                    </label>
                    <div className="row mt-2 mb-4">
                      <div className="col-4">
                        <div className="customer-list-filter">Filters</div>
                      </div>
                      <div className="col-8 text-right">
                        <div
                          className="clear-filter"
                          onClick={(event) =>
                            handleFilters(event, 'unselected')
                          }
                          role="presentation">
                          Clear filters
                        </div>
                        {/* <div
                          className="clear-filter"
                          onClick={(event) =>
                            handleFilters(event, 'unselected', 'status')
                          }
                          role="presentation">
                          Clear filters
                        </div> */}
                      </div>
                    </div>
                    <div className="col-12">
                      <InputSearchWithRadius className="customer-list-header w-80">
                        <DebounceInput
                          // minLength={2}
                          debounceTimeout={600}
                          className=" form-control search-filter"
                          placeholder="Search"
                          onChange={(event) => {
                            setSearchQuery(event.target.value);
                            setFilters({
                              ...filters,
                              searchQuery: event.target.value,
                            });
                            localStorage.setItem('page', 1);
                            localStorage.setItem(
                              'filters',
                              JSON.stringify({
                                ...filters,
                                searchQuery: event.target.value,
                              }),
                            );
                          }}
                          onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                              handleSearch(event, 'search');
                            }
                          }}
                          value={
                            searchQuery ||
                            (filters && filters.searchQuery) ||
                            ''
                          }
                        />

                        <img
                          src={InfoIcon}
                          alt="search cursor"
                          data-tip="Search by Company Name, Contact First, Last Name or Email"
                          data-for="info"
                          className="info-icon"
                        />
                        <ReactTooltip
                          id="info"
                          aria-haspopup="true"
                          place="bottom"
                        />

                        <img
                          src={SearchIcon}
                          alt="search"
                          className="search-input-icon"
                        />
                      </InputSearchWithRadius>
                    </div>
                    {showAdPerformance ? (
                      <div className="label">Sponsored Ad Manager</div>
                    ) : showDspAdPerformance ? (
                      <div className="label">DSP Ad Manager</div>
                    ) : (
                      <div className="label">Brand Strategist</div>
                    )}
                    <DropDownSelect
                      id="BT-order-customerlist-dropdown"
                      className="w-250">
                      {generateDropdown('user', selectInputRefMobile)}
                    </DropDownSelect>

                    <div className="label mt-4 pt-2">Customer Status</div>
                    <div className="clear-fix" />
                    {!isDesktop ? (
                      <ul className="check-box-list checkboxes">
                        {status &&
                          status.map((item) => (
                            <li key={item.value}>
                              <CheckBox>
                                <label
                                  className="check-container customer-pannel"
                                  htmlFor={item.value}>
                                  {item.label}
                                  <input
                                    type="checkbox"
                                    id={item.value}
                                    name={item.value}
                                    onChange={(event) =>
                                      handleFilters(event, item, 'status')
                                    }
                                    defaultChecked={
                                      filters.status
                                        ? filters.status.find(
                                            (op) => op === item.value,
                                          )
                                        : ''
                                    }
                                  />
                                  <span className="checkmark" />
                                </label>
                              </CheckBox>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      ''
                    )}

                    <div className="label mt-4 pt-2">Account Type</div>
                    <div className="clear-fix" />
                    {!isDesktop ? (
                      <ul className="check-box-list checkboxes">
                        {accountType &&
                          accountType.map((item) => (
                            <li key={item.value}>
                              <CheckBox>
                                <label
                                  className="check-container customer-pannel"
                                  htmlFor={item.value}>
                                  {item.label}
                                  <input
                                    type="checkbox"
                                    id={item.value}
                                    name={item.value}
                                    onChange={(event) =>
                                      handleFilters(
                                        event,
                                        item,
                                        'customer_account_type',
                                      )
                                    }
                                    defaultChecked={
                                      filters.customer_account_type
                                        ? filters.customer_account_type.find(
                                            (op) => op === item.value,
                                          )
                                        : ''
                                    }
                                  />
                                  <span className="checkmark" />
                                </label>
                              </CheckBox>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      ''
                    )}

                    <div className="label mt-4">Contract Type</div>
                    <div className="clear-fix" />
                    {!isDesktop ? (
                      <ul className="check-box-list">
                        {contractChoices.map((item) => (
                          <li key={item.value}>
                            {' '}
                            <ModalRadioCheck>
                              <label
                                className="checkboxes radio-container customer-list"
                                htmlFor={item.value}>
                                {item.label}
                                <input
                                  type="radio"
                                  name="radio"
                                  id={item.value}
                                  value={item.value}
                                  onChange={(event) =>
                                    handleFilters(event, item, 'radio')
                                  }
                                  defaultChecked={
                                    filters.contract_type
                                      ? filters.contract_type === item.value
                                      : ''
                                  }
                                />
                                <span className="checkmark checkmark-customer-list" />
                              </label>
                            </ModalRadioCheck>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      ''
                    )}

                    {!isDesktop ? (
                      <>
                        {' '}
                        <div className="label mt-4 pt-2">Contract Status</div>
                        <div className="clear-fix" />
                        <ul className="check-box-list checkboxes">
                          {contractStatus.map((item) => (
                            <li key={item.value}>
                              <CheckBox>
                                <label
                                  className="check-container customer-pannel"
                                  htmlFor={item.label}>
                                  <input
                                    type="checkbox"
                                    id={item.label}
                                    name={item.value}
                                    onChange={(event) =>
                                      handleFilters(
                                        event,
                                        item,
                                        'contract_status',
                                      )
                                    }
                                    defaultChecked={
                                      filters.contract_status
                                        ? filters.contract_status.find(
                                            (op) => op === item.value,
                                          )
                                        : ''
                                    }
                                  />
                                  <span className="checkmark" />
                                  {item.label}
                                </label>
                              </CheckBox>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      ''
                    )}
                  </SideContent>
                </div>
                <div className="straight-line horizontal-line mb-2" />
              </MobileLeftSidebar>
            </div>

            <div className="col-lg-2 col-md-6  col-12   mb-2  pl-2 pr-2 ">
              <DropDownSelect
                id="BT-view-customerlist-dropdown"
                className="customer-list-header">
                {generateDropdown('view')}
              </DropDownSelect>{' '}
            </div>
            {showAdPerformance || showDspAdPerformance || showPerformance ? (
              <div className="col-lg-2 col-md-4 col-12   mb-2 pl-2 pr-2 ">
                <DropDownSelect
                  id="BT-stats-customerlist-dropdown"
                  className="customer-list-header">
                  {generateDropdown('stats')}
                </DropDownSelect>{' '}
              </div>
            ) : (
              <></>
            )}
            <div className="col-lg-2 col-md-4 col-12 pl-2 pr-2">
              <DropDownSelect
                id="BT-sort-customerlist-dropdown"
                className="customer-list-header">
                {generateDropdown('sort')}
              </DropDownSelect>{' '}
            </div>
            {showOrderOption && !isDesktop ? (
              <div className="col-lg-2 col-md-4 col-12 pl-2 pr-2">
                <DropDownSelect
                  id="BT-order-customerlist-dropdown"
                  className="customer-list-header">
                  {generateDropdown('order')}
                </DropDownSelect>
              </div>
            ) : null}
          </div>
        </div>
        <div className="straight-line horizontal-line mt-n2 d-lg-block d-none" />
        <div className="straight-line horizontal-line  d-lg-none d-block" />
      </div>
    </>
  );
}

export default CustomerListFilters;
CustomerListFilters.defaultProps = {
  searchQuery: null,
  handleFilters: () => {},
  handleSearch: () => {},
  generateDropdown: () => {},
  showContractDetails: true,
  showPerformance: false,
  showAdPerformance: false,
  showDspAdPerformance: false,
  accountType: null,
};
CustomerListFilters.propTypes = {
  handleFilters: PropTypes.func,
  handleSearch: PropTypes.func,
  generateDropdown: PropTypes.func,
  filters: PropTypes.shape({
    status: PropTypes.arrayOf(PropTypes.string),
    contract_type: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    customer_account_type: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    contract_status: PropTypes.arrayOf(PropTypes.string),
    searchQuery: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    contract_details: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    cd_user: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    user: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    ad_user: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    dsp_user: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func.isRequired,
  showContractDetails: PropTypes.bool,
  showPerformance: PropTypes.bool,
  showAdPerformance: PropTypes.bool,
  showDspAdPerformance: PropTypes.bool,
  showOrderOption: PropTypes.bool.isRequired,
  selectInputRefMobile: PropTypes.objectOf(PropTypes.object).isRequired,
  status: PropTypes.arrayOf(PropTypes.object).isRequired,
  accountType: PropTypes.arrayOf(PropTypes.object),
};