// ========== VARIÁVEIS DE EDIÇÃO ==========
let boletoEditando = null;

// ========== FUNÇÕES AUXILIARES DE BOLETOS ==========
function atualizarStatusBoleto() {
    const dataVencimento = document.getElementById('boletoDataVencimento').value;
    const dataPagamento = document.getElementById('boletoDataPagamento').value;
    const statusSelect = document.getElementById('boletoStatus');

    if (!dataVencimento) return;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const vencimento = new Date(dataVencimento);
    vencimento.setHours(0, 0, 0, 0);

    if (dataPagamento) {
        statusSelect.value = 'pago';
    } else if (vencimento < hoje) {
        statusSelect.value = 'atrasado';
    } else {
        statusSelect.value = 'pendente';
    }
}

function limparFormularioBoleto() {
    console.log('Limpando formulário de boleto...');

    const form = document.getElementById('formBoleto');
    if (form) {
        form.reset();

        const hoje = new Date();
        document.getElementById('boletoDataVencimento').value = hoje.toISOString().split('T')[0];
        document.getElementById('boletoStatus').value = 'pendente';

        document.getElementById('pesquisaFornecedor').value = '';
        document.getElementById('resultadosPesquisa').style.display = 'none';

        if (boletoEditando) {
            boletoEditando = null;
            const btnRegistrar = document.getElementById('btnRegistrarBoleto');
            if (btnRegistrar) {
                btnRegistrar.innerHTML = '<i class="fas fa-save"></i> Registrar Boleto';
            }
        }
    }
}

function atualizarContadoresBoletos(boletosFiltrados) {
    const total = boletosFiltrados.length;
    const pendentes = boletosFiltrados.filter(b => b.status === 'pendente').length;
    const pagos = boletosFiltrados.filter(b => b.status === 'pago').length;
    const atrasados = boletosFiltrados.filter(b => b.status === 'atrasado').length;

    const contadorElement = document.getElementById('contadorBoletos');
    if (contadorElement) {
        contadorElement.textContent = `${total} boletos (${pendentes} pendentes, ${pagos} pagos, ${atrasados} atrasados)`;
    }
}