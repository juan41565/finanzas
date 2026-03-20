async function initDashboard() {
    if (!await window.auth.checkSession()) return;

    const workspaceId = localStorage.getItem('workspaceId');
    if (!workspaceId) {
        window.auth.logout();
        return;
    }

    const now = new Date();
    const anio = now.getFullYear();
    const mes = now.getMonth() + 1;

    try {
        const summaryResponse = await window.api.dashboard.getMonthlySummary(workspaceId, anio, mes);
        if (summaryResponse.data) {
            const data = summaryResponse.data;
            document.getElementById('netBalance').textContent = window.utils.formatCurrency(data.balanceNeto || 0);
            document.getElementById('totalIncome').textContent = window.utils.formatCurrency(data.totalIngresos || 0);
            document.getElementById('totalExpenses').textContent = window.utils.formatCurrency(data.totalGastos || 0);
        }

        const transactionsResponse = await window.api.transactions.list(workspaceId);
        if (transactionsResponse.data && transactionsResponse.data.length > 0) {
            const list = document.getElementById('recentTransactions');
            list.innerHTML = '';
            
            transactionsResponse.data.slice(0, 5).forEach(tx => {
                const isExpense = tx.tipo === 'GASTO';
                const color = isExpense ? 'red' : 'green';
                const icon = isExpense ? 'receipt_long' : 'payments';
                
                const item = document.createElement('div');
                item.className = 'flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors';
                item.innerHTML = `
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-${color}-50 flex items-center justify-center text-${color}-700">
                            <span class="material-symbols-outlined text-xl">${icon}</span>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-gray-900">${tx.descripcion}</p>
                            <p class="text-[10px] text-gray-400 font-medium">${window.utils.formatDate(tx.fecha)} • ${tx.categoriaNombre}</p>
                        </div>
                    </div>
                    <div class="text-sm font-bold text-${color}-700">${isExpense ? '-' : '+'}${window.utils.formatCurrency(tx.monto)}</div>
                `;
                list.appendChild(item);
            });
        } else {
            document.getElementById('recentTransactions').innerHTML = '<p class="text-center text-gray-400 text-xs italic py-8">No hay actividad reciente.</p>';
        }

        initChart(workspaceId, anio);

    } catch (error) {
        console.error('Dashboard init error:', error);
    }
}

async function initChart(workspaceId, anio) {
    try {
        const cashFlowResponse = await window.api.dashboard.getYearlyCashFlow(workspaceId, anio);
        const ctx = document.getElementById('balanceChart').getContext('2d');
        const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const incomes = new Array(12).fill(0);
        const expenses = new Array(12).fill(0);

        if (cashFlowResponse.data) {
            cashFlowResponse.data.forEach(item => {
                const monthIdx = (item.mes || 1) - 1;
                incomes[monthIdx] = item.ingresos || 0;
                expenses[monthIdx] = item.gastos || 0;
            });
        }

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Ingresos', data: incomes, backgroundColor: '#00346f', borderRadius: 4 },
                    { label: 'Gastos', data: expenses, backgroundColor: '#71dba6', borderRadius: 4 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top', align: 'end', labels: { boxWidth: 10, font: { family: 'Manrope', size: 10 } } } },
                scales: {
                    y: { beginAtZero: true, grid: { display: false }, ticks: { font: { size: 10 }, callback: v => window.utils.formatCurrency(v).replace(',00', '') } },
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } }
                }
            }
        });
    } catch (error) {
        console.error('Chart init error:', error);
    }
}

document.addEventListener('DOMContentLoaded', initDashboard);
