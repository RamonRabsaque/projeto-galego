// ========== LÓGICA PRINCIPAL DE GASTOS ==========
// ========== LÓGICA PRINCIPAL DE GASTOS ==========
function configurarEventosGastos() {
    console.log('Configurando eventos de gastos...');

    const formGasto = document.getElementById('formGasto');
    if (formGasto) {
        formGasto.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulário de gastos submetido');
            registrarGasto();
        });
        console.log('✅ Evento de formulário de gastos configurado');
    }

    const btnFiltrar = document.getElementById('btnFiltrarGastos');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', function() {
            console.log('Filtrando gastos...');
            atualizarGastos();
        });
        console.log('✅ Evento de filtrar gastos configurado');
    }

    const filtroCategoria = document.getElementById('filtroCategoriaGastos');
    if (filtroCategoria) {
        filtroCategoria.addEventListener('change', function() {
            console.log('Categoria alterada:', this.value);
            atualizarGastos();
        });
    }

    const filtroTipo = document.getElementById('filtroTipoGasto');
    if (filtroTipo) {
        filtroTipo.addEventListener('change', function() {
            console.log('Tipo alterado:', this.value);
            atualizarGastos();
        });
    }

    // ========== CORREÇÃO DO BOTÃO DE RELATÓRIO ==========
    const btnRelatorio = document.getElementById('btnRelatorioGastos');
    if (btnRelatorio) {
        // Remover qualquer evento anterior
        btnRelatorio.replaceWith(btnRelatorio.cloneNode(true));
        
        // Pegar o novo botão (após o clone)
        const novoBtnRelatorio = document.getElementById('btnRelatorioGastos');
        
        // Garantir que o botão está habilitado e clicável
        novoBtnRelatorio.disabled = false;
        novoBtnRelatorio.style.pointerEvents = 'auto';
        novoBtnRelatorio.style.cursor = 'pointer';
        novoBtnRelatorio.style.opacity = '1';
        novoBtnRelatorio.style.zIndex = '999';
        novoBtnRelatorio.style.position = 'relative';
        
        // Adicionar o evento
        novoBtnRelatorio.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Botão de relatório de gastos CLICADO!');
            console.log('Mês selecionado:', document.getElementById('filtroMesGastos').value);
            console.log('Total de gastos:', gastos.length);
            
            // Chamar a função de gerar relatório
            gerarRelatorioGastos();
            
            return false;
        });
        
        console.log('✅ Botão de relatório de gastos configurado e ATIVO!');
    } else {
        console.error('❌ Botão de relatório de gastos NÃO ENCONTRADO!');
    }

    const btnDataHoje = document.getElementById('btnDataHoje');
    if (btnDataHoje) {
        btnDataHoje.addEventListener('click', function() {
            const hoje = new Date();
            const hojeFormatada = hoje.toISOString().split('T')[0];
            document.getElementById('gastoData').value = hojeFormatada;
            mostrarMensagem('Data definida para hoje!', 'info');
        });
        console.log('✅ Evento de data hoje configurado');
    }

    const gastoDataInput = document.getElementById('gastoData');
    if (gastoDataInput) {
        gastoDataInput.addEventListener('change', function() {
            verificarDataPassada(this.value);
        });
    }
}

