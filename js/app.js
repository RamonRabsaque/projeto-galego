// ========== INICIALIZAÇÃO DO SISTEMA ==========
function initSystem() {
    console.log('=== INICIANDO SISTEMA ===');

    carregarDadosVendas();
    carregarDadosSaidas();
    carregarGastos();
    carregarFornecedores();
    carregarBoletos();

    configurarEventosMenu();
    configurarEventosVendas();
    configurarEventosGastos();
    configurarEventosBoletos();
    configurarEventosRelatorios();

    inicializarModalFornecedor();
    inicializarGraficosGastos();

    configurarDebounceFiltros();

    atualizarResumoVendas();
    atualizarSelectFornecedores();

    configurarMascarasValor();


    // 👇 ADICIONAR ESTA LINHA
    if (typeof initAdmin === 'function') {
        initAdmin();
    }

    inicializarModalFornecedor();
    inicializarGraficosGastos();

    configurarDebounceFiltros();

    atualizarResumoVendas();
    atualizarSelectFornecedores();

    configurarMascarasValor();

    console.log('=== SISTEMA INICIALIZADO ===');
    console.log('=== SISTEMA INICIALIZADO ===');
}

function configurarEventosMenu() {
    console.log('Configurando eventos do menu...');

    document.getElementById('btnVendas').addEventListener('click', () => {
        console.log('Clicou em Vendas');
        mostrarTela('vendas');
    });

    document.getElementById('btnGastos').addEventListener('click', () => {
        console.log('Clicou em Gastos');
        mostrarTela('gastos');
    });

    document.getElementById('btnRelatorios').addEventListener('click', () => {
        console.log('Clicou em Relatórios');
        mostrarTela('relatorios');
    });

    document.getElementById('btnBoletos').addEventListener('click', () => {
        console.log('Clicou em Boletos');
        mostrarTela('boletos');
    });

    document.getElementById('btnSair').addEventListener('click', () => {
        if (confirm('Deseja realmente sair do sistema?')) {
            mostrarMensagem('Saindo do sistema...', 'info');
            setTimeout(() => {
                document.querySelector('header').style.display = 'none';
                document.querySelector('.container').style.display = 'none';

                const telaLogin = document.getElementById('telaLogin');
                telaLogin.style.display = 'flex';
                telaLogin.style.opacity = '1';
                telaLogin.style.transform = 'scale(1)';

                document.getElementById('loginForm').reset();
                document.getElementById('password').type = 'password';
                document.getElementById('togglePassword').innerHTML = '<i class="fas fa-eye"></i>';
            }, 800);
        }
    });
}

function mostrarTela(tela) {
    console.log('Mostrando tela:', tela);

    document.querySelectorAll('.container > div').forEach(div => {
        div.style.display = 'none';
    });

    document.querySelectorAll('.menu-buttons button').forEach(btn => {
        btn.classList.remove('active');
    });

    const telaElement = document.getElementById(`tela${tela.charAt(0).toUpperCase() + tela.slice(1)}`);
    if (telaElement) {
        telaElement.style.display = 'block';
    }

    const botaoElement = document.getElementById(`btn${tela.charAt(0).toUpperCase() + tela.slice(1)}`);
    if (botaoElement) {
        botaoElement.classList.add('active');
    }

    if (tela === 'vendas') {
        atualizarResumoVendas();
        atualizarRelogio();
    } else if (tela === 'gastos') {
        atualizarGastos();
    } else if (tela === 'relatorios') {
        atualizarRelatorios();
    } else if (tela === 'boletos') {
        atualizarFornecedores();
        atualizarBoletos();
        atualizarSelectFornecedores();
    }
}

function configurarDebounceFiltros() {
    const filtroDataVendas = document.getElementById('filtroData');
    if (filtroDataVendas) {
        filtroDataVendas.addEventListener('input',
            debounce(atualizarResumoVendas, 500)
        );
    }

    const filtroMesGastos = document.getElementById('filtroMesGastos');
    if (filtroMesGastos) {
        filtroMesGastos.addEventListener('change',
            debounce(atualizarGastos, 300)
        );
    }

    const filtroMesBoletos = document.getElementById('filtroMesBoletos');
    if (filtroMesBoletos) {
        filtroMesBoletos.addEventListener('change',
            debounce(atualizarBoletos, 300)
        );
    }
}

