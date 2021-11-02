/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import queryString from 'query-string';
import HelloSign from 'hellosign-embedded';
import { useHistory } from 'react-router-dom';

import { PageLoader } from '../../common';
import { PATH_WARNING } from '../../constants';
import { transactionalSignUp } from '../../api';

function HelloSignComponent() {
  const history = useHistory();
  const params = queryString.parse(history.location.search);
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });

  useEffect(() => {
    setIsLoading({ loader: false, type: 'page' });
    const client = new HelloSign({
      clientId: process.env.REACT_APP_HELLOSIGN_CLIENT_ID,
    });
    transactionalSignUp({
      request_id: params.key,
    }).then((res) => {
      if (res && res.status === 400) {
        history.push({
          pathname: PATH_WARNING,
          state: { error: res?.data?.request_id },
        });
      } else {
        client.open(res?.data?.sign_url, {
          skipDomainVerification: true,
        });
        client.on('finish', () => {
          window.location.href = 'http://www.buyboxexperts.com/';
        });
        client.on('close', () => {
          window.location.href = 'http://www.buyboxexperts.com/';
        });
      }
    });
  }, []);
  return (
    <div>
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader color="#FF5933" type="page" />
      ) : (
        <>
          {/* <Header /> */}
          {/* <Footer className="sticky">
            <p>Last updated by You on Dec 1, 4:18 PM</p>
          </Footer> */}
        </>
      )}
    </div>
  );
}

export default HelloSignComponent;
