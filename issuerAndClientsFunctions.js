let cachedIssuers = null;
let cachedClients = null;

// Fetch issuers from the Express API
export async function fetchCompanyesFromApi(clientType) {
  if (clientType === "issuer") {
    // Return cached data if available
    if (cachedIssuers) {
      return cachedIssuers;
    }
    try {
      const response = await fetch("http://localhost:8000/allissuers");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      cachedIssuers = data; // Cache the result
      return data;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      return [];
    }
  } else if (clientType === "client") {
    // Return cached data if available
    if (cachedClients) {
      return cachedClients;
    }
    try {
      const response = await fetch("http://localhost:8000/allclients");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      cachedClients = data; // Cache the result
      return data;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      return [];
    }
  }
}

// FUNCTIONS FOR ALL ISSUERS SECTION
export function createTableRow(value, elementToAppednTo) {
  // Create the `.table-r` div
  const div = document.createElement("div");
  div.classList.add("table-r");

  // Create the pharagraph
  const p = document.createElement("p");

  if (value === "Name") {
    p.classList.add("text-strong");
    p.textContent = "Name";
  } else if (value === "Email") {
    p.classList.add("text-strong");
    p.textContent = "Email";
  } else if (value === "Phone") {
    p.classList.add("text-strong");
    p.textContent = "Phone";
  } else {
    p.textContent = value;
  }

  // Append paragraph to the div
  div.appendChild(p);

  // Append `.table-r` directly into the table container
  elementToAppednTo.appendChild(div);
}

// Load Issuers from the database to the UI
export async function loadCompaniesToUi(clientType) {
  if (clientType === "issuer") {
    try {
      const issuers = await fetchCompanyesFromApi(clientType);
      const tableCompanyName = document.querySelector("#table-name");
      const tableCompnayEmail = document.querySelector("#table-email");
      const tableCompanyPhone = document.querySelector("#table-phone");
      const tableActions = document.querySelector("#table-actions");

      // RESET
      tableCompanyName.innerHTML = "";
      tableCompnayEmail.innerHTML = "";
      tableCompanyPhone.innerHTML = "";
      tableActions.innerHTML = "";

      // LOADING NAME
      createTableRow("Name", tableCompanyName);

      issuers.forEach((company) => {
        createTableRow(company.name, tableCompanyName);
      });

      // LOADING EMAIL
      createTableRow("Email", tableCompnayEmail);

      issuers.forEach((company) => {
        createTableRow(company.email, tableCompnayEmail);
      });

      // LOADING PHONE
      createTableRow("Phone", tableCompanyPhone);

      issuers.forEach((company) => {
        createTableRow(company.phone, tableCompanyPhone);
      });

      // LOADING ACTIONS
      tableActions.insertAdjacentHTML(
        "beforeend",
        `
      <div class="table-r">
        <p class="text-strong">Actions</p>
      </div>
    `
      );

      issuers.forEach(() => {
        tableActions.insertAdjacentHTML(
          "beforeend",
          `
              <div class="table-r">
                <div class="table-actions">
                  <button class="btn small issuer-detail">🔎 Details</button>
                  <button class="btn small issuer-edit">✏️ Edit</button>
                  <button class="btn small danger issuer-delete">🗑️ Delete</button>
                </div>
              </div>
      `
        );
      });
    } catch (error) {
      console.error(
        "There was a problem with loading the issuers to the UI:",
        error
      );
      return [];
    }
  } else if (clientType === "client") {
    try {
      const client = await fetchCompanyesFromApi(clientType);
      const tableCompanyName = document.querySelector("#table-name");
      const tableCompnayEmail = document.querySelector("#table-email");
      const tableCompanyPhone = document.querySelector("#table-phone");
      const tableActions = document.querySelector("#table-actions");

      // RESET
      tableCompanyName.innerHTML = "";
      tableCompnayEmail.innerHTML = "";
      tableCompanyPhone.innerHTML = "";
      tableActions.innerHTML = "";

      // LOADING NAME
      createTableRow("Name", tableCompanyName);

      client.forEach((company) => {
        createTableRow(company.name, tableCompanyName);
      });

      // LOADING EMAIL
      createTableRow("Email", tableCompnayEmail);

      client.forEach((company) => {
        createTableRow(company.email, tableCompnayEmail);
      });

      // LOADING PHONE
      createTableRow("Phone", tableCompanyPhone);

      client.forEach((company) => {
        createTableRow(company.phone, tableCompanyPhone);
      });

      // LOADING ACTIONS
      tableActions.insertAdjacentHTML(
        "beforeend",
        `
      <div class="table-r">
        <p class="text-strong">Actions</p>
      </div>
    `
      );

      client.forEach(() => {
        tableActions.insertAdjacentHTML(
          "beforeend",
          `
              <div class="table-r">
                <div class="table-actions">
                  <button class="btn small client-detail">🔎 Details</button>
                  <button class="btn small client-edit">✏️ Edit</button>
                  <button class="btn small danger client-delete">🗑️ Delete</button>
                </div>
              </div>
      `
        );
      });
    } catch (error) {
      console.error(
        "There was a problem with loading the issuers to the UI:",
        error
      );
      return [];
    }
  }
}

