I want you to design an Admin Invoice Management Page for my existing web application using HTML and CSS only.

Please generate two files:

invoicesAdmin.html — the admin page where invoices can be created and managed.

invoiceAdmin.css — a new dedicated stylesheet for this page.

🔧 Requirements:

Integration context:

The app already has JavaScript logic for data handling (e.g., functions that fetch company, client, and invoice data, add new invoices, and update the UI).

You must design the structure and markup so that it is compatible with those existing JS functions — do not rename or break existing DOM IDs, classes, or event hooks.

For example, keep consistent use of class names like .form, .modal-overlay, .btn, .table-r, and other elements already used in the app.

The JavaScript logic will later populate data dynamically, so your HTML should contain proper placeholders and data containers (empty sections or divs with correct IDs).

Page purpose:

This is an admin interface for adding and viewing invoices.

It should include:

A form section for creating a new invoice (fields for client, date, due date, items, quantities, prices).

A table section or container where existing invoices will be listed dynamically.

A summary panel showing totals or recent invoice stats.

A modal (hidden by default) that will display invoice details when the admin clicks “View Details.”

Design style:

Follow the project’s existing design conventions — same fonts, color palette, spacing, and button styles.

Use semantic, responsive layout (grid or flexbox).

Keep a professional, clean admin dashboard feel consistent with the rest of the app.

Add comments in the HTML to indicate where existing JS functions will connect (e.g., “<!-- invoice form submit handled by addInvoice() -->”).

CSS file (invoice.css):

Match the existing UI system — reuse class patterns like .btn, .table-r, .modal-overlay, etc.

Add minimal new styles scoped only to the invoice page (e.g., .invoice-admin-container, .invoice-form, .invoice-table).

Ensure good spacing and alignment.

Make the layout responsive for both desktop and mobile screens.

Output format:

Provide both complete files: invoicesAdmin.html and invoiceAdmin.css.

Link the CSS properly inside the HTML <head>.

Include all necessary HTML structure (header, main content area, modals, footer).

Include explanatory comments in both files for integration clarity.

✅ Ensure your output is ready to integrate immediately into the existing project without breaking current logic or event listeners.
