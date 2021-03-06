/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';

import NumberFormat from 'react-number-format';
import { func, oneOfType, shape, array, object } from 'prop-types';

import {
  monthlyThresholdOptions,
  quarterlyThresholdOptions,
  revShareAndRetainerDetails,
  revShareAndRetainerMonthDetails,
  revShareAndRetainerQuarterDetails,
  revShareDetails,
} from '../../../constants';

export default function AgreementSellerVendorDetails({
  agreement,
  setAccountType,
  accountType,
  multipleAgreement,
  showCurrencySign,
}) {
  useEffect(() => {
    for (const item of multipleAgreement) {
      setAccountType((prevState) => ({
        ...prevState,
        [item.id]:
          item?.seller_type?.label === 'Hyrbid'
            ? accountType[item.id]
            : item?.seller_type?.label === 'Hybrid'
            ? 'seller'
            : item?.seller_type?.label?.toLowerCase(),
      }));
    }
  }, [
    agreement.additional_monthly_services,
    multipleAgreement,
    setAccountType,
  ]);

  const mapDefaultValues = (item, threshold) => {
    if (threshold === 'quarter')
      return `${showCurrencySign(agreement?.currency)}${
        agreement?.fee_structure?.[accountType[agreement.id]]
          ?.quarterly_rev_share?.[item.key]
      }`;
    if (threshold === 'month')
      return `${showCurrencySign(agreement?.currency)}${
        agreement?.fee_structure?.[accountType[agreement.id]]
          ?.monthly_rev_share?.[item.key]
      }`;
    if (item.key === 'rev_share_threshold') {
      if (
        agreement?.fee_structure?.[accountType[agreement.id]]
          ?.threshold_type === 'Fixed'
      )
        return `Fixed (${showCurrencySign(agreement?.currency)}${
          agreement?.fee_structure?.[accountType[agreement.id]]
            ?.sales_threshold || 0
        })`;
      return (
        agreement?.fee_structure?.[accountType[agreement.id]]?.threshold_type ||
        'None'
      );
    }
    return (
      agreement?.fee_structure?.[accountType[agreement.id]]?.[item.key] || 'N/A'
    );
  };

  let arr = [];
  if (
    agreement?.fee_structure?.[accountType[agreement.id]]?.fee_type ===
    'Retainer Only'
  ) {
    arr = [
      {
        value: 'monthly_retainer',
        label: 'Monthly Retainer',
        key: 'monthly_retainer',
        type: 'number-currency',
        isMandatory: true,
        prefix: showCurrencySign(agreement?.currency),
      },
    ];
  } else if (
    agreement?.fee_structure?.[accountType[agreement.id]]?.fee_type ===
    'Revenue Share Only'
  )
    arr = revShareDetails;
  else if (
    agreement?.fee_structure?.[accountType[agreement.id]]?.fee_type ===
    'Retainer + % Rev Share'
  ) {
    if (
      agreement?.fee_structure?.[accountType[agreement.id]]?.threshold_type ===
      'quarterly'
    ) {
      arr = revShareAndRetainerQuarterDetails;
    } else if (
      agreement?.fee_structure?.[accountType[agreement.id]]?.threshold_type ===
      'monthly'
    ) {
      arr = revShareAndRetainerMonthDetails;
    } else arr = revShareAndRetainerDetails;
  }

  return arr?.map((item) => {
    if (
      agreement?.fee_structure?.[accountType[agreement.id]]?.threshold_type ===
        'monthly' &&
      item.key === 'month'
    ) {
      return monthlyThresholdOptions.map((field) => (
        <div className="col-lg-3 col-md-3 mb-3 col-6 " key={field?.key}>
          <div className="label">{field.detail}</div>
          <div className="label-info text-medium">
            <NumberFormat
              displayType="text"
              value={mapDefaultValues(field, 'month')}
              thousandSeparator
              prefix={showCurrencySign(agreement?.currency)}
            />
          </div>
        </div>
      ));
    }
    if (
      agreement?.fee_structure?.[accountType[agreement.id]]?.threshold_type ===
        'quarterly' &&
      item.key === 'quarter'
    ) {
      return quarterlyThresholdOptions.map((field) => (
        <div className="col-lg-3 col-md-3 mb-3 col-6 " key={field?.key}>
          <div className="label">{field.detail}</div>
          <div className="label-info text-medium">
            <NumberFormat
              displayType="text"
              value={mapDefaultValues(field, 'quarter')}
              thousandSeparator
              prefix={showCurrencySign(agreement?.currency)}
            />
          </div>
        </div>
      ));
    }

    return (
      <div className=" col-lg-3 col-md-3 mb-3 col-6 " key={item?.key}>
        <div className="label">{item?.label?.replace('(OPTIONAL)', '')}</div>
        <div className="label-info text-medium capitalize">
          <NumberFormat
            displayType="text"
            value={mapDefaultValues(item)}
            thousandSeparator
            prefix={
              item.key === 'rev_share' ||
              item.key === 'content_optimization' ||
              item.key === 'design_optimization' ||
              item.key === 'rev_share_threshold' ||
              !agreement?.fee_structure?.[accountType[agreement.id]]?.[item.key]
                ? ''
                : showCurrencySign(agreement?.currency)
            }
            suffix={item.key === 'rev_share' ? '%' : ''}
            isNumericString
          />
        </div>
      </div>
    );
  });
}

AgreementSellerVendorDetails.defaultProps = {
  setAccountType: () => {},
  accountType: {},
  showCurrencySign: () => {},
};

AgreementSellerVendorDetails.propTypes = {
  agreement: shape({}).isRequired,
  setAccountType: func,
  accountType: shape({}),
  multipleAgreement: oneOfType([array, object]).isRequired,
  showCurrencySign: func,
};
