export let equiposList = [];

export async function cargarEquiposDesdeJSON() {
    try {
        const response = await fetch('./data/equipos.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        equiposList = data;

        const equiposGuardados = localStorage.getItem('equiposDB');
        if (equiposGuardados) {
            try {
                equiposList = JSON.parse(equiposGuardados);
            } catch (e) {
                localStorage.removeItem('equiposDB');
            }
        } else {
            localStorage.setItem('equiposDB', JSON.stringify(equiposList));
        }
    } catch (error) {
    }
}
export function guardarEquiposEnLocalStorage() {
    localStorage.setItem('equiposDB', JSON.stringify(equiposList));
}