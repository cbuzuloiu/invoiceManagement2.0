// Populate <select>
// companieType Client or Issuer, companies is the issuers or clietns array
export function selectCompany(companyType, companies) {
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

export function updateCompanieDetails(companieType, selectedCompanie) {
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
export function updateLeadTime(selectDate, selectDueDate) {
  const rawDate = selectDate.value;
  const rawDueDate = selectDueDate.value;

  const leadTimeInput = document.querySelector("#invoice-lead-time");

  // Only proceed if both fields are filled
  if (rawDate && rawDueDate) {
    const date1 = new Date(rawDate);
    const date2 = new Date(rawDueDate);

    const diffMs = date2 - date1; // milliseconds difference
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)); // convert to days

    // Display in the lead time field
    leadTimeInput.value = diffDays >= 0 ? diffDays : 0; // avoid negative numbers
  }
}

// PRICE VALUE
export function priceValueUpdate(invoiceItems, index) {
  const selectItemContainerPriceValue = document.querySelector(
    `.item-${index + 1}-price-value`
  );

  if (invoiceItems[index].quantity !== "" && invoiceItems[index].price !== "") {
    const itemValue =
      Number(invoiceItems[index].quantity) * Number(invoiceItems[index].price);

    selectItemContainerPriceValue.textContent = itemValue;

    return itemValue;
  }
}

// VAT VALUE
export function vatValueUpdate(itemValue, invoiceItems, index) {
  const selectItemContainerVatPrice = document.querySelector(
    `.item-${index + 1}-vat`
  );

  const vatValuePrice =
    Number(itemValue) * (Number(invoiceItems[index].vat) / 100);

  if (!Number.isNaN(vatValuePrice)) {
    selectItemContainerVatPrice.textContent = vatValuePrice;
  }
}

// ADD NEW ITEM SECTION IN THE INVOICE
export function addNewItemSectionInTheInvoice(
  invoiceItems,
  invoiceItem,
  bodyDataContainer
) {
  const newItemId = invoiceItems.length + 1;

  const item = new invoiceItem(newItemId);
  invoiceItems.push(item);

  bodyDataContainer.insertAdjacentHTML(
    "beforeend",
    `
        <tr class = "item-${newItemId}">
          <td class = "item-${newItemId}-id">${item.id}</td>
          <td class = "item-${newItemId}-itemDescription">${
      item.itemDescription
    }</td>
          <td class = "item-${newItemId}-quantity">${item.quantity}</td>
          <td class = "item-${newItemId}-price">${item.price}</td>
          <td class = "item-${newItemId}-price-value">${
      item.price * item.quantity
    }</td>
          <td class = "item-${newItemId}-vat">${item.vat}</td>
          <td class = "item-${newItemId}-vat-prq">${item.vat}%</td>
        </tr>
      `
  );
}

// INVOICE ITEM AND DESCRIPTION ADDED
export function addInvoiceItemDescription(selectInvoiceItem, invoiceItems) {
  selectInvoiceItem.forEach((itemInput, index) => {
    itemInput.addEventListener("change", () => {
      const selectedValue = itemInput.value;
      const selectItemContainer = document.querySelector(
        `.item-${index + 1}-itemDescription`
      );

      invoiceItems[index].itemDescription = selectedValue;

      selectItemContainer.textContent = selectedValue;
    });
  });
}

// QUANTITY
export function addInvoiceItemQt(selectItemQt, invoiceItems, itemValue) {
  selectItemQt.forEach((itemInput, index) => {
    itemInput.addEventListener("change", () => {
      const selectedItemQt = itemInput.value;
      const selectItemContainer = document.querySelector(
        `.item-${index + 1}-quantity`
      );

      invoiceItems[index].quantity = selectedItemQt;
      selectItemContainer.textContent = selectedItemQt;

      itemValue = priceValueUpdate(invoiceItems, index);
      vatValueUpdate(itemValue, invoiceItems, index);

      // Update totals in the table footre
      updateTableFooter(invoiceItems);

      return itemValue;
    });
  });
}

// PRICE
export function addInvoiceItemPrice(selectItemPrice, invoiceItems, itemValue) {
  selectItemPrice.forEach((itemInput, index) => {
    itemInput.addEventListener("change", () => {
      const selectedItemPrice = itemInput.value;
      const selectItemContainer = document.querySelector(
        `.item-${index + 1}-price`
      );

      invoiceItems[index].price = selectedItemPrice;
      selectItemContainer.textContent = selectedItemPrice;

      itemValue = priceValueUpdate(invoiceItems, index);
      vatValueUpdate(itemValue, invoiceItems, index);

      // Update totals in the table footre
      updateTableFooter(invoiceItems);

      return itemValue;
    });
  });
}

// VAT
export function addInvoiceItemVat(selectItemVat, invoiceItems, itemValue) {
  selectItemVat.forEach((itemInput, index) => {
    itemInput.addEventListener("change", () => {
      const selectedItemVat = itemInput.value;
      const selectItemContainer = document.querySelector(
        `.item-${index + 1}-vat-prq`
      );

      invoiceItems[index].vat = selectedItemVat;
      selectItemContainer.textContent = selectedItemVat;

      // Recompute item value before updating VAT to avoid using a stale value
      itemValue = priceValueUpdate(invoiceItems, index);
      vatValueUpdate(itemValue, invoiceItems, index);

      // Update totals in the table footre
      updateTableFooter(invoiceItems);

      return itemValue;
    });
  });
}

// Update totals in the table footre
export function updateTableFooter(invoiceItems) {
  const containerTotalWithoutVat = document.querySelector(".total-without-vat");

  const containerTotalVat = document.querySelector(".total-vat");
  const containerTotal = document.querySelector(".total");

  let totalWithoutVat = 0;
  let totalVat = 0;
  let total = 0;

  invoiceItems.forEach((item) => {
    const priceValue = Number(item.quantity) * Number(item.price);
    const itemVat = priceValue * (Number(item.vat) / 100);

    totalWithoutVat += priceValue;
    totalVat += itemVat;
  });

  total += totalWithoutVat + totalVat;

  containerTotalWithoutVat.textContent = totalWithoutVat;
  containerTotalVat.textContent = totalVat;
  containerTotal.textContent = total;
}

// function that updates the invoice id in the invoice section
export function invoiceIdNumberContainerChange(invoiceId) {
  const containerInvoiceId = document.querySelector("#invoice-id");
  containerInvoiceId.textContent = invoiceId;
}
