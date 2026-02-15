// ========== VARIÁVEIS DE EDIÇÃO ==========
let vendaEditando = null;

// ========== FUNÇÕES AUXILIARES DE VENDAS ==========
function atualizarRelogio() {
    const relogioElemento = document.getElementById('relogio');
    if (relogioElemento) {
        const agora = new Date();
        const horas = agora.getHours().toString().padStart(2, '0');
        const minutos = agora.getMinutes().toString().padStart(2, '0');
        const segundos = agora.getSeconds().toString().padStart(2, '0');
        relogioElemento.textContent = `${horas}:${minutos}:${segundos}`;
    }
}

setInterval(atualizarRelogio, 1000);

function configurarMascarasValor() {
    console.log('Configurando máscaras de valor...');

    const idsCampos = ['valorVenda', 'valorSaida', 'gastoValor', 'boletoValor'];

    idsCampos.forEach(id => {
        const campo = document.getElementById(id);
        if (!campo) return;

        campo.addEventListener('input', function() {
            let v = this.value.replace(/\D/g, '');

            if (v === '') {
                this.value = '';
                return;
            }

            let n = (parseInt(v) / 100).toFixed(2);
            let partes = n.split('.');
            partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            this.value = 'R$ ' + partes[0] + ',' + partes[1];
        });

        campo.addEventListener('click', function() {
            this.select();
        });
    });
}