import React from 'react';

import { func, string } from 'prop-types';

import { WhiteCard } from '../../../../common';
import { InvoiceIcon, PartnersIcon } from '../../../../theme/images';

const DSPInvoiceTabs = ({ onTabClick, viewComponent }) => {
  return (
    <WhiteCard className="left-border mb-3">
      <ul className="left-details-card ">
        <li onClick={() => onTabClick('invoices')} role="presentation">
          <div
            className={`left-details ${
              viewComponent === 'invoices' ? 'active' : ''
            }`}>
            <img
              style={{ height: '22px' }}
              className="file-contract"
              src={InvoiceIcon}
              alt="monitor"
            />
            Invoices
          </div>
        </li>
        <li onClick={() => onTabClick('partners')} role="presentation">
          <div
            className={`left-details ${
              viewComponent === 'partners' ? 'active' : ''
            }`}>
            <img
              style={{ height: '22px' }}
              className="file-contract"
              src={PartnersIcon}
              alt="monitor"
            />
            Partners
          </div>
        </li>
      </ul>
    </WhiteCard>
  );
};

export default DSPInvoiceTabs;

DSPInvoiceTabs.defaultProps = {
  onTabClick: func,
};
DSPInvoiceTabs.propTypes = {
  onTabClick: func,
  viewComponent: string.isRequired,
};
