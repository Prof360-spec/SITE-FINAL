import { showAlert } from './supabase-config.js';

// Funções de autenticação compartilhadas
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const toggleLoading = (isLoading, button, loader) => {
  if (isLoading) {
    button.disabled = true;
    loader.style.display = 'inline-block';
    button.querySelector('#btnText').textContent = 'Autenticando...';
  } else {
    button.disabled = false;
    loader.style.display = 'none';
    button.querySelector('#btnText').textContent = 'Entrar';
  }
};

export const handleAuthError = (error) => {
  console.error('Erro de autenticação:', error);
  
  if (error.message.includes('Invalid login credentials')) {
    showAlert('E-mail ou senha incorretos');
  } else if (error.message.includes('Network')) {
    showAlert('Problemas de conexão. Verifique sua internet.');
  } else {
    showAlert(`Erro: ${error.message}`);
  }
};

// Função de toggle de senha (deve ser global)
window.togglePassword = function() {
  const passwordInput = document.getElementById('password');
  passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
};