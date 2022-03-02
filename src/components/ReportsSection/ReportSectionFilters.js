import React, { useState } from 'react';

import AsyncSelect from 'react-select/async';
import { useMediaQuery } from 'react-responsive';
import { components } from 'react-select';
import { arrayOf, bool, func, shape, string } from 'prop-types';

import Theme from '../../theme/Theme';
import { getBPUserList } from '../../api';
import { DropDown } from '../Customer/CompanyPerformance/DropDown';
import { timeFrameOptions } from '../../constants';
import { WhiteCard, DropdownIndicator, DropDownSelect } from '../../common';

const ReportSectionFilter = ({
  bpList,
  handleBPList,
  isApiCall,
  handleTimeFrame,
  selectedTimeFrame,
  setBpList,
  getTimeFrameSelectComponents,
}) => {
  const { Option, SingleValue } = components;
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const filterOption = (props) => (
    <Option {...props}>
      <div className="pb-2">
        <span style={{ fontSize: '15px', color: '#000000' }}>
          {props.data.label}
        </span>

        <div style={{ fontSize: '12px', color: '#556178' }}>
          {props.data.sub}
        </div>
      </div>
    </Option>
  );

  const singleBPFilterOption = (props) => (
    <SingleValue {...props}>
      <span style={{ fontSize: '15px', color: '#000000' }}>
        {props.data.label}
      </span>

      <div style={{ fontSize: '12px', color: '#556178' }}>{props.data.sub}</div>
    </SingleValue>
  );

  const getBPSelectComponents = () => {
    return {
      Option: filterOption,
      SingleValue: singleBPFilterOption,
      DropdownIndicator,
    };
  };

  const loadOptions = async (inputValue) => {
    const list = [
      {
        value: 'Select-BP',
        label: 'Select BP',
      },
    ];
    const a = await getBPUserList(inputValue).then((res) => {
      if (res && res.status === 200) {
        if (res?.data?.results) {
          if (res?.data?.results?.length > 0) {
            for (const option of res?.data?.results) {
              list.push({
                value: option.id,
                label: option.company_name,
              });
            }
          }
        }
      }
      return list;
    });

    setBpList(a);
    return a;
  };

  const renderBPDropdown = (className) => {
    return (
      <DropDownSelect className={className} inputColor={Theme.black}>
        <AsyncSelect
          defaultOptions={bpList}
          getOptionLabel={(e) => e.label}
          getOptionValue={(e) => e.value}
          placeholder={bpList[0]?.label}
          components={getBPSelectComponents()}
          onChange={(event) => {
            handleBPList(event);
          }}
          loadOptions={loadOptions}
          isLoading={false}
        />
      </DropDownSelect>
    );
  };

  const renderTimeFrameFilter = () => {
    return DropDown(
      '',
      timeFrameOptions,
      timeFrameOptions[0].label,
      getTimeFrameSelectComponents,
      timeFrameOptions[0],
      handleTimeFrame,
      isApiCall,
      null,
      selectedTimeFrame,
    );
  };

  const renderDekstopView = () => {
    return (
      <WhiteCard className="mb-3 d-lg-block d-none">
        <div className="row ">
          <div className="col-lg-12">
            <div className="black-heading-title mb-3 ">
              Download Reports for
            </div>
          </div>

          <div className="col-lg-12 mb-3">{renderBPDropdown('cursor')}</div>
          <div className="col-lg-12"> {renderTimeFrameFilter('cursor')}</div>
        </div>
      </WhiteCard>
    );
  };

  const renderTabletView = () => {
    return (
      <WhiteCard
        onClick={() => setIsCollapseOpen(!isCollapseOpen)}
        className="mb-3 d-lg-none d-block">
        <div className="row ">
          <div className="col-md-4">
            <p className="black-heading-title mt-md-3 mt-0 mb-3">
              Download Reports for
            </p>
          </div>

          <div className="col-md-4 col-sm-12  mb-3 mb-md-0">
            {renderBPDropdown('customer-list-header')}
          </div>

          <div className="col-md-4 pl-md-5 col-sm-12">
            {renderTimeFrameFilter('customer-list-header')}
          </div>
        </div>
      </WhiteCard>
    );
  };

  return <>{isDesktop ? renderDekstopView() : renderTabletView()}</>;
};

export default ReportSectionFilter;

ReportSectionFilter.defaultProps = {
  isApiCall: false,
  selectedBp: {},
  data: {},
  selectedTimeFrame: {},
  bpList: [{}],
  setBpList: () => {},
  setSelectedBp: () => {},
  handleBPList: () => {},
  handleTimeFrame: () => {},
  getBpList: () => {},
  getTimeFrameSelectComponents: () => {},
};

ReportSectionFilter.propTypes = {
  isApiCall: bool,
  selectedBp: shape({}),
  selectedTimeFrame: shape({}),
  data: shape({ sub: string, label: string }),
  bpList: arrayOf(shape({})),
  setBpList: func,
  setSelectedBp: func,
  handleBPList: func,
  handleTimeFrame: func,
  getBpList: func,
  getTimeFrameSelectComponents: func,
};
