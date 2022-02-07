import React from 'react';
import {
  Status,
  ToggleButton,
  WhiteCard,
  Table,
  TableMobileView,
} from '../../common';
import { ArrowDownIcon, ArrowUpIcon } from '../../theme/images';

export default function BBEGoalRevShareContribution() {
  return (
    <>
      <WhiteCard className="mt-3 d-md-block d-none">
        <div className="row">
          <div className="col-md-8 col-12">
            <div className="black-heading-title text-bold mt-2 ">
              REV SHARE CONTRIBUTION
            </div>
          </div>
          <div className="col-md-4 col-12">
            <ToggleButton>
              <div className="days-container spending">
                <ul className="days-tab">
                  <li>
                    {' '}
                    <input className="d-none" type="radio" />
                    <label htmlFor="positive">Positive</label>
                  </li>
                  <li>
                    {' '}
                    <input className="d-none" type="radio" />
                    <label htmlFor="negative">Negative</label>
                  </li>
                </ul>
              </div>
            </ToggleButton>
          </div>
        </div>
        <div className="horizontal-line straight-line mt-3 mb-1" />
        <Table>
          <thead>
            <tr>
              <th width="25%" className="product-header">
                Customer
              </th>
              <th width="15%" className="product-header">
                December
              </th>
              <th width="15%" className="product-header">
                january
              </th>
              <th width="15%" className="product-header">
                Change
              </th>
              <th width="15%" className="product-header">
                Contribution
              </th>
              <th width="15%" className="product-header text-right pr-2">
                {' '}
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="product-body">
                {' '}
                <div className="company-name">TRX Training</div>
                <div className="status">Gabriella Neske</div>
              </td>
              <td className="product-table-body">$52,350.00</td>
              <td className="product-table-body ">$52,350.00</td>
              <td className="product-table-body ">$52,350.00</td>
              <td className="product-table-body ">
                <div className="decrease-rate">
                  {' '}
                  <img
                    className="red-arrow"
                    src={ArrowDownIcon}
                    alt="arrow-up"
                  />
                  21.47%
                </div>
              </td>
              <td className="product-table-body text-right">
                <Status
                  className="float-right"
                  label="High"
                  // backgroundColor={StatusColorSet[item.status]}
                />
                <div className="clear-fix" />
              </td>
            </tr>
            <tr>
              <td className="product-body">
                {' '}
                <div className="company-name">TRX Training</div>
                <div className="status">Gabriella Neske</div>
              </td>
              <td className="product-table-body">$52,350.00</td>
              <td className="product-table-body ">$52,350.00</td>
              <td className="product-table-body ">$52,350.00</td>
              <td className="product-table-body ">
                <div className="increase-rate">
                  {' '}
                  <img
                    className="green-arrow"
                    src={ArrowUpIcon}
                    alt="arrow-up"
                  />
                  21.47%
                </div>
              </td>
              <td className="product-table-body text-right">
                <Status
                  className="float-right"
                  label="High"
                  // backgroundColor={StatusColorSet[item.status]}
                />
                <div className="clear-fix" />
              </td>
            </tr>
          </tbody>
        </Table>
      </WhiteCard>
      <div className="d-md-none d-block">
        <div className="row mt-3 mb-1">
          <div className="col-md-8 col-12">
            <div className="black-heading-title text-bold mt-2 ">
              REV SHARE CONTRIBUTION
            </div>
          </div>
          <div className="col-md-4 col-12 mt-3 mb-3">
            <ToggleButton>
              <div className="days-container toggle-container ">
                <ul className="days-tab">
                  <li>
                    {' '}
                    <input className="d-none" type="radio" />
                    <label htmlFor="positive">Positive</label>
                  </li>
                  <li>
                    {' '}
                    <input className="d-none" type="radio" />
                    <label htmlFor="negative">Positive</label>
                  </li>
                </ul>
              </div>
            </ToggleButton>
          </div>
        </div>
        <TableMobileView
          invoiceType="  Customer"
          invoiceId=" December"
          label="December"
          labelInfo="hhhh"
          label1="January"
          labelInfo1="jjj"
          label2="Change"
          labelInfo2="jjj"
          status="high"
          // statusColor="#e3f2d2"
        />
      </div>
    </>
  );
}

BBEGoalRevShareContribution.defaultProps = {};
BBEGoalRevShareContribution.propTypes = {};
