import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import { Collapse } from 'react-collapse';
import Theme from '../../theme/Theme';
import { Button, WhiteCard } from '../../common';
import {
  CaretUp,
  ClockIcon,
  FileContract,
  RecurringIcon,
  DspOnlyIcon,
  ServiceIcon,
} from '../../theme/images';
import { PATH_AGREEMENT } from '../../constants';
import PastAgreement from './PastAgreement';

export default function AgreementDetails({ agreements, id }) {
  const [viewComponent, setViewComponent] = useState('current');
  const [openCollapse, setOpenCollapse] = useState([]);
  const multipleAgreement = useSelector(
    (state) => state.accountState.multipleAgreement,
  );

  const agreementOptions = [
    { key: 'monthly_retainer', label: 'Monthly Retainer' },
    { key: 'rev_share', label: 'Rev Share' },
    { key: 'sales_threshold', label: 'Sales Threshold' },
    { key: 'billing_cap', label: 'Billing Cap' },
  ];

  useEffect(() => {
    if (multipleAgreement && multipleAgreement[0]) {
      setOpenCollapse([{ [multipleAgreement[0].id]: true }]);
    }
  }, [multipleAgreement]);

  const countDays = (value) => {
    const date1 = new Date();
    const date2 = new Date(value);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const generateHTML = () => {
    const fields = [];
    for (const agreement of multipleAgreement) {
      if (
        agreement &&
        agreement.contract_status &&
        agreement.contract_status.value !== 'inactive'
      )
        fields.push(
          <WhiteCard className="mt-3 mb-3" key={agreement.id}>
            <div className="row">
              <div className="col-lg-9 col-md-8 col-12">
                <img
                  width="48px"
                  className="solid-icon  "
                  src={
                    (agreement && agreement.contract_type === 'One Time') ||
                    (agreement && agreement.contract_type === 'one time') ||
                    (agreement && agreement.contract_type === 'One time')
                      ? ServiceIcon
                      : agreement && agreement.contract_type === 'dsp only'
                      ? DspOnlyIcon
                      : RecurringIcon
                  }
                  alt=""
                />
                <p className="black-heading-title mt-0 mb-0">
                  {(agreement && agreement.contract_type === 'One Time') ||
                  (agreement && agreement.contract_type === 'one time')
                    ? 'One Time Services Contract'
                    : agreement && agreement.contract_type === 'dsp only'
                    ? 'DSP Only Services Contract'
                    : 'Recurring Contract'}
                </p>

                <ul className="recurring-contact ">
                  <li>
                    <p className="basic-text ">
                      {agreement &&
                        agreement.length &&
                        agreement.length.label &&
                        agreement.length.label.slice(0, -1)}{' '}
                      contract
                    </p>
                  </li>
                  {agreement && agreement.end_date ? (
                    <li>
                      <p className="basic-text ">
                        Expires:{' '}
                        {dayjs(agreement.end_date).format('MMM DD, YYYY')}
                      </p>
                    </li>
                  ) : (
                    ''
                  )}
                  {agreement &&
                  agreement.end_date &&
                  countDays(agreement && agreement.end_date) <= 90 ? (
                    <li>
                      <div className="days-block">
                        {' '}
                        <img
                          className="clock-icon"
                          src={ClockIcon}
                          alt="clock"
                        />{' '}
                        {countDays(agreement && agreement.end_date)} days
                      </div>
                    </li>
                  ) : (
                    ''
                  )}
                </ul>
              </div>

              <div className="clear-fix" />
              {agreement &&
              agreement.contract_status &&
              (agreement.contract_status.value === 'pending account setup' ||
                agreement.contract_status.value === 'active') &&
              agreement.contract_url === null ? null : (
                <div
                  className="col-lg-3 col-md-4 col-12 text-right"
                  role="presentation"
                  onClick={() =>
                    localStorage.setItem('agreementID', agreement.id)
                  }>
                  <Link
                    to={{
                      pathname: PATH_AGREEMENT.replace(':id', id).replace(
                        ':contract_id',
                        agreement.id,
                      ),
                    }}>
                    <Button className="btn-transparent w-100 view-contract">
                      {' '}
                      <img
                        className="file-contract-icon"
                        src={FileContract}
                        alt=""
                      />
                      View Contract
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            <span
              className="cursor"
              onClick={() =>
                setOpenCollapse([
                  {
                    [agreement.id]: !openCollapse.find(
                      (op) => op[agreement.id],
                    ),
                  },
                ])
              }
              role="presentation">
              <div className="straight-line horizontal-line pt-3 mb-3" />
              <div className="text-center">
                <img
                  width="26px"
                  className="cursor"
                  src={CaretUp}
                  style={{
                    transform: openCollapse.find((op) => op[agreement.id])
                      ? 'rotate(180deg)'
                      : '',
                    width: '25px',
                    height: '25px',
                  }}
                  alt=""
                />
              </div>
            </span>
            <CustomerDetailCoppase>
              <Collapse isOpened={openCollapse.find((op) => op[agreement.id])}>
                <ul className="monthly-retainer">
                  {agreementOptions.map((item) => (
                    <li key={item.key}>
                      <div className="label">{item.label}</div>
                      {agreement && agreement[item.key] ? (
                        <NumberFormat
                          displayType="text"
                          value={
                            agreement[item.key].label || agreement[item.key]
                          }
                          thousandSeparator
                          prefix={item.key === 'rev_share' ? '' : '$'}
                          suffix={item.key === 'rev_share' ? '%' : ''}
                        />
                      ) : (
                        '0'
                      )}
                    </li>
                  ))}
                </ul>
                <div className="straight-line horizontal-line pt-3 mb-3" />
                {agreement && agreement.contract_type === 'recurring' ? (
                  <>
                    <div className="label">Marketplaces</div>
                    <ul className="selected-list">
                      {agreement &&
                      agreement.primary_marketplace === null &&
                      agreement.additional_marketplaces === null
                        ? 'No Marketplaces added.'
                        : ''}
                      {agreement && agreement.primary_marketplace ? (
                        <li>{agreement.primary_marketplace.name} (Primary)</li>
                      ) : (
                        ''
                      )}
                      {agreement && agreement.additional_marketplaces
                        ? agreement.additional_marketplaces.map((item) => (
                            <li key={item.id}>
                              {item.name || ''}{' '}
                              {item.is_primary ? '(Primary)' : ''}
                            </li>
                          ))
                        : ''}
                    </ul>
                    <div className="label mt-3">
                      Additional Monthly Services
                    </div>
                    <ul className="selected-list">
                      {agreement && agreement.additional_monthly_services
                        ? agreement.additional_monthly_services.map((item) => (
                            <li key={item.id}>
                              {(item && item.service && item.service.name) ||
                                ''}
                            </li>
                          ))
                        : 'No Additional Monthly services added.'}
                    </ul>
                    <div className="straight-line horizontal-line pt-3 mb-3" />
                  </>
                ) : (
                  ''
                )}

                {agreement && agreement.contract_type === 'dsp only' ? (
                  ''
                ) : (
                  <>
                    <div className="label">One Time Services</div>
                    <ul className="selected-list">
                      {agreement && agreement.additional_one_time_services
                        ? agreement.additional_one_time_services.map((item) => (
                            <li key={item.id}>
                              {(item && item.service && item.service.name) ||
                                ''}{' '}
                              ({(item && item.quantity) || ''})
                            </li>
                          ))
                        : 'No One Time services added.'}
                    </ul>
                  </>
                )}
              </Collapse>
            </CustomerDetailCoppase>
          </WhiteCard>,
        );
    }

    return fields && fields.length === 0 ? (
      <WhiteCard className="text-center">No Agreements Found.</WhiteCard>
    ) : (
      fields
    );
  };

  return (
    <>
      <div className="col-lg-8 col-12">
        <Tab>
          <ul className="tabs">
            <li
              className={viewComponent === 'current' ? 'active' : ''}
              onClick={() => setViewComponent('current')}
              role="presentation">
              Active Agreements
            </li>
            <li
              className={viewComponent === 'past' ? 'active' : ''}
              onClick={() => setViewComponent('past')}
              role="presentation">
              Past Agreements
            </li>
          </ul>
        </Tab>
        {viewComponent === 'current' ? (
          <>{generateHTML()}</>
        ) : (
          <PastAgreement agreement={agreements} id={id} />
        )}
      </div>
    </>
  );
}

AgreementDetails.propTypes = {
  id: PropTypes.string.isRequired,
  agreements: PropTypes.shape({
    id: PropTypes.string,
    contract_type: PropTypes.string,
    length: PropTypes.shape({
      label: PropTypes.string,
    }),
    end_date: PropTypes.string,
    additional_marketplaces: PropTypes.arrayOf(PropTypes.object),
    additional_monthly_services: PropTypes.arrayOf(PropTypes.object),
    additional_one_time_services: PropTypes.arrayOf(PropTypes.object),
    primary_marketplace: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
};

const Tab = styled.div`
  .tabs {
    list-style-type: none;
    position: relative;
    text-align: left;
    margin: 0;
    padding: 0;
    border-bottom: 1px solid ${Theme.gray11};

    li {
      display: inline-block;
      margin-right: 60px;
      padding-bottom: 15px;
      font-weight: normal;
      color: ${Theme.black};
      font-size: ${Theme.extraMedium};
      font-family: ${Theme.baseFontFamily};
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      &.a {
        text-decoration: none;
      }

      &.active {
        padding-bottom: 16px;
        border-bottom: 2px solid ${Theme.orange};
        color: ${Theme.black};
        font-family: ${Theme.titleFontFamily};
      }
    }
  }
`;

const CustomerDetailCoppase = styled.div`
  .ReactCollapse--content {
    width: 100%;
  }
`;
