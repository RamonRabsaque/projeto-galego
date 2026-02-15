// ========== SISTEMA DE LOGIN ==========
(function() {
    console.log('🚀 Inicializando sistema de autenticação...');
    
    // Aguardar DOM carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }
    
    function initAuth() {
        const telaLogin = document.getElementById('telaLogin');
        const header = document.querySelector('header');
        const container = document.querySelector('.container');
        const loginForm = document.getElementById('loginForm');
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        const loginMessage = document.getElementById('loginMessage');

        // Inicializar tema
        if (typeof inicializarTema === 'function') {
            inicializarTema();
        }

        // Configurar data atual
        const hoje = new Date();
        const hojeFormatada = hoje.toISOString().split('T')[0];
        const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;

        // Configurar datas nos filtros
        if (document.getElementById('filtroData')) {
            document.getElementById('filtroData').value = hojeFormatada;
        }
        if (document.getElementById('gastoData')) {
            document.getElementById('gastoData').value = hojeFormatada;
        }
        if (document.getElementById('filtroMesGastos')) {
            document.getElementById('filtroMesGastos').value = mesAtual;
        }
        if (document.getElementById('filtroMesRelatorio')) {
            document.getElementById('filtroMesRelatorio').value = mesAtual;
        }
        if (document.getElementById('filtroMesBoletos')) {
            document.getElementById('filtroMesBoletos').value = mesAtual;
        }

        // Mostrar/esconder senha
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
        }

        // Verificar se já está logado
        const usuarioLogado = localStorage.getItem('usuarioLogado');
        if (usuarioLogado) {
            try {
                const user = JSON.parse(usuarioLogado);
                if (user && user.ativo) {
                    window.usuarioAtual = user;
                    mostrarTelaAposLogin(user);
                    return;
                }
            } catch (e) {
                localStorage.removeItem('usuarioLogado');
            }
        }

        // Processar login
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();

                const username = document.getElementById('username').value.trim();
                const password = document.getElementById('password').value.trim();

                console.log('🔐 Tentando login com:', username);

                if (username === '' || password === '') {
                    showLoginMessage('Por favor, preencha todos os campos.', 'error');
                    return;
                }

                // Usar o sistema de usuários do ADMIN
                if (typeof loginComAdmin === 'function') {
                    const result = loginComAdmin(username, password);
                    
                    if (result.success) {
                        showLoginMessage('Login realizado com sucesso!', 'success');
                        window.usuarioAtual = result.user;

                        // Salvar usuário logado
                        localStorage.setItem('usuarioLogado', JSON.stringify(result.user));

                        // Verificar botão admin imediatamente
                        if (typeof verificarBotaoAdmin === 'function') {
                            verificarBotaoAdmin();
                        }

                        setTimeout(() => {
                            telaLogin.style.opacity = '0';
                            telaLogin.style.transform = 'scale(0.95)';

                            setTimeout(() => {
                                telaLogin.style.display = 'none';
                                if (header) header.style.display = 'flex';
                                if (container) container.style.display = 'flex';

                                // Mostrar info do usuário
                                if (typeof mostrarInfoUsuario === 'function') {
                                    mostrarInfoUsuario(result.user);
                                }

                                if (typeof initSystem === 'function') {
                                    initSystem();
                                }
                                
                                if (typeof mostrarTela === 'function') {
                                    mostrarTela('vendas');
                                }

                                if (typeof mostrarMensagem === 'function') {
                                    mostrarMensagem(`Bem-vindo, ${result.user.nome}!`, 'success');
                                }
                            }, 300);
                        }, 800);
                    } else {
                        showLoginMessage('Usuário ou senha incorretos.', 'error');
                    }
                } else {
                    // Fallback para o login antigo (caso admin.js não tenha carregado)
                    if (username === 'admin@matutinho.com' && password === '123456') {
                        showLoginMessage('Login realizado com sucesso!', 'success');
                        
                        window.usuarioAtual = {
                            id: 1,
                            nome: 'Administrador',
                            email: 'admin@matutinho.com',
                            tipo: 'admin',
                            ativo: true
                        };

                        localStorage.setItem('usuarioLogado', JSON.stringify(window.usuarioAtual));

                        setTimeout(() => {
                            telaLogin.style.opacity = '0';
                            telaLogin.style.transform = 'scale(0.95)';

                            setTimeout(() => {
                                telaLogin.style.display = 'none';
                                if (header) header.style.display = 'flex';
                                if (container) container.style.display = 'flex';

                                if (typeof initSystem === 'function') {
                                    initSystem();
                                }
                                
                                if (typeof mostrarTela === 'function') {
                                    mostrarTela('vendas');
                                }

                                if (typeof mostrarMensagem === 'function') {
                                    mostrarMensagem('Bem-vindo, Administrador!', 'success');
                                }
                            }, 300);
                        }, 800);
                    } else {
                        showLoginMessage('Usuário ou senha incorretos.', 'error');
                    }
                }
            });
        }

        function showLoginMessage(message, type) {
            if (!loginMessage) return;
            
            loginMessage.textContent = message;
            loginMessage.className = `login-message ${type}`;
            loginMessage.style.display = 'block';

            if (type === 'error') {
                setTimeout(() => {
                    loginMessage.style.display = 'none';
                }, 4000);
            }
        }
    }
})();

