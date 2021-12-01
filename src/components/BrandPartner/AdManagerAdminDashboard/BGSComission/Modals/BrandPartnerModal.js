import React, { Fragment, useEffect, useState } from 'react';

import Modal from 'react-modal';
import { useMediaQuery } from 'react-responsive';
import { bool, func, string } from 'prop-types';

import { CloseIcon } from '../../../../../theme/images';
import { CommissionResseque } from '../BGSComissionContainerStyle';
import { getBgsBrandPartners } from '../../../../../api';
import { commissionsTableheader } from '../../../../../constants';

import {
  HeaderDownloadFuntionality,
  ModalBox,
  TableGap,
} from '../../../../../common';

// Remove this after actual integration
import { brandPartners, totalOfPartner } from '../dummydata';

const BrandPartnerModal = ({
  showModal,
  setShowModal,
  BgsID,
  startDate,
  endDate,
  orderBy,
}) => {
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

  const [isLoading, setIsLoading] = useState(true);
  // const [brandPartners, setBrandPartners] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getBgsBrandPartners(BgsID, startDate, endDate, orderBy).then((res) => {
      if (res && (res.status === 400 || res.status === 404)) {
        setIsLoading(false);
      }
      if (res && res.status === 200) {
        if (res.data && res.data) {
          // setDSPData(res.data);
        }
      }
      setIsLoading(false);
    });
  }, [BgsID, startDate, endDate, orderBy]);

  return (
    <Modal
      isOpen={showModal}
      style={isDesktop ? customStyles : customStylesTable}
      ariaHideApp={false}
      contentLabel="Add team modal">
      {isLoading ? (
        <h1>isLoading..</h1>
      ) : (
        <ModalBox>
          <CommissionResseque>
            <HeaderDownloadFuntionality className="border-none">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-8 ">
                    <div className="header-title large-header-title  ">
                      Julia Resseque
                    </div>
                  </div>
                  <div className="col-4">
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
                  </div>
                </div>
              </div>
            </HeaderDownloadFuntionality>
            {isDesktop ? (
              <div className="modal-body pt-0">
                <div className="body-content ">
                  <TableGap>
                    <table>
                      <thead style={{ width: '100%', display: 'table' }}>
                        <tr className="overlay-modal-header">
                          {commissionsTableheader.map((header) => (
                            <th
                              width={header.width}
                              className=" text-left"
                              key={header.key}>
                              {header.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody style={{ width: '100%', display: 'table' }}>
                        {brandPartners.map((partner) => (
                          <tr className="partners" key={partner.id}>
                            <td width="10%">{partner.company_name}</td>
                            <td width="10%">{partner.retainer}</td>
                            <td width="10%">{partner.rev_share}</td>
                            <td width="5%">{partner.dsp}</td>
                            <td width="12%">{partner.total_book_size}</td>
                            <td width="15%" className="text-bold">
                              {partner.total_book_size_commission}
                            </td>
                            <td width="8%">{partner.upsell}</td>
                            <td width="12%" className="text-bold">
                              {partner.upsell_commission}
                            </td>
                            <td width="10%" className="text-bold">
                              {partner.total_commission}
                            </td>
                          </tr>
                        ))}
                        <tr className="all-partners">
                          <td width="10%">All Partners</td>
                          <td width="10%">{totalOfPartner.retainer}</td>
                          <td width="10%">{totalOfPartner.rev_share}</td>
                          <td width="5%">{totalOfPartner.dsp}</td>
                          <td width="12%">{totalOfPartner.total_book_size}</td>
                          <td width="15%" className="text-bold">
                            {totalOfPartner.total_book_size_commission}
                          </td>
                          <td width="8%">{totalOfPartner.upsell}</td>
                          <td width="12%" className="text-bold">
                            {totalOfPartner.upsell_commission}
                          </td>
                          <td width="10%" className="text-bold">
                            {totalOfPartner.total_commission}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </TableGap>
                </div>
              </div>
            ) : (
              // <div className="container-fluid">
              <div className="modal-body pt-0">
                <div className="body-content ">
                  {brandPartners.map((partner) => (
                    <Fragment key={partner.id}>
                      <div className="straight-line horizontal-line mt-2 " />
                      <ul className="commission-Resseque mt-3">
                        <li>
                          <div className="label">Brand Partner</div>
                          <div className="label-info">
                            {partner.team_member}
                          </div>
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
                          <div className="label-info ">
                            {partner.total_book_size}
                          </div>
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
                      <div className="label-info">
                        {totalOfPartner.team_member}
                      </div>
                    </li>
                    <li>
                      <div className="label">retainer</div>
                      <div className="label-info">
                        {totalOfPartner.retainer}
                      </div>
                    </li>
                    <li>
                      <div className="label">rev share</div>
                      <div className="label-info">
                        {totalOfPartner.rev_share}
                      </div>
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
              </div>
              // </div>
            )}
          </CommissionResseque>
        </ModalBox>
      )}
    </Modal>
  );
};

export default BrandPartnerModal;

BrandPartnerModal.propTypes = {
  showModal: bool.isRequired,
  setShowModal: func.isRequired,
  BgsID: string.isRequired,
  startDate: string.isRequired,
  endDate: string.isRequired,
  orderBy: string.isRequired,
};
