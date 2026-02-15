// ========== INTERFACE DE VENDAS ==========
function atualizarTabelaVendas(vendas) {
    console.log('Atualizando tabela de vendas...');

    const tbody = document.getElementById('tabelaVendas');
    if (!tbody) {
        console.error('Tabela de vendas não encontrada!');
        return;
    }

    tbody.innerHTML = '';

    if (vendas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: var(--cinza-texto);">
                    <i class="fas fa-search"></i> Nenhuma venda encontrada
                </td>
            </tr>
        `;
        return;
    }

    vendas.sort((a, b) => {
        if (a.hora < b.hora) return 1;
        if (a.hora > b.hora) return -1;
        return 0;
    });

    vendas.forEach(venda => {
        const row = document.createElement('tr');
        const turnoTexto = venda.turno === 'manha' ? 'Manhã' : 'Tarde';
        const badgeClass = venda.turno === 'manha' ? 'badge-manha' : 'badge-tarde';

        const pagamentoTexto = {
            'dinheiro': 'Dinheiro',
            'pix': 'Pix',
            'credito': 'Cartão Crédito',
            'debito': 'Cartão Débito'
        }[venda.formaPagamento] || venda.formaPagamento;

        row.innerHTML = `
            <td>${venda.hora}</td>
            <td><span class="${badgeClass}">${turnoTexto}</span></td>
            <td><strong>${formatarMoeda(venda.valor)}</strong></td>
            <td><span class="badge success">${pagamentoTexto}</span></td>
            <td>
                <button class="btn-acao-venda btn-editar-venda" data-id="${venda.id}" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-acao-venda btn-excluir-venda" data-id="${venda.id}" title="Excluir">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });

    tbody.querySelectorAll('.btn-editar-venda').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            editarVenda(id);
        });
    });

    tbody.querySelectorAll('.btn-excluir-venda').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            excluirVenda(id);
        });
    });
}

function atualizarTabelaSaidas(saidas) {
    console.log('Atualizando tabela de saídas...');

    const tbody = document.getElementById('tabelaSaidas');
    if (!tbody) {
        console.error('Tabela de saídas não encontrada!');
        return;
    }

    tbody.innerHTML = '';

    if (saidas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; padding: 2rem; color: var(--cinza-texto);">
                    <i class="fas fa-search"></i> Nenhuma saída encontrada
                </td>
            </tr>
        `;
        return;
    }

    saidas.forEach(saida => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${saida.descricao}</td>
            <td><strong style="color: var(--vermelho-alerta);">${formatarMoeda(saida.valor)}</strong></td>
            <td>${saida.dataFormatada || formatarDataBrasileira(new Date(saida.data))}</td>
        `;
        tbody.appendChild(row);
    });
}