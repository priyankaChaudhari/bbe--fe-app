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
}) {
  const sellerTypeLabel = formData?.seller_type?.label;
  const displayNumber = (num) => {
    const res = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return res;
  };

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
        return formData?.primary_marketplace?.name
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
            ? `$${displayNumber(formData && formData.sales_threshold)}`
            : `Enter ${label}.`
        }</span>`;
      }
    }
    if (type && type.includes('number')) {
      // ${type === 'number-currency' ? '$' : '%'}
      if (formData && formData[key]) {
        return `${type === 'number-currency' ? '$' : '%'}${`${displayNumber(
          formData[key],
        )}`}`;
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
  const showRevTable = () => {
    if (formData?.threshold_type && formData.threshold_type !== 'None') {
      return `<div class="table-responsive"> 
          <table class="contact-list ">
            <tr><th>Type</th><th>Description</th><th> Rev Share %</th><th> Sales Threshold Type</th></tr>
            <tr>
              <td>% Of Incremental Sales</td>
              <td>A percentage of all Managed Channel Sales (retail dollars, net customer returns) for all sales over the sales 
              threshold each month through the Amazon Seller Central and Vendor Central account(s) that BBE manages for Client.</td>
              <td><span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold"> REVENUE_SHARE</span>  </td>
              <td> <span>REV_THRESHOLD </span></td>
            </tr>
          </table> 
        </div>`;
    }
    return `<div class="table-responsive"> 
        <table class="contact-list">
          <tr><th>Type</th><th>Description</th><th>Rev Share %</th></tr>
          <tr>
            <td>% Of Sales</td>
            <td>A percentage of all Managed Channel Sales (retail dollars, net customer returns) for all sales each month 
            through the Amazon Seller Central and Vendor Central account(s) that BBE manages for Client. </td>
            <td><span style=" background:#ffe5df;padding: 4px 9px; font-weight: bold";> REVENUE_SHARE </span> </td>
          </tr>
        </table>
      </div>`;
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
          <td style="border: 1px solid black; padding: 13px;"> ${
            item.label ? item.label : 'N/A'
          }</td>
          <td style="border: 1px solid black; padding: 13px;"> ${'One Time'}</td>
         </tr>`,
      );
    }
    return fields.length ? fields.toString().replaceAll(',', '') : 'No Data';
  };

  const mapVariableMonthlyService = () => {
    const fields = [
      `<tr ><td class="total-service" colspan="2" style ="text-align: center">Variable Monthly Services</td></tr>`,
    ];
    if (formData?.additional_monthly_services) {
      for (const item of formData.additional_monthly_services) {
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
              <td style="border: 1px solid black;padding: 13px;">25% of recovered $<span>&#39;</span>s </td>
            </tr>`,
          );
        }
      }
      return fields.length > 1 ? fields.toString().replaceAll(',', '') : '';
    }
    return '';
  };
  const mapAdditionalMarketPlaces = () => {
    const fields = [];
    if (formData?.additional_marketplaces) {
      for (const item of formData.additional_marketplaces) {
        fields.push(
          `<tr> 
            <td style="border: 1px solid black;padding: 13px;">${
              item.service ? item.service.name : item?.name
            }</td>
            ${
              item?.fee
                ? `<td style="border: 1px solid black;padding: 13px;">
                $${
                  item.service
                    ? displayNumber(item.service.fee)
                    : item.fee
                    ? displayNumber(item.fee)
                    : ''
                }
                /month
              </td>`
                : `<td>$${displayNumber(
                    additionaMarketplaceAmount,
                  )} /month</td>`
            }
          </tr>`,
        );
      }
    }
    return fields.length ? fields.toString().replaceAll('>,<', '><') : '';
  };

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
          } else if (item?.service) {
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
            $${displayNumber(totalFees.monthlySubTotal)}
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
            <td class="total-service-bordless text-right"> -$${
              totalFees?.monthlyAmountAfterDiscount
                ? displayNumber(totalFees?.monthlyAmountAfterDiscount)
                : 0
            }
            </td>
         </tr>`
        : ''
    }
      <tr>
        <td class="total-service" style="padding-top: 5px"> Total</td>
        <td class="total-service text-right" style="padding-top: 5px;"> 
          $${
            totalFees?.monthlyTotal ? displayNumber(totalFees.monthlyTotal) : 0
          }
        </td>
      </tr>`;
  };

  const showStandardServicesTable = () => {
    return `<div class="table-responsive">
        <table class=" contact-list " style="width: 100%; overflow:auto; border-collapse: collapse;">
          <tr><th colspan="3" style="text-align: left; border: 1px solid black;padding: 13px;">Service Components</th></tr>
          <tr>
            <td style="border: 1px solid black; padding: 13px;">Expert Strategy and Consultation (AGS)</td>
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
            <td class="total-service-borderless text-right" style="border-bottom: hidden; padding: 5px 13px">$${displayNumber(
              totalFees?.oneTimeSubTotal,
            )}
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
            <td class="total-service-borderless text-right" style="border-bottom: hidden; padding: 5px 13px"> -$${displayNumber(
              totalFees?.oneTimeAmountAfterDiscount,
            )}
            </td>
         </tr>`
        : ''
    }        
         <tr>
            <td class="total-service" colspan="3" style=" padding-top: 5px "> Total</td>
            <td class="total-service text-right"style="padding-top: 5px "> $${displayNumber(
              totalFees?.oneTimeTotal,
            )}
            </td>
         </tr>
         `;
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
                    ? `<td style="border: 1px solid black;padding: 13px;">$${
                        item.service
                          ? `${displayNumber(item.service.fee)}`
                          : item.fee
                          ? displayNumber(item.fee)
                          : ''
                      } /month
                  </td>`
                    : (
                        item.name
                          ? item.name === 'DSP Advertising'
                          : item.service.name === 'DSP Advertising'
                      )
                    ? `<td>N/A</td>`
                    : `<td>
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
            <td style="border: 1px solid black;padding: 13px;">
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
                service && service.name
                  ? service.name.includes('Amazon Store Package Custom')
                  : service?.service?.name.includes(
                      'Amazon Store Package Custom',
                    )
              )
                ? service.custom_amazon_store_price
                  ? `<td>$${displayNumber(
                      service.custom_amazon_store_price,
                    )}</td>`
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

  const showMonthlyServiceTable = () => {
    if (
      formData?.additional_monthly_services?.length ||
      formData?.additional_marketplaces?.length
    ) {
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center">
      <span style="font-weight: 800; font-family: Helvetica-bold;">Additional Monthly Services </span>
      <br> The following additional monthly services will be provided to Client in addition to the Monthly Retainer.</div><br>
      <div class="table-responsive">
        <table class="contact-list ">
          <tr>
            <th>Service</th>
            <th>Service Fee</th>
          </tr>
          ${mapMonthlyServices(
            'additional_monthly_services',
            'Monthly Services',
          )} 
          ${mapAdditionalMarketPlaces()}   
          ${mapMonthlyServiceTotal()}
          ${mapVariableMonthlyService()}
        </table>
      </div>`;
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
};
