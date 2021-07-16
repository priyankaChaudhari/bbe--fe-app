import React, { useState } from 'react';
import Select from 'react-select';
import {
  Tabs,
  WhiteCard,
  InputSearchWithRadius,
  DropDownSelect,
  Table,
} from '../../common';
import {
  SearchIcon,
  Logo,
  RequestPlan,
  DefaultUser,
} from '../../theme/images/index';
// import styled from 'styled-components';

export default function ProductCatalog() {
  const [viewComponent, setViewComponent] = useState('current');
  return (
    <div className="col-lg-6 col-12">
      {' '}
      <WhiteCard>
        {' '}
        <Tabs>
          <ul className="tabs">
            <li
              className={viewComponent === 'current' ? 'active' : ''}
              onClick={() => setViewComponent('current')}
              role="presentation">
              Product Catalog
            </li>
            <li role="presentation">Schedule</li>
          </ul>
        </Tabs>
        <>
          {viewComponent === 'current' ? (
            <>
              <div className="row mt-2 mb-2">
                <div className="col-6 pl-1 pr-1">
                  {' '}
                  <InputSearchWithRadius className="customer-list-header">
                    <input
                      className=" form-control search-filter"
                      placeholder="Search"
                    />

                    <img
                      src={SearchIcon}
                      alt="search"
                      className="search-input-icon"
                    />
                  </InputSearchWithRadius>
                </div>
                <div className="col-3 pl-1 pr-1">
                  {' '}
                  <DropDownSelect className=" w-100">
                    {' '}
                    <Select
                      classNamePrefix="react-select"
                      isClearable={false}
                      className="active"
                    />
                  </DropDownSelect>
                </div>
                <div className="col-3 pl-1 pr-1">
                  {' '}
                  <DropDownSelect>
                    {' '}
                    <Select
                      classNamePrefix="react-select"
                      isClearable={false}
                      className="active"
                    />
                  </DropDownSelect>
                </div>
              </div>

              <Table className="mt-0">
                <tr>
                  <th width="60%" className="product-catalog-header">
                    Product Name / ASIN / SKU
                  </th>
                  <th width="25%" className="product-catalog-header">
                    Status
                  </th>
                  <th width="15%" className="product-catalog-header">
                    {' '}
                    &nbsp;
                  </th>
                </tr>

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
                        <img className="product-image" src={Logo} alt="" />{' '}
                      </div>
                      <div className="product-data">
                        <div className="product-name">
                          Threadmill Home Linen Twin Blanket - 1 Piece
                          Herringbone Cotton Blanket
                        </div>
                        <div className="product-id">
                          B000000001 / 6291108300282 / 8 Variations
                        </div>
                      </div>
                    </td>
                    <td className="product-catalog-body">
                      <div className="status">
                        {' '}
                        <span className="bullet-point" />
                        <span className="status-text"> Optimized</span>
                      </div>
                    </td>
                    <td className="product-catalog-body">
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
                    </td>
                  </tr>
                </label>
                <label style={{ display: 'contents' }} htmlFor="2">
                  <tr width="100%">
                    <td className="product-catalog-body">
                      {' '}
                      <div className="product-catalog-image">
                        <input
                          className="check-box-product-list"
                          type="checkbox"
                          id="2"
                        />
                        <span className="checkmark" />
                        <img
                          className="product-image"
                          src={DefaultUser}
                          alt=""
                        />{' '}
                      </div>
                      <div className="product-data">
                        <div className="product-name">
                          Threadmill Home Linen Twin Blanket - 1
                        </div>
                        <div className="product-id">
                          B000000001 / 6291108300282 / 8 Variations
                        </div>
                      </div>
                    </td>
                    <td className="product-catalog-body">
                      <div className="status un-optimized scheduled assets-received">
                        {' '}
                        <span className="bullet-point gray light-yellow light-blue" />
                        <span className="status-text"> Assets Received </span>
                      </div>
                    </td>
                    <td className="product-catalog-body">
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
                    </td>
                  </tr>
                </label>
              </Table>
            </>
          ) : (
            ''
          )}
        </>
      </WhiteCard>
    </div>
  );
}
