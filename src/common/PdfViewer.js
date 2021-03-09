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
  const isDesktopLarge = useMediaQuery({ minWidth: 1601 });
  const isDesktop = useMediaQuery({ minWidth: 1300, maxWidth: 1600 });
  const isDesktopView = useMediaQuery({ minWidth: 992, maxWidth: 1300 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isMobile = useMediaQuery({ minWidth: 590, maxWidth: 767 });
  const isMobileView = useMediaQuery({ minWidth: 455, maxWidth: 591 });
  const isMobileSmallView = useMediaQuery({ minWidth: 320, maxWidth: 456 });

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const giveWidth = () => {
    if (isDesktopLarge) {
      return 1500;
    }
    if (isDesktop) {
      return 1200;
    }
    if (isDesktopView) {
      return 900;
    }
    if (isTablet) {
      return 600;
    }

    if (isMobile) {
      return 550;
    }

    if (isMobileView) {
      return 450;
    }

    if (isMobileSmallView) {
      return 320;
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
