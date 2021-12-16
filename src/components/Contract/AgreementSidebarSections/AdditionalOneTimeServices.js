/* eslint-disable react/no-unused-prop-types */

import React from 'react';

import NumberFormat from 'react-number-format';
import ReactTooltip from 'react-tooltip';
import Select, { components } from 'react-select';
import {
  string,
  bool,
  number,
  func,
  oneOfType,
  arrayOf,
  shape,
  object,
} from 'prop-types';

import { PlusIcon, MinusIcon, CaretUp, InfoIcon } from '../../../theme/images';
import {
  ErrorMsg,
  InputFormField,
  ContractInputSelect,
  CheckBox,
} from '../../../common';

function AdditionalOneTimeServices({
  onAddDiscount,
  formData,
  additionalMonthlySerError,
  oneTimeService,
  handleChange,
  changeQuantity,
  additionalOnetimeSerError,
  setShowAmazonPlanDropdown,
  amazonService,
  showAmazonPlanDropdown,
  AmazonStoreOptions,
  amazonStoreCustom,
  displayError,
  setAmazonStoreCustom,
  showFooter,
  additionalOnetimeServices,
  clearOneTimeQntyError,
  updateAdditionalOnetimeServicesSelectedData,
  discountData,
  servicesFees,
}) {
  const additionalOneTimeServicesLength =
    formData?.additional_one_time_services?.length;

  const additionalOneTimeSerErrQuantityLength =
    additionalOnetimeSerError?.quantity?.length;

  const handleAmazonServiceQuantity = (flag) => {
    showFooter(true);
    let amazonStoreItem = {};
    const selectedData =
      additionalOnetimeServices?.create?.length &&
      additionalOnetimeServices.create.filter((item) => {
        if (
          item.name
            ? item.name.includes('Amazon Store Package')
            : item.service.name.includes('Amazon Store Package')
        ) {
          amazonStoreItem = item;
          let itemQuantity = 0;
          if (item.quantity) {
            itemQuantity = parseInt(item.quantity, 10);
          }

          if (flag === 'add') {
            item.quantity = itemQuantity + 1;
          }
          if (flag === 'minus') {
            if (itemQuantity > 1) {
              item.quantity = itemQuantity - 1;
            }
          }
        }
        return item;
      });

    clearOneTimeQntyError(amazonStoreItem);

    if (selectedData) {
      updateAdditionalOnetimeServicesSelectedData(selectedData);
    }
  };

  const handleAmazonPlanChange = (event) => {
    if (event.label === 'Custom') {
      setAmazonStoreCustom(true);
    } else {
      setAmazonStoreCustom(false);
    }
  };

  const setDefaultAmazonPlanValue = () => {
    const serviceData =
      additionalOneTimeServicesLength &&
      formData.additional_one_time_services.find((item) =>
        item.name
          ? item.name.includes('Amazon Store Package')
          : item.service?.name.includes('Amazon Store Package'),
      );
    if (serviceData?.service_id || serviceData?.service?.id) {
      const serviceName = serviceData.name
        ? serviceData.name.split(' ')[3]
        : serviceData.service.name.split(' ')[3];

      return {
        value: serviceData.service_id
          ? serviceData.service_id
          : serviceData.service.id,
        label: serviceName,
      };
    }
    return null;
  };

  const getSelectedAmazonStorePackage = () => {
    const selectedAmazonStore =
      additionalOneTimeServicesLength &&
      formData.additional_one_time_services.find((item) =>
        item.name
          ? item.name.includes('Amazon Store Package')
          : item.service?.name.includes('Amazon Store Package'),
      );
    return selectedAmazonStore && selectedAmazonStore.service
      ? selectedAmazonStore.service && selectedAmazonStore.service.id
      : selectedAmazonStore && selectedAmazonStore.service_id;
  };

  const checkDisableCondition = () => {
    return additionalOneTimeServicesLength &&
      formData.additional_one_time_services.find((item) =>
        item.name
          ? item.name.includes('Amazon Store Package')
          : item.service && item.service.name.includes('Amazon Store Package'),
      )
      ? parseInt(
          additionalOneTimeServicesLength &&
            formData.additional_one_time_services.find((item) =>
              item.name
                ? item.name.includes('Amazon Store Package')
                : item.service?.name.includes('Amazon Store Package'),
            ).quantity,
          10,
        ) === 999
      : false;
  };

  const DropdownIndicator = (props) => {
    const { selectProps } = props;

    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <img
            src={CaretUp}
            alt="caret"
            style={{
              transform: selectProps.menuIsOpen ? 'rotate(180deg)' : '',
              width: '25px',
              height: '25px',
            }}
          />
        </components.DropdownIndicator>
      )
    );
  };

  const showDiscountLabel = () => {
    const discount =
      discountData?.length &&
      discountData.filter((item) => item.service_type === 'one time service');
    if (discount?.length && discount[0]?.type) {
      return 'Edit Discount';
    }
    return 'Add Discount';
  };

  const displayNumber = (num) => {
    const res = num?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return res;
  };

  const getAmazonStoreFee = () => {
    const basic = servicesFees.find((op) => op.name.includes('Basic'));
    const plus = servicesFees.find((op) => op.name.includes('Plus'));
    return `Basic - 1 page ($ ${displayNumber(basic?.fee || 1500)}),
    Plus - 1 home page + up to 5 pages/sub-pages ($ ${displayNumber(
      plus?.fee || 2400,
    )}), Custom - Will vary`;
  };

  const displayOneTimeServices = () => {
    return (
      <li>
        <InputFormField className="mb-3">
          <label htmlFor="additional_one_time_services">
            One Time Services
          </label>
          <div
            className="add-discount"
            role="presentation"
            onClick={() => onAddDiscount('one time service')}>
            {showDiscountLabel()}
          </div>
          {additionalMonthlySerError.required ? (
            <ErrorMsg>{additionalMonthlySerError.required}</ErrorMsg>
          ) : (
            ''
          )}
        </InputFormField>
        <div className="row">
          {oneTimeService &&
            oneTimeService.map((oneTimeServiceData) =>
              !oneTimeServiceData.label.includes('Amazon Store Package') ? (
                <React.Fragment key={oneTimeServiceData.value}>
                  <div className="col-7 ">
                    <CheckBox>
                      <label
                        className="check-container customer-pannel"
                        htmlFor={oneTimeServiceData.value}>
                        {oneTimeServiceData.label}
                        <input
                          type="checkbox"
                          name={oneTimeServiceData.label}
                          id={oneTimeServiceData.value}
                          onClick={(event) =>
                            handleChange(
                              event,
                              'additional_one_time_services',
                              'checkbox',
                              oneTimeServiceData,
                            )
                          }
                          defaultChecked={
                            additionalOneTimeServicesLength &&
                            formData.additional_one_time_services.find(
                              (item) =>
                                item.service?.id === oneTimeServiceData.value ||
                                item.service_id === oneTimeServiceData.value,
                            )
                          }
                        />
                        <span className="checkmark" />
                      </label>
                    </CheckBox>
                  </div>
                  {additionalOneTimeServicesLength &&
                  formData.additional_one_time_services.find((item) =>
                    item.service_id
                      ? item.service_id === oneTimeServiceData.value
                      : item.service?.id === oneTimeServiceData.value,
                  ) ? (
                    <>
                      <div className="col-5 pl-0 text-end">
                        <button
                          type="button"
                          className="decrement"
                          onClick={() => {
                            changeQuantity(oneTimeServiceData, 'minus');
                          }}>
                          {' '}
                          <img className="minus-icon" src={MinusIcon} alt="" />
                        </button>

                        <NumberFormat
                          name={oneTimeServiceData.label}
                          className="form-control max-min-number"
                          value={
                            formData.additional_one_time_services.find((item) =>
                              item.service_id
                                ? item.service_id === oneTimeServiceData.value
                                : item.service?.id === oneTimeServiceData.value,
                            ).quantity
                          }
                          id={oneTimeServiceData.value}
                          onChange={(event) =>
                            handleChange(
                              event,
                              'additional_one_time_services',
                              'quantity',
                              oneTimeServiceData,
                            )
                          }
                          isAllowed={(values) => {
                            const { formattedValue, floatValue } = values;
                            if (floatValue == null) {
                              return formattedValue === '';
                            }
                            return floatValue <= 999;
                          }}
                        />

                        <button
                          type="button"
                          className="increment"
                          disabled={
                            formData.additional_one_time_services.find((item) =>
                              item.service_id
                                ? item.service_id === oneTimeServiceData.value
                                : item.service?.id === oneTimeServiceData.value,
                            ).quantity
                              ? parseInt(
                                  formData.additional_one_time_services.find(
                                    (item) =>
                                      item.service_id
                                        ? item.service_id ===
                                          oneTimeServiceData.value
                                        : item.service?.id ===
                                          oneTimeServiceData.value,
                                  ).quantity,
                                  10,
                                ) === 999
                              : false
                          }
                          onClick={() => {
                            changeQuantity(oneTimeServiceData, 'add');
                          }}>
                          <img className="plus-icon" src={PlusIcon} alt="" />
                        </button>
                      </div>
                      <div className="col-12 text-left ">
                        {additionalOneTimeSerErrQuantityLength &&
                        additionalOnetimeSerError.quantity.find(
                          (item) =>
                            item.service_id === oneTimeServiceData.value,
                        ) ? (
                          <ErrorMsg className="mb-3">
                            {additionalOneTimeSerErrQuantityLength &&
                              additionalOnetimeSerError.quantity.find(
                                (item) =>
                                  item.service_id === oneTimeServiceData.value,
                              ).error}
                          </ErrorMsg>
                        ) : (
                          ''
                        )}
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </React.Fragment>
              ) : (
                ''
              ),
            )}
          <>
            <div className="col-7 ">
              {' '}
              <CheckBox>
                <label
                  className="check-container customer-pannel"
                  htmlFor="contract-copy-check">
                  Amazon Store
                  <img
                    src={InfoIcon}
                    alt="search cursor"
                    data-tip={getAmazonStoreFee()}
                    data-for="info"
                    className="info-icon ml-2"
                    style={{ verticalAlign: 'middle' }}
                  />
                  <ReactTooltip id="info" aria-haspopup="true" place="bottom" />
                  <input
                    type="checkbox"
                    id="contract-copy-check"
                    onClick={(event) => {
                      setShowAmazonPlanDropdown(event.target.checked);

                      handleChange(
                        event,
                        'amazon_store_package',
                        'checkbox',
                        amazonService,
                      );
                    }}
                    defaultChecked={
                      additionalOneTimeServicesLength &&
                      formData.additional_one_time_services.find((item) =>
                        item.name
                          ? item.name.includes('Amazon Store Package')
                          : item.service?.name.includes('Amazon Store Package'),
                      )
                    }
                  />
                  <span className="checkmark" />
                </label>
              </CheckBox>
            </div>
            {showAmazonPlanDropdown ? (
              <>
                <div className="col-5 pl-0 text-end">
                  <button
                    type="button"
                    className="decrement"
                    onClick={() => {
                      handleAmazonServiceQuantity('minus');
                    }}>
                    <img className="minus-icon" src={MinusIcon} alt="" />
                  </button>

                  <NumberFormat
                    name="amazon service"
                    className="form-control max-min-number"
                    value={
                      additionalOneTimeServicesLength &&
                      formData.additional_one_time_services.find((item) =>
                        item.name
                          ? item.name.includes('Amazon Store Package')
                          : item.service?.name.includes('Amazon Store Package'),
                      )
                        ? additionalOneTimeServicesLength &&
                          formData.additional_one_time_services.find((item) =>
                            item.name
                              ? item.name.includes('Amazon Store Package')
                              : item.service?.name.includes(
                                  'Amazon Store Package',
                                ),
                          ).quantity
                        : ''
                    }
                    onChange={(event) =>
                      handleChange(
                        event,
                        'amazon_store_package',
                        'quantity',
                        amazonService,
                      )
                    }
                    isAllowed={(values) => {
                      const { formattedValue, floatValue } = values;
                      if (floatValue == null) {
                        return formattedValue === '';
                      }
                      return floatValue <= 999;
                    }}
                  />

                  <button
                    type="button"
                    className="increment"
                    disabled={checkDisableCondition()}
                    onClick={() => {
                      handleAmazonServiceQuantity('add');
                    }}>
                    <img className="plus-icon" src={PlusIcon} alt="" />
                  </button>
                </div>

                <div className="col-12 text-left">
                  {additionalOneTimeSerErrQuantityLength &&
                  additionalOnetimeSerError.quantity.find(
                    (item) =>
                      item.service_id === getSelectedAmazonStorePackage(),
                  ) ? (
                    <ErrorMsg className="mb-3">
                      {additionalOneTimeSerErrQuantityLength &&
                        additionalOnetimeSerError.quantity.find(
                          (item) =>
                            item.service_id === getSelectedAmazonStorePackage(),
                        ).error}
                    </ErrorMsg>
                  ) : (
                    ''
                  )}
                </div>
              </>
            ) : (
              ''
            )}
            {showAmazonPlanDropdown ? (
              <div className="col-12">
                <ContractInputSelect>
                  <Select
                    classNamePrefix="react-select"
                    isSearchable={false}
                    defaultValue={setDefaultAmazonPlanValue()}
                    options={AmazonStoreOptions}
                    name="amazon_store_plan"
                    components={{ DropdownIndicator }}
                    onChange={(event) => {
                      handleAmazonPlanChange(event);
                      handleChange(event, 'amazon_store_package', 'dropdown');
                    }}
                    placeholder="Select Package"
                  />
                </ContractInputSelect>
                {amazonStoreCustom ? (
                  <InputFormField className="w-100 mt-1">
                    <NumberFormat
                      className={
                        additionalOnetimeSerError?.custom_amazon_store_price
                          ? 'form-control form-control-error'
                          : 'form-control '
                      }
                      type="text"
                      prefix="$"
                      value={
                        additionalOneTimeServicesLength &&
                        formData.additional_one_time_services.find((item) =>
                          item.name
                            ? item.name.includes('Amazon Store Package')
                            : item.service?.name.includes(
                                'Amazon Store Package',
                              ),
                        )
                          ? additionalOneTimeServicesLength &&
                            formData.additional_one_time_services.find((item) =>
                              item.name
                                ? item.name.includes('Amazon Store Package')
                                : item.service?.name.includes(
                                    'Amazon Store Package',
                                  ),
                            ).custom_amazon_store_price
                          : ''
                      }
                      placeholder="Enter Custom Store Price"
                      name="custom_amazon_store_price"
                      onChange={(event) =>
                        handleChange(
                          event,
                          'amazon_store_package',
                          'custom_amazon_store_price',
                        )
                      }
                      thousandSeparator
                      isAllowed={(values) => {
                        const { formattedValue, floatValue } = values;
                        if (floatValue == null) {
                          return formattedValue === '';
                        }
                        return floatValue <= 100000000;
                      }}
                      decimalScale={2}
                      allowNegative={false}
                    />
                    {displayError('custom_amazon_store_price')}
                  </InputFormField>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}
          </>
        </div>
      </li>
    );
  };

  return <div>{displayOneTimeServices()}</div>;
}

export default AdditionalOneTimeServices;

AdditionalOneTimeServices.defaultProps = {
  selectProps: {},
  onAddDiscount: () => {},
  formData: {},
  additionalMonthlySerError: {},
  oneTimeService: [],
  handleChange: () => {},
  changeQuantity: () => {},
  additionalOnetimeSerError: {},
  setShowAmazonPlanDropdown: () => {},
  amazonService: {},
  showAmazonPlanDropdown: false,
  AmazonStoreOptions: [],
  amazonStoreCustom: false,
  displayError: () => {},
  setAmazonStoreCustom: () => {},
  showFooter: () => {},
  additionalOnetimeServices: {},
  clearOneTimeQntyError: () => {},
  updateAdditionalOnetimeServicesSelectedData: () => {},
  discountData: [],
  servicesFees: {},
};

AdditionalOneTimeServices.propTypes = {
  selectProps: shape({
    menuIsOpen: bool,
  }),
  onAddDiscount: func,
  formData: shape({}),
  additionalMonthlySerError: oneOfType([string, object]),
  oneTimeService: arrayOf(shape({})),
  handleChange: func,
  changeQuantity: func,
  additionalOnetimeSerError: shape({
    quantity: number,
    custom_amazon_store_price: number,
  }),
  setShowAmazonPlanDropdown: func,
  amazonService: shape({}),
  showAmazonPlanDropdown: bool,
  AmazonStoreOptions: arrayOf(shape({})),
  amazonStoreCustom: bool,
  displayError: func,
  setAmazonStoreCustom: func,
  showFooter: func,
  additionalOnetimeServices: shape({
    create: arrayOf(shape({})),
    delete: arrayOf(string, shape({})),
  }),
  clearOneTimeQntyError: func,
  updateAdditionalOnetimeServicesSelectedData: func,
  discountData: arrayOf(shape()),
  servicesFees: shape({}),
};
