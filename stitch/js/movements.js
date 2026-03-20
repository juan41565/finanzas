async function initMovements() {
    if (!await window.auth.checkSession()) return;

    const workspaceId = localStorage.getItem('workspaceId');
    const nameEl = document.getElementById('currentWorkspace');
    if (nameEl) nameEl.textContent = localStorage.getItem('workspaceName');

    loadMovements(workspaceId);
    loadCategories(workspaceId);

    const modal = document.getElementById('movementModal');
    const addBtn = document.getElementById('addMovementBtn');
    const closeBtn = document.getElementById('closeMovementModal');
    const form = document.getElementById('movementForm');

    if (addBtn) addBtn.onclick = () => modal.classList.remove('hidden');
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');

    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.workspaceId = workspaceId;
            data.monto = parseFloat(data.monto);
            data.categoriaId = parseInt(data.categoriaId);

            try {
                await window.api.transactions.create(data);
                modal.classList.add('hidden');
                e.target.reset();
                loadMovements(workspaceId);
            } catch (error) {
                alert(error.message);
            }
        };
    }
}

async function loadMovements(workspaceId) {
    try {
        const response = await window.api.transactions.list(workspaceId);
        const body = document.getElementById('movementsBody');
        if (!body) return;
        body.innerHTML = '';

        response.data.forEach(tx => {
            const isExpense = tx.tipo === 'GASTO';
            const tr = document.createElement('tr');
            tr.className = 'group hover:bg-surface-container-low transition-colors';
            tr.innerHTML = `
                <td class="px-6 py-5">
                    <span class="text-sm font-medium text-on-surface">${window.utils.formatDate(tx.fecha)}</span>
                </td>
                <td class="px-6 py-5">
                    <span class="text-sm font-semibold text-on-surface">${tx.descripcion}</span>
                </td>
                <td class="px-6 py-5">
                    <span class="px-2.5 py-1 text-[10px] font-bold rounded ${isExpense ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'} uppercase">
                        ${tx.categoriaNombre}
                    </span>
                </td>
                <td class="px-6 py-5 text-right font-bold ${isExpense ? 'text-error' : 'text-secondary'}">
                    ${isExpense ? '-' : '+'}${window.utils.formatCurrency(tx.monto)}
                </td>
                <td class="px-6 py-5 text-right">
                    <button class="opacity-0 group-hover:opacity-100 transition-opacity" onclick="deleteTx(${tx.id})">
                        <span class="material-symbols-outlined text-outline text-sm">delete</span>
                    </button>
                </td>
            `;
            body.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
    }
}

async function loadCategories(workspaceId) {
    try {
        const response = await window.api.categories.list(workspaceId);
        const select = document.getElementById('categorySelect');
        if (!select) return;
        select.innerHTML = '';
        response.data.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = `${cat.nombre} (${cat.tipo})`;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error(error);
    }
}

window.deleteTx = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
        await window.api.transactions.delete(id);
        const workspaceId = localStorage.getItem('workspaceId');
        loadMovements(workspaceId);
    } catch (error) {
        alert(error.message);
    }
};

document.addEventListener('DOMContentLoaded', initMovements);
