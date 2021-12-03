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
  PageLoader,
  TableGap,
} from '../../../../../common';

const BrandPartnerModal = ({
  showModal,
  setShowModal,
  BgsID,
  startDate,
  endDate,
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
  const [brandPartners, setBrandPartners] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getBgsBrandPartners(BgsID, startDate, endDate).then((res) => {
      if (res && (res.status === 400 || res.status === 404)) {
        setIsLoading(false);
      }
      if (res && res.status === 200) {
        if (res?.data) {
          setBrandPartners(res.data);
        }
      }
      setIsLoading(false);
    });
  }, [BgsID, startDate, endDate]);

  return (
    <Modal
      isOpen={showModal}
      style={isDesktop ? customStyles : customStylesTable}
      ariaHideApp={false}
      contentLabel="Add team modal">
      {isLoading ? (
        <PageLoader
          component="performance-graph"
          color="#FF5933"
          type="detail"
          width={40}
          height={40}
        />
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
                        {brandPartners?.records.map((partner) => (
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

                        {/* Brand Partners Total */}

                        <tr className="all-partners">
                          <td width="10%">All Partners</td>
                          <td width="10%">{brandPartners.total.retainer}</td>
                          <td width="10%">{brandPartners.total.rev_share}</td>
                          <td width="5%">{brandPartners.total.dsp}</td>
                          <td width="12%">
                            {brandPartners.total.total_book_size}
                          </td>
                          <td width="15%" className="text-bold">
                            {brandPartners.total.total_book_size_commission}
                          </td>
                          <td width="8%">{brandPartners.total.upsell}</td>
                          <td width="12%" className="text-bold">
                            {brandPartners.total.upsell_commission}
                          </td>
                          <td width="10%" className="text-bold">
                            {brandPartners.total.total_commission}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </TableGap>
                </div>
              </div>
            ) : (
              // Tablet & Mobile View

              <div className="modal-body pt-0">
                <div className="body-content ">
                  {brandPartners?.records.map((partner) => (
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
                            {partner.total_book_size_commission}
                          </div>
                        </li>
                        <li>
                          <div className="label">upsells </div>
                          <div className="label-info label-info-dark">
                            {partner.upsell}
                          </div>
                        </li>
                        <li>
                          <div className="label">Upsells comm.</div>
                          <div className="label-info label-info-dark ">
                            {partner.upsell_commission}
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
                        {brandPartners.total.team_member}
                      </div>
                    </li>
                    <li>
                      <div className="label">retainer</div>
                      <div className="label-info">
                        {brandPartners.total.retainer}
                      </div>
                    </li>
                    <li>
                      <div className="label">rev share</div>
                      <div className="label-info">
                        {brandPartners.total.rev_share}
                      </div>
                    </li>
                    <li>
                      <div className="label">DSP</div>
                      <div className="label-info">
                        {brandPartners.total.dsp}
                      </div>
                    </li>
                    <li>
                      <div className="label">total Book Size</div>
                      <div className="label-info ">
                        {brandPartners.total.total_book_size}
                      </div>
                    </li>
                    <li>
                      <div className="label">BOOK Size Comm.</div>
                      <div className="label-info label-info-dark">
                        {brandPartners.total.book_size_commission}
                      </div>
                    </li>
                    <li>
                      <div className="label">upsells </div>
                      <div className="label-info label-info-dark">
                        {brandPartners.total.upsell}
                      </div>
                    </li>
                    <li>
                      <div className="label">Upsells comm.</div>
                      <div className="label-info label-info-dark ">
                        {brandPartners.total.upsell_commission}
                      </div>
                    </li>
                    <li>
                      <div className="label">total commission</div>
                      <div className="label-info label-info-dark ">
                        {brandPartners.total.total_commission}
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
};
