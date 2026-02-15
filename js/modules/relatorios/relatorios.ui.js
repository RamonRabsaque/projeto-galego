// ========== INTERFACE DE RELATÓRIOS ==========
function atualizarRelatorios() {
    console.log('=== ATUALIZANDO RELATÓRIOS ===');

    const mesSelecionado = document.getElementById('filtroMesRelatorio').value;
    const [ano, mes] = mesSelecionado.split('-');

    const vendasMes = todasVendas.filter(v => {
        const [vendaAno, vendaMes] = v.data.split('-');
        return vendaAno === ano && vendaMes === mes;
    });

    const vendasManha = vendasMes.filter(v => v.turno === 'manha');
    const vendasTarde = vendasMes.filter(v => v.turno === 'tarde');

    const totalManha = vendasManha.reduce((s, v) => s + v.valor, 0);
    const totalTarde = vendasTarde.reduce((s, v) => s + v.valor, 0);
    const totalGeral = totalManha + totalTarde;

    const qtdManha = vendasManha.length;
    const qtdTarde = vendasTarde.length;
    const qtdTotal = qtdManha + qtdTarde;

    const ticketManha = qtdManha > 0 ? totalManha / qtdManha : 0;
    const ticketTarde = qtdTarde > 0 ? totalTarde / qtdTarde : 0;
    const ticketTotal = qtdTotal > 0 ? totalGeral / qtdTotal : 0;

    const pagamentosManha = {
        dinheiro: vendasManha.filter(v => v.formaPagamento === 'dinheiro').reduce((s, v) => s + v.valor, 0),
        credito: vendasManha.filter(v => v.formaPagamento === 'credito').reduce((s, v) => s + v.valor, 0),
        debito: vendasManha.filter(v => v.formaPagamento === 'debito').reduce((s, v) => s + v.valor, 0),
        pix: vendasManha.filter(v => v.formaPagamento === 'pix').reduce((s, v) => s + v.valor, 0)
    };

    const pagamentosTarde = {
        dinheiro: vendasTarde.filter(v => v.formaPagamento === 'dinheiro').reduce((s, v) => s + v.valor, 0),
        credito: vendasTarde.filter(v => v.formaPagamento === 'credito').reduce((s, v) => s + v.valor, 0),
        debito: vendasTarde.filter(v => v.formaPagamento === 'debito').reduce((s, v) => s + v.valor, 0),
        pix: vendasTarde.filter(v => v.formaPagamento === 'pix').reduce((s, v) => s + v.valor, 0)
    };

    const atualizarElemento = (id, valor) => {
        const element = document.getElementById(id);
        if (element) {
            if (typeof valor === 'number') {
                element.textContent = formatarMoeda(valor);
            } else {
                element.textContent = valor;
            }
        }
    };

    atualizarElemento('analiseManhaTotal', totalManha);
    atualizarElemento('analiseManhaQtd', qtdManha);
    atualizarElemento('analiseManhaTicket', ticketManha);
    atualizarElemento('analiseManhaDinheiro', pagamentosManha.dinheiro);
    atualizarElemento('analiseManhaCartao', pagamentosManha.credito + pagamentosManha.debito);
    atualizarElemento('analiseManhaPix', pagamentosManha.pix);

    atualizarElemento('analiseTardeTotal', totalTarde);
    atualizarElemento('analiseTardeQtd', qtdTarde);
    atualizarElemento('analiseTardeTicket', ticketTarde);
    atualizarElemento('analiseTardeDinheiro', pagamentosTarde.dinheiro);
    atualizarElemento('analiseTardeCartao', pagamentosTarde.credito + pagamentosTarde.debito);
    atualizarElemento('analiseTardePix', pagamentosTarde.pix);

    atualizarElemento('analiseTotalGeral', totalGeral);
    atualizarElemento('analiseTotalQtd', qtdTotal);
    atualizarElemento('analiseTotalTicket', ticketTotal);
    atualizarElemento('analiseTotalDinheiro', pagamentosManha.dinheiro + pagamentosTarde.dinheiro);
    atualizarElemento('analiseTotalCartao', pagamentosManha.credito + pagamentosManha.debito + pagamentosTarde.credito + pagamentosTarde.debito);
    atualizarElemento('analiseTotalPix', pagamentosManha.pix + pagamentosTarde.pix);

    atualizarGraficosRelatorios(totalManha, totalTarde, pagamentosManha, pagamentosTarde);
}