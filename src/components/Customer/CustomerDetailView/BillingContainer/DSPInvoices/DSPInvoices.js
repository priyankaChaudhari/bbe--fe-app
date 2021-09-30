import React, { useCallback, useEffect, useState } from 'react';

import { string } from 'prop-types';

import Theme from '../../../../../theme/Theme';
import MetricsInvoices from './MetricsInvoices';
import DSPInvoiceDetails from './DSPInvoiceDetails';
import { PageLoader } from '../../../../../common';
import { getDSPInvoiceData, getMetricsInvoiceData } from '../../../../../api';

const DSPInvoices = ({ id, invoiceType }) => {
  const [loader, setLoader] = useState(false);
  const [invoicesData, setInvoicesData] = useState(null);
  const [invoiceMetricsData, setMetricsData] = useState(null);

  const getDSPInvoicesData = useCallback(
    (type) => {
      setLoader(true);
      getDSPInvoiceData(type, id).then((res) => {
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
          <DSPInvoiceDetails
            invoiceType={invoiceType}
            data={invoicesData}
            loader={loader}
          />
        </>
      )}
    </div>
  );
};

export default DSPInvoices;

DSPInvoices.defaultProps = {
  invoiceType: 'rev share',
};

DSPInvoices.propTypes = {
  id: string.isRequired,
  invoiceType: string,
};
