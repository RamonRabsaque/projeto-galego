// ========== PDF DE RELATÓRIOS ==========
function gerarRelatorioAnalitico() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        const mesSelecionado = document.getElementById('filtroMesRelatorio').value;
        const [ano, mes] = mesSelecionado.split('-');
        const dataObj = new Date(ano, mes - 1);
        const nomeMes = dataObj.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

        doc.setFontSize(20);
        doc.setTextColor(90, 0, 0);
        doc.text('MATUTINHO ALDEOTA', 105, 20, { align: 'center' });

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Relatório Analítico Completo', 105, 30, { align: 'center' });
        doc.text(nomeMes, 105, 38, { align: 'center' });

        const vendasMes = todasVendas.filter(v => {
            const [vAno, vMes] = v.data.split('-');
            return vAno === ano && vMes === mes;
        });

        const gastosMes = gastos.filter(g => {
            const [gAno, gMes] = g.data.split('-');
            return gAno === ano && gMes === mes;
        });

        const totalVendas = vendasMes.reduce((s, v) => s + v.valor, 0);
        const totalGastos = gastosMes.reduce((s, g) => s + g.valor, 0);
        const saldo = totalVendas - totalGastos;

        doc.setFontSize(12);
        doc.setTextColor(90, 0, 0);
        doc.text('RESUMO GERAL', 20, 55);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total de Vendas: ${formatarMoeda(totalVendas)}`, 25, 63);
        doc.text(`Total de Gastos: ${formatarMoeda(totalGastos)}`, 25, 70);
        doc.text(`Saldo do Período: ${formatarMoeda(saldo)}`, 25, 77);
        doc.text(`Quantidade de Vendas: ${vendasMes.length}`, 25, 84);
        doc.text(`Ticket Médio: ${vendasMes.length > 0 ? formatarMoeda(totalVendas / vendasMes.length) : 'R$ 0,00'}`, 25, 91);

        let yPos = 105;
        
        doc.setFontSize(12);
        doc.setTextColor(90, 0, 0);
        doc.text('ANÁLISE POR TURNO', 20, yPos);
        yPos += 8;

        const vendasManha = vendasMes.filter(v => v.turno === 'manha');
        const vendasTarde = vendasMes.filter(v => v.turno === 'tarde');

        const totalManha = vendasManha.reduce((s, v) => s + v.valor, 0);
        const totalTarde = vendasTarde.reduce((s, v) => s + v.valor, 0);

        const headers = [['Turno', 'Total Vendas', 'Qtd', 'Ticket Médio', 'Dinheiro', 'Cartão', 'Pix']];
        
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

        const body = [
            [
                'Manhã',
                formatarMoeda(totalManha),
                vendasManha.length,
                formatarMoeda(vendasManha.length > 0 ? totalManha / vendasManha.length : 0),
                formatarMoeda(pagamentosManha.dinheiro),
                formatarMoeda(pagamentosManha.credito + pagamentosManha.debito),
                formatarMoeda(pagamentosManha.pix)
            ],
            [
                'Tarde',
                formatarMoeda(totalTarde),
                vendasTarde.length,
                formatarMoeda(vendasTarde.length > 0 ? totalTarde / vendasTarde.length : 0),
                formatarMoeda(pagamentosTarde.dinheiro),
                formatarMoeda(pagamentosTarde.credito + pagamentosTarde.debito),
                formatarMoeda(pagamentosTarde.pix)
            ],
            [
                'TOTAL',
                formatarMoeda(totalManha + totalTarde),
                vendasManha.length + vendasTarde.length,
                formatarMoeda((totalManha + totalTarde) / (vendasManha.length + vendasTarde.length || 1)),
                formatarMoeda(pagamentosManha.dinheiro + pagamentosTarde.dinheiro),
                formatarMoeda(pagamentosManha.credito + pagamentosManha.debito + pagamentosTarde.credito + pagamentosTarde.debito),
                formatarMoeda(pagamentosManha.pix + pagamentosTarde.pix)
            ]
        ];

        doc.autoTable({
            startY: yPos,
            head: headers,
            body: body,
            theme: 'grid',
            headStyles: { fillColor: [90, 0, 0] },
            margin: { left: 20, right: 20 }
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Página ${i} de ${pageCount} - Matutinho Aldeota`, 105, 285, { align: 'center' });
            doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 105, 290, { align: 'center' });
        }

        const nomeArquivo = `Relatorio_Analitico_${ano}-${mes}.pdf`;
        doc.save(nomeArquivo);
        mostrarMensagem('Relatório analítico gerado com sucesso!', 'success');

    } catch (error) {
        console.error('Erro ao gerar relatório analítico:', error);
        mostrarMensagem('Erro ao gerar relatório analítico.', 'error');
    }
}