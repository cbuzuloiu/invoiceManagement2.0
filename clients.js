import {
  loadCompaniesToUi,
  loadIssuersDataToModal,
  addIssuer,
  deleteIssuer,
  editIssuer,
} from "./issuerAndClientsFunctions.js";

// MAIN LOGIC OF APP
(async () => {
  // LOGIC TO LOAD DATA TO THE UI
  //   await loadIssuersToUi();
  await loadCompaniesToUi("client");
  // LOGIC TO DISPLAY ISSUERS DETAIL IN THE DETAILS MODAL
  //   await loadIssuersDataToModal();
  // LOGIC TO ADD NEW ISSUER
  //   await addIssuer();
  // LOGIC TO DELETE ISSUER
  //   await deleteIssuer();
  // LOGIC TO EDIT A ISSUER
  //   await editIssuer();
})();
