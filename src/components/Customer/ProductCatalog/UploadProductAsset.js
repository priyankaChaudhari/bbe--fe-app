// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useState, useCallback } from 'react';
// import { useLocation } from 'react-router-dom';
// import styled from 'styled-components';
// import { toast } from 'react-toastify';

// import {
//   UnauthorizedHeader,
//   OnBoardingBody,
//   CheckBox,
//   Button,
//   InputFormField,
//   ErrorMsg,
//   PageLoader,
// } from '../../../common';

// import Theme from '../../../theme/Theme';
// import {
//   DefaultUser,
//   LeftArrowIcon,
//   OrangeCheckMark,
//   SecurityLock,
//   EditOrangeIcon,
// } from '../../../theme/images';
// import { getRequestedProducts, updateProductAsset } from '../../../api';

// export default function UploadProductAsset() {
//   const [productAsset, setProductAsset] = useState({});
//   const [isAssignElse, setIsAssignElse] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [apiError, setApiError] = useState({});
//   const [editEmail, setEditEmail] = useState({});
//   const [isLoading, setIsLoading] = useState({ loader: false, type: 'email' });

//   const location = useLocation();
//   const splittedPath =
//     location && location.pathname && location.pathname.split('/');
//   const productAssetsId = splittedPath && splittedPath[4];

//   const getProductAssetsData = useCallback(() => {
//     getRequestedProducts(splittedPath && splittedPath[4]).then((res) => {
//       setProductAsset(res && res.data);
//       if (res && res.data && res.data.re_assigned_email) {
//         setIsAssignElse(true);
//         setEditEmail(false);
//       }
//     });
//   }, []);

//   useEffect(() => {
//     getProductAssetsData();
//   }, [getProductAssetsData]);

//   const onAskSomeoneElse = (event) => {
//     console.log(event.target.checked);
//     if (event.target.checked) {
//       setIsAssignElse(true);
//     } else {
//       setIsAssignElse(false);
//     }
//   };

//   const sendEmail = () => {
//     setIsLoading({ loader: true, type: 'email' });