// LOAD ONE ISSUER TO THE UI
function loadOneIssuerToTheUI(issuer) {
  const tableCompanyName = document.querySelector("#table-name");
  const tableCompnayEmail = document.querySelector("#table-email");
  const tableCompanyPhone = document.querySelector("#table-phone");
  const tableActions = document.querySelector("#table-actions");

  // LOADING NAME
  createTableRow(issuer.name, tableCompanyName);

  // LOADING EMAIL
  createTableRow(issuer.email, tableCompnayEmail);

  // LOADING PHONE
  createTableRow(issuer.phone, tableCompanyPhone);

  // LOADING ACTIONS
  tableActions.insertAdjacentHTML(
    "beforeend",
    `
              <div class="table-r">
                <div class="table-actions">
                  <button class="btn small issuer-detail">🔎 Details</button>
                  <button class="btn small issuer-edit">✏️ Edit</button>
                  <button class="btn small danger issuer-delete">🗑️ Delete</button>
                </div>
              </div>
      `
  );
}

// LOAD ISSUER DATA TO THE MODAL WINDOW
export async function loadCompanieDataToModal(clientType) {
  if (clientType === "issuer") {
    try {
      const issuers = cachedIssuers;

      // MODAL VAR - has to be declared after the action buttons are loaded.
      const issuerDetailBtn = Array.from(
        document.querySelectorAll(".issuer-detail")
      ); // get the node list and transforms it in an array
      const modalActive = document.querySelector(".modal-overlay");
      const closeModal = document.querySelector("#close_modal");

      // MODAL DETAILS
      for (const button of issuerDetailBtn) {
        button.addEventListener("click", () => {
          const modalTitle = document.querySelector("#modal-title-name");
          const modalCUI = document.querySelector("#modal-cui");
          const modalNrReg = document.querySelector("#modal-nrReg");
          const modalAddress = document.querySelector("#modal-address");
          const modalBankName = document.querySelector("#modal-bank-name");
          const modalBankAccount = document.querySelector("#bank-account");
          const modalPhone = document.querySelector("#modal-phone");
          const modalEmail = document.querySelector("#modal-email");
          const modalWeb = document.querySelector("#modal-web");

          const indexOfIssuer = issuerDetailBtn.indexOf(button);
          modalActive.classList.add("show");

          modalTitle.textContent = issuers[indexOfIssuer].name;
          modalCUI.textContent = issuers[indexOfIssuer].cui;
          modalNrReg.textContent = issuers[indexOfIssuer].nr_reg_com;
          modalAddress.textContent = issuers[indexOfIssuer].address;
          modalBankName.textContent = issuers[indexOfIssuer].bank_name;
          modalBankAccount.textContent = issuers[indexOfIssuer].bank_account;
          modalPhone.textContent = issuers[indexOfIssuer].phone;
          modalEmail.textContent = issuers[indexOfIssuer].email;
          modalWeb.textContent = issuers[indexOfIssuer].website;
        });
      }

      closeModal.addEventListener("click", () => {
        modalActive.classList.remove("show");
      });
    } catch (error) {
      console.error(
        "There was a problem with loading the issuers to the UI:",
        error
      );
      return [];
    }
  } else if (clientType === "client") {
    try {
      const clients = cachedClients;

      // MODAL VAR - has to be declared after the action buttons are loaded.
      const clientDetailBtn = Array.from(
        document.querySelectorAll(".client-detail")
      ); // get the node list and transforms it in an array
      const modalActive = document.querySelector(".modal-overlay");
      const closeModal = document.querySelector("#close_modal");

      // MODAL DETAILS
      for (const button of clientDetailBtn) {
        button.addEventListener("click", () => {
          const modalTitle = document.querySelector("#modal-title-name");
          const modalCUI = document.querySelector("#modal-cui");
          const modalNrReg = document.querySelector("#modal-nrReg");
          const modalAddress = document.querySelector("#modal-address");
          const modalBankName = document.querySelector("#modal-bank-name");
          const modalBankAccount = document.querySelector("#bank-account");
          const modalPhone = document.querySelector("#modal-phone");
          const modalEmail = document.querySelector("#modal-email");
          const modalWeb = document.querySelector("#modal-web");

          const indexOfClient = clientDetailBtn.indexOf(button);
          modalActive.classList.add("show");

          modalTitle.textContent = clients[indexOfClient].name;
          modalCUI.textContent = clients[indexOfClient].cui;
          modalNrReg.textContent = clients[indexOfClient].nr_reg_com;
          modalAddress.textContent = clients[indexOfClient].address;
          modalBankName.textContent = clients[indexOfClient].bank_name;
          modalBankAccount.textContent = clients[indexOfClient].bank_account;
          modalPhone.textContent = clients[indexOfClient].phone;
          modalEmail.textContent = clients[indexOfClient].email;
          modalWeb.textContent = clients[indexOfClient].website;
        });
      }

      closeModal.addEventListener("click", () => {
        modalActive.classList.remove("show");
      });
    } catch (error) {
      console.error(
        "There was a problem with loading the issuers to the UI:",
        error
      );
      return [];
    }
  }
}

