/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { useSelector, useDispatch } from 'react-redux';

import styled from 'styled-components';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Modal from 'react-modal';
import dayjs from 'dayjs';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import {
  EditorState,
  ContentState,
  convertToRaw,
  // convertFromRaw,
} from 'draft-js';
import Theme from '../../theme/Theme';
import { Button, ModalBox, PageLoader, PageNotFound } from '../../common';
import AgreementSidePanel from '../../common/AgreementSidePanel';
import { CloseIcon } from '../../theme/images';
import {
  agreementTemplate,
  // createAgreement,
  getAddendum,
  updateAddendum,
  updateAccountDetails,
} from '../../api';
// import { getCustomerDetails } from '../../store/actions';
import { getAccountDetails } from '../../store/actions/accountState';
// import ReactHtmlParser from 'react-html-parser';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import RequestSignature from './RequestSignature';
import { AgreementSign, AddendumSign } from '../../constants/AgreementSign';

export default function Addendum() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const id = location.pathname.split('/')[2];
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const details = useSelector((state) => state.accountState.data);
  const userInfo = useSelector((state) => state.userState.userInfo);
  const loader = useSelector((state) => state.accountState.isLoading);
  const [editorState, setEditorState] = useState(null);
  const [contentState, setContentState] = useState(null);
  const [newAddendumData, setNewAddendum] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [pdfData, setPDFData] = useState('');
  const [
    notIncludedOneTimeServices,
    sendNotIncludedOneTimeServToAdd,
  ] = useState([]);
  const [
    notIncludedMonthlyServices,
    sendNotIncludedMonthlyServToAdd,
  ] = useState([]);

  useEffect(() => {
    // dispatch(getCustomerDetails(id));
    dispatch(getAccountDetails(id));
    agreementTemplate().then((response) => {
      setIsLoading({ loader: true, type: 'page' });
      setData(
        response &&
          response.data &&
          response.data.results &&
          response.data.results[0],
      );
      setIsLoading({ loader: false, type: 'page' });
    });

    getAddendum({ customer_id: id }).then((addendum) => {
      setNewAddendum(
        addendum &&
          addendum.data &&
          addendum.data.results &&
          addendum.data.results[0],
      );
      if (
        addendum &&
        addendum.data &&
        addendum.data.results &&
        addendum.data.results[0]
      ) {
        setShowEditor(false);
      } else {
        setShowEditor(true);
      }

      if (editorState === null) {
        let contentBlock;

        if (
          addendum &&
          addendum.data &&
          addendum.data.results &&
          addendum.data.results[0] &&
          addendum.data.results[0].addendum
        ) {
          contentBlock = htmlToDraft(
            addendum &&
              addendum.data &&
              addendum.data.results &&
              addendum.data.results[0] &&
              addendum.data.results[0].addendum,
          );
        } else {
          contentBlock = htmlToDraft('<p></p>');
        }
        const content = ContentState.createFromBlockArray(
          contentBlock.contentBlocks,
        );
        setEditorState(EditorState.createWithContent(content));
        setContentState(
          addendum &&
            addendum.data &&
            addendum.data.results &&
            addendum.data.results[0],
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  const onEditorStateChange = (editorData) => {
    setEditorState(editorData);
    const content = editorData.getCurrentContent();
    const info = draftToHtml(convertToRaw(content));
    const updatedAddendumm = { ...newAddendumData, addendum: info };
    setNewAddendum(updatedAddendumm);
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      maxWidth: '600px ',
      width: '100% ',
      minHeight: '200px',
      overlay: ' {zIndex: 1000}',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
  const [showModal, setShowModal] = useState(false);

  const checkPermission = () => {
    if (
      details &&
      details.contract_status &&
      (details.contract_status !== null || details.contract_status !== '')
    ) {
      return true;
    }
    return false;
  };

  const mapDefaultValues = (key, label, type) => {
    // if (key === 'company_name') {
    //   return customerData && customerData[key];
    // }
    // if (
    //   details &&
    //   (details[key] === undefined ||
    //     details[key] === '' ||
    //     details[key] === null ||
    //     (details && Object.keys(details).length === 0))
    // ) {
    //   return `Enter ${label}.`;
    // }
    if (key === 'length') {
      return details && details.length.label;
    }
    if (key === 'primary_marketplace') {
      return (
        details &&
        details.primary_marketplace &&
        details.primary_marketplace.name
      );
    }
    if (key === 'start_date') {
      return details && dayjs(details[key]).format('MM-DD-YYYY');
    }
    if (key === 'current_date') {
      return dayjs(Date()).format('MM-DD-YYYY');
    }

    if (type && type.includes('number')) {
      return `${type === 'number-currency' ? '$' : '%'} ${
        details && details[key]
          ? details[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : ''
      }`;
    }
    return key === 'rev_share' || key === 'seller_type'
      ? details && details[key] && details[key].label
      : details && details[key];

    // return details && details[key];
  };

  const showRevTable = () => {
    if (details && details.sales_threshold) {
      return `<table class="contact-list " style="width: 100%;
    border-collapse: collapse;"><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Type</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Description</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;"> Rev Share %</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;"> Sales Threshold</th>
      </tr><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><td style="border: 1px solid black;
    padding: 13px;">% Of Incremental Sales</td>
      <td style="border: 1px solid black;
    padding: 13px;">A percentage of all Managed Channel Sales (retail dollars, net customer returns) for all sales over the sales 
      threshold each month through the Amazon Seller Central and Vendor Central account(s) that BBE manages for Client.</td><td style="border: 1px solid black;
    padding: 13px;"> REVENUE_SHARE </td><td style="border: 1px solid black;
    padding: 13px;">REV_THRESHOLD</td></tr></table>`;
    }
    return `<table class="contact-list"  style="width: 100%;
    border-collapse: collapse;"><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Type</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Description</th>
    <th style="text-align: left;border: 1px solid black;
    padding: 13px;"> Rev Share %</th></tr><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><td style="border: 1px solid black;
    padding: 13px;">% Of Sales</td><td style="border: 1px solid black;
    padding: 13px;">A percentage of all Managed Channel Sales (retail dollars, net customer returns) for all sales each month 
    through the Amazon Seller Central and Vendor Central account(s) that BBE manages for Client. </td><td style="border: 1px solid black;
    padding: 13px;"> REVENUE_SHARE</td></tr></table>`;
  };

  const mapMonthlyServices = (key) => {
    if (details && details[key]) {
      const fields = [];
      for (const item of details[key]) {
        if (key !== 'additional_one_time_services') {
          if (
            (item.service && item.service.name !== undefined) ||
            item.name !== undefined
          ) {
            if (
              item.service.name !== 'DSP Advertising' &&
              item.service.name !== 'Inventory Reconciliation'
            ) {
              fields.push(
                `<tr>
                <td style="border: 1px solid black;padding: 13px;">${
                  item.service ? item.service.name : item && item.name
                }</td>
                <td style="border: 1px solid black;padding: 13px;">$ ${
                  item.service
                    ? item.service.fee
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : item.fee
                    ? item.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : ''
                } /month
                </td>
                </tr>`,
              );
            }
          }
        } else {
          fields.push(
            `<tr>
                <td style="border: 1px solid black;padding: 13px;">${
                  item && item.quantity
                    ? item.quantity
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0
                }</td>
            <td style="border: 1px solid black;padding: 13px;">${
              item.service ? item.service.name : item && item.name
            }</td>
            <td style="border: 1px solid black;padding: 13px;">$ ${
              item.service &&
              item.service.fee &&
              item.service.name !== 'Amazon Store Package Custom'
                ? item.service.fee
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : item.custom_amazon_store_price
                ? item.custom_amazon_store_price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : ''
            } /month
            </td>
            <td style="border: 1px solid black;padding: 13px;">$ ${(item.service
              .name !== 'Amazon Store Package Custom'
              ? item.quantity * item.service.fee
              : item.quantity * item.custom_amazon_store_price
            )
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </td>
            </tr>`,
          );
        }
      }
      // return null;

      return fields.length ? fields.toString().replaceAll(',', '') : '';
    }
    return '';
    // return `Enter ${label}.`;
  };

  const mapAdditionalMarketPlaces = () => {
    const fields = [];
    if (details && details.additional_marketplaces) {
      for (const item of details.additional_marketplaces) {
        fields.push(
          `<tr>
      <td style="border: 1px solid black;padding: 13px;">${
        item.service ? item.service.name : item && item.name
      }</td>
                    <td style="border: 1px solid black;padding: 13px;">$ ${
                      item.service
                        ? item.service.fee
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : item.fee
                        ? item.fee
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : ''
                    } /month
                    </td>
      </tr>`,
        );
      }
    }
    // if (formData && formData.additional_marketplaces) {
    //   for (const item of formData.additional_marketplaces) {
    //     fields.push(
    //       `<tr>
    //   <td style="border: 1px solid black;padding: 13px;">${item.label}</td>
    //                 <td style="border: 1px solid black;padding: 13px;">$
    //                   -
    //                 </td>
    //   </tr>`,
    //     );
    //   }
    // }
    return fields.length ? fields.toString().replaceAll(',', '') : '';

    // return '';
  };

  const mapVariableMonthlyService = () => {
    const fields = [
      `<tr ><td colspan="2" style ="text-align: center; border: 1px solid black;padding: 13px;">
                  Variable Monthly Services</td>
                  </tr>`,
    ];
    if (details && details.additional_monthly_services) {
      for (const item of details.additional_monthly_services) {
        if (item.service.name === 'DSP Advertising') {
          fields.push(
            `<tr>
                 <td style="border: 1px solid black;padding: 13px;">${
                   item.service ? item.service.name : item && item.name
                 }
                  </td>
                  <td style="border: 1px solid black;padding: 13px;">
                  Included
                  </td>
                </tr>`,
          );
        }
        if (item.service.name === 'Inventory Reconciliation') {
          fields.push(
            `<tr>
                 <td style="border: 1px solid black;padding: 13px;">${
                   item.service ? item.service.name : item && item.name
                 }</td>
                    <td style="border: 1px solid black;padding: 13px;"> 
                  25% of recovered $s
                  </td>
                    </tr>`,
          );
        }
      }

      return fields.length > 1 ? fields.toString().replaceAll(',', '') : '';
    }
    return '';
  };

  const mapServiceTotal = (key) => {
    if (key === 'additional_one_time_services') {
      return `$ ${
        details && details.total_fee.onetime_service
          ? details.total_fee.onetime_service
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : 0
      }`;
    }
    const market = details.total_fee.additional_marketplaces
      ? details.total_fee.additional_marketplaces
      : 0;
    const month = details.total_fee.monthly_service
      ? details.total_fee.monthly_service
      : 0;
    return `$ ${(market + month)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const showMonthlyServiceTable = () => {
    if (
      details &&
      details.additional_monthly_services &&
      details.additional_monthly_services.length
    ) {
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center"><span style="font-weight: 800;
    font-family: Arial-bold;">Additional Monthly Services </span><br> The following additional monthly services will be provided to Client in addition to the Monthly Retainer.</div><br><table class="contact-list " style="width: 100%;
    border-collapse: collapse;><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Service</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Service Fee</th></tr>${mapMonthlyServices(
      'additional_monthly_services',
      'Monthly Services',
    )} ${mapAdditionalMarketPlaces()}<tr><td class="total-service" style="border: 1px solid black;padding: 13px;"> Total</td><td class="total-service text-right" style="border: 1px solid black;padding: 13px; text-align: right;">${mapServiceTotal(
        'additional_monthly_services',
      )}
                              </td></tr>
                              ${mapVariableMonthlyService()}
                                </table>`;
    }
    return '';
  };

  const showOneTimeServiceTable = () => {
    if (
      details &&
      details.additional_one_time_services &&
      details.additional_one_time_services.length
    ) {
      return `<div class=" text-center mt-4 " style="margin-top: 1.5rem!important; text-align: center;"><span style="font-weight: 800;
    font-family: Arial-bold;">Additional One Time Services </span><br>The following additional monthly services will be provided to Client as a one time service in addition to the Monthly Retainer and any Additional Monthly services.</div><br><table class="contact-list " style="width: 100%;
    border-collapse: collapse;
"><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Quantity</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Service</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Service Fee</th><th style="text-align: left;border: 1px solid black;
    padding: 13px;">Total Service Fee</th></tr>${mapMonthlyServices(
      'additional_one_time_services',
      'One Time Services',
    )}<tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><td class="total-service" colspan="3" style="border: 1px solid black;padding: 13px;"> Total</td><td class="total-service text-right" style="border: 1px solid black;padding: 13px; text-align: right;">${mapServiceTotal(
      'additional_one_time_services',
    )}
                              </td></tr>
                                </table>`;
    }
    return '';
  };

  const getAgreementAccorType = (index) => {
    if (data && details && details.contract_type === 'one time') {
      return (
        data &&
        data.one_time_service_agreement &&
        data.one_time_service_agreement[index]
      );
    }
    return (
      data &&
      data.recurring_service_agreement &&
      data.recurring_service_agreement[index]
    );
  };

  const displayNotIncludedServices = () => {
    const fields = [];
    for (const item of notIncludedMonthlyServices) {
      fields.push(
        `<tr>
          <td style="border: 1px solid black;padding: 13px;"> ${
            item.label ? item.label : 'N/A'
          }</td>
          <td style="border: 1px solid black;padding: 13px;"> ${' Monthly'}</td>
         </tr>`,
      );
    }
    for (const item of notIncludedOneTimeServices) {
      fields.push(
        `<tr>
          <td style="border: 1px solid black;padding: 13px;"> ${
            item.label ? item.label : 'N/A'
          }</td>
          <td style="border: 1px solid black;padding: 13px;"> ${'One Time'}</td>
         </tr>`,
      );
    }
    return fields.length ? fields.toString().replaceAll(',', '') : '';
  };

  const createAgreementDoc = () => {
    const agreementData = getAgreementAccorType(0)
      .replace(
        'CUSTOMER_NAME',
        mapDefaultValues('contract_company_name', 'Customer Name'),
      )
      .replace('START_DATE', mapDefaultValues('start_date', 'Start Date'))
      .replace('CUSTOMER_ADDRESS', mapDefaultValues('address', 'Address, '))
      .replace('CUSTOMER_CITY', mapDefaultValues('city', 'City, '))
      .replace('CUSTOMER_STATE', mapDefaultValues('state', 'State, '))
      .replace('CUSTOMER_POSTAL', mapDefaultValues('zip_code', 'Postal Code, '))
      .replace(
        'AGREEMENT_LENGTH',
        mapDefaultValues('length', 'Contract Length'),
      )
      .replace(
        'ONE_TIME_SERVICE_TABLE',
        `<table class="contact-list " style="width: 100%;
    border-collapse: collapse;"><tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Quantity</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Service</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Service Fee</th><th style="text-align: left; border: 1px solid black;
    padding: 13px;">Total Service Fee</th></tr>${mapMonthlyServices(
      'additional_one_time_services',
      'One Time Services',
    )}<tr style="display: table-row;
    vertical-align: inherit;
    border-color: inherit;"><td class="total-service" colspan="3" style="border: 1px solid black;
    padding: 13px; font-weight: 800;"> Total</td><td class="total-service text-right" style="border: 1px solid black;
    padding: 13px; font-weight: 800;">${mapServiceTotal(
      'additional_one_time_services',
    )}
                              </td></tr>
                                </table>`,
      )
      .replace(
        'ADDITIONAL_ONE_TIME_SERVICES_TOTAL',
        `${mapServiceTotal('additional_one_time_services')}`,
      );

    const agreementSignatureData = AgreementSign.replace(
      'CUSTOMER_NAME',
      mapDefaultValues('contract_company_name', 'Customer Name'),
    )
      .replace('AGREEMENT_DATE', mapDefaultValues('start_date', 'Start Date'))
      .replace('CUSTOMER_ADDRESS', mapDefaultValues('address', 'Address, '))
      .replace('CUSTOMER_CITY', mapDefaultValues('city', 'City, '))
      .replace('CUSTOMER_STATE', mapDefaultValues('state', 'State, '))
      .replace('CUSTOMER_POSTAL', mapDefaultValues('zip_code', 'Postal Code, '))
      .replace('BBE_DATE', mapDefaultValues('current_date', 'Current Date'));

    const statmentData =
      data.statement_of_work &&
      data.statement_of_work[0]
        .replace(
          'CUSTOMER_NAME',
          mapDefaultValues('contract_company_name', 'Customer Name'),
        )
        .replace('START_DATE', mapDefaultValues('start_date', 'Start Date'))
        .replace(
          'MONTHLY_RETAINER_AMOUNT',
          mapDefaultValues(
            'monthly_retainer',
            'Monthly Retainer',
            'number-currency',
          ),
        )
        .replace('REV_SHARE_TABLE', showRevTable())
        .replace('REVENUE_SHARE', mapDefaultValues('rev_share', 'Rev Share'))
        .replace(
          'REV_THRESHOLD',
          mapDefaultValues(
            'sales_threshold',
            'Rev Threshold',
            'number-currency',
          ),
        )
        .replace('SELLER_TYPE', mapDefaultValues('seller_type', 'Seller Type'))
        .replace(
          'PRIMARY_MARKETPLACE',
          mapDefaultValues('primary_marketplace', 'Primary Marketplace'),
        )

        .replace('MAP_MONTHLY_SERVICES', showMonthlyServiceTable())
        .replace('ONE_TIME_SERVICES', showOneTimeServiceTable())
        .replace(
          'ADDITIONAL_SERVICES_NOT_INCLUDED',
          `<table class="contact-list " style="width: 100%;border-collapse: collapse;">
                                <tr>
                                  <th style="text-align: left; border: 1px solid black;padding: 13px;">Service</th>
                                  <th style="text-align: left; border: 1px solid black;padding: 13px;">Service Type</th>
                                  </tr>
                                  ${displayNotIncludedServices()}
                                  </table>
                                  `,
        );

    const addendumData =
      data.addendum &&
      data.addendum[0]
        .replace(
          'CUSTOMER_NAME',
          mapDefaultValues('contract_company_name', 'Customer Name'),
        )
        .replace(
          'AGREEMENT_DATE',
          mapDefaultValues('start_date', 'Start Date'),
        );

    const newAddendumAddedData =
      newAddendumData && newAddendumData.addendum
        ? newAddendumData.addendum
        : '';

    const addendumSignatureData = AddendumSign.replace(
      'CUSTOMER_NAME',
      mapDefaultValues('contract_company_name', 'Customer Name'),
    ).replace('BBE_DATE', mapDefaultValues('current_date', 'Current Date'));
    const finalAgreement = `${agreementData} ${agreementSignatureData} ${statmentData} ${addendumData} ${newAddendumAddedData} ${addendumSignatureData}`;
    setPDFData(finalAgreement);
    // createAgreement({ contract_data: finalAgreement }).then(() => {
    //   // console.log('!!!!!!', res);
    // });
  };
  // const downloadPdf = () => {
  //   // var filePat =
  //   //   'https://bbe-dev.s3.amazonaws.com/contract/COwnZHn-contract.pdf?AWSAccessKeyId=AKIAUBO77D33XT5BJCXL&Signature=r%2Fp8TIecxgVZSzOQIR0rsGgsxio%3D&Expires=1611034156';
  // };
  const displayEditor = () => {
    return (
      <EditorToll>
        <Editor
          editorState={editorState}
          contentState={contentState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onEditorStateChange}
          placeholder="   Add the points you would like to edit in the Standard Agreement"
          toolbar={{
            options: [
              'inline',
              'blockType',
              'fontSize',
              'fontFamily',
              'list',
              'textAlign',
              'colorPicker',
              'link',
              'remove',
              'history',
            ],
          }}
        />
      </EditorToll>
    );
  };

  const onEditAddendum = () => {
    setShowEditor(true);
  };

  const updateAddendumChanges = () => {
    setIsLoading({ loader: true, type: 'page' });

    updateAddendum(newAddendumData.id, {
      addendum: newAddendumData.addendum,
    }).then(() => {
      setIsLoading({ loader: false, type: 'page' });
      const stepsData = {
        steps_completed: { agreement: true, statement: true, addendum: true },
      };
      updateAccountDetails(details.id, stepsData);

      setShowEditor(false);
    });
  };

  const setParams = (param) => {
    const stringified =
      queryString &&
      queryString.stringify({
        step: param,
      });
    history.push({
      pathname: `${history.location.pathname}`,
      search: `${stringified}`,
    });
  };

  const checkApprovalCondition = () => {
    const rev = Number(details && details.rev_share && details.rev_share.value);
    const contractTermLength = parseInt(
      details && details.length && details.length.value,
      10,
    );

    if (
      (rev < 3 || contractTermLength < 12) &&
      !(userInfo && userInfo.role === 'Team Manager - TAM')
      // details &&
      // details.contract_status &&
      // details.contract_status.value !== 'pending contract approval'
    ) {
      return true;
    }
    return false;
  };

  return isLoading.loader && isLoading.type === 'page' ? (
    <PageLoader
      className="modal-loader"
      color="#FF5933"
      type="page"
      width={40}
    />
  ) : (
    <>
      {checkPermission() ? (
        <>
          <div className="on-boarding-container">
            <div className="row">
              <div className="col-10 mb-5 pb-5">
                <div className="text-container ">
                  {/* <h3 className="mt-5 mb-4 text-center">Addendum</h3> */}

                  <Paragraph>
                    <p
                      className="long-text"
                      dangerouslySetInnerHTML={{
                        __html:
                          data.addendum &&
                          data.addendum[0]
                            .replace(
                              'CUSTOMER_NAME',
                              mapDefaultValues(
                                'contract_company_name',
                                'Customer Name',
                              ),
                            )
                            .replace(
                              'AGREEMENT_DATE',
                              mapDefaultValues('start_date', 'Start Date'),
                            ),
                      }}
                    />
                    {newAddendumData && newAddendumData.id && !showEditor
                      ? ''
                      : displayEditor()}
                    {showEditor ? (
                      ''
                    ) : (
                      <p
                        className="long-text"
                        dangerouslySetInnerHTML={{
                          __html: newAddendumData && newAddendumData.addendum,
                        }}
                      />
                    )}

                    <p
                      className="long-text"
                      dangerouslySetInnerHTML={{
                        __html:
                          data.addendum &&
                          data.addendum[1]
                            .replace(
                              'CUSTOMER_NAME',
                              mapDefaultValues(
                                'contract_company_name',
                                'Customer Name',
                              ),
                            )
                            .replace(
                              'AGREEMENT_DATE',
                              mapDefaultValues('start_date', 'Start Date'),
                            )
                            .replace(
                              'BBE_DATE',
                              mapDefaultValues('current_date', 'Current Date'),
                            ),
                      }}
                    />
                  </Paragraph>
                </div>
              </div>
            </div>

            <AgreementSidePanel
              id={id}
              agreementData={details}
              // customerData={customerData}
              loader={loader}
              newAddendumData={newAddendumData && newAddendumData}
              onEditAddendum={onEditAddendum}
              setShowEditor={setShowEditor}
              setNewAddendum={setNewAddendum}
              sendNotIncludedOneTimeServToAdd={sendNotIncludedOneTimeServToAdd}
              sendNotIncludedMonthlyServToAdd={sendNotIncludedMonthlyServToAdd}
            />
          </div>
          {isLoading.loader && isLoading.type === 'page' ? (
            ''
          ) : (
            <Footer className="sticky">
              {newAddendumData && newAddendumData.id && showEditor ? (
                <div className="container">
                  <Button
                    className="btn-primary on-boarding w-320 mt-3 mr-5"
                    onClick={() => updateAddendumChanges()}>
                    Save Changes
                  </Button>

                  <Button
                    className="btn-primary on-boarding w-320 mt-3 mr-5"
                    onClick={() => setShowEditor(false)}>
                    Discard Changes
                  </Button>
                </div>
              ) : (
                <div className="container">
                  <>
                    {
                      checkApprovalCondition() ? (
                        <Button
                          className="btn-primary on-boarding w-320 mt-3 mr-5"
                          onClick={() => {
                            createAgreementDoc();
                            setParams('request-approve');
                            setShowModal(true);
                          }}>
                          Request Approval
                        </Button>
                      ) : // params && params.step === 'request-signature' ? (
                      userInfo && userInfo.role === 'Team Manager - TAM' ? (
                        <Button
                          className="btn-primary on-boarding w-320 mt-3 mr-5"
                          onClick={() => {
                            // sendRequestSign();
                            createAgreementDoc();
                            setParams('select-contact');
                            setShowModal(true);
                          }}>
                          Approve and Request Signature
                        </Button>
                      ) : (
                        <Button
                          className="btn-primary on-boarding w-320 mt-3 mr-5"
                          onClick={() => {
                            // sendRequestSign();
                            createAgreementDoc();
                            setParams('select-contact');
                            setShowModal(true);
                          }}>
                          Request Signature
                        </Button>
                      )

                      // ) : (
                      //   <Button
                      //     className="btn-primary on-boarding w-320 mt-3 mr-5"
                      //     onClick={() => {
                      //       createAgreementDoc();
                      //       setParams('select-contact');
                      //       setShowModal(true);
                      //     }}>
                      //     Select Contact
                      //   </Button>
                      // )}
                      // {/* create contract copy */}
                      // {/* <Button
                      //   className="btn-primary on-boarding w-320 mt-3 mr-5"
                      //   onClick={() => createAgreementDoc()}>
                      //   Save as PDF
                      // </Button> */}
                    }
                    <p>Last updated by You on Dec 1, 4:18 PM</p>
                  </>
                </div>
              )}
            </Footer>
          )}
        </>
      ) : (
        <PageNotFound />
      )}

      <Modal
        isOpen={showModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => setShowModal(false)}
          role="presentation"
        />
        <ModalBox>
          <RequestSignature
            id={id}
            agreementData={details}
            setShowModal={setShowModal}
            pdfData={pdfData}
          />
        </ModalBox>
      </Modal>
    </>
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
    margin-left: 35px;
    padding: 6px 0;

    .label {
      font-weight: 800;
    }
  }
`;

const Footer = styled.div`
  border: 1px solid ${Theme.gray15};
  bottom: 0;
  width: 100%;
  background: #fff;
  box-shadow: ${Theme.boxShadow};
  position: fixed;
  min-height: 80px;

  .w-320 {
    float: left;
    max-width: 320px;
    width: 100%;
  }

  p {
    float: left;
    margin-top: 30px;
  }
`;

export const EditorToll = styled.div`
  .rdw-editor-wrapper {
    border: 1px solid #f1f1f1;
    border-radius: 4px;
  }
  .rdw-link-modal {
    min-height: 250px !important;
  }

  .rdw-embedded-modal {
    min-height: 250px !important;
  }

  .rdw-editor-main {
    border: none;
    background: ${Theme['$base-03']};
  }

  .rdw-editor-toolbar {
    border: none;
  }
`;

// const CheckBox = styled.div`
//   .container {
//     display: block;
//     position: relative;
//     padding-left: 35px;
//     margin-bottom: 12px;
//     cursor: pointer;
//     color: #2e384d;
//     font-size: 15px;

//     &.contract-sign {
//       color: ${Theme.gray35};
//     }

//     -webkit-user-select: none;
//     -moz-user-select: none;
//     -ms-user-select: none;
//     user-select: none;
//   }

//   .container input {
//     position: absolute;
//     opacity: 0;
//     cursor: pointer;
//     height: 0;
//     width: 0;
//   }

//   .checkmark {
//     position: absolute;
//     top: 0;
//     left: 0;
//     border-radius: 4px;
//     width: 24px;
//     height: 24px;
//     background-color: rgba(224, 231, 255, 0.2);
//     border: 1px solid #e0e7ff;
//   }

//   .container:hover input ~ .checkmark {
//     background-color: rgba(224, 231, 255, 0.2);
//     border: 1px solid #e0e7ff;
//   }

//   /* When the checkbox is checked, add a blue background */
//   .container input:checked ~ .checkmark {
//     background-color: rgba(224, 231, 255, 0.2);
//   }

//   .checkmark:after {
//     content: '';
//     position: absolute;
//     display: none;
//   }

//   .container input:checked ~ .checkmark:after {
//     display: block;
//   }

//   .container .checkmark:after {
//     left: 9px;
//     top: 3px;
//     width: 6px;
//     height: 12px;
//     border: solid ${Theme.gray35};
//     border-width: 0 2px 2px 0;

//     -webkit-transform: rotate(45deg);
//     -ms-transform: rotate(45deg);
//     transform: rotate(45deg);
//   }
// `;
