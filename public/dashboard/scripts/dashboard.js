import { initSupabase } from '../../assets/js/supabase-config.js';

// Inicialização do Supabase
let supabase;

// Função para carregar dados do usuário
const loadUserData = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        if (user) {
            const avatarElement = document.getElementById('userAvatar');
            // Pega a primeira letra do email se não tiver nome
            const userInitial = user.email ? user.email[0].toUpperCase() : 'U';
            avatarElement.textContent = userInitial;
            
            // Atualiza o banner de boas-vindas se tiver nome
            if (user.user_metadata?.full_name) {
                const welcomeBanner = document.querySelector('.welcome-banner h2');
                welcomeBanner.textContent = `Bem-vindo(a) de volta, ${user.user_metadata.full_name.split(' ')[0]}!`;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
};

// Função para configurar a navegação entre abas
const setupTabsNavigation = () => {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove a classe 'active' de todas as abas
            tabs.forEach(t => t.classList.remove('active'));
            
            // Adiciona a classe 'active' apenas na aba clicada
            tab.classList.add('active');
            
            // Aqui você pode adicionar lógica para carregar o conteúdo da aba selecionada
            // Por enquanto só estamos simulando a navegação
        });
    });
};

// Função para logout
const setupLogout = () => {
    const avatarElement = document.getElementById('userAvatar');
    
    avatarElement.addEventListener('click', async () => {
        try {
            const { error } = await supabase.auth.signOut();
            
            if (error) throw error;
            
            window.location.href = '/auth/login.html';
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    });
};

// Inicialização da página
document.addEventListener('DOMContentLoaded', async () => {
    supabase = await initSupabase();
    
    if (supabase) {
        await loadUserData();
        setupTabsNavigation();
        setupLogout();
    } else {
        window.location.href = '/auth/login.html';
    }
});