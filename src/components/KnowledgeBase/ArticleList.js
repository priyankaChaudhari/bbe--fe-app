import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Theme from '../../theme/Theme';
import ArticleSearch from './ArticleSearch';
import { GlobalNavbar, PageLoader } from '../../common';
import { getArticleCollections } from '../../api';
import { PATH_ARTICLE_DETAILS, collectionDetails } from '../../constants';

export default function ArticleList() {
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const history = useHistory();
  const [data, setData] = useState([]);

  useEffect(() => {
    getArticleCollections().then((response) => {
      setData(response && response.data);
      setIsLoading({ loader: false, type: 'page' });
    });
  }, []);

  const getImages = (item) => {
    for (const img of collectionDetails) {
      if (item === img.key) {
        return <img className="article-card-icon" src={img.icon} alt="" />;
      }
    }
    return '';
  };

  return (
    <>
      <GlobalNavbar />
      <GrayBody>
        <div className="graycontainer">
          <h3 className="gray-text pt-5">Knowledge Base</h3>

          <p className="mt-2 small-para  mb-3">
            All the resources you need to get the most out of the Central
            platform.
          </p>
          <ArticleSearch />
          {isLoading.loader && isLoading.type === 'page' ? (
            <PageLoader color="#FF5933" type="page" width={40} />
          ) : (
            <div className="main-container">
              <div className="row mt-5">
                {data.map((item) => (
                  <React.Fragment key={item.id}>
                    {(item.cards === 0 && item.boards === 0) ||
                    item.name === 'Getting Started with Guru' ? (
                      ''
                    ) : (
                      <div
                        className="col-lg-3 col-md-4 col-sm-6 col-6  card-gap"
                        key={item.id}>
                        <div
                          className="article-card cursor"
                          role="presentation"
                          onClick={() =>
                            history.push(
                              `${PATH_ARTICLE_DETAILS.replace(':id', item.id)}`,
                            )
                          }>
                          {getImages(item.name)}
                          <h6 className="extra-bold">{item.name}</h6>
                          <p className="d-none d-lg-block">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </GrayBody>
    </>
  );
}

const GrayBody = styled.div`
  background: ${Theme.gray6};

  .graycontainer {
    max-width: 1334px;
    width: 100%;
    margin: 0 auto;
    padding-left: 64px;
    padding-top: 30px;
  }
  .article-card {
    background-color: ${Theme.white};
    border-radius: 12px;
    // max-width: 306px;
    flex-wrap: wrap;
    flex: initial;
    height: 100%;
    text-align: center;
    padding: 20px;

    .article-card-icon {
      width: 60px;
      margin-bottom: 10px;
    }
  }

  .card-gap {
    margin-bottom: 30px;
  }
  .small-para {
    color: ${Theme.gray90};
    font-size: ${Theme.extraMedium};
  }
  .drop-down-option {
    width: 100%;
    min-height: 1px;
    overflow-y: auto;
    top: 40px;
    max-height: 225px;
    font-size: ${Theme.normal};
    color: ${Theme.gray35};
    border-left: 1px solid ${Theme.gray9};
    border-right: 1px solid ${Theme.gray9};
    border-bottom-right-radius: 20px;
    border-bottom-left-radius: 20px;
    border-top-left-radius: 1px;
    z-index: 2;
    background-color: ${Theme.white};
    box-shadow: 0 15px 15px 0 rgba(68, 68, 79, 0.1);
    position: absolute;

    ul {
      padding: 0;
      margin: 0;
      list-style-type: none;

      li {
        padding: 8px;
        float: left;
        width: 100%;

        &:first-child {
          border-top: 1px solid ${Theme.gray7};
        }

        .book-list-icon {
          vertical-align: top;
          margin-right: 10px;
          width: 25px;
          margin-top: 4px;
          float: left;
        }
        .header-list {
          color: ${Theme.gray90};
          font-size: ${Theme.normal};
          font-weight: 800;

          .sub-list {
            color: ${Theme.gray35};
            font-size: ${Theme.extraNormal};
            font-weight: 300;
          }
        }
      }
    }
    .result-found {
      color: ${Theme.gray35};
      font-size: ${Theme.verySmall};
      text-transform: uppercase;
      font-family: ${Theme.titleFontFamily};
      padding: 18px 0 8px 0;
      letter-spacing: 0.85px;
      border-top: 1px solid ${Theme.gray9};
    }
  }
  @media only screen and (min-width: 1600px) {
    //height: 100%;
    .graycontainer {
      max-width: 1434px;
    }
  }
  @media only screen and (min-width: 1700px) and (min-width: 1920px) {
    // height: 100%;
    .graycontainer {
      max-width: 85%;
      padding-top: 40px;
      .article-card {
        background-color: ${Theme.white};
        border-radius: 12px;
        max-width: 100%;
        flex-wrap: wrap;
        flex: initial;
        height: 100%;
        text-align: center;
        padding: 20px;

        .article-card-icon {
          width: 80px;
          margin-bottom: 10px;
        }
        p {
          font-size: 18px;
        }
        h6 {
          font-size: 24px;
        }
      }
    }
  }
  @media only screen and (min-width: 1700px) and (max-width: 1920px) {
    .graycontainer {
      max-width: 1534px;
      padding-top: 40px;
    }
    .small-para {
      color: ${Theme.gray90};
      font-size: ${Theme.extraMediumRes};
    }
    .drop-down-option {
      font-size: ${Theme.normal};

      ul {
        li {
          .header-list {
            font-size: ${Theme.normalRes};

            .sub-list {
              font-size: ${Theme.extraNormalRes};
            }
          }
        }
      }
      .result-found {
        font-size: ${Theme.verySmallRes};
      }
    }
  }
  @media only screen and (max-width: 1400px) {
    .graycontainer {
      padding-left: 100px;
      padding-top: 40px;
    }
  }
  @media only screen and (max-width: 991.98px) {
    .graycontainer {
      padding: 45px 0 45px 30px;
    }
    .article-card {
      padding: 15px;
      min-height: 150px;

      h6 {
        font-size: ${Theme.normal};
      }
    }
  }
`;
