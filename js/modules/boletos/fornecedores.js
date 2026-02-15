// ========== VARIÁVEIS DE EDIÇÃO ==========
let fornecedorEditando = null;

// ========== LÓGICA DE FORNECEDORES ==========
function registrarFornecedor() {
    console.log('Registrando fornecedor...');

    const nome = document.getElementById('fornecedorNome').value.trim();
    const categoria = document.getElementById('fornecedorCategoria').value;
    const contato = document.getElementById('fornecedorContato').value.trim();
    const observacao = document.getElementById('fornecedorObservacao').value.trim();

    if (!nome || !categoria) {
        mostrarMensagem('Por favor, preencha o nome e categoria do fornecedor.', 'error');
        return;
    }

    const novoFornecedor = {
        id: fornecedorEditando ? fornecedorEditando.id : gerarIdUnico(),
        nome,
        categoria,
        contato: contato || "",
        observacao: observacao || ""
    };

    if (fornecedorEditando) {
        const index = fornecedores.findIndex(f => f.id === fornecedorEditando.id);
        if (index !== -1) {
            fornecedores[index] = novoFornecedor;
            mostrarMensagem('Fornecedor atualizado com sucesso!', 'success');
        }
        fornecedorEditando = null;
        const btnRegistrar = document.getElementById('btnRegistrarFornecedor');
        if (btnRegistrar) {
            btnRegistrar.innerHTML = '<i class="fas fa-save"></i> Cadastrar Fornecedor';
        }
    } else {
        fornecedores.push(novoFornecedor);
        mostrarMensagem(`Fornecedor "${nome}" cadastrado com sucesso!`, 'success');
    }

    salvarFornecedores();
    atualizarFornecedores();
    limparFormularioFornecedor();
    atualizarSelectFornecedores();
}

function editarFornecedor(id) {
    console.log('Editando fornecedor:', id);

    const fornecedor = fornecedores.find(f => f.id === id);
    if (!fornecedor) {
        console.error('Fornecedor não encontrado:', id);
        return;
    }

    fornecedorEditando = fornecedor;

    document.getElementById('fornecedorNome').value = fornecedor.nome;
    document.getElementById('fornecedorCategoria').value = fornecedor.categoria;
    document.getElementById('fornecedorContato').value = fornecedor.contato;
    document.getElementById('fornecedorObservacao').value = fornecedor.observacao || '';

    const btnRegistrar = document.getElementById('btnRegistrarFornecedor');
    if (btnRegistrar) {
        btnRegistrar.innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
    }

    mostrarMensagem(`Editando: ${fornecedor.nome}`, 'info');
}

function excluirFornecedor(id) {
    console.log('Excluindo fornecedor:', id);

    const fornecedor = fornecedores.find(f => f.id === id);
    if (!fornecedor) {
        console.error('Fornecedor não encontrado:', id);
        return;
    }

    const boletosFornecedor = boletos.filter(b => b.fornecedorId === id);
    let mensagem = `Excluir fornecedor "${fornecedor.nome}"?`;

    if (boletosFornecedor.length > 0) {
        mensagem = `Este fornecedor tem ${boletosFornecedor.length} boleto(s) registrado(s). Os boletos também serão excluídos. Deseja continuar?`;
    }

    if (!confirm(mensagem)) return;

    boletos = boletos.filter(b => b.fornecedorId !== id);
    salvarBoletos();

    fornecedores = fornecedores.filter(f => f.id !== id);
    salvarFornecedores();

    atualizarFornecedores();
    atualizarSelectFornecedores();
    atualizarBoletos();

    mostrarMensagem('Fornecedor excluído!', 'success');
}

function limparFormularioFornecedor() {
    console.log('Limpando formulário de fornecedor...');

    const form = document.getElementById('formFornecedor');
    if (form) {
        form.reset();

        if (fornecedorEditando) {
            fornecedorEditando = null;
            const btnRegistrar = document.getElementById('btnRegistrarFornecedor');
            if (btnRegistrar) {
                btnRegistrar.innerHTML = '<i class="fas fa-save"></i> Cadastrar Fornecedor';
            }
        }
    }
}

