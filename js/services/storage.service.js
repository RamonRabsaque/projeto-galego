// ========== VARIÁVEIS GLOBAIS DE DADOS ==========
let todasVendas = [];
let todasSaidas = [];
let gastos = [];
let fornecedores = [];
let boletos = [];

// ========== FUNÇÕES DE CARREGAMENTO ==========
// ========== FUNÇÕES DE CARREGAMENTO ==========
function carregarDadosVendas() {
    console.log('Carregando vendas...');
    const vendasSalvas = localStorage.getItem('vendasMatutinhoAldeota');
    if (vendasSalvas) {
        todasVendas = JSON.parse(vendasSalvas);
        console.log('Vendas carregadas:', todasVendas.length);
    } else {
        console.log('Nenhuma venda encontrada - iniciando vazio');
        todasVendas = [];  // COMEÇA VAZIO, sem exemplo
        // REMOVIDO: DatabaseExemplo.adicionarVendasExemplo();
    }
}

function carregarDadosSaidas() {
    console.log('Carregando saídas...');
    const saidasSalvas = localStorage.getItem('saidasMatutinhoAldeota');
    if (saidasSalvas) {
        todasSaidas = JSON.parse(saidasSalvas);
        console.log('Saídas carregadas:', todasSaidas.length);
    } else {
        todasSaidas = [];  // COMEÇA VAZIO
    }
}

function carregarGastos() {
    console.log('Carregando gastos...');
    const gastosSalvos = localStorage.getItem('gastosMatutinhoAldeota');
    if (gastosSalvos) {
        gastos = JSON.parse(gastosSalvos);
        console.log('Gastos carregados:', gastos.length);
    } else {
        console.log('Nenhum gasto encontrado - iniciando vazio');
        gastos = [];  // COMEÇA VAZIO
        // REMOVIDO: DatabaseExemplo.adicionarGastosExemplo();
    }
}

function carregarFornecedores() {
    console.log('Carregando fornecedores...');
    const fornecedoresSalvos = localStorage.getItem('fornecedoresMatutinhoAldeota');
    if (fornecedoresSalvos) {
        fornecedores = JSON.parse(fornecedoresSalvos);
        console.log('Fornecedores carregados:', fornecedores.length);
    } else {
        console.log('Nenhum fornecedor encontrado - iniciando vazio');
        fornecedores = [];  // COMEÇA VAZIO
        // REMOVIDO: DatabaseExemplo.adicionarFornecedoresExemplo();
    }
}

function carregarBoletos() {
    console.log('Carregando boletos...');
    const boletosSalvos = localStorage.getItem('boletosMatutinhoAldeota');
    if (boletosSalvos) {
        boletos = JSON.parse(boletosSalvos);
        console.log('Boletos carregados:', boletos.length);
    } else {
        console.log('Nenhum boleto encontrado - iniciando vazio');
        boletos = [];  // COMEÇA VAZIO
        // REMOVIDO: DatabaseExemplo.adicionarBoletosExemplo();
    }
}

// ========== FUNÇÕES DE SALVAMENTO ==========
function salvarVendas() {
    localStorage.setItem('vendasMatutinhoAldeota', JSON.stringify(todasVendas));
}

function salvarSaidas() {
    localStorage.setItem('saidasMatutinhoAldeota', JSON.stringify(todasSaidas));
}

function salvarGastos() {
    localStorage.setItem('gastosMatutinhoAldeota', JSON.stringify(gastos));
}

function salvarFornecedores() {
    localStorage.setItem('fornecedoresMatutinhoAldeota', JSON.stringify(fornecedores));
}

function salvarBoletos() {
    localStorage.setItem('boletosMatutinhoAldeota', JSON.stringify(boletos));
}