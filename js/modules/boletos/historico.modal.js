// ========== VARIÁVEIS DO MODAL ==========
let fornecedorSelecionado = null;

// ========== MODAL DE HISTÓRICO ==========
function inicializarModalFornecedor() {
    console.log('Inicializando modal do fornecedor...');

    const modal = document.getElementById('modalFornecedor');
    const btnClose = document.querySelector('.modal-close');
    const btnFechar = document.getElementById('btnFecharHistorico');

    if (!modal) {
        console.error('Modal não encontrado!');
        return;
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            fecharModalFornecedor();
        }
    });

    if (btnClose) {
        btnClose.addEventListener('click', fecharModalFornecedor);
    }

    if (btnFechar) {
        btnFechar.addEventListener('click', fecharModalFornecedor);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            fecharModalFornecedor();
        }
    });

    const btnExportar = document.getElementById('btnExportarHistorico');
    if (btnExportar) {
        btnExportar.addEventListener('click', exportarHistoricoCSV);
    }

    const filtroAno = document.getElementById('filtroAnoHistorico');
    const filtroStatus = document.getElementById('filtroStatusHistorico');

    if (filtroAno) {
        filtroAno.addEventListener('change', atualizarHistoricoFornecedor);
    }

    if (filtroStatus) {
        filtroStatus.addEventListener('change', atualizarHistoricoFornecedor);
    }
}

function abrirHistoricoFornecedor(fornecedorId, fornecedorNome) {
    console.log('Abrindo histórico do fornecedor:', fornecedorId, fornecedorNome);

    fornecedorSelecionado = fornecedores.find(f => f.id === fornecedorId);

    if (!fornecedorSelecionado) {
        mostrarMensagem('Fornecedor não encontrado!', 'error');
        return;
    }

    const modalNome = document.getElementById('modalFornecedorNome');
    if (modalNome) {
        modalNome.textContent = fornecedorNome;
    }

    carregarDadosHistorico(fornecedorId);

    const modal = document.getElementById('modalFornecedor');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    popularFiltroAnos(fornecedorId);
}

function fecharModalFornecedor() {
    const modal = document.getElementById('modalFornecedor');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        fornecedorSelecionado = null;
    }
}

function carregarDadosHistorico(fornecedorId) {
    if (!fornecedorId) return;

    const boletosFornecedor = boletos.filter(b => b.fornecedorId === fornecedorId);
    calcularEstatisticasFornecedor(boletosFornecedor);
    atualizarTabelaHistorico(boletosFornecedor);
}

function calcularEstatisticasFornecedor(boletosLista) {
    if (!boletosLista || boletosLista.length === 0) {
        document.getElementById('totalGastoFornecedor').textContent = 'R$ 0,00';
        document.getElementById('boletosPendentes').textContent = '0';
        document.getElementById('boletosPagos').textContent = '0';
        document.getElementById('mediaValorBoletos').textContent = 'R$ 0,00';
        document.getElementById('maiorBoleto').textContent = 'R$ 0,00';
        document.getElementById('menorBoleto').textContent = 'R$ 0,00';
        return;
    }

    const totalGasto = boletosLista.reduce((sum, b) => sum + b.valor, 0);
    document.getElementById('totalGastoFornecedor').textContent = formatarMoeda(totalGasto);

    const pendentes = boletosLista.filter(b => b.status === 'pendente').length;
    const pagos = boletosLista.filter(b => b.status === 'pago').length;
    const atrasados = boletosLista.filter(b => b.status === 'atrasado').length;

    document.getElementById('boletosPendentes').textContent = pendentes + atrasados;
    document.getElementById('boletosPagos').textContent = pagos;

    const valores = boletosLista.map(b => b.valor);
    const media = valores.reduce((a, b) => a + b, 0) / valores.length;
    const maior = Math.max(...valores);
    const menor = Math.min(...valores);

    document.getElementById('mediaValorBoletos').textContent = formatarMoeda(media);
    document.getElementById('maiorBoleto').textContent = formatarMoeda(maior);
    document.getElementById('menorBoleto').textContent = formatarMoeda(menor);
}

function atualizarTabelaHistorico(boletosLista) {
    const tbody = document.getElementById('tabelaHistoricoBoletos');
    if (!tbody) {
        console.error('Tabela de histórico não encontrada!');
        return;
    }

    tbody.innerHTML = '';

    if (!boletosLista || boletosLista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--cinza-texto);">
                    <i class="fas fa-search"></i> Nenhum boleto encontrado para este fornecedor
                </td>
            </tr>
        `;
        return;
    }

    boletosLista.sort((a, b) => new Date(b.dataVencimento) - new Date(a.dataVencimento));

    boletosLista.forEach(boleto => {
        const row = document.createElement('tr');

        const vencimentoFormatado = new Date(boleto.dataVencimento).toLocaleDateString('pt-BR');
        const pagamentoFormatado = boleto.dataPagamento ?
            new Date(boleto.dataPagamento).toLocaleDateString('pt-BR') : '-';

        const statusClasses = {
            'pendente': 'pendente',
            'pago': 'pago',
            'atrasado': 'atrasado'
        };

        row.innerHTML = `
            <td>
                <div style="font-weight: 500;">${boleto.descricao}</div>
                ${boleto.observacao ? `<div style="font-size: 0.8rem; color: var(--cinza-texto);">${boleto.observacao}</div>` : ''}
            </td>
            <td>${vencimentoFormatado}</td>
            <td>${pagamentoFormatado}</td>
            <td><span class="boleto-tag ${statusClasses[boleto.status]}">${boleto.status}</span></td>
            <td style="font-weight: 600; color: ${boleto.status === 'pago' ? 'var(--verde-sucesso)' : 'var(--vermelho-alerta)'};">${formatarMoeda(boleto.valor)}</td>
            <td>
                <button class="btn-boleto-action btn-boleto-edit" data-id="${boleto.id}" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });

    tbody.querySelectorAll('.btn-boleto-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            fecharModalFornecedor();
            setTimeout(() => editarBoleto(id), 300);
        });
    });
}

function popularFiltroAnos(fornecedorId) {
    const boletosFornecedor = boletos.filter(b => b.fornecedorId === fornecedorId);
    const anosSet = new Set();

    boletosFornecedor.forEach(boleto => {
        const ano = boleto.dataVencimento.split('-')[0];
        anosSet.add(ano);
    });

    const anosArray = Array.from(anosSet).sort((a, b) => b - a);
    const select = document.getElementById('filtroAnoHistorico');

    if (!select) return;

    const selecaoAtual = select.value;

    select.innerHTML = '<option value="todos">Todos os anos</option>';
    anosArray.forEach(ano => {
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        select.appendChild(option);
    });

    if (anosArray.includes(selecaoAtual)) {
        select.value = selecaoAtual;
    }
}

function atualizarHistoricoFornecedor() {
    if (!fornecedorSelecionado) return;

    const anoFiltro = document.getElementById('filtroAnoHistorico').value;
    const statusFiltro = document.getElementById('filtroStatusHistorico').value;

    let boletosFiltrados = boletos.filter(b => b.fornecedorId === fornecedorSelecionado.id);

    if (anoFiltro !== 'todos') {
        boletosFiltrados = boletosFiltrados.filter(b =>
            b.dataVencimento.startsWith(anoFiltro)
        );
    }

    if (statusFiltro !== 'todos') {
        boletosFiltrados = boletosFiltrados.filter(b =>
            b.status === statusFiltro
        );
    }

    calcularEstatisticasFornecedor(boletosFiltrados);
    atualizarTabelaHistorico(boletosFiltrados);
}