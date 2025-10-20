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
  await loadCompaniesToUi("issuer");
  // LOGIC TO DISPLAY ISSUERS DETAIL IN THE DETAILS MODAL
  await loadCompanieDataToModal("issuer");

  // LOGIC TO ADD NEW ISSUER
  await addCompanie("issuer");

  // LOGIC TO DELETE ISSUER
  await deleteCompanie("issuer");

  // LOGIC TO EDIT A ISSUER
  await editCompanie("issuer");
})();
