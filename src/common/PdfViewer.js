import React, { useState } from 'react';
// import { Document, Page } from 'react-pdf';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import PropTypes from 'prop-types';
import PageNotFound from './PageNotFound';

export default function PdfViewer({ pdf }) {
  const [totalPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <Document
      file={pdf}
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

PdfViewer.defaultProps = {
  pdf: '',
};

PdfViewer.propTypes = {
  pdf: PropTypes.string,
};
