// ========== LÓGICA PRINCIPAL DE VENDAS ==========
function configurarEventosVendas() {
    console.log('Configurando eventos de vendas...');

    const btnAdicionarVenda = document.getElementById('btnAdicionarVenda');
    if (btnAdicionarVenda) {
        btnAdicionarVenda.addEventListener('click', adicionarVenda);
        console.log('Evento de adicionar venda configurado');
    }

    const btnAdicionarSaida = document.getElementById('btnAdicionarSaida');
    if (btnAdicionarSaida) {
        btnAdicionarSaida.addEventListener('click', adicionarSaida);
        console.log('Evento de adicionar saída configurado');
    }

    const btnGerarPDF = document.getElementById('btnGerarPDF');
    if (btnGerarPDF) {
        btnGerarPDF.addEventListener('click', gerarRelatorioPDF);
        console.log('Evento de gerar PDF configurado');
    }

    const filtroTurno = document.getElementById('filtroTurno');
    if (filtroTurno) {
        filtroTurno.addEventListener('change', atualizarResumoVendas);
        console.log('Evento de filtro de turno configurado');
    }
}

function adicionarVenda() {
    console.log('Adicionando venda...');

    const valorInput = document.getElementById('valorVenda');
    const formaPagamentoSelect = document.getElementById('formaPagamento');
    const turnoSelect = document.getElementById('turnoVenda');

    const valorTexto = valorInput.value.trim();
    const formaPagamento = formaPagamentoSelect.value;
    const turno = turnoSelect.value;

    let valor = converterValorFormatadoParaNumero(valorTexto);

    if (isNaN(valor) || valor <= 0) {
        mostrarMensagem('Por favor, insira um valor válido para a venda.', 'error');
        valorInput.focus();
        return;
    }

    if (!formaPagamento) {
        mostrarMensagem('Por favor, selecione a forma de pagamento.', 'error');
        formaPagamentoSelect.focus();
        return;
    }

    if (!turno) {
        mostrarMensagem('Por favor, selecione o turno.', 'error');
        turnoSelect.focus();
        return;
    }

    const agora = new Date();
    const dataSelecionada = document.getElementById('filtroData').value;

    const novaVenda = {
        id: vendaEditando ? vendaEditando.id : gerarIdUnico(),
        descricao: "Venda",
        valor: valor,
        data: dataSelecionada || formatarDataInput(agora),
        hora: `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`,
        formaPagamento: formaPagamento,
        turno: turno
    };

    if (vendaEditando) {
        const index = todasVendas.findIndex(v => v.id === vendaEditando.id);
        if (index !== -1) {
            todasVendas[index] = novaVenda;
            mostrarMensagem('Venda atualizada com sucesso!', 'success');
        }
        vendaEditando = null;
        document.getElementById('btnAdicionarVenda').innerHTML = '<i class="fas fa-check"></i> Registrar Venda';
    } else {
        todasVendas.push(novaVenda);
        mostrarMensagem(`Venda de ${formatarMoeda(novaVenda.valor)} registrada com sucesso!`, 'success');
    }

    salvarVendas();
    atualizarResumoVendas();

    valorInput.value = '';
    formaPagamentoSelect.value = '';
    turnoSelect.value = '';
}

function adicionarSaida() {
    console.log('Adicionando saída...');

    const valorInput = document.getElementById('valorSaida');
    const descricaoInput = document.getElementById('descricaoSaida');

    const valorTexto = valorInput.value.trim();
    const descricao = descricaoInput.value.trim();

    let valor = converterValorFormatadoParaNumero(valorTexto);

    if (isNaN(valor) || valor <= 0) {
        mostrarMensagem('Por favor, insira um valor válido para a saída.', 'error');
        valorInput.focus();
        return;
    }

    if (!descricao) {
        mostrarMensagem('Por favor, insira uma descrição para a saída.', 'error');
        descricaoInput.focus();
        return;
    }

    const agora = new Date();
    const dataSelecionada = document.getElementById('filtroData').value;

    const novaSaida = {
        id: gerarIdUnico(),
        descricao: descricao,
        valor: valor,
        data: dataSelecionada || formatarDataInput(agora),
        dataFormatada: formatarDataBrasileira(agora)
    };

    todasSaidas.push(novaSaida);
    salvarSaidas();
    atualizarResumoVendas();

    valorInput.value = '';
    descricaoInput.value = '';

    mostrarMensagem(`Saída de ${formatarMoeda(novaSaida.valor)} registrada com sucesso!`, 'success');
}

