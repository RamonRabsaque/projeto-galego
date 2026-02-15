// ========== PAINEL ADMIN ==========

// Array de usuários (inicialmente vazio)
let usuarios = [];

// Carregar usuários do localStorage ao iniciar
function carregarUsuarios() {
    const usuariosSalvos = localStorage.getItem('usuariosMatutinho');
    if (usuariosSalvos) {
        usuarios = JSON.parse(usuariosSalvos);
    } else {
        // Usuário padrão
        usuarios = [
            {
                id: 1,
                nome: 'Administrador',
                email: 'admin@matutinho.com',
                senha: '123456',
                tipo: 'admin',
                ativo: true
            }
        ];
        salvarUsuarios();
    }
    return usuarios;
}

// Salvar usuários no localStorage
function salvarUsuarios() {
    localStorage.setItem('usuariosMatutinho', JSON.stringify(usuarios));
}

// Mostrar painel admin
function mostrarPainelAdmin() {
    const modal = document.getElementById('modalAdmin');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        atualizarTabelaUsuarios();
    }
}

// Fechar painel admin
function fecharPainelAdmin() {
    const modal = document.getElementById('modalAdmin');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Atualizar tabela de usuários
function atualizarTabelaUsuarios() {
    const tbody = document.getElementById('listaUsuarios');
    if (!tbody) return;

    carregarUsuarios();

    if (usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-search"></i> Nenhum usuário cadastrado
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = usuarios.map(usuario => `
        <tr>
            <td>
                <div style="font-weight: 500;">${usuario.nome}</div>
                <div style="font-size: 0.8rem; color: var(--cinza-texto);">ID: ${usuario.id}</div>
            </td>
            <td>${usuario.email}</td>
            <td>
                <span class="badge ${usuario.tipo === 'admin' ? 'success' : 'info'}">
                    ${usuario.tipo === 'admin' ? 'Administrador' : 'Usuário'}
                </span>
            </td>
            <td>
                <span class="badge ${usuario.ativo ? 'success' : 'warning'}">
                    ${usuario.ativo ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button class="btn-acao-venda btn-editar-venda" onclick="editarUsuario(${usuario.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-acao-venda btn-excluir-venda" onclick="excluirUsuario(${usuario.id})" title="Excluir">
                    <i class="fas fa-trash-alt"></i>
                </button>
                ${!usuario.ativo ? `
                    <button class="btn-acao-venda btn-success" onclick="ativarUsuario(${usuario.id})" title="Ativar">
                        <i class="fas fa-check-circle"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// Cadastrar novo usuário
// ========== CADASTRAR USUÁRIO COM PROTEÇÃO ==========
function cadastrarUsuario() {
    const nome = document.getElementById('novoNome').value.trim();
    const email = document.getElementById('novoEmail').value.trim();
    const senha = document.getElementById('novoSenha').value.trim();
    const tipo = document.getElementById('novoTipo').value;

    // Validações básicas
    if (!nome || !email || !senha) {
        mostrarMensagem('Preencha todos os campos!', 'error');
        return;
    }

    // 🔒 PROTEÇÃO: Só o DONO pode criar ADMIN
    if (tipo === 'admin') {
        // Verificar se quem está criando é o dono (ex: admin@matutinho.com)
        if (!window.usuarioAtual || window.usuarioAtual.email !== 'admin@matutinho.com') {
            mostrarMensagem('Apenas o proprietário pode criar administradores!', 'error');
            return;
        }
    }

    // Verificar se email já existe
    carregarUsuarios();
    const emailExistente = usuarios.find(u => u.email === email);
    if (emailExistente) {
        mostrarMensagem('Este e-mail já está cadastrado!', 'error');
        return;
    }

    // Criar novo usuário
    const novoUsuario = {
        id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
        nome,
        email,
        senha,
        tipo,
        ativo: true
    };

    usuarios.push(novoUsuario);
    salvarUsuarios();

    // Limpar formulário
    document.getElementById('novoNome').value = '';
    document.getElementById('novoEmail').value = '';
    document.getElementById('novoSenha').value = '';
    document.getElementById('novoTipo').value = 'usuario';

    atualizarTabelaUsuarios();
    mostrarMensagem(`Usuário ${nome} cadastrado com sucesso!`, 'success');
}

// Editar usuário
function editarUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;

    // Preencher formulário com dados do usuário
    document.getElementById('novoNome').value = usuario.nome;
    document.getElementById('novoEmail').value = usuario.email;
    document.getElementById('novoSenha').value = usuario.senha;
    document.getElementById('novoTipo').value = usuario.tipo;

    // Mudar botão para "Atualizar"
    const btn = document.getElementById('btnCadastrarUsuario');
    btn.innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar Usuário';
    btn.onclick = function () { atualizarUsuario(id); };

    // Fechar modal? Não, só prepara o formulário
    mostrarMensagem(`Editando: ${usuario.nome}`, 'info');
}

// Atualizar usuário
function atualizarUsuario(id) {
    const nome = document.getElementById('novoNome').value.trim();
    const email = document.getElementById('novoEmail').value.trim();
    const senha = document.getElementById('novoSenha').value.trim();
    const tipo = document.getElementById('novoTipo').value;

    if (!nome || !email || !senha) {
        mostrarMensagem('Preencha todos os campos!', 'error');
        return;
    }

    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return;

    // Verificar se email já existe (exceto o próprio)
    const emailExistente = usuarios.find(u => u.email === email && u.id !== id);
    if (emailExistente) {
        mostrarMensagem('Este e-mail já está cadastrado!', 'error');
        return;
    }

    usuarios[index] = {
        ...usuarios[index],
        nome,
        email,
        senha,
        tipo
    };

    salvarUsuarios();

    // Resetar formulário
    document.getElementById('novoNome').value = '';
    document.getElementById('novoEmail').value = '';
    document.getElementById('novoSenha').value = '';
    document.getElementById('novoTipo').value = 'usuario';

    const btn = document.getElementById('btnCadastrarUsuario');
    btn.innerHTML = '<i class="fas fa-save"></i> Cadastrar Usuário';
    btn.onclick = cadastrarUsuario;

    atualizarTabelaUsuarios();
    mostrarMensagem('Usuário atualizado com sucesso!', 'success');
}

// Excluir usuário
function excluirUsuario(id) {
    if (id === 1) {
        mostrarMensagem('Não é possível excluir o administrador principal!', 'error');
        return;
    }

    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    usuarios = usuarios.filter(u => u.id !== id);
    salvarUsuarios();
    atualizarTabelaUsuarios();
    mostrarMensagem('Usuário excluído!', 'success');
}

// Ativar/Desativar usuário
function ativarUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
        usuario.ativo = !usuario.ativo;
        salvarUsuarios();
        atualizarTabelaUsuarios();
        mostrarMensagem(`Usuário ${usuario.ativo ? 'ativado' : 'desativado'}!`, 'success');
    }
}

// Modificar função de login para usar a lista de usuários
function loginComAdmin(email, senha) {
    carregarUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.senha === senha && u.ativo);

    if (usuario) {
        // Salvar usuário logado
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        return { success: true, user: usuario };
    }

    return { success: false, error: 'Usuário ou senha inválidos' };
}

