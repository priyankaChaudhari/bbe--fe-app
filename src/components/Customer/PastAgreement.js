import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import Button from '../../common/Button';
import {
  FileContract,
  ServiceIcon,
  DspOnlyIcon,
  RecurringIcon,
} from '../../theme/images/index';
import { WhiteCard } from '../../theme/Global';
import { PATH_AGREEMENT } from '../../constants';

export default function PastAgreement({ id }) {
  const multipleAgreement = useSelector(
    (state) => state.accountState.multipleAgreement,
  );

  const generateHTML = () => {
    const fields = [];
    for (const item of multipleAgreement) {
      if (
        (item &&
          item.contract_status &&
          item.contract_status.value &&
          item.contract_status.value === 'inactive') ||
        item.end_date > dayjs(new Date()).format('YYYY-MM-DD')
      ) {
        fields.push(
          <WhiteCard className="mt-3" key={item.id}>
            <div className="row">
              <div className="col-lg-9 col-md-8 col-12">
                <p className="black-heading-title mt-0 mb-0">
                  {' '}
                  <img
                    width="48px"
                    className="solid-icon "
                    src={
                      item && item.contract_type === 'One Time'
                        ? ServiceIcon
                        : item && item.contract_type === 'dsp only'
                        ? DspOnlyIcon
                        : RecurringIcon
                    }
                    alt=""
                  />{' '}
                  {(item && item.contract_type === 'One Time') ||
                  (item && item.contract_type === 'one time')
                    ? 'One Time Services Contract'
                    : item && item.contract_type === 'dsp only'
                    ? 'DSP Only Services Contract'
                    : 'Recurring Contract'}
                </p>
                <ul className="recurring-contact mb-2 ">
                  <li>
                    <p className="basic-text ">
                      {item && item.length && item.length.label} contract
                    </p>
                  </li>
                  {item && item.start_date ? (
                    <li>
                      <div className="dot" />
                      <p className="basic-text ">
                        Started: {dayjs(item.start_date).format('MMM DD, YYYY')}
                      </p>
                    </li>
                  ) : (
                    ''
                  )}
                  {item && item.start_date ? (
                    <li>
                      <p className="basic-text ">
                        Expires: {dayjs(item.end_date).format('MMM DD, YYYY')}
                      </p>
                    </li>
                  ) : (
                    ''
                  )}
                </ul>
              </div>
              {item &&
              item.contract_status &&
              (item.contract_status.value === 'pending account setup' ||
                item.contract_status.value === 'active') &&
              item.contract_url === null ? null : (
                <div className="col-lg-3 col-md-4 col-12 text-right">
                  <Link
                    to={{
                      pathname: PATH_AGREEMENT.replace(':id', id),
                      state: item.id,
                    }}>
                    <Button className="btn-transparent w-100  view-contract ">
                      {' '}
                      <img
                        className="file-contract-icon"
                        src={FileContract}
                        alt=""
                      />
                      View Contract
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </WhiteCard>,
        );
      }
    }

    return fields && fields.length === 0 ? (
      <WhiteCard className="text-center">No Agreements Found.</WhiteCard>
    ) : (
      fields
    );
  };

  return (
    <>
      {multipleAgreement && multipleAgreement.length !== 0 ? (
        <div>
          <>{generateHTML()}</>
        </div>
      ) : (
        <WhiteCard className="text-center">No Past Agreements Found.</WhiteCard>
      )}
    </>
  );
}

PastAgreement.propTypes = {
  id: PropTypes.string.isRequired,
};
