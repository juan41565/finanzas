let allCategories = [];

async function initMovements() {
    if (!await window.auth.checkSession()) return;

    const workspaceId = localStorage.getItem('workspaceId');
    const nameEl = document.getElementById('currentWorkspace');
    if (nameEl) nameEl.textContent = localStorage.getItem('workspaceName');

    loadMovements(workspaceId);
    await loadCategories(workspaceId);
    await loadBeneficiaries(workspaceId);
    await loadAccounts(workspaceId);
    await loadCreditCards(workspaceId);

    const modal = document.getElementById('movementModal');
    const addBtn = document.getElementById('addMovementBtn');
    const closeBtn = document.getElementById('closeMovementModal');
    const form = document.getElementById('movementForm');
    const typeSelect = document.getElementById('typeSelect');
    const paymentMethodSelect = document.getElementById('paymentMethodSelect');

    if (addBtn) addBtn.onclick = () => {
        modal.classList.remove('hidden');
        filterCategoriesByType();
        toggleSourceInputs();
    };
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');

    if (typeSelect) typeSelect.onchange = () => filterCategoriesByType();
    if (paymentMethodSelect) paymentMethodSelect.onchange = () => toggleSourceInputs();

    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            console.log('Capturando datos del formulario...');
            const accountSelect = document.getElementById('accountSelect');
            const cardSelect = document.getElementById('cardSelect');
            
            data.workspaceId = parseInt(workspaceId);
            data.monto = parseFloat(data.monto);
            data.categoriaId = parseInt(data.categoriaId);
            
            if (data.beneficiarioId) data.beneficiarioId = parseInt(data.beneficiarioId);
            else delete data.beneficiarioId;

            if (data.medioPago === 'TARJETA_CREDITO') {
                const cardId = cardSelect.value;
                if (!cardId && cardId !== "0") {
                    alert('Por favor seleccione una tarjeta de crédito.');
                    return;
                }
                data.tarjetaCreditoId = parseInt(cardId);
                data.cuentaId = null;
            } else {
                const accountId = accountSelect.value;
                console.log('Valor detectado en selector de cuenta:', accountId);
                if (!accountId && accountId !== "0") {
                    alert('Por favor seleccione una cuenta de origen/destino.');
                    return;
                }
                data.cuentaId = parseInt(accountId);
                data.tarjetaCreditoId = null;
            }

            console.log('Datos listos para enviar:', JSON.stringify(data, null, 2));

            try {
                await window.api.transactions.create(data);
                modal.classList.add('hidden');
                e.target.reset();
                loadMovements(workspaceId);
            } catch (error) {
                console.error('Error al crear movimiento:', error);
                alert(error.message);
            }
        };
    }
}

function toggleSourceInputs() {
    const methodEl = document.getElementById('paymentMethodSelect');
    if (!methodEl) return;
    const method = methodEl.value;
    const accountGroup = document.getElementById('accountGroup');
    const cardGroup = document.getElementById('cardGroup');
    
    if (method === 'TARJETA_CREDITO') {
        accountGroup.classList.add('hidden');
        cardGroup.classList.remove('hidden');
        document.getElementById('cardSelect').required = true;
        document.getElementById('accountSelect').required = false;
    } else {
        accountGroup.classList.remove('hidden');
        cardGroup.classList.add('hidden');
        document.getElementById('accountSelect').required = true;
        document.getElementById('cardSelect').required = false;
    }
}

