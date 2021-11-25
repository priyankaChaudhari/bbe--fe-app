import React from 'react';

import Modal from 'react-modal';
import { useMediaQuery } from 'react-responsive';
import { bool, func } from 'prop-types';

import { CloseIcon } from '../../../../../theme/images';
import { commissionsTableHeaders } from '../../../../../constants';
import { CommissionResseque } from '../BGSComissionContainerStyle';
import { HeaderDownloadFuntionality, TableGap } from '../../../../../common';

const BrandPartnerModal = ({ showModal, setShowModal }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });

  const customStyles = {
    content: {
      top: '50%',
      right: '0px',
      bottom: 'auto',
      maxWidth: '1205px ',
      width: '100% ',
      maxHeight: '100%',
      overlay: ' {zIndex: 1000}',
      inset: '0% 0% 0% auto',
      marginRight: '0',
      borderRadius: '0px !important',
    },
  };
  const customStylesTable = {
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
      style={isDesktop ? customStyles : customStylesTable}
      ariaHideApp={false}
      contentLabel="Add team modal">
      <CommissionResseque>
        <HeaderDownloadFuntionality className="border-none">
          <div className="container-fluid">
            <div className="row">
              <div className="col-6 ">
                <div className="header-title large-header-title ml-3 ">
                  Julia Resseque
                </div>
              </div>
              <div className="col-6  ">
                <ul className="contract-download-nav">
                  <li>
                    <img
                      width="18px"
                      src={CloseIcon}
                      alt="close"
                      className="float-right cursor remove-cross-icon mr-3"
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
        {isDesktop ? (
          <div className="ml-4 pr-4">
            <TableGap>
              <table>
                <thead style={{ width: '100%', display: 'table' }}>
                  <tr className="overlay-modal-header">
                    {commissionsTableHeaders.map((header) => (
                      <th className="text-left">{header}</th>
                    ))}
                    {/* <th className="text-left">team member</th>
                    <th className="text-left">retainer</th>
                    <th className="text-left">rev share</th>
                    <th className="text-left">dsp</th>
                    <th className="text-left">total book size</th>
                    <th className="text-left">BOOK Size commission</th>
                    <th className="text-left">upsells</th>
                    <th className="text-left">Upsells commission</th>
                    <th className="text-left">total commission</th> */}
                  </tr>
                </thead>
                <tbody style={{ width: '100%', display: 'table' }}>
                  <tr className="partners">
                    <td>Team Jake</td>
                    <td>$2,597.20</td>
                    <td>$2,597.20</td>
                    <td>$2,597.20</td>
                    <td>$805.00</td>
                    <td className="text-bold">0</td>
                    <td>$805.00</td>
                    <td className="text-bold">$805.00</td>
                    <td className="text-bold">$1,714.59</td>
                  </tr>
                  <tr className="partners">
                    <td>Team Jake</td>
                    <td>$2,597.20</td>
                    <td>$2,597.20</td>
                    <td>$2,597.20</td>
                    <td>$805.00</td>
                    <td className="text-bold">0</td>
                    <td>$805.00</td>
                    <td className="text-bold">$805.00</td>
                    <td className="text-bold">$1,714.59</td>
                  </tr>
                  <tr className="partners">
                    <td>Team Jake</td>
                    <td>$2,597.20</td>
                    <td>$2,597.20</td>
                    <td>$2,597.20</td>
                    <td>$805.00</td>
                    <td className="text-bold">0</td>
                    <td>$805.00</td>
                    <td className="text-bold">$805.00</td>
                    <td className="text-bold">$1,714.59</td>
                  </tr>
                  <tr className="all-partners">
                    <td>Team Jake</td>
                    <td>$2,597.20</td>
                    <td>$2,597.20</td>
                    <td>$2,597.20</td>
                    <td>$805.00</td>
                    <td className="text-bold">0</td>
                    <td>$805.00</td>
                    <td className="text-bold">$805.00</td>
                    <td className="text-bold">$1,714.59</td>
                  </tr>
                </tbody>
              </table>
            </TableGap>
          </div>
        ) : (
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
        )}
      </CommissionResseque>
    </Modal>
  );
};

export default BrandPartnerModal;

BrandPartnerModal.propTypes = {
  showModal: bool.isRequired,
  setShowModal: func.isRequired,
};
