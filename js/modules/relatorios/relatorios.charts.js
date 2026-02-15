// ========== VARIÁVEIS DE GRÁFICOS ==========
let turnosChart = null;
let pagamentosChart = null;

// ========== GRÁFICOS DE RELATÓRIOS ==========
function atualizarGraficosRelatorios(totalManha, totalTarde, pagamentosManha, pagamentosTarde) {
    console.log('Atualizando gráficos de relatórios...');

    const ctxTurnos = document.getElementById('turnosChart');
    if (ctxTurnos) {
        try {
            if (turnosChart) {
                turnosChart.destroy();
            }

            turnosChart = new Chart(ctxTurnos.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Manhã', 'Tarde'],
                    datasets: [{
                        data: [totalManha, totalTarde],
                        backgroundColor: [
                            'rgba(255, 152, 0, 0.8)',
                            'rgba(33, 150, 243, 0.8)'
                        ],
                        borderColor: [
                            'rgb(255, 152, 0)',
                            'rgb(33, 150, 243)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true, position: 'right' },
                        title: {
                            display: true,
                            text: 'Distribuição por Turno',
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
            console.log('Gráfico de turnos criado');
        } catch (error) {
            console.error('Erro ao criar gráfico de turnos:', error);
        }
    } else {
        console.error('Canvas de turnos não encontrado!');
    }

    const ctxPagamentos = document.getElementById('pagamentosChart');
    if (ctxPagamentos) {
        try {
            if (pagamentosChart) {
                pagamentosChart.destroy();
            }

            const totalCartaoManha = pagamentosManha.credito + pagamentosManha.debito;
            const totalCartaoTarde = pagamentosTarde.credito + pagamentosTarde.debito;

            pagamentosChart = new Chart(ctxPagamentos.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Dinheiro', 'Cartão', 'Pix'],
                    datasets: [
                        {
                            label: 'Manhã',
                            data: [pagamentosManha.dinheiro, totalCartaoManha, pagamentosManha.pix],
                            backgroundColor: 'rgba(255, 152, 0, 0.7)',
                            borderColor: 'rgb(255, 152, 0)',
                            borderWidth: 1
                        },
                        {
                            label: 'Tarde',
                            data: [pagamentosTarde.dinheiro, totalCartaoTarde, pagamentosTarde.pix],
                            backgroundColor: 'rgba(33, 150, 243, 0.7)',
                            borderColor: 'rgb(33, 150, 243)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true, position: 'top' },
                        title: {
                            display: true,
                            text: 'Formas de Pagamento por Turno',
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
            console.log('Gráfico de pagamentos criado');
        } catch (error) {
            console.error('Erro ao criar gráfico de pagamentos:', error);
        }
    } else {
        console.error('Canvas de pagamentos não encontrado!');
    }
}