function editarVenda(id) {
    console.log('Editando venda:', id);

    const venda = todasVendas.find(v => v.id === id);
    if (!venda) return;

    vendaEditando = venda;

    document.getElementById('valorVenda').value = formatarMoeda(venda.valor);
    document.getElementById('formaPagamento').value = venda.formaPagamento;
    document.getElementById('turnoVenda').value = venda.turno;

    document.getElementById('btnAdicionarVenda').innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';

    mostrarMensagem(`Editando: ${formatarMoeda(venda.valor)}`, 'info');
}

function excluirVenda(id) {
    console.log('Excluindo venda:', id);

    const venda = todasVendas.find(v => v.id === id);
    if (!venda) return;

    if (!confirm(`Excluir venda de ${formatarMoeda(venda.valor)} do turno ${venda.turno === 'manha' ? 'Manhã' : 'Tarde'}?`)) return;

    todasVendas = todasVendas.filter(v => v.id !== id);
    salvarVendas();
    atualizarResumoVendas();

    mostrarMensagem('Venda excluída!', 'success');
}

function atualizarResumoVendas() {
    console.log('Atualizando resumo de vendas...');

    const dataSelecionada = document.getElementById('filtroData').value;
    const turnoFiltro = document.getElementById('filtroTurno') ? document.getElementById('filtroTurno').value : 'todos';

    let vendasFiltradas = todasVendas.filter(v => v.data === dataSelecionada);

    if (turnoFiltro !== 'todos') {
        vendasFiltradas = vendasFiltradas.filter(v => v.turno === turnoFiltro);
    }

    const saidasFiltradas = todasSaidas.filter(s => s.data === dataSelecionada);

    const totalVendas = vendasFiltradas.reduce((s, v) => s + v.valor, 0);
    const totalSaidas = saidasFiltradas.reduce((s, sda) => s + sda.valor, 0);
    const saldo = totalVendas - totalSaidas;

    const totalVendasDia = document.getElementById('totalVendasDia');
    const totalVendasCount = document.getElementById('totalVendasCount');
    const totalSaidasDia = document.getElementById('totalSaidasDia');
    const saldoDia = document.getElementById('saldoDia');

    if (totalVendasDia) totalVendasDia.textContent = formatarMoeda(totalVendas);
    if (totalVendasCount) totalVendasCount.textContent = vendasFiltradas.length;
    if (totalSaidasDia) totalSaidasDia.textContent = formatarMoeda(totalSaidas);
    if (saldoDia) saldoDia.textContent = formatarMoeda(saldo);

    const vendasManha = vendasFiltradas.filter(v => v.turno === 'manha');
    const vendasTarde = vendasFiltradas.filter(v => v.turno === 'tarde');

    const totalManha = vendasManha.reduce((s, v) => s + v.valor, 0);
    const totalTarde = vendasTarde.reduce((s, v) => s + v.valor, 0);

    const ticketManha = vendasManha.length > 0 ? totalManha / vendasManha.length : 0;
    const ticketTarde = vendasTarde.length > 0 ? totalTarde / vendasTarde.length : 0;

    const vendasManhaElement = document.getElementById('vendasManha');
    const qtdVendasManhaElement = document.getElementById('qtdVendasManha');
    const ticketManhaElement = document.getElementById('ticketManha');

    const vendasTardeElement = document.getElementById('vendasTarde');
    const qtdVendasTardeElement = document.getElementById('qtdVendasTarde');
    const ticketTardeElement = document.getElementById('ticketTarde');

    if (vendasManhaElement) vendasManhaElement.textContent = formatarMoeda(totalManha);
    if (qtdVendasManhaElement) qtdVendasManhaElement.textContent = vendasManha.length;
    if (ticketManhaElement) ticketManhaElement.textContent = formatarMoeda(ticketManha);

    if (vendasTardeElement) vendasTardeElement.textContent = formatarMoeda(totalTarde);
    if (qtdVendasTardeElement) qtdVendasTardeElement.textContent = vendasTarde.length;
    if (ticketTardeElement) ticketTardeElement.textContent = formatarMoeda(ticketTarde);

    atualizarTabelaVendas(vendasFiltradas);
    atualizarTabelaSaidas(saidasFiltradas);
}