// ADD A NEW ISSUER
export async function addCompanie(clientType) {
  const form = document.querySelector(".form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent form reload

    // collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // for modal response
    const modalActive = document.querySelector(".modal-overlay-req");
    const closeModal = document.querySelector("#close_modal_req");
    const addModalContent = document.querySelector(
      ".modal-container-req-content"
    );

    try {
      let response;

      if (clientType === "issuer") {
        response = await fetch("http://127.0.0.1:8000/addissuer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          addModalContent.textContent =
            "Company: " + result.issuer.name + " was addedd sucessfuly!";

          //LOAD TO THE UI THE ISSUER ADDED
          cachedIssuers.push(result.issuer);
          loadOneIssuerToTheUI(cachedIssuers.at(-1));
          loadCompanieDataToModal(clientType);

          form.reset(); // clears all inputs
        } else {
          addModalContent.textContent = result.error;
        }
      } else if (clientType === "client") {
        response = await fetch("http://127.0.0.1:8000/addcleint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          // reload the page after successful request
          // location.reload();
          addModalContent.textContent =
            "Company: " + result.client.name + " was addedd sucessfuly!";

          //LOAD TO THE UI THE ISSUER ADDED
          cachedClients.push(result.client);
          loadOneIssuerToTheUI(cachedClients.at(-1));
          loadCompanieDataToModal(clientType);

          form.reset(); // clears all inputs
        } else {
          addModalContent.textContent = result.error;
        }
      }
    } catch (error) {
      console.log("Error", error);
      addModalContent.textContent = error;
      return [];
    }

    modalActive.classList.add("show-req"); // display modal

    closeModal.addEventListener("click", () => {
      modalActive.classList.remove("show-req");
    });
  });
}

