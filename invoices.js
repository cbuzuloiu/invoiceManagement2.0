import { fetchCompanies } from "./fetchDataFromDatabase.js";
import {
  selectCompany,
  updateCompanieDetails,
  updateLeadTime,
  priceValueUpdate,
  vatValueUpdate,
  addNewItemSectionInTheInvoice,
  addInvoiceItemDescription,
  addInvoiceItemQt,
  addInvoiceItemPrice,
  addInvoiceItemVat,
  updateTableFooter,
  invoiceIdNumberContainerChange,
} from "./functionsForInvoices.js";
import { invoice } from "./invoiceClass.js";

(async () => {
  // Import issuers and clients form database
  const issuers = await fetchCompanies("http://localhost:8000/allissuers");
  const clients = await fetchCompanies("http://localhost:8000/allclients");

  // initialize the invoice object - later data will be sent to the database
  const invoiceObj = new invoice();

  console.log("Issuer: ", issuers);
  console.log("Clients: ", clients);

  // Populate Issuer <select>
  const selectIssuer = selectCompany("issuer", issuers);
  let selectedIssuer = null; // variable to store the selected issuer form the event listener

  selectIssuer.addEventListener("change", async () => {
    const selectedIssuerId = Number(selectIssuer.value);

    // search for issuer with id of selectedIssuerId
    // variable has to be declared outside the event listener
    selectedIssuer = issuers.find((issuer) => issuer.id === selectedIssuerId);

    console.log("****************************************");
    console.log("Selected Issuer is: ", selectedIssuer);

    updateCompanieDetails("issuer", selectedIssuer);

    // *** Get all invoices for Issuer by ID

    console.log(selectedIssuer.id);
    const invoices = await fetchCompanies(
      `http://localhost:8000/allissuerinvoices/${selectedIssuer.id}`
    );
    console.log(invoices);

    let invoiceId;

    if (invoices.data) {
      console.log("We have an object");
      console.log(selectedIssuer?.name?.[0] ?? ""); // "" if name is undefined or empty

      const firstLetterOfIssuerName = selectedIssuer?.name?.[0] ?? ""; // "" if name is undefined or empty

      invoiceId = `${firstLetterOfIssuerName}-${selectedIssuer.cui}-1`;

      console.log(invoiceId);
    }

    if (invoices.length > 0) {
      console.log(invoices.length);
      const firstLetterOfIssuerName = selectedIssuer?.name?.[0] ?? ""; // "" if name is undefined or empty

      invoiceId = `${firstLetterOfIssuerName}-${selectedIssuer.cui}-${
        invoices.length + 1
      }`;
    }

    invoiceIdNumberContainerChange(invoiceId);
    // ***
  });

  // Populate Client <select>
  const selectClient = selectCompany("client", clients);
  let selectedClient = null; // variable to store the selected client form the event listener

  selectClient.addEventListener("change", () => {
    const selectedClientId = Number(selectClient.value);

    // search for client with id of selectedClientId
    // variable has to be declared outside the event listener
    selectedClient = clients.find((client) => client.id === selectedClientId);

    console.log("Selected Client is: ", selectedClient);
    updateCompanieDetails("client", selectedClient);
  });

  // Populate Date
  const selectDate = document.querySelector("#invoice-date");
  let selectedDate = null;

  selectDate.addEventListener("change", () => {
    const rawDate = selectDate.value; // e.g. "2025-10-22"

    // selectedDate = new Date(rawDate);

    // Format using Romanian locale: DD.MM.YYYY
    const formattedDate = new Date(rawDate).toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    selectedDate = formattedDate;

    const dateContainer = document.querySelector(".date");
    // Clear old content (so we don’t keep appending)
    dateContainer.innerHTML = "";

    dateContainer.insertAdjacentHTML(
      "beforeend",
      `
      <h2 class="date">Data: <span>${selectedDate}</span></h2>
      `
    );

    updateLeadTime(selectDate, selectDueDate);
  });

  // Populate DueDate
  const selectDueDate = document.querySelector("#invoice-due-date");
  let selectedDueDate = null;

  selectDueDate.addEventListener("change", () => {
    const rawDate = selectDueDate.value; // e.g. "2025-10-22"

    // selectedDate = new Date(rawDate);

    // Format using Romanian locale: DD.MM.YYYY
    const formattedDueDate = new Date(rawDate).toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    selectedDueDate = formattedDueDate;

    const dateContainer = document.querySelector(".due-date");
    // Clear old content (so we don’t keep appending)
    dateContainer.innerHTML = "";

    dateContainer.insertAdjacentHTML(
      "beforeend",
      `
      <h2 class="date">Data scadenta: <span>${selectedDueDate}</span></h2>
      `
    );

    updateLeadTime(selectDate, selectDueDate);
  });

  // Handle Lead Time input → auto-calculate Due Date
  const leadTimeInput = document.querySelector("#invoice-lead-time");

  leadTimeInput.addEventListener("input", () => {
    const rawDate = selectDate.value; // "YYYY-MM-DD"
    const leadTimeDays = Number(leadTimeInput.value); // convert input to number

    // Only proceed if invoice date exists and lead time is valid
    if (rawDate && !isNaN(leadTimeDays)) {
      const invoiceDate = new Date(rawDate);

      // Add lead time (days)
      const dueDate = new Date(invoiceDate);
      dueDate.setDate(invoiceDate.getDate() + leadTimeDays);

      // Format due date (Romanian locale)
      const formattedDueDate = dueDate.toLocaleDateString("ro-RO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      // Update the Due Date input field in "YYYY-MM-DD" format for <input type="date">
      selectDueDate.value = dueDate.toISOString().split("T")[0];

      // Update the Due Date variable outside the event listener
      selectedDueDate = formattedDueDate;

      // Update the visible due date container
      const dueDateContainer = document.querySelector(".due-date");
      dueDateContainer.innerHTML = `
      <h2 class="date">Data scadentă: <span>${formattedDueDate}</span></h2>
    `;
    }
  });

  // *** ADD ITEMS SECTION ***
  const selectItemsSections = document.querySelectorAll(".items-section-item");
  console.log(selectItemsSections);

  class invoiceItem {
    constructor(id, itemDescription = "", quantity = "", price = "", vat = "") {
      this.id = id;
      this.itemDescription = itemDescription;
      this.quantity = quantity;
      this.price = price;
      this.vat = vat;
    }
  }

  // This array will hold all the objects
  const invoiceItems = [];

  const bodyDataContainer = document.querySelector(".body-data");
  console.log(bodyDataContainer);

  // ADD NEW ITEM SECTION IN THE INVOICE
  addNewItemSectionInTheInvoice(invoiceItems, invoiceItem, bodyDataContainer);

  console.log("Initial invoice items:", invoiceItems);

  // ADDING ITEMS LOGIC
  const selectInvoiceItem = document.querySelectorAll(".invoice-item");
  const selectItemQt = document.querySelectorAll(".invoice-qt");
  const selectItemPrice = document.querySelectorAll(".invoice-price");
  const selectItemVat = document.querySelectorAll(".invoice-vat");

  // INVOICE ITEM AND DESCRIPTION ADDED
  addInvoiceItemDescription(selectInvoiceItem, invoiceItems);

  let itemValue = 0; // must be declared before quantity, price and vat event listeners

  // QUANTITY
  itemValue = addInvoiceItemQt(selectItemQt, invoiceItems, itemValue);

  // PRICE
  itemValue = addInvoiceItemPrice(selectItemPrice, invoiceItems, itemValue);

  // VAT
  itemValue = addInvoiceItemVat(selectItemVat, invoiceItems, itemValue);

  // *** ADD NEW ITEM ***
  const addNewItemBtn = document.querySelector(".add-item-btn");
  const insertItemPosition = document.querySelector(".invoice-nav");
  console.log(addNewItemBtn);
  console.log(insertItemPosition);

  addNewItemBtn.addEventListener("click", () => {
    insertItemPosition.insertAdjacentHTML(
      "beforebegin",
      ` <div class="items-section-item">
                <div class="form-data-group">
                  <label for="invoice-item"><p>Item Description:</p></label>
                  <input
                    type="text-area"
                    class="invoice-item"
                    name="invoice-item"
                    placeholder="Add item description"
                  />
                </div>

                <div class="form-data-group">
                  <label for="invoice-qt"><p>Quantity:</p></label>
                  <input
                    type="number"
                    class="invoice-qt"
                    name="invoice-qt"
                    placeholder="Add item quantity"
                  />
                </div>

                <div class="form-data-group">
                  <label for="invoice-price"><p>Price without VAT:</p></label>
                  <input
                    type="number"
                    class="invoice-price"
                    name="invoice-price"
                    placeholder="Add price without VAT"
                  />
                </div>
                <div class="form-data-group">
                  <label for="invoice-vat"><p>VAT in %:</p></label>
                  <input
                    type="number"
                    class="invoice-vat"
                    name="invoice-vat"
                    placeholder="Add VAT: ex. 21"
                  />
                </div>
              </div>`
    );

    // ADD NEW ITEM SECTION IN THE INVOICE
    addNewItemSectionInTheInvoice(invoiceItems, invoiceItem, bodyDataContainer);

    // Refresh node list !!! important :)))
    const selectInvoiceItem = document.querySelectorAll(".invoice-item");
    const selectItemQt = document.querySelectorAll(".invoice-qt");
    const selectItemPrice = document.querySelectorAll(".invoice-price");
    const selectItemVat = document.querySelectorAll(".invoice-vat");

    // Add new item description
    addInvoiceItemDescription(selectInvoiceItem, invoiceItems);

    // Add new item quantity
    addInvoiceItemQt(selectItemQt, invoiceItems, itemValue);

    // Add new item price
    addInvoiceItemPrice(selectItemPrice, invoiceItems, itemValue);

    // Add new vat
    addInvoiceItemVat(selectItemVat, invoiceItems, itemValue);

    console.log("New Invoice Items List:", invoiceItems);
  });

  // ****

  const btnSaveInvoice = document.querySelector(".save-invoice-btn");
  btnSaveInvoice.addEventListener("click", () => {
    // console.log(invoiceItems);
    invoiceObj.idInvoice = "adsdasdasd";
  });
})();
