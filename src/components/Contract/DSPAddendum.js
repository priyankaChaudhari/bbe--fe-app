/* eslint-disable react/no-danger */

import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

export default function DSPAddendum({ formData, templateData }) {
  const mapDefaultValues = (key, label, type) => {
    if (formData[key] === undefined || formData[key] === '') {
      return `Enter ${label}`;
    }
    if (key === 'start_date') {
      return formData && dayjs(formData[key]).format('MM-DD-YYYY');
    }
    if (key === 'current_date') {
      return dayjs(Date()).format('MM-DD-YYYY');
    }
    if (type && type.includes('number')) {
      return `${type === 'number-currency' ? '$' : '%'} ${
        formData && formData[key]
          ? `${formData[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
          : `Enter ${label}.`
      }`;
    }

    // return details && details[key];
    return formData[key];
  };

  const mapDspDetails = () => {
    return `<tr>
        <td style="border: 1px solid black;
    padding: 13px;">
          ${formData && dayjs(formData.start_date).format('MM-DD-YYYY')}
        </td>
        <td
          style="border: 1px solid black;
    padding: 13px;">
     DSP_FEE
        </td>
      </tr>`;
  };

  const mapBudgetBreakdownTable = () => {
    return `<tr>
        <td style="border: 1px solid black;
    padding: 13px;">  DSP_FEE
</td>
        <td
          style="border: 1px solid black;
    padding: 13px;">
               DSP_FEE

        </td><td
          style="border: 1px solid black;
    padding: 13px;">
              DSP_FEE

        </td>
      </tr>`;
  };

  return (
    <div>
      <Paragraph>
        <>
          <p className="long-text">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  templateData.dsp_addendum &&
                  templateData.dsp_addendum[0]
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
                    )
                    .replaceAll(
                      'DSP_FEE',
                      mapDefaultValues('dsp_fee', 'Dsp Fee', 'number-currency'),
                    ),
              }}
            />
          </p>
          <p
            className="long-text"
            dangerouslySetInnerHTML={{
              __html:
                templateData.dsp_addendum &&
                templateData.dsp_addendum[1]
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
        </>
      </Paragraph>
    </div>
  );
}

DSPAddendum.defaultProps = {
  templateData: {},
  formData: {},
};

DSPAddendum.propTypes = {
  formData: PropTypes.shape({
    dsp_fee: PropTypes.string,
    start_date: PropTypes.string,
  }),
  templateData: PropTypes.shape({
    dsp_addendum: PropTypes.arrayOf(PropTypes.string),
  }),
};

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
