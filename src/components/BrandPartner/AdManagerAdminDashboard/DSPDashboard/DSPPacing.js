import React from 'react';

import styled from 'styled-components';
import { arrayOf, bool, func, objectOf, string } from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import { useHistory } from 'react-router-dom';

import Theme from '../../../../theme/Theme';
import { PageLoader, Status, Table, WhiteCard } from '../../../../common';
import { CompanyDefaultUser } from '../../../../theme/images';
import { TabletViewManager } from '../../../../theme/Global';
import {
  PATH_CUSTOMER_DETAILS,
  noGraphDataMessage,
  contributionColorSet,
} from '../../../../constants';

const DSPPacing = ({
  data,
  loader,
  currencySymbol,
  selectedOption,
  handleSpendingOptions,
  dspSpendData,
  month,
}) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const history = useHistory();

  const returnFromatNumber = (value, type) => {
    const decimalDigits = 2;
    if (value) {
      return `${type === 'currency' ? currencySymbol : ''}${value
        .toFixed(decimalDigits)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${
        type === 'percentage' ? '%' : ''
      }`;
    }
    return `${currencySymbol}0`;
  };

  const renderTablet = () => {
    return (
      <TabletViewManager className="d-lg-none d-md-block d-sm-block">
        <div className="container-fluid">
          <div className="row cursor">
            {data &&
              data.dsp_pacing &&
              data.dsp_pacing.map((itemData) => (
                <div className="col-md-6 col-12 mt-4" role="presentation">
                  {' '}
                  <img
                    className="company-logo"
                    src={
                      itemData && itemData.document
                        ? itemData.document
                        : CompanyDefaultUser
                    }
                    alt="logo"
                  />
                  <div className="company-name">{itemData.customer_name}</div>
                  <div className="status">{itemData.ad_manager}</div>
                  <div className="clear-fix" />
                  <div className=" straight-line horizontal-line pt-3 mb-3 " />
                  <div className="row">
                    <div className="col-6 pb-3">
                      {' '}
                      <div className="label">This Period</div>
                      <div className="label-info ">
                        {itemData && itemData.planned_spend_to_date
                          ? `${returnFromatNumber(
                              itemData.planned_spend_to_date,
                              'currency',
                            )}`
                          : `${currencySymbol}0`}
                      </div>
                    </div>
                    <div className="col-6 pb-3">
                      {' '}
                      <div className="label">Prev. Period</div>
                      <div className="label-info ">
                        {itemData && itemData.actual_spend_to_date
                          ? `${returnFromatNumber(
                              itemData.actual_spend_to_date,
                              'currency',
                            )}`
                          : `${currencySymbol}0`}
                      </div>
                    </div>
                    <div className="col-6 pb-3">
                      {' '}
                      <div className="label">Change</div>
                      {itemData && itemData.change_to_date ? (
                        <div className="decrease-rate large">
                          {itemData && itemData.change_to_date
                            ? `${returnFromatNumber(
                                Math.abs(itemData.change_to_date),
                                'currency',
                              )}`
                            : `${currencySymbol}0`}
                        </div>
                      ) : null}
                    </div>
                    <div className="col-6 pb-3">
                      {' '}
                      <div className="label">Contribution</div>
                      <Status
                        label={itemData.contribution_bracket}
                        backgroundColor={
                          contributionColorSet[itemData.contribution_bracket]
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </TabletViewManager>
    );
  };

  const renderTableHeader = () => {
    return (
      <tr>
        <th width="40%" className="product-header">
          Customer
        </th>
        <th width="20%" className="product-header">
          PLANNED
        </th>
        <th width="20%" className="product-header">
          {' '}
          ACTUAL
        </th>
        <th width="20%" className="product-header">
          {' '}
          {selectedOption === 'overspending' ? 'OVERSPEND' : 'UNDERSPEND'}
        </th>
        <th width="20%" className="product-header">
          Contribution
        </th>
      </tr>
    );
  };

  const renderTableData = (itemData) => {
    return (
      <tr
        className="cursor"
        onClick={() =>
          history.push(
            PATH_CUSTOMER_DETAILS.replace(':id', itemData.customer_id),
            'adManager',
          )
        }>
        <td className="product-body">
          {' '}
          <img
            className="company-logo"
            src={
              itemData && itemData.document
                ? itemData.document
                : CompanyDefaultUser
            }
            alt="logo"
          />
          <div className="company-info-details">
            <div className="company-name">{itemData.customer_name}</div>
            <div className="status">{itemData.ad_manager}</div>
          </div>
        </td>
        <td className="product-body">
          {' '}
          {returnFromatNumber(itemData.planned_spend_to_date, 'currency')}
        </td>
        <td className="product-body">
          {' '}
          {returnFromatNumber(itemData.actual_spend_to_date, 'currency')}
        </td>
        <td className="product-body">
          {' '}
          <div className="decrease-rate large">
            {returnFromatNumber(Math.abs(itemData.change_to_date), 'currency')}
          </div>
        </td>
        <td className="product-body">
          <Status
            label={itemData.contribution_bracket}
            backgroundColor={
              contributionColorSet[itemData.contribution_bracket]
            }
          />
        </td>
      </tr>
    );
  };

  const renderDesktopDSPPacingData = () => {
    return (
      <Table className="mt-0 d-md-none d-sm-none d-lg-block">
        {renderTableHeader()}
        {data && data.dsp_pacing ? (
          <tbody>{data.dsp_pacing.map((item) => renderTableData(item))}</tbody>
        ) : (
          <NoData>{noGraphDataMessage}</NoData>
        )}
      </Table>
    );
  };

  const renderDspPacingOptions = () => {
    const keyTabOptions = [
      {
        id: 'overspending',
        label: 'Overspending',
      },
      {
        id: 'underspending',
        label: 'Underspending',
      },
    ];

    return (
      <div className="days-container spending">
        <ul className="days-tab">
          {keyTabOptions.map((item) => (
            <li key={item.id}>
              {' '}
              <input
                className="d-none"
                type="radio"
                id={item.id}
                name="flexRadioDefault2"
                value={selectedOption}
                checked={item.id === selectedOption}
                onClick={() => handleSpendingOptions(item.id)}
              />
              <label htmlFor={item.id}>{item.label}</label>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Wrapper>
      <WhiteCard className="mb-3">
        <div className="row">
          <div className="col-12">
            <p className="black-heading-title mt-2 mb-0"> DSP Pacing</p>
            <p className="gray-normal-text mb-4 mt-1">
              Monthly Budget Pacing ({month}):
              <span style={{ cursor: 'auto' }} className="orange-text">
                {' '}
                <span style={{ textTransform: 'capitalize' }}>
                  {dspSpendData && dspSpendData.dsp_pacing_flag_all === 1
                    ? 'Overspending'
                    : dspSpendData && dspSpendData.dsp_pacing_flag_all === -1
                    ? 'Underspending'
                    : 'N/A'}
                </span>
              </span>
            </p>
          </div>
          <div className="straight-line horizontal-line mb-3" />
          <div className="col-md-8 col-sm-12 pr-0 mb-3">
            <ul className="dsp-spent-date">
              <li>
                <div className="label ">Planned Spend to date </div>
                <div className="label-range">
                  {!loader &&
                    dspSpendData &&
                    returnFromatNumber(
                      Math.abs(dspSpendData.planned_spend_to_date_all),
                      'currency',
                    )}
                  (
                  {!loader &&
                  dspSpendData &&
                  dspSpendData.planned_spend_to_date_percentage_all !== 'N/A'
                    ? returnFromatNumber(
                        dspSpendData.planned_spend_to_date_percentage_all,
                        'percentage',
                      )
                    : '0%'}
                  )
                </div>
              </li>
              <li>
                <div className="label ">Actual Spend to date </div>
                <div className="label-range">
                  {!loader &&
                    dspSpendData &&
                    returnFromatNumber(
                      Math.abs(dspSpendData.actual_spend_to_date_all),
                      'currency',
                    )}
                  (
                  {!loader &&
                  dspSpendData &&
                  dspSpendData.actual_spend_to_date_percentage_all !== 'N/A'
                    ? returnFromatNumber(
                        dspSpendData.actual_spend_to_date_percentage_all,
                        'percentage',
                      )
                    : '0%'}
                  )
                </div>
              </li>
              <li>
                <div className="label ">
                  {dspSpendData && dspSpendData.dsp_pacing_flag_all === 1
                    ? 'Overspend'
                    : 'Underspend'}{' '}
                  to date
                </div>
                <div className="label-range red-range">
                  {!loader &&
                    dspSpendData &&
                    returnFromatNumber(
                      Math.abs(dspSpendData.change_to_date_all),
                      'currency',
                    )}
                  (
                  {!loader &&
                  dspSpendData &&
                  dspSpendData.change_to_date_percentage_all !== 'N/A'
                    ? returnFromatNumber(
                        dspSpendData.change_to_date_percentage_all,
                        'percentage',
                      )
                    : '0%'}
                  )
                </div>
              </li>
            </ul>
          </div>
          <div className="col-md-4 col-sm-12 pl-0 mt-2 mb-3">
            {renderDspPacingOptions()}
          </div>
          <div className="straight-line horizontal-line " />
        </div>
        {loader ? (
          <PageLoader
            component="performance-graph"
            color={Theme.orange}
            type="detail"
            width={40}
            height={40}
          />
        ) : data && data.dsp_pacing && data.dsp_pacing.length > 0 ? (
          isDesktop ? (
            renderDesktopDSPPacingData()
          ) : (
            renderTablet()
          )
        ) : (
          <NoData>{noGraphDataMessage}</NoData>
        )}
      </WhiteCard>
    </Wrapper>
  );
};

export default DSPPacing;

DSPPacing.defaultProps = {
  data: null,
  currencySymbol: '',
  handleSpendingOptions: () => {},
  selectedOption: 'overSpending',
  dspSpendData: null,
};

DSPPacing.propTypes = {
  data: arrayOf(Array),
  loader: bool.isRequired,
  currencySymbol: string,
  handleSpendingOptions: func,
  selectedOption: string,
  dspSpendData: objectOf(Object),
  month: string.isRequired,
};

const Wrapper = styled.div`
  .statusContainer {
    margin-top: 0px !important;
    padding: 5px 30px !important;
  }
`;
const NoData = styled.div`
  margin: 3em;
  text-align: center;
`;
