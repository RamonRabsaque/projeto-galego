// ========== SISTEMA DE TEMA ==========
function inicializarTema() {
    console.log('Inicializando tema...');

    const temaSalvo = localStorage.getItem('temaMatutinhoAldeota');
    const preferenciaSistema = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
    const temaInicial = temaSalvo || preferenciaSistema;

    aplicarTema(temaInicial);

    const btnTema = document.getElementById('btnTema');
    if (btnTema) {
        btnTema.addEventListener('click', alternarTema);
        console.log('Botão de tema configurado');
    } else {
        console.error('Botão de tema não encontrado!');
    }
}

function alternarTema() {
    const temaAtual = document.documentElement.getAttribute('data-tema') || 'claro';
    const novoTema = temaAtual === 'claro' ? 'escuro' : 'claro';

    aplicarTema(novoTema);
    localStorage.setItem('temaMatutinhoAldeota', novoTema);

    const btnTema = document.getElementById('btnTema');
    if (btnTema) {
        const icon = btnTema.querySelector('i');
        const text = btnTema.querySelector('.tema-texto');

        if (novoTema === 'escuro') {
            icon.className = 'fas fa-sun';
            if (text) text.textContent = 'Claro';
            mostrarMensagem('Tema escuro ativado', 'info');
        } else {
            icon.className = 'fas fa-moon';
            if (text) text.textContent = 'Escuro';
            mostrarMensagem('Tema claro ativado', 'info');
        }
    }
}

function aplicarTema(tema) {
    document.documentElement.setAttribute('data-tema', tema);
    console.log('Tema aplicado:', tema);

    const btnTema = document.getElementById('btnTema');
    if (btnTema) {
        const icon = btnTema.querySelector('i');
        const text = btnTema.querySelector('.tema-texto');

        if (tema === 'escuro') {
            icon.className = 'fas fa-sun';
            if (text) text.textContent = 'Claro';
        } else {
            icon.className = 'fas fa-moon';
            if (text) text.textContent = 'Escuro';
        }
    }
}