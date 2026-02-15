// ========== INTERFACE DE BOLETOS ==========
function atualizarTabelaBoletos(boletosLista) {
    console.log('Atualizando tabela de boletos...');

    const tbody = document.getElementById('listaBoletos');
    if (!tbody) {
        console.error('Tabela de boletos não encontrada!');
        return;
    }

    tbody.innerHTML = '';

    if (boletosLista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: var(--cinza-texto);">
                    <i class="fas fa-search"></i> Nenhum boleto encontrado para os filtros aplicados
                </td>
            </tr>
        `;
        return;
    }

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

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const vencimento = new Date(boleto.dataVencimento);
        vencimento.setHours(0, 0, 0, 0);
        const estaAtrasado = !boleto.dataPagamento && vencimento < hoje;

        row.innerHTML = `
            <td>
                <div style="font-weight: 500;">${boleto.fornecedorNome}</div>
            </td>
            <td>
                <div style="font-weight: 500;">${boleto.descricao}</div>
                ${boleto.observacao ? `<div style="font-size: 0.8rem; color: var(--cinza-texto);">${boleto.observacao}</div>` : ''}
            </td>
            <td>${vencimentoFormatado} ${estaAtrasado && boleto.status !== 'pago' ? '<i class="fas fa-exclamation-triangle" style="color: var(--vermelho-alerta); margin-left: 5px;"></i>' : ''}</td>
            <td>${pagamentoFormatado}</td>
            <td><span class="boleto-tag ${statusClasses[boleto.status]}">${boleto.status}</span></td>
            <td style="font-weight: 600; color: var(--vermelho-alerta);">${formatarMoeda(boleto.valor)}</td>
            <td>
                ${boleto.status !== 'pago' ? `
                    <button class="btn-boleto-action btn-boleto-pagar" data-id="${boleto.id}" title="Marcar como pago">
                        <i class="fas fa-check-circle"></i>
                    </button>
                ` : ''}
                <button class="btn-boleto-action btn-boleto-edit" data-id="${boleto.id}" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-boleto-action btn-boleto-delete" data-id="${boleto.id}" title="Excluir">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });

    tbody.querySelectorAll('.btn-boleto-pagar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            marcarComoPago(id);
        });
    });

    tbody.querySelectorAll('.btn-boleto-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            editarBoleto(id);
        });
    });

    tbody.querySelectorAll('.btn-boleto-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            excluirBoleto(id);
        });
    });
}

function atualizarBoletos() {
    console.log('=== ATUALIZANDO BOLETOS ===');

    const mesSelecionado = document.getElementById('filtroMesBoletos').value;
    const statusFiltro = document.getElementById('filtroStatusBoleto') ? document.getElementById('filtroStatusBoleto').value : 'todos';
    const fornecedorFiltro = document.getElementById('filtroFornecedorBoleto') ? document.getElementById('filtroFornecedorBoleto').value : 'todos';

    let boletosFiltrados = boletos.filter(boleto => {
        const [anoVencimento, mesVencimento] = boleto.dataVencimento.split('-');
        const [anoFiltro, mesFiltro] = mesSelecionado.split('-');

        const filtroMes = anoVencimento === anoFiltro && mesVencimento === mesFiltro;
        const filtroStatus = statusFiltro === 'todos' || boleto.status === statusFiltro;

        let filtroFornecedor = true;
        if (fornecedorFiltro !== 'todos') {
            const fornecedorIdFiltro = parseInt(fornecedorFiltro);
            filtroFornecedor = boleto.fornecedorId === fornecedorIdFiltro;
        }

        return filtroMes && filtroStatus && filtroFornecedor;
    });

    boletosFiltrados.sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento));

    atualizarTabelaBoletos(boletosFiltrados);
    atualizarContadoresBoletos(boletosFiltrados);
}