// ========== FUNÇÕES AUXILIARES ==========

// Função para mostrar info do usuário no menu
function mostrarInfoUsuario(user) {
    const menuButtons = document.querySelector('.menu-buttons');
    if (!menuButtons) return;
    
    // Remover info antiga se existir
    const infoAntiga = document.querySelector('.user-info');
    if (infoAntiga) infoAntiga.remove();

    // Criar elemento de info com CSS melhorado
    const userInfo = document.createElement('span');
    userInfo.className = 'user-info';
    userInfo.innerHTML = `
        <i class="fas fa-user-circle"></i> 
        ${user.nome} 
        <span class="badge ${user.tipo === 'admin' ? 'success' : 'info'}">${user.tipo}</span>
    `;
    
    // Adicionar no início do menu
    menuButtons.insertBefore(userInfo, menuButtons.firstChild);

    // Verificar botão admin
    if (typeof verificarBotaoAdmin === 'function') {
        verificarBotaoAdmin();
    }
}

// Função para mostrar tela após login
function mostrarTelaAposLogin(user) {
    window.usuarioAtual = user;
    
    const telaLogin = document.getElementById('telaLogin');
    const header = document.querySelector('header');
    const container = document.querySelector('.container');
    
    if (telaLogin) telaLogin.style.display = 'none';
    if (header) header.style.display = 'flex';
    if (container) container.style.display = 'flex';
    
    // Mostrar info do usuário
    mostrarInfoUsuario(user);
    
    // Verificar botão admin
    if (typeof verificarBotaoAdmin === 'function') {
        verificarBotaoAdmin();
    }
    
    // Inicializar sistema
    if (typeof initSystem === 'function') {
        initSystem();
    }
    
    // Mostrar tela de vendas
    if (typeof mostrarTela === 'function') {
        mostrarTela('vendas');
    }
    
    // Mensagem de boas-vindas
    if (typeof mostrarMensagem === 'function') {
        mostrarMensagem(`Bem-vindo de volta, ${user.nome}!`, 'success');
    }
}

// ========== BOTÃO SAIR - VERSÃO CORRIGIDA ==========
(function() {
    console.log('🔧 Configurando botão sair...');
    
    function configurarBotaoSair() {
        const btnSair = document.getElementById('btnSair');
        if (!btnSair) {
            setTimeout(configurarBotaoSair, 100);
            return;
        }
        
        // CLONAGEM RADICAL - remove TODOS os eventos anteriores
        const novoBtnSair = btnSair.cloneNode(true);
        btnSair.parentNode.replaceChild(novoBtnSair, btnSair);
        
        console.log('✅ Botão clonado - eventos antigos removidos!');
        
        // Adicionar UM ÚNICO evento
        novoBtnSair.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🔴 Logout solicitado');
            
            // CONFIRMAÇÃO ÚNICA
            if (confirm('Deseja realmente sair do sistema?')) {
                console.log('👋 Realizando logout...');
                
                // Limpar dados do usuário
                window.usuarioAtual = null;
                localStorage.removeItem('usuarioLogado');
                localStorage.removeItem('supabase_user');
                
                // Esconder elementos do admin
                const btnAdmin = document.getElementById('btnAdmin');
                if (btnAdmin) btnAdmin.style.display = 'none';
                
                const userInfo = document.querySelector('.user-info');
                if (userInfo) userInfo.remove();
                
                // Voltar para tela de login
                const header = document.querySelector('header');
                const container = document.querySelector('.container');
                const telaLogin = document.getElementById('telaLogin');
                
                if (header) header.style.display = 'none';
                if (container) container.style.display = 'none';
                if (telaLogin) {
                    telaLogin.style.display = 'flex';
                    telaLogin.style.opacity = '1';
                    telaLogin.style.transform = 'scale(1)';
                }
                
                // Limpar formulário de login
                const loginForm = document.getElementById('loginForm');
                if (loginForm) loginForm.reset();
                
                const passwordInput = document.getElementById('password');
                if (passwordInput) passwordInput.type = 'password';
                
                const toggleBtn = document.getElementById('togglePassword');
                if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
                
                // Mensagem de saída
                if (typeof mostrarMensagem === 'function') {
                    mostrarMensagem('Sistema encerrado. Até logo!', 'info');
                }
            }
        });
        
        console.log('🎯 Botão sair configurado com ÚNICO evento!');
    }
    
    // Configurar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', configurarBotaoSair);
    } else {
        configurarBotaoSair();
    }
    
    // Observar mudanças no header (para quando fizer login)
    const observer = new MutationObserver(function() {
        setTimeout(configurarBotaoSair, 200);
    });
    
    const header = document.querySelector('header');
    if (header) {
        observer.observe(header, { attributes: true, attributeFilter: ['style'] });
    }
})();