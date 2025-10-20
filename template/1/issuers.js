const issuerDetailBtn = document.querySelectorAll(".issuer-detail");
const modalActive = document.querySelector(".modal-overlay");
const closeModal = document.querySelector("#close_modal");

for (const button of issuerDetailBtn) {
  button.addEventListener("click", () => {
    modalActive.classList.add("show");
  });
}

closeModal.addEventListener("click", () => {
  modalActive.classList.remove("show");
});