function registrarGasto() {
    console.log('Registrando gasto...');

    const descricao = document.getElementById('gastoDescricao').value.trim();
    const valorTexto = document.getElementById('gastoValor').value.trim();
    const categoria = document.getElementById('gastoCategoria').value;
    const data = document.getElementById('gastoData').value;
    const tipo = document.getElementById('gastoTipo').value;
    const observacao = document.getElementById('gastoObservacao').value.trim();

    const valor = converterValorFormatadoParaNumero(valorTexto);

    if (!descricao || isNaN(valor) || valor <= 0 || !categoria || !data || !tipo) {
        mostrarMensagem('Por favor, preencha todos os campos corretamente.', 'error');
        return;
    }

    if (!validarDataFutura(data)) {
        return;
    }

    const novoGasto = {
        id: gastoEditando ? gastoEditando.id : gerarIdUnico(),
        descricao,
        valor,
        categoria,
        tipo,
        data,
        observacao
    };

    if (gastoEditando) {
        const index = gastos.findIndex(g => g.id === gastoEditando.id);
        if (index !== -1) {
            gastos[index] = novoGasto;
            mostrarMensagem('Gasto atualizado com sucesso!', 'success');
        }
        gastoEditando = null;
        const btnRegistrar = document.getElementById('btnRegistrarGasto');
        if (btnRegistrar) {
            btnRegistrar.innerHTML = '<i class="fas fa-save"></i> Registrar Gasto';
        }
    } else {
        gastos.push(novoGasto);

        const hoje = new Date();
        const dataGasto = new Date(data);
        if (dataGasto < hoje) {
            mostrarMensagem(`Gasto de ${formatarMoeda(valor)} registrado para ${formatarDataBrasileira(dataGasto)}! Os relatórios daquele período serão atualizados.`, 'success');
        } else {
            mostrarMensagem('Gasto registrado com sucesso!', 'success');
        }
    }

    salvarGastos();
    atualizarGastos();
    limparFormularioGasto();
}

function atualizarGastos() {
    console.log('=== ATUALIZANDO GASTOS ===');

    const mesSelecionado = document.getElementById('filtroMesGastos').value;
    const categoriaFiltro = document.getElementById('filtroCategoriaGastos') ? document.getElementById('filtroCategoriaGastos').value : 'todas';
    const tipoFiltro = document.getElementById('filtroTipoGasto') ? document.getElementById('filtroTipoGasto').value : 'todos';

    let gastosFiltrados = gastos.filter(gasto => {
        const [anoGasto, mesGasto] = gasto.data.split('-');
        const [anoFiltro, mesFiltro] = mesSelecionado.split('-');

        const filtroMes = anoGasto === anoFiltro && mesGasto === mesFiltro;
        const filtroCategoria = categoriaFiltro === 'todas' || gasto.categoria === categoriaFiltro;
        const filtroTipo = tipoFiltro === 'todos' || gasto.tipo === tipoFiltro;

        return filtroMes && filtroCategoria && filtroTipo;
    });

    gastosFiltrados.sort((a, b) => new Date(b.data) - new Date(a.data));

    atualizarTabelaGastos(gastosFiltrados);
    atualizarResumoGastos(gastosFiltrados, mesSelecionado);
    atualizarGraficosGastos(gastosFiltrados, mesSelecionado);
}

function editarGasto(id) {
    console.log('Editando gasto:', id);

    const gasto = gastos.find(g => g.id === id);
    if (!gasto) {
        console.error('Gasto não encontrado:', id);
        return;
    }

    gastoEditando = gasto;

    document.getElementById('gastoDescricao').value = gasto.descricao;
    document.getElementById('gastoValor').value = formatarMoeda(gasto.valor);
    document.getElementById('gastoCategoria').value = gasto.categoria;
    document.getElementById('gastoData').value = gasto.data;
    document.getElementById('gastoTipo').value = gasto.tipo;
    document.getElementById('gastoObservacao').value = gasto.observacao || '';

    const btnRegistrar = document.getElementById('btnRegistrarGasto');
    if (btnRegistrar) {
        btnRegistrar.innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
    }

    mostrarMensagem(`Editando: ${gasto.descricao}`, 'info');
}

function excluirGasto(id) {
    console.log('Excluindo gasto:', id);

    const gasto = gastos.find(g => g.id === id);
    if (!gasto) {
        console.error('Gasto não encontrado:', id);
        return;
    }

    if (!confirm(`Excluir "${gasto.descricao}" (${formatarMoeda(gasto.valor)})?`)) return;

    gastos = gastos.filter(g => g.id !== id);
    salvarGastos();
    atualizarGastos();

    mostrarMensagem('Gasto excluído!', 'success');
}