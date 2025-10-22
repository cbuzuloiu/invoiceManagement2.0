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
      option.value = String(companie?.id ?? "");
      option.textContent = String(companie?.name);
      select.appendChild(option);
    }
  }

  return select;
}

(async () => {
  const issuers = await fetchCompanies("http://localhost:8000/allissuers");
  const clients = await fetchCompanies("http://localhost:8000/allclients");

  console.log("Issuer: ", issuers);
  console.log("Clients: ", clients);

  // Populate Issuer <select>
  selectCompany("issuer", issuers);

  // Populate Client <select>
  selectCompany("client", clients);

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
