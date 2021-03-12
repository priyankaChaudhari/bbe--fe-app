/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import Select, { components } from 'react-select';
import queryString from 'query-string';
import Slider from 'react-slick';
import NumberFormat from 'react-number-format';
import ReactTooltip from 'react-tooltip';

import {
  InputSearchWithRadius,
  DropDownSelect,
  Table,
  PageLoader,
  CommonPagination,
} from '../../common';
import {
  getCustomerList,
  getGrowthStrategist,
  getStatus,
} from '../../api/index';
import { PATH_CUSTOMER_DETAILS, PATH_CUSTOMER_LIST } from '../../constants';
import {
  SearchIcons,
  DefaultUser,
  whiteCross,
  CompanyDefaultUser,
  SortDownIcon,
  WhiteSortDown,
  InfoIcon,
} from '../../theme/images/index';
import {
  dataHeaders,
  sliderSettings,
  sortOptions,
} from '../../constants/FieldConstants';
import GetInitialName from '../../common/GetInitialName';
import NoRecordFound from '../../common/NoRecordFound';

export default function CustomerList() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [data, setData] = useState([]);
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [status, setStatus] = useState([]);
  const [count, setCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const [selectedFilter, setSelectedFilter] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValue, setSelectedValue] = useState({
    status: null,
    tier: null,
    contract_type: null,
    user: null,
    'order-by': null,
  });
  const [clearFilter, setClearFilter] = useState(true);
  const [brandGrowthStrategist, setBrandGrowthStrategist] = useState([]);

  const { Option, DropdownIndicator, SingleValue } = components;

  const IconOption = (props) => (
    <Option {...props}>
      {props.data.icon ? (
        <img
          className="drop-down-user"
          src={props.data.icon}
          alt="user"
          style={{
            borderRadius: 50,
            marginRight: '9px',
            height: '32px',
          }}
        />
      ) : (
        <GetInitialName
          userInfo={props.data.label}
          type="list"
          property="mr-2"
        />
      )}{' '}
      {props.data.label}
    </Option>
  );

  const IconSingleOption = (props) => (
    <SingleValue {...props}>
      {props.data.icon ? (
        <img
          className="drop-down-user"
          src={props.data.icon}
          alt="user"
          style={{ borderRadius: 50, width: '32px', marginBottom: '-11px' }}
        />
      ) : (
        <GetInitialName userInfo={props.data.label} type="list" property="" />
      )}{' '}
      &nbsp;
      <span style={{ lineHeight: 4 }}>{props.data.label}</span>
    </SingleValue>
  );

  const CustomDropdownIndicator = (props) => {
    return (
      <DropdownIndicator {...props}>
        <img src={SortDownIcon} alt="sort" style={{ width: '78%' }} />
      </DropdownIndicator>
    );
  };

  const CustomWhiteDropdownIndicator = (props) => {
    return (
      <DropdownIndicator {...props}>
        <img src={WhiteSortDown} alt="sort" style={{ width: '78%' }} />
      </DropdownIndicator>
    );
  };

  const getSelectComponents = (key) => {
    if (key === 'user') {
      return {
        Option: IconOption,
        SingleValue: IconSingleOption,
        DropdownIndicator:
          selectedValue[key] === null
            ? CustomDropdownIndicator
            : CustomWhiteDropdownIndicator,
      };
    }
    return {
      DropdownIndicator:
        selectedValue[key] === null
          ? CustomDropdownIndicator
          : CustomWhiteDropdownIndicator,
    };
  };

  const contractChoices = [
    { value: 'All', label: 'All' },
    { value: 'recurring', label: 'Recurring' },
    { value: 'one time', label: 'One Time' },
  ];

  const dropdownDetails = [
    {
      key: 'status',
      choices: status,
      placeholder: 'Status',
      width: 'w-30 ',
    },
    {
      key: 'contract_type',
      choices: contractChoices,
      placeholder: 'Contract type',
      width: 'w-30',
    },
    {
      key: 'user',
      choices: brandGrowthStrategist,
      placeholder: 'Brand Growth Strategist',
      width: 'w-50  ',
    },
  ];

  const tableInfoWithIcon = (tableData, header) => {
    return (
      <>
        <span>
          {header.key === 'brand_growth_strategist' &&
          !(tableData[header.key] && tableData[header.key].profile_photo) ? (
            <>
              {(tableData[header.key].first_name === '' &&
                tableData[header.key].last_name === '') ||
              tableData[header.key].length === 0 ? (
                ''
              ) : (
                <GetInitialName
                  userInfo={tableData[header.key]}
                  property="mr-2"
                />
              )}
            </>
          ) : (
            <img
              src={
                header.key === 'contract_company_name'
                  ? tableData.documents &&
                    tableData.documents[0] &&
                    Object.values(tableData.documents[0])
                    ? Object.values(tableData.documents[0])[0]
                    : CompanyDefaultUser
                  : header.key === 'brand_growth_strategist'
                  ? (tableData[header.key] &&
                      tableData[header.key].profile_photo) ||
                    DefaultUser
                  : DefaultUser
              }
              alt="user-pic"
              className="user-picture mr-2"
            />
          )}
        </span>
        <span>
          <div
            className="company-name "
            style={{
              marginTop: !(
                tableData[header.key] && tableData[header.key].profile_photo
              )
                ? '10px'
                : '',
            }}>
            {header.level === 'contract'
              ? tableData.contract && tableData.contract[header.key]
              : header.key === 'brand_growth_strategist'
              ? `${tableData[header.key].first_name || ''} ${
                  tableData[header.key].last_name || ''
                }`
              : tableData[header.key] || ' '}
          </div>
          {header.key === 'company_name' ? (
            <div className="sub-address">
              {tableData.contract && tableData.contract.city
                ? `${tableData.contract.city},`
                : ''}{' '}
              {tableData.contract && tableData.contract.state
                ? `${tableData.contract.state},`
                : ''}
              {(tableData.country && tableData.country.label) || ''}
            </div>
          ) : null}
        </span>
      </>
    );
  };

  const numericTableInfo = (tableData, header) => {
    return (
      <NumberFormat
        value={
          (header.level === 'contract'
            ? tableData.contract && tableData.contract[header.key]
            : tableData[header.key]) || 0
        }
        displayType="text"
        thousandSeparator
        prefix={header.type === 'number-currency' ? '$' : ''}
        suffix={header.type === 'number-percent' ? '%' : ''}
      />
    );
  };

  const formatTableData = (tableData, type) => {
    const fields = [];
    fields.push(
      <React.Fragment key={tableData.id}>
        {dataHeaders
          .filter((sec) => sec.section === type)
          .map((header) => (
            <td
              key={header.key}
              style={{
                textTransform: 'capitalize',
                display: header.key === 'brand_growth_strategist' ? 'flex' : '',
                minHeight: '68px',
              }}
              className={type === 2 ? 'firstChildCss' : ''}>
              {header.type === 'icon' ? (
                <>{tableInfoWithIcon(tableData, header)}</>
              ) : header.type && header.type.includes('number') ? (
                <>{numericTableInfo(tableData, header)}</>
              ) : (
                <>
                  {(header.level === 'contract'
                    ? tableData.contract && tableData.contract[header.key]
                    : tableData[header.key]) || ' '}
                </>
              )}
            </td>
          ))}
      </React.Fragment>,
    );
    return fields;
  };

  const customerList = useCallback(
    (currentPage) => {
      // setBrandGrowthStrategist([]);
      setIsLoading({ loader: true, type: 'page' });
      getCustomerList(currentPage, selectedFilter, searchQuery).then(
        (response) => {
          setData(response && response.data && response.data.results);
          setPageNumber(currentPage);
          setCount(response && response.data && response.data.count);
          setIsLoading({ loader: false, type: 'page' });
        },
      );
    },
    [selectedFilter, searchQuery],
  );

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    const stringified = queryString.stringify({
      page: currentPage,
    });
    history.push({
      pathname: `${PATH_CUSTOMER_LIST}`,
      search: `${stringified}`,
    });
    customerList(currentPage, selectedFilter, searchQuery);
  };

  useEffect(() => {
    getStatus().then((statusResponse) => {
      statusResponse.data.unshift({ value: 'All', label: 'All' });
      setStatus(statusResponse.data);
    });

    getGrowthStrategist().then((gs) => {
      if (gs && gs.data) {
        for (const brand of gs.data) {
          setBrandGrowthStrategist((prev) => [
            ...prev,
            {
              value: brand.id,
              label: `${brand.first_name} ${brand.last_name}`,
              icon:
                brand.documents &&
                brand.documents[0] &&
                Object.values(brand.documents[0]) &&
                Object.values(brand.documents[0])[0],
            },
          ]);
        }
      }
    });
    customerList(1, selectedFilter, searchQuery);
  }, [customerList, searchQuery, selectedFilter]);

  const cancelFilters = (key) => {
    const filter = { ...selectedFilter };
    delete filter[key];
    setSelectedValue({ ...selectedValue, [key]: null });
    setSelectedFilter(filter);
    setClearFilter(true);
    history.push(PATH_CUSTOMER_LIST);
    setIsLoading({ loader: true, type: 'page' });
    getCustomerList(1, filter, searchQuery).then((response) => {
      setData(response.data && response.data.results);
      setPageNumber(pageNumber);
      setCount(response && response.data && response.data.count);
      setIsLoading({ loader: false, type: 'page' });
    });
    if (key === 'user') setBrandGrowthStrategist([]);
  };

  const handleFilters = (event, key) => {
    setClearFilter(false);
    if (event.value === 'All' || event.value === '-created_at') {
      cancelFilters(key);
    } else {
      setSelectedValue({ ...selectedValue, [key]: event });
      setSelectedFilter({ ...selectedFilter, [key]: event.value });
      setIsLoading({ loader: true, type: 'page' });

      getCustomerList(
        '',
        { ...selectedFilter, [key]: event.value },
        searchQuery,
      ).then((response) => {
        setData(response.data && response.data.results);
        setPageNumber(pageNumber);
        setCount(response && response.data && response.data.count);
        setIsLoading({ loader: false, type: 'page' });
      });
    }
  };

  const handleSearch = () => {
    customerList(pageNumber, selectedFilter, searchQuery);
  };

  const generateTable = (type) => {
    return (
      <Table>
        <tbody>
          <tr className="table-header">
            {dataHeaders
              .filter((sec) => sec.section === type)
              .map((header) => (
                <th
                  key={header.key}
                  width={header.width}
                  className={type === 2 ? 'firstChildCss' : ''}>
                  {header.name}
                </th>
              ))}
          </tr>
          {data &&
            data.map((item) => (
              <tr
                className="cursor "
                key={item.id}
                onClick={() =>
                  history.push(PATH_CUSTOMER_DETAILS.replace(':id', item.id))
                }>
                {formatTableData(item, type)}
              </tr>
            ))}
        </tbody>
      </Table>
    );
  };

  return (
    <BodyGray>
      <div className="container">
        <div className="row ">
          <div className="col-md-7 col-12 ">
            <h5 style={{ textTransform: 'capitalize' }}>
              {' '}
              Welcome, {userInfo.first_name} {userInfo.last_name}
            </h5>
            <p className="mt-1 small-para">
              Below you can find the BBE customer data
            </p>
          </div>
          <div className="col-md-5 col-12 text-right ">
            <InputSearchWithRadius className="w-50">
              <input
                className="form-control search-filter"
                placeholder="Search"
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    handleSearch();
                  }
                }}
                value={searchQuery || ''}
              />
              <img
                src={SearchIcons}
                alt="search"
                className="search-input-icon"
              />

              <img
                src={InfoIcon}
                alt="search"
                data-tip="Search by Company Name, Contact First, Last Name or Email"
                data-for="info"
                className="info-icon"
              />
              <ReactTooltip id="info" aria-haspopup="true" />
            </InputSearchWithRadius>
            <div className="clear-fix" />
          </div>
        </div>

        <NavShap>
          <div className="row">
            <div className="col-md-8">
              <ul className="nav-drop-down">
                {dropdownDetails.map((item) => (
                  <li
                    className={
                      item.key === 'status' &&
                      selectedValue.status &&
                      selectedValue.status.value === 'pending cancellation'
                        ? `${item.width} mb-2 full-width`
                        : `${item.width} mb-2`
                    }
                    key={item.key}>
                    <DropDownSelect>
                      <Select
                        classNamePrefix="react-select"
                        className="active"
                        placeholder={item.placeholder}
                        options={item.choices}
                        styles={{
                          control: (base) => ({
                            ...base,
                            width: brandGrowthStrategist ? '105%' : '100%',
                            borderRadius: '18px',
                            border: '1px solid #dee2ed',
                            padding: '0 5px 0 5px',
                            fontSize: '16px',
                            color: 'white',
                            background:
                              selectedValue[item.key] === null
                                ? '#f9faff'
                                : '#2e384d',
                          }),

                          option: (provided, state) => {
                            return {
                              ...provided,
                              color: state.isSelected ? '#FF5933' : '#2E384D',
                              background: 'white',

                              ':hover': {
                                background: '#F9FAFF',
                                cursor: 'pointer',
                              },

                              ':first-of-type': {
                                color:
                                  item.key !== 'user' &&
                                  selectedValue[item.key] === null
                                    ? '#FF5933'
                                    : '',
                              },
                            };
                          },
                          singleValue: (provided) => {
                            const left =
                              selectedValue.user !== null && item.key === 'user'
                                ? '-2px'
                                : '';
                            const color =
                              selectedValue[item.key] === null
                                ? '#2e384d'
                                : 'white';

                            return { ...provided, color, left };
                          },
                          dropdownIndicator: (base) => ({
                            ...base,
                            color:
                              selectedValue[item.key] === null
                                ? '#2e384d'
                                : '#ffff',
                          }),
                        }}
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            neutral50: '#2e384d',
                          },
                        })}
                        onChange={(event) => handleFilters(event, item.key)}
                        value={
                          clearFilter && selectedValue[item.key] === null
                            ? null
                            : selectedValue[item.key]
                        }
                        components={getSelectComponents(item.key)}
                        componentsValue={
                          item.key === 'user' ? { Option: IconOption } : ''
                        }
                      />
                      {selectedValue.user !== null && item.key === 'user' ? (
                        <img
                          onClick={() => cancelFilters(item.key)}
                          src={whiteCross}
                          alt="remove"
                          role="presentation"
                          className="remove-icon cursor"
                        />
                      ) : (
                        ''
                      )}
                    </DropDownSelect>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-4 text-right">
              <ul className="nav-drop-down">
                <li className="w-40 ">
                  <DropDownSelect>
                    <Select
                      classNamePrefix="react-select"
                      placeholder="Sort"
                      options={sortOptions}
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: '18px',
                          border: '1px solid #dee2ed',
                          padding: '0 5px 0 5px',
                          fontSize: '16px',
                          color: 'white',
                          background:
                            selectedValue['order-by'] === null
                              ? '#f9faff'
                              : '#2e384d',
                        }),

                        option: (provided, state) => {
                          return {
                            ...provided,
                            color: state.isSelected ? '#FF5933' : '#2E384D',
                            background: 'white',

                            ':hover': {
                              background: '#F9FAFF',
                              cursor: 'pointer',
                            },
                            ':first-of-type': {
                              color:
                                selectedValue['order-by'] === null
                                  ? '#FF5933'
                                  : '',
                            },
                          };
                        },

                        singleValue: (provided) => {
                          const color =
                            selectedValue['order-by'] === null
                              ? '#2e384d'
                              : 'white';
                          return { ...provided, color };
                        },
                        dropdownIndicator: (base) => ({
                          ...base,
                          color:
                            selectedValue['order-by'] === null
                              ? '#2e384d'
                              : '#ffff',
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          neutral50: '#2e384d',
                        },
                      })}
                      onChange={(event) => handleFilters(event, 'order-by')}
                      value={
                        clearFilter && selectedValue['order-by'] === null
                          ? null
                          : selectedValue['order-by']
                      }
                      components={getSelectComponents('order-by')}
                    />
                  </DropDownSelect>
                </li>
              </ul>
            </div>
          </div>
        </NavShap>
        <div className="row">
          <div className="col-12">
            {isLoading.loader && isLoading.type === 'page' ? (
              <PageLoader color="#FF5933" type="page" />
            ) : (
              <div>
                {data && data.length === 0 ? (
                  <NoRecordFound />
                ) : (
                  <>
                    <Slider {...sliderSettings}>
                      <div className="table-responsive">{generateTable(1)}</div>
                      <div className="table-responsive ">
                        {generateTable(2)}
                      </div>
                    </Slider>

                    <CommonPagination
                      count={count}
                      pageNumber={pageNumber}
                      handlePageChange={handlePageChange}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </BodyGray>
  );
}

const BodyGray = styled.div`
  background-color: #fafafb;
  min-height: 91%;
  padding-top: 25px;
`;

const NavShap = styled.div`
  .nav-drop-down {
    padding: 0;
    marging: 0;

    li {
      list-style-type: none;
      display: inline-block;
      margin-right: 25px;

      &:last-child {
        margin-right: 0;
      }

      &.full-width {
        max-width: 195px !important;
      }

      &.w-10 {
        max-width: 80px;
        width: 100%;
        position: relative;

        .remove-icon {
          position: absolute;
          top: 14px;
          right: 30px;
          width: 12px;
        }

        .cross-icon {
          position: absolute;
          top: 14px;
          right: 30px;
          width: 12px;
        }
      }
      &.w-20 {
        max-width: 93px;
        width: 100%;
        position: relative;

        .remove-icon {
          position: absolute;
          top: 14px;
          right: 30px;
          width: 12px;
        }
        .cross-icon {
          position: absolute;
          top: 14px;
          right: 30px;
          width: 12px;
        }
      }
      &.w-30 {
        max-width: 160px;
        width: 100%;
        position: relative;

        .remove-icon {
          position: absolute;
          top: 14px;
          right: 30px;
          width: 12px;
        }
        .cross-icon {
          position: absolute;
          top: 14px;
          right: 30px;
          width: 12px;
        }
      }
      &.w-40 {
        max-width: 170px;
        width: 100%;
        position: relative;

        .remove-icon {
          position: absolute;
          top: 14px;
          right: 30px;
          width: 12px;
        }
        .cross-icon {
          position: absolute;
          top: 14px;
          right: 30px;
          width: 12px;
        }
      }
      &.w-50 {
        max-width: 215px;
        width: 100%;
        position: relative;

        .remove-icon {
          position: absolute;
          top: 14px;
          right: 30px;
          width: 12px;
        }
        .cross-icon {
          position: absolute;
          top: 14px;
          right: 30px;
          width: 12px;
        }
      }
    }
  }
  @media only screen and (max-width: 767px) {
    .d-inline-block {
      float: left;
    }

    li {
      &.w-40 {
        margin-bottom: 10px;
        float: left;
      }
    }
  }
`;
