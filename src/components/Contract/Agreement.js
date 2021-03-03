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
    // console.log( formData['city'] , formData['address'], formData['state'], formData['zip_code'], formData)
    //     if (
    //       (formData['city'] === '') &&
    //       (  formData['address'] === '') &&
    //       ( formData['state'] === '') &&
    //       ( formData['zip_code'] === '')
    //     ) {
    //       return 'Enter Location';
    //     }

    if (key === 'contract_company_name') {
      return formData && formData[key]
        ? formData && formData[key]
        : `Client Name`;
    }
    if (key === 'length') {
      return formData && formData.length && formData.length.label
        ? formData.length.label
        : formData.length;
    }
    if (key === 'start_date') {
      return formData && formData[key] !== null
        ? formData && dayjs(formData[key]).format('MM / DD / YYYY')
        : 'Select Date';
    }
    if (key === 'current_date') {
      return dayjs(Date()).format('MM / DD / YYYY');
    }
    if (key === 'address') {
      if (
        formData &&
        formData.address === '' &&
        formData &&
        formData.state === '' &&
        formData &&
        formData.city === '' &&
        formData &&
        formData.zip_code === ''
      ) {
        return `Enter Location`;
      }
      return `${
        formData && formData.address ? formData && formData.address : ''
      }${formData && formData.address ? ',' : ''}
      ${formData && formData.state ? formData && formData.state : ''}${
        formData && formData.state ? ',' : ''
      }
      ${formData && formData.city ? formData && formData.city : ''}${
        formData && formData.city ? ',' : ''
      }
      ${formData && formData.zip_code ? formData && formData.zip_code : ''}
      `;
    }
    if (
      formData[key] === undefined ||
      formData[key] === '' ||
      formData[key] === null
    ) {
      return key === 'contract_company_name' ? `Client Name` : `Enter ${label}`;
    }
    return formData[key];
  };

  const getAgreementAccorType = (index) => {
    if (
      details &&
      details.contract_type &&
      details.contract_type.toLowerCase().includes('one')
    ) {
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

  const displayNumber = (num) => {
    const res = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return res;
  };

  const mapMonthlyServices = () => {
    const fields = [];
    if (formData && formData.additional_one_time_services) {
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
                     service.name
                       ? service.name
                       : service.service && service.service.name
                       ? service.service.name
                       : ''
                   }
              </td>
             
                  ${
                    (
                      service && service.name
                        ? service.name.includes('Amazon Store Package Custom')
                        : service &&
                          service.service &&
                          service.service.name.includes(
                            'Amazon Store Package Custom',
                          )
                    )
                      ? service.custom_amazon_store_price
                        ? `<td style="border: 1px solid black;padding: 13px;">
                                $${
                                  displayNumber(
                                    service.custom_amazon_store_price,
                                  )
                                  // .toString()
                                  // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                } /month
                               </td>`
                        : `<td style="border: 1px solid black;padding: 13px;">Yet to save</td>`
                      : service && service.service && service.service.fee
                      ? `<td style="border: 1px solid black;padding: 13px;">
                           $${
                             service && service.service && service.service.fee
                               ? displayNumber(service.service.fee)
                               : ''
                             //  .toString()
                             //  .replace(
                             //    /\B(?=(\d{3})+(?!\d))/g,
                             //    ',',
                             //  )
                           } /month </td>`
                      : `<td style="border: 1px solid black;padding: 13px;">Yet to save</td>`
                  }

     
     

      ${
        (
          service && service.name
            ? service.name !== 'Amazon Store Package Custom'
            : service &&
              service.service &&
              service.service.name !== 'Amazon Store Package Custom'
        )
          ? service.quantity && service.service && service.service.fee
            ? `<td style="border: 1px solid black;padding: 13px;">$${(service.quantity &&
              service.service &&
              service.service.fee
                ? service.quantity * service.service.fee
                : ''
              )
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </td>`
            : `<td style="border: 1px solid black;padding: 13px;">Yet to save</td>`
          : service.quantity && service.custom_amazon_store_price
          ? `<td style="border: 1px solid black;padding: 13px;">$${(service.quantity &&
            service.custom_amazon_store_price
              ? service.quantity * service.custom_amazon_store_price
              : ''
            )
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </td>`
          : `<td style="border: 1px solid black;padding: 13px;">Yet to save</td>`
      }
         
                  
                  </tr>`,
        );
      });
    }
    return fields.length ? fields.toString().replaceAll(',', '') : '';
  };

  const mapServiceTotal = (key) => {
    if (key === 'additional_one_time_services') {
      return `$${
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

    return `$${(market + month)
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

  const showOneTimeServiceTable = () => {
    if (
      formData &&
      formData.additional_one_time_services &&
      formData.additional_one_time_services.length
    ) {
      return `<div class="table-responsive"><table class="contact-list " style="width: 100%;
    border-collapse: collapse;
"><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Quantity</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Service</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Service Fee</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Total Service Fee</th></tr>${mapMonthlyServices(
      'additional_one_time_services',
      'One Time Services',
    )}<tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><td class="total-service" colspan="3" style="border: 1px solid black;padding: 13px; text-align:left"> Total</td><td class="total-service text-right" style="border: 1px solid black;padding: 13px; text-align: right;">${mapServiceTotal(
      'additional_one_time_services',
    )}
                              </td></tr>
                                </table></div>`;
    }
    return '';
  };

  return (
    <>
      <Paragraph>
        <p
          className="mb-4 long-text "
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
              // .replace('CUSTOMER_CITY', mapDefaultValues('city', 'City'))
              // .replace('CUSTOMER_STATE', mapDefaultValues('state', 'State'))
              // .replace(
              //   'CUSTOMER_POSTAL',
              //   mapDefaultValues('zip_code', 'Postal Code'),
              // )
              .replace(
                'AGREEMENT_LENGTH',
                mapDefaultValues('length', 'Contract Length'),
              )
              .replace('ONE_TIME_SERVICE_TABLE', showOneTimeServiceTable())
              .replace(
                'ADDITIONAL_ONE_TIME_SERVICES_TOTAL',
                `${mapServiceTotal('additional_one_time_services')}`,
              ),
          }}
        />

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
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip_code: PropTypes.string,
    additional_one_time_services: PropTypes.arrayOf(PropTypes.object),
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
