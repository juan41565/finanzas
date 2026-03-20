async function initCards() {
    if (!await window.auth.checkSession()) return;
    const workspaceId = localStorage.getItem('workspaceId');
    loadCards(workspaceId);

    const modal = document.getElementById('cardModal');
    document.getElementById('addCardBtn').onclick = () => modal.classList.remove('hidden');
    document.getElementById('closeCardModal').onclick = () => modal.classList.add('hidden');

    document.getElementById('cardForm').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.workspaceId = parseInt(workspaceId);
        data.cupoTotal = parseFloat(data.cupoTotal);
        data.diaCorte = parseInt(data.diaCorte);
        try {
            await window.api.request('/api/tarjetas-credito', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            modal.classList.add('hidden');
            e.target.reset();
            loadCards(workspaceId);
        } catch (error) { 
            console.error('Error al crear tarjeta:', error);
            alert(error.message); 
        }
    };
}

async function loadCards(workspaceId) {
    try {
        const response = await window.api.creditCards.list(workspaceId);
        console.log('Respuesta tarjetas:', response);
        
        const list = document.getElementById('cardsList');
        if (!list) return;
        list.innerHTML = '';
        
        const dataArray = Array.isArray(response.data) ? response.data : (response.data.data || []);
        
        if (dataArray && dataArray.length > 0) {
            dataArray.forEach(card => {
                const item = document.createElement('div');
                item.className = 'bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden text-white flex flex-col justify-between h-56 group';
                item.innerHTML = `
                    <div class="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125"></div>
                    <div class="relative z-10 flex justify-between items-start">
                        <span class="text-xl font-extrabold italic tracking-widest text-white/40">CARD</span>
                        <span class="material-symbols-outlined text-yellow-400 text-3xl">chip_extraction</span>
                    </div>
                    <div class="relative z-10 mt-auto">
                        <p class="text-sm font-medium tracking-[0.2em] mb-1">${card.nombre}</p>
                        <p class="text-lg font-bold tracking-widest">**** **** **** ${card.numero}</p>
                        <div class="flex justify-between items-end mt-4">
                            <div>
                                <p class="text-[8px] uppercase text-white/40 font-bold">Cupo Disponible</p>
                                <p class="text-xl font-bold">${window.utils.formatCurrency(card.cupoDisponible)}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-[8px] uppercase text-white/40 font-bold">Día de Corte</p>
                                <p class="text-sm font-bold">${card.diaCorte}</p>
                            </div>
                        </div>
                    </div>
                `;
                list.appendChild(item);
            });
        } else {
            list.innerHTML = '<div class="col-span-full text-center py-10 text-gray-400 italic font-medium">No se encontraron tarjetas registradas.</div>';
        }
    } catch (error) { 
        console.error('Error al cargar tarjetas:', error);
    }
}

document.addEventListener('DOMContentLoaded', initCards);
