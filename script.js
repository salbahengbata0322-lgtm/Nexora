"use strict";

const inventory = [
  { item: "Laptop", category: "IT Equipment", status: "In Stock", quantity: 12, value: 8400 },
  { item: "Monitor", category: "IT Equipment", status: "Low Stock", quantity: 3, value: 900 },
  { item: "Office Chair", category: "Furniture", status: "In Stock", quantity: 8, value: 1200 },
  { item: "Printer", category: "IT Equipment", status: "Out of Stock", quantity: 0, value: 0 },
  { item: "USB-C Cable", category: "Accessories", status: "In Stock", quantity: 25, value: 375 },
  { item: "Wireless Mouse", category: "Accessories", status: "Low Stock", quantity: 4, value: 180 },
  { item: "Standing Desk", category: "Furniture", status: "In Stock", quantity: 5, value: 2250 },
  { item: "Keyboard", category: "Accessories", status: "Out of Stock", quantity: 0, value: 0 }
];

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
  menuButton.querySelector(".sr-only").textContent = isOpen ? "Open navigation" : "Close navigation";
});

document.querySelectorAll(".primary-nav a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

const searchInput = document.getElementById("inventory-search");
const categoryFilter = document.getElementById("category-filter");
const statusFilter = document.getElementById("status-filter");
const inventoryBody = document.getElementById("inventory-body");
const emptyState = document.getElementById("empty-state");
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function statusClass(status) {
  return status === "In Stock" ? "in" : status === "Low Stock" ? "low" : "out";
}

function renderInventory() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const status = statusFilter.value;
  const filtered = inventory.filter(row =>
    (row.item.toLowerCase().includes(query) || row.category.toLowerCase().includes(query)) &&
    (category === "all" || row.category === category) &&
    (status === "all" || row.status === status)
  );

  inventoryBody.innerHTML = filtered.map(row => `
    <tr>
      <td>${row.item}</td>
      <td>${row.category}</td>
      <td><span class="status ${statusClass(row.status)}">${row.status}</span></td>
      <td>${row.quantity}</td>
      <td>${currency.format(row.value)}</td>
    </tr>`).join("");
  emptyState.hidden = filtered.length > 0;
}

[searchInput, categoryFilter, statusFilter].forEach(control => control.addEventListener("input", renderInventory));
renderInventory();

const form = document.getElementById("project-form");
const feedback = document.getElementById("form-feedback");
const message = form.elements.message;
const messageCount = document.getElementById("message-count");

message.addEventListener("input", () => { messageCount.textContent = message.value.length; });

function fieldMessage(field) {
  if (field.validity.valueMissing) return "This field is required.";
  if (field.validity.typeMismatch) return "Enter a valid email address.";
  if (field.validity.tooShort) return `Please enter at least ${field.minLength} characters.`;
  return "Please check this field.";
}

function showFieldState(field) {
  const error = field.closest("label")?.querySelector(".field-error");
  if (!error) return field.checkValidity();
  const valid = field.checkValidity();
  field.classList.toggle("invalid", !valid);
  field.setAttribute("aria-invalid", String(!valid));
  error.textContent = valid ? "" : fieldMessage(field);
  return valid;
}

form.querySelectorAll("input:not([type=checkbox]), select, textarea").forEach(field => {
  field.addEventListener("blur", () => showFieldState(field));
  field.addEventListener("input", () => { if (field.classList.contains("invalid")) showFieldState(field); });
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  const fields = [...form.querySelectorAll("input:not([type=checkbox]):not([type=hidden]), select, textarea")];
  const fieldsValid = fields.map(showFieldState).every(Boolean);
  const consent = form.elements.consent;
  const submitButton = form.querySelector('button[type="submit"]');
  if (!fieldsValid || !consent.checked) {
    feedback.className = "form-feedback error";
    feedback.textContent = consent.checked ? "Please correct the highlighted fields." : "Please agree that your information may be used to respond to your enquiry.";
    form.querySelector(":invalid")?.focus();
    return;
  }
  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");
  submitButton.innerHTML = 'Sending… <span aria-hidden="true">→</span>';
  feedback.className = "form-feedback";
  feedback.textContent = "";
  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString()
    });
    if (!response.ok) throw new Error("Submission failed");
    feedback.className = "form-feedback success";
    feedback.textContent = "Thank you for your enquiry. Your message has been submitted to Nexora Solutions. We’ll get back to you using the email address you provided.";
    form.reset();
    messageCount.textContent = "0";
    fields.forEach(field => {
      field.classList.remove("invalid");
      field.setAttribute("aria-invalid", "false");
      const error = field.closest("label")?.querySelector(".field-error");
      if (error) error.textContent = "";
    });
  } catch (error) {
    feedback.className = "form-feedback error";
    feedback.innerHTML = 'Your enquiry could not be submitted. Please try again or email <a href="mailto:Arllan_Guzman03@yahoo.com">Arllan_Guzman03@yahoo.com</a>.';
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
    submitButton.innerHTML = 'Send Enquiry <span aria-hidden="true">→</span>';
  }
});
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".primary-nav a")];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

document.getElementById("current-year").textContent = new Date().getFullYear();
