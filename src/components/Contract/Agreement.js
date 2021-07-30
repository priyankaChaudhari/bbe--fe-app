/* eslint-disable react/no-danger */

import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

export default function Agreement({
  formData,
  details,
  templateData,
  servicesFees,
}) {
  const mapDefaultValues = (key, label) => {
    if (key === 'company_name') {
      return formData && formData.customer_id && formData.customer_id[key]
        ? formData && formData.customer_id && formData.customer_id[key]
        : `Client Name`;
    }
    if (key === 'length') {
      return formData && formData.length && formData.length.label
        ? formData.length.label
        : formData.length
        ? formData.length
        : 'Select Length';
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
        ((formData &&
          formData.customer_id &&
          formData.customer_id.address === '') ||
          (formData &&
            formData.customer_id &&
            formData.customer_id.address === null)) &&
        ((formData &&
          formData.customer_id &&
          formData.customer_id.state === '') ||
          (formData &&
            formData.customer_id &&
            formData.customer_id.state === null)) &&
        ((formData &&
          formData.customer_id &&
          formData.customer_id.city === '') ||
          (formData &&
            formData.customer_id &&
            formData.customer_id.city === null)) &&
        ((formData &&
          formData.customer_id &&
          formData.customer_id.zip_code === '') ||
          (formData &&
            formData.customer_id &&
            formData.customer_id.zip_code === null))
      ) {
        return `Enter Location`;
      }
      return `${
        formData && formData.customer_id && formData.customer_id.address
          ? formData && formData.customer_id && formData.customer_id.address
          : ''
      }${
        formData &&
        formData.customer_id &&
        formData.customer_id.address &&
        ((formData && formData.customer_id && formData.customer_id.state) ||
          (formData && formData.customer_id && formData.customer_id.city) ||
          (formData && formData.customer_id && formData.customer_id.zip_code))
          ? ','
          : ''
      }
       ${
         formData && formData.customer_id && formData.customer_id.city
           ? formData && formData.customer_id && formData.customer_id.city
           : ''
       }${
        formData &&
        formData.customer_id &&
        formData.customer_id.city &&
        (formData.customer_id.state ||
          (formData && formData.customer_id && formData.customer_id.zip_code))
          ? ','
          : ''
      }
      ${
        formData && formData.customer_id && formData.customer_id.state
          ? formData && formData.customer_id && formData.customer_id.state
          : ''
      }${
        formData &&
        formData.customer_id &&
        formData.customer_id.state &&
        formData &&
        formData.customer_id &&
        formData.customer_id.zip_code
          ? ','
          : ''
      }
     
      ${
        formData && formData.customer_id && formData.customer_id.zip_code
          ? formData && formData.customer_id && formData.customer_id.zip_code
          : ''
      }
      `;
    }
    if (
      formData[key] === undefined ||
      formData[key] === '' ||
      formData[key] === null
    ) {
      return key === 'company_name' ? `Client Name` : `Enter ${label}`;
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
        const fixedFee = servicesFees.filter(
          (n) => n.id === service.service_id,
        );
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
                                } 
                               </td>`
                        : // Yet to save 185
                          `<td style="border: 1px solid black;padding: 13px;">
                        ${
                          fixedFee && fixedFee[0] && fixedFee[0].fee
                            ? `$${displayNumber(fixedFee[0].fee)}`
                            : '$0'
                        }</td>`
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
                           } </td>`
                      : // yet to save
                        `<td style="border: 1px solid black;padding: 13px;">${
                          fixedFee && fixedFee[0] && fixedFee[0].fee
                            ? `$${displayNumber(fixedFee[0].fee)}`
                            : '$0'
                        }</td>`
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
            : // Yet to save 238
              `<td style="border: 1px solid black;padding: 13px;">
              ${(service.quantity && fixedFee && fixedFee[0] && fixedFee[0].fee
                ? `$${service.quantity * fixedFee[0].fee}`
                : '$0'
              )
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </td>`
          : service.quantity && service.custom_amazon_store_price
          ? `<td style="border: 1px solid black;padding: 13px;">$${(service.quantity &&
            service.custom_amazon_store_price
              ? service.quantity * service.custom_amazon_store_price
              : ''
            )
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </td>`
          : // Yet to save 255
            `<td style="border: 1px solid black;padding: 13px;">
          ${(service.quantity && fixedFee && fixedFee[0] && fixedFee[0].fee
            ? `$${service.quantity * fixedFee[0].fee}`
            : '$0'
          )
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </td>`
      }
         
                  
                  </tr>`,
        );
      });
    }
    // return fields.length ? fields.toString().replaceAll(',', '') : '';
    return fields.length ? fields.toString().replaceAll('>,<', '><') : '';
  };

  const mapServiceTotal = (key) => {
    if (key === 'additional_one_time_services') {
      return `$${
        details &&
        details.total_fee &&
        details.total_fee.onetime_service_after_discount
          ? details.total_fee.onetime_service_after_discount
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

  const calculateTodalFee = (type) => {
    let oneTimeSubTotal = 0;
    let oneTimeDiscount = 0;

    if (formData) {
      if (
        type === 'onetime' &&
        formData.additional_one_time_services !== null
      ) {
        formData.additional_one_time_services.forEach((item) => {
          const { quantity } = item;

          if (item.custom_amazon_store_price) {
            oneTimeSubTotal += item.custom_amazon_store_price * quantity;
          } else if (item && item.service) {
            oneTimeSubTotal += item.service.fee * quantity;
          } else {
            let fixedFee = servicesFees.filter((n) => n.id === item.service_id);
            fixedFee =
              fixedFee && fixedFee[0] && fixedFee[0].fee ? fixedFee[0].fee : 0;
            oneTimeSubTotal += fixedFee * quantity;
          }
        });

        if (formData.one_time_discount_type !== null) {
          const discountType = formData.one_time_discount_type;
          if (discountType === 'percentage') {
            oneTimeDiscount =
              (oneTimeSubTotal * formData.one_time_discount_amount) / 100;
          } else if (discountType === 'fixed amount') {
            oneTimeDiscount = formData.one_time_discount_amount;
          }
        } else {
          oneTimeDiscount = formData.one_time_discount_amount;
        }
        return {
          oneTimeSubTotal,
          oneTimeAmountAfterDiscount: oneTimeDiscount,
          oneTimeTotal: oneTimeSubTotal - oneTimeDiscount,
          oneTimeDiscountType: formData.one_time_discount_type,
          oneTimeDiscount: formData.one_time_discount_amount,
        };
      }
    }
    return 0;
  };

  const mapOnetimeServiceTotal = () => {
    const totalFees = calculateTodalFee('onetime');
    return `
    ${
      totalFees && totalFees.oneTimeAmountAfterDiscount
        ? `<tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;">
            <td class="total-service-borderless" colspan="3" style="border-bottom: hidden; padding: 5px 13px" text-align:left"> Sub-total</td>
            <td class="total-service-borderless text-right" style="border-bottom: hidden; padding: 5px 13px" text-align: right;">$${
              totalFees &&
              totalFees.oneTimeSubTotal
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            </td>
         </tr>`
        : ''
    }
        ${
          totalFees && totalFees.oneTimeAmountAfterDiscount
            ? `<tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;">
            <td class="total-service-borderless" colspan="3" style="border-bottom: hidden; padding: 5px 13px; text-align:left;"> Discount ${
              totalFees &&
              totalFees.oneTimeAmountAfterDiscount &&
              totalFees &&
              totalFees.oneTimeDiscountType === 'percentage'
                ? `(${totalFees && totalFees.oneTimeDiscount}%)`
                : ''
            }</td>
            <td class="total-service-borderless text-right" style="border-bottom: hidden; padding: 5px 13px;text-align: right;"> -$${
              totalFees &&
              totalFees.oneTimeAmountAfterDiscount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            </td>
         </tr>`
            : ''
        }
         <tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;">
            <td class="total-service" colspan="3" style="border: 1px solid black;padding-top: 5px; text-align:left"> Total</td>
            <td class="total-service text-right" style="border: 1px solid black;padding-top: 5px; text-align: right;"> $${
              totalFees &&
              totalFees.oneTimeTotal
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            </td>
         </tr>
         `;
    // return `
    // ${
    //   details && details.total_fee && details.total_fee.onetime_service_discount
    //     ? `<tr style="display: table-row;
    // vertical-align: inherit;
    // border-color: inherit;">
    //         <td class="total-service-borderless" colspan="3" style="border-bottom: hidden; padding: 5px 13px" text-align:left"> Sub-total</td>
    //         <td class="total-service-borderless text-right" style="border-bottom: hidden; padding: 5px 13px" text-align: right;">$${
    //           details &&
    //           details.total_fee &&
    //           details.total_fee.onetime_service
    //             .toString()
    //             .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    //         }
    //         </td>
    //      </tr>`
    //     : ''
    // }
    //     ${
    //       details &&
    //       details.total_fee &&
    //       details.total_fee.onetime_service_discount
    //         ? `<tr style="display: table-row;
    // vertical-align: inherit;
    // border-color: inherit;">
    //         <td class="total-service-borderless" colspan="3" style="border-bottom: hidden; padding: 5px 13px; text-align:left;"> Discount ${
    //           details &&
    //           details.one_time_discount_amount &&
    //           details &&
    //           details.one_time_discount_type === 'percentage'
    //             ? `(${details && details.one_time_discount_amount}%)`
    //             : ''
    //         }</td>
    //         <td class="total-service-borderless text-right" style="border-bottom: hidden; padding: 5px 13px;text-align: right;"> -$${
    //           details &&
    //           details.total_fee &&
    //           details.total_fee.onetime_service_discount
    //             .toString()
    //             .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    //         }
    //         </td>
    //      </tr>`
    //         : ''
    //     }
    //      <tr style="display: table-row;
    // vertical-align: inherit;
    // border-color: inherit;">
    //         <td class="total-service" colspan="3" style="border: 1px solid black;padding-top: 5px; text-align:left"> Total</td>
    //         <td class="total-service text-right" style="border: 1px solid black;padding-top: 5px; text-align: right;"> $${
    //           details &&
    //           details.total_fee &&
    //           details.total_fee.onetime_service_after_discount
    //             .toString()
    //             .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    //         }
    //         </td>
    //      </tr>
    //      `;
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
    )}${mapOnetimeServiceTotal()}
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
            __html:
              getAgreementAccorType(0) &&
              getAgreementAccorType(0)
                .replace(
                  'CUSTOMER_NAME',
                  mapDefaultValues('company_name', 'Customer Name'),
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
            __html:
              getAgreementAccorType(1) &&
              getAgreementAccorType(1)
                .replace(
                  'CUSTOMER_NAME',
                  mapDefaultValues('company_name', 'Customer Name'),
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
  servicesFees: {},
};

Agreement.propTypes = {
  details: PropTypes.shape({
    length: PropTypes.shape({ label: PropTypes.string }),
    contract_type: PropTypes.string,
    one_time_discount_type: PropTypes.string,
    one_time_discount_amount: PropTypes.number,
    total_fee: PropTypes.shape({
      additional_marketplaces: PropTypes.number,
      monthly_service: PropTypes.number,
      onetime_service: PropTypes.number,
      onetime_service_after_discount: PropTypes.number,
      onetime_service_discount: PropTypes.number,
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
    length: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
    sales_threshold: PropTypes.string,

    additional_one_time_services: PropTypes.arrayOf(PropTypes.object),
    customer_id: PropTypes.shape({
      address: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zip_code: PropTypes.string,
    }),
    one_time_discount_type: PropTypes.string,
    one_time_discount_amount: PropTypes.number,
  }),
  templateData: PropTypes.shape({
    addendum: PropTypes.arrayOf(PropTypes.shape(PropTypes.string)),
    statement_of_work: PropTypes.string,
    one_time_service_agreement: PropTypes.arrayOf(PropTypes.string),
    recurring_service_agreement: PropTypes.arrayOf(PropTypes.string),
  }),
  servicesFees: PropTypes.shape({
    fee: PropTypes.number,
    filter: PropTypes.func,
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

  .contact-list table,
  td,
  th {
    border: 1px solid black;
    padding: 13px;

    .total-service-bordless {
      font-weight: 500;
      border-bottom: hidden !important;
    }
  }

  tr {
    .total-service {
      font-weight: 800;
    }
    .total-service-bordless {
      font-weight: 500;
      border-bottom: hidden !important;
      padding: 7px 13px;
    }

    th {
      text-align: left;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }
`;