//     updateProductAsset(productAssetsId, {
//       re_assigned_email: formData.email,
//     }).then((res) => {
//       if (res && res.status === 200) {
//         setEditEmail(false);
//         setFormData({ email: '' });
//         toast.success('Request Sent Successfully!');
//         setIsLoading({ loader: false, type: 'email' });
//         getProductAssetsData();
//       }
//       if (res && res.status === 400) {
//         setApiError(res && res.data);
//         setIsLoading({ loader: false, type: 'email' });
//       }
//     });
//   };
//   console.log(
//     formData,
//     isLoading,
//     isAssignElse,
//     editEmail,
//     formData.email && formData.email === '',
//     isLoading.loader,
//     isAssignElse && !editEmail,
//   );
//   return (
//     <div>
//       {' '}
//       <UnauthorizedHeader />) : (
//       <BackToStep>
//         {' '}
//         <div className="container-fluid">
//           {' '}
//           <div className="row">
//             <div className="col-12">
//               <div role="presentation" className="back-link">
//                 <img
//                   src={LeftArrowIcon}
//                   alt="aarow-back"
//                   className="arrow-back-icon "
//                 />
//                 Back to Dashboard
//               </div>
//             </div>
//           </div>
//         </div>{' '}
//       </BackToStep>
//       )
//       <OnBoardingBody className="grey-bg-asset pb-3">
//         <div className="white-card-base  pb-4 ">
//           <h3 className="page-heading ">Upload Your Product Assets</h3>
//           <CheckBox className="mt-1 mb-4">
//             <label className="check-container customer-pannel " htmlFor="step">
//               Ask someone else to complete this section
//               <input
//                 className="checkboxes"
//                 type="checkbox"
//                 id="step"
//                 defaultChecked={productAsset && productAsset.re_assigned_email}
//                 // readOnly
//                 onClick={(event) => {
//                   console.log('onchange of checkbix ');
//                   onAskSomeoneElse(event);
//                 }}
//               />
//               <span className="checkmark" />
//             </label>
//           </CheckBox>
//           {isAssignElse ? (
//             <fieldset className="shape-without-border w-430 mt-2">
//               <InputFormField>
//                 <label htmlFor="email">
//                   Assign to (email)
//                   <input
//                     className="form-control"
//                     style={{
//                       opacity: isAssignElse && !editEmail ? 0.5 : '',
//                     }}
//                     defaultValue={
//                       productAsset && productAsset.re_assigned_email
//                     }
//                     onChange={(event) => {
//                       setFormData({ email: event.target.value });
//                       setApiError({ re_assigned_email: '' });
//                     }}
//                     readOnly={(isAssignElse && !editEmail) || isLoading.loader}
//                   />
//                 </label>
//                 <ErrorMsg>
//                   {apiError &&
//                     apiError.re_assigned_email &&
//                     apiError.re_assigned_email[0]}
//                 </ErrorMsg>
//                 {productAsset && productAsset.re_assigned_email ? (
//                   <span
//                     className="edit-field cursor"
//                     role="presentation"
//                     onClick={() => setEditEmail(true)}>
//                     <img
//                       className="edit-icon"
//                       src={EditOrangeIcon}
//                       alt="edit"
//                     />{' '}
//                     Edit email address
//                   </span>
//                 ) : (
//                   ''
//                 )}
//                 {productAsset && productAsset.re_assigned_email ? (
//                   <p className="info-text-gray m-0 pt-2">
//                     We’ve emailed them a link to submit the information in this
//                     section.
//                   </p>
//                 ) : (
//                   <p className="info-text-gray m-0 pt-3 ">
//                     We’ll email them a link to submit the information in this
//                     section.
//                   </p>
//                 )}
//                 <Button
//                   className="btn-primary w-100  mt-3"
//                   onClick={() => sendEmail()}
//                   disabled={
//                     (formData.email && formData.email === '') ||
//                     isLoading.loader
//                   }>
//                   {isLoading.loader && isLoading.type === 'email' ? (
//                     <PageLoader color="#fff" type="button" />
//                   ) : (
//                     'Send Email'
//                   )}
//                 </Button>
//               </InputFormField>
//             </fieldset>
//           ) : (
//             ''
//           )}
//           <div className="complete-steps mt-3">
//             You’ll need the following to complete this step:
//           </div>
//           <ul className="account-steps-check">
//             <li>
//               <img src={OrangeCheckMark} alt="check" />
//               Imagery for the{' '}
//               {productAsset &&
//                 productAsset.products_detail &&
//                 productAsset.products_detail.length}{' '}
//               products listed below
//             </li>
//             <li>
//               <img src={OrangeCheckMark} alt="check" /> Any Instructions/specs
//               for those products
//             </li>
//           </ul>
//           <ul className="upload-product-asset">
//             {productAsset &&
//               productAsset.products_detail &&
//               productAsset.products_detail.length &&
//               productAsset.products_detail.map((item) => (
//                 <li>
//                   <div className="product-asset-image">
//                     <img src={DefaultUser} alt="product" />
//                   </div>
//                   <div className="image-title">
//                     <p className="product-asset-title recurring-service mt-0  mb-0">
//                       {item.title}
//                     </p>
//                     <p className="product-asset-subtitle m-0">{item.asin}</p>
//                   </div>
//                 </li>
//               ))}
//           </ul>
//           <Button className="btn-primary w-100 mb-2 mt-3">Continue</Button>
//           <p className="info-text-gray security-lock text-center  mb-0">
//             <img width="16px" src={SecurityLock} alt="lock" />
//             <span>
//               {' '}
//               All files will be stored securely and never shared with a 3rd
//               party.
//             </span>
//           </p>
//         </div>
//       </OnBoardingBody>
//     </div>
//   );
// }

// const BackToStep = styled.div`
//   position: fixed;
//   background-color: ${Theme.white};
//   z-index: 2;
//   top: 70px;
//   padding: 22px 0px 18px 0px;
//   width: 100%;
//   border-bottom: 1px solid ${Theme.gray5};

//   .skip-steps {
//     color: ${Theme.gray40};
//     font-size: ${Theme.extraNormal};
//     cursor: pointer;
//   }
// `;
