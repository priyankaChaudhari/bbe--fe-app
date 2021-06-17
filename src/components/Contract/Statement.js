/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint no-useless-escape: "error" */

import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { additionaMarketplaceAmount } from '../../constants/FieldConstants';

export default function Statement({
  formData,
  // details,
  templateData,
  notIncludedOneTimeServices,
  notIncludedMonthlyServices,
  servicesFees,
}) {
  const mapDefaultValues = (key, label, type) => {
    if (key === 'company_name') {
      return formData && formData.customer_id && formData.customer_id[key]
        ? formData && formData.customer_id && formData.customer_id[key]
        : `Client Name`;
    }

    if (formData[key] === undefined || formData[key] === '') {
      return `Enter ${label}`;
    }

    if (key === 'start_date') {
      return formData && formData[key] !== null
        ? formData && dayjs(formData[key]).format('MM / DD / YYYY')
        : 'Select Date';
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
    if (key === 'threshold_type') {
      if (formData && formData[key] === 'YoY') {
        return 'YoY: All channel sales above previous year channel sales.';
      }
      if (formData && formData[key] === 'YoY + %') {
        return `YoY + %: All channel sales above a <span style=" background:#ffe5df;padding: 4px 9px;font-weight: bold">${
          formData && formData.yoy_percentage
            ? formData && formData.yoy_percentage
            : `Enter ${label}.`
        }</span> growth on previous year channel sales.`;
      }
      if (formData && formData[key] === 'Fixed') {
        return `Fixed: <span style=" background:#ffe5df;padding: 4px 9px;font-weight: bold">${
          formData && formData.sales_threshold
            ? `$${
                formData &&
                formData.sales_threshold
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }`
            : `Enter ${label}.`
        }</span>`;
      }
    }

    if (type && type.includes('number')) {
      // ${type === 'number-currency' ? '$' : '%'}
      if (formData && formData[key]) {
        return `${type === 'number-currency' ? '$' : '%'}${`${formData[key]
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}`;
      }
      return `Enter ${label}.`;
    }

    return key === 'rev_share' || key === 'seller_type'
      ? formData && formData[key] && formData[key].label
        ? formData[key].label
        : formData[key]
        ? formData[key]
        : `Enter ${label}`
      : formData && formData[key];
  };
  // style=" background:#ffe5df;padding: 4px 9px;font-weight: bold"

  const showRevTable = () => {
    if (
      formData &&
      formData.threshold_type &&
      formData.threshold_type !== 'None'
    ) {
      return `<div class="table-responsive"> <table class="contact-list "><tr><th>Type</th><th>Description</th><th> Rev Share %</th><th> Sales Threshold Type</th>
      </tr><tr><td>% Of Incremental Sales</td>
      <td>A percentage of all Managed Channel Sales (retail dollars, net customer returns) for all sales over the sales 
      threshold each month through the Amazon Seller Central and Vendor Central account(s) that BBE manages for Client.</td><td><span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold"> REVENUE_SHARE</span>  </td><td> <span>REV_THRESHOLD </span></td></tr></table> </div>`;
    }
    return `<div class="table-responsive"> <table class="contact-list"><tr><th>Type</th><th>Description</th>
    <th> Rev Share %</th></tr><tr><td>% Of Sales</td><td>A percentage of all Managed Channel Sales (retail dollars, net customer returns) for all sales each month 
    through the Amazon Seller Central and Vendor Central account(s) that BBE manages for Client. </td><td><span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";> REVENUE_SHARE </span> </td></tr></table></div>`;
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
        // if (
        //   item.name
        //     ? item.name === 'DSP Advertising'
        //     : item.service.name === 'DSP Advertising'
        // ) {
        //   fields.push(
        //     `<tr>
        //          <td style="border: 1px solid black;padding: 13px;">${
        //            item.service ? item.service.name : item && item.name
        //          }
        //           </td>
        //           <td style="border: 1px solid black;padding: 13px;">
        //           ${
        //             item.service && item.service.dsp_text
        //               ? item.service.dsp_text
        //               : 'Included'
        //           }
        //           </td>
        //         </tr>`,
        //   );
        // }
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
          : //  `<td>Yet ot save </td>`
            `<td>$${additionaMarketplaceAmount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} /month</td>`
      }
      </tr>`,
        );
      }
    }
    // return fields.length ? fields.toString().replaceAll(',', '') : '';
    return fields.length ? fields.toString().replaceAll('>,<', '><') : '';
  };

  // <tr>
  //           <td class="total-service"> Total</td>
  //           <td class="total-service text-right">${mapServiceTotal(
  //           'additional_monthly_services',
  //     )}
  //                             </td></tr>`

  // const mapServiceTotal = (key) => {
  //   if (key === 'additional_one_time_services') {
  //     return `$${
  //       details && details.total_fee.onetime_service
  //         ? details.total_fee.onetime_service
  //             .toString()
  //             .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  //         : 0
  //     }`;
  //   }
  //   const market = details.total_fee.additional_marketplaces
  //     ? details.total_fee.additional_marketplaces
  //     : 0;
  //   const month = details.total_fee.monthly_service
  //     ? details.total_fee.monthly_service
  //     : 0;

  //   return `$${(market + month)
  //     .toString()
  //     .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  // };

  const calculateTodalFee = (type) => {
    let oneTimeSubTotal = 0;
    let monthlySubTotal = 0;
    let oneTimeDiscount = 0;
    let monthlyDiscount = 0;
    let additionalMarketplacesTotal = 0;

    if (formData) {
      if (type === 'monthly') {
        // caculate the total of additional monthly serviece
        if (formData.additional_monthly_services !== null) {
          formData.additional_monthly_services.forEach((item) => {
            if (item && item.service) {
              monthlySubTotal += item.service.fee;
            } else {
              const fixedFee = servicesFees.filter(
                (n) => n.id === item.service_id,
              );
              monthlySubTotal += fixedFee[0].fee;
            }
          });
        }
        if (formData.additional_marketplaces !== null) {
          // calculate the total of additional marketplaces
          formData.additional_marketplaces.forEach((item) => {
            if (item && item.fee) {
              additionalMarketplacesTotal += item.fee;
            } else {
              additionalMarketplacesTotal += additionaMarketplaceAmount;
            }
          });

          monthlySubTotal += additionalMarketplacesTotal;
        }
        if (formData.monthly_discount_type !== null) {
          const discountType = formData.monthly_discount_type;
          if (discountType === 'percentage') {
            monthlyDiscount =
              (monthlySubTotal * formData.monthly_discount_amount) / 100;
          } else if (discountType === 'fixed amount') {
            monthlyDiscount = formData.monthly_discount_amount;
          }
        } else {
          monthlyDiscount = formData.monthly_discount_amount;
        }
        return {
          monthlySubTotal,
          monthlyAmountAfterDiscount: monthlyDiscount,
          monthlyTotal: monthlySubTotal - monthlyDiscount,
          monthlyDiscountType: formData.monthly_discount_type,
          monthlyDiscount: formData.monthly_discount_amount,
        };
      }
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

  const mapMonthlyServiceTotal = () => {
    const totalFees = calculateTodalFee('monthly');

    return `
    ${
      totalFees.monthlyAmountAfterDiscount
        ? `<tr>
            <td class="total-service-bordless"> Sub-total</td>
            <td class="total-service-bordless text-right">
            ${totalFees.monthlySubTotal}
            </td>
         </tr>`
        : ''
    }
    ${
      totalFees.monthlyAmountAfterDiscount
        ? `<tr>
            <td class="total-service-bordless"> Discount ${
              totalFees &&
              totalFees.monthlyAmountAfterDiscount &&
              totalFees &&
              totalFees.monthlyDiscountType === 'percentage'
                ? `(${totalFees && totalFees.monthlyDiscount}%)`
                : ''
            }</td>
            <td class="total-service-bordless text-right"> -$${
              totalFees && totalFees.monthlyAmountAfterDiscount
                ? totalFees &&
                  totalFees.monthlyAmountAfterDiscount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : 0
            }
            </td>
         </tr>`
        : ''
    }

         <tr>
            <td class="total-service" style="padding-top: 5px"> Total</td>
            <td class="total-service text-right" style="padding-top: 5px;"> $${
              totalFees && totalFees.monthlyTotal
                ? totalFees.monthlyTotal
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : 0
            }
            </td>
         </tr>
         `;
    // return `
    // ${
    //   details && details.total_fee && details.total_fee.monthly_service_discount
    //     ? `<tr>
    //         <td class="total-service-bordless"> Sub-total</td>
    //         <td class="total-service-bordless text-right">${mapServiceTotal(
    //           'additional_monthly_servces',
    //         )}
    //         </td>
    //      </tr>`
    //     : ''
    // }
    // ${
    //   details && details.total_fee && details.total_fee.monthly_service_discount
    //     ? `<tr>
    //         <td class="total-service-bordless"> Discount ${
    //           details &&
    //           details.monthly_discount_amount &&
    //           details &&
    //           details.monthly_discount_type === 'percentage'
    //             ? `(${details && details.monthly_discount_amount}%)`
    //             : ''
    //         }</td>
    //         <td class="total-service-bordless text-right"> -$${
    //           details &&
    //           details.total_fee &&
    //           details.total_fee.monthly_service_discount
    //             ? details &&
    //               details.total_fee &&
    //               details.total_fee.monthly_service_discount
    //                 .toString()
    //                 .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    //             : 0
    //         }
    //         </td>
    //      </tr>`
    //     : ''
    // }

    //      <tr>
    //         <td class="total-service" style="padding-top: 5px"> Total</td>
    //         <td class="total-service text-right" style="padding-top: 5px;"> $${
    //           details &&
    //           details.total_fee &&
    //           details.total_fee.monthly_service_after_discount
    //             ? details.total_fee.monthly_service_after_discount
    //                 .toString()
    //                 .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    //             : 0
    //         }
    //         </td>
    //      </tr>
    //      `;
  };

  const showStandardServicesTable = () => {
    return `
   <div class="table-responsive"><table class=" contact-list " style="width: 100%; overflow:auto;
    border-collapse: collapse;"><tr><th colspan="3" style="text-align: left; border: 1px solid black;
    padding: 13px;  ">Service Components</th></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Expert Strategy and Consultation (AGS)</td><td style="border: 1px solid black;
    padding: 13px;">Strategic Plan (Audit, SWOT Analysis, Critical Issues)</td><td style="border: 1px solid black;
    padding: 13px;">Weekly Call</td></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Listing Optimization - Copy <br><span style="font-weight: 800;"> ASIN&rsquo;s per month: <span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold"> ${
      formData && formData.content_optimization
        ? formData && formData.content_optimization
        : 0
    }</span></span></td><td style="border: 1px solid black;
    padding: 13px;">Listing Optimization - Design <br> <span style="font-weight: 800;"> ASIN&rsquo;s per month: <span style=" background:#ffe5df;padding: 4px 9px;font-weight: bold"> ${
      formData && formData.design_optimization
        ? formData && formData.design_optimization
        : 0
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
    padding: 13px;"> ${
      formData && formData.seller_type && formData.seller_type.label
        ? [
            formData && formData.seller_type && formData.seller_type.label
              ? formData && formData.seller_type && formData.seller_type.label
              : formData && formData.seller_type && formData.seller_type,
          ]
        : ''
    } Account Management</td></tr><tr><td style="border: 1px solid black;
    padding: 13px;">Review Strategy</td><td style="border: 1px solid black;
    padding: 13px;">Total Managed Ad Spend</td><td style="border: 1px solid black;
    padding: 13px;">Channel Governance Consultation</td></tr></table> </div>
  `;
  };
  const mapOnetimeServiceTotal = () => {
    const totalFees = calculateTodalFee('onetime');
    return `
    ${
      totalFees && totalFees.oneTimeAmountAfterDiscount
        ? `<tr>
            <td class="total-service-borderless" style="border-bottom: hidden; padding: 5px 13px" colspan="3"> Sub-total</td>
            <td class="total-service-borderless text-right" style="border-bottom: hidden; padding: 5px 13px">$${
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
             ? `<tr>
            <td class="total-service-borderless"style="border-bottom: hidden; padding: 5px 13px" colspan="3"> Discount ${
              totalFees &&
              totalFees.oneTimeAmountAfterDiscount &&
              totalFees &&
              totalFees.oneTimeDiscountType === 'percentage'
                ? `(${totalFees && totalFees.oneTimeDiscount}%)`
                : ''
            }</td>
            <td class="total-service-borderless text-right" style="border-bottom: hidden; padding: 5px 13px"> -$${
              totalFees &&
              totalFees.oneTimeAmountAfterDiscount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            </td>
         </tr>`
             : ''
         }
         
         <tr>
            <td class="total-service" colspan="3" style=" padding-top: 5px "> Total</td>
            <td class="total-service text-right"style="padding-top: 5px "> $${
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
    //     ? `<tr>
    //         <td class="total-service-borderless" style="border-bottom: hidden; padding: 5px 13px" colspan="3"> Sub-total</td>
    //         <td class="total-service-borderless text-right" style="border-bottom: hidden; padding: 5px 13px">$${
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
    //      ${
    //        details &&
    //        details.total_fee &&
    //        details.total_fee.onetime_service_discount
    //          ? `<tr>
    //         <td class="total-service-borderless"style="border-bottom: hidden; padding: 5px 13px" colspan="3"> Discount ${
    //           details &&
    //           details.one_time_discount_amount &&
    //           details &&
    //           details.one_time_discount_type === 'percentage'
    //             ? `(${details && details.one_time_discount_amount}%)`
    //             : ''
    //         }</td>
    //         <td class="total-service-borderless text-right" style="border-bottom: hidden; padding: 5px 13px"> -$${
    //           details &&
    //           details.total_fee &&
    //           details.total_fee.onetime_service_discount
    //             .toString()
    //             .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    //         }
    //         </td>
    //      </tr>`
    //          : ''
    //      }

    //      <tr>
    //         <td class="total-service" colspan="3" style=" padding-top: 5px "> Total</td>
    //         <td class="total-service text-right"style="padding-top: 5px "> $${
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

  const mapMonthlyServices = (key) => {
    const fields = [];
    if (key !== 'additional_one_time_services') {
      if (formData && formData[key]) {
        for (const item of formData[key]) {
          const fixedFee = servicesFees.filter((n) => n.id === item.service_id);
          if (
            (item.service && item.service.name !== undefined) ||
            item.name !== undefined
          ) {
            if (
              // (item.name
              //   ? item.name !== 'DSP Advertising'
              //   : item.service.name !== 'DSP Advertising') &&
              item.name
                ? item.name !== 'Inventory Reconciliation'
                : item.service.name !== 'Inventory Reconciliation'
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
                          ? `${displayNumber(item.service.fee)}`
                          : // .toString()
                          // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          item.fee
                          ? displayNumber(item.fee)
                          : // .toString()
                            // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            ''
                      } /month
                  </td>`
                    : (
                        item.name
                          ? item.name === 'DSP Advertising'
                          : item.service.name === 'DSP Advertising'
                      )
                    ? `<td>N/A</td>`
                    : // <td>Yet to save 423</td>
                      `<td>
                    ${
                      fixedFee && fixedFee[0] && fixedFee[0].fee
                        ? `$${displayNumber(fixedFee[0].fee)} /month`
                        : '$0'
                    }
                    </td>`
                }
                </tr>`,
              );
            }
          }
        }
      }
    } else if (formData && formData.additional_one_time_services) {
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
                        ? `<td>
                                $${
                                  displayNumber(
                                    service.custom_amazon_store_price,
                                  )
                                  // .toString()
                                  // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                               </td>`
                        : // <td>Yet to save 465</td>
                          `<td>${
                            fixedFee && fixedFee[0] && fixedFee[0].fee
                              ? `$${displayNumber(fixedFee[0].fee)}`
                              : '$0' // for amazon store option
                          }</td>`
                      : service && service.service && service.service.fee
                      ? `<td>
                           $${
                             service && service.service && service.service.fee
                               ? displayNumber(service.service.fee)
                               : ''
                           } </td>`
                      : // <td>Yet to save</td>
                        `<td>
                      ${
                        fixedFee && fixedFee[0] && fixedFee[0].fee
                          ? `$${displayNumber(fixedFee[0].fee)}`
                          : '$0' // for amazon store option
                      }
                       </td>`
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
            : // <td>Yet to save</td>
              `<td>${(service.quantity &&
              fixedFee &&
              fixedFee[0] &&
              fixedFee[0].fee
                ? `$${service.quantity * fixedFee[0].fee}`
                : '$0'
              )
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>`
          : service.quantity && service.custom_amazon_store_price
          ? `<td style="border: 1px solid black;padding: 13px;">$${(service.quantity &&
            service.custom_amazon_store_price
              ? service.quantity * service.custom_amazon_store_price
              : ''
            )
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </td>`
          : // <td>Yet to save</td>
            `<td>${(service.quantity &&
            fixedFee &&
            fixedFee[0] &&
            fixedFee[0].fee
              ? `$${service.quantity * fixedFee[0].fee}`
              : '$0'
            )
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>`
      }
         
                  
                  </tr>`,
        );
      });
    }
    // return fields.length ? fields.toString().replaceAll(',', '') : '';
    return fields.length ? fields.toString().replaceAll('>,<', '><') : '';
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

  const showBillingCap = () => {
    if (formData && formData.billing_cap) {
      return `<br><br><div class=" text-center " style="text-align: center;"><span style="font-weight: 800;
      font-family: Helvetica-bold;"> Billing Cap </span> </div><div style="text-align: center;">Maximum amount that will be charged between the monthly retainer and revenue share.</div>
      <div class=" text-center input-contact-value mt-3" style="margin-top: 1rem!important; text-align: center;"><span style="background:#ffe5df;padding: 4px 9px; font-weight: bold"> 
      ${mapDefaultValues(
        'billing_cap',
        'Billing Cap',
        'number-currency',
      )}</span></div>`;
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
                  mapDefaultValues('company_name', 'Customer Name'),
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
                // <br><br><div class=" text-center input-contact-value mt-3" style="margin-top: 1rem!important; text-align: center;"></div>
                .replace('BILLING_CAP_AMOUNT', showBillingCap())
                .replace('REV_SHARE_TABLE', showRevTable())
                .replace(
                  'REVENUE_SHARE',
                  mapDefaultValues('rev_share', 'Rev Share'),
                )
                .replace(
                  'REV_THRESHOLD',
                  mapDefaultValues(
                    'threshold_type',
                    'Rev Threshold',
                    // 'number-currency',
                  ),
                )
                // .replace(
                //   'SELLER_TYPE',
                //   mapDefaultValues('seller_type', 'Seller Type'),
                // )
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
                )
                .replace(
                  'BILLING_CAP_AMOUNT',
                  mapDefaultValues(
                    'billing_cap',
                    'Billing Cap',
                    'number-currency',
                  ),
                ),
            // .replace(
            //   'BILLING_CAP_AMOUNT',
            //   mapDefaultValues(
            //     'billing_cap',
            //     'Billing Cap',
            //     'number-currency',
            //   ),
            // ),
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
  servicesFees: {},
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
    billing_cap: PropTypes.string,
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
    seller_type: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
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
    customer_id: PropTypes.shape({
      address: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zip_code: PropTypes.string,
    }),
    monthly_discount_type: PropTypes.string,
    monthly_discount_amount: PropTypes.number,
    one_time_discount_type: PropTypes.string,
    one_time_discount_amount: PropTypes.number,
    threshold_type: PropTypes.string,
    yoy_percentage: PropTypes.string,
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
  servicesFees: PropTypes.shape({
    fee: PropTypes.number,
    filter: PropTypes.func,
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
