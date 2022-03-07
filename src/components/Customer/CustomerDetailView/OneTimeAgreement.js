import React from 'react';

import Select from 'react-select';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { shape, string, func, arrayOf } from 'prop-types';

import { createContract } from '../../../api';
import { PATH_AGREEMENT, draftContractOptions } from '../../../constants';
import { Button, WhiteCard, PageLoader, ActionDropDown } from '../../../common';
import { AddIcons, FileContract, ServiceIcon } from '../../../theme/images';

export default function OneTimeAgreement({
  agreements,
  id,
  history,
  DropdownIndicator,
  IconOption,
  setShowModal,
  userRole,
}) {
  const loader = useSelector((state) => state.accountState.isLoading);
  // console.log("@@@")
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

  const handleContractOptions = (event, agreementId) => {
    switch (event.value) {
      case 'view':
        history.push({
          pathname: PATH_AGREEMENT.replace(':id', id).replace(
            ':contract_id',
            agreementId,
          ),
          state: history && history.location && history.location.pathname,
        });
        break;
      case 'edit':
        history.push({
          pathname: PATH_AGREEMENT.replace(':id', id).replace(
            ':contract_id',
            agreementId,
          ),
          state: history && history.location && history.location.pathname,
          showEditView: true,
        });
        break;
      case 'delete':
        setShowModal({ delete: true, agreementId });
        break;
      default:
        break;
    }
  };

  return loader ? (
    <PageLoader
      component="agrement-details"
      color="#FF5933"
      type="detail"
      width={40}
      height={40}
    />
  ) : (
    <>
      {userRole !== 'Customer' ? (
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
          New One Time Service Agreement
        </div>
      ) : (
        ''
      )}
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
                  {agreement?.contract_status?.value === 'active' ||
                  userRole === 'Customer' ? (
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
                  ) : (
                    <div
                      className="col-lg-3 pl-lg-0   col-md-3 col-12 text-right"
                      role="presentation"
                      onClick={() =>
                        localStorage.setItem('agreementID', agreement.id)
                      }>
                      <ActionDropDown>
                        {' '}
                        <Select
                          classNamePrefix="react-select"
                          placeholder="View Actions"
                          className="active"
                          options={draftContractOptions}
                          onChange={(event) =>
                            handleContractOptions(event, agreement.id)
                          }
                          components={{
                            DropdownIndicator,
                            Option: IconOption,
                          }}
                          value=""
                        />
                      </ActionDropDown>
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
  id: string.isRequired,
  agreements: arrayOf(shape({})).isRequired,
  DropdownIndicator: func.isRequired,
  IconOption: func.isRequired,
  setShowModal: func.isRequired,
  history: shape({
    location: shape({
      pathname: string,
    }),
    push: () => {},
  }).isRequired,
  userRole: string.isRequired,
};
