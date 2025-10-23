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
})();
