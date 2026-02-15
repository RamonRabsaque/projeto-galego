// ========== SERVIÇO SUPABASE ==========
const SupabaseService = {
    // ===== AUTENTICAÇÃO =====
    async login(email, senha) {
        try {
            console.log('🔍 Tentando login:', email);
            
            const { data, error } = await supabaseClient
                .from('usuarios')
                .select('*')
                .eq('email', email)
                .eq('senha', senha)
                .eq('ativo', true)
                .maybeSingle();
            
            if (error) {
                console.error('Erro na consulta:', error);
                return { success: false, error: 'Erro no servidor' };
            }
            
            if (!data) {
                console.log('❌ Usuário não encontrado');
                return { success: false, error: 'Usuário ou senha inválidos' };
            }
            
            console.log('✅ Login bem sucedido:', data.nome);
            
            // Salvar sessão (sem a senha)
            const userSession = { ...data };
            delete userSession.senha;
            localStorage.setItem('supabase_user', JSON.stringify(userSession));
            
            return { success: true, user: userSession };
            
        } catch (error) {
            console.error('❌ Erro no login:', error);
            return { success: false, error: 'Erro ao conectar com servidor' };
        }
    },

    // ===== VENDAS =====
    async getVendas(usuario_id, data) {
        try {
            console.log('📊 Buscando vendas de:', data);
            
            const { data: vendas, error } = await supabaseClient
                .from('vendas')
                .select('*')
                .eq('usuario_id', usuario_id)
                .eq('data', data)
                .order('hora', { ascending: false });
            
            if (error) throw error;
            return vendas || [];
            
        } catch (error) {
            console.error('❌ Erro ao buscar vendas:', error);
            return [];
        }
    },

    async saveVenda(venda) {
        try {
            console.log('💾 Salvando venda:', venda);
            
            const { data, error } = await supabaseClient
                .from('vendas')
                .insert([venda])
                .select();
            
            if (error) throw error;
            
            console.log('✅ Venda salva:', data[0]);
            return data[0];
            
        } catch (error) {
            console.error('❌ Erro ao salvar venda:', error);
            throw error;
        }
    },

    async updateVenda(id, venda) {
        try {
            const { data, error } = await supabaseClient
                .from('vendas')
                .update(venda)
                .eq('id', id)
                .select();
            
            if (error) throw error;
            return data[0];
            
        } catch (error) {
            console.error('❌ Erro ao atualizar venda:', error);
            throw error;
        }
    },

    async deleteVenda(id) {
        try {
            const { error } = await supabaseClient
                .from('vendas')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao deletar venda:', error);
            throw error;
        }
    },

    // ===== GASTOS =====
    async getGastos(usuario_id, mes) {
        try {
            console.log('📊 Buscando gastos do mês:', mes);
            
            const { data: gastos, error } = await supabaseClient
                .from('gastos')
                .select('*')
                .eq('usuario_id', usuario_id)
                .like('data', `${mes}%`)
                .order('data', { ascending: false });
            
            if (error) throw error;
            return gastos || [];
            
        } catch (error) {
            console.error('❌ Erro ao buscar gastos:', error);
            return [];
        }
    },

    async saveGasto(gasto) {
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

    async updateGasto(id, gasto) {
        try {
            const { data, error } = await supabaseClient
                .from('gastos')
                .update(gasto)
                .eq('id', id)
                .select();
            
            if (error) throw error;
            return data[0];
            
        } catch (error) {
            console.error('❌ Erro ao atualizar gasto:', error);
            throw error;
        }
    },

    async deleteGasto(id) {
        try {
            const { error } = await supabaseClient
                .from('gastos')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao deletar gasto:', error);
            throw error;
        }
    },

    // ===== FORNECEDORES =====
    async getFornecedores(usuario_id) {
        try {
            console.log('📊 Buscando fornecedores');
            
            const { data: fornecedores, error } = await supabaseClient
                .from('fornecedores')
                .select('*')
                .eq('usuario_id', usuario_id)
                .order('nome');
            
            if (error) throw error;
            return fornecedores || [];
            
        } catch (error) {
            console.error('❌ Erro ao buscar fornecedores:', error);
            return [];
        }
    },

    async saveFornecedor(fornecedor) {
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

    async updateFornecedor(id, fornecedor) {
        try {
            const { data, error } = await supabaseClient
                .from('fornecedores')
                .update(fornecedor)
                .eq('id', id)
                .select();
            
            if (error) throw error;
            return data[0];
            
        } catch (error) {
            console.error('❌ Erro ao atualizar fornecedor:', error);
            throw error;
        }
    },

    async deleteFornecedor(id) {
        try {
            const { error } = await supabaseClient
                .from('fornecedores')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao deletar fornecedor:', error);
            throw error;
        }
    },

    // ===== BOLETOS =====
    async getBoletos(usuario_id, mes) {
        try {
            console.log('📊 Buscando boletos do mês:', mes);
            
            const { data: boletos, error } = await supabaseClient
                .from('boletos')
                .select('*')
                .eq('usuario_id', usuario_id)
                .like('data_vencimento', `${mes}%`)
                .order('data_vencimento');
            
            if (error) throw error;
            return boletos || [];
            
        } catch (error) {
            console.error('❌ Erro ao buscar boletos:', error);
            return [];
        }
    },

    async saveBoleto(boleto) {
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

    async updateBoleto(id, boleto) {
        try {
            const { data, error } = await supabaseClient
                .from('boletos')
                .update(boleto)
                .eq('id', id)
                .select();
            
            if (error) throw error;
            return data[0];
            
        } catch (error) {
            console.error('❌ Erro ao atualizar boleto:', error);
            throw error;
        }
    },

    async deleteBoleto(id) {
        try {
            const { error } = await supabaseClient
                .from('boletos')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao deletar boleto:', error);
            throw error;
        }
    },

    async marcarBoletoPago(id, dataPagamento) {
        try {
            const { data, error } = await supabaseClient
                .from('boletos')
                .update({
                    status: 'pago',
                    data_pagamento: dataPagamento
                })
                .eq('id', id)
                .select();
            
            if (error) throw error;
            return data[0];
            
        } catch (error) {
            console.error('❌ Erro ao marcar boleto como pago:', error);
            throw error;
        }
    },

    // ===== ADMIN: CADASTRAR USUÁRIO =====
    async cadastrarUsuario(nome, email, senha, tipo = 'usuario') {
        try {
            console.log('👤 Cadastrando novo usuário:', email);
            
            const { data, error } = await supabaseClient
                .from('usuarios')
                .insert([{
                    nome,
                    email,
                    senha,
                    tipo,
                    ativo: true
                }])
                .select();
            
            if (error) throw error;
            
            console.log('✅ Usuário cadastrado:', data[0]);
            return { success: true, user: data[0] };
            
        } catch (error) {
            console.error('❌ Erro ao cadastrar usuário:', error);
            return { success: false, error: error.message };
        }
    },

    // ===== ADMIN: LISTAR USUÁRIOS =====
    async getUsuarios() {
        try {
            const { data, error } = await supabaseClient
                .from('usuarios')
                .select('id, nome, email, tipo, ativo, created_at')
                .order('nome');
            
            if (error) throw error;
            return data || [];
            
        } catch (error) {
            console.error('❌ Erro ao buscar usuários:', error);
            return [];
        }
    },

    // ===== LOGOUT =====
    logout() {
        localStorage.removeItem('supabase_user');
        window.location.reload();
    }
};