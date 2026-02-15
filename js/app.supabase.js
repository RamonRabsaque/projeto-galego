// ========== INICIALIZAÇÃO DO SISTEMA COM SUPABASE ==========
let todasVendas = [];
let gastos = [];
let fornecedores = [];
let boletos = [];

async function initSystemSupabase() {
    console.log('🚀 INICIANDO SISTEMA COM SUPABASE');
    
    if (!window.usuarioAtual) {
        console.error('❌ Usuário não autenticado');
        return;
    }
    
    mostrarMensagem('Carregando dados do servidor...', 'info');
    
    await carregarDadosDoBanco();
    
    // Configurar eventos
    if (typeof configurarEventosMenu === 'function') configurarEventosMenu();
    if (typeof configurarEventosVendas === 'function') configurarEventosVendas();
    if (typeof configurarEventosGastos === 'function') configurarEventosGastos();
    if (typeof configurarEventosBoletos === 'function') configurarEventosBoletos();
    if (typeof configurarEventosRelatorios === 'function') configurarEventosRelatorios();
    
    // Inicializar componentes
    if (typeof inicializarModalFornecedor === 'function') inicializarModalFornecedor();
    if (typeof inicializarGraficosGastos === 'function') inicializarGraficosGastos();
    if (typeof configurarMascarasValor === 'function') configurarMascarasValor();
    
    configurarFiltros();
    
    // Mostrar tela inicial
    if (typeof mostrarTela === 'function') {
        mostrarTela('vendas');
    }
    
    console.log('✅ SISTEMA INICIALIZADO COM SUPABASE');
}

async function carregarDadosDoBanco() {
    const usuario_id = window.usuarioAtual.id;
    const hoje = new Date().toISOString().split('T')[0];
    const mesAtual = hoje.substring(0, 7);
    
    try {
        // Carregar dados do Supabase
        const [vendasData, gastosData, fornecedoresData, boletosData] = await Promise.all([
            SupabaseDataService.carregarVendas(usuario_id, hoje),
            SupabaseDataService.carregarGastos(usuario_id, mesAtual),
            SupabaseDataService.carregarFornecedores(usuario_id),
            SupabaseDataService.carregarBoletos(usuario_id, mesAtual)
        ]);
        
        todasVendas = vendasData;
        gastos = gastosData;
        fornecedores = fornecedoresData;
        boletos = boletosData;
        
        console.log('✅ Dados carregados do servidor:', {
            vendas: todasVendas.length,
            gastos: gastos.length,
            fornecedores: fornecedores.length,
            boletos: boletos.length
        });
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        mostrarMensagem('Erro ao carregar dados do servidor', 'error');
        
        // Fallback: tentar carregar do localStorage se existir
        carregarDadosVendas();
        carregarGastos();
        carregarFornecedores();
        carregarBoletos();
    }
}

function configurarFiltros() {
    // Filtro de data nas vendas
    const filtroData = document.getElementById('filtroData');
    if (filtroData) {
        filtroData.addEventListener('change', async function() {
            if (!window.usuarioAtual) return;
            const usuario_id = window.usuarioAtual.id;
            todasVendas = await SupabaseDataService.carregarVendas(usuario_id, this.value);
            if (typeof atualizarResumoVendas === 'function') atualizarResumoVendas();
        });
    }
    
    // Filtro de mês nos gastos
    const filtroMesGastos = document.getElementById('filtroMesGastos');
    if (filtroMesGastos) {
        filtroMesGastos.addEventListener('change', async function() {
            if (!window.usuarioAtual) return;
            const usuario_id = window.usuarioAtual.id;
            gastos = await SupabaseDataService.carregarGastos(usuario_id, this.value);
            if (typeof atualizarGastos === 'function') atualizarGastos();
        });
    }
    
    // Filtro de mês nos boletos
    const filtroMesBoletos = document.getElementById('filtroMesBoletos');
    if (filtroMesBoletos) {
        filtroMesBoletos.addEventListener('change', async function() {
            if (!window.usuarioAtual) return;
            const usuario_id = window.usuarioAtual.id;
            boletos = await SupabaseDataService.carregarBoletos(usuario_id, this.value);
            if (typeof atualizarBoletos === 'function') atualizarBoletos();
        });
    }
}

// Função para migrar dados do localStorage para o Supabase (opcional)
async function migrarDadosParaSupabase() {
    if (!window.usuarioAtual) {
        alert('Faça login primeiro');
        return;
    }
    
    const usuario_id = window.usuarioAtual.id;
    
    try {
        // Carregar dados do localStorage
        const vendasLocais = JSON.parse(localStorage.getItem('vendasMatutinhoAldeota') || '[]');
        const gastosLocais = JSON.parse(localStorage.getItem('gastosMatutinhoAldeota') || '[]');
        const fornecedoresLocais = JSON.parse(localStorage.getItem('fornecedoresMatutinhoAldeota') || '[]');
        const boletosLocais = JSON.parse(localStorage.getItem('boletosMatutinhoAldeota') || '[]');
        
        // Adicionar usuario_id a cada registro
        const vendasParaMigrar = vendasLocais.map(v => ({ ...v, usuario_id }));
        const gastosParaMigrar = gastosLocais.map(g => ({ ...g, usuario_id }));
        const fornecedoresParaMigrar = fornecedoresLocais.map(f => ({ ...f, usuario_id }));
        const boletosParaMigrar = boletosLocais.map(b => ({ ...b, usuario_id }));
        
        // Salvar no Supabase
        for (const venda of vendasParaMigrar) {
            await SupabaseDataService.salvarVenda(venda);
        }
        for (const gasto of gastosParaMigrar) {
            await SupabaseDataService.salvarGasto(gasto);
        }
        for (const fornecedor of fornecedoresParaMigrar) {
            await SupabaseDataService.salvarFornecedor(fornecedor);
        }
        for (const boleto of boletosParaMigrar) {
            await SupabaseDataService.salvarBoleto(boleto);
        }
        
        alert(`✅ Dados migrados com sucesso!`);
        
    } catch (error) {
        console.error('❌ Erro na migração:', error);
        alert('Erro ao migrar dados');
    }
}