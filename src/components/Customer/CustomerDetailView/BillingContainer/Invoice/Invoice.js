import React, { useCallback, useEffect, useState } from 'react';

import { arrayOf, func, shape, string } from 'prop-types';

import Theme from '../../../../../theme/Theme';
import MetricsInvoices from './MetricsInvoices';
import InvoiceList from './InvoiceList';
import { PageLoader } from '../../../../../common';
import { getMetricsInvoiceData } from '../../../../../api';

const Invoice = ({ id, invoiceType, onLoading, bpName, memberData }) => {
  const [loader, setLoader] = useState(false);
  const [invoiceMetricsData, setMetricsData] = useState(null);
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
    let isMounted = true;
    if (isMounted) {
      getDSPMetricsData(invoiceType);
    }
    return () => {
      isMounted = false;
    };
  }, [getDSPMetricsData, invoiceType]);

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
            loader={loader}
            id={id}
            bpName={bpName}
            memberData={memberData}
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
  bpName: '',
};

Invoice.propTypes = {
  id: string.isRequired,
  invoiceType: string,
  onLoading: func,
  bpName: string,
  memberData: arrayOf(shape({})).isRequired,
};
