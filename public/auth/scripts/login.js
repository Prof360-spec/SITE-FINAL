import { initSupabase } from '../../assets/js/supabase-config.js';
import { validateEmail, toggleLoading, handleAuthError } from '../../assets/js/auth.js';

let supabase;

const handleLogin = async (e) => {
  e.preventDefault();
  
  if (!supabase) {
    showAlert('Sistema não inicializado. Recarregue a página.');
    return;
  }

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const loginBtn = document.getElementById('loginBtn');
  const loader = document.getElementById('loader');

  // Validação
  if (!validateEmail(email)) {
    showAlert('Por favor, insira um e-mail válido');
    return;
  }

  // Mostra estado de carregamento
  toggleLoading(true, loginBtn, loader);

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) throw error;
    window.location.href = '/dashboard/';
  } catch (error) {
    handleAuthError(error);
  } finally {
    toggleLoading(false, loginBtn, loader);
  }
};

const loginWithGoogle = async () => {
  if (!supabase) {
    showAlert('Sistema não inicializado. Recarregue a página.');
    return;
  }

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard/' }
    });
    if (error) throw error;
  } catch (error) {
    handleAuthError(error);
  }
};

// Exportar funções para o escopo global
window.loginWithGoogle = loginWithGoogle;

document.addEventListener('DOMContentLoaded', async () => {
  if (!navigator.onLine) {
    showAlert('Você está offline. Conecte-se à internet.');
    return;
  }

  supabase = await initSupabase();
  
  const safeAddEventListener = (selector, event, handler) => {
    const element = document.querySelector(selector);
    if (element) {
      element.addEventListener(event, handler);
    }
  };

  if (supabase) {
    safeAddEventListener('#loginForm', 'submit', handleLogin);
  }
});