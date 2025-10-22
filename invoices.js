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

// function handleCompanySelect(compayID, companies) {
//   const selectedCompanyId = Number(compayID);
//   console.log(`The id of the issuer is: ${selectedCompanyId}`);

//   const { select: selectIssuer, value: valueIssuerID } = selectCompany(
//     "issuer",
//     companies
//   );
//   console.log(selectIssuer);
//   console.log(valueIssuerID);
// }

function updateIssuerDetails(selectedIssuer) {
  // 1️⃣ Select the container div
  const detailsContainer = document.querySelector(".issuer-detailes");

  if (!detailsContainer) {
    console.error("Container .issuer-detailes not found!");
    return;
  }

  // 2️⃣ Clear existing content
  detailsContainer.innerHTML = "";

  // 3️⃣ Define the fields to display
  const fields = [
    { label: "Furnizor", value: selectedIssuer.name },
    { label: "CUI", value: selectedIssuer.cui },
    { label: "Nr.Reg.Com", value: selectedIssuer.nr_reg_com },
    { label: "Adresa", value: selectedIssuer.address },
    { label: "Banca", value: selectedIssuer.bank_name },
    { label: "Cont", value: selectedIssuer.bank_account },
    { label: "Tel", value: selectedIssuer.phone },
    { label: "Email", value: selectedIssuer.email },
    { label: "Web Site", value: selectedIssuer.website },
  ];

  // 4️⃣ Create new <p> tags dynamically
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
  // const { select: selectIssuer, value: valueIssuerID } = selectCompany(
  //   "issuer",
  //   issuers
  // );
  // console.log(selectIssuer);
  // console.log(valueIssuerID);

  // Populate Issuer <select>
  const selectIssuer = selectCompany("issuer", issuers);
  let selectedIssuer = null; // variable to store the selected issuer form the event listener
  console.log(selectIssuer);
  console.log(selectIssuer.value);

  selectIssuer.addEventListener("change", () => {
    console.log(selectIssuer.value);
    const selectedIssuerId = Number(selectIssuer.value);
    console.log(selectedIssuerId);

    // search for issuer with id of selectedIssuerId
    // variable has to be declared outside the event listener
    selectedIssuer = issuers.find((issuer) => issuer.id === selectedIssuerId);

    console.log(selectedIssuer);

    updateIssuerDetails(selectedIssuer);
  });

  // Populate Client <select>
  // const { select: selectClient, value: valueClientID } = selectCompany(
  //   "client",
  //   clients
  // );
  // console.log(selectClient);
  // console.log(valueClientID);

  // selectIssuer.addEventListener("change", () => {
  //   const { select: selectIssuer, value: valueIssuerID } = selectCompany(
  //     "issuer",
  //     issuers
  //   );
  //   console.log(valueIssuerID);
  //   const selectedCompanyId = Number(valueIssuerID);
  //   console.log(selectedCompanyId);
  // });

  // -----

  // select.addEventListener("change", () => {
  //   // console.log(`The id of the issuer is: ${issuerSelect.value}`);
  //   const selectedCompanyId = Number(select.value);
  //   console.log(`The id of the issuer is: ${selectedCompanyId}`);
  //   console.log(typeof selectedCompanyId);

  //   // search for issuer with id of selectedIssuerId
  //   const selectedIssuer = issuers.find(
  //     (issuer) => issuer.id === selectedCompanyId
  //   );

  //   console.log(selectedIssuer);
  // });

  // -------
  // const select = document.getElementById("invoice-issuer");
  // if (select && Array.isArray(issuers)) {
  //   // Remove any previously injected options but keep the placeholder (value="")
  //   Array.from(select.querySelectorAll("option"))
  //     .filter((opt) => opt.value !== "")
  //     .forEach((opt) => opt.remove());

  //   for (const issuer of issuers) {
  //     const option = document.createElement("option");
  //     option.value = String(issuer?.id ?? "");
  //     option.textContent = String(issuer?.name);
  //     select.appendChild(option);
  //   }
  // }

  // select.addEventListener("change", () => {
  //   // console.log(`The id of the issuer is: ${issuerSelect.value}`);
  //   const selectedIssuerId = Number(select.value);
  //   console.log(`The id of the issuer is: ${selectedIssuerId}`);
  //   console.log(typeof selectedIssuerId);

  //   // search for issuer with id of selectedIssuerId
  //   const selectedIssuer = issuers.find(
  //     (issuer) => issuer.id === selectedIssuerId
  //   );

  //   console.log(selectedIssuer);
  // });
})();
