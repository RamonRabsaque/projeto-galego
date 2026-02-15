// ========== LÓGICA PRINCIPAL DE BOLETOS ==========
function configurarEventosBoletos() {
    console.log('Configurando eventos de boletos...');

    const formFornecedor = document.getElementById('formFornecedor');
    if (formFornecedor) {
        formFornecedor.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarFornecedor();
        });
    }

    const formBoleto = document.getElementById('formBoleto');
    if (formBoleto) {
        formBoleto.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarBoleto();
        });
    }

    const pesquisaInput = document.getElementById('pesquisaFornecedor');
    if (pesquisaInput) {
        pesquisaInput.addEventListener('input', function() {
            pesquisarFornecedor(this.value);
        });
    }

    const btnFiltrarBoletos = document.getElementById('btnFiltrarBoletos');
    if (btnFiltrarBoletos) {
        btnFiltrarBoletos.addEventListener('click', function() {
            atualizarBoletos();
        });
    }

    const filtroStatus = document.getElementById('filtroStatusBoleto');
    if (filtroStatus) {
        filtroStatus.addEventListener('change', function() {
            atualizarBoletos();
        });
    }

    const filtroFornecedor = document.getElementById('filtroFornecedorBoleto');
    if (filtroFornecedor) {
        filtroFornecedor.addEventListener('change', function() {
            atualizarBoletos();
        });
    }

    const filtroMesBoletos = document.getElementById('filtroMesBoletos');
    if (filtroMesBoletos) {
        filtroMesBoletos.addEventListener('change', function() {
            atualizarBoletos();
        });
    }

    const btnRelatorioBoletos = document.getElementById('btnRelatorioBoletos');
    if (btnRelatorioBoletos) {
        btnRelatorioBoletos.addEventListener('click', gerarRelatorioBoletos);
    }

    const dataVencimentoInput = document.getElementById('boletoDataVencimento');
    if (dataVencimentoInput) {
        const hoje = new Date();
        dataVencimentoInput.value = hoje.toISOString().split('T')[0];
    }

    const statusSelect = document.getElementById('boletoStatus');
    const dataVencimento = document.getElementById('boletoDataVencimento');
    const dataPagamento = document.getElementById('boletoDataPagamento');

    if (statusSelect && dataVencimento && dataPagamento) {
        dataVencimento.addEventListener('change', atualizarStatusBoleto);
        dataPagamento.addEventListener('change', atualizarStatusBoleto);
    }
}

function registrarBoleto() {
    console.log('Registrando boleto...');

    const fornecedorId = parseInt(document.getElementById('boletoFornecedor').value);
    const descricao = document.getElementById('boletoDescricao').value.trim();
    const valorTexto = document.getElementById('boletoValor').value.trim();
    const dataVencimento = document.getElementById('boletoDataVencimento').value;
    const dataPagamento = document.getElementById('boletoDataPagamento').value || "";
    const status = document.getElementById('boletoStatus').value;
    const observacao = document.getElementById('boletoObservacao').value.trim();

    const valor = converterValorFormatadoParaNumero(valorTexto);

    if (!fornecedorId || isNaN(fornecedorId) || !descricao || isNaN(valor) || valor <= 0 || !dataVencimento || !status) {
        mostrarMensagem('Por favor, preencha todos os campos obrigatórios corretamente.', 'error');
        return;
    }

    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
    if (!fornecedor) {
        mostrarMensagem('Fornecedor não encontrado!', 'error');
        return;
    }

    const novoBoleto = {
        id: boletoEditando ? boletoEditando.id : gerarIdUnico(),
        fornecedorId,
        fornecedorNome: fornecedor.nome,
        descricao,
        valor,
        dataVencimento,
        dataPagamento,
        status,
        observacao: observacao || ""
    };

    if (boletoEditando) {
        const index = boletos.findIndex(b => b.id === boletoEditando.id);
        if (index !== -1) {
            boletos[index] = novoBoleto;
            mostrarMensagem('Boleto atualizado com sucesso!', 'success');
        }
        boletoEditando = null;
        const btnRegistrar = document.getElementById('btnRegistrarBoleto');
        if (btnRegistrar) {
            btnRegistrar.innerHTML = '<i class="fas fa-save"></i> Registrar Boleto';
        }
    } else {
        boletos.push(novoBoleto);

        const vencimento = new Date(dataVencimento);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (vencimento < hoje && !dataPagamento) {
            mostrarMensagem(`Boleto de ${formatarMoeda(valor)} registrado para ${formatarDataBrasileira(vencimento)}! Status definido como atrasado.`, 'warning');
        } else {
            mostrarMensagem('Boleto registrado com sucesso!', 'success');
        }
    }

    salvarBoletos();
    atualizarBoletos();
    limparFormularioBoleto();
}

function editarBoleto(id) {
    console.log('Editando boleto:', id);

    const boleto = boletos.find(b => b.id === id);
    if (!boleto) {
        console.error('Boleto não encontrado:', id);
        return;
    }

    boletoEditando = boleto;

    document.getElementById('boletoFornecedor').value = boleto.fornecedorId;
    document.getElementById('pesquisaFornecedor').value = boleto.fornecedorNome;
    document.getElementById('boletoDescricao').value = boleto.descricao;
    document.getElementById('boletoValor').value = formatarMoeda(boleto.valor);
    document.getElementById('boletoDataVencimento').value = boleto.dataVencimento;
    document.getElementById('boletoDataPagamento').value = boleto.dataPagamento || '';
    document.getElementById('boletoStatus').value = boleto.status;
    document.getElementById('boletoObservacao').value = boleto.observacao || '';

    const btnRegistrar = document.getElementById('btnRegistrarBoleto');
    if (btnRegistrar) {
        btnRegistrar.innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
    }

    mostrarMensagem(`Editando: ${boleto.descricao}`, 'info');
}

function excluirBoleto(id) {
    console.log('Excluindo boleto:', id);

    const boleto = boletos.find(b => b.id === id);
    if (!boleto) {
        console.error('Boleto não encontrado:', id);
        return;
    }

    if (!confirm(`Excluir boleto "${boleto.descricao}" de ${formatarMoeda(boleto.valor)}?`)) return;

    boletos = boletos.filter(b => b.id !== id);
    salvarBoletos();
    atualizarBoletos();

    mostrarMensagem('Boleto excluído!', 'success');
}

function marcarComoPago(id) {
    console.log('Marcando boleto como pago:', id);

    const boleto = boletos.find(b => b.id === id);
    if (!boleto) {
        console.error('Boleto não encontrado:', id);
        return;
    }

    const hoje = new Date();
    const hojeFormatada = hoje.toISOString().split('T')[0];

    boleto.dataPagamento = hojeFormatada;
    boleto.status = 'pago';

    salvarBoletos();
    atualizarBoletos();

    mostrarMensagem(`Boleto "${boleto.descricao}" marcado como pago!`, 'success');
}