export function initializeSidebar() {
    const toggleButton = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.controls-sidebar');
    const container = document.querySelector('.container');

    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        container.classList.toggle('sidebar-collapsed');
        toggleButton.classList.toggle('rotated');
    });
}