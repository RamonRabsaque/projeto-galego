// ========== SISTEMA DE NOTIFICAÇÕES ==========
function mostrarMensagem(mensagem, tipo = 'info') {
    const notificationArea = document.getElementById('notification-area');

    document.querySelectorAll('.notification').forEach(notif => {
        notif.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notif.remove(), 300);
    });

    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : tipo === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${mensagem}</span>
    `;

    notificationArea.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}