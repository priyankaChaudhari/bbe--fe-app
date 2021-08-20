import React from 'react';

import styled from 'styled-components';
import { arrayOf, bool, func, objectOf, string } from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import { useHistory } from 'react-router-dom';

import Theme from '../../../../theme/Theme';
import { PageLoader, Status, Table, WhiteCard } from '../../../../common';
import { CompanyDefaultUser } from '../../../../theme/images';
import { TabletViewManager } from '../../../../theme/Global';
import { noGraphDataMessage } from '../../../../constants/CompanyPerformanceConstants';
import { contributionColorSet } from '../../../../constants/AdManagerAdminDashboardConstants';
import { PATH_CUSTOMER_DETAILS } from '../../../../constants';

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
                          ? `${currencySymbol}${itemData.planned_spend_to_date
                              .toFixed(2)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                          : `${currencySymbol}0`}
                      </div>
                    </div>
                    <div className="col-6 pb-3">
                      {' '}
                      <div className="label">Prev. Period</div>
                      <div className="label-info ">
                        {itemData && itemData.actual_spend_to_date
                          ? `${currencySymbol}${itemData.actual_spend_to_date
                              .toFixed(2)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                          : `${currencySymbol}0`}
                      </div>
                    </div>
                    <div className="col-6 pb-3">
                      {' '}
                      <div className="label">Change</div>
                      {itemData && itemData.change_to_date ? (
                        <div className="decrease-rate large">
                          {itemData && itemData.change_to_date
                            ? `${currencySymbol}${Number(
                                itemData.change_to_date
                                  .toString()
                                  .split('-')[1],
                              )
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
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
          This Period
        </th>
        <th width="20%" className="product-header">
          {' '}
          Prev. Period
        </th>
        <th width="20%" className="product-header">
          {' '}
          Change
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
          <div className="company-name">{itemData.customer_name}</div>
          <div className="status">{itemData.ad_manager}</div>
        </td>
        <td className="product-body">
          {' '}
          {itemData && itemData.planned_spend_to_date
            ? `${currencySymbol}${itemData.planned_spend_to_date
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                .replace('-', '')}`
            : `${currencySymbol}0`}
        </td>
        <td className="product-body">
          {' '}
          {itemData && itemData.actual_spend_to_date
            ? `${currencySymbol}${itemData.actual_spend_to_date
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                .replace('-', '')}`
            : `${currencySymbol}0`}
        </td>
        <td className="product-body">
          {' '}
          {itemData && itemData.change_to_date ? (
            <div className="decrease-rate large">
              {itemData && itemData.change_to_date
                ? `${currencySymbol}${itemData.change_to_date
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    .replace('-', '')}`
                : `${currencySymbol}0`}
            </div>
          ) : null}
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
                  {selectedOption}
                </span>
              </span>
            </p>
          </div>
          <div className="straight-line horizontal-line mb-3" />
          <div className="col-md-8 col-sm-12 pr-0 mb-3">
            <ul className="dsp-spent-date">
              <li>
                <div className="label ">Planned Spend to date</div>
                <div className="label-range">
                  {' '}
                  {!loader &&
                  dspSpendData &&
                  dspSpendData.planned_spend_to_date_all
                    ? `${currencySymbol}${dspSpendData.planned_spend_to_date_all
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                    : `${currencySymbol}0`}{' '}
                  (
                  {!loader &&
                  dspSpendData &&
                  dspSpendData.planned_spend_to_date_percentage_all !== 'N/A'
                    ? dspSpendData.planned_spend_to_date_percentage_all
                        .toFixed(2)
                        .toString()
                        .replace('-', '')
                    : '0'}
                  %)
                </div>
              </li>
              <li>
                <div className="label ">Actual Spend to date</div>
                <div className="label-range">
                  {!loader &&
                  dspSpendData &&
                  dspSpendData.actual_spend_to_date_all
                    ? `${currencySymbol}${dspSpendData.actual_spend_to_date_all
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                    : `${currencySymbol}0`}{' '}
                  (
                  {!loader &&
                  dspSpendData &&
                  dspSpendData.actual_spend_to_date_percentage_all !== 'N/A'
                    ? dspSpendData.actual_spend_to_date_percentage_all
                        .toFixed(2)
                        .toString()
                        .replace('-', '')
                    : '0'}
                  %)
                </div>
              </li>
              <li>
                {' '}
                <div className="label ">Overspend to date</div>
                <div className="label-range red-range">
                  {!loader && dspSpendData && dspSpendData.change_to_date_all
                    ? `${currencySymbol}${dspSpendData.change_to_date_all
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                    : `${currencySymbol}0`}{' '}
                  (
                  {!loader &&
                  dspSpendData &&
                  dspSpendData.change_to_date_percentage_all !== 'N/A'
                    ? dspSpendData.change_to_date_percentage_all
                        .toFixed(2)
                        .toString()
                        .replace('-', '')
                    : '0'}
                  %)
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
        ) : data && data.dsp_pacing ? (
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
