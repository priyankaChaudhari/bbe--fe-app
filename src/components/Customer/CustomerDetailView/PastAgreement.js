import React from 'react';

import styled from 'styled-components';
import Modal from 'react-modal';
import dayjs from 'dayjs';
import { func, string, shape, bool, number, arrayOf } from 'prop-types';

import Theme from '../../../theme/Theme';
import { PATH_AGREEMENT } from '../../../constants';
import { HeaderDownloadFuntionality, Table } from '../../../common';
import {
  CloseIcon,
  ExternalLink,
  OrangeDownloadPdf,
} from '../../../theme/images';

export default function PastAgreement({
  showPastAgreements,
  setShowPastAgreements,
  agreements,
  history,
  id,
}) {
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

  return (
    <Modal
      isOpen={showPastAgreements}
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
                      onClick={() => setShowPastAgreements(false)}
                      role="presentation"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </HeaderDownloadFuntionality>
        <div className="container-fluid">
          {agreements && agreements.length === 0 ? (
            <div className="text-center mt-3">No Past Agreement found.</div>
          ) : (
            <Table className="mt-0 product-catalog-laptop ">
              <thead>
                <tr>
                  <th width="75%" className="product-header ">
                    Agreement Type
                  </th>
                  <th width="25%" className="product-header ">
                    Date Expired
                  </th>
                </tr>
              </thead>
              <tbody>
                {agreements.map((item) => (
                  <tr width="100%" key={item.id}>
                    <td
                      className="product-body agreement cursor"
                      onClick={() =>
                        history.push({
                          pathname: PATH_AGREEMENT.replace(':id', id).replace(
                            ':contract_id',
                            item.id,
                          ),
                          state:
                            history &&
                            history.location &&
                            history.location.pathname,
                        })
                      }
                      role="presentation">
                      {item &&
                      item.contract_type &&
                      item.contract_type.toLowerCase().includes('notice')
                        ? 'Recurring (90 day notice) Service Agreement'
                        : item &&
                          item.contract_type &&
                          item.contract_type.toLowerCase().includes('dsp')
                        ? 'DSP Service Agreement'
                        : 'Recurring Service Agreement'}{' '}
                      <img
                        style={{ verticalAlign: 'middle' }}
                        className="ml-1"
                        width="20px"
                        src={ExternalLink}
                        alt="link"
                      />
                    </td>
                    <td className="product-body agreement">
                      {item.end_date
                        ? dayjs(item.end_date).format('DD/MM/YYYY')
                        : ''}

                      <a
                        className="download-pdf-link"
                        href={
                          item && item.contract_url
                            ? item && item.contract_url
                            : null
                        }
                        download>
                        <img
                          className="orange-icon cursor"
                          width="18px"
                          src={OrangeDownloadPdf}
                          alt="download"
                          role="presentation"
                        />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </NotesSideBar>
    </Modal>
  );
}

PastAgreement.propTypes = {
  showPastAgreements: bool.isRequired,
  setShowPastAgreements: func.isRequired,
  agreements: arrayOf(
    shape({
      map: func,
      length: number,
    }),
  ).isRequired,
  history: shape({
    push: func,
    location: shape({
      pathname: string,
    }),
  }).isRequired,
  id: string.isRequired,
};

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
