async function initAccounts() {
    if (!await window.auth.checkSession()) return;
    const workspaceId = localStorage.getItem('workspaceId');
    loadAccounts(workspaceId);

    const modal = document.getElementById('accountModal');
    document.getElementById('addAccountBtn').onclick = () => modal.classList.remove('hidden');
    document.getElementById('closeAccountModal').onclick = () => modal.classList.add('hidden');

    document.getElementById('accountForm').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.workspaceId = parseInt(workspaceId);
        
        // Fix for Spanish decimal separator and API name
        let initialBalanceStr = data.saldoInicial.toString().replace(',', '.');
        data.saldoInicial = parseFloat(initialBalanceStr);
        if (isNaN(data.saldoInicial)) data.saldoInicial = 0;
        
        try {
            await window.api.accounts.create(data);
            modal.classList.add('hidden');
            e.target.reset();
            loadAccounts(workspaceId);
        } catch (error) { 
            console.error('Error al crear cuenta:', error);
            alert(error.message); 
        }
    };
}

async function loadAccounts(workspaceId) {
    try {
        const response = await window.api.accounts.list(workspaceId);
        console.log('Respuesta cuentas:', response);
        
        const list = document.getElementById('accountsList');
        if (!list) return;
        list.innerHTML = '';
        
        // Handle raw array or envelope { data: [...] }
        const dataArray = Array.isArray(response.data) ? response.data : (response.data.data || []);
        
        if (dataArray && dataArray.length > 0) {
            dataArray.forEach(acc => {
                const card = document.createElement('div');
                card.className = 'bg-white p-6 rounded-xl border border-gray-100 shadow-xl flex flex-col gap-4 relative overflow-hidden group';
                card.innerHTML = `
                    <div class="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div class="relative">
                        <div class="flex justify-between items-start mb-4">
                            <span class="px-2 py-1 bg-blue-100 text-blue-900 text-[10px] font-bold rounded uppercase tracking-wider">${acc.tipo}</span>
                            <span class="material-symbols-outlined text-gray-300">account_balance</span>
                        </div>
                        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-tighter">${acc.nombre}</h3>
                        <p class="text-xs font-medium text-gray-400 font-mono">${acc.numero || '**** ****'}</p>
                        <div class="mt-6">
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Saldo Actual</p>
                            <p class="text-2xl font-extrabold text-blue-900 tracking-tighter mt-1">${window.utils.formatCurrency(acc.saldoActual || acc.saldoInicial || 0)}</p>
                        </div>
                    </div>
                `;
                list.appendChild(card);
            });
        } else {
            list.innerHTML = '<div class="col-span-full text-center py-10 text-gray-400 italic font-medium">No se encontraron cuentas. Cree su primera cuenta arriba.</div>';
        }
    } catch (error) { 
        console.error('Error al cargar cuentas:', error);
    }
}

document.addEventListener('DOMContentLoaded', initAccounts);
