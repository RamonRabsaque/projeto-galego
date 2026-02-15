// ========== FUNÇÕES UTILITÁRIAS ==========
function formatarDataBrasileira(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function formatarDataInput(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${ano}-${mes}-${dia}`;
}

function formatarMoeda(valor) {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    return `R$ ${parseFloat(valor).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function gerarIdUnico() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function converterValorFormatadoParaNumero(valorTexto) {
    if (!valorTexto) return 0;

    let valor = valorTexto.toString().replace('R$', '').trim();
    if (!valor) return 0;

    valor = valor.replace(/\./g, '');
    valor = valor.replace(',', '.');

    const numero = parseFloat(valor);
    return isNaN(numero) ? 0 : numero;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function mostrarLoading(mostrar = true) {
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