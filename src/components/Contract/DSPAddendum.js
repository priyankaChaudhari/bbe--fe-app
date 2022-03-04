/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-danger */

import React, { useEffect } from 'react';

import dayjs from 'dayjs';
import {
  string,
  func,
  oneOfType,
  arrayOf,
  shape,
  instanceOf,
} from 'prop-types';

import { DspAddendumParagraph } from '../../theme/AgreementStyle';

export default function DSPAddendum({
  formData,
  templateData,
  setCalculatedDate,
  firstMonthDate,
  setFirstMonthDate,
  secondMonthDate,
  setSecondMonthDate,
  thirdMonthDate,
  setThirdMonthDate,
  endMonthDate,
  setEndDate,
  selectedCurrency,
}) {
  function addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  useEffect(() => {
    if (formData && formData.start_date) {
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
    }
  }, [formData]);

  const handleNewDate = (monthDateOrder) => {
    const newDate = new Date(
      new Date(
        new Date(monthDateOrder).getFullYear(),
        new Date(monthDateOrder).getMonth() + 1,
        0,
      ),
    );
    return newDate;
  };
  const calculateTotalDays = (flag = '') => {
    let firstMonthdays = 0;
    if (new Date(firstMonthDate).getDate() !== 1) {
      const totalDays = handleNewDate(firstMonthDate).getDate();
      const currentDate = new Date(firstMonthDate).getDate();
      firstMonthdays = totalDays - currentDate;
    } else {
      firstMonthdays = handleNewDate(firstMonthDate).getDate();
    }
    let extraDays = 0;
    if (new Date(firstMonthDate).getDate() !== 1) {
      extraDays = handleNewDate(endMonthDate).getDate();
    }
    const secondMonthdays = handleNewDate(secondMonthDate).getDate();
    const thirdMonthdays = handleNewDate(thirdMonthDate).getDate();
    const totaldays =
      firstMonthdays + extraDays + secondMonthdays + thirdMonthdays;
    if (flag === 'initial') {
      if (totaldays < 105) {
        return '3';
      }
      return '3.5';
    }
    if (totaldays < 105) {
      return `90 days (3 months)`;
    }
    return `105 days (3.5 months)`;
    // return firstMonthdays + extraDays + secondMonthdays + thirdMonthdays;
  };

  const mapDefaultValues = (key, label, type) => {
    if (key === 'current_date') {
      return dayjs(new Date()).format('MM / DD / YYYY');
    }
    if (key === 'company_name') {
      return formData && formData.customer_id && formData.customer_id[key]
        ? formData && formData.customer_id && formData.customer_id[key]
        : `Client Name`;
    }
    if (key === 'calculated_no_of_days') {
      return calculateTotalDays();
    }
    if (key === 'start_date') {
      return formData && formData[key] !== null
        ? formData && dayjs(formData[key]).format('MM / DD / YYYY')
        : 'Select Date';
    }

    if (key === 'dsp_length') {
      if (formData?.contract_type?.toLowerCase().includes('dsp')) {
        return calculateTotalDays('initial');
      }
      if (
        formData[key] === undefined ||
        formData[key] === '' ||
        formData[key] === null
      ) {
        return `Enter ${label}`;
      }
      return formData?.dsp_length?.label
        ? parseInt(formData.dsp_length.label, 10)
        : parseInt(formData.dsp_length, 10);
    }
    if (
      formData[key] === undefined ||
      formData[key] === '' ||
      formData[key] === null
    ) {
      if (label === 'Dsp Fee') {
        return `Enter DSP Fee`;
      }
      return `Enter ${label}`;
    }

    if (type && type.includes('number')) {
      return `
      
      ${type === 'number-currency' ? selectedCurrency : '%'}${
        formData && formData[key]
          ? `${formData[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
          : `Enter ${label}.`
      }`;
    }
    return formData[key];
  };

  const mapDspDetails = () => {
    return `<tr>
        <td style="border: 1px solid black;
    padding: 13px;"><span style="background:#ffe5df;padding: 4px 9px; font-weight: bold";>
          ${
            firstMonthDate
              ? dayjs(firstMonthDate).format('MM-DD-YYYY')
              : 'MM-DD-YYYY'
          }
          </span>
        </td>
        <td
          style="border: 1px solid black;
    padding: 13px;">
    <span style="background:#ffe5df;padding: 4px 9px; font-weight: bold";>
     DSP_FEE
     </span>
        </td>
      </tr>`;
  };

  const displayFirstMonthFee = () => {
    if (firstMonthDate && new Date(firstMonthDate).getDate() !== 1) {
      if (formData?.dsp_fee) {
        const fee = parseInt(formData?.dsp_fee, 10);
        const FinalFee = fee + fee / 2;
        return `${selectedCurrency}${FinalFee.toString().replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ',',
        )}`;
      }
    }
    if (formData?.dsp_fee) {
      return `${selectedCurrency}${formData?.dsp_fee?.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ',',
      )}`;
    }
    return 'Enter DSP Fee ';
  };

  const mapBudgetBreakdownTable = () => {
    return `
    
    
    <div class="table-responsive">  <table class="contact-list " style="width: 100%;
    border-collapse: collapse;"><tr><th style="text-align: left; border: 1px solid black;
    padding: 13px;">${
      firstMonthDate
        ? dayjs(firstMonthDate).format('MMM D, YYYY')
        : 'MM-DD-YYYY'
    } ${new Date(firstMonthDate).getDate() !== 1 ? '-' : ''} ${
      new Date(firstMonthDate).getDate() !== 1
        ? dayjs(endMonthDate).format('MMM D, YYYY')
        : ''
    } </th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">${
      secondMonthDate
        ? dayjs(secondMonthDate).format('MMMM YYYY')
        : 'MM-DD-YYYY'
    }</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">${
      thirdMonthDate ? dayjs(thirdMonthDate).format('MMMM YYYY') : 'MM-DD-YYYY'
    } </th></tr>
    <tr>
        <td style="border: 1px solid black;
    padding: 13px;"> <span style="background:#ffe5df;padding: 4px 9px; font-weight: bold";> ${displayFirstMonthFee()} </span></td>
        <td
          style="border: 1px solid black;
    padding: 13px;">
    <span style="background:#ffe5df;padding: 4px 9px; font-weight: bold";>
               DSP_FEE
               </span>

        </td><td
          style="border: 1px solid black;
    padding: 13px;">
    <span style="background:#ffe5df;padding: 4px 9px; font-weight: bold";>
              DSP_FEE

        </td>
      </tr>
      
      </table></div>`;
  };

  return (
    <div>
      <DspAddendumParagraph>
        <>
          <p
            className="long-text"
            dangerouslySetInnerHTML={{
              __html:
                templateData.dsp_addendum &&
                templateData.dsp_addendum[0]
                  .replace(
                    'CUSTOMER_NAME',
                    mapDefaultValues('company_name', 'Customer Name'),
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
    padding: 13px;">Monthly Ad Budget</th></tr>${mapDspDetails().replaceAll(
      'DSP_FEE',
      mapDefaultValues('dsp_fee', 'Dsp Fee', 'number-currency'),
    )}</table>`,
                  )
                  .replace(
                    'BUDGET_BREAKDOWN_TABLE',
                    `${mapBudgetBreakdownTable().replaceAll(
                      'DSP_FEE',
                      mapDefaultValues('dsp_fee', 'Dsp Fee', 'number-currency'),
                    )}`,
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
                    'CONTRACT_LENGTH',
                    mapDefaultValues(
                      'dsp_length',
                      'Initial Period',
                      'number-currency',
                    ),
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
                    mapDefaultValues('company_name', 'Customer Name'),
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
      </DspAddendumParagraph>
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
  selectedCurrency: '$',
};

DSPAddendum.propTypes = {
  templateData: shape({
    dsp_addendum: arrayOf(string),
  }),
  setCalculatedDate: func,
  firstMonthDate: oneOfType([string, instanceOf(Date)]),
  setFirstMonthDate: func,
  secondMonthDate: oneOfType([string, instanceOf(Date)]),
  setSecondMonthDate: func,
  thirdMonthDate: oneOfType([string, instanceOf(Date)]),
  setThirdMonthDate: func,
  endMonthDate: oneOfType([string, instanceOf(Date)]),
  setEndDate: func,
  selectedCurrency: string,
  formData: shape({
    dsp_fee: string,
    dsp_length: oneOfType([
      string,
      shape({
        value: string,
        label: string,
      }),
    ]),
    contract_status: shape({
      label: string,
      value: string,
    }),
    start_date: oneOfType([string, instanceOf(Date)]),
    contract_type: string,
    customer_id: shape({
      address: string,
      city: string,
      state: string,
      zip_code: string,
    }),
  }),
};
