async function initCategories() {
    if (!await window.auth.checkSession()) return;

    const workspaceId = localStorage.getItem('workspaceId');
    const nameEl = document.getElementById('currentWorkspace');
    if (nameEl) nameEl.textContent = localStorage.getItem('workspaceName');

    loadCategories(workspaceId);

    const modal = document.getElementById('categoryModal');
    const addBtn = document.getElementById('addCategoryBtn');
    const closeBtn = document.getElementById('closeModal');
    const form = document.getElementById('categoryForm');

    if (addBtn) addBtn.onclick = () => modal.classList.remove('hidden');
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');

    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.workspaceId = workspaceId;

            try {
                await window.api.categories.create(data);
                modal.classList.add('hidden');
                e.target.reset();
                loadCategories(workspaceId);
            } catch (error) {
                alert(error.message);
            }
        };
    }
}

async function loadCategories(workspaceId) {
    try {
        const response = await window.api.categories.list(workspaceId);
        const incomeDiv = document.getElementById('incomeCategories');
        const expenseDiv = document.getElementById('expenseCategories');
        
        if (incomeDiv) incomeDiv.innerHTML = '';
        if (expenseDiv) expenseDiv.innerHTML = '';

        const dataArray = Array.isArray(response.data) ? response.data : (response.data.data || []);
        
        dataArray.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'bg-white p-6 rounded-xl border border-outline-variant/10 shadow-sm flex justify-between items-center';
            card.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-${cat.tipo === 'INGRESO' ? 'secondary' : 'error'}/10">
                        <span class="material-symbols-outlined text-${cat.tipo === 'INGRESO' ? 'secondary' : 'error'}">${cat.tipo === 'INGRESO' ? 'payments' : 'receipt_long'}</span>
                    </div>
                    <span class="font-bold text-on-surface">${cat.nombre}</span>
                </div>
            `;
            
            if (cat.tipo === 'INGRESO' && incomeDiv) incomeDiv.appendChild(card);
            else if (expenseDiv) expenseDiv.appendChild(card);
        });
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', initCategories);
