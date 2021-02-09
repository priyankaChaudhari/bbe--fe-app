import React from 'react';
import styled from 'styled-components';

export default function OneTimeAgreement() {
  return (
    <div>
      <div className="on-boarding-container">
        <div className="text-container ">
          <h3 className="mt-5 mb-4 text-center">
            Amazon Demand Side Platform (DSP) Service Addendum
          </h3>
          <Paragraph>
            <p className="long-text">
              One Time Service Agreement THIS AGREEMENT (&quot;The
              Agreement&quot;) is entered into as of{' '}
              <span> AGREEMENT_START_DATE.</span> (the “Effective Date”),
              between Buy Box Experts LLC, a Utah limited liability company,
              with its principal place of business located at 1172 W 700 N #200,
              Lindon, UT 84042 (herein “BBE”), and
              <span> CUSTOMER_NAME </span>(herein “Client”) with a principal
              place of business located at{' '}
              <span>ADDRESS, CITY, STATE, POSTAL_CODE </span>, collectively
              &quot;The Parties&quot; and individually a “Party”.
              <br />
              <br />
              Whereas Client wishes to engage BBE to provide the services
              described herein (the “Services”) and further described and
              defined on the attached Service Order or Addendum(s) (The
              “Addendum(s)”) and in exchange for valuable consideration, the
              Parties hereby agree to the following terms:
              <ol type="1">
                <li>
                  <span> SERVICES TO BE PERFORMED: </span> Buy Box Experts works
                  to improve, create, manage, and monitor the Client’s Amazon
                  listing(s). To the best of Buy Box Experts’ ability, it will
                  keep up to date on all of Amazon’s policies to ensure
                  compliance with Amazon’s regulations. Buy Box Experts will
                  update the listing(s) as needed. Buy Box Experts method to
                  improve the client listing(s) includes:
                </li>

                <table className="contact-list mt-3 mb-3">
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
                <li>
                  <span>PAYMENT FOR SERVICES RENDERED:</span> In exchange for
                  the services described above, the Client agrees to pay Buy Box
                  Experts the following:
                  <ul className="summary ">
                    <li>
                      [additional_one-time_services_total] as a one-time
                      payment. This payment is due prior to the beginning of the
                      work on the Client’s brand. This is a non-refundable
                      payment unless agreed upon by both parties.{' '}
                    </li>
                    <li>
                      Late payment may be subject to being turned over to 3rd
                      party collections companies. The client will be
                      responsible for paying any and all fees associated with
                      the collection of unpaid balances owed to BBE by Client
                      including 3rd party collections agency fees, attorney
                      fees, late fees, etc.
                    </li>
                  </ul>
                </li>
                <li>
                  <span>DISCLAIMER OF WARRANTIES:</span> BBE MAKES NO WARRANTY,
                  EXPRESS, IMPLIED OR STATUTORY, WITH RESPECT TO THE SERVICES
                  PROVIDED HEREUNDER, INCLUDING WITHOUT LIMITATION ANY IMPLIED
                  WARRANTY OF RELIABILITY, USEFULNESS, MERCHANTABILITY, FITNESS
                  FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR THOSE ARISING
                  FROM THE COURSE OF PERFORMANCE, DEALING, USAGE OR TRADE. BBE
                  DOES NOT GUARANTEE SERVICE RESULTS. THE PERFORMANCE OF BBE
                  SERVICES RELIES UPON ACCESS TO AMAZON’S NETWORKS, ONLINE
                  MARKETPLACE, DATA SITES, WEB SERVICES, CLOUD COMPUTING,
                  CUSTOMER PORTALS, SYSTEMS AND SERVERS (COLLECTIVELY “AMAZON’S
                  NETWORK”). BBE MAKES NO WARRANTY, EXPRESS, IMPLIED OR
                  STATUTORY, WITH RESPECT TO THE SECURITY, RELIABILITY, ACCESS,
                  HOSTING, CONNECTIVITY, RELIABILITY OR AVAILABILITY OF AMAZON’S
                  NETWORK, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTY OF
                  RELIABILITY, USEFULNESS, MERCHANTABILITY, FITNESS FOR A
                  PARTICULAR PURPOSE, NON-INFRINGEMENT, OR THOSE ARISING FROM
                  THE COURSE OF PERFORMANCE, DEALING, USAGE OR TRADE. BBE DOES
                  NOT GUARANTEE, IN ANY MANNER, AMAZON’S NETWORK.
                  <br />
                  <br />
                  By signing this Agreement, the Client acknowledges that BBE
                  does not own or govern the actions of any online marketplace.
                  The Client also acknowledges that due to fluctuations in the
                  relative competitiveness of some search terms within a given
                  marketplace, recurring changes in the search algorithms, and
                  other competitive factors, it is impossible to guarantee, and
                  BBE does not guarantee product search or advertising rankings.
                </li>
                <br />
                <br />
                <li>
                  <span> LIMITATIONS OF LIABILITY:</span> NEITHER PARTY SHALL BE
                  LIABLE TO THE OTHER PARTY OR TO ANY THIRD PARTY FOR ANY
                  SPECIAL, INCIDENTAL, INDIRECT, PUNITIVE, OR CONSEQUENTIAL
                  DAMAGES OR FOR THE LOSS OF PROFIT, REVENUE, USE, DATA OR
                  DIMINUTION IN VALUE ARISING OUT OF BREACH OF CONTRACT, TORT
                  (INCLUDING NEGLIGENCE), OR OTHERWISE, REGARDLESS OF WHETHER
                  SUCH DAMAGE WAS FORESEEABLE AND WHETHER OR NOT SUCH PARTY HAS
                  BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, AND
                  NOTWITHSTANDING THE FAILURE OF ANY AGREED OR OTHER REMEDY OF
                  ITS ESSENTIAL PURPOSE. NOTWITHSTANDING ANYTHING IN THIS
                  AGREEMENT TO THE CONTRARY, NEITHER PARTY WILL BE CUMULATIVELY
                  LIABLE TO THE OTHER FOR AN AMOUNT GREATER THAN THE AMOUNT PAID
                  BY CLIENT TO BBE IN THE PRECEDING 30 DAY PERIOD. THE
                  PROVISIONS OF THIS SECTION ARE MUTUAL LIMITATIONS TO ALLOCATE
                  RISKS AMONG COMMERCIAL PARTIES, EACH IS SEPARATE FROM THE
                  OTHERS AND FROM THE REMEDY LIMITATIONS AND EXCLUSIONS SET
                  FORTH ELSEWHERE IN THIS AGREEMENT, AND EACH WILL SURVIVE AND
                  APPLY NOTWITHSTANDING ANY FAILURE OF ESSENTIAL PURPOSE OF A
                  REMEDY.
                </li>
                <br />
                <br />
                <li>
                  <span> CONFIDENTIALITY:</span> The Parties acknowledge that,
                  in the course of performing the responsibilities and
                  obligations under this Agreement, they each may be exposed to
                  or acquire information that is confidential and/or proprietary
                  to the other Party (the &quot;Confidential Information&quot;).
                  The Parties agree to hold such Confidential Information as
                  defined in this paragraph or Addendum(s) in strict confidence
                  and not to copy, reproduce, sell, assign, license, market,
                  transfer, give, or otherwise disclose such information to
                  third parties, other than affiliates, agents, or contractors
                  who are under the same confidentiality obligations to either
                  of the Parties as defined herein or to use such information
                  for any purpose whatsoever, without the express written
                  permission of the other Party, other than for the provision of
                  services hereunder.
                  <ol type="a">
                    <li>
                      The Parties shall use their reasonable efforts to assist
                      each other in identifying and preventing any unauthorized
                      use or disclosure of any Confidential Information and will
                      safeguard the confidentiality of all such Confidential
                      Information with at least the same degree of care as each
                      would use to protect its own Confidential Information, but
                      in no event with less than a commercially reasonable
                      degree of care.
                    </li>
                    <li>
                      The Parties agree to advise each of their employees,
                      agents, contractors, and representatives of their
                      obligations to keep and protect such Confidential
                      Information.
                    </li>
                    <li>
                      Without limitation of the foregoing, the Parties shall use
                      reasonable efforts to advise each other immediately in the
                      event that a Party learns or has reason to believe that
                      any person who has access to Confidential Information has
                      violated or intends to violate the terms of this
                      Agreement, and will reasonably cooperate in seeking
                      injunctive relief against any such person.
                    </li>
                    <li>
                      The terms of this Agreement shall remain confidential.
                    </li>
                    <li>
                      Confidential Information shall not include information
                      which: (a) at the time disclosed or obtained is in the
                      public domain; (b) after being disclosed or obtained
                      becomes part of the public domain through no act,
                      omission, or fault of a Party or its personnel; (c) was in
                      the other Party&apos;s possession at the time of
                      disclosure or receipt and was not acquired, directly or
                      indirectly, under an obligation of confidence; or (d) the
                      Party demonstrates that the Confidential Information was
                      received by it from a 3rd party after the time it was
                      disclosed or obtained hereunder and was not acquired by
                      the 3rd party, directly or indirectly, from the Party or
                      from the personnel of the Party under an obligation of
                      confidence hereunder.
                    </li>
                    <li>
                      The duties in this paragraph and sub-paragraphs shall
                      survive the termination of this Agreement for a period of
                      two (2) years.
                    </li>
                  </ol>
                </li>
                <br />
                <br />
                <li>
                  <span>INTELLECTUAL PROPERTY:</span>
                  <ol type="a">
                    <li>
                      BBE Property. As between BBE and Client, all right, title,
                      and interest in and to the business information,
                      specifications, sourced text, copy, prose, infographics,
                      keywords, sales information, software, systems, data,
                      files, drawings, artwork, images, licenses, proposals or
                      materials used, developed, or created by BBE or provided
                      by BBE to Client in the course of performance hereunder,
                      excluding the Deliverables, are and shall remain at all
                      times in BBE (“BBE Property”). Client agrees to promptly
                      return any BBE Property on the termination of this
                      Agreement. Prior to returning the BBE Property, Client is
                      prohibited from creating any copies.
                    </li>
                    <li>
                      Deliverables & Client’s Property. BBE shall render
                      Services and deliver the finished work product, reports
                      and other deliverables, including without limitation,
                      final versions of creatives, artwork, written text copy,
                      infographics, keywords, documentation, etc. required to be
                      created and delivered by BBE (collectively,
                      “Deliverables”) in accordance with this Agreement. For
                      clarity, the Deliverables only include the finished work
                      product and final versions delivered by BBE and shall not
                      include any drafts, work-in-progress, partial or
                      incomplete work, modifications, revisions or variations,
                      files, images and materials not included in the finished
                      Deliverables, all such materials shall not be considered
                      and do not qualify as works made for hire. Except as set
                      forth in this section, all right, title, and interest in
                      and to all Deliverables, including all rights in
                      copyrights or other intellectual property rights
                      pertaining thereto, shall be held by Client, and all
                      Deliverables shall be considered “works made for hire” by
                      BBE for the benefit of Client BBE hereby assigns,
                      transfers, and conveys to Client all right, title, and
                      interest in all such Deliverables. As between Client and
                      BBE, all right, title, and interest in and to all
                      software, systems, data or materials provided by Client to
                      BBE in the course of performing Services are and shall
                      remain at all times in Client.
                    </li>

                    <li>
                      In order to perform Services, BBE may require access to
                      Client’s name, brands, logos, trade names, trademarks,
                      trade dress, domain names, photography, images,
                      infographics, written text, keywords, sales information or
                      other information or copyrighted materials of Client
                      (“Client Materials”). Client hereby grants to BBE a
                      non-exclusive, non-transferable, internal-use license
                      during the term of this Agreement, to use the Client
                      Materials solely as required by BBE to perform Services,
                      and to share such Client Materials solely with those BBE
                      employees with a need to know, and in all instances, in
                      strict accordance with the confidentiality provisions
                      herein. During and after the term of this Agreement Client
                      hereby grants unto BBE a non-exclusive, non-transferable,
                      limited, royalty-free license to use the Deliverables and
                      Client Materials for internal use and marketing purposes,
                      and other purposes approved in writing by Client, provided
                      that any Deliverables or Client Materials used for
                      marketing purposes will be clearly and properly identified
                      as the copyrighted property of Client.
                    </li>
                  </ol>
                </li>
                <br />
                <br />
                <li>
                  <span>NON-SOLICITATION:</span> Notwithstanding any other
                  provision of this Agreement, for a period of one (1) year
                  following the termination or expiration of this agreement,
                  neither party shall solicit for employment, or advise or
                  recommend to any other person that such other person solicit
                  for employment, any person on the Project Team or any person
                  employed or under contract (whether as a consultant, employee
                  or otherwise) by or to either party without the prior written
                  consent of the other party.
                </li>
                <br />
                <br />
                <li>
                  <span>MISCELLANEOUS PROVISIONS:</span> The Parties agree to
                  the following provisions:
                  <ol type="a">
                    <li>
                      <span>Entire Agreement:</span> This Agreement constitutes
                      the entire agreement between the Parties and supersedes
                      any prior written or oral agreements concerning the
                      subject matter contained herein, except where the Parties
                      may have a separate Non-Disclosure Agreement
                      (&quot;NDA&quot;), in which case such NDA may be deemed to
                      be incorporated into this agreement. In the event that the
                      terms of this Agreement and such NDA are in conflict, this
                      Agreement shall prevail. This Agreement may be amended
                      only by the written consent of the Parties.
                    </li>
                    <li>
                      <span> Severability:</span> If any provision of this
                      Agreement or its addenda is found to be illegal, void, or
                      unenforceable, then that provision will be deemed
                      severable from this Agreement and will not affect the
                      validity and enforceability of any remaining provisions of
                      this Agreement.
                    </li>
                    <li>
                      <span>No Agency / Partnership:</span> Nothing in this
                      Agreement will be construed as creating a partnership,
                      joint ventures, agency, employer/employee relationship or
                      legal representation by one Party for or with the Other.
                      Neither Party is authorized to hold itself out to any
                      third party as an authorized representative of the other
                      Party or to have any authority to make any statements,
                      representations, or commitments of any kind or to take any
                      action that is binding on the other, except as provided
                      for in this Agreement or authorized in writing separately
                      by the Party to be bound.
                    </li>
                    <li>
                      <span> Waiver:</span> Failure by either Party to enforce
                      any provision(s) of this Agreement will not be construed
                      as a waiver of any provision or right in full or in part.
                      No waiver of any breach or default of this Agreement by
                      any Party hereto shall be considered to be a waiver of any
                      other breach or default of this Agreement.
                    </li>
                    <li>
                      <span>Counterparts:</span> This Agreement may be executed
                      in any number of counterparts, all of which will
                      constitute a single agreement. Facsimile or electronic
                      signatures will have the same force and effect as original
                      signatures. Any modification of or amendment to any
                      provision contained in this Agreement will be effective
                      only if the modification or amendment is in writing and
                      signed by both Parties.
                    </li>
                    <li>
                      <span>Inconsistencies:</span> In the event of any
                      inconsistency between this Agreement and invoice or
                      ordering document, the terms and conditions of this
                      Agreement will control.
                    </li>
                    <li>
                      <span> Notices:</span> Any notices pertaining to this
                      Agreement shall be in writing and shall be transmitted by
                      personal hand delivery, fax, or email, to an officer or
                      director of the Party, or through the facilities of the
                      United States Post Office, certified mail, return receipt
                      requested to the contact information included on the
                      signature page of this Agreement. Notices given by mail
                      shall be deemed to be delivered on the day such notice is
                      deposited in the United States mail, postage prepaid.
                    </li>
                    <li>
                      <span> Assignment:</span> Neither Party may assign or
                      otherwise transfer this Agreement, in whole or in part,
                      without the prior written consent of the other Party,
                      which may be withheld in its sole discretion; provided,
                      however, that either Party may, without the consent of the
                      other Party, assign its rights under this Agreement if
                      such assignment is to a successor of the assigning Party
                      by consolidation, merger, or operation of law, or to a
                      purchaser of all or substantially all of the assigning
                      Party&apos;s assets. Any attempted transfer or assignment
                      of this Agreement without the prior written consent of the
                      other Party will be null and void ab initio. This
                      Agreement will be binding upon and will inure to the
                      benefit of the permitted successors and assigns of each
                      Party to this Agreement.
                    </li>
                    <li>
                      <span>Governing Law:</span> This Agreement will be
                      governed by and construed in accordance with the laws of
                      the State of Utah. The appropriate venue for any legal
                      action shall be in state or federal courts located in Salt
                      Lake City, Utah having jurisdiction over the matter in
                      dispute and each such party agrees to voluntarily appear
                      in such forum and submit to its jurisdiction and agrees to
                      not complain as to its convenience. In the event that
                      litigation results from or arises out of this Agreement or
                      the performance thereof, the Parties agree to reimburse
                      the prevailing Party&apos;s reasonable attorney&apos;s
                      fees, court costs, and all other expenses, whether or not
                      taxable by the court as costs, in addition to any other
                      relief to which the prevailing Party may be entitled.
                    </li>
                    <li>
                      <span>Force Majeure:</span> BBE shall not be liable or
                      responsible to Client, nor be deemed to have defaulted or
                      breached this Agreement, for any failure or delay in
                      fulfilling or performing any term of this Agreement when
                      and to the extent such failure or delay is caused by or
                      results from acts or circumstances beyond the reasonable
                      control of BBE including, without limitation, acts of God,
                      flood, fire, earthquake, explosion, governmental actions,
                      war, invasion or hostilities (whether war is declared or
                      not), terrorist threats or acts, riot, or other civil
                      unrest, national emergency, revolution, insurrection,
                      epidemic, lock-outs, strikes or other labor disputes
                      (whether or not relating to either party&apos;s
                      workforce), or restraints or delays affecting carriers or
                      inability or delay in obtaining supplies of adequate or
                      suitable materials, materials or telecommunication
                      breakdown or power outage, provided that, if the event in
                      question continues for a continuous period in excess of
                      thirty (30) days, Client shall be entitled to give notice
                      in writing to BBE to suspend this Agreement until BBE may
                      resume performing this Agreement.
                    </li>
                    <li>
                      <span> Captions:</span> Titles or paragraph headings in
                      this Agreement or any Addenda are solely for convenience
                      of reference and are not intended and shall not be deemed
                      to modify, explain or place any construction on any
                      provision of this agreement.
                    </li>
                  </ol>
                </li>
              </ol>
              <br />
              <span>IN WITNESS WHEREOF</span>, the undersigned have executed and
              delivered this Agreement.
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
                      <span className="input-field">Chief Revenue Officer</span>
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
  );
}

const Paragraph = styled.div`
  .summary {
    margin: 0;
    li {
      list-style-type: initial;
      padding-left: 8px;
      margin-bottom: 30px;
    }
  }
  ol {
    padding-left: 60px;
    li {
      padding-left: 8px;
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
