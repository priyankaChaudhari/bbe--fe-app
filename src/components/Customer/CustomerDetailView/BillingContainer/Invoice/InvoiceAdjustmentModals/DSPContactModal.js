import React from 'react';

import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
import { bool, func, shape } from 'prop-types';

import {
  Button,
  ErrorMsg,
  ErrorMsgBox,
  InputFormField,
  ModalBox,
  PageLoader,
} from '../../../../../../common';
import { CloseIcon } from '../../../../../../theme/images';
import { dspContactInputFields } from '../../../../../../constants';
import Theme from '../../../../../../theme/Theme';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '600px ',
    width: '100% ',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function DSPContactModal({
  showDspContactModal,
  dspContact,
  onClose,
  onHandleChange,
  onConfirm,
  dspError,
  visibleBtn,
  loader,
}) {
  return (
    <Modal
      style={{ ...customStyles }}
      isOpen={showDspContactModal}
      ariaHideApp={false}
      contentLabel="Edit modal">
      <img
        src={CloseIcon}
        alt="close"
        className="float-right cursor cross-icon"
        onClick={onClose}
        role="presentation"
      />
      <ModalBox>
        <div className="modal-body pb-1">
          <h4>Edit DSP Contact</h4>
          <ErrorMsgBox className="mt-3  ">
            You need to fill out all required fields before submitting the DSP
            Contact.
          </ErrorMsgBox>
          <div className="body-content">
            {loader && <PageLoader color={Theme.orange} type="page" />}
            <div className="row">
              {dspContactInputFields.map((item) => {
                return (
                  <div className="col-12">
                    <InputFormField className="mt-3">
                      <label htmlFor="emailAddress">
                        {item.label}
                        <br />
                        {item.type === 'number' ? (
                          <NumberFormat
                            format={item.format}
                            className="form-control"
                            onChange={(event) => onHandleChange(event, item)}
                            placeholder={`Enter ${item.label}`}
                            isNumericString
                            defaultValue={dspContact?.[item.key]}
                          />
                        ) : (
                          <input
                            className="form-control"
                            type={item.type}
                            placeholder={`Enter ${item.label}`}
                            defaultValue={dspContact?.[item.key]}
                            onChange={(event) => onHandleChange(event, item)}
                          />
                        )}
                      </label>
                    </InputFormField>
                    <ErrorMsg>{dspError?.[item.key]}</ErrorMsg>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="footer-line" />
          <div className="modal-footer">
            <div className="row">
              <div className="col-md-6 col-12 col-sm-12  px-0">
                {' '}
                <Button
                  disabled={!visibleBtn}
                  className="btn-primary w-sm-100"
                  onClick={onConfirm}>
                  Confirm
                </Button>
              </div>
              <div className="col-md-6 col-12 col-sm-12 col-sm-mt-3  text-center">
                <Button className=" btn-borderless w-sm-100 ">
                  Discard Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ModalBox>
    </Modal>
  );
}

export default DSPContactModal;

DSPContactModal.defaultProps = {
  showDspContactModal: false,
  visibleBtn: false,
  dspContact: null,
  onClose: () => {},
  onHandleChange: () => {},
  onConfirm: () => {},
  dspError: {},
  loader: false,
};

DSPContactModal.propTypes = {
  showDspContactModal: bool,
  visibleBtn: bool,
  loader: bool,
  dspContact: shape({}),
  dspError: shape({}),
  onClose: func,
  onHandleChange: func,
  onConfirm: func,
};
