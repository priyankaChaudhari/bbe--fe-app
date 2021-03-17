/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint no-useless-escape: "error" */

import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

export default function Statement({
  formData,
  details,
  templateData,
  notIncludedOneTimeServices,
  notIncludedMonthlyServices,
}) {
  const mapDefaultValues = (key, label, type) => {
    if (key === 'contract_company_name') {
      return formData && formData[key]
        ? formData && formData[key]
        : `Client Name`;
    }

    if (formData[key] === undefined || formData[key] === '') {
      return `Enter ${label}`;
    }

    if (key === 'start_date') {
      return formData && dayjs(formData[key]).format('MM / DD / YYYY');
    }
    if (key === 'primary_marketplace') {
      if (formData && formData.primary_marketplace) {
        return formData &&
          formData.primary_marketplace &&
          formData.primary_marketplace.name
          ? formData.primary_marketplace.name
          : formData.primary_marketplace;
      }
      return `Enter ${label}.`;
    }
    if (type && type.includes('number')) {
      // ${type === 'number-currency' ? '$' : '%'}
      return `${type === 'number-currency' ? '$' : '%'}${
        formData && formData[key]
          ? `${formData[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
          : `Enter ${label}.`
      }`;
    }

    return key === 'rev_share' || key === 'seller_type'
      ? formData && formData[key] && formData[key].label
        ? formData[key].label
        : formData[key]
      : formData && formData[key];
  };

  // if (formData[key] === undefined || formData[key] === '') {
  //   if (key === 'start_date') {
  //     return details && dayjs(details[key]).format('MM-DD-YYYY');
  //   }
  //   if (key === 'primary_marketplace') {
  //     if (details && details.primary_marketplace) {
  //       return (
  //         details &&
  //         details.primary_marketplace &&
  //         details.primary_marketplace.name
  //       );
  //     }
  //     return `Enter ${label}.`;
  //   }
  //   if (type && type.includes('number')) {
  //     return `${type === 'number-currency' ? '$' : '%'} ${
  //       details && details[key]
  //         ? details[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  //         : `Enter ${label}.`
  //     }`;
  //   }

  //   return key === 'rev_share' || key === 'seller_type'
  //     ? details && details[key] && details[key].label
  //     : details && details[key];
  // }
  // if (
  //   formData[key] === undefined ||
  //   formData[key] === '' ||
  //   formData[key] === null ||
  //   (details && Object.keys(details).length === 0)
  // ) {
  //   return `Enter ${label}.`;
  // }

  // return formData[key];
  // };

  const showRevTable = () => {
    if (formData && formData.sales_threshold) {
      return `<div class="table-responsive"> <table class="contact-list "><tr><th>Type</th><th>Description</th><th> Rev Share %</th><th> Sales Threshold</th>
      </tr><tr><td>% Of Incremental Sales</td>
      <td>A percentage of all Managed Channel Sales (retail dollars, net customer returns) for all sales over the sales 
      threshold each month through the Amazon Seller Central and Vendor Central account(s) that BBE manages for Client.</td><td> REVENUE_SHARE </td><td>REV_THRESHOLD</td></tr></table> </div>`;
    }
    return `<div class="table-responsive"> <table class="contact-list"><tr><th>Type</th><th>Description</th>
    <th> Rev Share %</th></tr><tr><td>% Of Sales</td><td>A percentage of all Managed Channel Sales (retail dollars, net customer returns) for all sales each month 
    through the Amazon Seller Central and Vendor Central account(s) that BBE manages for Client. </td><td> REVENUE_SHARE</td></tr></table></div>`;
  };

  const displayNotIncludedServices = () => {
    const fields = [];
    for (const item of notIncludedMonthlyServices) {
      fields.push(
        `<tr>
          <td style="border: 1px solid black;padding: 13px;"> ${
            item.label ? item.label : 'N/A'
          }</td>
          <td style="border: 1px solid black;padding: 13px;"> ${' Monthly'}</td>
         </tr>`,
      );
    }
    for (const item of notIncludedOneTimeServices) {
      fields.push(
        `<tr>
          <td style="border: 1px solid black;padding: 13px;"> ${
            item.label ? item.label : 'N/A'
          }</td>
          <td style="border: 1px solid black;padding: 13px;"> ${'One Time'}</td>
         </tr>`,
      );
    }
    return fields.length ? fields.toString().replaceAll(',', '') : 'No Data';
  };

  const mapVariableMonthlyService = () => {
    const fields = [
      `<tr ><td class="total-service" colspan="2" style ="text-align: center">
                  Variable Monthly Services</td>
                  </tr>`,
    ];
    if (formData && formData.additional_monthly_services) {
      for (const item of formData.additional_monthly_services) {
        if (
          item.name
            ? item.name === 'DSP Advertising'
            : item.service.name === 'DSP Advertising'
        ) {
          fields.push(
            `<tr>
                 <td style="border: 1px solid black;padding: 13px;">${
                   item.service ? item.service.name : item && item.name
                 }
                  </td>
                  <td style="border: 1px solid black;padding: 13px;">
                  ${
                    item.service && item.service.dsp_text
                      ? item.service.dsp_text
                      : 'Included'
                  }
                  </td>
                </tr>`,
          );
        }
        if (
          item.name
            ? item.name === 'Inventory Reconciliation'
            : item.service.name === 'Inventory Reconciliation'
        ) {
          fields.push(
            `<tr>
                 <td style="border: 1px solid black;padding: 13px;">${
                   item.service ? item.service.name : item && item.name
                 }</td>
                    <td style="border: 1px solid black;padding: 13px;"> 
                    25% of recovered $<span>&#39;</span>s
                    
                  </td>
                    </tr>`,
          );
        }
      }

      return fields.length > 1 ? fields.toString().replaceAll(',', '') : '';
    }
    return '';
  };
  const displayNumber = (num) => {
    const res = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return res;
  };

  const mapAdditionalMarketPlaces = () => {
    const fields = [];
    if (formData && formData.additional_marketplaces) {
      for (const item of formData.additional_marketplaces) {
        fields.push(
          `<tr>
      <td style="border: 1px solid black;padding: 13px;">${
        item.service ? item.service.name : item && item.name
      }</td>

      ${
        item && item.fee
          ? `<td style="border: 1px solid black;padding: 13px;">
            $${
              item.service
                ? item.service.fee
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : item.fee
                ? item.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : ''
            }
            /month
          </td>`
          : `<td>Yet to save</td>`
      }
      </tr>`,
        );
      }
    }
    return fields.length ? fields.toString().replaceAll(',', '') : '';
  };

  // <tr>
  //           <td class="total-service"> Total</td>
  //           <td class="total-service text-right">${mapServiceTotal(
  //           'additional_monthly_services',
  //     )}
  //                             </td></tr>`

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

  const mapMonthlyServiceDisocuntTotal = () => {
    const market = details.total_fee.additional_marketplaces
      ? details.total_fee.additional_marketplaces
      : 0;
    const month = details.total_fee.monthly_service_after_discount
      ? details.total_fee.monthly_service_after_discount
      : 0;

    return `$${(market + month)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };
  const mapMonthlyServiceTotal = () => {
    return `<tr>
            <td class="total-service-bordless"> Sub-total</td>
            <td class="total-service-bordless text-right">${mapServiceTotal(
              'additional_monthly_servces',
            )}
            </td>
         </tr>
         <tr>
            <td class="total-service-bordless"> Discount ${
              details &&
              details.monthly_discount_amount &&
              details &&
              details.monthly_discount_type === 'percentage'
                ? `(${details && details.monthly_discount_amount}%)`
                : ''
            }</td>
            <td class="total-service-bordless text-right"> -$${
              details &&
              details.total_fee &&
              details.total_fee.monthly_service_discount
                ? details &&
                  details.total_fee &&
                  details.total_fee.monthly_service_discount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : ''
            }
            </td>
         </tr>
         <tr>
            <td class="total-service" style="padding-top: 5px"> Total</td>
            <td class="total-service text-right" style="padding-top: 5px;"> ${mapMonthlyServiceDisocuntTotal()}
            </td>
         </tr>
         `;
  };
  const showStandardServicesTable = () => {
    return `
   <div class="table-responsive"><table class=" contact-list " style="width: 100%; overflow:auto;
    border-collapse: collapse;"><tr><th colspan="3" style="text-align: left; border: 1px solid black;
    padding: 13px;  ">Service Components</th></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Expert Strategy and Consultation (AGS)</td><td style="border: 1px solid black;
    padding: 13px;">Strategic Plan (Audit, SWOT Analysis, Critical Issues)</td><td style="border: 1px solid black;
    padding: 13px;">Weekly Call</td></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Listing Optimization - Content <br><span style="font-weight: 800;"> SKU's per month: <span style=" background:#ffe5df;padding: 4px 9px;"> ${
      formData && formData.content_optimization
    }</span></span></td><td style="border: 1px solid black;
    padding: 13px;">Listing Optimization - Design <br> <span style="font-weight: 800;"> SKU's per month: <span style=" background:#ffe5df;padding: 4px 9px;"> ${
      formData && formData.design_optimization
    }</span></span></td><td style="border: 1px solid black;
    padding: 13px;">Listing Creation</td></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Listing Compliance</td><td style="border: 1px solid black;
    padding: 13px;">Brand Registry Consultation</td><td style="border: 1px solid black;
    padding: 13px;">Catalog Management and Organization</td></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Seller Performance Consultation</td><td style="border: 1px solid black;
    padding: 13px;">Reporting</td><td style="border: 1px solid black;
    padding: 13px;">Holiday and Seasonal Preparation</td></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Promotion Planning and Support</td><td style="border: 1px solid black;
    padding: 13px;">Advertising Management</td><td style="border: 1px solid black;
    padding: 13px;"> [SELLER_TYPE] Account Management</td></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Review Strategy</td><td style="border: 1px solid black;
    padding: 13px;">Total Managed Ad Spend</td><td style="border: 1px solid black;
    padding: 13px;">Channel Governance Consultation</td></tr></table> </div>
  `;
  };
  const mapOnetimeServiceTotal = () => {
    return `<tr>
            <td class="total-service-borderless" style="border-bottom: hidden; padding: 5px 13px" colspan="3"> Sub-total</td>
            <td class="total-service-borderless text-right" style="border-bottom: hidden; padding: 5px 13px">$${
              details &&
              details.total_fee &&
              details.total_fee.onetime_service
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            </td>
         </tr>
         <tr>
            <td class="total-service-borderless"style="border-bottom: hidden; padding: 5px 13px" colspan="3"> Discount ${
              details &&
              details.one_time_discount_amount &&
              details &&
              details.one_time_discount_type === 'percentage'
                ? `(${details && details.one_time_discount_amount}%)`
                : ''
            }</td>
            <td class="total-service-borderless text-right" style="border-bottom: hidden; padding: 5px 13px"> -$${
              details &&
              details.total_fee &&
              details.total_fee.onetime_service_discount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            </td>
         </tr>
         <tr>
            <td class="total-service" colspan="3" style=" padding-top: 5px "> Total</td>
            <td class="total-service text-right"style="padding-top: 5px "> $${
              details &&
              details.total_fee &&
              details.total_fee.onetime_service_after_discount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            </td>
         </tr>
         `;
  };

  const mapMonthlyServices = (key) => {
    const fields = [];
    if (key !== 'additional_one_time_services') {
      if (formData && formData[key]) {
        for (const item of formData[key]) {
          if (
            (item.service && item.service.name !== undefined) ||
            item.name !== undefined
          ) {
            if (
              (item.name
                ? item.name !== 'DSP Advertising'
                : item.service.name !== 'DSP Advertising') &&
              (item.name
                ? item.name !== 'Inventory Reconciliation'
                : item.service.name !== 'Inventory Reconciliation')
            ) {
              fields.push(
                `<tr>
                <td style="border: 1px solid black;padding: 13px;">${
                  item.service ? item.service.name : item && item.name
                }</td>
                ${
                  item.service && item.service.fee
                    ? `<td style="border: 1px solid black;padding: 13px;">$${
                        item.service
                          ? displayNumber(item.service.fee)
                          : // .toString()
                          // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          item.fee
                          ? displayNumber(item.fee)
                          : // .toString()
                            // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            ''
                      } /month
                </td>`
                    : `<td>Yet to save</td>`
                }
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
                        ? `<td>
                                $${
                                  displayNumber(
                                    service.custom_amazon_store_price,
                                  )
                                  // .toString()
                                  // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                } /month
                               </td>`
                        : `<td>Yet to save</td>`
                      : service && service.service && service.service.fee
                      ? `<td>
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
                      : `<td>Yet to save</td>`
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
            : `<td>Yet to save</td>`
          : service.quantity && service.custom_amazon_store_price
          ? `<td style="border: 1px solid black;padding: 13px;">$${(service.quantity &&
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

  const showMonthlyServiceTable = () => {
    if (
      // (details &&
      //   details.additional_monthly_services &&
      //   details.additional_monthly_services.length) ||
      // (details &&
      //   details.additional_marketplaces &&
      //   details.additional_marketplaces.length) ||
      (formData &&
        formData.additional_monthly_services &&
        formData.additional_monthly_services.length) ||
      (formData &&
        formData.additional_marketplaces &&
        formData.additional_marketplaces.length)
    ) {
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center"><span style="font-weight: 800;
    font-family: Helvetica-bold;">Additional Monthly Services </span><br> The following additional monthly services will be provided to Client in addition to the Monthly Retainer.</div><br> <div class="table-responsive"><table class="contact-list "><tr><th>Service</th><th>Service Fee</th></tr>${mapMonthlyServices(
      'additional_monthly_services',
      'Monthly Services',
    )} ${mapAdditionalMarketPlaces()}
    
   ${mapMonthlyServiceTotal()}
                              ${mapVariableMonthlyService()}
                                </table></div>`;
    }
    return '';
  };

  const showOneTimeServiceTable = () => {
    if (
      formData &&
      formData.additional_one_time_services &&
      formData.additional_one_time_services.length
    ) {
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center;"><span style="font-weight: 800;
    font-family: Helvetica-bold;">Additional One Time Services </span><br>The following additional monthly services will be provided to Client as a one time service in addition to the Monthly Retainer and any Additional Monthly services.</div><br> <div class="table-responsive"><table class="contact-list "><tr><th>Quantity</th><th>Service</th><th>Service Fee</th><th>Total Service Fee</th></tr>${mapMonthlyServices(
      'additional_one_time_services',
      'One Time Services',
    )}
    ${mapOnetimeServiceTotal()}
                                </table></div>`;
    }
    return '';
  };

  const showNotIncludedServicesTable = () => {
    if (
      notIncludedMonthlyServices.length ||
      notIncludedOneTimeServices.length
    ) {
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center;"><span style="font-weight: 800;
    font-family: Helvetica-bold;">Additional Services Not Included</span><br>The following services are not part of this agreement, but can be purchased after signing by working with your Buy Box Experts Brand Growth Strategist or Sales Representative.</div><div class="table-responsive"><br> <table class="contact-list " style="width: 100%;border-collapse: collapse;">
                                <tr>
                                  <th style="text-align: left; border: 1px solid black;padding: 13px;">Service</th>
                                  <th style="text-align: left; border: 1px solid black;padding: 13px;">Service Type</th>
                                  </tr>
                                  ${displayNotIncludedServices()}
                                  </table></div>
                                  `;
    }
    return '';
  };

  return (
    <>
      <Paragraph>
        {' '}
        <p
          className="long-text"
          dangerouslySetInnerHTML={{
            __html:
              templateData.statement_of_work &&
              templateData.statement_of_work[0]
                .replace(
                  'CUSTOMER_NAME',
                  mapDefaultValues('contract_company_name', 'Customer Name'),
                )
                .replace(
                  'START_DATE',
                  mapDefaultValues('start_date', 'Start Date'),
                )
                .replace(
                  'MONTHLY_RETAINER_AMOUNT',
                  mapDefaultValues(
                    'monthly_retainer',
                    'Monthly Retainer',
                    'number-currency',
                  ),
                )
                .replace('REV_SHARE_TABLE', showRevTable())
                .replace(
                  'REVENUE_SHARE',
                  mapDefaultValues('rev_share', 'Rev Share'),
                )
                .replace(
                  'REV_THRESHOLD',
                  mapDefaultValues(
                    'sales_threshold',
                    'Rev Threshold',
                    'number-currency',
                  ),
                )
                .replace(
                  'SELLER_TYPE',
                  mapDefaultValues('seller_type', 'Seller Type'),
                )
                .replace(
                  'PRIMARY_MARKETPLACE',
                  mapDefaultValues(
                    'primary_marketplace',
                    'Primary Marketplace',
                  ),
                )
                .replace('MAP_MONTHLY_SERVICES', showMonthlyServiceTable())
                .replace('ONE_TIME_SERVICES', showOneTimeServiceTable())
                .replace(
                  'MAP_STANDARD_SERVICE_TABLE',
                  showStandardServicesTable(),
                )
                .replace(
                  'ADDITIONAL_SERVICES_NOT_INCLUDED',
                  showNotIncludedServicesTable(),
                ),
          }}
        />
      </Paragraph>
    </>
  );
}

Statement.defaultProps = {
  details: {},
  formData: {},
  templateData: {},
  notIncludedOneTimeServices: [],
  notIncludedMonthlyServices: [],
};
Statement.propTypes = {
  details: PropTypes.shape({
    length: PropTypes.string,
    monthly_discount_amount: PropTypes.number,
    monthly_discount_type: PropTypes.string,
    one_time_discount_amount: PropTypes.number,
    one_time_discount_type: PropTypes.string,

    primary_marketplace: PropTypes.shape({
      fee: PropTypes.number,
      name: PropTypes.string,
      id: PropTypes.string,
    }),
    total_fee: PropTypes.shape({
      onetime_service: PropTypes.number,
      additional_marketplaces: PropTypes.number,
      monthly_service: PropTypes.number,
      monthly_service_discount: PropTypes.number,
      monthly_service_after_discount: PropTypes.number,
      onetime_service_discount: PropTypes.number,
      onetime_service_after_discount: PropTypes.number,
    }),
    additional_marketplaces: PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.string,
      }),
    ),
    additional_one_time_services: PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.string,
      }),
    ),
    additional_monthly_services: PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.string,
      }),
    ),
  }),
  formData: PropTypes.shape({
    length: PropTypes.string,
    sales_threshold: PropTypes.string,
    additional_marketplaces: PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.string,
      }),
    ),
    additional_one_time_services: PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.string,
      }),
    ),
    primary_marketplace: PropTypes.shape({
      fee: PropTypes.number,
      name: PropTypes.string,
      id: PropTypes.string,
    }),
    additional_monthly_services: PropTypes.arrayOf(
      PropTypes.shape({
        service: PropTypes.string,
      }),
    ),
    content_optimization: PropTypes.number,
    design_optimization: PropTypes.number,
  }),
  templateData: PropTypes.shape({
    addendum: PropTypes.string,
    statement_of_work: PropTypes.string,
  }),
  notIncludedOneTimeServices: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    }),
  ),
  notIncludedMonthlyServices: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    }),
  ),
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