// DELETE ISSUER
export async function deleteCompanie(clientType) {
  document.addEventListener("click", async (e) => {
    let btn;

    if (clientType === "issuer") {
      btn = e.target.closest(".issuer-delete");
    }

    if (clientType === "client") {
      btn = e.target.closest(".client-delete");
    }

    if (!btn) return; // not a delete click

    // console.log(btn);

    const modalActive = document.querySelector(".modal-overlay-delete");
    const closeModalAndDelete = document.querySelector(
      "#close_modal_delete_yes"
    );
    const closeModalAndNoDelete = document.querySelector(
      "#close_modal_delete_no"
    );

    modalActive.classList.add("show-delete");

    closeModalAndDelete.addEventListener("click", async () => {
      modalActive.classList.remove("show-delete");

      // find the .table-r that contains this button (in the actions column)
      const actionRow = btn.closest("#table-actions .table-r");
      if (!actionRow) return;

      // console.log(actionRow);

      // get fresh lists (including header at index 0)
      const actionRows = Array.from(
        document.querySelectorAll("#table-actions .table-r")
      );
      const nameRows = Array.from(
        document.querySelectorAll("#table-name .table-r")
      );
      const emailRows = Array.from(
        document.querySelectorAll("#table-email .table-r")
      );
      const phoneRows = Array.from(
        document.querySelectorAll("#table-phone .table-r")
      );

      // find the index (index 0 is the header row)
      const rowIndex = actionRows.indexOf(actionRow);
      if (rowIndex <= 0) return; // guard: clicked header or not found

      // console.log(rowIndex);

      // dataIndex corresponds to your cachedIssuers array (exclude header)
      const dataIndex = rowIndex - 1;

      if (clientType === "issuer") {
        const idOfIssuer = cachedIssuers?.[dataIndex]?.id;
        if (!idOfIssuer) {
          console.error("No cached issuer found for index", dataIndex);
          return;
        }

        try {
          // call backend to delete (optional but recommended)
          const res = await fetch(
            `http://127.0.0.1:8000/deleteissuer/${encodeURIComponent(
              idOfIssuer
            )}`,
            {
              method: "DELETE",
            }
          );
          const body = await res.json();
          if (!res.ok) throw new Error(body.error || "Delete failed");

          // remove the corresponding .table-r in every column (use rowIndex)
          nameRows[rowIndex]?.remove();
          emailRows[rowIndex]?.remove();
          phoneRows[rowIndex]?.remove();
          actionRows[rowIndex]?.remove();

          // console.log("Id of issuer is: ", idOfIssuer);
          // console.log("cached issuers are before delete:", [...cachedIssuers]);

          // update your cached array
          cachedIssuers.splice(dataIndex, 1);
          // console.log("cached issuers are after delete:", cachedIssuers);
        } catch (err) {
          console.error("Delete failed:", err);
          alert("Failed to delete issuer: " + err.message);
        }
      } else if (clientType === "client") {
        {
          const idOfClient = cachedClients?.[dataIndex]?.id;
          if (!idOfClient) {
            console.error("No cached issuer found for index", dataIndex);
            return;
          }

          try {
            // call backend to delete (optional but recommended)
            const res = await fetch(
              `http://127.0.0.1:8000/deleteclient/${encodeURIComponent(
                idOfClient
              )}`,
              {
                method: "DELETE",
              }
            );
            const body = await res.json();
            if (!res.ok) throw new Error(body.error || "Delete failed");

            // remove the corresponding .table-r in every column (use rowIndex)
            nameRows[rowIndex]?.remove();
            emailRows[rowIndex]?.remove();
            phoneRows[rowIndex]?.remove();
            actionRows[rowIndex]?.remove();

            // console.log("Id of issuer is: ", idOfIssuer);
            // console.log("cached issuers are before delete:", [...cachedIssuers]);

            // update your cached array
            cachedClients.splice(dataIndex, 1);
            // console.log("cached issuers are after delete:", cachedIssuers);
          } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete issuer: " + err.message);
          }
        }
      }
    });

    closeModalAndNoDelete.addEventListener("click", () => {
      modalActive.classList.remove("show-delete");
    });
  });
}

