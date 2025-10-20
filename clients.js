import {
  loadCompaniesToUi,
  loadCompanieDataToModal,
  addCompanie,
  deleteCompanie,
  editCompanie,
} from "./issuerAndClientsFunctions.js";

// MAIN LOGIC OF APP
(async () => {
  // LOGIC TO LOAD DATA TO THE UI
  //   await loadIssuersToUi();
  await loadCompaniesToUi("client");
  // LOGIC TO DISPLAY ISSUERS DETAIL IN THE DETAILS MODAL
  await loadCompanieDataToModal("client");
  // LOGIC TO ADD NEW ISSUER
  await addCompanie("client");
  // LOGIC TO DELETE ISSUER
  await deleteCompanie("client");
  // LOGIC TO EDIT A ISSUER
  await editCompanie("client");
})();
