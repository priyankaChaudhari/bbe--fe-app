import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Button, WhiteCard } from '../../../common';
import { PATH_AGREEMENT } from '../../../constants';
import { AddIcons, FileContract, ServiceIcon } from '../../../theme/images';
import { createContract } from '../../../api';

export default function OneTimeAgreement({ agreements, id, history }) {
  const addNewOneTime = () => {
    const data = {
      customer_id: id,
      contract_type: 'one time',
    };
    createContract(data).then((res) => {
      history.push({
        pathname: PATH_AGREEMENT.replace(':id', id).replace(
          ':contract_id',
          res && res.data && res.data.id,
        ),
        state: history && history.location && history.location.pathname,
      });
    });
  };

  return (
    <>
      <div
        className=" mt-4  mb-3 cursor "
        style={{ color: '#171725', fontSize: '14px' }}
        onClick={() => addNewOneTime()}
        role="presentation">
        <img
          width="16px"
          style={{ verticalAlign: 'middle' }}
          src={AddIcons}
          className="mr-2"
          alt="add"
        />
        New One Time Service Contract
      </div>
      {agreements && agreements.length === 0 ? (
        <WhiteCard className="mt-3 mb-3 selected-card">
          No One Time Service Agreement found.
        </WhiteCard>
      ) : (
        <>
          {agreements &&
            agreements.map((agreement) => (
              <WhiteCard className="mt-3 mb-3 selected-card" key={agreement.id}>
                <div className="row">
                  <div className="col-lg-9 col-md-8 col-12">
                    <img
                      width="48px"
                      className="solid-icon"
                      src={ServiceIcon}
                      alt=""
                    />
                    <div className="contract-status" role="presentation">
                      <p className="black-heading-title mt-2 mb-0">
                        One Time Service Agreement
                      </p>
                    </div>
                  </div>

                  <div className="clear-fix" />
                  {agreement &&
                  agreement.contract_status &&
                  (agreement.contract_status.value ===
                    'pending account setup' ||
                    agreement.contract_status.value === 'active') &&
                  agreement.contract_url === null ? null : (
                    <div
                      className="col-lg-3  pl-0 col-md-4 col-12 text-right"
                      role="presentation"
                      onClick={() =>
                        localStorage.setItem('agreementID', agreement.id)
                      }>
                      <Link
                        to={{
                          pathname: PATH_AGREEMENT.replace(':id', id).replace(
                            ':contract_id',
                            agreement.id,
                          ),
                          state:
                            history &&
                            history.location &&
                            history.location.pathname,
                        }}>
                        <Button className="btn-transparent w-100 view-contract">
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
                  <div className="straight-line horizontal-line pt-3 mb-3" />
                </div>

                <div className="DSP-contract-retainer">
                  <div className="label mb-2">One Time Services</div>
                  {agreement && agreement.additional_one_time_services ? (
                    <ul className="selected-list">
                      {agreement.additional_one_time_services.map((item) => (
                        <li key={item.id}>
                          {(item && item.service && item.service.name) || ''} (
                          {(item && item.quantity) || ''})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-3 ml-3 text-center">
                      No One Time services added.
                    </div>
                  )}
                </div>
              </WhiteCard>
            ))}
        </>
      )}
    </>
  );
}

OneTimeAgreement.propTypes = {
  id: PropTypes.string.isRequired,
  agreements: PropTypes.shape({
    length: PropTypes.number,
    map: PropTypes.func,
  }).isRequired,
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
    push: () => {},
  }).isRequired,
};
