/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import styled from 'styled-components';
import dayjs from 'dayjs';
// import NumberFormat from 'react-number-format';

// import Theme from '../../theme/Theme';
import { PageLoader, PageNotFound } from '../../common';
// import { SaveRedCheck } from '../../theme/images';
import AgreementSidePanel from '../../common/AgreementSidePanel';
import { agreementTemplate } from '../../api';
import { getAccountDetails } from '../../store/actions/accountState';

export default function Statement() {
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location.pathname.split('/')[2];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [formData, setFormData] = useState({});
  const [notIncludedOneTimeServices, setNotIncludedOneTimeServices] = useState(
    [],
  );
  const [notIncludedMonthlyServices, setNotIncludedMonthlyServices] = useState(
    [],
  );
  const details = useSelector((state) => state.accountState.data);
  const loader = useSelector((state) => state.accountState.isLoading);

  const apiCalls = useCallback(() => {
    dispatch(getAccountDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    apiCalls();
    agreementTemplate().then((response) => {
      setIsLoading({ loader: true, type: 'page' });
      setData(
        response &&
          response.data &&
          response.data.results &&
          response.data.results[0],
      );
      setIsLoading({ loader: false, type: 'page' });
    });
  }, [apiCalls]);

  const checkPermission = () => {
    if (
      details &&
      details.contract_status &&
      (details.contract_status !== null || details.contract_status !== '')
    ) {
      return true;
    }
    return false;
  };

  const mapDefaultValues = (key, label, type) => {
    if (formData[key] === undefined || formData[key] === '') {
      if (key === 'start_date') {
        return details && dayjs(details[key]).format('MM-DD-YYYY');
      }
      if (key === 'primary_marketplace') {
        if (details && details.primary_marketplace) {
          return (
            details &&
            details.primary_marketplace &&
            details.primary_marketplace.name
          );
        }
        return `Enter ${label}.`;
      }
      if (type && type.includes('number')) {
        return `${type === 'number-currency' ? '$' : '%'} ${
          details && details[key]
            ? details[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : `Enter ${label}.`
        }`;
      }
      return key === 'rev_share' || key === 'seller_type'
        ? details && details[key] && details[key].label
        : details && details[key];
    }
    if (
      formData[key] === undefined ||
      formData[key] === '' ||
      formData[key] === null ||
      (details && Object.keys(details).length === 0)
    ) {
      return `Enter ${label}.`;
    }
    // if (details && details[key] === null) {
    //   return `Enter ${label}.`;
    // }
    return formData[key];
  };

  const showRevTable = () => {
    if (
      // (details && details.sales_threshold) ||
      formData &&
      formData.sales_threshold
    ) {
      return `<table class="contact-list "><tr><th>Type</th><th>Description</th><th> Rev Share %</th><th> Sales Threshold</th>
      </tr><tr><td>% Of Incremental Sales</td>
      <td>A percentage of all Managed Channel Sales (retail dollars, net customer returns) for all sales over the sales 
      threshold each month through the Amazon Seller Central and Vendor Central account(s) that BBE manages for Client.</td><td> REVENUE_SHARE </td><td>REV_THRESHOLD</td></tr></table>`;
    }
    return `<table class="contact-list"><tr><th>Type</th><th>Description</th>
    <th> Rev Share %</th></tr><tr><td>% Of Sales</td><td>A percentage of all Managed Channel Sales (retail dollars, net customer returns) for all sales each month 
    through the Amazon Seller Central and Vendor Central account(s) that BBE manages for Client. </td><td> REVENUE_SHARE</td></tr></table>`;
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
      `<tr ><td colspan="2" style ="text-align: center">
                  Variable Monthly Services</td>
                  </tr>`,
    ];
    if (details && details.additional_monthly_services) {
      for (const item of details.additional_monthly_services) {
        if (item.service.name === 'DSP Advertising') {
          fields.push(
            `<tr>
                 <td style="border: 1px solid black;padding: 13px;">${
                   item.service ? item.service.name : item && item.name
                 }
                  </td>
                  <td style="border: 1px solid black;padding: 13px;">
                  Included
                  </td>
                </tr>`,
          );
        }
        if (item.service.name === 'Inventory Reconciliation') {
          fields.push(
            `<tr>
                 <td style="border: 1px solid black;padding: 13px;">${
                   item.service ? item.service.name : item && item.name
                 }</td>
                    <td style="border: 1px solid black;padding: 13px;"> 
                  25% of recovered $s
                  </td>
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
    if (details && details.additional_marketplaces) {
      for (const item of details.additional_marketplaces) {
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
                        ? item.fee
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : ''
                    } /month
                    </td>
      </tr>`,
        );
      }
    }
    // if (formData && formData.additional_marketplaces) {
    //   for (const item of formData.additional_marketplaces) {
    //     fields.push(
    //       `<tr>
    //   <td style="border: 1px solid black;padding: 13px;">${item.label}</td>
    //                 <td style="border: 1px solid black;padding: 13px;">$
    //                   -
    //                 </td>
    //   </tr>`,
    //     );
    //   }
    // }
    return fields.length ? fields.toString().replaceAll(',', '') : '';

    // return '';
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
      // for (const index in formData.additional_one_time_services) {
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
                       : //  : details.key.index &&
                         //    details.key.index.additional_services &&
                         //    details.key.index.additional_services.label
                         //  ? details.key.index.additional_services.label
                         ''
                   }
      </td>
      ${
        service.service && service.service.fee
          ? // ||
            // (details &&
            //   details[key] &&
            //   details[key].index &&
            //   details[key].index.service &&
            //   details[key].index.service.fee)
            `
        <td style="border: 1px solid black;padding: 13px;">$ ${(service.service &&
        service.service.fee &&
        service.service.name !== 'Amazon Store Package Custom'
          ? service.service.fee
          : service.custom_amazon_store_price
          ? service.custom_amazon_store_price
          : ''
        )
          // : details[key].index &&
          //   details[key].index.service &&
          //   details[key].index.service.fee
          // ? details[key].index.service.fee
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} /month
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
      // console.log(
      //   index,
      //   '!!!!',
      //   formData && formData.key,
      //   formData && formData.key && formData.key.index,
      // );

      // fields.push(
      //   `<tr>
      //             <td style="border: 1px solid black;padding: 13px;">${
      //               formData &&
      //               formData.key &&
      //               formData.key.index &&
      //               formData.key.index.quantity
      //                 ? formData.key.index.quantity
      //                     .toString()
      //                     .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      //                 : details.key.index
      //                 ? details.key.index.quantity
      //                 : 0
      //             }</td>
      // <td style="border: 1px solid black;padding: 13px;">${
      //   formData &&
      //   formData.key &&
      //   formData.key.index &&
      //   formData.key.index.service &&
      //   formData.key.index.service.name
      //     ? formData.key.index.service.name
      //     : details.key.index &&
      //       details.key.index.additional_services &&
      //       details.key.index.additional_services.label
      //     ? details.key.index.additional_services.label
      //     : ''
      // }
      // </td>
      // ${
      //   (formData &&
      //     formData.key &&
      //     formData.key.index &&
      //     formData[key].index.service &&
      //     formData[key].index.service.fee) ||
      //   (details &&
      //     details[key] &&
      //     details[key].index &&
      //     details[key].index.service &&
      //     details[key].index.service.fee)
      //     ? `
      //   <td style="border: 1px solid black;padding: 13px;">$ ${(formData[key]
      //     .index.service && formData[key].index.service.fee
      //     ? formData[key].index.service.fee
      //     : details[key].index &&
      //       details[key].index.service &&
      //       details[key].index.service.fee
      //     ? details[key].index.service.fee
      //     : ''
      //   )
      //     .toString()
      //     .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} /month
      //   </td>
      //   `
      //     : `<td>Yet to save</td>`
      // }

      // ${
      //   (formData &&
      //     formData[key] &&
      //     formData[key].index &&
      //     formData[key].index.quantity &&
      //     formData[key].index.service &&
      //     formData[key].index.service.fee) ||
      //   (details &&
      //     details[key] &&
      //     details[key].index &&
      //     details[key].index.quantity &&
      //     details[key].index.service &&
      //     details[key].index.service.fee)
      //     ? `
      //   <td style="border: 1px solid black;padding: 13px;">$ ${(formData[key]
      //     .index.quantity &&
      //   formData[key].index.service &&
      //   formData[key].index.service.fee
      //     ? formData[key].index.quantity * formData[key].index.service.fee
      //     : details[key].index
      //     ? details[key].index.quantity * details[key].index.service.fee
      //     : ''
      //   )
      //     .toString()
      //     .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      //     </td>`
      //     : `<td>Yet to save</td>`
      // }
      //              </tr>`,
      // );
      // }
    }
    // }

    // return null;

    return fields.length ? fields.toString().replaceAll(',', '') : '';

    // return '';
    // return `Enter ${label}.`;
  };

  const showMonthlyServiceTable = () => {
    if (
      details &&
      details.additional_monthly_services &&
      details.additional_monthly_services.length
    ) {
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center"><span style="font-weight: 800;
    font-family: Arial-bold;">Additional Monthly Services </span><br> The following additional monthly services will be provided to Client in addition to the Monthly Retainer.</div><br><table class="contact-list "><tr><th>Service</th><th>Service Fee</th></tr>${mapMonthlyServices(
      'additional_monthly_services',
      'Monthly Services',
    )} ${mapAdditionalMarketPlaces()}<tr><td class="total-service"> Total</td><td class="total-service text-right">${mapServiceTotal(
        'additional_monthly_services',
      )}
                              </td></tr>
                              ${mapVariableMonthlyService()}
                                </table>`;
    }
    return '';
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
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center;"><span style="font-weight: 800;
    font-family: Arial-bold;">Additional One Time Services </span><br>The following additional monthly services will be provided to Client as a one time service in addition to the Monthly Retainer and any Additional Monthly services.</div><br><table class="contact-list "><tr><th>Quantity</th><th>Service</th><th>Service Fee</th><th>Total Service Fee</th></tr>${mapMonthlyServices(
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

  return isLoading.loader && isLoading.type === 'page' && loader ? (
    <PageLoader
      className="modal-loader"
      color="#FF5933"
      type="page"
      width={40}
    />
  ) : (
    <>
      {checkPermission() ? (
        <>
          <div className="on-boarding-container">
            <div className="text-container ">
              {/* <h3 className="mt-5 mb-4 text-center">
                    Service Order / Statement of Work{' '}
                  </h3> */}

              <Paragraph>
                {' '}
                <p
                  className="long-text"
                  dangerouslySetInnerHTML={{
                    __html:
                      data.statement_of_work &&
                      data.statement_of_work[0]
                        .replace(
                          'CUSTOMER_NAME',
                          mapDefaultValues(
                            'contract_company_name',
                            'Customer Name',
                          ),
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
                        .replace(
                          'MAP_MONTHLY_SERVICES',
                          showMonthlyServiceTable(),
                        )
                        .replace('ONE_TIME_SERVICES', showOneTimeServiceTable())
                        .replace(
                          'ADDITIONAL_SERVICES_NOT_INCLUDED',
                          `<table class="contact-list " style="width: 100%;border-collapse: collapse;">
                                <tr>
                                  <th style="text-align: left; border: 1px solid black;padding: 13px;">Service</th>
                                  <th style="text-align: left; border: 1px solid black;padding: 13px;">Service Type</th>
                                  </tr>
                                  ${displayNotIncludedServices()}
                                  </table>
                                  `,
                        ),
                  }}
                  // <tr><td>DSP Advertising</td><td>15% of [DSP Monthly Ad Budget]</td></tr>
                  //         <tr><td>Inventory Reconciliation</td><td>25% of recovered $(s)</td></tr>
                  //         <tr><td class="total-service"> Totals are variable</td><td class="total-service text-right">&nbsp; </td></tr>
                />
              </Paragraph>
            </div>
          </div>

          <AgreementSidePanel
            id={id}
            setFormData={setFormData}
            formData={formData}
            agreementData={details}
            loader={loader}
            accountURL={apiCalls}
            setNotIncludedOneTimeServices={setNotIncludedOneTimeServices}
            setNotIncludedMonthlyServices={setNotIncludedMonthlyServices}
          />

          {/* <Footer className="sticky">
            <div className="container">
              <Button className="btn-primary on-boarding w-320 mt-3 mb-3">
                {' '}
                Request Approval
              </Button>
              <Button className="light-orange on-boarding ml-3  mt-3 mb-3">
                {' '}
                <img src={SaveRedCheck} alt="save-icon" />
                Save Changes
              </Button>
            </div>
          </Footer> */}
        </>
      ) : (
        <PageNotFound />
      )}
    </>
  );
}

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
`;

// const Footer = styled.div`
//   border: 1px solid ${Theme.gray15};
//   bottom: 0;
//   width: 100%;
//   position: fixed;
//   background: #fff;
//   box-shadow: ${Theme.boxShadow};

//   .w-320 {
//     max-width: 320px;
//     width: 100%;
//   }
// `;

// const RadioCheck = styled.div`
//   .radio-container {
//     display: block;
//     position: relative;
//     padding-left: 35px;
//     margin-bottom: 12px;
//     cursor: pointer;
//     font-size: 16px;
//     -webkit-user-select: none;
//     -moz-user-select: none;
//     -ms-user-select: none;
//     user-select: none;
//   }

//   /* Hide the browser's default radio button */
//   .radio-container input {
//     position: absolute;
//     opacity: 0;
//     cursor: pointer;
//   }

//   /* Create a custom radio button */
//   .checkmark {
//     position: absolute;
//     top: 0;
//     left: 0;
//     height: 25px;
//     width: 25px;
//     background-color: rgba(224, 231, 255, 0.2);
//     border: 1px solid #e0e7ff;
//     border-radius: 50%;
//   }

//   /* On mouse-over, add a grey background color */
//   .radio-container:hover input ~ .checkmark {
//     background-color: #ccc;
//   }

//   /* When the radio button is checked, add a blue background */
//   .radio-container input:checked ~ .checkmark {
//     background-color: #ffff;
//   }

//   /* Create the indicator (the dot/circle - hidden when not checked) */
//   .checkmark:after {
//     content: '';
//     position: absolute;
//     display: none;
//   }

//   /* Show the indicator (dot/circle) when checked */
//   .radio-container input:checked ~ .checkmark:after {
//     display: block;
//   }

//   /* Style the indicator (dot/circle) */
//   .radio-container .checkmark:after {
//     top: 4px;
//     left: 4px;
//     width: 15px;
//     border: 1px solid #e0e7ff;
//     height: 15px;
//     border-radius: 50%;
//     background: black;
//   }
// `;
