/* eslint-disable jsx-a11y/label-has-for */
import React, { useState } from 'react';

import { arrayOf, func, string } from 'prop-types';
import { DebounceInput } from 'react-debounce-input';
import { useMediaQuery } from 'react-responsive';

import { SearchIcon, CaretUp } from '../../../../theme/images/index';
import {
  InputSearchWithRadius,
  WhiteCard,
  ModalRadioCheck,
} from '../../../../common';

export default function DSPInvoiceFilters({
  searchQuery,
  selectedStatus,
  statusOptions,
  onHandleSearch,
  handleResetFilter,
  handleStatusChange,
}) {
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const isDesktop = useMediaQuery({ minWidth: 992 });

  const renderSearchFunctionality = () => {
    return (
      <div className="col-12">
        <InputSearchWithRadius className="customer-list-header w-80 mt-4">
          <DebounceInput
            // debounceTimeout={600}
            className=" form-control search-filter"
            placeholder="Search"
            onChange={(event) => {
              onHandleSearch(event);
            }}
            onKeyPress={() => {
              // onHandleSearch(event);
              // if (event.key === 'Enter') {
              //   onHandleSearch(event);
              // }
            }}
            value={searchQuery}
          />

          <img src={SearchIcon} alt="search" className="search-input-icon" />
        </InputSearchWithRadius>
      </div>
    );
  };

  const renderStatus = () => {
    return (
      <div className="col-12">
        <div className="label mb-3 mt-3">Invoice Status</div>
        {statusOptions.map((item, index) => (
          <ModalRadioCheck className="mb-3" key={item.value}>
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
                onChange={(event) => handleStatusChange(event)}
                defaultChecked={item.value === selectedStatus}
              />
              <span className="checkmark checkmark-customer-list" />
            </label>
          </ModalRadioCheck>
        ))}
      </div>
    );
  };

  return (
    <WhiteCard className="mb-2">
      <div className="row ">
        <div className="col-6">
          <div className="black-heading-title ">Filters</div>
        </div>
        <div className="col-5 text-right">
          <div
            role="presentation"
            className="gray-normal-text cursor"
            onClick={() => handleResetFilter()}>
            Reset filters
          </div>
        </div>
        {!isDesktop ? (
          <div
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
                  position: ' absolute',
                  right: '12px',
                  top: '18px',
                }}
              />
            </div>
          </div>
        ) : null}
        {isDesktop || isCollapseOpen ? (
          <>
            {renderSearchFunctionality()}
            {renderStatus()}
          </>
        ) : null}
      </div>
    </WhiteCard>
  );
}

DSPInvoiceFilters.defaultProps = {
  searchQuery: '',
  selectedStatus: '',
  statusOptions: [],
  onHandleSearch: () => {},
  handleResetFilter: () => {},
  handleStatusChange: () => {},
};

DSPInvoiceFilters.propTypes = {
  searchQuery: string,
  selectedStatus: string,
  statusOptions: arrayOf(Array),
  onHandleSearch: func,
  handleResetFilter: func,
  handleStatusChange: func,
};