// Inicializar eventos do admin
function initAdmin() {
    const btnAdmin = document.getElementById('btnAdmin');
    const btnFecharModal = document.getElementById('btnFecharModalAdmin');
    const btnFecharAdmin = document.getElementById('btnFecharAdmin');
    const btnCadastrar = document.getElementById('btnCadastrarUsuario');

    if (btnAdmin) {
        btnAdmin.addEventListener('click', mostrarPainelAdmin);
    }

    if (btnFecharModal) {
        btnFecharModal.addEventListener('click', fecharPainelAdmin);
    }

    if (btnFecharAdmin) {
        btnFecharAdmin.addEventListener('click', fecharPainelAdmin);
    }

    if (btnCadastrar) {
        btnCadastrar.addEventListener('click', cadastrarUsuario);
    }

    // Fechar modal clicando fora
    window.addEventListener('click', function (event) {
        const modal = document.getElementById('modalAdmin');
        if (event.target === modal) {
            fecharPainelAdmin();
        }
    });
}

// Exportar funções
window.mostrarPainelAdmin = mostrarPainelAdmin;
window.fecharPainelAdmin = fecharPainelAdmin;
window.cadastrarUsuario = cadastrarUsuario;
window.editarUsuario = editarUsuario;
window.excluirUsuario = excluirUsuario;
window.ativarUsuario = ativarUsuario;



// Função de login usando a lista de usuários
function loginComAdmin(email, senha) {
    carregarUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.senha === senha && u.ativo);

    if (usuario) {
        // Salvar usuário logado
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        return { success: true, user: usuario };
    }

    return { success: false, error: 'Usuário ou senha inválidos' };
}

// Garantir que a função está disponível globalmente
window.loginComAdmin = loginComAdmin;


// ========== VERIFICAR E MOSTRAR/ESCONDER BOTÃO ADMIN ==========
function verificarBotaoAdmin() {
    const btnAdmin = document.getElementById('btnAdmin');
    if (!btnAdmin) return;

    // Verificar se tem usuário logado
    if (!window.usuarioAtual) {
        btnAdmin.style.display = 'none';
        return;
    }

    // Só mostrar se for ADMIN
    if (window.usuarioAtual.tipo === 'admin') {
        btnAdmin.style.display = 'inline-flex';
        console.log('✅ Botão Admin visível para:', window.usuarioAtual.email);
    } else {
        btnAdmin.style.display = 'none';
        console.log('❌ Botão Admin oculto para:', window.usuarioAtual.email);
    }
}

// Chamar a função sempre que o usuário mudar
window.verificarBotaoAdmin = verificarBotaoAdmin;