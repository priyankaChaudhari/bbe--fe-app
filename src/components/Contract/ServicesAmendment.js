import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowIcons } from '../../theme/images';
import AgreementSidePanel from '../../common/AgreementSidePanel';

export default function ServicesAmendment() {
  const location = useLocation();
  const id = location.pathname.split('/')[2];

  return (
    <div>
      <div className="on-boarding-container">
        <div className="row">
          <div className=" col-10 mb-4 pb-5">
            <div className="text-container ">
              <p className="m-0 p-0 mt-2">
                {' '}
                <div className="link">
                  <img
                    src={ArrowIcons}
                    alt="aarow-back"
                    className="arrow-icon mt-3"
                  />
                  Back to Customer Details
                </div>
              </p>
              <h3 className="mt-5 mb-4 text-center">
                Additional One Time Services Amendment
              </h3>
              <Paragraph>
                <p className="long-text ">
                  This addendum (the “Addendum”) is hereby incorporated into the
                  agreement (“The Agreement”) between{' '}
                  <span>
                    Buy Box Experts (“BBE”) and CUSTOMER_NAME (“Client”)
                  </span>
                  , collectively “The Parties” and individually a “Party”that
                  was <span> signed by the Parties on AGREEMENT_DATE.</span>{' '}
                  Both Parties hereby agree to incorporate the following terms
                  regarding the delivery of services to their existing
                  Agreement. In the event that any terms between the Agreement
                  and this addendum are in conflict, the terms in this Addendum
                  will prevail, otherwise, the remainder of the Agreement
                  remains in force and applies to this Addendum as if it were
                  part of the original Agreement.
                  <br />
                  <br />
                  <table className="contact-list">
                    <tr>
                      <th>Qty.</th>
                      <th>Service</th>
                      <th> Fee</th>
                      <th>Total</th>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>A+ Content</td>
                      <td>$600</td>
                      <td>$600</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Amazon Store [type]</td>
                      <td>$1,500</td>
                      <td>$1,500</td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>Infographics</td>
                      <td>$200</td>
                      <td>$2,000</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>Listing Copy</td>
                      <td>$300</td>
                      <td>$1,500</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Product Insert</td>
                      <td>$150</td>
                      <td>$300</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>Amazon Brand Style Guide</td>
                      <td>$750</td>
                      <td>$750</td>
                    </tr>
                    <tr>
                      <td className="total-service" colSpan="3">
                        {' '}
                        Total
                      </td>
                      <td className="total-service text-right">$6,650</td>
                    </tr>
                  </table>
                  <br />
                  <br />
                  Except as set forth in this Amendment, the Agreement is
                  unaffected and shall continue in full force and effect in
                  accordance with its terms. If there is a conflict between this
                  amendment and the Agreement or any earlier amendment, the
                  terms of this amendment will prevail and the newly signed
                  contract will stand.
                  <br />
                  <br />
                  <span>IN WITNESS WHEREOF</span>, the undersigned have executed
                  and delivered this Agreement.
                  <br />
                  <div className="row">
                    <div className="col-6 mt-4">
                      <div className="refer-agreement">
                        <div className="label">
                          Company:{' '}
                          <span className="input-field">Buy Box Experts</span>
                        </div>
                      </div>
                      <div className="refer-agreement">
                        <div className="label">
                          Signature:
                          <span className="input-field" />
                        </div>
                      </div>
                      <div className="refer-agreement">
                        <div className="label">
                          Printed Name:
                          <span className="input-field">Thaddaeus Hay </span>
                        </div>
                      </div>
                      <div className="refer-agreement">
                        <div className="label">
                          Title:
                          <span className="input-field">
                            Chief Revenue Officer
                          </span>
                        </div>
                      </div>
                      <div className="refer-agreement">
                        <div className="label">
                          Date:
                          <span className="input-field">[current_date]</span>
                        </div>
                      </div>
                      <div className="refer-agreement">
                        <div className="label">
                          Address:
                          <span className="input-field">1172 W 700 N #200</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 mt-4">
                      <div className="refer-agreement">
                        <div className="label">
                          Company: <span className="input-field" />
                        </div>
                      </div>
                      <div className="refer-agreement">
                        <div className="label">
                          Signature:
                          <span className="input-field" />
                        </div>
                      </div>
                      <div className="refer-agreement">
                        <div className="label">
                          Printed Name:
                          <span className="input-field" />
                        </div>
                      </div>
                      <div className="refer-agreement">
                        <div className="label">
                          Title:
                          <span className="input-field" />
                        </div>
                      </div>
                      <div className="refer-agreement">
                        <div className="label">
                          Date:
                          <span className="input-field" />
                        </div>
                      </div>
                      <div className="refer-agreement">
                        <div className="label">
                          Address:
                          <span className="input-field" />
                        </div>
                      </div>
                    </div>
                  </div>
                </p>
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
      <AgreementSidePanel id={id} />
    </div>
  );
}

const Paragraph = styled.div`
  .summary {
    margin: 0;
    li {
      margin-top: 10px;
    }
  }

  .contact-list table,
  td,
  th {
    border: 1px solid black;
    padding: 13px;
  }
  tr {
    .total-service {
      font-weight: 800;
    }
    th {
      text-align: left;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }
  .refer-agreement {
    border-bottom: 1px solid black;
    font-weight: 400;
    padding: 6px 0;
    margin-left: 35px;

    .label {
      font-weight: 800;
    }
  }
`;
