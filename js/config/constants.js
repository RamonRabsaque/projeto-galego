// ========== CONSTANTES GLOBAIS ==========
const CONSTANTES = {
    // Credenciais (agora não são mais usadas diretamente, mas mantemos)
    CREDENCIAIS: {
        USUARIO: 'admin@matutinho.com',
        SENHA: '123456'
    },
    
    // Categorias de Gastos
    CATEGORIAS_GASTOS: {
        insumos: 'Insumos',
        funcionarios: 'Funcionários',
        aluguel: 'Aluguel',
        manutencao: 'Manutenção',
        marketing: 'Marketing',
        outros: 'Outros'
    },
    
    // Tipos de Gasto
    TIPOS_GASTO: {
        fixo: 'Fixo',
        variavel: 'Variável',
        emergencia: 'Emergência',
        investimento: 'Investimento'
    },
    
    // Formas de Pagamento
    FORMAS_PAGAMENTO: {
        dinheiro: 'Dinheiro',
        pix: 'Pix',
        credito: 'Cartão Crédito',
        debito: 'Cartão Débito'
    },
    
    // Status de Boleto
    STATUS_BOLETO: {
        pendente: 'pendente',
        pago: 'pago',
        atrasado: 'atrasado'
    },
    
    // Turnos
    TURNOS: {
        manha: 'manha',
        tarde: 'tarde'
    },
    
    // Cores para Gráficos
    CORES: {
        manha: 'rgba(255, 152, 0, 0.8)',
        tarde: 'rgba(33, 150, 243, 0.8)',
        dinheiro: 'rgba(76, 175, 80, 0.8)',
        cartao: 'rgba(33, 150, 243, 0.8)',
        pix: 'rgba(156, 39, 176, 0.8)',
        vermelho: 'rgb(90, 0, 0)',
        vermelhoAlpha: 'rgba(90, 0, 0, 0.1)'
    },
    
    // Configurações
    META_MENSAL: 5000,
    BACKUP_INTERVALO: 300000,
    
    // Chaves do localStorage
    STORAGE_KEYS: {
        VENDAS: 'vendasMatutinhoAldeota',
        SAIDAS: 'saidasMatutinhoAldeota',
        GASTOS: 'gastosMatutinhoAldeota',
        FORNECEDORES: 'fornecedoresMatutinhoAldeota',
        BOLETOS: 'boletosMatutinhoAldeota',
        TEMA: 'temaMatutinhoAldeota',
        BACKUP: 'backupMatutinhoAldeota',
        USUARIOS: 'usuariosMatutinho',        // 👈 NOVO
        USUARIO_LOGADO: 'usuarioLogado'        // 👈 NOVO
    }
};