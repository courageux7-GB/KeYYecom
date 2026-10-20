// app.js - Landing page logic for SQL Server 2025 license key

// Constants for localStorage keys
const KEY_STORAGE = "sqlserver2025_key";
const REVEALED_STORAGE = "sqlserver2025_key_revealed";

/**
 * Generate a random license key in the format XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
 * where each X is an uppercase alphanumeric character.
 */
function generateLicenseKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const groups = 5;
  const groupLength = 5;
  let key = "";
  for (let g = 0; g < groups; g++) {
    let part = "";
    for (let i = 0; i < groupLength; i++) {
      part += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    key += part;
    if (g < groups - 1) key += "-";
  }
  return key;
}

/**
 * Initialise the license key in localStorage if it does not already exist.
 */
function initLicenseKey() {
  // Use the provided fixed key
  const presetKey = "HX782-X7RHN-BVHGT-8HB24-2KGXG";
  // Store it if not already present (preserve existing for backward compatibility)
  if (!localStorage.getItem(KEY_STORAGE)) {
    localStorage.setItem(KEY_STORAGE, presetKey);
  }
}

/**
 * Show the modal overlay.
 */
function openModal() {
  document.getElementById("modalOverlay").classList.remove("hidden");
}

/**
 * Hide the modal overlay and reset temporary UI states.
 */
function closeModal() {
  const overlay = document.getElementById("modalOverlay");
  overlay.classList.add("hidden");
  // Reset copy button text/icon if it was changed
  const copyBtn = document.getElementById("copyBtn");
  copyBtn.innerHTML = `
    <svg class="icon icon-copy" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h8v8H8z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M6 6h8v8H6z" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`;
}

/**
 * Populate the modal based on whether the key has already been revealed.
 */
function populateModal() {
  const key = localStorage.getItem(KEY_STORAGE);
  const keyBox = document.getElementById("keyBox");
  const modalMessage = document.getElementById("modalMessage");

  // Always show the key
  const licenseKeyEl = document.getElementById("licenseKey");
  licenseKeyEl.textContent = key;
  keyBox.classList.remove("hidden");
  modalMessage.classList.add("hidden");

  // No longer set a revealed flag – the key can be shown on every click
}

/**
 * Copy the displayed license key to the clipboard and provide feedback.
 */
function copyKeyToClipboard() {
  const key = document.getElementById("licenseKey").textContent;
  if (!key) return;
  navigator.clipboard.writeText(key).then(() => {
    const copyBtn = document.getElementById("copyBtn");
    // Temporarily replace the icon with a text feedback
    copyBtn.innerHTML = "Copié !";
    setTimeout(() => {
      // Restore original SVG icon
      copyBtn.innerHTML = `
        <svg class="icon icon-copy" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h8v8H8z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M6 6h8v8H6z" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`;
    }, 2000);
  }).catch((err) => {
    console.error("Copy failed", err);
  });
}

/**
 * Attach all event listeners after DOM content is loaded.
 */
function attachEventListeners() {
  // Primary button to reveal key
  const revealBtn = document.getElementById("revealBtn");
  revealBtn.addEventListener("click", () => {
    populateModal();
    openModal();
  });

  // Close modal via dismiss (X) button
  document.getElementById("modalClose").addEventListener("click", closeModal);

  // Close modal via secondary "J'ai sauvegardé ma clé" button
  document.getElementById("savedBtn").addEventListener("click", closeModal);

  // Close modal when clicking on the overlay background (but not the modal itself)
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") {
      closeModal();
    }
  });

  // Copy button
  document.getElementById("copyBtn").addEventListener("click", copyKeyToClipboard);
}

// Initialise on page load
window.addEventListener("DOMContentLoaded", () => {
  initLicenseKey();
  attachEventListeners();
});
