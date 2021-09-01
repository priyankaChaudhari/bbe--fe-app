import React, { useState, useEffect } from 'react';
// import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import Modal from 'react-modal';
import Theme from '../../../theme/Theme';

import {
  PageLoader,
  WhiteCard,
  Tabs,
  Status,
  ActionDropDown,
  ModalBox,
  // ContractFormField,
  Button,
  HeaderDownloadFuntionality,
  Table,
} from '../../../common';
import {
  ClockIcon,
  FileContract,
  RecurringIcon,
  DspOnlyIcon,
  ServiceIcon,
  ArrowIcons,
  CloseIcon,
  OrangeDownloadPdf,
} from '../../../theme/images';
// import { PATH_AGREEMENT } from '../../../constants';
import PastAgreement from './PastAgreement';
import { getAccountDetails } from '../../../store/actions/accountState';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '600px ',
    width: '100% ',
    // minHeight: '200px',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const customNotesStyles = {
  content: {
    top: '50%',
    right: '0px',
    bottom: 'auto',
    maxWidth: '600px ',
    width: '100% ',
    maxHeight: '100%',
    overlay: ' {zIndex: 1000}',
    inset: '0% 0% 0% auto',
    marginRight: '0',
    borderRadius: '0px !important',
  },
};

export default function AgreementDetails({ agreements, id }) {
  // const history = useHistory();
  const dispatch = useDispatch();
  const [viewComponent, setViewComponent] = useState('current');
  const multipleAgreement = useSelector(
    (state) => state.accountState.multipleAgreement,
  );
  const loader = useSelector((state) => state.accountState.isLoading);
  const [showModal, setShowModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState({
    modal: false,
    apiCall: false,
    deleteNote: false,
  });
  const [setNewNoteEditor] = useState(false);

  const agreementOptions = [
    { key: 'monthly_retainer', label: 'Monthly Retainer' },
    { key: 'rev_share', label: 'Rev Share' },
    { key: 'sales_threshold', label: 'Sales Threshold' },
    { key: 'billing_cap', label: 'Billing Cap' },
    {
      key: 'content_optimization',
      label: 'Copy Optimization',
    },
    {
      key: 'design_optimization',
      label: 'Design Optimization',
    },
  ];

  useEffect(() => {
    dispatch(getAccountDetails(id));
  }, [dispatch, id]);

  const countDays = (value) => {
    const date1 = new Date();
    const date2 = new Date(value);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const generateHTML = () => {
    const fields = [];
    for (const agreement of multipleAgreement) {
      if (
        agreement &&
        agreement.contract_status &&
        agreement.contract_status.value !== 'inactive'
      )
        fields.push(
          <WhiteCard className="mt-3 mb-3 selected-card" key={agreement.id}>
            <div className="row">
              <div className="col-lg-9 col-md-8 col-12">
                <img
                  width="48px"
                  className="solid-icon"
                  src={
                    agreement &&
                    agreement.contract_type &&
                    agreement.contract_type.toLowerCase().includes('one')
                      ? ServiceIcon
                      : agreement &&
                        agreement.contract_type &&
                        agreement.contract_type.toLowerCase().includes('dsp')
                      ? DspOnlyIcon
                      : RecurringIcon
                  }
                  alt=""
                />
                <div
                  className="contract-status"
                  role="presentation"
                  onClick={() => {
                    setShowModal(true);
                  }}>
                  <Status
                    className="mr-2 mb-2"
                    label="Draft"
                    backgroundColor={Theme.gray8}
                  />
                  <p className="black-heading-title mt-2 mb-0">
                    {agreement &&
                    agreement.contract_type &&
                    agreement.contract_type.toLowerCase().includes('one')
                      ? 'One Time Service Agreement'
                      : agreement &&
                        agreement.contract_type &&
                        agreement.contract_type.toLowerCase().includes('dsp')
                      ? 'DSP Service Agreement'
                      : 'Recurring Service Agreement'}
                  </p>
                  {agreement && agreement.contract_type !== 'one time' ? (
                    <ul className="recurring-contact">
                      <li>
                        <p className="basic-text ">
                          {agreement &&
                            agreement.length &&
                            agreement.length.label &&
                            agreement.length.label.slice(0, -1)}{' '}
                        </p>
                      </li>
                      {agreement && agreement.start_date ? (
                        <li>
                          <span className="dot" />
                          <p className="basic-text ">
                            {agreement.contract_status &&
                            agreement.contract_status.value === 'renewed'
                              ? 'Renewed'
                              : 'Started'}
                            &nbsp;
                            {dayjs(agreement.start_date).format('MMM DD, YYYY')}
                          </p>
                        </li>
                      ) : (
                        ''
                      )}
                      {agreement && agreement.end_date ? (
                        <li>
                          <span className="dot" />
                          <p className="basic-text ">
                            Expires:{' '}
                            {dayjs(agreement.end_date).format('MMM DD, YYYY')}
                          </p>
                        </li>
                      ) : (
                        ''
                      )}
                      {agreement &&
                      agreement.end_date &&
                      countDays(agreement && agreement.end_date) <= 90 ? (
                        <li>
                          <div className="days-block">
                            {' '}
                            <img
                              className="clock-icon"
                              src={ClockIcon}
                              alt="clock"
                            />{' '}
                            {countDays(agreement && agreement.end_date)} days
                          </div>
                        </li>
                      ) : (
                        ''
                      )}
                    </ul>
                  ) : (
                    ''
                  )}
                </div>
              </div>

              <div className="clear-fix" />
              {agreement &&
              agreement.contract_status &&
              (agreement.contract_status.value === 'pending account setup' ||
                agreement.contract_status.value === 'active') &&
              agreement.contract_url === null ? null : (
                <div
                  className="col-lg-3  pl-0 col-md-4 col-12 text-right"
                  role="presentation"
                  onClick={() =>
                    localStorage.setItem('agreementID', agreement.id)
                  }>
                  {/* <Link
                    to={{
                      pathname: PATH_AGREEMENT.replace(':id', id).replace(
                        ':contract_id',
                        agreement.id,
                      ),
                      state:
                        history &&
                        history.location &&
                        history.location.pathname,
                    }}> */}
                  <ActionDropDown>
                    {' '}
                    <Select
                      classNamePrefix="react-select"
                      placeholder="View Actions"
                      className="active"
                    />
                  </ActionDropDown>
                  {/* </Link> */}
                </div>
              )}
              <div className="straight-line horizontal-line pt-3 mb-3" />
            </div>

            <CustomerDetailCoppase className="disabled">
              <div className="DSP-contract-retainer">
                <div className="row ">
                  {agreement && agreement.contract_type === 'recurring' ? (
                    <>
                      {agreementOptions.map((item) => (
                        <div
                          className=" col-lg-3 col-md-3 mb-3 col-6 "
                          key={item.key}>
                          <div className="label">{item.label}</div>
                          {agreement && agreement[item.key] ? (
                            <NumberFormat
                              displayType="text"
                              value={
                                agreement[item.key].label || agreement[item.key]
                              }
                              thousandSeparator
                              prefix={
                                item.key === 'rev_share' ||
                                item.key === 'content_optimization' ||
                                item.key === 'design_optimization'
                                  ? ''
                                  : '$'
                              }
                              suffix={item.key === 'rev_share' ? '%' : ''}
                            />
                          ) : (
                            '0'
                          )}
                        </div>
                      ))}
                    </>
                  ) : agreement && agreement.contract_type === 'dsp only' ? (
                    <div className=" col-lg-3 col-md-3 col-6">
                      <div className="label">Monthly Ad Budget</div>
                      <NumberFormat
                        displayType="text"
                        value={agreement.dsp_fee || 0}
                        thousandSeparator
                        prefix="$"
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              {agreement && agreement.contract_type === 'recurring' ? (
                <>
                  <div className="straight-line horizontal-line pt-1 mb-3" />
                  <div className="label">Marketplaces</div>
                  <ul className="selected-list">
                    {agreement &&
                    agreement.primary_marketplace === null &&
                    agreement.additional_marketplaces === null
                      ? 'No Marketplaces added.'
                      : ''}
                    {agreement && agreement.primary_marketplace ? (
                      <li>{agreement.primary_marketplace.name} (Primary)</li>
                    ) : (
                      ''
                    )}
                    {agreement && agreement.additional_marketplaces
                      ? agreement.additional_marketplaces.map((item) => (
                          <li key={item.id}>
                            {item.name || ''}{' '}
                            {item.is_primary ? '(Primary)' : ''}
                          </li>
                        ))
                      : ''}
                  </ul>
                  <div className="label mt-3">Additional Monthly Services</div>
                  <ul className="selected-list">
                    {agreement && agreement.additional_monthly_services
                      ? agreement.additional_monthly_services.map((item) => (
                          <li key={item.id}>
                            {(item && item.service && item.service.name) || ''}
                          </li>
                        ))
                      : 'No Additional Monthly services added.'}
                  </ul>
                  <div className="straight-line horizontal-line pt-3 mb-3" />
                </>
              ) : (
                ''
              )}

              {agreement && agreement.contract_type !== 'dsp only' ? (
                <>
                  <div className="label">One Time Services</div>
                  <ul className="selected-list">
                    {agreement && agreement.additional_one_time_services
                      ? agreement.additional_one_time_services.map((item) => (
                          <li key={item.id}>
                            {(item && item.service && item.service.name) || ''}{' '}
                            ({(item && item.quantity) || ''})
                          </li>
                        ))
                      : 'No One Time services added.'}
                  </ul>
                </>
              ) : (
                ''
              )}
            </CustomerDetailCoppase>
          </WhiteCard>,
          <div className="looking-past-agre">
            <p className="gray-normal-text">
              <img
                width="16px;"
                style={{ verticalAlign: 'text-top', marginLeft: '5px' }}
                src={FileContract}
                alt="file"
              />{' '}
              Looking for Past Agreements?
              <span
                className="cursor"
                role="presentation"
                onClick={() => {
                  setShowNotesModal({
                    modal: true,
                    apiCall: false,
                  });
                }}
                style={{
                  fontWeight: '600',
                  marginLeft: '7px',
                  position: 'relative',
                }}>
                {' '}
                View here
                <img
                  style={{
                    transform: 'rotate(180deg)',
                    width: '13px',
                    top: '2px',
                    right: '-16px',
                    position: 'absolute',
                  }}
                  src={ArrowIcons}
                  alt="arrow"
                />
              </span>
            </p>
          </div>,
        );
    }

    return fields && fields.length === 0 ? (
      <WhiteCard className="text-center">No Agreements Found.</WhiteCard>
    ) : (
      fields
    );
  };
  const renderNotesModal = () => {
    return (
      <Modal
        isOpen={showNotesModal.modal}
        style={customNotesStyles}
        ariaHideApp={false}
        contentLabel="Add team modal">
        <NotesSideBar>
          <HeaderDownloadFuntionality>
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  {' '}
                  <div className="header-title "> Past Agreements</div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <ul className="contract-download-nav">
                    <li>
                      <span className="divide-arrow hide-mobile" />
                    </li>
                    <li>
                      <img
                        width="18px"
                        src={CloseIcon}
                        alt="close"
                        className="float-right cursor remove-cross-icon"
                        onClick={() => {
                          setShowNotesModal(false);
                          setNewNoteEditor(false);
                        }}
                        role="presentation"
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </HeaderDownloadFuntionality>
          <div className="container-fluid">
            <Table className="mt-0 product-catalog-laptop ">
              <tr>
                <th width="75%" className="product-header ">
                  Agreement Type
                </th>
                <th width="25%" className="product-header ">
                  Date Expired
                </th>
              </tr>
              <tbody>
                <tr width="100%">
                  <td className="product-body agreement">
                    {' '}
                    Recurring Contract
                  </td>
                  <td className="product-body agreement">
                    {' '}
                    05/20/2021{' '}
                    <img
                      className="orange-icon"
                      width="18px"
                      src={OrangeDownloadPdf}
                      alt="download"
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </NotesSideBar>
      </Modal>
    );
  };

  return (
    <>
      <div className="col-lg-6 col-12">
        <Tabs>
          <ul className="tabs">
            <li
              className={viewComponent === 'current' ? 'active' : ''}
              onClick={() => setViewComponent('current')}
              role="presentation">
              Recurring Agreements
            </li>
            <li
              className={viewComponent === 'past' ? 'active' : ''}
              onClick={() => setViewComponent('past')}
              role="presentation">
              One Time Agreements
            </li>
          </ul>
        </Tabs>
        <>
          {loader ? (
            <PageLoader
              component="agrement-details"
              color="#FF5933"
              type="detail"
              width={40}
              height={40}
            />
          ) : (
            <>
              {viewComponent === 'current' ? (
                <>{generateHTML()}</>
              ) : (
                <PastAgreement agreement={agreements} id={id} />
              )}
            </>
          )}
        </>
        {renderNotesModal()}
        <Modal
          isOpen={showModal}
          style={customStyles}
          // ={customStylesForAlert}
          ariaHideApp={false}
          contentLabel="Edit modal">
          <img
            src={CloseIcon}
            alt="close"
            className="float-right cursor cross-icon"
            onClick={() => setShowModal(false)}
            role="presentation"
          />
          {/* <ModalBox>
            <div className="modal-body">
              <h4 className="on-boarding mb-3 pb-2">Pause Contract</h4>

              <p className="long-text mb-2 pb-1">
                {' '}
                Before you proceed, please enter the duration to pause this
                contract.
              </p>
              <div className="row">
                <div className="col-6">
                  <ContractFormField>
                    <Select />
                  </ContractFormField>
                </div>
                <div className="col-6">
                  <ContractFormField>
                    <Select />
                  </ContractFormField>
                </div>
              </div>
              <div className="row mt-1">
                <div className="col-6 mt-4">
                  <Button className="btn-primary w-100">
                    Confirm Duration
                  </Button>
                </div>
                <div className="col-6 mt-4">
                  <Button className="btn-transparent w-100">Cancel</Button>
                </div>
              </div>
            </div>
          </ModalBox> */}
          <ModalBox>
            <div className="modal-body">
              {/* <p className="black-heading-title text-center mt-3">
                Cancel Contract
              </p>
              <p className="long-text mb-2 text-center ">
                {' '}
                Are you sure you would like to request approval to cancel this
                contract?
              </p> */}
              <p className="black-heading-title text-center  mt-2">
                Delete Contract
              </p>
              <div className="alert-msg pb-3 ">
                Are you sure you would like to delete this contract?
                <div className="sure-to-proceed">
                  This action cannot be undone.
                </div>
              </div>

              <div className="row ">
                <div className="col-6 mt-3">
                  <Button className="btn-primary w-100">
                    Request Approval
                  </Button>
                </div>
                <div className="col-6 mt-3">
                  <Button className="btn-transparent w-100">
                    Don&lsquo;t Request
                  </Button>
                </div>
              </div>
            </div>
          </ModalBox>
        </Modal>
      </div>
    </>
  );
}

AgreementDetails.propTypes = {
  id: PropTypes.string.isRequired,
  agreements: PropTypes.shape({
    id: PropTypes.string,
    contract_type: PropTypes.string,
    length: PropTypes.shape({
      label: PropTypes.string,
    }),
    end_date: PropTypes.string,
    additional_marketplaces: PropTypes.arrayOf(PropTypes.object),
    additional_monthly_services: PropTypes.arrayOf(PropTypes.object),
    additional_one_time_services: PropTypes.arrayOf(PropTypes.object),
    primary_marketplace: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
};

const CustomerDetailCoppase = styled.div`
  .ReactCollapse--content {
    width: 100%;
  }
`;
const NotesSideBar = styled.div`
  top: 0;
  background: #ffff;
  height: 100%;
  .footer-sticky {
    position: fixed;
    bottom: 0;
    max-width: 600px;
    width: 100%;
    background: white;
  }
  .notes-pin-unpin {
    position: relative;

    .pin-icon {
      background: #0062ff;
      padding: 2px;
      border-radius: 50%;
      width: 19px;
      position: absolute;
      top: 27px;
      left: 25px;
      transform: rotate(-46deg);
    }
  }
  .chat-info-icon {
    position: absolute;
    right: 47px;
  }
  .dropdown-select-all-notes {
    background-color: rgba(224, 231, 255, 0.2);
    border: 1px solid ${Theme.gray2};
    border-radius: 20px;
    width: 230px;
    height: 40px;
    color: ${Theme.black};
    padding: 11px 2px 0 14px;
  }
  .dropdown-notes-filter {
    background-color: ${Theme.white};
    border-radius: 8px;
    box-shadow: 0 5px 15px 0 rgba(68, 68, 79, 0.4);
    max-width: 230px;
    padding: 15px;
    position: absolute;
    z-index: 99999;
    top: 45px;
    width: 100%;

    &.hide {
      display: none;
    }
    &.show {
      display: block;
    }
    .notes-option {
      list-style-type: none;
      padding: 0;
      margin: 0;

      li {
        padding-bottom: 14px;

        &.checkbox-option {
          padding-bottom: 4px;
        }

        &.teams-title {
          color: ${Theme.gray40};
          text-transform: uppercase;
          font-size: 11px;
          padding: 5px 0 15px 0;
          font-family: ${Theme.titleFontFamily};
        }
      }
    }
  }
  .commemt-inbox-body {
    height: 80vh;
    overflow: scroll;
    padding-bottom: 50px;
  }
  @media only screen and (max-width: 767px) {
    .dropdown-select-all-notes {
      width: 100%;
      max-width: 100%;
    }
    .commemt-inbox-body {
      height: 60vh;
      overflow: scroll;
    }
  }
`;