// ========== INICIALIZAÇÃO GLOBAL ==========
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Carregado - Aguardando login...');
});

// ========== SISTEMA DE RELÓGIO ==========
function atualizarRelogio() {
    const relogioElemento = document.getElementById('relogio');
    if (relogioElemento) {
        const agora = new Date();
        const horas = agora.getHours().toString().padStart(2, '0');
        const minutos = agora.getMinutes().toString().padStart(2, '0');
        const segundos = agora.getSeconds().toString().padStart(2, '0');
        relogioElemento.textContent = `${horas}:${minutos}:${segundos}`;
    }
}

setInterval(atualizarRelogio, 1000);


// ========== DIAGNÓSTICO DO BOTÃO DE RELATÓRIO ==========
function diagnosticarBotaoRelatorio() {
    console.log('=== DIAGNÓSTICO DO BOTÃO DE RELATÓRIO ===');

    const btn = document.getElementById('btnRelatorioGastos');

    if (!btn) {
        console.error('❌ Botão NÃO EXISTE no DOM!');
        return;
    }

    console.log('✅ Botão ENCONTRADO!');
    console.log('📍 ID:', btn.id);
    console.log('📍 Classe:', btn.className);
    console.log('📍 Texto:', btn.innerText);
    console.log('📍 Visível:', window.getComputedStyle(btn).display !== 'none');
    console.log('📍 Opacidade:', window.getComputedStyle(btn).opacity);
    console.log('📍 Pointer Events:', window.getComputedStyle(btn).pointerEvents);
    console.log('📍 Z-Index:', window.getComputedStyle(btn).zIndex);
    console.log('📍 Position:', window.getComputedStyle(btn).position);
    console.log('📍 Disabled:', btn.disabled);

    // Forçar botão a ficar clicável
    btn.style.pointerEvents = 'auto';
    btn.style.cursor = 'pointer';
    btn.style.opacity = '1';
    btn.style.zIndex = '9999';
    btn.style.position = 'relative';
    btn.disabled = false;

    console.log('✅ Botão FORÇADO a ficar clicável!');
    console.log('=====================================');
}

// Executar diagnóstico quando a tela de gastos for aberta
function mostrarTela(tela) {
    console.log('Mostrando tela:', tela);

    document.querySelectorAll('.container > div').forEach(div => {
        div.style.display = 'none';
    });

    document.querySelectorAll('.menu-buttons button').forEach(btn => {
        btn.classList.remove('active');
    });

    const telaElement = document.getElementById(`tela${tela.charAt(0).toUpperCase() + tela.slice(1)}`);
    if (telaElement) {
        telaElement.style.display = 'block';
    }

    const botaoElement = document.getElementById(`btn${tela.charAt(0).toUpperCase() + tela.slice(1)}`);
    if (botaoElement) {
        botaoElement.classList.add('active');
    }

    if (tela === 'vendas') {
        atualizarResumoVendas();
        atualizarRelogio();
    } else if (tela === 'gastos') {
        atualizarGastos();

        // ========== ADICIONAR ESTA LINHA ==========
        setTimeout(diagnosticarBotaoRelatorio, 500); // Diagnóstico após 500ms
    } else if (tela === 'relatorios') {
        atualizarRelatorios();
    } else if (tela === 'boletos') {
        atualizarFornecedores();
        atualizarBoletos();
        atualizarSelectFornecedores();
    }
}







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

    // 👇 VERIFIQUE ESTA PARTE: Se for admin, mostrar botão de admin
    if (user.tipo === 'admin') {
        // Verificar se o botão já existe
        if (!document.getElementById('btnAdmin')) {
            const adminBtn = document.createElement('button');
            adminBtn.id = 'btnAdmin';
            adminBtn.innerHTML = '<i class="fas fa-users-cog"></i> Admin';
            adminBtn.onclick = mostrarPainelAdmin;
            adminBtn.style.backgroundColor = '#ffb800';
            adminBtn.style.color = '#5a0000';
            adminBtn.style.fontWeight = 'bold';
            menuButtons.appendChild(adminBtn);
        }
    }

    initSystemSupabase();
}