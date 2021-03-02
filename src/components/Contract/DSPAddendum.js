/* eslint-disable react/no-danger */

import React, { useEffect } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

export default function DSPAddendum({
  formData,
  templateData,
  // calculatedDate,
  setCalculatedDate,
  firstMonthDate,
  setFirstMonthDate,
  secondMonthDate,
  setSecondMonthDate,
  thirdMonthDate,
  setThirdMonthDate,
  endMonthDate,
  setEndDate,
}) {
  function addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  useEffect(() => {
    const calculateDate = addDays(
      new Date(formData && formData.start_date),
      10,
    );
    setCalculatedDate(dayjs(calculateDate).format('MM-DD-YYYY'));

    let startDate = '';
    let lastDate = '';
    const d = new Date(calculateDate);

    if (calculateDate.getDate() > 16) {
      startDate = d.setMonth(d.getMonth() + 1, 1);
      const first = new Date(startDate);
      setFirstMonthDate(first);
      lastDate = first;
      setEndDate(first);
    } else if (calculateDate.getDate() === 1) {
      startDate = d.setMonth(d.getMonth(), 1);
      const first = new Date(startDate);
      setFirstMonthDate(first);
      lastDate = first;
      setEndDate(first);
    } else {
      startDate = d.setMonth(d.getMonth(), 16);
      const first = new Date(startDate);
      setFirstMonthDate(first);
      const endDate = new Date(first.getFullYear(), first.getMonth() + 2, 0);
      lastDate = endDate;
      setEndDate(endDate);
    }
    const last = new Date(lastDate);
    const date = new Date(last.setDate(1));

    const third = date.setMonth(date.getMonth() + 1);
    setSecondMonthDate(new Date(third));

    const fourth = date.setMonth(date.getMonth() + 1);
    setThirdMonthDate(new Date(fourth));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const calculateTotalDays = () => {
    let firstMonthdays = 0;
    if (new Date(firstMonthDate).getDate() !== 1) {
      const totalDays = new Date(
        new Date(firstMonthDate).getFullYear(),
        new Date(firstMonthDate).getMonth() + 1,
        0,
      ).getDate();
      const currentDate = new Date(firstMonthDate).getDate();
      firstMonthdays = totalDays - currentDate;
    } else {
      firstMonthdays = new Date(
        new Date(firstMonthDate).getFullYear(),
        new Date(firstMonthDate).getMonth() + 1,
        0,
      ).getDate();
    }

    let extraDays = 0;
    if (new Date(firstMonthDate).getDate() !== 1) {
      extraDays = new Date(
        new Date(endMonthDate).getFullYear(),
        new Date(endMonthDate).getMonth() + 1,
        0,
      ).getDate();
    }
    const secondMonthdays = new Date(
      new Date(secondMonthDate).getFullYear(),
      new Date(secondMonthDate).getMonth() + 1,
      0,
    ).getDate();
    const thirdMonthdays = new Date(
      new Date(thirdMonthDate).getFullYear(),
      new Date(thirdMonthDate).getMonth() + 1,
      0,
    ).getDate();
    return firstMonthdays + extraDays + secondMonthdays + thirdMonthdays;
  };

  const mapDefaultValues = (key, label, type) => {
    if (key === 'current_date') {
      return dayjs(new Date()).format('MM-DD-YYYY');
    }
    if (key === 'contract_company_name') {
      return formData && formData[key]
        ? formData && formData[key]
        : `Client Name`;
    }
    if (key === 'calculated_no_of_days') {
      return calculateTotalDays();
    }

    if (key === 'start_date') {
      return formData && formData[key] !== null
        ? formData && dayjs(formData[key]).format('MM/DD/YYYY')
        : 'Select Date';
    }

    if (
      formData[key] === undefined ||
      formData[key] === '' ||
      formData[key] === null
    ) {
      return `Enter ${label}`;
    }

    if (key === 'length') {
      return (
        formData &&
        formData.length &&
        formData.length.label &&
        parseInt(formData.length.label, 10)
      );
    }
    if (type && type.includes('number')) {
      return `
      
      ${type === 'number-currency' ? '$' : '%'}${
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
          ${dayjs(firstMonthDate).format('MM-DD-YYYY')}
        </td>
        <td
          style="border: 1px solid black;
    padding: 13px;">
     DSP_FEE
        </td>
      </tr>`;
  };

  const displayFirstMonthFee = () => {
    if (firstMonthDate && new Date(firstMonthDate).getDate() !== 1) {
      if (formData && formData.dsp_fee) {
        const fee = parseInt(formData && formData.dsp_fee, 10);
        const FinalFee = fee + fee / 2;
        return `$${FinalFee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
      }
    }
    // return (
    if (formData && formData.dsp_fee) {
      return `$${
        formData &&
        formData.dsp_fee &&
        formData.dsp_fee.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }`;
    }
    return 'Enter Dsp Fee ';

    // );
  };

  const mapBudgetBreakdownTable = () => {
    return `
    
    
    <div class="table-responsive">  <table class="contact-list " style="width: 100%;
    border-collapse: collapse;"><tr><th style="text-align: left; border: 1px solid black;
    padding: 13px;">${dayjs(firstMonthDate).format('MMM D, YYYY')} ${
      new Date(firstMonthDate).getDate() !== 1 ? '-' : ''
    } ${
      new Date(firstMonthDate).getDate() !== 1
        ? dayjs(endMonthDate).format('MMM D, YYYY')
        : ''
    } </th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">${dayjs(secondMonthDate).format(
      'MMMM YYYY',
    )}</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">${dayjs(thirdMonthDate).format('MMMM YYYY')} </th></tr>
    <tr>
        <td style="border: 1px solid black;
    padding: 13px;"> ${displayFirstMonthFee()}</td>
        <td
          style="border: 1px solid black;
    padding: 13px;">
               DSP_FEE

        </td><td
          style="border: 1px solid black;
    padding: 13px;">
              DSP_FEE

        </td>
      </tr>
      
      </table></div>`;
  };

  return (
    <div>
      <Paragraph>
        <>
          <p
            className="long-text"
            dangerouslySetInnerHTML={{
              __html:
                templateData.dsp_addendum &&
                templateData.dsp_addendum[0]
                  .replace(
                    'CUSTOMER_NAME',
                    mapDefaultValues('contract_company_name', 'Customer Name'),
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
                    `${mapBudgetBreakdownTable()}`,
                  )
                  .replaceAll(
                    'CONTRACT_LENGTH',
                    mapDefaultValues(
                      'length',
                      'Initial Period',
                      'number-currency',
                    ),
                  )
                  .replace(
                    'NO_OF_DAYS_BASED_ON_DATE',
                    mapDefaultValues(
                      'calculated_no_of_days',
                      'Calculated Days',
                      'number-currency',
                    ),
                  )
                  .replaceAll(
                    'DSP_FEE',
                    mapDefaultValues('dsp_fee', 'Dsp Fee', 'number-currency'),
                  ),
            }}
          />
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
  // calculatedDate: '',
  setCalculatedDate: () => {},
  firstMonthDate: '',
  setFirstMonthDate: () => {},
  secondMonthDate: '',
  setSecondMonthDate: () => {},
  thirdMonthDate: '',
  setThirdMonthDate: () => {},
  endMonthDate: '',
  setEndDate: () => {},
};

DSPAddendum.propTypes = {
  formData: PropTypes.shape({
    dsp_fee: PropTypes.string,
    start_date: PropTypes.string,
    length: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  }),
  templateData: PropTypes.shape({
    dsp_addendum: PropTypes.arrayOf(PropTypes.string),
  }),
  // calculatedDate: PropTypes.instanceOf(Date),
  setCalculatedDate: PropTypes.func,
  firstMonthDate: PropTypes.instanceOf(Date),
  setFirstMonthDate: PropTypes.func,
  secondMonthDate: PropTypes.instanceOf(Date),
  setSecondMonthDate: PropTypes.func,
  thirdMonthDate: PropTypes.instanceOf(Date),
  setThirdMonthDate: PropTypes.func,
  endMonthDate: PropTypes.instanceOf(Date),
  setEndDate: PropTypes.func,
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
