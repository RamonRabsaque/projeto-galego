// ========== LÓGICA PRINCIPAL DE RELATÓRIOS ==========
function configurarEventosRelatorios() {
    console.log('Configurando eventos de relatórios...');

    const btnRelatorioCompleto = document.getElementById('btnGerarRelatorioCompleto');
    if (btnRelatorioCompleto) {
        btnRelatorioCompleto.addEventListener('click', function() {
            const telaAtiva = document.querySelector('.container > div[style*="display: block"]');
            
            if (telaAtiva && telaAtiva.id === 'telaRelatorios') {
                gerarRelatorioAnalitico();
            } else {
                gerarRelatorioPDF();
                setTimeout(() => {
                    gerarRelatorioGastos();
                }, 1000);
            }
        });
    }

    const filtroMesRelatorio = document.getElementById('filtroMesRelatorio');
    if (filtroMesRelatorio) {
        filtroMesRelatorio.addEventListener('change', function() {
            atualizarRelatorios();
        });
    }
}