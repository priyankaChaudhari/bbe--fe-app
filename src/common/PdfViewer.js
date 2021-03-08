import React, { useState } from 'react';
// import { Document, Page } from 'react-pdf';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import samplePDF from '../components/Contract/sample1.pdf';
import PageNotFound from './PageNotFound';
// import PropTypes from 'prop-types';

export default function PdfViewer() {
  const [totalPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  // const url =
  //   'https://bbe-dev.s3.amazonaws.com/contract/COxJebk-contract.pdf?AWSAccessKeyId=AKIAUBO77D33XT5BJCXL&Signature=AIuxZVbgPbc64dF7ngzCSNnMieg%3D&Expires=1615162402';
  // // const { pdf } = props;

  return (
    <Document
      file={samplePDF}
      // url={
      //   'https://bbe-dev.s3.amazonaws.com/contract/COxJebk-contract.pdf?AWSAccessKeyId=AKIAUBO77D33XT5BJCXL&Signature=23Lljub5%2F%2FUHQp0Ccv7arUGRnK8%3D&Expires=1615160718'
      // }
      options={{ workerSrc: 'pdf.worker.js' }}
      error={PageNotFound}
      onLoadSuccess={onDocumentLoadSuccess}>
      {Array.from(new Array(totalPages), (el, index) => (
        <Page
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          // scale={1.2}
          className="pdf-view"
          width={1200}
        />
      ))}
    </Document>
  );
}

// PdfViewer.defaultProps = {
//   pdf: '',
// };

// PdfViewer.propTypes = {
//   pdf: PropTypes.string,
// };
