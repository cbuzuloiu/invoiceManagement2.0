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
  await loadIssuersDataToModal("client");
  // LOGIC TO ADD NEW ISSUER
  await addIssuer("client");
  // LOGIC TO DELETE ISSUER
  //   await deleteIssuer();
  // LOGIC TO EDIT A ISSUER
  //   await editIssuer();
})();