async function loadMovements(workspaceId) {
    try {
        const response = await window.api.transactions.list(workspaceId);
        const body = document.getElementById('movementsBody');
        if (!body) return;
        body.innerHTML = '';

        const dataArray = Array.isArray(response.data) ? response.data : (response.data.data || []);

        if (dataArray && dataArray.length > 0) {
            dataArray.forEach(tx => {
                const isExpense = tx.tipo === 'GASTO';
                const tr = document.createElement('tr');
                tr.className = 'group hover:bg-slate-50 transition-colors';
                tr.innerHTML = `
                    <td class="px-6 py-5">
                        <span class="text-sm font-medium text-gray-900">${window.utils.formatDate(tx.fecha)}</span>
                    </td>
                    <td class="px-6 py-5">
                        <span class="text-sm font-semibold text-gray-900">${tx.descripcion}</span>
                    </td>
                    <td class="px-6 py-5">
                        <span class="px-2.5 py-1 text-[10px] font-bold rounded ${isExpense ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'} uppercase">
                            ${tx.categoriaNombre}
                        </span>
                    </td>
                    <td class="px-6 py-5 text-right font-bold ${isExpense ? 'text-red-700' : 'text-green-700'}">
                        ${isExpense ? '-' : '+'}${window.utils.formatCurrency(tx.monto)}
                    </td>
                    <td class="px-6 py-5 text-right">
                        <button class="opacity-0 group-hover:opacity-100 transition-opacity" onclick="deleteTx(${tx.id})">
                            <span class="material-symbols-outlined text-gray-400 text-sm">delete</span>
                        </button>
                    </td>
                `;
                body.appendChild(tr);
            });
        } else {
            body.innerHTML = '<tr><td colspan="5" class="px-6 py-10 text-center text-gray-400 italic">No hay movimientos registrados.</td></tr>';
        }
    } catch (error) {
        console.error(error);
    }
}

async function loadCategories(workspaceId) {
    try {
        const response = await window.api.categories.list(workspaceId);
        const dataArray = Array.isArray(response.data) ? response.data : (response.data.data || []);
        allCategories = dataArray;
    } catch (error) {
        console.error(error);
    }
}

function filterCategoriesByType() {
    const type = document.getElementById('typeSelect').value;
    const select = document.getElementById('categorySelect');
    if (!select) return;
    select.innerHTML = '';
    const filtered = allCategories.filter(cat => cat.tipo === type);
    filtered.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.nombre;
        select.appendChild(opt);
    });
}

async function loadBeneficiaries(workspaceId) {
    try {
        const response = await window.api.beneficiaries.list(workspaceId);
        const select = document.getElementById('beneficiarySelect');
        if (!select) return;
        select.innerHTML = '<option value="">-- Sin beneficiario --</option>';
        const dataArray = Array.isArray(response.data) ? response.data : (response.data.data || []);
        if (dataArray) {
            dataArray.forEach(ben => {
                const opt = document.createElement('option');
                opt.value = ben.id;
                opt.textContent = ben.nombre;
                select.appendChild(opt);
            });
        }
    } catch (error) {
        console.error(error);
    }
}

async function loadAccounts(workspaceId) {
    try {
        const response = await window.api.accounts.list(workspaceId);
        const select = document.getElementById('accountSelect');
        if (!select) return;
        select.innerHTML = '';
        const dataArray = Array.isArray(response.data) ? response.data : (response.data.data || []);
        console.log('Cargando cuentas en selector:', dataArray);
        if (dataArray) {
            dataArray.forEach(acc => {
                const opt = document.createElement('option');
                opt.value = acc.id;
                opt.textContent = `${acc.nombre} (${window.utils.formatCurrency(acc.saldoActual || acc.saldoInicial || 0)})`;
                select.appendChild(opt);
            });
        }
    } catch (error) {
        console.error(error);
    }
}

async function loadCreditCards(workspaceId) {
    try {
        const response = await window.api.creditCards.list(workspaceId);
        const select = document.getElementById('cardSelect');
        if (!select) return;
        select.innerHTML = '';
        const dataArray = Array.isArray(response.data) ? response.data : (response.data.data || []);
        if (dataArray) {
            dataArray.forEach(card => {
                const opt = document.createElement('option');
                opt.value = card.id;
                opt.textContent = `${card.nombre} (${card.numero}) - Cupo: ${window.utils.formatCurrency(card.cupoDisponible)}`;
                select.appendChild(opt);
            });
        }
    } catch (error) {
        console.error(error);
    }
}

window.deleteTx = async (id) => {
    if (!confirm('¿Está seguro de eliminar este movimiento?')) return;
    try {
        await window.api.transactions.delete(id);
        const workspaceId = localStorage.getItem('workspaceId');
        loadMovements(workspaceId);
    } catch (error) {
        alert(error.message);
    }
};

document.addEventListener('DOMContentLoaded', initMovements);
