async function fetchCompanies(url) {
  try {
    const response = await fetch(`${url}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const sorted = Array.isArray(data)
      ? data.slice().sort((a, b) => {
          const ai = Number(a?.id ?? Number.MAX_SAFE_INTEGER);
          const bi = Number(b?.id ?? Number.MAX_SAFE_INTEGER);
          return ai - bi;
        })
      : [];
    return sorted;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
}

// Populate <select>
// companieType Client or Issuer, companies is the issuers or clietns array
function selectCompany(companyType, companies) {
  let select;

  if (companyType === "issuer") {
    select = document.getElementById("invoice-issuer");
  }

  if (companyType === "client") {
    select = document.getElementById("invoice-client");
  }

  if (select && Array.isArray(companies)) {
    // Remove any previously injected options but keep the placeholder (value="")
    Array.from(select.querySelectorAll("option"))
      .filter((opt) => opt.value !== "")
      .forEach((opt) => opt.remove());

    for (const companie of companies) {
      const option = document.createElement("option");
      // value is the ID of the company (ID form DATABASE)
      option.value = String(companie?.id ?? "");
      option.textContent = String(companie?.name);
      select.appendChild(option);
    }
  }

  return select;
}

function updateCompanieDetails(companieType, selectedCompanie) {
  let detailsContainer = null;

  if (companieType === "issuer") {
    detailsContainer = document.querySelector(".issuer-detailes");

    if (!detailsContainer) {
      console.error("Container .issuer-detailes not found!");
      return;
    }
  }

  if (companieType === "client") {
    if (companieType === "client") {
      detailsContainer = document.querySelector(".client-detailes");

      if (!detailsContainer) {
        console.error("Container .client-detailes not found!");
        return;
      }
    }
  }

  // Clear existing content
  detailsContainer.innerHTML = "";

  // Define the fields to display
  const fields = [
    { label: "Furnizor", value: selectedCompanie.name },
    { label: "CUI", value: selectedCompanie.cui },
    { label: "Nr.Reg.Com", value: selectedCompanie.nr_reg_com },
    { label: "Adresa", value: selectedCompanie.address },
    { label: "Banca", value: selectedCompanie.bank_name },
    { label: "Cont", value: selectedCompanie.bank_account },
    { label: "Tel", value: selectedCompanie.phone },
    { label: "Email", value: selectedCompanie.email },
    { label: "Web Site", value: selectedCompanie.website },
  ];

  // Create new <p> tags dynamically
  fields.forEach(({ label, value }) => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${label}:</strong> <span>${value || "-"}</span>`;
    detailsContainer.appendChild(p);
  });
}

// Update Lead Time
function updateLeadTime(selectDate, selectDueDate) {
  const rawDate = selectDate.value;
  const rawDueDate = selectDueDate.value;

  console.log(rawDate);
  console.log(rawDueDate);

  const leadTimeInput = document.querySelector("#invoice-lead-time");

  // Only proceed if both fields are filled
  if (rawDate && rawDueDate) {
    const date1 = new Date(rawDate);
    const date2 = new Date(rawDueDate);

    const diffMs = date2 - date1; // milliseconds difference
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)); // convert to days
    console.log(diffDays);

    // Display in the lead time field
    leadTimeInput.value = diffDays >= 0 ? diffDays : 0; // avoid negative numbers
  }
}

(async () => {
  // Import issuers and clients form database
  const issuers = await fetchCompanies("http://localhost:8000/allissuers");
  const clients = await fetchCompanies("http://localhost:8000/allclients");

  console.log("Issuer: ", issuers);
  console.log("Clients: ", clients);

  // Populate Issuer <select>
  const selectIssuer = selectCompany("issuer", issuers);
  let selectedIssuer = null; // variable to store the selected issuer form the event listener

  selectIssuer.addEventListener("change", () => {
    const selectedIssuerId = Number(selectIssuer.value);

    // search for issuer with id of selectedIssuerId
    // variable has to be declared outside the event listener
    selectedIssuer = issuers.find((issuer) => issuer.id === selectedIssuerId);

    console.log("Selected Issuer is: ", selectedIssuer);

    updateCompanieDetails("issuer", selectedIssuer);
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

  // ADD ITEMS SECTION

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

  // Loop through each .items-section-item element
  selectItemsSections.forEach((section, index) => {
    // Create a new empty invoiceItem object for each section
    const item = new invoiceItem(index + 1);
    invoiceItems.push(item);

    bodyDataContainer.insertAdjacentHTML(
      "beforeend",
      `
        <tr class = "item-${index + 1}">
          <td class = "item-${index + 1}-id">${item.id}</td>
          <td class = "item-${index + 1}-itemDescription">${
        item.itemDescription
      }</td>
          <td class = "item-${index + 1}-quantity">${item.quantity}</td>
          <td class = "item-${index + 1}-price">${item.price}</td>
          <td class = "item-${index + 1}-price-value">${
        item.price * item.quantity
      }</td>
          <td class = "item-${index + 1}-vat">${item.vat}</td>
          <td class = "item-${index + 1}-vat-prq">${item.vat}%</td>
        </tr>
      `
    );
  });

  console.log("Initial invoice items:", invoiceItems);

  // ADDING ITEMS LOGIC
  const selectInvoiceItem = document.querySelector("#invoice-item");
  const selectItemQt = document.querySelector("#invoice-qt");
  const selectItemPrice = document.querySelector("#invoice-price");

  // INVOICE ITEM AND DESCRIPTION ADDED
  selectInvoiceItem.addEventListener("change", () => {
    const selectedValue = selectInvoiceItem.value;
    const selectItemContainer = document.querySelector(
      ".item-1-itemDescription"
    );
    console.log(selectItemContainer);
    console.log("Selected item:", selectedValue);

    // Assume for now you want to populate the FIRST invoice item
    // Later we’ll map this dynamically (based on which section is active)
    invoiceItems[0].itemDescription = selectedValue;

    console.log("Updated invoice items:", invoiceItems);

    selectItemContainer.textContent = selectedValue;
  });

  // QUANTITY
  selectItemQt.addEventListener("change", () => {
    const selectedItemQt = selectItemQt.value;
    const selectItemContainer = document.querySelector(".item-1-quantity");

    invoiceItems[0].quantity = selectedItemQt;
    selectItemContainer.textContent = selectedItemQt;
    priceValueUpdate();
  });

  // PRICE
  selectItemPrice.addEventListener("change", () => {
    const selectedItemPrice = selectItemPrice.value;
    const selectItemContainer = document.querySelector(".item-1-price");

    invoiceItems[0].price = selectedItemPrice;
    selectItemContainer.textContent = selectedItemPrice;

    priceValueUpdate();
  });

  // PRICE VALUE

  function priceValueUpdate() {
    const selectItemContainerPriceValue = document.querySelector(
      ".item-1-price-value"
    );

    if (invoiceItems[0].quantity !== "" && invoiceItems[0].price !== "") {
      console.log(invoiceItems[0].quantity);
      console.log(invoiceItems[0].price);

      const itemValue =
        Number(invoiceItems[0].quantity) * Number(invoiceItems[0].price);

      console.log("Total Item Value: ", itemValue);

      selectItemContainerPriceValue.textContent = itemValue;
    }
  }
})();
