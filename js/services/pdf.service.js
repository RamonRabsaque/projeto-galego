// ========== SERVIÇO DE PDF ==========
async function gerarRelatorioPDF() {
    try {
        mostrarMensagem('Gerando PDF...', 'info');

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        const hoje = new Date();
        const dataFormatada = formatarDataBrasileira(hoje);
        const dataSelecionada = document.getElementById('filtroData').value;

        doc.setFont("helvetica");
        doc.setFontSize(20);
        doc.setTextColor(90, 0, 0);
        doc.text("MATUTINHO ALDEOTA", 105, 20, { align: "center" });

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Relatório Diário de Vendas", 105, 30, { align: "center" });
        doc.text(`Data: ${dataSelecionada || dataFormatada}`, 105, 38, { align: "center" });

        let yPos = 50;

        doc.setFontSize(16);
        doc.setTextColor(90, 0, 0);
        doc.text("RESUMO POR TURNO", 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        doc.setFillColor(255, 152, 0);
        doc.roundedRect(20, yPos, 85, 25, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text("TURNO DA MANHÃ", 25, yPos + 8);
        doc.setFontSize(12);
        doc.text(document.getElementById('vendasManha').textContent, 25, yPos + 16);
        doc.setFontSize(10);
        doc.text(`${document.getElementById('qtdVendasManha').textContent} vendas`, 25, yPos + 22);

        doc.setFillColor(33, 150, 243);
        doc.roundedRect(110, yPos, 85, 25, 2, 2, 'F');
        doc.text("TURNO DA TARDE", 115, yPos + 8);
        doc.setFontSize(12);
        doc.text(document.getElementById('vendasTarde').textContent, 115, yPos + 16);
        doc.setFontSize(10);
        doc.text(`${document.getElementById('qtdVendasTarde').textContent} vendas`, 115, yPos + 22);

        yPos += 35;

        doc.setFillColor(76, 175, 80);
        doc.roundedRect(65, yPos, 85, 25, 2, 2, 'F');
        doc.text("TOTAL DO DIA", 70, yPos + 8);
        doc.setFontSize(12);
        doc.text(document.getElementById('totalVendasDia').textContent, 70, yPos + 16);
        doc.setFontSize(10);
        doc.text(`${document.getElementById('totalVendasCount').textContent} vendas`, 70, yPos + 22);

        yPos += 35;

        doc.setFontSize(16);
        doc.setTextColor(90, 0, 0);
        doc.text("VENDAS DETALHADAS", 20, yPos);
        yPos += 10;

        doc.setFillColor(90, 0, 0);
        doc.rect(20, yPos, 170, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text("Hora", 22, yPos + 5);
        doc.text("Turno", 45, yPos + 5);
        doc.text("Valor", 100, yPos + 5);
        doc.text("Pagamento", 140, yPos + 5);

        yPos += 10;
        doc.setTextColor(0, 0, 0);

        const vendasDoDia = todasVendas.filter(v => v.data === (dataSelecionada || formatarDataInput(hoje)));

        vendasDoDia.forEach((venda, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
                doc.setFillColor(90, 0, 0);
                doc.rect(20, yPos, 170, 8, 'F');
                doc.setTextColor(255, 255, 255);
                doc.text("Hora", 22, yPos + 5);
                doc.text("Turno", 45, yPos + 5);
                doc.text("Valor", 100, yPos + 5);
                doc.text("Pagamento", 140, yPos + 5);
                yPos += 10;
                doc.setTextColor(0, 0, 0);
            }

            if (index % 2 === 0) {
                doc.setFillColor(240, 240, 240);
                doc.rect(20, yPos - 4, 170, 8, 'F');
            }

            const turnoTexto = venda.turno === 'manha' ? 'Manhã' : 'Tarde';
            const pagamentoTexto = {
                'dinheiro': 'Dinheiro',
                'pix': 'Pix',
                'credito': 'Cartão Crédito',
                'debito': 'Cartão Débito'
            }[venda.formaPagamento] || venda.formaPagamento;

            doc.text(venda.hora || "", 22, yPos + 1);
            doc.text(turnoTexto, 45, yPos + 1);
            doc.text(formatarMoeda(venda.valor), 100, yPos + 1);
            doc.text(pagamentoTexto, 140, yPos + 1);

            yPos += 8;
        });

        if (yPos > 200) {
            doc.addPage();
            yPos = 20;
        } else {
            yPos += 10;
        }

        doc.setFontSize(16);
        doc.setTextColor(90, 0, 0);
        doc.text("SAÍDAS DO DIA", 20, yPos);
        yPos += 10;

        doc.setFillColor(90, 0, 0);
        doc.rect(20, yPos, 170, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text("Descrição", 22, yPos + 5);
        doc.text("Valor", 120, yPos + 5);
        doc.text("Data", 150, yPos + 5);

        yPos += 10;
        doc.setTextColor(0, 0, 0);

        const saidasDoDia = todasSaidas.filter(s => s.data === (dataSelecionada || formatarDataInput(hoje)));

        saidasDoDia.forEach((saida, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
                doc.setFillColor(90, 0, 0);
                doc.rect(20, yPos, 170, 8, 'F');
                doc.setTextColor(255, 255, 255);
                doc.text("Descrição", 22, yPos + 5);
                doc.text("Valor", 120, yPos + 5);
                doc.text("Data", 150, yPos + 5);
                yPos += 10;
                doc.setTextColor(0, 0, 0);
            }

            if (index % 2 === 0) {
                doc.setFillColor(240, 240, 240);
                doc.rect(20, yPos - 4, 170, 8, 'F');
            }

            doc.text(saida.descricao.substring(0, 30) + (saida.descricao.length > 30 ? "..." : ""), 22, yPos + 1);
            doc.text(formatarMoeda(saida.valor), 120, yPos + 1);
            doc.text(saida.dataFormatada || saida.data || dataFormatada, 150, yPos + 1);

            yPos += 8;
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Página ${i} de ${pageCount}`, 105, 285, { align: "center" });
            doc.text(`Gerado em: ${new Date().toLocaleString()}`, 105, 290, { align: "center" });
        }

        const nomeArquivo = `Relatorio_Vendas_${dataSelecionada || dataFormatada.replace(/\//g, '-')}.pdf`;
        doc.save(nomeArquivo);

        mostrarMensagem('PDF gerado com sucesso!', 'success');

    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        mostrarMensagem('Erro ao gerar PDF. Tente novamente.', 'error');
    }
}

function gerarRelatorioGastos() {
    // ===== VERSÃO SIMPLIFICADA QUE FUNCIONA =====
    try {
        mostrarMensagem('Gerando relatório de gastos...', 'info');

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Relatório de Gastos', 20, 20);
        doc.setFontSize(12);
        doc.text(`Total de gastos: ${formatarMoeda(gastos.reduce((s, g) => s + g.valor, 0))}`, 20, 40);
        doc.text(`Quantidade: ${gastos.length}`, 20, 50);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 60);

        doc.save('relatorio-gastos.pdf');

        mostrarMensagem('Relatório de gastos gerado!', 'success');
    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao gerar relatório', 'error');
    }
}

function gerarRelatorioBoletos() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const mesSelecionado = document.getElementById('filtroMesBoletos').value;
        const [ano, mes] = mesSelecionado.split('-');
        const nomeMes = new Date(ano, mes - 1).toLocaleDateString('pt-BR', { month: 'long' });

        doc.setFontSize(20);
        doc.setTextColor(90, 0, 0);
        doc.text('Matutinho Aldeota', 105, 20, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text(`Relatório de Boletos - ${nomeMes}/${ano}`, 105, 30, { align: 'center' });

        doc.setFontSize(10);
        doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, 45);

        const boletosMes = boletos.filter(b => {
            const [boletoAno, boletoMes] = b.dataVencimento.split('-');
            return boletoAno === ano && boletoMes === mes;
        });

        const totalBoletos = boletosMes.length;
        const totalValor = boletosMes.reduce((sum, b) => sum + b.valor, 0);
        const pendentes = boletosMes.filter(b => b.status === 'pendente').length;
        const pagos = boletosMes.filter(b => b.status === 'pago').length;
        const atrasados = boletosMes.filter(b => b.status === 'atrasado').length;

        doc.text(`Total: ${formatarMoeda(totalValor)}`, 20, 52);
        doc.text(`Pendentes: ${pendentes} | Pagos: ${pagos} | Atrasados: ${atrasados}`, 20, 59);

        let yPos = 70;

        if (boletosMes.length > 0) {
            doc.setFontSize(12);
            doc.setTextColor(90, 0, 0);
            doc.text('Boletos Detalhados', 20, yPos);
            yPos += 10;

            const headers = [['Fornecedor', 'Descrição', 'Vencimento', 'Status', 'Valor']];
            const boletosData = boletosMes.map(b => {
                const vencimento = new Date(b.dataVencimento).toLocaleDateString('pt-BR');
                return [
                    b.fornecedorNome.substring(0, 15),
                    b.descricao.substring(0, 20),
                    vencimento,
                    b.status,
                    formatarMoeda(b.valor)
                ];
            });

            doc.autoTable({
                startY: yPos,
                head: headers,
                body: boletosData,
                theme: 'grid',
                headStyles: { fillColor: [90, 0, 0] },
                margin: { left: 20, right: 20 }
            });
        }

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                `Página ${i} de ${pageCount} - Matutinho Aldeota`,
                105, 285, { align: 'center' }
            );
        }

        doc.save(`Relatorio_Boletos_${nomeMes}_${ano}.pdf`);
        mostrarMensagem('Relatório de boletos gerado!', 'success');

    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem('Erro ao gerar relatório', 'error');
    }
}