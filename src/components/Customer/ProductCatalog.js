/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from 'react';

import Select, { components } from 'react-select';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { DebounceInput } from 'react-debounce-input';

import {
  Tabs,
  WhiteCard,
  InputSearchWithRadius,
  DropDownSelect,
  Table,
  PageLoader,
} from '../../common';
import {
  SearchIcon,
  Logo,
  RequestPlan,
  CaretUp,
} from '../../theme/images/index';
import Theme from '../../theme/Theme';
import { getProductCatalog } from '../../api';

export default function ProductCatalog({ id }) {
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [viewComponent, setViewComponent] = useState('product');
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ 'order-by': 'title' });
  const sortOptions = [
    { label: 'Name (A-Z)', value: 'title' },
    {
      label: 'Name (Z-A)',
      value: '-title',
    },
  ];

  const statusOptions = [
    { label: 'Any Status', value: '' },
    {
      label: 'Scheduled',
      value: 'scheduled',
    },
    {
      label: 'Optimized',
      value: 'optimized',
    },
    {
      label: 'Assets Received',
      value: 'assets received',
    },
    {
      label: 'Assets Requested',
      value: 'assets requested',
    },
    {
      label: 'Unoptimized',
      value: 'unoptimized',
    },
  ];

  useEffect(() => {
    setIsLoading({ loader: true, type: 'page' });

    getProductCatalog(id, filters).then((response) => {
      setData(response && response.data && response.data.results);
      setIsLoading({ loader: false, type: 'page' });
    });
  }, [id, filters]);

  const generateHTML = (item) => {
    return (
      <label style={{ display: 'contents' }} htmlFor="add-addendum">
        <tr width="100%">
          <td className="product-catalog-body">
            {' '}
            <div className="product-catalog-image">
              <input
                className="check-box-product-list"
                type="checkbox"
                id="add-addendum"
              />
              <span className="checkmark" />
              <img
                className="product-image "
                src={item.main_image || Logo}
                alt=""
              />{' '}
              <img
                className=" product-image-large"
                src={item.main_image || Logo}
                alt=""
              />{' '}
            </div>
            <div className="product-data">
              <div className="product-name">{item.title || ''}</div>
              <div className="product-id">
                {item.brand || ''} / {item.asin || ''} /{' '}
                {item.total_variant || 0} Variations
              </div>
            </div>
          </td>
          <td className="product-catalog-body">
            <div
              className={`status ${
                item.status.includes('received') ||
                item.status.includes('requested')
                  ? item.status.replace(' ', '-')
                  : item.status
              }`}>
              <span
                className={`bullet-point ${
                  item.status.includes('received') ||
                  item.status.includes('requested')
                    ? item.status.replace(' ', '-')
                    : item.status
                }`}
              />
              <span className="status-text capitalize"> {item.status}</span>
            </div>
          </td>
          <td className="product-catalog-body">
            {item.status === 'unoptimized' ? (
              <div className="request">
                {' '}
                <img
                  className="request-plan"
                  width="18px"
                  src={RequestPlan}
                  alt="plan"
                />{' '}
                Request
              </div>
            ) : (
              ''
            )}
          </td>
        </tr>
      </label>
    );
  };
  const getSelectPlaceholder = (item) => {
    if (item === 'sort') {
      return 'Sort by';
    }
    if (item === 'sort') {
      return 'Any Status';
    }

    return '';
  };
  const { SingleValue } = components;

  const SortOption = (props) => (
    <SingleValue {...props}>
      {props.data.label === 'Name (A-Z)' || props.data.label === 'Name (Z-A)'
        ? 'Sort by:'
        : ''}
      &nbsp;
      <span style={{ lineHeight: 0, fontSize: '15px' }}>
        {props.data.label}
      </span>
    </SingleValue>
  );

  const getDropDownOptions = (optionsFor) => {
    if (optionsFor === 'sort') {
      return sortOptions;
    }

    if (optionsFor === 'status') {
      return statusOptions;
    }
    return '';
  };

  const handleFilters = (event, item) => {
    if (item === 'sort') {
      setFilters({
        ...filters,
        'order-by': event.value,
      });
    }
    if (item === 'status') {
      setFilters({
        ...filters,
        status: event.value,
      });
    }
  };
  const DropdownIndicator = (props) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <img
            src={CaretUp}
            alt="caret"
            style={{
              transform: props.selectProps.menuIsOpen ? 'rotate(180deg)' : '',
              width: '25px',
              height: '25px',
            }}
          />
        </components.DropdownIndicator>
      )
    );
  };

  const getSelectComponents = (key) => {
    if (key === 'sort') {
      return {
        SingleValue: SortOption,
        DropdownIndicator,
      };
    }

    if (key === 'status') {
      return {
        SingleValue: SortOption,
        DropdownIndicator,
      };
    }
    return '';
  };

  const bindDropDownValue = (item) => {
    if (item === 'sort') {
      return sortOptions[0];
    }
    if (item === 'status') {
      return statusOptions[0];
    }
    return '';
  };
  const generateDropdown = (item) => {
    return (
      <>
        <Select
          classNamePrefix="react-select"
          isClearable={false}
          className="active"
          placeholder={getSelectPlaceholder(item)}
          options={getDropDownOptions(item)}
          onChange={(event, action) => handleFilters(event, item, action)}
          defaultValue={bindDropDownValue(item)}
          isMulti={false}
          components={getSelectComponents(item)}
        />
      </>
    );
  };

  const displaySearchSortPanel = () => {
    return (
      <div className="row mt-2 mb-2">
        <div className="col-6 pl-1 pr-1">
          {' '}
          <InputSearchWithRadius className="customer-list-header">
            <DebounceInput
              debounceTimeout={600}
              className=" form-control search-filter"
              placeholder="Search"
              onChange={(event) => {
                setFilters({
                  ...filters,
                  q: event.target.value,
                });
              }}
            />
            <img src={SearchIcon} alt="search" className="search-input-icon" />
          </InputSearchWithRadius>
        </div>
        <div className="col-3 pl-1 pr-1">
          {' '}
          <DropDownSelect className=" w-100">
            {' '}
            {generateDropdown('sort')}
          </DropDownSelect>
        </div>
        <div className="col-3 pl-1 pr-1">
          {' '}
          <DropDownSelect>{generateDropdown('status')}</DropDownSelect>
        </div>
      </div>
    );
  };
  return (
    <div className="col-lg-6 col-12">
      <WhiteCard>
        {' '}
        <Tabs>
          <ul className="tabs">
            <li
              className={viewComponent === 'product' ? 'active' : ''}
              onClick={() => setViewComponent('product')}
              role="presentation">
              Product Catalog
            </li>
            <li
              className={viewComponent === 'schedule' ? 'active' : ''}
              onClick={() => setViewComponent('schedule')}
              role="presentation">
              Schedule
            </li>
          </ul>
        </Tabs>
        {displaySearchSortPanel()}
        {(data && data.length === 0) || data === undefined ? (
          <div className="text-center mt-3">No record found.</div>
        ) : (
          <>
            {viewComponent === 'product' ? (
              <>
                {isLoading.loader && isLoading.type === 'page' ? (
                  <PageLoader
                    component="agrement-details"
                    color="#FF5933"
                    type="detail"
                    width={40}
                    height={40}
                  />
                ) : (
                  <>
                    <Table className="mt-0 product-catalog-laptop ">
                      <tr>
                        <th width="55%" className="product-catalog-header">
                          Product Name / ASIN / SKU
                        </th>
                        <th width="25%" className="product-catalog-header">
                          Status
                        </th>
                        <th width="20%" className="product-catalog-header">
                          {' '}
                          &nbsp;
                        </th>
                      </tr>
                      <tbody>
                        {data &&
                          data.map((item) => (
                            <React.Fragment key={item.id}>
                              {generateHTML(item)}
                            </React.Fragment>
                          ))}
                      </tbody>
                    </Table>
                    <TableMobileView className="mt-0 product-catalog-mobile ">
                      <div className="table-mob-header">
                        <div className="row">
                          <div className="col-8">Product Name / ASIN / SKU</div>
                          <div className="col-4">Status</div>
                        </div>
                      </div>
                      <div className="table-mob-body">
                        {data &&
                          data.map((item) => (
                            <React.Fragment key={item.id}>
                              <label
                                style={{ display: 'contents' }}
                                htmlFor="12">
                                <div className="row">
                                  <div className="col-12">
                                    <div className="product-catalog-image">
                                      <input
                                        className="check-box-product-list"
                                        type="checkbox"
                                        id="12"
                                      />
                                      <span className="checkmark" />
                                      <img
                                        className="product-image"
                                        src={item.main_image || Logo}
                                        alt=""
                                      />{' '}
                                    </div>
                                    <div className="product-data">
                                      <div className="product-name">
                                        {item.title || ''}
                                      </div>
                                      <div className="product-id">
                                        {item.brand || ''} / {item.asin || ''} /{' '}
                                        {item.total_variant || 0} Variations
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-8 mt-3">
                                    <div
                                      className={`status ml-5 ${
                                        item.status.includes('received') ||
                                        item.status.includes('requested')
                                          ? item.status.replace(' ', '-')
                                          : item.status
                                      }`}>
                                      {' '}
                                      <span
                                        className={`bullet-point ${
                                          item.status.includes('received') ||
                                          item.status.includes('requested')
                                            ? item.status.replace(' ', '-')
                                            : item.status
                                        }`}
                                      />
                                      <span className="status-text">
                                        {' '}
                                        {item.status}{' '}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-4 mt-3 text-center">
                                    {item.status === 'unoptimized' ? (
                                      <div className="request">
                                        {' '}
                                        <img
                                          className="request-plan"
                                          width="18px"
                                          src={RequestPlan}
                                          alt="plan"
                                        />{' '}
                                        Request
                                      </div>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                              </label>
                            </React.Fragment>
                          ))}
                      </div>
                    </TableMobileView>
                  </>
                )}
              </>
            ) : (
              ''
            )}
          </>
        )}
      </WhiteCard>
    </div>
  );
}

ProductCatalog.propTypes = {
  id: PropTypes.string.isRequired,
};

const TableMobileView = styled.div`
  display: none;
  @media only screen and (max-width: 767px) {
    display: block;
    .table-mob-header {
      border-top: 1px solid ${Theme.gray11};
      padding: 13px 0px;
      text-transform: uppercase;
      color: ${Theme.gray40};
      font-size: 11px;
      background: ${Theme.white};
      font-family: ${Theme.baseFontFamily};
    }
    .table-mob-body {
      border-top: 1px solid ${Theme.gray11};
      border-bottom: 1px solid ${Theme.gray11};
      padding: 13px 4px 13px 0;
      cursor: pointer;
      font-size: ${Theme.extraNormal};
      .product-catalog-image {
        input.check-box-product-list {
          display: none;
        }
        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 4px;
          width: 20px;
          height: 20px;
          top: 20px;
          left: 10px;
        }

        input:checked ~ .checkmark {
          background-color: ${Theme.orange};
          color: white;
          border: none;
          top: 10px;
          left: 23px;
        }

        .checkmark:after {
          content: '';
          position: absolute;
          display: none;
        }

        input:checked ~ .checkmark:after {
          display: block;
        }

        .checkmark:after {
          left: 6px;
          top: 3px;
          width: 6px;
          height: 11px;
          border: solid ${Theme.white};
          border-width: 0 2px 2px 0;
          -webkit-transform: rotate(45deg);
          -ms-transform: rotate(45deg);
          transform: rotate(45deg);
        }
        .product-image {
          width: 37px;
          height: 37px;
          margin-right: 10px;
          float: left;
          display: flex;
          align-items: center;
          flex-direction: row;
        }
      }
      .product-data {
        float: left;

        .product-name {
          color: ${Theme.black};
          font-size: ${Theme.normal};
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 270px;
        }
        .product-id {
          color: ${Theme.gray90};
          font-weight: 500;
        }
      }
      .status {
        background-color: #e3f2d2;
        border-radius: 5px;
        max-width: 99px;
        text-align: right;
        padding: 5px 12px;
        color: ${Theme.black};
        position: relative;

        &.unoptimized {
          background-color: ${Theme.gray8};
          max-width: 113px;
        }

        &.scheduled {
          background-color: ${Theme.extraLightYellow};
          max-width: 99px;
        }
        &.assets-received {
          background-color: #d6eef2;
          max-width: 132px;
        }
        &.assets-requested {
          background-color: ${Theme.lightOrange};
          max-width: 132px;
        }

        .bullet-point {
          background-color: ${Theme.lighterGreen};
          border-radius: 100%;
          width: 8px;
          height: 8px;
          position: absolute;
          top: 9px;
          left: 11px;

          &.unoptimized {
            background-color: ${Theme.gray25};
          }
          &.scheduled {
            background-color: ${Theme.yellow};
          }
          &.assets-received {
            background-color: #30a8bd;
          }
          &.assets-requested {
            background-color: ${Theme.orange};
          }
        }
        .status-text {
          color: ${Theme.black};
          margin-left: 3px;
        }
      }
      .request {
        color: ${Theme.gray85};
        font-weight: 300;

        .request-plan {
          vertical-align: bottom;
          margin-right: 2px;
        }
      }
    }
  }
  @media only screen and (max-width: 400px) {
    .product-data {
      float: left;
      max-width: 180px;

      .product-name {
        max-width: 160px;
      }
    }
  }
`;
