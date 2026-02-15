// ========== AUTENTICAÇÃO SUPABASE ==========
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Iniciando sistema de autenticação...');
    
    const telaLogin = document.getElementById('telaLogin');
    const header = document.querySelector('header');
    const container = document.querySelector('.container');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    
    // Verificar se já está logado
    const userSalvo = localStorage.getItem('supabase_user');
    if (userSalvo) {
        try {
            const user = JSON.parse(userSalvo);
            console.log('✅ Usuário já logado:', user.nome);
            
            // Verificar se o usuário ainda existe no banco
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', user.id)
                .eq('ativo', true)
                .single();
            
            if (data) {
                window.usuarioAtual = data;
                mostrarTelaAposLogin(data);
                return;
            }
        } catch (error) {
            console.error('❌ Sessão inválida:', error);
            localStorage.removeItem('supabase_user');
        }
    }

    // Configurar formulário de login
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('username').value.trim();
        const senha = document.getElementById('password').value.trim();

        if (!email || !senha) {
            showLoginMessage('Preencha todos os campos!', 'error');
            return;
        }

        showLoading(true);
        showLoginMessage('', 'info');
        
        const result = await SupabaseService.login(email, senha);
        
        showLoading(false);

        if (result.success) {
            showLoginMessage('Login realizado com sucesso!', 'success');
            window.usuarioAtual = result.user;
            
            setTimeout(() => {
                telaLogin.style.opacity = '0';
                telaLogin.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    telaLogin.style.display = 'none';
                    header.style.display = 'flex';
                    container.style.display = 'flex';
                    
                    initSystemSupabase();
                    mostrarMensagem(`Bem-vindo, ${result.user.nome}!`, 'success');
                }, 300);
            }, 500);
        } else {
            showLoginMessage(result.error, 'error');
        }
    });

    function showLoginMessage(message, type) {
        loginMessage.textContent = message;
        loginMessage.className = `login-message ${type}`;
        loginMessage.style.display = 'block';

        if (type === 'error') {
            setTimeout(() => {
                loginMessage.style.display = 'none';
            }, 4000);
        }
    }

    function showLoading(mostrar) {
        const btnLogin = document.getElementById('btnLogin');
        if (btnLogin) {
            if (mostrar) {
                btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
                btnLogin.disabled = true;
            } else {
                btnLogin.innerHTML = '<i class="fas fa-sign-in-alt"></i> Acessar Sistema';
                btnLogin.disabled = false;
            }
        }
    }
});

function mostrarTelaAposLogin(user) {
    window.usuarioAtual = user;
    
    document.getElementById('telaLogin').style.display = 'none';
    document.querySelector('header').style.display = 'flex';
    document.querySelector('.container').style.display = 'flex';
    
    // Mostrar info do usuário
    const menuButtons = document.querySelector('.menu-buttons');
    const userInfo = document.createElement('span');
    userInfo.className = 'user-info';
    userInfo.innerHTML = `<i class="fas fa-user-circle"></i> ${user.nome} (${user.tipo})`;
    menuButtons.insertBefore(userInfo, menuButtons.firstChild);
    
    // Se for admin, mostrar botão de admin
    if (user.tipo === 'admin') {
        const adminBtn = document.createElement('button');
        adminBtn.id = 'btnAdmin';
        adminBtn.innerHTML = '<i class="fas fa-users-cog"></i> Admin';
        adminBtn.onclick = mostrarPainelAdmin;
        menuButtons.appendChild(adminBtn);
    }
    
    initSystemSupabase();
}

// ========== PAINEL ADMIN ==========
async function mostrarPainelAdmin() {
    const usuarios = await SupabaseService.getUsuarios();
    
    // Criar modal admin
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modalAdmin';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3><i class="fas fa-users-cog"></i> Painel Administrativo</h3>
                <button class="modal-close" onclick="fecharModalAdmin()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <h4><i class="fas fa-user-plus"></i> Cadastrar Novo Usuário</h4>
                    <div style="display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                        <input type="text" id="novoNome" placeholder="Nome completo" class="form-control">
                        <input type="email" id="novoEmail" placeholder="E-mail" class="form-control">
                        <input type="password" id="novoSenha" placeholder="Senha" class="form-control">
                        <select id="novoTipo" class="form-control">
                            <option value="usuario">Usuário</option>
                            <option value="admin">Administrador</option>
                        </select>
                        <button onclick="cadastrarUsuario()" class="btn-primary">
                            <i class="fas fa-save"></i> Cadastrar
                        </button>
                    </div>
                </div>
                
                <h4><i class="fas fa-list"></i> Usuários Cadastrados</h4>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Tipo</th>
                                <th>Status</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${usuarios.map(u => `
                                <tr>
                                    <td>${u.nome}</td>
                                    <td>${u.email}</td>
                                    <td><span class="badge ${u.tipo === 'admin' ? 'success' : 'info'}">${u.tipo}</span></td>
                                    <td><span class="badge ${u.ativo ? 'success' : 'warning'}">${u.ativo ? 'Ativo' : 'Inativo'}</span></td>
                                    <td>${new Date(u.created_at).toLocaleDateString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="fecharModalAdmin()">
                    <i class="fas fa-times"></i> Fechar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function fecharModalAdmin() {
    const modal = document.getElementById('modalAdmin');
    if (modal) modal.remove();
}

async function cadastrarUsuario() {
    const nome = document.getElementById('novoNome').value;
    const email = document.getElementById('novoEmail').value;
    const senha = document.getElementById('novoSenha').value;
    const tipo = document.getElementById('novoTipo').value;
    
    if (!nome || !email || !senha) {
        mostrarMensagem('Preencha todos os campos!', 'error');
        return;
    }
    
    const result = await SupabaseService.cadastrarUsuario(nome, email, senha, tipo);
    
    if (result.success) {
        mostrarMensagem('Usuário cadastrado com sucesso!', 'success');
        fecharModalAdmin();
        setTimeout(mostrarPainelAdmin, 500);
    } else {
        mostrarMensagem('Erro ao cadastrar: ' + result.error, 'error');
    }
}