function atualizarFornecedores() {
    console.log('Atualizando lista de fornecedores...');

    const tbody = document.getElementById('listaFornecedores');
    if (!tbody) {
        console.error('Tabela de fornecedores não encontrada!');
        return;
    }

    tbody.innerHTML = '';

    if (fornecedores.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 2rem; color: var(--cinza-texto);">
                    <i class="fas fa-search"></i> Nenhum fornecedor cadastrado
                </td>
            </tr>
        `;
        return;
    }

    fornecedores.forEach(fornecedor => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>
                <div class="fornecedor-nome" style="font-weight: 500; cursor: pointer; margin-right: 0.5rem;" 
                     data-id="${fornecedor.id}" data-nome="${fornecedor.nome}">
                    <i class="fas fa-search"></i> ${fornecedor.nome}
                </div>
                ${fornecedor.observacao ? `<div style="font-size: 0.8rem; color: var(--cinza-texto); margin-top: 0.3rem;">${fornecedor.observacao}</div>` : ''}
            </td>
            <td>${fornecedor.categoria || '-'}</td>
            <td>${fornecedor.contato || '-'}</td>
            <td>
                <button class="btn-boleto-action btn-boleto-edit" data-id="${fornecedor.id}" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-boleto-action btn-boleto-delete" data-id="${fornecedor.id}" title="Excluir">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });

    tbody.querySelectorAll('.btn-boleto-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            editarFornecedor(id);
        });
    });

    tbody.querySelectorAll('.btn-boleto-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            excluirFornecedor(id);
        });
    });

    tbody.querySelectorAll('.fornecedor-nome').forEach(element => {
        element.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const nome = this.dataset.nome;
            abrirHistoricoFornecedor(id, nome);
        });
    });
}

function atualizarSelectFornecedores() {
    console.log('Atualizando select de fornecedores...');

    const selectFornecedor = document.getElementById('boletoFornecedor');
    const selectFiltro = document.getElementById('filtroFornecedorBoleto');

    if (selectFornecedor) {
        const valorAtual = selectFornecedor.value;
        selectFornecedor.innerHTML = '<option value="">Selecione um fornecedor...</option>';

        fornecedores.forEach(fornecedor => {
            const option = document.createElement('option');
            option.value = fornecedor.id;
            option.textContent = fornecedor.nome;
            selectFornecedor.appendChild(option);
        });

        selectFornecedor.value = valorAtual;
    }

    if (selectFiltro) {
        const valorAtual = selectFiltro.value;
        selectFiltro.innerHTML = '<option value="todos">Todos os Fornecedores</option>';

        fornecedores.forEach(fornecedor => {
            const option = document.createElement('option');
            option.value = fornecedor.id;
            option.textContent = fornecedor.nome;
            selectFiltro.appendChild(option);
        });

        selectFiltro.value = valorAtual;
    }
}

function pesquisarFornecedor(termo) {
    const resultadosDiv = document.getElementById('resultadosPesquisa');
    resultadosDiv.innerHTML = '';

    if (!termo || termo.length < 2) {
        resultadosDiv.style.display = 'none';
        return;
    }

    const termoLower = termo.toLowerCase();
    const resultados = fornecedores.filter(fornecedor =>
        fornecedor.nome.toLowerCase().includes(termoLower)
    );

    if (resultados.length === 0) {
        resultadosDiv.innerHTML = '<div class="resultado-item">Nenhum fornecedor encontrado</div>';
        resultadosDiv.style.display = 'block';
        return;
    }

    resultados.forEach(fornecedor => {
        const item = document.createElement('div');
        item.className = 'resultado-item';
        item.textContent = fornecedor.nome;
        item.dataset.id = fornecedor.id;
        item.dataset.nome = fornecedor.nome;

        item.addEventListener('click', function() {
            document.getElementById('boletoFornecedor').value = fornecedor.id;
            document.getElementById('pesquisaFornecedor').value = fornecedor.nome;
            resultadosDiv.style.display = 'none';
        });

        resultadosDiv.appendChild(item);
    });

    resultadosDiv.style.display = 'block';
}