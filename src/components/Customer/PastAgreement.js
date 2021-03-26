import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import Button from '../../common/Button';
import {
  FileContract,
  ServiceIcon,
  RecurringIcon,
} from '../../theme/images/index';
import { WhiteCard } from '../../theme/Global';
import { PATH_AGREEMENT } from '../../constants';

export default function PastAgreement({ id }) {
  const multipleAgreement = useSelector(
    (state) => state.accountState.multipleAgreement,
  );

  return (
    <>
      {multipleAgreement && multipleAgreement.length !== 0 ? (
        <div>
          {multipleAgreement &&
            multipleAgreement.map((item) => (
              <React.Fragment key={item.id}>
                {item.end_date < dayjs(new Date()).format('YYYY-MM-DD') ? (
                  <WhiteCard className="mt-3">
                    <div className="row">
                      <div className="col-lg-9 col-md-8 col-12">
                        <p className="black-heading-title mt-0 mb-0">
                          {' '}
                          <img
                            className="solid-icon "
                            src={
                              item && item.contract_type === 'One Time'
                                ? ServiceIcon
                                : RecurringIcon
                            }
                            alt=""
                          />{' '}
                          {item && item.contract_type === 'One Time'
                            ? 'One Time Services Contract'
                            : 'Recurring Contract'}
                        </p>
                        <ul className="recurring-contact mb-2 ">
                          <li>
                            <p className="basic-text ">
                              {item && item.length && item.length.label}{' '}
                              contract
                            </p>
                          </li>
                          {item && item.start_date ? (
                            <li>
                              <div className="dot" />
                              <p className="basic-text ">
                                Started:{' '}
                                {dayjs(item.start_date).format('MMM DD, YYYY')}
                              </p>
                            </li>
                          ) : (
                            ''
                          )}
                          {item && item.start_date ? (
                            <li>
                              <p className="basic-text ">
                                Expires:{' '}
                                {dayjs(item.end_date).format('MMM DD, YYYY')}
                              </p>
                            </li>
                          ) : (
                            ''
                          )}
                        </ul>
                      </div>
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
                    </div>
                  </WhiteCard>
                ) : (
                  ''
                )}
              </React.Fragment>
            ))}
          <WhiteCard className="text-center">
            No Past Agreements Found.
          </WhiteCard>
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
