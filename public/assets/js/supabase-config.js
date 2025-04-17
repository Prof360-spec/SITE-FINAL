// Configuração e Inicialização do Supabase
export const initSupabase = async () => {
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
  
  // Função auxiliar para exibir alertas
  export const showAlert = (message) => {
    const alertBox = document.createElement('div');
    alertBox.className = 'alert-message';
    alertBox.innerHTML = `
      ${message}
      <button onclick="this.parentElement.remove()">✕</button>
    `;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 5000);
  };