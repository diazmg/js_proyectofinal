import { Abonado } from './clases.js';


export function getClienteActualDesdeLocalStorage() {
    const clienteGuardadoJSON = localStorage.getItem("clienteActual");
    if (clienteGuardadoJSON) {
        try {
            const parsedCliente = JSON.parse(clienteGuardadoJSON);
            return Abonado.fromPlainObject(parsedCliente);
        } catch (e) {
            localStorage.removeItem("clienteActual");
            return null;
        }
    }
    return null;
}
export function guardarClienteActualEnLocalStorage(cliente) {
    if (cliente) {
        localStorage.setItem('clienteActual', JSON.stringify(cliente));
    } else {
        localStorage.removeItem('clienteActual');
    }
}


export async function validarYObtenerAbonado(numero) {
    try {
        const response = await fetch('./data/clientes.json');
        if (!response.ok) {
            throw new Error(`HTTP Errror! status: ${response.status}`);
        }
        const data = await response.json();
        const abonadoEncontrado = data.find(cliente => cliente.recurso === numero);
        if (abonadoEncontrado) {
            return { success: true, abonado: Abonado.fromPlainObject(abonadoEncontrado), message: "Abonado encontrado" };
        } else {
            return { success: false, abonado: null, message: "El número de línea ingresado no existe." }
        }
    } catch (error) {
        return { success: false, abonado: null, message: `Error de carga de datos: ${error.message}` };
    }
}