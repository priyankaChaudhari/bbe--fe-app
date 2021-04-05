/* eslint-disable react/no-danger */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import dayjs from 'dayjs';

export default function ServicesAmendment({ formData, details, templateData }) {
  const mapDefaultValues = (key, label, type) => {
    if (key === 'contract_company_name') {
      return details && details[key]
        ? details && details[key]
        : `Enter ${label}.`;
    }
    if (key === 'length') {
      return details && details.length.label;
    }
    if (key === 'primary_marketplace') {
      return (
        details &&
        details.primary_marketplace &&
        details.primary_marketplace.name
      );
    }
    if (key === 'start_date') {
      return details && dayjs(details[key]).format('MM-DD-YYYY');
    }
    if (key === 'current_date') {
      return dayjs(Date()).format('MM-DD-YYYY');
    }

    if (type && type.includes('number')) {
      return `${type === 'number-currency' ? '$' : '%'} ${
        details && details[key]
          ? details[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : ''
      }`;
    }
    return key === 'rev_share' || key === 'seller_type'
      ? details && details[key] && details[key].label
      : details && details[key];
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

  const mapMonthlyServices = (key) => {
    const fields = [];
    if (key !== 'additional_one_time_services') {
      if (details && details[key]) {
        for (const item of details[key]) {
          if (
            (item.service && item.service.name !== undefined) ||
            item.name !== undefined
          ) {
            if (
              item.service.name !== 'DSP Advertising' &&
              item.service.name !== 'Inventory Reconciliation'
            ) {
              fields.push(
                `<tr>
                <td style="border: 1px solid black;padding: 13px;">${
                  item.service ? item.service.name : item && item.name
                }</td>
                <td style="border: 1px solid black;padding: 13px;">$ ${
                  item.service
                    ? item.service.fee
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : item.fee
                    ? item.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : ''
                } /month
                </td>
                </tr>`,
              );
            }
          }
        }
      }
    } else if (formData && formData.additional_one_time_services) {
      formData.additional_one_time_services.forEach((service) => {
        return fields.push(
          `<tr>
                  <td style="border: 1px solid black;padding: 13px;">${
                    service.quantity
                      ? service.quantity
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      : 0
                  }</td>
                  
                   <td style="border: 1px solid black;padding: 13px;">${
                     service.service && service.service.name
                       ? service.service.name
                       : ''
                   }
      </td>
      ${
        service.service && service.service.fee
          ? `<td style="border: 1px solid black;padding: 13px;">$ ${(service.service &&
            service.service.fee &&
            service.service.name !== 'Amazon Store Package Custom'
              ? service.service.fee
              : service.custom_amazon_store_price
              ? service.custom_amazon_store_price
              : ''
            )
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </td>
        `
          : `<td>Yet to save</td>`
      }

      ${
        service.service.name !== 'Amazon Store Package Custom'
          ? service.quantity && service.service && service.service.fee
            ? `<td style="border: 1px solid black;padding: 13px;">$ ${(service.quantity &&
              service.service &&
              service.service.fee
                ? service.quantity * service.service.fee
                : ''
              )
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </td>`
            : `<td>Yet to save</td>`
          : service.quantity && service.custom_amazon_store_price
          ? `<td style="border: 1px solid black;padding: 13px;">$ ${(service.quantity &&
            service.custom_amazon_store_price
              ? service.quantity * service.custom_amazon_store_price
              : ''
            )
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </td>`
          : `<td>Yet to save</td>`
      }
         
                  
                  </tr>`,
        );
      });
    }
    return fields.length ? fields.toString().replaceAll(',', '') : '';
  };

  const showOneTimeServiceTable = () => {
    if (
      (details &&
        details.additional_one_time_services &&
        details.additional_one_time_services.length) ||
      (formData &&
        formData.additional_one_time_services &&
        formData.additional_one_time_services.length)
    ) {
      return `<table class="contact-list "><tr><th>Quantity</th><th>Service</th><th>Service Fee</th><th>Total Service Fee</th></tr>${mapMonthlyServices(
        'additional_one_time_services',
        'One Time Services',
      )}<tr><td class="total-service" colspan="3"> Total</td><td class="total-service text-right">${mapServiceTotal(
        'additional_one_time_services',
      )}
                              </td></tr>
                                </table>`;
    }
    return '';
  };

  return (
    <div>
      <Paragraph>
        <p
          className="long-text"
          dangerouslySetInnerHTML={{
            __html:
              templateData.amendment &&
              templateData.amendment[0]
                .replace(
                  'CUSTOMER_NAME',
                  mapDefaultValues('contract_company_name', 'Customer Name'),
                )
                .replace(
                  'START_DATE',
                  mapDefaultValues('start_date', 'Start Date'),
                )
                .replace('ONE_TIME_SERVICE_TABLE', showOneTimeServiceTable()),
          }}
        />
        <p
          className="long-text"
          dangerouslySetInnerHTML={{
            __html:
              templateData.amendment &&
              templateData.amendment[1]
                .replace(
                  'CUSTOMER_NAME',
                  mapDefaultValues('contract_company_name', 'Customer Name'),
                )
                .replace(
                  'AGREEMENT_DATE',
                  mapDefaultValues('start_date', 'Start Date'),
                )
                .replace(
                  'BBE_DATE',
                  mapDefaultValues('current_date', 'Current Date'),
                ),
          }}
        />
      </Paragraph>

      {/* <AgreementSidePanel id={id} /> */}
    </div>
  );
}

ServicesAmendment.defaultProps = {
  details: {},
  formData: {},
  templateData: {},
};

ServicesAmendment.propTypes = {
  formData: PropTypes.shape({
    additional_one_time_services: PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.string,
      }),
    ),
  }),
  details: PropTypes.shape({
    length: PropTypes.string,
    primary_marketplace: PropTypes.shape({
      fee: PropTypes.number,
      name: PropTypes.string,
      id: PropTypes.string,
    }),
    total_fee: PropTypes.shape({
      onetime_service: PropTypes.number,
      additional_marketplaces: PropTypes.number,
      monthly_service: PropTypes.number,
    }),
    additional_one_time_services: PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.string,
      }),
    ),
  }),
  templateData: PropTypes.shape({
    amendment: PropTypes.arrayOf(PropTypes.string),
  }),
};

const Paragraph = styled.div`
  .summary {
    margin: 0;
    li {
      margin-top: 10px;
    }
  }

  .contact-list table,
  td,
  th {
    border: 1px solid black;
    padding: 13px;
  }
  tr {
    .total-service {
      font-weight: 800;
    }
    th {
      text-align: left;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }
  .refer-agreement {
    border-bottom: 1px solid black;
    font-weight: 400;
    padding: 6px 0;
    margin-left: 35px;

    .label {
      font-weight: 800;
    }
  }
`;
