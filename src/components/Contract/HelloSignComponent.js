import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import HelloSign from 'hellosign-embedded';
// import styled from 'styled-components';
import { PATH_WARNING } from '../../constants/index';
import { transactionalSignUp, checksignatureStatus } from '../../api/index';
import { PageLoader } from '../../common';
// import Header from '../../common/Header';
// import Theme from '../../theme/Theme';

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
          state: { error: res && res.data && res.data.request_id },
        });
      } else {
        client.open(res && res.data && res.data.sign_url, {
          skipDomainVerification: true,
        });

        client.on('finish', () => {
          checksignatureStatus({ request_id: params.key }).then(() => {
            // console.log(res, ' after check signature status');
          });
          // history.push(PATH_LOGIN);
          window.location.href = 'http://www.buyboxexperts.com/';
        });

        client.on('close', () => {
          checksignatureStatus({ request_id: params.key }).then(() => {
            // console.log(res, ' after check signature status');
          });
          // history.push(PATH_LOGIN);
          window.location.href = 'http://www.buyboxexperts.com/';
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader color="#FF5933" type="page" />
      ) : (
        <>
          {/* <Header /> */}

          {/* <Footer className="sticky">
            {' '}
            <p>Last updated by You on Dec 1, 4:18 PM</p>
          </Footer> */}
        </>
      )}
    </div>
  );
}

export default HelloSignComponent;

// const Footer = styled.div`
//   border: 1px solid ${Theme.gray15};
//   bottom: 0;
//   width: 100%;
//   background: #fff;
//   box-shadow: ${Theme.boxShadow};
//   position: fixed;
//   min-height: 80px;

//   .w-320 {
//     float: left;
//     max-width: 320px;
//     width: 100%;
//   }

//   p {
//     float: left;
//     margin-top: 30px;
//   }
// `;
