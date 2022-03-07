/* eslint-disable react/no-danger */
import React from 'react';

import dayjs from 'dayjs';
import { string, number, func, oneOfType, arrayOf, shape } from 'prop-types';

import { additionaMarketplaceAmount } from '../../constants';
import { StatementParagraph } from '../../theme/AgreementStyle';

export default function Statement({
  formData,
  templateData,
  notIncludedOneTimeServices,
  notIncludedMonthlyServices,
  servicesFees,
  discountData,
  selectedCurrency,
}) {
  const sellerTypeLabel = formData?.seller_type?.label;
  const accountType = formData?.seller_type?.value;

  const displayNumber = (num) => {
    const res = num?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return res;
  };

  const mapDefaultValues = (key, label, type) => {
    if (
      type === 'amazon' &&
      key === 'seller_type' &&
      formData?.seller_type?.label === 'Hybrid'
    )
      return 'Seller';
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
        return formData?.primary_marketplace?.name
          ? formData.primary_marketplace.name
          : formData.primary_marketplace;
      }
      return `Enter ${label}`;
    }
    if (key === 'threshold_type') {
      if (formData && formData[key] === 'YoY') {
        return 'YoY: All channel sales above previous year channel sales.';
      }
      if (formData && formData[key] === 'YoY + %') {
        return `YoY + %: All channel sales above a <span style=" background:#ffe5df;padding: 4px 9px;font-weight: bold">${
          formData && formData.yoy_percentage
            ? formData && formData.yoy_percentage
            : `Enter ${label}`
        }</span> growth on previous year channel sales.`;
      }
      if (formData && formData[key] === 'Fixed') {
        return `Fixed: <span style=" background:#ffe5df;padding: 4px 9px;font-weight: bold">${
          formData && formData.sales_threshold
            ? `${selectedCurrency} ${displayNumber(
                formData && formData.sales_threshold,
              )}`
            : `Enter ${label}`
        }</span>`;
      }
    }
    if (type && type.includes('number')) {
      // ${type === 'number-currency' ? '$' : '%'}
      if (formData && formData[key]) {
        return `${
          type === 'number-currency' ? selectedCurrency : '%'
        }${`${displayNumber(formData[key])}`}`;
      }
      return `Enter ${label}`;
    }

    return key === 'rev_share' || key === 'seller_type'
      ? formData && formData[key] && formData[key].label
        ? formData[key].label
        : formData[key]
        ? formData[key]
        : `Enter ${label}`
      : formData && formData[key];
  };

  const feeStructure = (type) => {
    if (formData?.fee_structure?.[type]?.fee_type === 'Retainer Only') {
      return `<div class="table-responsive">
          <table class="contact-list mb-3 ">
            <tr>
              <td> <span style=" font-weight: bold";>Fee Type</span></td>
               <td><span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold ; white-space: nowrap"> Retainer Only </span> </td>
              <td>You will only be billed for the monthly retainer amount displayed below. </td>
            </tr>
             <tr  style="vertical-align: text-top;">
              <td> <span style=" font-weight: bold";> Monthly Retainer</span></td>
               <td><span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold; white-space: nowrap" >${selectedCurrency}${displayNumber(
        formData?.fee_structure?.[type]?.monthly_retainer || 0,
      )} </span> </td>
              <td>Monthly fee for the main Amazon marketplace as a retainer for services.
              This retainer is billed in advance for the month in which services are to be rendered. </td>
              </tr>
          </table>
        </div>`;
    }
    if (formData?.fee_structure?.[type]?.fee_type === 'Revenue Share Only') {
      return `<div class="table-responsive">
          <table class="contact-list mb-3 ">
            <tr>
              <td> <span style=" font-weight: bold";>Fee Type</span></td>
               <td><span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold;white-space: nowrap;"> Revenue Share Only  </span> </td>
              <td>You will only be billed for the monthly retainer and revenue share % based on threshold(s) displayed below.</td>
            </tr>
             <tr  style="vertical-align: text-top;">
              <td> <span style=" font-weight: bold";> Revenue Share %</span></td>
               <td><span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${displayNumber(
                 formData?.fee_structure?.[type]?.rev_share || 0,
               )}% </span> </td>
              <td>A percentage of all Managed Channel Sales (retail dollars, net customer returns) 
              for all sales each month through the Amazon Seller Central and/or Vendor Central account(s) that BBE manages for Client. </td></tr>
               ${
                 formData?.fee_structure?.[type]?.billing_minimum
                   ? `<tr  style="vertical-align: text-top;">
              <td> <span style=" font-weight: bold";> Billing Minimum</span></td>
               <td><span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${displayNumber(
                       formData?.fee_structure?.[type]?.billing_minimum || 0,
                     )} </span> </td>
              <td>We will charge the greater of the value shown here or the % of revenue listed above. </td></tr>`
                   : ''
               }
              ${
                formData?.fee_structure?.[type]?.billing_cap
                  ? `<tr  style="vertical-align: text-top;">
              <td> <span style=" font-weight: bold";> Billing Cap</span></td>
              <td><span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${displayNumber(
                      formData?.fee_structure?.[type]?.billing_cap || 0,
                    )} </span> </td>
              <td>We will charge no more than the amount listed here. </td></tr>`
                  : ''
              }
          </table>
        </div>`;
    }
    if (
      formData?.fee_structure?.[type]?.fee_type === 'Retainer + % Rev Share'
    ) {
      return `<div class="table-responsive">
          <table class="contact-list mb-3 ">
            <tr>
              <td> <span style=" font-weight: bold";>Fee Type</span></td>
               <td><span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold;text-transform: capitalize;white-space: nowrap;"> Retainer + % Rev Share 
               (${
                 formData?.fee_structure?.[type]?.threshold_type ===
                   undefined ||
                 formData?.fee_structure?.[type]?.threshold_type === null ||
                 formData?.fee_structure?.[type]?.threshold_type === 'None'
                   ? 'No'
                   : formData?.fee_structure?.[type]?.threshold_type
               } Threshold)  </span> </td>
              <td>You will only be billed for the monthly retainer and revenue share % displayed below.  </td>
            </tr>
            <tr  style="vertical-align: text-top;">
              <td> <span style=" font-weight: bold";> Monthly Retainer</span></td>
               <td><span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${displayNumber(
        formData?.fee_structure?.[type]?.monthly_retainer || 0,
      )} </span> </td>
              <td>Monthly fee for the main Amazon marketplace as a retainer for services. 
              This retainer is billed in advance for the month in which services are to be rendered. </td>
              </tr>

             <tr  style="vertical-align: text-top;">
              <td> <span style=" font-weight: bold";> Revenue Share %</span></td>
               <td><span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${displayNumber(
                 formData?.fee_structure?.[type]?.rev_share || 0,
               )}% </span> </td>
              <td>A percentage of all Managed Channel Sales (retail dollars, net customer returns) 
              for all sales each month through the Amazon Seller Central and/or Vendor Central account(s) that BBE manages for Client. </td></tr>
              ${
                formData?.fee_structure?.[type]?.threshold_type === 'Fixed'
                  ? ` <tr  style="vertical-align: text-top;">
              <td> <span style=" font-weight: bold";> Fixed Threshold </span></td>
               <td><span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${displayNumber(
                      formData?.fee_structure?.[type]?.sales_threshold || 0,
                    )} </span> </td>
              <td>We will bill our revenue share % on any value above this threshold for Amazon Channel Sales (
                retail dollars, net customer returns) each month through the Amazon Seller Central and/or Vendor Central account(s) that BBE manages for Client. </td></tr>`
                  : formData?.fee_structure?.[type]?.threshold_type ===
                    'quarterly'
                  ? ` <tr  style="vertical-align: text-top;">
             <td> <span style=" font-weight: bold";>Quarterly Threshold </span></td>
             <td>
                 1st Quarter:<span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${
                      displayNumber(
                        formData?.fee_structure?.[type]?.quarterly_rev_share?.[
                          '1st quarterly'
                        ],
                      ) || 0
                    } </span><br>
                  2nd Quarter:<span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";> ${selectedCurrency}${
                      displayNumber(
                        formData?.fee_structure?.[type]?.quarterly_rev_share?.[
                          '2nd quarterly'
                        ],
                      ) || 0
                    } </span><br>
                  3rd Quarter:<span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${
                      displayNumber(
                        formData?.fee_structure?.[type]?.quarterly_rev_share?.[
                          '3rd quarterly'
                        ],
                      ) || 0
                    }</span><br>
                  4th Quarter:<span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${
                      displayNumber(
                        formData?.fee_structure?.[type]?.quarterly_rev_share?.[
                          '4th quarterly'
                        ],
                      ) || 0
                    }</span><br>
               </td>
            <td>We will bill our revenue share % on any value above this threshold for Amazon Channel Sales 
            (retail dollars, net customer returns) each month through the Amazon Seller Central and Vendor Central account(s) that BBE manages for Client.
             </td>
          </tr>`
                  : formData?.fee_structure?.[type]?.threshold_type ===
                    'monthly'
                  ? ` <tr  style="vertical-align: text-top;">
             <td> <span style=" font-weight: bold";>Monthly Threshold </span></td>
             <td>
                 January:<span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${
                      displayNumber(
                        formData?.fee_structure?.[type]?.monthly_rev_share?.[
                          'january month'
                        ],
                      ) || 0
                    } </span><br>
                  February:<span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";> ${selectedCurrency}${
                      displayNumber(
                        formData?.fee_structure?.[type]?.monthly_rev_share?.[
                          'february month'
                        ],
                      ) || 0
                    } </span><br>
                  March:<span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${
                      displayNumber(
                        formData?.fee_structure?.[type]?.monthly_rev_share?.[
                          'march month'
                        ],
                      ) || 0
                    }</span><br>
                  April:<span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${
                      displayNumber(
                        formData?.fee_structure?.[type]?.monthly_rev_share?.[
                          'april month'
                        ],
                      ) || 0
                    }</span><br>
                   May:<span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${
                      displayNumber(
                        formData?.fee_structure?.[type]?.monthly_rev_share?.[
                          'may month'
                        ],
                      ) || 0
                    } </span><br>
                  June:<span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";> ${selectedCurrency}${
                      displayNumber(
                        formData?.fee_structure?.[type]?.monthly_rev_share?.[
                          'june month'
                        ],
                      ) || 0
                    } </span><br>
                  July:<span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${
                      displayNumber(
                        formData?.fee_structure?.[type]?.monthly_rev_share?.[
                          'july month'
                        ],
                      ) || 0
                    }</span><br>
                  August:<span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${
                      displayNumber(
                        formData?.fee_structure?.[type]?.monthly_rev_share?.[
                          'august month'
                        ],
                      ) || 0
                    }</span><br>
                   September:<span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${
                      displayNumber(
                        formData?.fee_structure?.[type]?.monthly_rev_share?.[
                          'september month'
                        ],
                      ) || 0
                    } </span><br>
                  October:<span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";> ${selectedCurrency}${
                      displayNumber(
                        formData?.fee_structure?.[type]?.monthly_rev_share?.[
                          'october month'
                        ],
                      ) || 0
                    } </span><br>
                  November:<span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${
                      displayNumber(
                        formData?.fee_structure?.[type]?.monthly_rev_share?.[
                          'november month'
                        ],
                      ) || 0
                    }</span><br>
                  December:<span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${
                      displayNumber(
                        formData?.fee_structure?.[type]?.monthly_rev_share?.[
                          'december month'
                        ],
                      ) || 0
                    }</span><br>
               </td>
            <td>We will bill our revenue share % on any value above this threshold for Amazon Channel Sales (retail dollars, net customer returns) 
            each month through the Amazon Seller Central and/or Vendor Central account(s) that BBE manages for Client.
             </td>
          </tr>`
                  : ''
              }
              ${
                formData?.fee_structure?.[type]?.billing_cap
                  ? `<tr  style="vertical-align: text-top;">
              <td> <span style=" font-weight: bold";> Billing Cap</span></td>
               <td><span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";>${selectedCurrency}${displayNumber(
                      formData?.fee_structure?.[type]?.billing_cap || 0,
                    )} </span> </td>
              <td>We will charge no more than the amount listed here. </td></tr>`
                  : ''
              }
          </table>
        </div>`;
    }
    return '';
  };

  const showRevTable = () => {
    if (formData?.seller_type?.label === 'Seller')
      return feeStructure('seller');
    if (formData?.seller_type?.label === 'Vendor')
      return feeStructure('vendor');
    if (formData?.seller_type?.label === 'Hybrid') {
      return `${feeStructure('seller')} 
         <div class=" text-center BT-SOW-sales-commission mt-5" style="text-align: center; margin-top: 3rem!important;">
      <span style="font-weight: 800;
        font-family: Helvetica-bold;" >Fees & Sales Commissions for Amazon Vendor Account
       </span>
        <br> Sales billed in arrears for the prior month in which sales were made on the account and calculated as follows:
    </div></br>${feeStructure('vendor')} `;
    }
    return '';
  };

  const displayNotIncludedServices = () => {
    const fields = [];
    for (const item of notIncludedMonthlyServices) {
      fields.push(
        `<tr>
          <td style="border: 1px solid black;padding: 13px;"> ${
            item.name ? item.name : 'N/A'
          }</td>
          <td style="border: 1px solid black;padding: 13px;"> ${' Monthly'}</td>
         </tr>`,
      );
    }
    for (const item of notIncludedOneTimeServices) {
      fields.push(
        `<tr>
          <td style="border: 1px solid black; padding: 13px;"> ${
            item.label ? item.label : 'N/A'
          }</td>
          <td style="border: 1px solid black; padding: 13px;"> ${'One Time'}</td>
         </tr>`,
      );
    }
    return fields.length ? fields.toString().replaceAll(',', '') : 'No Data';
  };

  const mapVariableMonthlyService = (data) => {
    const fields = [
      `<tr ><td class="total-service" colspan="2" style ="text-align: center">Variable Monthly Services</td></tr>`,
    ];
    if (data) {
      for (const item of data) {
        if (
          item.name
            ? item.name === 'Inventory Reconciliation'
            : item.service.name === 'Inventory Reconciliation'
        ) {
          fields.push(
            `<tr>
              <td style="border: 1px solid black;padding: 13px;">${
                item.service ? item.service.name : item?.name
              }</td>
              <td style="border: 1px solid black;padding: 13px;">  <span style=" background:#ffe5df; padding: 4px 9px;"> 25% of recovered ${selectedCurrency}<span>&#39;</span>s </span></td>
            </tr>`,
          );
        }
      }
      return fields.length > 1 ? fields.toString().replaceAll(',', '') : '';
    }
    return '';
  };
  const mapAdditionalMarketPlaces = (marketplaceData) => {
    const fields = [];
    if (marketplaceData) {
      for (const item of marketplaceData) {
        fields.push(
          `<tr> 
            <td style="border: 1px solid black;padding: 13px;">${
              item.service ? item.service.name : item?.name
            }</td>
            ${
              item?.fee
                ? `<td style="border: 1px solid black;padding: 13px;">
                 <span style=" background:#ffe5df; padding: 4px 9px;"> 
                ${selectedCurrency}${
                    item.service
                      ? displayNumber(item.service.fee)
                      : item.fee
                      ? displayNumber(item.fee)
                      : ''
                  }
                /month
                </span>
              </td>`
                : `<td>
                 <span style=" background:#ffe5df; padding: 4px 9px;"> 
                ${selectedCurrency}${displayNumber(
                    additionaMarketplaceAmount,
                  )} /month </span></td>`
            }
          </tr>`,
        );
      }
    }
    return fields.length ? fields.toString().replaceAll('>,<', '><') : '';
  };

  const calculateTodalFee = (type, data, marketplaceData, accntType) => {
    let oneTimeSubTotal = 0;
    let monthlySubTotal = 0;
    let oneTimeDiscount = 0;
    let monthlyDiscount = 0;
    let additionalMarketplacesTotal = 0;

    if (formData) {
      if (type === 'monthly') {
        // caculate the total of additional monthly serviece
        if (data !== null) {
          data.forEach((item) => {
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
        if (marketplaceData !== null) {
          // calculate the total of additional marketplaces
          marketplaceData.forEach((item) => {
            if (item && item.fee) {
              additionalMarketplacesTotal += item.fee;
            } else {
              additionalMarketplacesTotal += additionaMarketplaceAmount;
            }
          });

          monthlySubTotal += additionalMarketplacesTotal;
        }

        const monthlyDiscountData = discountData.find(
          (item) =>
            item.service_type === 'monthly service' &&
            item?.account_type === accntType,
        );

        if (monthlyDiscountData !== null) {
          const discountType = monthlyDiscountData?.type;
          if (discountType === 'percentage') {
            monthlyDiscount =
              (monthlySubTotal * monthlyDiscountData?.amount) / 100;
          } else if (discountType === 'fixed amount') {
            monthlyDiscount = monthlyDiscountData?.amount;
          }
        } else {
          monthlyDiscount = monthlyDiscountData?.amount;
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

  const mapMonthlyServiceTotal = (data, marketplaceData, accntType) => {
    const totalFees = calculateTodalFee(
      'monthly',
      data,
      marketplaceData,
      accntType,
    );
    return `
    ${
      totalFees.monthlyAmountAfterDiscount
        ? `<tr>
            <td class="total-service-bordless"> Sub-total</td>
            <td class="total-service-bordless text-right">
             <span style=" background:#ffe5df; padding: 4px 9px;"> 
            ${selectedCurrency}${displayNumber(totalFees.monthlySubTotal)}
            </span>
            </td>
         </tr>`
        : ''
    }
    ${
      totalFees.monthlyAmountAfterDiscount
        ? `<tr>
            <td class="total-service-bordless"> Discount ${
              totalFees?.monthlyAmountAfterDiscount &&
              totalFees?.monthlyDiscountType === 'percentage'
                ? `(${totalFees?.monthlyDiscount}%)`
                : ''
            }</td>
            <td class="total-service-bordless text-right">
             <span style=" background:#ffe5df; padding: 4px 9px;"> 
            -${selectedCurrency}${
            totalFees?.monthlyAmountAfterDiscount
              ? displayNumber(totalFees?.monthlyAmountAfterDiscount)
              : 0
          }
            </span>
            </td>
         </tr>`
        : ''
    }
      <tr>
        <td class="total-service" style="padding-top: 5px"> Total</td>
        <td class="total-service text-right" style="padding-top: 5px;"> 
         <span style=" background:#ffe5df; padding: 4px 9px;"> 
          ${selectedCurrency}${
      totalFees?.monthlyTotal ? displayNumber(totalFees.monthlyTotal) : 0
    }
          </span>
        </td>
      </tr>`;
  };

  const showStandardServicesTable = () => {
    return `<div class="table-responsive">
        <table class=" contact-list " style="width: 100%; overflow:auto; border-collapse: collapse;">
          <tr><th colspan="3" style="text-align: left; border: 1px solid black;padding: 13px;">Service Components</th></tr>
          <tr>
            <td style="border: 1px solid black; padding: 13px;">Expert Strategy and Consultation</td>
            <td style="border: 1px solid black; padding: 13px;">Strategic Plan (Audit, SWOT Analysis, Critical Issues)</td>
            <td style="border: 1px solid black; padding: 13px;">Weekly Call</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 13px;">Listing Optimization - Copy <br>
              <span style="font-weight: 800;"> ASIN&rsquo;s per month: 
              <span style=" background:#ffe5df; padding: 4px 9px; font-weight: bold"> 
                ${
                  formData?.content_optimization
                    ? formData?.content_optimization
                    : 0
                }
              </span>
              </span>
            </td>
            <td style="border: 1px solid black;padding: 13px;">Listing Optimization - Design <br> 
              <span style="font-weight: 800;"> ASIN&rsquo;s per month: 
              <span style=" background:#ffe5df;padding: 4px 9px;font-weight: bold"> 
                ${
                  formData?.design_optimization
                    ? formData?.design_optimization
                    : 0
                }
              </span>
              </span>
            </td>
            <td style="border: 1px solid black; padding: 13px;">Listing Creation</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 13px;">Listing Compliance</td>
            <td style="border: 1px solid black; padding: 13px;">Brand Registry Consultation</td>
            <td style="border: 1px solid black; padding: 13px;">Catalog Management and Organization</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 13px;">Seller Performance Consultation</td>
            <td style="border: 1px solid black; padding: 13px;">Reporting</td>
            <td style="border: 1px solid black; padding: 13px;">Holiday and Seasonal Preparation</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 13px;">Promotion Planning and Support</td>
            <td style="border: 1px solid black; padding: 13px;">Advertising Management</td>
            <td style="border: 1px solid black; padding: 13px;"> 
              ${
                sellerTypeLabel
                  ? [
                      sellerTypeLabel ||
                        (formData?.seller_type && formData.seller_type),
                    ]
                  : ''
              } Account Management
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 13px;">Review Strategy</td>
            <td style="border: 1px solid black; padding: 13px;">Total Managed Ad Spend</td>
            <td style="border: 1px solid black; padding: 13px;">Channel Governance Consultation</td>
          </tr>
        </table> 
      </div>
  `;
  };
  const mapOnetimeServiceTotal = () => {
    const totalFees = calculateTodalFee('onetime');
    return `
    ${
      totalFees?.oneTimeAmountAfterDiscount
        ? `<tr>
            <td class="total-service-borderless" style="border-bottom: hidden; padding: 5px 13px" colspan="3"> Sub-total</td>
            <td class="total-service-borderless text-right" style="border-bottom: hidden; padding: 5px 13px">
            <span style=" background:#ffe5df; padding: 4px 9px; ">
            ${selectedCurrency}${displayNumber(totalFees?.oneTimeSubTotal)}
            </span>
            </td>
         </tr>`
        : ''
    }
    ${
      totalFees?.oneTimeAmountAfterDiscount
        ? `<tr>
            <td class="total-service-borderless"style="border-bottom: hidden; padding: 5px 13px" colspan="3"> Discount ${
              totalFees?.oneTimeAmountAfterDiscount &&
              totalFees?.oneTimeDiscountType === 'percentage'
                ? `(${totalFees?.oneTimeDiscount}%)`
                : ''
            }</td>
            <td class="total-service-borderless text-right" style="border-bottom: hidden; padding: 5px 13px">
            <span style=" background:#ffe5df; padding: 4px 9px; ">
            
            -${selectedCurrency}${displayNumber(
            totalFees?.oneTimeAmountAfterDiscount,
          )}
            </span>
            </td>
         </tr>`
        : ''
    }        
         <tr>
            <td class="total-service" colspan="3" style=" padding-top: 5px "> Total</td>
            <td class="total-service text-right"style="padding-top: 5px ">
            <span style=" background:#ffe5df; padding: 4px 9px; ">
            
            ${selectedCurrency}${displayNumber(totalFees?.oneTimeTotal)}
            </span>
            </td>
         </tr>
         `;
  };
  const customAmazonStorePrice = (fee) => {
    return `<td style="border: 1px solid black;padding: 13px;">
     <span style=" background:#ffe5df; padding: 4px 9px;"> 
                
        ${
          fee
            ? `${selectedCurrency}${displayNumber(fee)}`
            : `${selectedCurrency}0`
        }
        </span>
      </td>`;
  };
  const tdService = (service, fee) => {
    return `<td style="border: 1px solid black; padding: 13px;">
     <span style=" background:#ffe5df; padding: 4px 9px;"> 

          ${
            service.quantity && fee
              ? `${selectedCurrency}${displayNumber(service.quantity * fee)}`
              : `${selectedCurrency}0`
          }
          </span>
        </td>
        `;
  };

  const mapMonthlyServices = (key, data) => {
    const fields = [];
    if (key !== 'additional_one_time_services') {
      if (data) {
        for (const item of data) {
          const fixedFee = servicesFees.filter((n) => n.id === item.service_id);
          if (
            (item.service && item.service.name !== undefined) ||
            item.name !== undefined
          ) {
            if (
              item.name
                ? item.name !== 'Inventory Reconciliation'
                : item.service.name !== 'Inventory Reconciliation'
            ) {
              fields.push(
                `<tr>
                <td style="border: 1px solid black;padding: 13px;">${
                  item.service ? item.service.name : item?.name
                }</td>
                ${
                  item.service?.fee
                    ? `<td style="border: 1px solid black;padding: 13px;">
                     <span style=" background:#ffe5df; padding: 4px 9px;"> 
                    ${selectedCurrency}${
                        item.service
                          ? `${displayNumber(item.service.fee)}`
                          : item.fee
                          ? displayNumber(item.fee)
                          : ''
                      } /month
                    </span>
                  </td>`
                    : (
                        item.name
                          ? item.name === 'DSP Advertising'
                          : item.service.name === 'DSP Advertising'
                      )
                    ? `<td>  <span style=" background:#ffe5df; padding: 4px 9px;"> N/A </span></td>`
                    : `<td>
                     <span style=" background:#ffe5df; padding: 4px 9px;"> 
                    ${
                      fixedFee && fixedFee[0] && fixedFee[0].fee
                        ? `${selectedCurrency}${displayNumber(
                            fixedFee[0].fee,
                          )} /month`
                        : `${selectedCurrency}0`
                    }
                    </span>
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
            <td style="border: 1px solid black;padding: 13px; ">
                   <span style=" background:#ffe5df; padding: 4px 9px;"> 

              ${service.quantity ? displayNumber(service.quantity) : 0}
              </span>
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
                service && service.name
                  ? service.name.includes('Amazon Store Package Custom')
                  : service?.service?.name.includes(
                      'Amazon Store Package Custom',
                    )
              )
                ? service.custom_amazon_store_price
                  ? `<td>
                   <span style=" background:#ffe5df; padding: 4px 9px; "> 
                  ${selectedCurrency}${displayNumber(
                      service.custom_amazon_store_price,
                    )}</span></td>`
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
                service && service.name
                  ? service.name !== 'Amazon Store Package Custom'
                  : service &&
                    service.service?.name !== 'Amazon Store Package Custom'
              )
                ? service.quantity && service.service?.fee
                  ? tdService(service, service.service?.fee)
                  : tdService(
                      service,
                      fixedFee && fixedFee[0] && fixedFee[0].fee,
                    )
                : service.quantity && service.custom_amazon_store_price
                ? tdService(service, service.custom_amazon_store_price)
                : tdService(service, fixedFee && fixedFee[0] && fixedFee[0].fee)
            }                
          </tr>`,
        );
      });
    }
    return fields.length ? fields.toString().replaceAll('>,<', '><') : '';
  };

  const getServicesAccordingToAccType = (data, option) => {
    const result = data && data.filter((item) => item.account_type === option);
    return result;
  };

  const showMonthlyServiceTable = (accntTYpe, data, marketplaceData) => {
    if (data?.length || marketplaceData?.length) {
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center">
      <span style="font-weight: 800; font-family: Helvetica-bold;">Additional Monthly Services for Amazon ${accntTYpe} Account </span>
      <br> The following additional monthly services will be provided to Client in addition to the Monthly Retainer.</div><br>
      <div class="table-responsive">
        <table class="contact-list ">
          <tr>
            <th>Service</th>
            <th>Service Fee</th>
          </tr>
            ${mapMonthlyServices('additional_monthly_services', data)}
          ${mapAdditionalMarketPlaces(marketplaceData)}
          ${mapMonthlyServiceTotal(data, marketplaceData, accntTYpe)}
          ${mapVariableMonthlyService(data)}   
        </table>
      </div>`;
    }
    return '';
  };

  const showMonthlyServiceTablesAccordingToAccType = () => {
    if (accountType === 'Seller') {
      const sellerResult = getServicesAccordingToAccType(
        formData?.additional_monthly_services,
        'Seller',
      );
      const marketplaceResult = getServicesAccordingToAccType(
        formData?.additional_marketplaces,
        'Seller',
      );
      return showMonthlyServiceTable('Seller', sellerResult, marketplaceResult);
    }
    if (accountType === 'Vendor') {
      const vendorResult = getServicesAccordingToAccType(
        formData?.additional_monthly_services,
        'Vendor',
      );
      const marketplaceResult = getServicesAccordingToAccType(
        formData?.additional_marketplaces,
        'Vendor',
      );
      return showMonthlyServiceTable('Vendor', vendorResult, marketplaceResult);
    }
    if (accountType === 'Hybrid') {
      const sellerResult = getServicesAccordingToAccType(
        formData?.additional_monthly_services,
        'Seller',
      );

      const vendorResult = getServicesAccordingToAccType(
        formData?.additional_monthly_services,
        'Vendor',
      );

      const sellerMarketplaceResult = getServicesAccordingToAccType(
        formData?.additional_marketplaces,
        'Seller',
      );

      const vendorMarketplaceResult = getServicesAccordingToAccType(
        formData?.additional_marketplaces,
        'Vendor',
      );

      if (
        (sellerResult && sellerResult.length) ||
        (vendorResult && vendorResult.length) ||
        (sellerMarketplaceResult && sellerMarketplaceResult.length) ||
        (vendorMarketplaceResult && vendorMarketplaceResult.length)
      ) {
        const sellerTable = showMonthlyServiceTable(
          'Seller',
          sellerResult,
          sellerMarketplaceResult,
        );
        const venderTable = showMonthlyServiceTable(
          'Vendor',
          vendorResult,
          vendorMarketplaceResult,
        );

        return sellerTable + venderTable;
      }

      if (sellerResult && sellerResult.length) {
        return showMonthlyServiceTable(
          'Seller',
          sellerResult,
          sellerMarketplaceResult,
        );
      }

      if (vendorResult && vendorResult.length) {
        return showMonthlyServiceTable(
          'Vendor',
          vendorResult,
          vendorMarketplaceResult,
        );
      }
    }
    return '';
  };

  const showOneTimeServiceTable = () => {
    if (formData?.additional_one_time_services?.length) {
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center;">
        <span style="font-weight: 800; font-family: Helvetica-bold;">Additional One Time Services </span>
        <br>The following additional monthly services will be provided to Client as a one time service in addition to the Monthly Retainer and any Additional Monthly services.</div><br>
        <div class="table-responsive">
        <table class="contact-list ">
          <tr>
            <th>Quantity</th>
            <th>Service</th>
            <th>Service Fee</th>
            <th>Total Service Fee</th>
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

  const showBillingCap = () => {
    if (formData && formData.billing_cap) {
      return `<br><br><div class=" text-center " style="text-align: center;">
      <span style="font-weight: 800; font-family: Helvetica-bold;"> Billing Cap </span> </div>
      <div style="text-align: center;">Maximum amount that will be charged between the monthly retainer and revenue share.</div>
      <div class=" text-center input-contact-value mt-3" style="margin-top: 1rem!important; text-align: center;">
        <span style="background:#ffe5df;padding: 4px 9px; font-weight: bold"> 
          ${mapDefaultValues('billing_cap', 'Billing Cap', 'number-currency')}
        </span>
      </div>`;
    }
    return '';
  };

  const showNotIncludedServicesTable = () => {
    if (
      notIncludedMonthlyServices.length ||
      notIncludedOneTimeServices.length
    ) {
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center;">
        <span style="font-weight: 800; font-family: Helvetica-bold;">Additional Services Not Included</span>
          <br>The following services are not part of this agreement, but can be purchased after signing by working with your Buy Box Experts Brand Growth Strategist or Sales Representative.</div><div class="table-responsive"><br> 
          <table class="contact-list " style="width: 100%;border-collapse: collapse;">
            <tr>
              <th style="text-align: left; border: 1px solid black; padding: 13px;">Service</th>
              <th style="text-align: left; border: 1px solid black; padding: 13px;">Service Type</th>
            </tr>
             ${displayNotIncludedServices()}
          </table>
        </div>
      `;
      //
    }
    return '';
  };

  return (
    <>
      <StatementParagraph>
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
                  'SELLER_TYPE',
                  mapDefaultValues('seller_type', 'Amazon Account Type'),
                )
                .replace('BILLING_CAP_AMOUNT', showBillingCap())
                .replace('REV_SHARE_TABLE', showRevTable())
                .replace(
                  'REVENUE_SHARE',
                  mapDefaultValues('rev_share', 'Rev Share'),
                )
                .replace(
                  'REV_THRESHOLD',
                  mapDefaultValues('threshold_type', 'Rev Threshold'),
                )

                .replace(
                  'PRIMARY_MARKETPLACE',
                  mapDefaultValues(
                    'primary_marketplace',
                    'Primary Marketplace',
                  ),
                )
                .replace(
                  'MAP_MONTHLY_SERVICES',
                  showMonthlyServiceTablesAccordingToAccType(),
                )
                .replace(
                  'AMAZON_ACCOUNT_TYPE',
                  mapDefaultValues('seller_type', 'Seller Type', 'amazon'),
                )
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
          }}
        />
      </StatementParagraph>
    </>
  );
}

Statement.defaultProps = {
  formData: {},
  templateData: {},
  notIncludedOneTimeServices: [],
  notIncludedMonthlyServices: [],
  servicesFees: {},
  discountData: [],
  selectedCurrency: '$',
};
Statement.propTypes = {
  formData: shape({
    length: oneOfType([
      string,
      shape({
        value: string,
        label: string,
      }),
    ]),
    sales_threshold: string,
    billing_cap: oneOfType([string, number]),
    additional_marketplaces: arrayOf(
      shape({
        service: string,
      }),
    ),
    additional_one_time_services: arrayOf(
      shape({
        service: shape({
          id: string,
        }),
      }),
    ),
    seller_type: shape({
      value: string,
      label: string,
    }),
    primary_marketplace: oneOfType([
      string,
      shape({
        fee: number,
        name: string,
        id: string,
      }),
    ]),
    additional_monthly_services: arrayOf(
      shape({
        service: shape({
          id: string,
        }),
      }),
    ),
    content_optimization: number,
    design_optimization: number,
    customer_id: shape({
      address: string,
      city: string,
      state: string,
      zip_code: string,
    }),
    monthly_discount_amount: oneOfType([string, number]),
    monthly_discount_type: oneOfType([string, number]),
    one_time_discount_type: oneOfType([string, number]),
    one_time_discount_amount: oneOfType([string, number]),
    threshold_type: string,
    yoy_percentage: string,
  }),
  templateData: shape({
    addendum: arrayOf(string),
    statement_of_work: arrayOf(string),
  }),
  notIncludedOneTimeServices: arrayOf(
    shape({
      label: string.isRequired,
    }),
  ),
  notIncludedMonthlyServices: arrayOf(
    shape({
      label: string.isRequired,
    }),
  ),
  servicesFees: arrayOf(
    shape({
      fee: number,
      filter: func,
    }),
  ),
  discountData: arrayOf(shape({})),
  selectedCurrency: string,
};
