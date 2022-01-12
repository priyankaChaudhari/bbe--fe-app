/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';

import NumberFormat from 'react-number-format';
import { func, shape } from 'prop-types';

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
      return `$${
        agreement?.fee_structure?.[accountType[agreement.id]]
          ?.quarterly_rev_share?.[item.key]
      }`;
    if (threshold === 'month')
      return `$${
        agreement?.fee_structure?.[accountType[agreement.id]]
          ?.monthly_rev_share?.[item.key]
      }`;
    if (item.key === 'rev_share_threshold') {
      if (
        agreement?.fee_structure?.[accountType[agreement.id]]
          ?.threshold_type === 'Fixed'
      )
        return `Fixed ($${
          agreement?.fee_structure?.[accountType[agreement.id]]?.sales_threshold
        })`;
      return (
        agreement?.fee_structure?.[accountType[agreement.id]]?.threshold_type ||
        'None'
      );
    }
    return (
      agreement?.fee_structure?.[accountType[agreement.id]]?.[item.key] || 0
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
        prefix: '$',
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
              prefix="$"
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
              prefix="$"
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
              item.key === 'rev_share_threshold'
                ? ''
                : '$'
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
};

AgreementSellerVendorDetails.propTypes = {
  agreement: shape({}).isRequired,
  setAccountType: func,
  accountType: shape({}),
  multipleAgreement: shape({}).isRequired,
};
