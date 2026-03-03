// admin/login.js — Supabase Auth integration (replaces mock login)

const form = document.getElementById('loginForm');
const messageEl = document.getElementById('message');
const emailInput = document.getElementById('username'); // HTML still calls it 'username' but we treat it as email
const passwordInput = document.getElementById('password');
let isLoggingIn = false;

if (!form || !messageEl || !emailInput || !passwordInput) {
  console.error('[LOGIN] Missing required DOM elements for login form');
} else {
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (isLoggingIn) return; // Prevent double-submit
  isLoggingIn = true;
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  if (!email || !password) {
    messageEl.textContent = '❌ Skriv inn e-post og passord';
    messageEl.style.color = '#dc2626';
    isLoggingIn = false;
    return;
  }

  messageEl.textContent = '⏳ Logger inn...';
  messageEl.style.color = '#666';

  try {
    // Try to sign in with existing account
    const { user, error } = await adminSignIn(email, password);

    if (error) {
      messageEl.textContent = `❌ ${error}`;
      messageEl.style.color = '#dc2626';
      isLoggingIn = false;
      return;
    }

    if (user) {
      messageEl.textContent = '✅ Innlogging vellykket!';
      messageEl.style.color = '#16a34a';
      
      // Redirect to dashboard after 1 second
      setTimeout(() => {
        location.href = './dashboard.html';
      }, 1000);
      return;
    }
  } catch (e) {
    messageEl.textContent = `❌ Feil: ${e.message}`;
    messageEl.style.color = '#dc2626';
  }

  isLoggingIn = false;
});
}

// Update label from "Brukernavn" to "E-post" for clarity
document.addEventListener('DOMContentLoaded', () => {
  const labels = document.querySelectorAll('label');
  labels.forEach(label => {
    if (label.getAttribute('for') === 'username') {
      label.textContent = 'E-post';
    }
  });
});

