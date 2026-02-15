// ========== SERVIÇO DE DADOS DO SUPABASE ==========
const SupabaseDataService = {
    // ===== VENDAS =====
    async carregarVendas(usuario_id, data) {
        try {
            const { data: vendas, error } = await supabaseClient
                .from('vendas')
                .select('*')
                .eq('usuario_id', usuario_id)
                .eq('data', data)
                .order('hora', { ascending: false });

            if (error) throw error;
            return vendas || [];
        } catch (error) {
            console.error('❌ Erro ao carregar vendas:', error);
            return [];
        }
    },

    async salvarVenda(venda) {
        try {
            const { data, error } = await supabaseClient
                .from('vendas')
                .insert([venda])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('❌ Erro ao salvar venda:', error);
            throw error;
        }
    },

    // ===== GASTOS =====
    async carregarGastos(usuario_id, mes) {
        try {
            const { data: gastos, error } = await supabaseClient
                .from('gastos')
                .select('*')
                .eq('usuario_id', usuario_id)
                .like('data', `${mes}%`)
                .order('data', { ascending: false });

            if (error) throw error;
            return gastos || [];
        } catch (error) {
            console.error('❌ Erro ao carregar gastos:', error);
            return [];
        }
    },

    async salvarGasto(gasto) {
        try {
            const { data, error } = await supabaseClient
                .from('gastos')
                .insert([gasto])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('❌ Erro ao salvar gasto:', error);
            throw error;
        }
    },

    // ===== FORNECEDORES =====
    async carregarFornecedores(usuario_id) {
        try {
            const { data: fornecedores, error } = await supabaseClient
                .from('fornecedores')
                .select('*')
                .eq('usuario_id', usuario_id)
                .order('nome');

            if (error) throw error;
            return fornecedores || [];
        } catch (error) {
            console.error('❌ Erro ao carregar fornecedores:', error);
            return [];
        }
    },

    async salvarFornecedor(fornecedor) {
        try {
            const { data, error } = await supabaseClient
                .from('fornecedores')
                .insert([fornecedor])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('❌ Erro ao salvar fornecedor:', error);
            throw error;
        }
    },

    // ===== BOLETOS =====
    async carregarBoletos(usuario_id, mes) {
        try {
            const { data: boletos, error } = await supabaseClient
                .from('boletos')
                .select('*')
                .eq('usuario_id', usuario_id)
                .like('data_vencimento', `${mes}%`)
                .order('data_vencimento');

            if (error) throw error;
            return boletos || [];
        } catch (error) {
            console.error('❌ Erro ao carregar boletos:', error);
            return [];
        }
    },

    async salvarBoleto(boleto) {
        try {
            const { data, error } = await supabaseClient
                .from('boletos')
                .insert([boleto])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('❌ Erro ao salvar boleto:', error);
            throw error;
        }
    },

    // ===== LIMPAR DADOS LOCAIS =====
    limparDadosLocais() {
        localStorage.removeItem('vendasMatutinhoAldeota');
        localStorage.removeItem('saidasMatutinhoAldeota');
        localStorage.removeItem('gastosMatutinhoAldeota');
        localStorage.removeItem('fornecedoresMatutinhoAldeota');
        localStorage.removeItem('boletosMatutinhoAldeota');
        console.log('🧹 Dados locais removidos');
    }
};