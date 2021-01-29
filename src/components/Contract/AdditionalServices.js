// import React from 'react';

// import PropTypes from 'prop-types';

// export default function AdditionalServices({
//   id,
//   setFormData,
//   formData,
//   agreementData,
//   customerData,
//   loader,
//   accountURL,
// }) {
//   return <div>hi</div>;
// }

// AdditionalServices.defaultProps = {
//   setFormData: () => {},
//   formData: {},
//   loader: false,
//   agreementData: {},
//   customerData: {},
// };

// AdditionalServices.propTypes = {
//   id: PropTypes.string.isRequired,
//   setFormData: PropTypes.func,
//   formData: PropTypes.shape({
//     additional_services: PropTypes.arrayOf(PropTypes.array),
//     start_date: PropTypes.string,
//     company_name: PropTypes.string,
//     primary_marketplace: PropTypes.string,
//     additional_marketplaces: PropTypes.arrayOf(PropTypes.array),
//     additional_monthly_services: PropTypes.arrayOf(PropTypes.array),
//   }),
//   agreementData: PropTypes.shape({
//     id: PropTypes.string,
//     contract_type: PropTypes.string,
//     primary_marketplace: PropTypes.shape({
//       fee: PropTypes.number,
//       name: PropTypes.string,
//       id: PropTypes.string,
//     }),
//     additional_monthly_services: PropTypes.arrayOf(PropTypes.object),
//     additional_marketplaces: PropTypes.arrayOf(PropTypes.object),
//     steps_completed: PropTypes.objectOf(PropTypes.bool),
//     additional_one_time_services: PropTypes.arrayOf(PropTypes.object),
//   }),
//   customerData: PropTypes.shape({
//     id: PropTypes.string,
//   }),
//   loader: PropTypes.bool,
// };

import React from 'react';

export default function AdditionalServices() {
  return <div>test</div>;
}
