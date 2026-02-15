// ========== VARIÁVEIS DE EDIÇÃO ==========
let gastoEditando = null;

// ========== FUNÇÕES AUXILIARES DE GASTOS ==========
function verificarDataPassada(dataSelecionada) {
    const hoje = new Date();
    const dataSelecionadaObj = new Date(dataSelecionada);

    const indicadorAntigo = document.querySelector('.data-passada-indicator');
    if (indicadorAntigo) {
        indicadorAntigo.remove();
    }

    if (dataSelecionadaObj < hoje) {
        const container = document.querySelector('.data-gasto-container');
        if (container) {
            const indicador = document.createElement('div');
            indicador.className = 'data-passada-indicator';
            indicador.innerHTML = `
                <i class="fas fa-history"></i>
                <span>Adicionando gasto em data passada</span>
            `;

            container.parentNode.insertBefore(indicador, container.nextSibling);
            mostrarMensagem('Você está adicionando um gasto em uma data passada. Isso atualizará os relatórios daquele período.', 'warning');
        }
    }
}

function validarDataFutura(dataInput) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSelecionada = new Date(dataInput);

    if (dataSelecionada > hoje) {
        mostrarMensagem('Não é possível registrar gastos com data futura!', 'error');
        return false;
    }
    return true;
}

function limparFormularioGasto() {
    console.log('Limpando formulário de gastos...');

    const form = document.getElementById('formGasto');
    if (form) {
        form.reset();

        const hoje = new Date();
        const hojeFormatada = hoje.toISOString().split('T')[0];
        document.getElementById('gastoData').value = hojeFormatada;

        const indicador = document.querySelector('.data-passada-indicator');
        if (indicador) {
            indicador.remove();
        }

        if (gastoEditando) {
            gastoEditando = null;
            const btnRegistrar = document.getElementById('btnRegistrarGasto');
            if (btnRegistrar) {
                btnRegistrar.innerHTML = '<i class="fas fa-save"></i> Registrar Gasto';
            }
        }
    }
}