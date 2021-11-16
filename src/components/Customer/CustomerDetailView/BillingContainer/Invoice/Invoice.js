import React, { useCallback, useEffect, useState } from 'react';

import { func, string } from 'prop-types';

import Theme from '../../../../../theme/Theme';
import MetricsInvoices from './MetricsInvoices';
import InvoiceList from './InvoiceList';
import { PageLoader } from '../../../../../common';
import { getInvoiceData, getMetricsInvoiceData } from '../../../../../api';

const Invoice = ({ id, invoiceType, onLoading }) => {
  const [loader, setLoader] = useState(false);
  const [invoicesData, setInvoicesData] = useState(null);
  const [invoiceMetricsData, setMetricsData] = useState(null);

  const getDSPInvoicesData = useCallback(
    (type) => {
      setLoader(true);
      getInvoiceData(type, id).then((res) => {
        if (res && res.status === 500) {
          setLoader(false);
          setInvoicesData(null);
        }

        if (res && res.status === 400) {
          setLoader(false);
        }
        if (res && res.status === 200) {
          if (res.data && res.data.results) {
            setInvoicesData(res.data.results);
          } else {
            setInvoicesData(null);
          }
          setLoader(false);
        }
      });
    },
    [id],
  );

  const getDSPMetricsData = useCallback(
    (type) => {
      setLoader(true);
      getMetricsInvoiceData(type, id).then((res) => {
        if (res && res.status === 500) {
          setLoader(false);
          setMetricsData(null);
        }

        if (res && res.status === 400) {
          setLoader(false);
        }
        if (res && res.status === 200) {
          if (res.data) {
            setMetricsData(res.data);
          } else {
            setMetricsData(null);
          }
          setLoader(false);
        }
      });
    },
    [id],
  );

  useEffect(() => {
    getDSPInvoicesData(invoiceType);
    getDSPMetricsData(invoiceType);
  }, [getDSPInvoicesData, getDSPMetricsData, invoiceType]);

  useEffect(() => {
    onLoading(loader);
  }, [loader, onLoading]);

  return (
    <div className="mt-4">
      {loader ? (
        <PageLoader
          component="performance-graph"
          type="detail"
          color={Theme.orange}
          width={40}
          height={40}
        />
      ) : (
        <>
          <MetricsInvoices data={invoiceMetricsData} />
          <InvoiceList
            invoiceType={invoiceType}
            data={invoicesData}
            loader={loader}
          />
        </>
      )}
    </div>
  );
};

export default Invoice;

Invoice.defaultProps = {
  invoiceType: 'rev share',
  onLoading: () => {},
};

Invoice.propTypes = {
  id: string.isRequired,
  invoiceType: string,
  onLoading: func,
};
