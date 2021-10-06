import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { Button, WhiteCard, PageLoader } from '../../../common';
import { PATH_AGREEMENT } from '../../../constants';
import {
  AddIcons,
  DeleteIcon,
  FileContract,
  ServiceIcon,
} from '../../../theme/images';
import { createContract, deleteContract } from '../../../api';
import { getAccountDetails } from '../../../store/actions/accountState';

export default function OneTimeAgreement({
  agreements,
  id,
  history,
  setViewComponent,
}) {
  const loader = useSelector((state) => state.accountState.isLoading);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

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
  const onDeleteContract = (contractId) => {
    setIsLoading(true);
    deleteContract(contractId).then((res) => {
      console.log(' in dlete contract res', res);
      setIsLoading(false);

      setViewComponent('past');
      dispatch(getAccountDetails(id));
    });
  };
  return loader || isLoading ? (
    <PageLoader
      component="agrement-details"
      color="#FF5933"
      type="detail"
      width={40}
      height={40}
    />
  ) : (
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
      </div>{' '}
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
                  <div className="col-lg-8 col-md-7 col-12">
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
                      className="col-lg-3  pl-lg-0 pr-lg-2 col-md-4 col-12 text-right"
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
                          View Agreement
                        </Button>
                      </Link>
                    </div>
                  )}
                  <img
                    style={{
                      position: 'absolute',
                      top: '30px',
                      right: '15px',
                      cursor: 'pointer',
                    }}
                    role="presentation"
                    src={DeleteIcon}
                    alt="delete"
                    onClick={() => onDeleteContract(agreement.id)}
                  />
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
  setViewComponent: PropTypes.func.isRequired,
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
    push: () => {},
  }).isRequired,
};
