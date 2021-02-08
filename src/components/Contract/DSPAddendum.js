/* eslint-disable react/no-danger */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import AgreementSidePanel from '../../common/AgreementSidePanel';
import { agreementTemplate } from '../../api/AgreementApi';
import { getAccountDetails } from '../../store/actions/accountState';
import { PageLoader, PageNotFound } from '../../common';

export default function DSPAddendum() {
  const dispatch = useDispatch();
  const location = useLocation();
  // const history = useHistory();
  const id = location.pathname.split('/')[2];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const details = useSelector((state) => state.accountState.data);
  // const customerData = useSelector((state) => state.customerState.data);
  const loader = useSelector((state) => state.accountState.isLoading);

  useEffect(() => {
    // dispatch(getCustomerDetails(id));
    dispatch(getAccountDetails(id));
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
  }, [dispatch, id]);

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

  const mapDefaultValues = (key) => {
    if (key === 'start_date') {
      return details && dayjs(details[key]).format('MM-DD-YYYY');
    }
    if (key === 'current_date') {
      return dayjs(Date()).format('MM-DD-YYYY');
    }

    return details && details[key];
  };

  const mapDspDetails = () => {
    return `<tr>
        <td style="border: 1px solid black;
    padding: 13px;">
          [calculated_date]
        </td>
        <td
          style="border: 1px solid black;
    padding: 13px;">
    ${details && details.dsp_fee}
        </td>
      </tr>`;
  };

  const mapBudgetBreakdownTable = () => {
    return `<tr>
        <td style="border: 1px solid black;
    padding: 13px;">  ${details && details.dsp_fee}
</td>
        <td
          style="border: 1px solid black;
    padding: 13px;">
              ${details && details.dsp_fee}

        </td><td
          style="border: 1px solid black;
    padding: 13px;">
              ${details && details.dsp_fee}

        </td>
      </tr>`;
  };

  return (
    <div>
      {' '}
      {checkPermission() ? (
        <div>
          <div className="on-boarding-container">
            <div className="row">
              <div className="col-10 mb-5 pb-5">
                <div className="text-container ">
                  {/* <h3 className="mt-5 mb-4 text-center">
                Amazon Demand Side Platform (DSP) Service Addendum
              </h3> */}
                  {isLoading.loader && isLoading.type === 'page' ? (
                    <PageLoader
                      className="modal-loader"
                      color="#FF5933"
                      type="page"
                      width={40}
                    />
                  ) : (
                    <Paragraph>
                      <>
                        <p className="long-text">
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                data.dsp_addendum &&
                                data.dsp_addendum[0]
                                  .replace(
                                    'CUSTOMER_NAME',
                                    mapDefaultValues(
                                      'contract_company_name',
                                      'Customer Name',
                                    ),
                                  )
                                  .replace(
                                    'START_DATE',
                                    mapDefaultValues(
                                      'start_date',
                                      'Start Date',
                                    ),
                                  )
                                  .replace(
                                    'DSP_DETAIL_TABLE',
                                    `<table class="contact-list " style="width: 100%;
    border-collapse: collapse;"><tr><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Start Date</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Monthly Ad Budget</th></tr>${mapDspDetails()}</table>`,
                                  )
                                  .replace(
                                    'BUDGET_BREAKDOWN_TABLE',
                                    `<table class="contact-list " style="width: 100%;
    border-collapse: collapse;"><tr><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Jan 16, 2021 - Feb 28, 2021</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">March 2021</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">April 2021</th></tr>${mapBudgetBreakdownTable()}</table>`,
                                  ),
                            }}
                          />
                        </p>
                        <p
                          className="long-text"
                          dangerouslySetInnerHTML={{
                            __html:
                              data.dsp_addendum &&
                              data.dsp_addendum[1]
                                .replace(
                                  'CUSTOMER_NAME',
                                  mapDefaultValues(
                                    'contract_company_name',
                                    'Customer Name',
                                  ),
                                )
                                .replace(
                                  'AGREEMENT_DATE',
                                  mapDefaultValues('start_date', 'Start Date'),
                                )
                                .replace(
                                  'BBE_DATE',
                                  mapDefaultValues(
                                    'current_date',
                                    'Current Date',
                                  ),
                                ),
                            // .replace(
                            //   'CUSTOMER_ADDRESS',
                            //   mapDefaultValues('address', 'Address, '),
                            // )
                            // .replace(
                            //   'CUSTOMER_CITY',
                            //   mapDefaultValues('city', 'City, '),
                            // )
                            // .replace(
                            //   'CUSTOMER_STATE',
                            //   mapDefaultValues('state', 'State, '),
                            // )
                            // .replace(
                            //   'CUSTOMER_POSTAL',
                            //   mapDefaultValues('zip_code', 'Postal Code, '),
                            // )
                            // .replace(
                            //   'BBE_DATE',
                            //   mapDefaultValues('current_date', 'Current Date'),
                            // ),
                          }}
                        />
                      </>
                    </Paragraph>
                  )}
                </div>
              </div>
            </div>
          </div>
          <AgreementSidePanel
            id={id}
            // setFormData={setFormData}
            // formData={formData}
            loader={loader}
            agreementData={details}
            // editContractFlag={editContractFlag}
            // setEditContractFlag={setEditContractFlag}
          />
        </div>
      ) : (
        <PageNotFound />
      )}
    </div>
  );
}

const Paragraph = styled.div`
  .order-list-item {
    margin: 0;
    li {
      padding-left: 8px;
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
    margin-left: 35px;
    padding: 6px 0;

    .label {
      font-weight: 800;
    }
  }
`;