// Edit Issuers
export async function editCompanie(clientType) {
  document.addEventListener("click", async (e) => {
    if (clientType === "issuer") {
      const btn = e.target.closest(".issuer-edit");
      if (!btn) return; // not an edit click

      const btns = Array.from(document.querySelectorAll(".issuer-edit"));
      const modalActive = document.querySelector(".modal-overlay-edit");
      const modalClose = document.querySelector(".edit-modal-close");
      const selectNameOfIssuer = document.querySelector(
        ".modal-overlay-edit h2"
      );
      const submitEdit = document.querySelector(".edit-modal-submit");

      modalActive.classList.add("show-edit");

      // find btn index - btn index is the same index for cachedIssuers
      const btnIndex = btns.indexOf(btn);

      // Display name of the issuer in the modal
      selectNameOfIssuer.textContent = cachedIssuers?.[btnIndex]?.name;
      if (!selectNameOfIssuer) {
        console.error("No cached issuer found for index", btnIndex);
        return;
      }

      const editId = cachedIssuers[btnIndex].id;

      // Clean old event listener if modal reused
      submitEdit.replaceWith(submitEdit.cloneNode(true));
      const newSubmitEdit = document.querySelector(".edit-modal-submit");

      newSubmitEdit.addEventListener("click", async (e) => {
        e.preventDefault();

        const formEdit = document.querySelector(".form-edit");

        // collect form data
        const formData = new FormData(formEdit);
        const data = Object.fromEntries(formData.entries());

        try {
          const response = await fetch(
            `http://127.0.0.1:8000/editissuer/${editId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }
          );

          const result = await response.json();

          if (!response.ok) {
            alert(result.error || "Update failed!");
            return;
          }

          alert("Issuer updated successfully!");
          modalActive.classList.remove("show-edit");

          cachedIssuers = null;
          await fetchCompanyesFromApi(clientType); // refresh data
          await loadCompaniesToUi(clientType);
          await loadCompanieDataToModal(clientType);

          formEdit.reset();
        } catch (error) {
          console.error("Error updating issuer:", err);
        }
      });

      modalClose.addEventListener("click", () => {
        modalActive.classList.remove("show-edit");
      });
    } else if (clientType === "client") {
      const btn = e.target.closest(".client-edit");
      if (!btn) return; // not an edit click

      const btns = Array.from(document.querySelectorAll(".client-edit"));
      const modalActive = document.querySelector(".modal-overlay-edit");
      const modalClose = document.querySelector(".edit-modal-close");
      const selectNameOfClient = document.querySelector(
        ".modal-overlay-edit h2"
      );
      const submitEdit = document.querySelector(".edit-modal-submit");

      modalActive.classList.add("show-edit");

      // find btn index - btn index is the same index for cachedIssuers
      const btnIndex = btns.indexOf(btn);

      // Display name of the issuer in the modal
      selectNameOfClient.textContent = cachedClients?.[btnIndex]?.name;
      if (!selectNameOfClient) {
        console.error("No cached client found for index", btnIndex);
        return;
      }

      const editId = cachedClients[btnIndex].id;

      // Clean old event listener if modal reused
      submitEdit.replaceWith(submitEdit.cloneNode(true));
      const newSubmitEdit = document.querySelector(".edit-modal-submit");

      newSubmitEdit.addEventListener("click", async (e) => {
        e.preventDefault();

        const formEdit = document.querySelector(".form-edit");

        // collect form data
        const formData = new FormData(formEdit);
        const data = Object.fromEntries(formData.entries());

        try {
          const response = await fetch(
            `http://127.0.0.1:8000/editclient/${editId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }
          );

          const result = await response.json();

          if (!response.ok) {
            alert(result.error || "Update failed!");
            return;
          }

          alert("Issuer updated successfully!");
          modalActive.classList.remove("show-edit");

          cachedClients = null;
          await fetchCompanyesFromApi(clientType); // refresh data
          await loadCompaniesToUi(clientType);
          await loadCompanieDataToModal(clientType);

          formEdit.reset();
        } catch (error) {
          console.error("Error updating issuer:", err);
        }
      });

      modalClose.addEventListener("click", () => {
        modalActive.classList.remove("show-edit");
      });
    }
  });
}
