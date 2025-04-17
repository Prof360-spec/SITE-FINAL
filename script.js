// Configuração e Inicialização do Supabase
const initSupabase = async () => {
  const supabaseUrl = 'https://xbabcjiwyynnknmivceo.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiYWJjaml3eXlubmtubWl2Y2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDU2MzEsImV4cCI6MjA2MDQ4MTYzMX0.yQFxJMrNdQU2zxNjFHiQck6ISbEwsbaPYulZ7Mc-uvY';

  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    return createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Erro ao carregar Supabase:', error);
    showAlert('Erro crítico: Falha ao carregar recursos. Recarregue a página.');
    return null;
  }
};

// Variável global para a instância do Supabase
let supabase;

// ==================== FUNÇÕES PRINCIPAIS ====================
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
    window.location.href = 'dashboard.html';
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
      options: { redirectTo: window.location.origin + '/dashboard.html' }
    });
    if (error) throw error;
  } catch (error) {
    handleAuthError(error);
  }
};

// ==================== FUNÇÕES AUXILIARES ====================
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const toggleLoading = (isLoading, button, loader) => {
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

const handleAuthError = (error) => {
  console.error('Erro de autenticação:', error);
  
  if (error.message.includes('Invalid login credentials')) {
    showAlert('E-mail ou senha incorretos');
  } else if (error.message.includes('Network')) {
    showAlert('Problemas de conexão. Verifique sua internet.');
  } else {
    showAlert(`Erro: ${error.message}`);
  }
};

const showAlert = (message) => {
  const alertBox = document.createElement('div');
  alertBox.className = 'alert-message';
  alertBox.innerHTML = `
    ${message}
    <button onclick="this.parentElement.remove()">✕</button>
  `;
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 5000);
};

// ==================== INICIALIZAÇÃO SEGURA ====================
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Verifica conexão com internet
  if (!navigator.onLine) {
    showAlert('Você está offline. Conecte-se à internet.');
    return;
  }

  // 2. Inicializa Supabase
  supabase = await initSupabase();
  
  // 3. Configura eventos COM VERIFICAÇÕES
  const safeAddEventListener = (selector, event, handler) => {
    const element = document.querySelector(selector);
    if (element) {
      element.addEventListener(event, handler);
    } else {
      console.warn(`Elemento não encontrado: ${selector}`);
    }
  };

  if (supabase) {
    safeAddEventListener('#loginForm', 'submit', handleLogin);
    safeAddEventListener('#googleLoginBtn', 'click', loginWithGoogle);
    safeAddEventListener('.toggle-password', 'click', window.togglePassword);
    
    // Teste de conexão opcional
    try {
      const { error } = await supabase.from('users').select('*').limit(1);
      if (error) console.warn('Aviso: Teste de conexão falhou', error);
    } catch (testError) {
      console.error('Erro no teste de conexão:', testError);
    }
  }
});

// Função de toggle de senha (deve ser global)
window.togglePassword = function() {
  const passwordInput = document.getElementById('password');
  passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
};
