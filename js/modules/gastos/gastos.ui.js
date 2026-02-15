// ========== INTERFACE DE GASTOS ==========
function atualizarTabelaGastos(gastosLista) {
    console.log('Atualizando tabela de gastos...');

    const tbody = document.getElementById('listaGastos');
    if (!tbody) {
        console.error('Tabela de gastos não encontrada!');
        return;
    }

    tbody.innerHTML = '';

    if (gastosLista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--cinza-texto);">
                    <i class="fas fa-search"></i> Nenhum gasto encontrado
                </td>
            </tr>
        `;
        return;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    gastosLista.forEach(gasto => {
        const row = document.createElement('tr');

        const dataObj = new Date(gasto.data);
        const dataFormatada = dataObj.toLocaleDateString('pt-BR');

        const dataGasto = new Date(gasto.data);
        dataGasto.setHours(0, 0, 0, 0);
        const isDataPassada = dataGasto < hoje;

        const categoriasNomes = {
            'insumos': 'Insumos',
            'funcionarios': 'Funcionários',
            'aluguel': 'Aluguel',
            'manutencao': 'Manutenção',
            'marketing': 'Marketing',
            'outros': 'Outros'
        };

        const tipoClasses = {
            'fixo': 'fixo',
            'variavel': 'variavel',
            'emergencia': 'emergencia',
            'investimento': 'investimento'
        };

        row.innerHTML = `
            <td>
                ${dataFormatada}
                ${isDataPassada ? '<span class="badge-data-passada" title="Gasto registrado posteriormente"><i class="fas fa-history"></i> Retroativo</span>' : ''}
            </td>
            <td>
                <div style="font-weight: 500;">${gasto.descricao}</div>
                ${gasto.observacao ? `<div style="font-size: 0.8rem; color: var(--cinza-texto);">${gasto.observacao}</div>` : ''}
            </td>
            <td>${categoriasNomes[gasto.categoria] || gasto.categoria}</td>
            <td><span class="gasto-tag ${tipoClasses[gasto.tipo]}">${gasto.tipo}</span></td>
            <td style="font-weight: 600; color: var(--vermelho-alerta);">${formatarMoeda(gasto.valor)}</td>
            <td>
                <button class="btn-gasto-action btn-gasto-edit" data-id="${gasto.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-gasto-action btn-gasto-delete" data-id="${gasto.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });

    tbody.querySelectorAll('.btn-gasto-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            console.log('Editando gasto:', id);
            editarGasto(id);
        });
    });

    tbody.querySelectorAll('.btn-gasto-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            console.log('Excluindo gasto:', id);
            excluirGasto(id);
        });
    });

    console.log('Tabela de gastos atualizada com', gastosLista.length, 'itens');
}

function atualizarResumoGastos(gastosLista, mesSelecionado) {
    console.log('Atualizando resumo de gastos...');

    const totalMes = gastosLista.reduce((total, gasto) => total + gasto.valor, 0);
    const totalGastosMes = document.getElementById('totalGastosMes');
    if (totalGastosMes) {
        totalGastosMes.textContent = formatarMoeda(totalMes);
    }

    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

    const gastosUltimosMeses = gastos.filter(gasto => {
        const dataGasto = new Date(gasto.data);
        return dataGasto >= seisMesesAtras;
    });

    const gastosPorMes = {};
    gastosUltimosMeses.forEach(gasto => {
        const [ano, mes] = gasto.data.substring(0, 7).split('-');
        const chave = `${ano}-${mes}`;
        if (!gastosPorMes[chave]) gastosPorMes[chave] = 0;
        gastosPorMes[chave] += gasto.valor;
    });

    const valoresMensais = Object.values(gastosPorMes);
    const mediaMensal = valoresMensais.length > 0 ?
        valoresMensais.reduce((a, b) => a + b, 0) / valoresMensais.length : 0;

    const mediaGastosMensal = document.getElementById('mediaGastosMensal');
    if (mediaGastosMensal) {
        mediaGastosMensal.textContent = formatarMoeda(mediaMensal);
    }

    const comparacao = mediaMensal > 0 ? ((totalMes - mediaMensal) / mediaMensal) * 100 : 0;
    const comparacaoTexto = comparacao >= 0 ?
        `${comparacao.toFixed(1)}% acima da média` :
        `${Math.abs(comparacao).toFixed(1)}% abaixo da média`;

    const comparacaoMedia = document.getElementById('comparacaoMedia');
    if (comparacaoMedia) {
        comparacaoMedia.textContent = comparacaoTexto;
    }

    const categorias = {};
    gastosLista.forEach(gasto => {
        if (!categorias[gasto.categoria]) categorias[gasto.categoria] = 0;
        categorias[gasto.categoria] += gasto.valor;
    });

    let maiorCategoria = '-';
    let maiorValor = 0;

    Object.entries(categorias).forEach(([categoria, valor]) => {
        if (valor > maiorValor) {
            maiorValor = valor;
            maiorCategoria = categoria;
        }
    });

    const categoriasNomes = {
        'insumos': 'Insumos',
        'funcionarios': 'Funcionários',
        'aluguel': 'Aluguel',
        'manutencao': 'Manutenção',
        'marketing': 'Marketing',
        'outros': 'Outros'
    };

    const maiorCategoriaElement = document.getElementById('maiorCategoria');
    const valorMaiorCategoriaElement = document.getElementById('valorMaiorCategoria');

    if (maiorCategoriaElement) {
        maiorCategoriaElement.textContent = categoriasNomes[maiorCategoria] || maiorCategoria;
    }

    if (valorMaiorCategoriaElement) {
        valorMaiorCategoriaElement.textContent = formatarMoeda(maiorValor);
    }

    const meta = 5000;
    const progresso = (totalMes / meta) * 100;
    const progressoMeta = document.getElementById('progressoMeta');
    if (progressoMeta) {
        progressoMeta.textContent = `${progresso.toFixed(1)}% utilizado`;
    }

    const [anoAtual, mesAtual] = mesSelecionado.split('-').map(Number);
    let mesAnterior = mesAtual - 1;
    let anoAnterior = anoAtual;

    if (mesAnterior < 1) {
        mesAnterior = 12;
        anoAnterior--;
    }

    const mesAnteriorStr = `${anoAnterior}-${String(mesAnterior).padStart(2, '0')}`;
    const gastosMesAnterior = gastos.filter(g => g.data.startsWith(mesAnteriorStr))
        .reduce((total, g) => total + g.valor, 0);

    let variacao = 0;
    if (gastosMesAnterior > 0) {
        variacao = ((totalMes - gastosMesAnterior) / gastosMesAnterior) * 100;
    }

    const variacaoTexto = variacao >= 0 ?
        `${variacao.toFixed(1)}% maior` :
        `${Math.abs(variacao).toFixed(1)}% menor`;

    const variacaoGastos = document.getElementById('variacaoGastos');
    if (variacaoGastos) {
        variacaoGastos.textContent = variacaoTexto;
    }

    console.log('Resumo de gastos atualizado');
}