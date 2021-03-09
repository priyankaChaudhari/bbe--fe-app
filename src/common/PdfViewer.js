import React, { useState } from 'react';
// import { Document, Page } from 'react-pdf';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import PdfLoadingMsg from './PdfLoadingMsg';
// import styled from 'styled-components';

export default function PdfViewer({ pdf }) {
  const [totalPages, setNumPages] = useState(null);

  const isDesktop = useMediaQuery({ minWidth: 1300 });
  const isDesktopView = useMediaQuery({ minWidth: 992, maxWidth: 1300 });

  // const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  // const isMobile = useMediaQuery({ maxWidth: 767 });

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const giveWidth = () => {
    if (isDesktop) {
      return 1200;
    }
    if (isDesktopView) {
      return 900;
    }
    return null;
    // if (isTablet) {
    //   console.log(document.getElementById('root').clientWidth, 'tablet');
    //   return document.getElementById('root').clientWidth;
    // }
    // if (isMobile) {
    //   console.log(document.getElementById('root').clientWidth, 'mobile');

    //   return document.getElementById('root').clientWidth;
    // }
  };
  return (
    <div id="ResumeContainer">
      <Document
        className="PDFDocument"
        file={pdf}
        options={{ workerSrc: 'pdf.worker.js' }}
        // error={PageNotFound}
        error={() => <PdfLoadingMsg type="error" />}
        loading={() => <PdfLoadingMsg type="loading" />}
        onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(totalPages), (el, index) => (
          <Page
            className="PDFPage PDFPageOne pdf-view"
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            // scale={1.2}
            width={giveWidth()}
            // maxWidth={giveWidth()}
          />
        ))}
      </Document>
    </div>
  );
}

PdfViewer.defaultProps = {
  pdf: '',
};

PdfViewer.propTypes = {
  pdf: PropTypes.string,
};
