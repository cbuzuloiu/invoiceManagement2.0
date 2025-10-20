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
  await loadCompaniesToUi("issuer");
  // LOGIC TO DISPLAY ISSUERS DETAIL IN THE DETAILS MODAL
  await loadIssuersDataToModal("issuer");

  // LOGIC TO ADD NEW ISSUER
  await addIssuer("issuer");

  // LOGIC TO DELETE ISSUER
  await deleteIssuer("issuer");

  // LOGIC TO EDIT A ISSUER
  await editIssuer("issuer");
})();
