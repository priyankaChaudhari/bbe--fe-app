import React, { useRef } from 'react';
import { DebounceInput } from 'react-debounce-input';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';

import { CustomerLeftPannel } from './CustomerListStyle';
import {
  CheckBox,
  DropDownSelect,
  InputSearchWithRadius,
  ModalRadioCheck,
} from '../../../common';
import {
  contractChoices,
  contractStatus,
} from '../../../constants/FieldConstants';
import { InfoIcon, SearchIcon } from '../../../theme/images';

function CustomerListLeftSidePanel({
  handleFilters,
  handleSearch,
  generateDropdown,
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
  status,
  showAdPerformance,
  showDspAdPerformance,
  accountType,
}) {
  const selectInputRef = useRef();
  return (
    <>
      <CustomerLeftPannel className="d-none d-lg-block">
        <div className="mb-5 customer-list-pannel">
          <div className="container-fluid">
            <div className="row mt-2 ">
              <div className="col-4">
                <div className="customer-list-filter">Filters</div>
              </div>
              <div className="col-8 text-right">
                <div
                  className="clear-filter"
                  onClick={(event) =>
                    handleFilters(event, 'unselected', 'status')
                  }
                  role="presentation">
                  Reset filters
                </div>
              </div>

              <div className="col-12 mt-3">
                <InputSearchWithRadius className="customer-list-header">
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
                      searchQuery || (filters && filters.searchQuery) || ''
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
                    className="customer-list-tooltip"
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
            </div>
            {showAdPerformance ? (
              <div className="label mt-2 mb-2">Sponsored Ad Manager</div>
            ) : showDspAdPerformance ? (
              <div className="label mt-2 mb-2">DSP Ad Manager</div>
            ) : (
              <div className="label mt-2 mb-2">Brand Strategist</div>
            )}
            <DropDownSelect id="BT-user-customerlist-dropdown">
              {generateDropdown('user', selectInputRef)}
            </DropDownSelect>{' '}
            <div className="label mt-4 pt-2">Customer Status</div>
            <div className="clear-fix" />
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
                              ? filters.status.find((op) => op === item.value)
                              : ''
                          }
                        />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>
                  </li>
                ))}
            </ul>
            <div className="label mt-4 pt-2">Account Type</div>
            <div className="clear-fix" />
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
                            handleFilters(event, item, 'customer_account_type')
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
            <div className="label mt-4 pt-2">Contract Type</div>
            <div className="clear-fix" />
            <ul className="check-box-list">
              {contractChoices.map((item) => (
                <li key={item.value}>
                  {' '}
                  <ModalRadioCheck>
                    <label
                      className=" checkboxes radio-container customer-list"
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
                          filters && filters.contract_type
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
                          handleFilters(event, item, 'contract_status')
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
          </div>
        </div>
      </CustomerLeftPannel>
    </>
  );
}
CustomerListLeftSidePanel.defaultProps = {
  searchQuery: null,
  handleFilters: () => {},
  handleSearch: () => {},
  generateDropdown: () => {},
  showAdPerformance: false,
  showDspAdPerformance: false,
  accountType: null,
};
export default CustomerListLeftSidePanel;
CustomerListLeftSidePanel.propTypes = {
  handleFilters: PropTypes.func,
  handleSearch: PropTypes.func,
  generateDropdown: PropTypes.func,

  filters: PropTypes.shape({
    status: PropTypes.arrayOf(PropTypes.string),
    contract_status: PropTypes.arrayOf(PropTypes.string),
    searchQuery: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    contract_type: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    customer_account_type: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func.isRequired,
  status: PropTypes.arrayOf(PropTypes.object).isRequired,
  showAdPerformance: PropTypes.bool,
  showDspAdPerformance: PropTypes.bool,
  accountType: PropTypes.arrayOf(PropTypes.object),
};
