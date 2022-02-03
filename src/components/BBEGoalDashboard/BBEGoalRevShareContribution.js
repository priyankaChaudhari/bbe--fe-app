import React from 'react';
import { Status, ToggleButton, WhiteCard, Table } from '../../common';
import { ArrowDownIcon, ArrowUpIcon } from '../../theme/images';

export default function BBEGoalRevShareContribution() {
  return (
    <WhiteCard className="mt-3">
      <div className="row">
        <div className="col-8">
          <div className="black-heading-title text-bold mt-2 ">
            REV SHARE CONTRIBUTION
          </div>
        </div>
        <div className="col-4">
          <ToggleButton>
            <div className="days-container spending">
              <ul className="days-tab">
                <li>
                  {' '}
                  <input className="d-none" type="radio" />
                  {/* <label>Positive</label> */}
                </li>
                <li>
                  {' '}
                  <input className="d-none" type="radio" />
                  {/* <label>Negative</label> */}
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
                <img className="red-arrow" src={ArrowDownIcon} alt="arrow-up" />
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
                <img className="green-arrow" src={ArrowUpIcon} alt="arrow-up" />
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
  );
}

BBEGoalRevShareContribution.defaultProps = {};
BBEGoalRevShareContribution.propTypes = {};
