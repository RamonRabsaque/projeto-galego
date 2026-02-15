// ========== SERVIÇO DE EXPORTAÇÃO ==========
function exportarHistoricoCSV() {
    if (!fornecedorSelecionado) return;

    const anoFiltro = document.getElementById('filtroAnoHistorico').value;
    const statusFiltro = document.getElementById('filtroStatusHistorico').value;

    let boletosParaExportar = boletos.filter(b => b.fornecedorId === fornecedorSelecionado.id);

    if (anoFiltro !== 'todos') {
        boletosParaExportar = boletosParaExportar.filter(b =>
            b.dataVencimento.startsWith(anoFiltro)
        );
    }

    if (statusFiltro !== 'todos') {
        boletosParaExportar = boletosParaExportar.filter(b =>
            b.status === statusFiltro
        );
    }

    if (boletosParaExportar.length === 0) {
        mostrarMensagem('Nenhum dado para exportar!', 'warning');
        return;
    }

    const headers = ['Descrição', 'Valor', 'Vencimento', 'Pagamento', 'Status', 'Observação'];
    const rows = boletosParaExportar.map(boleto => [
        `"${boleto.descricao}"`,
        formatarMoeda(boleto.valor),
        new Date(boleto.dataVencimento).toLocaleDateString('pt-BR'),
        boleto.dataPagamento ? new Date(boleto.dataPagamento).toLocaleDateString('pt-BR') : '-',
        boleto.status,
        `"${boleto.observacao || ''}"`
    ]);

    const csvContent = [headers, ...rows]
        .map(row => row.join(';'))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const nomeArquivo = `Historico_${fornecedorSelecionado.nome.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', nomeArquivo);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    mostrarMensagem('Histórico exportado com sucesso!', 'success');
}