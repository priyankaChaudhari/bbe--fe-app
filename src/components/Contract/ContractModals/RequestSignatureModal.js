import React, { useState } from 'react';
import Modal from 'react-modal';

import { string, bool, func, shape } from 'prop-types';

import RequestSignature from '../RequestSignature';
import { ModalBox } from '../../../common';
import { CloseIcon } from '../../../theme/images';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '600px ',
    minHeight: '170px',
    width: '100% ',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function RequestSignatureModal({
  showModal,
  setShowModal,
  removeParams,
  setShowEditor,
  id,
  details,
  pdfData,
  setOpenCollapse,
  getContractDetails,
  setIsLoading,
  setIsEditContract,
}) {
  const [showCloseBtn, setShowCloseBtn] = useState(true);
  return (
    <Modal
      isOpen={showModal}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Edit modal">
      {showCloseBtn ? (
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => {
            setShowModal(false);
            removeParams('step');
            setShowEditor(false);
          }}
          role="presentation"
        />
      ) : (
        ''
      )}
      <ModalBox>
        <RequestSignature
          id={id}
          agreementData={details}
          setShowModal={setShowModal}
          pdfData={pdfData}
          setOpenCollapse={setOpenCollapse}
          getContractDetails={getContractDetails}
          setContractLoading={setIsLoading}
          setShowEditor={setShowEditor}
          setIsEditContract={setIsEditContract}
          setShowCloseBtn={setShowCloseBtn}
        />
      </ModalBox>
    </Modal>
  );
}

export default RequestSignatureModal;

RequestSignatureModal.defaultProps = {
  showModal: false,
  setShowModal: () => {},
  removeParams: () => {},
  setShowEditor: () => {},
  id: '',
  details: {},
  pdfData: '',
  setOpenCollapse: () => {},
  getContractDetails: () => {},
  setIsLoading: () => {},
  setIsEditContract: () => {},
};

RequestSignatureModal.propTypes = {
  showModal: bool,
  setShowModal: func,
  removeParams: func,
  setShowEditor: func,
  id: string,
  details: shape({
    id: string,
  }),
  pdfData: string,
  setOpenCollapse: func,
  getContractDetails: func,
  setIsLoading: func,
  setIsEditContract: func,
};
