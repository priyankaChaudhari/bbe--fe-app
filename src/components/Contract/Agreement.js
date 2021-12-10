/* eslint-disable react/no-danger */

import React from 'react';

import dayjs from 'dayjs';
import { string, number, func, oneOfType, arrayOf, shape } from 'prop-types';

import { AgreementParagraph } from '../../theme/AgreementStyle';
import {
  RecurringLanguage,
  Recurring90DaysLanguage,
} from '../../constants/AgreementSign';

export default function Agreement({
  formData,
  details,
  templateData,
  servicesFees,
  discountData,
}) {
  const customerId = formData?.customer_id;
  const customerAddress = customerId?.address;
  const customerState = customerId?.state;
  const customerCity = customerId?.city;
  const customerZipCode = customerId?.zip_code;
  const contractType = details?.contract_type;

  const displayNumber = (num) => {
    const res = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return res;
  };

  const mapDefaultValues = (key, label) => {
    if (key === 'company_name') {
      return customerId && formData.customer_id[key]
        ? customerId && formData.customer_id[key]
        : `Client Name`;
    }
    if (key === 'length') {
      return formData?.length?.label
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
        (customerAddress === '' || customerAddress === null) &&
        (customerState === '' || customerState === null) &&
        (customerCity === '' || customerCity === null) &&
        (customerZipCode === '' || customerZipCode === null)
      ) {
        return `Enter Location`;
      }
      return `${customerAddress || ''}${
        customerAddress && (customerState || customerCity || customerZipCode)
          ? ','
          : ''
      }
      ${customerCity || ''}${
        customerCity && (customerState || customerZipCode) ? ',' : ''
      }
      ${customerState || ''}${customerState && customerZipCode ? ',' : ''}
      ${customerZipCode || ''}
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
    const OTSA = templateData?.one_time_service_agreement;
    if (contractType?.toLowerCase()?.includes('one')) {
      return OTSA && templateData.one_time_service_agreement[index];
    }
    return OTSA && templateData.recurring_service_agreement[index];
  };

  const customAmazonStorePrice = (fee) => {
    return `<td style="border: 1px solid black;padding: 13px;">
        ${fee ? `$${displayNumber(fee)}` : '$0'}
      </td>`;
  };
  const tdService = (service, fee) => {
    return `<td style="border: 1px solid black; padding: 13px;">
          ${
            service.quantity && fee
              ? `$${displayNumber(service.quantity * fee)}`
              : '$0'
          }
        </td>
        `;
  };
  const mapMonthlyServices = () => {
    const fields = [];
    if (formData?.additional_one_time_services) {
      formData.additional_one_time_services.forEach((service) => {
        const fixedFee = servicesFees.filter(
          (n) => n.id === service.service_id,
        );
        return fields.push(
          `<tr>
              <td style="border: 1px solid black; padding: 13px;">
                  ${service.quantity ? displayNumber(service.quantity) : 0}
              </td>
              <td style="border: 1px solid black;padding: 13px;">
                  ${
                    service.name
                      ? service.name
                      : service.service?.name
                      ? service.service.name
                      : ''
                  }
              </td>             
                  ${
                    (
                      service?.name
                        ? service.name.includes('Amazon Store Package Custom')
                        : service?.service?.name.includes(
                            'Amazon Store Package Custom',
                          )
                    )
                      ? service.custom_amazon_store_price
                        ? `<td style="border: 1px solid black;padding: 13px;">
                                $${displayNumber(
                                  service.custom_amazon_store_price,
                                )} 
                               </td>`
                        : customAmazonStorePrice(
                            fixedFee && fixedFee[0] && fixedFee[0].fee,
                          )
                      : service?.service?.fee
                      ? customAmazonStorePrice(service?.service?.fee)
                      : customAmazonStorePrice(
                          fixedFee && fixedFee[0] && fixedFee[0].fee,
                        )
                  }
                  ${
                    (
                      service?.name
                        ? service.name !== 'Amazon Store Package Custom'
                        : service?.service?.name !==
                          'Amazon Store Package Custom'
                    )
                      ? service.quantity && service.service?.fee
                        ? tdService(service, service.service?.fee)
                        : tdService(
                            service,
                            fixedFee && fixedFee[0] && fixedFee[0].fee,
                          )
                      : service.quantity && service.custom_amazon_store_price
                      ? tdService(service, service.custom_amazon_store_price)
                      : tdService(
                          service,
                          fixedFee && fixedFee[0] && fixedFee[0].fee,
                        )
                  }                 
          </tr>`,
        );
      });
    }
    return fields.length ? fields.toString().replaceAll('>,<', '><') : '';
  };

  const mapServiceTotal = (key) => {
    if (key === 'additional_one_time_services') {
      const onetimeDiscount = discountData.find(
        (item) => item.service_type === 'one time service',
      );
      const discountAmount = onetimeDiscount?.amount
        ? onetimeDiscount?.amount
        : 0;
      return `$${displayNumber(
        details?.total_fee?.onetime_service - discountAmount,
      )}`;
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
          } else if (item?.service) {
            oneTimeSubTotal += item.service.fee * quantity;
          } else {
            let fixedFee = servicesFees.filter((n) => n.id === item.service_id);
            fixedFee =
              fixedFee && fixedFee[0] && fixedFee[0].fee ? fixedFee[0].fee : 0;
            oneTimeSubTotal += fixedFee * quantity;
          }
        });

        const oneTimeDiscountData = discountData.find(
          (item) => item.service_type === 'one time service',
        );

        if (oneTimeDiscountData !== null) {
          const discountType = oneTimeDiscountData?.type;
          if (discountType === 'percentage') {
            oneTimeDiscount =
              (oneTimeSubTotal * oneTimeDiscountData?.amount) / 100;
          } else if (discountType === 'fixed amount') {
            oneTimeDiscount = oneTimeDiscountData?.amount;
          }
        } else {
          oneTimeDiscount = oneTimeDiscountData?.amount;
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
      totalFees?.oneTimeAmountAfterDiscount
        ? `<tr style="display: table-row; vertical-align: inherit; border-color: inherit;">
            <td class="total-service-borderless" colspan="3" style="border-bottom: hidden; padding: 5px 13px" text-align:left">Sub-total</td>
            <td class="total-service-borderless text-right" style="border-bottom: hidden; padding: 5px 13px" text-align: right;">
              $${displayNumber(totalFees?.oneTimeSubTotal)}
            </td>
         </tr>`
        : ''
    }
        ${
          totalFees?.oneTimeAmountAfterDiscount
            ? `<tr style="display: table-row; vertical-align: inherit; border-color: inherit;">
            <td class="total-service-borderless" colspan="3" style="border-bottom: hidden; padding: 5px 13px; text-align:left;"> Discount 
              ${
                totalFees?.oneTimeAmountAfterDiscount &&
                totalFees?.oneTimeDiscountType === 'percentage'
                  ? `(${totalFees?.oneTimeDiscount}%)`
                  : ''
              }
            </td>
            <td class="total-service-borderless text-right" style="border-bottom: hidden; padding: 5px 13px; text-align: right;"> 
              -$${displayNumber(totalFees?.oneTimeAmountAfterDiscount)}
            </td>
         </tr>`
            : ''
        }
         <tr style="display: table-row; vertical-align: inherit; border-color: inherit;">
            <td class="total-service" colspan="3" style="border: 1px solid black; padding-top: 5px; text-align:left"> Total</td>
            <td class="total-service text-right" style="border: 1px solid black; padding-top: 5px; text-align: right;"> 
              $${displayNumber(totalFees?.oneTimeTotal)} 
            </td>
         </tr>
         `;
  };

  const showOneTimeServiceTable = () => {
    if (formData?.additional_one_time_services?.length) {
      return `<div class="table-responsive">
        <table class="contact-list " style="width: 100%; border-collapse: collapse;">
          <tr style="display: table-row; vertical-align: inherit; border-color: inherit;">
            <th style="text-align: left;border: 1px solid black; padding: 13px;">Quantity</th>
            <th style="text-align: left;border: 1px solid black; padding: 13px;">Service</th>
            <th style="text-align: left;border: 1px solid black; padding: 13px;">Service Fee</th>
            <th style="text-align: left;border: 1px solid black; padding: 13px;">Total Service Fee</th>
          </tr>
          ${mapMonthlyServices(
            'additional_one_time_services',
            'One Time Services',
          )}
          ${mapOnetimeServiceTotal()}
        </table>
      </div>`;
    }
    return '';
  };

  const mapLanguage = () => {
    if (contractType?.toLowerCase()?.includes('recurring (90 day notice)')) {
      return Recurring90DaysLanguage;
    }
    return RecurringLanguage;
  };

  return (
    <>
      <AgreementParagraph>
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
                .replace(
                  'AGREEMENT_LENGTH',
                  mapDefaultValues('length', 'Contract Length'),
                )
                .replace('ONE_TIME_SERVICE_TABLE', showOneTimeServiceTable())
                .replace(
                  'ADDITIONAL_ONE_TIME_SERVICES_TOTAL',
                  `${mapServiceTotal('additional_one_time_services')}`,
                )
                .replace(
                  'LANGUAGE_ACCORDING_TO_CONTRACT_TYPE',
                  `${mapLanguage()}`,
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
      </AgreementParagraph>
    </>
  );
}

Agreement.defaultProps = {
  formData: {},
  details: {},
  templateData: {},
  servicesFees: {},
  discountData: [],
};

Agreement.propTypes = {
  details: shape({
    length: oneOfType([
      string,
      shape({
        value: string,
        label: string,
      }),
    ]),
    contract_type: string,
    one_time_discount_type: string,
    one_time_discount_amount: number,
    total_fee: shape({
      additional_marketplaces: number,
      monthly_service: number,
      onetime_service: number,
      onetime_service_after_discount: number,
      onetime_service_discount: number,
    }),
    primary_marketplace: oneOfType([
      string,
      shape({
        fee: number,
        name: string,
        id: string,
      }),
    ]),
    additional_marketplaces: arrayOf(
      shape({
        service: shape({
          name: string,
          fee: number,
        }),
      }),
    ),
    additional_one_time_services: arrayOf(
      shape({
        service: shape({
          name: string,
          fee: number,
        }),
      }),
    ),
    additional_monthly_services: arrayOf(
      shape({
        service: shape({
          name: string,
          fee: number,
        }),
      }),
    ),
  }),
  formData: shape({
    length: oneOfType([
      string,
      shape({
        value: string,
        label: string,
      }),
    ]),
    sales_threshold: string,
    additional_one_time_services: arrayOf(shape({})),
    customer_id: shape({
      address: string,
      city: string,
      state: string,
      zip_code: string,
    }),
    one_time_discount_type: oneOfType([string, number]),
    one_time_discount_amount: oneOfType([string, number]),
  }),
  templateData: shape({
    addendum: arrayOf(string),
    statement_of_work: arrayOf(string),
    one_time_service_agreement: arrayOf(string),
    recurring_service_agreement: arrayOf(string),
  }),
  servicesFees: arrayOf(
    shape({
      fee: number,
      filter: func,
    }),
  ),
  discountData: arrayOf(shape({})),
};
