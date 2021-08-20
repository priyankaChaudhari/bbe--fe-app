import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { DebounceInput } from 'react-debounce-input';
import ReactTooltip from 'react-tooltip';
import { useMediaQuery } from 'react-responsive';

import {
  CheckBox,
  DropDownSelect,
  InputSearchWithRadius,
  ModalRadioCheck,
  WhiteCard,
} from '../../common';
import {
  contractChoices,
  contractStatus,
} from '../../constants/FieldConstants';
import { SideContent } from '../../theme/CustomerListStyle';
import { CaretUp, InfoIcon, SearchIcon } from '../../theme/images';

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
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  return (
    <>
      <div className="customer-list-header-sticky">
        {isDesktop ? (
          <div className="row ">
            <div className="col-3">
              <p className="black-heading-title pt-3 m-0"> Customers</p>
            </div>
            <div className="col-lg-3 col-md-4 col-12   mb-2 pl-2 pr-2 ">
              {showAdPerformance || showDspAdPerformance || showPerformance ? (
                <DropDownSelect
                  id="BT-stats-customerlist-dropdown"
                  className="customer-list-header">
                  {generateDropdown('stats')}
                </DropDownSelect>
              ) : (
                <></>
              )}
            </div>
            <div className="col-lg-3 col-md-6  col-12   mb-2  pl-2 pr-2 ">
              <DropDownSelect
                id="BT-view-customerlist-dropdown"
                className="customer-list-header">
                {generateDropdown('view')}
              </DropDownSelect>{' '}
            </div>

            <div className="col-lg-3 col-md-4 col-12  pl-2 pr-2">
              <DropDownSelect
                id="BT-sort-customerlist-dropdown"
                className="customer-list-header">
                {generateDropdown('sort')}
              </DropDownSelect>{' '}
            </div>

            {showOrderOption && !isDesktop ? (
              <div className="col-lg-3 col-md-4 col-12 pl-2 ">
                <DropDownSelect
                  id="BT-order-customerlist-dropdown"
                  className="customer-list-header">
                  {generateDropdown('order')}
                </DropDownSelect>
              </div>
            ) : null}
          </div>
        ) : (
          ''
        )}
        <div className="container-fluid">
          <WhiteCard className="mb-3 d-lg-none d-block ">
            <div className="row">
              <div
                className={
                  showContractDetails ? 'col-lg-3 col-md-12' : 'col-lg-3 col-12'
                }>
                <div
                  aria-hidden="true"
                  onClick={() => setIsCollapseOpen(!isCollapseOpen)}>
                  <div className="row">
                    <div className={isDesktop ? 'col-6' : 'col-5'}>
                      <p className="black-heading-title pt-3 m-0"> Filters</p>
                    </div>

                    <div className="col-6 text-right">
                      <p className=" gray-normal-text  d-lg-none d-block ">
                        <label
                          className=" cursor "
                          htmlFor="tabletmenu-check"
                          id="responsive-button"
                          onClickCapture={(event) => {
                            event.stopPropagation();
                            handleFilters(event, 'unselected');
                          }}>
                          Reset filters
                        </label>
                      </p>
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
                              position: ' absolute',
                              right: '7px',
                              top: '10px',
                            }}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                {isCollapseOpen ? (
                  <SideContent>
                    <div className="row ">
                      <div className="col-12 mb-3">
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
                            place="left"
                            style={{ left: '5%!important' }}
                          />
                          <img
                            src={SearchIcon}
                            alt="search"
                            className="search-input-icon"
                          />
                        </InputSearchWithRadius>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        {showAdPerformance ? (
                          <div className="label">Sponsored Ad Manager</div>
                        ) : showDspAdPerformance ? (
                          <div className="label">DSP Ad Manager</div>
                        ) : (
                          <div className="label">Brand Strategist</div>
                        )}
                        <DropDownSelect id="BT-order-customerlist-dropdown">
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
                      </div>
                      <div className="col-6">
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
                            <div className="label mt-4 pt-2">
                              Contract Status
                            </div>
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
                      </div>
                    </div>
                  </SideContent>
                ) : (
                  ''
                )}
              </div>
            </div>
          </WhiteCard>
        </div>
      </div>
      <div className="container-fluid">
        <WhiteCard className="d-lg-none d-block">
          <div className="row">
            <div className="col-12 mb-2 mt-1">
              {' '}
              <p className="black-heading-title pt-1 m-0"> Customers</p>
            </div>
            <div className="col-lg-3 col-md-6  col-12   mb-2  ">
              <DropDownSelect
                id="BT-view-customerlist-dropdown"
                className="customer-list-header">
                {generateDropdown('view')}
              </DropDownSelect>{' '}
            </div>
            {showAdPerformance || showDspAdPerformance || showPerformance ? (
              <div className="col-lg-3 col-md-6 col-12   mb-2  ">
                <DropDownSelect
                  id="BT-stats-customerlist-dropdown"
                  className="customer-list-header">
                  {generateDropdown('stats')}
                </DropDownSelect>{' '}
              </div>
            ) : (
              <></>
            )}
            <div className="col-lg-3 col-md-6  mb-2 col-12 ">
              <DropDownSelect
                id="BT-sort-customerlist-dropdown"
                className="customer-list-header">
                {generateDropdown('sort')}
              </DropDownSelect>{' '}
            </div>
            {showOrderOption && !isDesktop ? (
              <div className="col-lg-3 col-md-6 col-12 ">
                <DropDownSelect
                  id="BT-order-customerlist-dropdown"
                  className="customer-list-header">
                  {generateDropdown('order')}
                </DropDownSelect>
              </div>
            ) : null}
          </div>
        </WhiteCard>
      </div>

      <div className="straight-line horizontal-line mt-n2 d-lg-block d-none" />
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
