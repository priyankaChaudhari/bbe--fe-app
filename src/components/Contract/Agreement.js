/* eslint-disable react/no-danger */

import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

export default function Agreement({ formData, details, templateData }) {
  const mapDefaultValues = (key, label) => {
    // if (formData[key] === undefined || formData[key] === '') {
    //   if (key === 'contract_company_name') {
    //     return details && details[key]
    //       ? details && details[key]
    //       : `Enter ${label}.`;
    //   }
    //   if (key === 'length') {
    //     return details && details.length.label;
    //   }
    //   if (key === 'start_date') {
    //     return details && dayjs(details[key]).format('MM-DD-YYYY');
    //   }
    //   if (key === 'current_date') {
    //     return dayjs(Date()).format('MM-DD-YYYY');
    //   }
    //   return details && details[key];
    // }
    if (formData[key] === undefined || formData[key] === '') {
      return `Enter ${label}`;
    }

    if (key === 'contract_company_name') {
      return formData && formData[key]
        ? formData && formData[key]
        : `Enter ${label}`;
    }
    if (key === 'length') {
      return formData && formData.length.label
        ? formData.length.label
        : formData.length;
    }
    if (key === 'start_date') {
      return formData && dayjs(formData[key]).format('MM-DD-YYYY');
    }
    if (key === 'current_date') {
      return dayjs(Date()).format('MM-DD-YYYY');
    }
    return formData[key];
  };

  const getAgreementAccorType = (index) => {
    if (details && details.contract_type === 'one time') {
      return (
        templateData &&
        templateData.one_time_service_agreement &&
        templateData.one_time_service_agreement[index]
      );
    }
    return (
      templateData &&
      templateData.recurring_service_agreement &&
      templateData.recurring_service_agreement[index]
    );
  };
  const mapMonthlyServices = (key) => {
    if (details && details[key]) {
      const fields = [];
      for (const item of details[key]) {
        if (key !== 'additional_one_time_services') {
          if (
            (item.service && item.service.name !== undefined) ||
            item.name !== undefined
          ) {
            fields.push(
              `<tr>
            <td>${
              item.service ? item.service.name : item && item.name
            }</td><td>$ ${
                item.service
                  ? item.service.fee
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : item.fee
                  ? item.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : ''
              } /month</td></tr>`,
            );
          }
        } else {
          fields.push(
            `<tr>
                <td style="border: 1px solid black;
    padding: 13px;">${
      item && item.quantity
        ? item.quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        : 0
    }</td>
            <td style="border: 1px solid black;
    padding: 13px;">${
      item.service ? item.service.name : item && item.name
    }</td><td style="border: 1px solid black;
    padding: 13px;">$ ${
      item.service
        ? item.service.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        : item.fee
        ? item.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        : ''
    } /month</td>
            <td style="border: 1px solid black;
    padding: 13px;">$ ${(
      item.quantity * item &&
      item.service &&
      item.service.fee
    )
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            </tr>`,
          );
        }
      }
      return fields.length ? fields.toString().replaceAll(',', '') : '';
    }
    return '';
  };

  const mapServiceTotal = (key) => {
    if (key === 'additional_one_time_services') {
      return `$ ${
        details && details.total_fee.onetime_service
          ? details.total_fee.onetime_service
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : 0
      }`;
    }
    const market = details.total_fee.additional_marketplaces
      ? details.total_fee.additional_marketplaces
      : 0;
    const month = details.total_fee.monthly_service
      ? details.total_fee.monthly_service
      : 0;
    return `$ ${(market + month)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };
  const mapThadSignImg = () => {
    const data = `<p style="margin:0" class="long-text">
        <span style="font-weight: 300;font-family: Helvetica-Regular;">
          <img
            style="width:120px; margin-top: -5px;"
            src = '/static/media/Digital-Sig.633ece57.png'
            alt="sig"
          />
        </span>
      </p>`;
    return data;
  };
  return (
    <>
      <Paragraph>
        <p className="mb-4 long-text ">
          <div
            dangerouslySetInnerHTML={{
              __html: getAgreementAccorType(0)
                .replace(
                  'CUSTOMER_NAME',
                  mapDefaultValues('contract_company_name', 'Customer Name'),
                )
                .replace(
                  'START_DATE',
                  mapDefaultValues('start_date', 'Start Date'),
                )
                .replace(
                  'CUSTOMER_ADDRESS',
                  mapDefaultValues('address', 'Address'),
                )
                .replace('CUSTOMER_CITY', mapDefaultValues('city', 'City'))
                .replace('CUSTOMER_STATE', mapDefaultValues('state', 'State'))
                .replace(
                  'CUSTOMER_POSTAL',
                  mapDefaultValues('zip_code', 'Postal Code'),
                )
                .replace(
                  'AGREEMENT_LENGTH',
                  mapDefaultValues('length', 'Contract Length'),
                )
                .replace(
                  'ONE_TIME_SERVICE_TABLE',
                  `<table class="contact-list " style="width: 100%;
                              border-collapse: collapse;"><tr><th style="text-align: left; border: 1px solid black;
                              padding: 13px;">Quantity</th><th style="text-align: left; border: 1px solid black;
                              padding: 13px;">Service</th><th style="text-align: left; border: 1px solid black;
                              padding: 13px;">Service Fee</th><th style="text-align: left; border: 1px solid black;
                              padding: 13px;">Total Service Fee</th></tr>${mapMonthlyServices(
                                'additional_one_time_services',
                                'One Time Services',
                              )}<tr><td class="total-service" colspan="3" style="border: 1px solid black;
                              padding: 13px; font-weight: 800;"> Total</td><td class="total-service text-right" style="border: 1px solid black;
                              padding: 13px; font-weight: 800;">${mapServiceTotal(
                                'additional_one_time_services',
                              )}
                              </td></tr>
                                </table>`,
                )
                .replace(
                  'ADDITIONAL_ONE_TIME_SERVICES_TOTAL',
                  `${mapServiceTotal('additional_one_time_services')}`,
                ),
            }}
          />
        </p>
        <p
          className="long-text"
          dangerouslySetInnerHTML={{
            __html: getAgreementAccorType(1)
              .replace(
                'CUSTOMER_NAME',
                mapDefaultValues('contract_company_name', 'Customer Name'),
              )
              .replace(
                'AGREEMENT_DATE',
                mapDefaultValues('start_date', 'Start Date'),
              )
              .replace(
                'CUSTOMER_ADDRESS',
                mapDefaultValues('address', 'Address'),
              )
              .replace('CUSTOMER_CITY', mapDefaultValues('city', 'City'))
              .replace('CUSTOMER_STATE', mapDefaultValues('state', 'State'))
              .replace(
                'CUSTOMER_POSTAL',
                mapDefaultValues('zip_code', 'Postal Code'),
              )
              .replace(
                'BBE_DATE',
                mapDefaultValues('current_date', 'Current Date'),
              )
              .replace('THAD_SIGN', mapThadSignImg()),
          }}
        />
      </Paragraph>
    </>
  );
}

Agreement.defaultProps = {
  formData: {},
  details: {},
  templateData: {},
};

Agreement.propTypes = {
  details: PropTypes.shape({
    length: PropTypes.shape({ label: PropTypes.string }),
    contract_type: PropTypes.string,
    total_fee: PropTypes.shape({
      additional_marketplaces: PropTypes.number,
      monthly_service: PropTypes.number,
      onetime_service: PropTypes.number,
    }),
    primary_marketplace: PropTypes.shape({
      fee: PropTypes.number,
      name: PropTypes.string,
      id: PropTypes.string,
    }),
    additional_marketplaces: PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.shape({
          name: PropTypes.string,
          fee: PropTypes.number,
        }),
      }),
    ),
    additional_one_time_services: PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.shape({
          name: PropTypes.string,
          fee: PropTypes.number,
        }),
      }),
    ),
    additional_monthly_services: PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.shape({
          name: PropTypes.string,
          fee: PropTypes.number,
        }),
      }),
    ),
  }),
  formData: PropTypes.shape({
    length: PropTypes.string,
    sales_threshold: PropTypes.string,
  }),
  templateData: PropTypes.shape({
    addendum: PropTypes.arrayOf(PropTypes.shape(PropTypes.string)),
    statement_of_work: PropTypes.string,
    one_time_service_agreement: PropTypes.arrayOf(PropTypes.string),
    recurring_service_agreement: PropTypes.arrayOf(PropTypes.string),
  }),
};

const Paragraph = styled.div`
  .first-sub-category {
    margin: 0;
    padding-inline-start: 30px;
    li {
      margin-bottom: 17px;
      padding-left: 5px;
    }
  }
  &.testing {
    color: red !important;
  }
`;
