/*
  File: script.js
  Purpose:
    - Provides the interactive behavior for the Password Manager UI.
    - Responsibilities include: storing/retrieving passwords from localStorage, rendering the password list,
      handling add/edit/delete actions, showing the custom popup, and generating random passwords.

  Data shape in localStorage:
    - Key: "passwords"
    - Value: JSON.stringify(Array of objects)
      Example item: { website: "example.com", username: "user", password: "hunter2" }

  Main functions and responsibilities:
    - savePasswords(passwords): persist the passwords array
    - getPasswords(): return the stored passwords array
    - renderPasswords(): populate the DOM `#password-list` based on stored data
    - copyPassword(index), deletePassword(index), togglePassword(index)
    - showPopup(message, hasCancel, isEditing, index): custom modal for messages and edit prompts
    - generatePasswordString(length, opts): creates secure random password using window.crypto

  Tips for future modification:
    - If you rename DOM IDs in `index.html`, update the matching selectors here.
    - Improve security by encrypting stored values and avoid localStorage for real secrets.
    - Consider replacing the inline onclick attributes with event delegation for cleaner separation of concerns.
    - Add input validation and sanitization for `website`, `username`, and `password` fields.

*/

// Function to save passwords to localStorage
function savePasswords(passwords) {
  localStorage.setItem("passwords", JSON.stringify(passwords));
}

// Function to get passwords from localStorage
function getPasswords() {
  return JSON.parse(localStorage.getItem("passwords")) || [];
}

// Function to render passwords
function renderPasswords() {
  const passwordList = document.getElementById("password-list");
  const passwords = getPasswords();
  passwordList.innerHTML = "";

  passwords.forEach((item, index) => {
    const listItem = document.createElement("li");

    // Create a span for website, username, and password
    const passwordSpan = document.createElement("span");
    passwordSpan.innerHTML = `
        <strong>${item.website}</strong>: ${item.username}
        <span class="password" id="password-${index}">${"*".repeat(
      item.password.length
    )}</span>
        <i class="fas fa-eye show-password" onclick="togglePassword(${index})" title="Show/HidePassword"></i> 
        `;

    // Create a div for action buttons
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("actions");
    actionsDiv.innerHTML = `
        <i class="fas fa-copy" onclick="copyPassword(${index})" title="Copy"></i>
        <i class="fas fa-edit" onclick="promptEditPassword(${index})" title="Edit"></i>
        <i class="fas fa-trash-alt" onclick="confirmDelete(${index})" title="Delete"></i>
        `;

    // Append elements to list item
    listItem.appendChild(passwordSpan);
    listItem.appendChild(actionsDiv);
    passwordList.appendChild(listItem);
  });
}

// Function to add a new password
document.getElementById("add-btn").addEventListener("click", () => {
  const website = document.getElementById("website").value;
  const username = document.getElementById("username")
    ? document.getElementById("username").value
    : "";
  const password = document.getElementById("password").value;

  if (website && password) {
    const passwords = getPasswords();
    passwords.push({ website, username, password });
    savePasswords(passwords);
    renderPasswords();
    document.getElementById("website").value = "";
    if (document.getElementById("username"))
      document.getElementById("username").value = "";
    document.getElementById("password").value = "";
  } else {
    showPopup("Please fill in both fields.");
  }
});

// Function to copy a password
function copyPassword(index) {
  const passwords = getPasswords();
  navigator.clipboard.writeText(passwords[index].password);
  showPopup("Password copied to clipboard.");
}

// Function to show custom popup
function showPopup(
  message,
  hasCancel = false,
  isEditing = false,
  index = null
) {
  const popup = document.getElementById("custom-popup");
  const popupMessage = document.getElementById("popup-message");
  const popupInputContainer = document.getElementById("popup-input-container");
  const popupInput = document.getElementById("popup-input");

  popupMessage.textContent = message;
  popupInputContainer.classList.toggle("hidden", !isEditing);
  document
    .getElementById("popup-cancel")
    .classList.toggle("hidden", !hasCancel);

  if (isEditing && index !== null) {
    popupInput.value = getPasswords()[index].password;
  }

  popup.classList.remove("hidden");

  return new Promise((resolve) => {
    document.getElementById("popup-ok").onclick = () => {
      if (isEditing && index !== null) {
        const newPassword = popupInput.value;
        if (newPassword) {
          const passwords = getPasswords();
          passwords[index].password = newPassword;
          savePasswords(passwords);
          renderPasswords();
        } else {
          showPopup("Password cannot be empty.");
          return;
        }
      }
      popup.classList.add("hidden");
      resolve(true);
    };
    if (hasCancel) {
      document.getElementById("popup-cancel").onclick = () => {
        popup.classList.add("hidden");
        resolve(false);
      };
    }
  });
}

// Function to confirm deletion with custom popup
async function confirmDelete(index) {
  const confirmed = await showPopup(
    "Are you sure you want to delete this password?",
    true
  );
  if (confirmed) {
    deletePassword(index);
  }
}

// Function to prompt for editing a password
async function promptEditPassword(index) {
  await showPopup("Enter new password:", false, true, index);
}

// Function to delete a password
function deletePassword(index) {
  const passwords = getPasswords();
  passwords.splice(index, 1);
  savePasswords(passwords);
  renderPasswords();
}

// Function to toggle the visibility of the password
function togglePassword(index) {
  const passwordSpan = document.getElementById(`password-${index}`);
  const passwords = getPasswords();

  if (
    passwordSpan.textContent === "*".repeat(passwords[index].password.length)
  ) {
    passwordSpan.textContent = passwords[index].password;
  } else {
    passwordSpan.textContent = "*".repeat(passwords[index].password.length);
  }
}

// Initial render of passwords
renderPasswords();

// =====================
// Password generator
// =====================

function getRandomInt(max) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

function generatePasswordString(length, opts) {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}|;:,.<>?/`~";

  let pool = "";
  if (opts.lower) pool += lower;
  if (opts.upper) pool += upper;
  if (opts.numbers) pool += numbers;
  if (opts.symbols) pool += symbols;

  if (!pool) {
    // fallback to all
    pool = lower + upper + numbers + symbols;
  }

  let pwd = "";
  for (let i = 0; i < length; i++) {
    pwd += pool[getRandomInt(pool.length)];
  }
  return pwd;
}

document.getElementById("generate-btn").addEventListener("click", (e) => {
  const length = parseInt(document.getElementById("length").value, 10) || 16;
  const opts = {
    lower: document.getElementById("include-lower").checked,
    upper: document.getElementById("include-upper").checked,
    numbers: document.getElementById("include-numbers").checked,
    symbols: document.getElementById("include-symbols").checked,
  };

  const pwd = generatePasswordString(Math.min(Math.max(length, 4), 128), opts);
  document.getElementById("generated-password").value = pwd;
});

document.getElementById("copy-gen").addEventListener("click", () => {
  const txt = document.getElementById("generated-password").value;
  if (!txt) {
    showPopup("Generate a password first.");
    return;
  }
  navigator.clipboard.writeText(txt).then(() => {
    showPopup("Generated password copied to clipboard.");
  });
});
