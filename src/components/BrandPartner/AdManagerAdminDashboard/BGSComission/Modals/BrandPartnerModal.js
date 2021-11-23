import React from 'react';

import Modal from 'react-modal';
import { bool, func } from 'prop-types';

import { CloseIcon } from '../../../../../theme/images';
import { CommissionResseque } from '../BGSComissionContainerStyle';
import { HeaderDownloadFuntionality } from '../../../../../common';

const BrandPartnerModal = ({ showModal, setShowModal }) => {
  const customStyles = {
    content: {
      top: '50%',
      right: '0px',
      bottom: 'auto',
      maxWidth: '700px ',
      width: '100% ',
      maxHeight: '100%',
      overlay: ' {zIndex: 1000}',
      inset: '0% 0% 0% auto',
      marginRight: '0',
      borderRadius: '0px !important',
    },
  };

  return (
    <Modal
      isOpen={showModal}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Add team modal">
      <CommissionResseque>
        {' '}
        <HeaderDownloadFuntionality>
          <div className="container-fluid">
            {' '}
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="header-title large-header-title ml-3 ">
                  {' '}
                  Julia Resseque
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <ul className="contract-download-nav">
                  <li>
                    <img
                      width="18px"
                      src={CloseIcon}
                      alt="close"
                      className="float-right cursor remove-cross-icon"
                      onClick={() => {
                        setShowModal(false);
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
          <ul className="commission-Resseque mt-3">
            <li>
              <div className="label">Brand Partner</div>
              <div className="label-info">Ripley Tools LLC</div>
            </li>
            <li>
              <div className="label">retainer</div>
              <div className="label-info">$21,000.00</div>
            </li>
            <li>
              <div className="label">rev share</div>
              <div className="label-info">$21,000.00</div>
            </li>
            <li>
              <div className="label">DSP</div>
              <div className="label-info">0</div>
            </li>
            <li>
              <div className="label">total Book Size</div>
              <div className="label-info ">$21,000.00</div>
            </li>
            <li>
              <div className="label">BOOK Size Comm.</div>
              <div className="label-info label-info-dark">$21,000.00</div>
            </li>
            <li>
              <div className="label">upsells </div>
              <div className="label-info label-info-dark">$21,000.00</div>
            </li>
            <li>
              <div className="label">Upsells comm.</div>
              <div className="label-info label-info-dark ">$2,597.20</div>
            </li>
            <li>
              <div className="label">total commission</div>
              <div className="label-info label-info-dark ">$2,597.20</div>
            </li>
          </ul>
          <div className="straight-line horizontal-line " />
          <ul className="commission-Resseque  active pt-3">
            <li>
              <div className="label">Brand Partner</div>
              <div className="label-info">Ripley Tools LLC</div>
            </li>
            <li>
              <div className="label">retainer</div>
              <div className="label-info">$21,000.00</div>
            </li>
            <li>
              <div className="label">rev share</div>
              <div className="label-info">$21,000.00</div>
            </li>
            <li>
              <div className="label">DSP</div>
              <div className="label-info">0</div>
            </li>
            <li>
              <div className="label">total Book Size</div>
              <div className="label-info ">$21,000.00</div>
            </li>
            <li>
              <div className="label">BOOK Size Comm.</div>
              <div className="label-info label-info-dark">$21,000.00</div>
            </li>
            <li>
              <div className="label">upsells </div>
              <div className="label-info label-info-dark">$21,000.00</div>
            </li>
            <li>
              <div className="label">Upsells comm.</div>
              <div className="label-info label-info-dark ">$2,597.20</div>
            </li>
            <li>
              <div className="label">total commission</div>
              <div className="label-info label-info-dark ">$2,597.20</div>
            </li>
          </ul>
          <div className="straight-line horizontal-line " />
        </div>
      </CommissionResseque>
    </Modal>
  );
};

export default BrandPartnerModal;

BrandPartnerModal.propTypes = {
  showModal: bool.isRequired,
  setShowModal: func.isRequired,
};
