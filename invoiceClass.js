export class invoice {
  constructor() {
    this.idInvoice = "";
    this.idIssuer = "";
    this.idClient = "";
    this.issuedDate = "";
    this.dueDate = "";
    this.leadTime = "";
    this.status = "";
    this.totalWithoutVat = "";
    this.totalVat = "";
    this.grandTotal = "";
  }

  hasEmptyFields() {
    // check if any field in the object array is empty
    return Object.values(this).some(
      (value) => value === undefined || value === null || value === ""
    );
  }
}
