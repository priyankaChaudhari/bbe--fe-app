import React, { Fragment } from 'react';

import Modal from 'react-modal';
import { bool, func } from 'prop-types';
import { useMediaQuery } from 'react-responsive';

import { CloseIcon } from '../../../../../theme/images';
import { CommissionResseque } from '../BGSComissionContainerStyle';
import { commissionsTableHeaders } from '../../../../../constants';
import { HeaderDownloadFuntionality, TableGap } from '../../../../../common';

import { brandPartners, totalOfPartner } from '../dummydata';

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
                  </tr>
                </thead>
                <tbody style={{ width: '100%', display: 'table' }}>
                  {brandPartners.map((partner) => (
                    <tr className="partners" key={partner.id}>
                      <td>{partner.team_member}</td>
                      <td>{partner.retainer}</td>
                      <td>{partner.rev_share}</td>
                      <td>{partner.dsp}</td>
                      <td>{partner.total_book_size}</td>
                      <td className="text-bold">
                        {partner.book_size_commission}
                      </td>
                      <td>{partner.upsells}</td>
                      <td className="text-bold">
                        {partner.upsells_commission}
                      </td>
                      <td className="text-bold">{partner.total_commission}</td>
                    </tr>
                  ))}
                  <tr className="all-partners">
                    <td>{totalOfPartner.team_member}</td>
                    <td>{totalOfPartner.retainer}</td>
                    <td>{totalOfPartner.rev_share}</td>
                    <td>{totalOfPartner.dsp}</td>
                    <td>{totalOfPartner.total_book_size}</td>
                    <td className="text-bold">
                      {totalOfPartner.book_size_commission}
                    </td>
                    <td>{totalOfPartner.upsells}</td>
                    <td className="text-bold">
                      {totalOfPartner.upsells_commission}
                    </td>
                    <td className="text-bold">
                      {totalOfPartner.total_commission}
                    </td>
                  </tr>
                </tbody>
              </table>
            </TableGap>
          </div>
        ) : (
          <div className="container-fluid">
            {brandPartners.map((partner) => (
              <Fragment key={partner.id}>
                <div className="straight-line horizontal-line " />
                <ul className="commission-Resseque mt-3">
                  <li>
                    <div className="label">Brand Partner</div>
                    <div className="label-info">{partner.team_member}</div>
                  </li>
                  <li>
                    <div className="label">retainer</div>
                    <div className="label-info">{partner.retainer}</div>
                  </li>
                  <li>
                    <div className="label">rev share</div>
                    <div className="label-info">{partner.rev_share}</div>
                  </li>
                  <li>
                    <div className="label">DSP</div>
                    <div className="label-info">{partner.dsp}</div>
                  </li>
                  <li>
                    <div className="label">total Book Size</div>
                    <div className="label-info ">{partner.total_book_size}</div>
                  </li>
                  <li>
                    <div className="label">BOOK Size Comm.</div>
                    <div className="label-info label-info-dark">
                      {partner.book_size_commission}
                    </div>
                  </li>
                  <li>
                    <div className="label">upsells </div>
                    <div className="label-info label-info-dark">
                      {partner.upsells}
                    </div>
                  </li>
                  <li>
                    <div className="label">Upsells comm.</div>
                    <div className="label-info label-info-dark ">
                      {partner.upsells_commission}
                    </div>
                  </li>
                  <li>
                    <div className="label">total commission</div>
                    <div className="label-info label-info-dark ">
                      {partner.total_commission}
                    </div>
                  </li>
                </ul>
              </Fragment>
            ))}
            <ul className="commission-Resseque  active pt-3">
              <li>
                <div className="label">Brand Partner</div>
                <div className="label-info">{totalOfPartner.team_member}</div>
              </li>
              <li>
                <div className="label">retainer</div>
                <div className="label-info">{totalOfPartner.retainer}</div>
              </li>
              <li>
                <div className="label">rev share</div>
                <div className="label-info">{totalOfPartner.rev_share}</div>
              </li>
              <li>
                <div className="label">DSP</div>
                <div className="label-info">{totalOfPartner.dsp}</div>
              </li>
              <li>
                <div className="label">total Book Size</div>
                <div className="label-info ">
                  {totalOfPartner.total_book_size}
                </div>
              </li>
              <li>
                <div className="label">BOOK Size Comm.</div>
                <div className="label-info label-info-dark">
                  {totalOfPartner.book_size_commission}
                </div>
              </li>
              <li>
                <div className="label">upsells </div>
                <div className="label-info label-info-dark">
                  {totalOfPartner.upsells}
                </div>
              </li>
              <li>
                <div className="label">Upsells comm.</div>
                <div className="label-info label-info-dark ">
                  {totalOfPartner.upsells_commission}
                </div>
              </li>
              <li>
                <div className="label">total commission</div>
                <div className="label-info label-info-dark ">
                  {totalOfPartner.total_commission}
                </div>
              </li>
            </ul>
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
