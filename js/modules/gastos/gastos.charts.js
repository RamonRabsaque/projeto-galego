// ========== VARIÁVEIS DE GRÁFICOS ==========
let gastosChart = null;
let categoriasChart = null;

// ========== GRÁFICOS DE GASTOS ==========
function inicializarGraficosGastos() {
    console.log('Inicializando gráficos de gastos...');

    const ctxGastos = document.getElementById('gastosChart');
    const ctxCategorias = document.getElementById('categoriasChart');

    if (!ctxGastos || !ctxCategorias) {
        console.error('Canvas dos gráficos não encontrados!');
        return;
    }

    if (gastosChart) {
        gastosChart.destroy();
    }
    if (categoriasChart) {
        categoriasChart.destroy();
    }

    try {
        gastosChart = new Chart(ctxGastos.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Gastos Mensais (R$)',
                    data: [],
                    borderColor: 'rgb(90, 0, 0)',
                    backgroundColor: 'rgba(90, 0, 0, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' },
                    title: {
                        display: true,
                        text: 'Evolução dos Gastos',
                        font: { size: 14, family: 'Inter' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
        console.log('Gráfico de linha criado');
    } catch (error) {
        console.error('Erro ao criar gráfico de linha:', error);
    }

    try {
        categoriasChart = new Chart(ctxCategorias.getContext('2d'), {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        'rgba(90, 0, 0, 0.8)',
                        'rgba(33, 150, 243, 0.8)',
                        'rgba(76, 175, 80, 0.8)',
                        'rgba(255, 184, 0, 0.8)',
                        'rgba(156, 39, 176, 0.8)',
                        'rgba(244, 67, 54, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'right' },
                    title: {
                        display: true,
                        text: 'Distribuição por Categoria',
                        font: { size: 14, family: 'Inter' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += formatarMoeda(context.raw);
                                return label;
                            }
                        }
                    }
                }
            }
        });
        console.log('Gráfico de pizza criado');
    } catch (error) {
        console.error('Erro ao criar gráfico de pizza:', error);
    }
}

function atualizarGraficosGastos(gastosLista, mesSelecionado) {
    console.log('Atualizando gráficos de gastos...');

    if (!gastosChart || !categoriasChart) {
        console.log('Gráficos não inicializados, inicializando...');
        inicializarGraficosGastos();
        if (!gastosChart || !categoriasChart) {
            console.error('Não foi possível inicializar os gráficos');
            return;
        }
    }

    try {
        const seisMesesAtras = new Date();
        seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 5);

        const meses = [];
        const dadosMensais = [];

        for (let i = 5; i >= 0; i--) {
            const data = new Date();
            data.setMonth(data.getMonth() - i);
            const ano = data.getFullYear();
            const mes = data.getMonth() + 1;
            const chave = `${ano}-${String(mes).padStart(2, '0')}`;

            const nomeMes = data.toLocaleDateString('pt-BR', { month: 'short' });
            meses.push(`${nomeMes}/${ano.toString().substring(2)}`);

            const totalMes = gastos.filter(g => g.data.startsWith(chave))
                .reduce((total, g) => total + g.valor, 0);
            dadosMensais.push(totalMes);
        }

        gastosChart.data.labels = meses;
        gastosChart.data.datasets[0].data = dadosMensais;
        gastosChart.update();
        console.log('Gráfico de linha atualizado');

        const categorias = {};
        gastosLista.forEach(gasto => {
            if (!categorias[gasto.categoria]) categorias[gasto.categoria] = 0;
            categorias[gasto.categoria] += gasto.valor;
        });

        const categoriasNomes = {
            'insumos': 'Insumos',
            'funcionarios': 'Funcionários',
            'aluguel': 'Aluguel',
            'manutencao': 'Manutenção',
            'marketing': 'Marketing',
            'outros': 'Outros'
        };

        const labels = [];
        const dados = [];

        Object.entries(categorias).forEach(([categoria, valor]) => {
            labels.push(categoriasNomes[categoria] || categoria);
            dados.push(valor);
        });

        categoriasChart.data.labels = labels;
        categoriasChart.data.datasets[0].data = dados;
        categoriasChart.update();
        console.log('Gráfico de pizza atualizado');

    } catch (error) {
        console.error('Erro ao atualizar gráficos:', error);
    }
}