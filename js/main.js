import { Abonado } from './clases.js';
import {
    getClienteActualDesdeLocalStorage,
    validarYObtenerAbonado,
    guardarClienteActualEnLocalStorage
} from './clientes.js';
import { cargarPacksDesdeJSON, packsGBNacionalesList, packsGBRoamingList } from './packs.js';
import { cargarEquiposDesdeJSON, equiposList, guardarEquiposEnLocalStorage } from './equipos.js';

let clienteActual = null;

const loginContainer = document.getElementById("login");
const menuPrincipal = document.getElementById("menuPrincipal");
const resultadoOperacionContainer = document.getElementById("resultadoOperacionContainer");
const recargaContainer = document.getElementById("recargaContainer");
const packsContainer = document.getElementById("packsContainer");
const historialPacksContainer = document.getElementById("historialPacks");
const tiendaEquiposContainer = document.getElementById("tiendaEquiposContainer");
const equiposListado = document.getElementById("equiposListado");
const carritoContainer = document.getElementById("carritoContainer");
const listaCarrito = document.getElementById("listaCarrito");
const historialComprasEquiposContainer = document.getElementById("historialComprasEquiposContainer");
const historialEquiposListado = document.getElementById("historialEquiposListado");
const subtotalCarritoSpan = document.getElementById("subtotalCarrito");
const descuentoAplicadoSpan = document.getElementById("descuentoAplicado");
const totalPagarSpan = document.getElementById("totalPagar");
const codigoDescuentoInput = document.getElementById("codigoDescuentoInput");
const codigosDescuento = [
    { codigo: "PROYECTOFINAL", valor: 0.20, tipo: "porcentaje" },
    { codigo: "SUPERSALE", valor: 100, tipo: "fijo" },
    { codigo: "DOSPORUNO", valor: 0.50, tipo: "porcentaje", minCompra: 500000 }
];


const lineaInput = document.getElementById("lineaInput");
const btnLogin = document.getElementById("btnLogin");
const resultadoValidacion = document.getElementById("resultadoValidacion");

const btnConsultaDeSaldo = document.getElementById("btnConsultaDeSaldo");
const btnRecargaDeSaldo = document.getElementById("btnRecargaDeSaldo");
const btnComprarPacks = document.getElementById("btnComprarPacks");
const btnVisualizarHistorialDePacks = document.getElementById("btnVisualizarHistorialDePacks");
const btnLogOut = document.getElementById("btnLogOut");
const btnVerTiendaEquipos = document.getElementById("btnVerTiendaEquipos");
const btnVerCarrito = document.getElementById("btnVerCarrito");
const contadorCarrito = document.getElementById("contadorCarrito"); 
const btnVerHistorialComprasEquipos = document.getElementById("btnVerHistorialComprasEquipos");
const btnVolverATiendaDesdeHistorialEquipos = document.getElementById("btnVolverATiendaDesdeHistorialEquipos");


// Elementos de Recarga
const montoRecargaSelect = document.getElementById("montoRecargaSelect");
const btnRecargarSaldo = document.getElementById("btnRecargarSaldo");

// Elementos del Carrito (botones)
const btnAplicarDescuento = document.getElementById("btnAplicarDescuento");
const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");
const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
const btnVolverTiendaDesdeCarrito = document.getElementById("btnVolverTiendaDesdeCarrito");


function mostrarMensaje(mensaje, tipo = 'info') {
    Swal.fire({
        position: 'top-end',
        icon: tipo,
        title: mensaje,
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        customClass: {
            popup: 'swal2-toast-popup'
        }
    });
}

function limpiarTodosLosContenedores() {
    loginContainer.style.display = "none";
    recargaContainer.style.display = "none";
    packsContainer.style.display = "none";
    historialPacksContainer.style.display = "none";
    tiendaEquiposContainer.style.display = "none";
    historialComprasEquiposContainer.style.display = "none";
    carritoContainer.style.display = "none";
    resultadoOperacionContainer.style.display = "none";
    resultadoOperacionContainer.innerHTML = "";

    const mensajeResultadoDiv = document.getElementById("mensajeResultado");
    if (mensajeResultadoDiv) mensajeResultadoDiv.innerText = "";
}

function actualizarUI() {
    limpiarTodosLosContenedores();

    if (clienteActual) {
        menuPrincipal.style.display = "block";
        resultadoValidacion.innerHTML = `✅Bienvenido/a ${clienteActual.nombre} ${clienteActual.apellido}`;
    } else {
        menuPrincipal.style.display = "none";
        loginContainer.style.display = "block";
        lineaInput.value = "";
        resultadoValidacion.innerHTML = "";
        mostrarMensaje("Usuario no encontrado, por favor, inicia sesión", "info");
    }
    actualizarContadorCarrito();
}
function actualizarContadorCarrito() {
    if (clienteActual && clienteActual.carritoCompras) {
        const totalItems = clienteActual.carritoCompras.reduce((acc, item) => acc + item.cantidad, 0);
        contadorCarrito.textContent = totalItems;
        contadorCarrito.style.display = totalItems > 0 ? 'inline' : 'none';
    } else {
        contadorCarrito.textContent = '0';
        contadorCarrito.style.display = 'none';
    }
}

//Función para validar el número de línea ingresado
async function validarLinea() {
    //Tomo el valor del input con DOM
    const numeroIngresado = document.getElementById('lineaInput').value.trim();

    if (!/^\d{10}$/.test(numeroIngresado)) {
        mostrarMensaje('⚠️El número ingresado debe tener 10 dígitos.', "error");
        clienteActual = null;
        return;
    }

    const validacionResultado = await validarYObtenerAbonado(numeroIngresado);

    if (validacionResultado.success) {
        clienteActual = validacionResultado.abonado;
        guardarClienteActualEnLocalStorage(clienteActual);
        mostrarMensaje(`🎉Sesión iniciada correctamente`, "success");
        mostrarMensaje(`Hola, ${clienteActual.nombre}!`, "info");
    } else {
        clienteActual = null;
        mostrarMensaje(`❌${validacionResultado.message}`, "error");
    }
    actualizarUI();
}

function cerrarSesion() {
    guardarClienteActualEnLocalStorage(null);
    clienteActual = null;
    mostrarMensaje('Sesion cerrada.', "info")
    actualizarUI();
}

//Funciones del Menú Principal
//Función CONSULTA DE SALDO
function mostrarConsultaDeSaldo() {
    limpiarTodosLosContenedores();
    resultadoOperacionContainer.style.display = "block";

    const saldoTotal = clienteActual.obtenerSaldoTotal();
    let mensajeSaldoHTML = "";

    if (clienteActual.tipoPlan === 'Libre') {
        mensajeSaldoHTML = `
        Tu saldo de Abono actual es de: $${clienteActual.monederoAbono.toLocaleString('es-AR')} <br>
        Saldo total: $${saldoTotal.toLocaleString('es-AR')} <br>
        Datos disponibles: ${clienteActual.datosDisponibles} GB <br>
        Datos para Roaming: ${clienteActual.datosRoaming} GB
        `;
    } else {
        mensajeSaldoHTML = `
        Saldo de Recargas: $${clienteActual.monederoPrepago.toLocaleString('es-AR')} <br>
        Saldo de Abono: $${clienteActual.monederoAbono.toLocaleString('es-AR')} <br>
        Saldo total: $${saldoTotal.toLocaleString('es-AR')} <br>
        Datos disponibles: ${clienteActual.datosDisponibles} GB <br>
        Datos para Roaming: ${clienteActual.datosRoaming} GB
        `;
    }
    resultadoOperacionContainer.innerHTML = mensajeSaldoHTML;
}

//Función para recargar saldo en el Monedero de Recargas
function recargarSaldo() {
    const mensajeResultadoDiv = document.getElementById("mensajeResultado");
    if (mensajeResultadoDiv) mensajeResultadoDiv.innerText = "";

    if (!clienteActual) {
        mostrarMensaje("❌Error. No hay cliente cargado.", "error");
        return;
    }
    if (clienteActual.tipoPlan === 'Libre') {
        return mostrarMensaje("⚠️El plan Libre no admite recargas.", "error");
    }
    const montoSeleccionado = montoRecargaSelect.value;

    if (!montoSeleccionado) {
        mostrarMensaje(`⚠️ Por favor, elegí un monto válido para recargar`, "error");
        return;
    }
    const monto = parseInt(montoSeleccionado);
    clienteActual.monederoPrepago += monto;
    mostrarMensaje(`La recarga de $${monto.toLocaleString('es-AR')} ha sido exitosa.`, "success");
    montoRecargaSelect.value = "";
    guardarClienteActualEnLocalStorage(clienteActual);
    resultadoOperacionContainer.style.display = "block";
    resultadoOperacionContainer.innerHTML = `
    <h4> ¡La recarga fue exitosa!</h4>
    <p> Recargaste <strong>$${monto.toLocaleString('es-AR')}</strong>.</p>
    `;

    mostrarMensaje(`Recarga de $${monto.toLocaleString('es-AR')} exitosa.`, "success");
}

function mostrarRecargarSaldo() {
    limpiarTodosLosContenedores();
    recargaContainer.style.display = "block";
    const mensajeResultadoDiv = document.getElementById("mensajeResultado");
    if (mensajeResultadoDiv) mensajeResultadoDiv.innerText = "";
}

function renderizarPacks() {
    limpiarTodosLosContenedores();
    packsContainer.innerHTML = '';

    if (!clienteActual) {
        mostrarMensaje("❌ Error. Debes iniciar sesión para ver los packs.", "error");
        return;
    }

    // Renderizar Packs Nacionales
    const h3Nacionales = document.createElement("h3");
    h3Nacionales.textContent = "Packs Nacionales";
    packsContainer.appendChild(h3Nacionales);

    if (packsGBNacionalesList.length > 0) {
        packsGBNacionalesList.forEach(pack => {
            const packCard = document.createElement("div");
            packCard.className = "pack-card";

            packCard.innerHTML = `
            <h4>${pack.packNombre}</h4>
            <p>Gigabytes: ${pack.cantidadGBNacional} GB</p>
            <p>Vigencia: ${pack.duracionPack} días</p>
            <p>Precio: $${pack.packPrecio.toLocaleString('es-AR')}</p>
            <button class="btnComprarPack" data-pack="N-${pack.id}">Comprar</button>
            `;
            packsContainer.appendChild(packCard);
        });
    } else {
        packsContainer.innerHTML += '<p>No hay packs nacionales disponibles actualmente.</p>';
    }


    const h3Roaming = document.createElement("h3");
    h3Roaming.textContent = "Packs Roaming";
    packsContainer.appendChild(h3Roaming);

    if (packsGBRoamingList.length > 0) {
        packsGBRoamingList.forEach(pack => {
            const packCard = document.createElement("div");
            packCard.className = "pack-card";

            packCard.innerHTML = `
            <h4>${pack.packNombre}</h4>
            <p>Gigabytes: ${pack.cantidadGBRoaming} GB</p>
            <p>Vigencia: ${pack.duracionPack} días</p>
            <p>Precio: $${pack.packPrecio.toLocaleString('es-AR')}</p>
            <button class="btnComprarPack" data-pack="R-${pack.id}">Comprar</button>
            `;
            packsContainer.appendChild(packCard);
        });
    }
    else {
        packsContainer.innerHTML += '<p>No hay packs de Roaming disponibles actualmente.</p>';
    }

    packsContainer.querySelectorAll(".btnComprarPack").forEach(button => {
        button.addEventListener("click", (e) => {
            const id = e.target.dataset.pack;
            comprarPack(id);
        });
    });
    packsContainer.style.display = "block";
}

function comprarPack(idPackConPrefijo) {
    limpiarTodosLosContenedores();
    if (!clienteActual) {
        mostrarMensaje("❌ Error. No hay cliente cargado.", "error");
        return;
    }
    const [prefijo, idStr] = idPackConPrefijo.split("-");
    const id = parseInt(idStr);

    let packSeleccionado;

    if (prefijo === "N") {
        packSeleccionado = packsGBNacionalesList.find(pack => pack.id === id);
    } else if (prefijo === "R") {
        packSeleccionado = packsGBRoamingList.find(pack => pack.id === id);
    } else {
        mostrarMensaje("❌ Pack inválido", "error");
        return
    }

    if (!packSeleccionado) {
        mostrarMensaje("El pack seleccionado no existe", "error");
        return;
    }

    const saldoDisponible = clienteActual.monederoPrepago;

    if (saldoDisponible < packSeleccionado.packPrecio) {
        mostrarMensaje(`❌ El saldo es insuficiente para comprar este pack. El pack tiene un valor de  $${packSeleccionado.packPrecio.toLocaleString('es-AR')} y el saldo es de $${saldoDisponible.toLocaleString('es-AR')}`, "error");
        return;
    }
    // Descontar saldo
    clienteActual.monederoPrepago -= packSeleccionado.packPrecio;

    //Segun el tipo de pack comprado, suma la cantidad de gigas a la categoría correspondiente
    if (prefijo === "N") {
        clienteActual.datosDisponibles += Number(packSeleccionado.cantidadGBNacional || 0);
    } else if (prefijo === "R") {
        clienteActual.datosRoaming += Number(packSeleccionado.cantidadGBRoaming || 0);
    }
    // Registrar compra
    clienteActual.historialCompraPacks.push({
        nombrePack: packSeleccionado.packNombre,
        precio: packSeleccionado.packPrecio,
        tipo: packSeleccionado.packTipo,
        fecha: new Date().toLocaleString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    });

    mostrarMensaje(`✅¡Compra exitosa! Compraste el ${packSeleccionado.packNombre} por $${packSeleccionado.packPrecio.toLocaleString('es-AR')}`, "success");
    guardarClienteActualEnLocalStorage(clienteActual);
    resultadoOperacionContainer.style.display = "block";
    resultadoOperacionContainer.innerHTML = `
    <h4> Compra de pack exitosa</h4>
    <p> Compraste el pack: <strong>${packSeleccionado.packNombre}</strong>.</p>
    `;

}
function mostrarHistorialPacks() {
    limpiarTodosLosContenedores();
    historialPacksContainer.innerHTML = "";
    historialPacksContainer.style.display = "block";

    if (!clienteActual) {
        mostrarMensaje("No hay cliente seleccionado", "info");
        return;
    }

    const historial = clienteActual.historialCompraPacks;

    if (historial.length === 0) {
        historialPacksContainer.textContent = "🗃️ Todavía no compraste packs.";
        return;
    }

    const ul = document.createElement("ul");
    historial.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `📦 ${item.fecha} - $${item.precio.toLocaleString('es-AR')} - ${item.nombrePack}`;
        ul.appendChild(li);
    });
    historialPacksContainer.appendChild(ul);
}

//Funciones de Tienda de Equipos
//Función que muestra la sección Tienda de equipos
function mostrarTiendaEquipos() {
    limpiarTodosLosContenedores();
    tiendaEquiposContainer.style.display = "block";
    renderizarEquipos();
}
//Función que renderiza los equipos y crea las tarjetas con los datos obtenidos desde la class de equipos
function renderizarEquipos() {
    equiposListado.innerHTML = '';

    if (!clienteActual) {
        equiposListado.innerHTML = '<p>Para visualizar los equipos, es necesario que inicies sesión.</p>';
        return;
    }
    if (equiposList.length === 0) {
        equiposListado.innerHTML = '<p>No hay equipos disponibles actualmente.</p>';
        return;
    }

    equiposList.forEach(equipo => {
        const equipoCard = document.createElement("div");
        equipoCard.className = "equipo-card";

        const img = document.createElement("img");
        img.src = equipo.image || './assets/equipos/equipo.png';
        img.alt = equipo.name;
        img.className = "equipo-imagen";

        const nombre = document.createElement("h4");
        nombre.textContent = `${equipo.brand} ${equipo.name}`;

        const detalles = document.createElement("p");
        detalles.innerHTML = `
        Modelo: ${equipo.model}<br>
    Color: ${equipo.color}<br>
    Red: ${equipo.mobileNetwork}<br>
    Capacidad: ${equipo.capacity}GB<br>
    Precio: $${equipo.price.toLocaleString('es-AR')}<br>
    Stock: ${equipo.stock} unidades
        `;

        const addButton = document.createElement("button");
        addButton.className = "btnAgregarCarrito";
        addButton.textContent = "Agregar al carrito";
        addButton.dataset.equipoId = equipo.id;

        const itemEnCarrito = clienteActual.carritoCompras.find(item => item.id === equipo.id);
        const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;

        if (equipo.stock <= 0 || cantidadEnCarrito >= equipo.stock) {
            addButton.disabled = true;
            addButton.style.backgroundColor = "#ccc";
            if (equipo.stock <= 0) {
                addButton.textContent = "Sin stock";
            } else {
                addButton.textContent = "Máximo en carrito";
                addButton.style.backgroundColor = "#ffc107";
            }
        }

        addButton.addEventListener("click", () => agregarAlCarrito(equipo.id));

        equipoCard.appendChild(img);
        equipoCard.appendChild(nombre);
        equipoCard.appendChild(detalles);
        equipoCard.appendChild(addButton);

        equiposListado.appendChild(equipoCard);
    });
}

function agregarAlCarrito(equipoId) {
    if (!clienteActual) {
        mostrarMensaje("Para poder comprar un equipo es necesario iniciar sesión.", "error");
        return;
    }

    const equipoAComprar = equiposList.find(equipo => equipo.id === equipoId);
    if (!equipoAComprar) {
        mostrarMensaje("Equipo no encontrado", "error");
        return;
    }


    const itemEnCarrito = clienteActual.carritoCompras.find(item => item.id === equipoId);
    if (itemEnCarrito) {
        if (itemEnCarrito.cantidad < equipoAComprar.stock) {
            itemEnCarrito.cantidad++;
            mostrarMensaje(`Se agregó otra unidad de "${equipoAComprar.name}" al carrito.Cantidad: ${itemEnCarrito.cantidad}`, "success");
        } else {
            mostrarMensaje(`No hay más stock de ${equipoAComprar.name}". Máximo alcanzado en tu carrito`, "warning");
            return;
        }
    } else {
        clienteActual.carritoCompras.push({
            id: equipoAComprar.id,
            nombre: equipoAComprar.name,
            precio: equipoAComprar.price,
            cantidad: 1
        });
        mostrarMensaje(`✅"${equipoAComprar.name}" agregado al carrito por primera vez`, "success");
    }

    guardarClienteActualEnLocalStorage(clienteActual);
    actualizarContadorCarrito();
    renderizarEquipos();
}

function mostrarCarrito() {
    limpiarTodosLosContenedores();
    carritoContainer.style.display = "block";
    renderizarCarrito();
}

function renderizarCarrito() {
    listaCarrito.innerHTML = "";

    if (!clienteActual || clienteActual.carritoCompras.length === 0) {
        listaCarrito.innerHTML = '<p class="carrito-vacio-mensaje"> Tu carrito está vacío.</p>';
        actualizarTotalesCarrito();
        return;
    }

    clienteActual.carritoCompras.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "carrito-item";

        const equipoOriginal = equiposList.find(e => e.id === item.id);
        const imageSrc = equipoOriginal ? (equipoOriginal.image || './assets/equipos/equipo.png') : './assets/equipos/equipo.png';


        itemDiv.innerHTML = `
        <img src="${imageSrc}" alt="${item.nombre}" class="carrito-item-imagen">
        <div class="carrito-item-detalles">
        <h4>${item.nombre}</h4>
        <p>Precio Unitario:  $${item.precio.toLocaleString('es-AR')}</p>
        <div class="cantidad-control">
        <button class="btn-cantidad-restar" data-id="${item.id}">-</button>
        <span>${item.cantidad}</span>
        <button class="btn-cantidad-sumar" data-id="${item.id}">+</button>
        </div>
        </div>
        <div class="carrito-item-acciones">
        <p>Subtotal: $${(item.precio * item.cantidad).toLocaleString('es-AR')}</p>
        <button class="btn-eliminar-item" data-id="${item.id}">Eliminar</button>
        </div>
        `;
        listaCarrito.appendChild(itemDiv);
    });
    listaCarrito.querySelectorAll(".btn-cantidad-restar").forEach(button => {
        button.addEventListener("click", (e) => actualizarCantidadItemCarrito(parseInt(e.target.dataset.id), -1));
    });
    listaCarrito.querySelectorAll(".btn-cantidad-sumar").forEach(button => {
        button.addEventListener("click", (e) => actualizarCantidadItemCarrito(parseInt(e.target.dataset.id), 1));
    });
    listaCarrito.querySelectorAll(".btn-eliminar-item").forEach(button => {
        button.addEventListener("click", (e) => eliminarItemCarrito(parseInt(e.target.dataset.id)));
    });

    actualizarTotalesCarrito();
}

function actualizarCantidadItemCarrito(itemId, cambio) {
    const itemEnCarrito = clienteActual.carritoCompras.find(item => item.id === itemId);
    const equipoOriginal = equiposList.find(e => e.id === itemId);

    if (!itemEnCarrito || !equipoOriginal) {
        mostrarMensaje("Error: Equipo no encontrado en el carrito", "error");
        return;
    }

    const nuevaCantidad = itemEnCarrito.cantidad + cambio;

    if (nuevaCantidad < 1) {
        eliminarItemCarrito(itemId);
        return;
    }

    if (nuevaCantidad > equipoOriginal.stock) {
        mostrarMensaje(`No hay más stock disponible de "${itemEnCarrito.nombre}". Solo quedan ${equipoOriginal.stock} unidades.`, "warning");
        return;
    }

    itemEnCarrito.cantidad = nuevaCantidad;
    guardarClienteActualEnLocalStorage(clienteActual);
    renderizarCarrito();
    actualizarContadorCarrito();
}

function vaciarCarrito() {
    if (!clienteActual || clienteActual.carritoCompras.length === 0) {
        mostrarMensaje("El carrito ya se encuentra vacío", "info");
        return;
    }

    clienteActual.carritoCompras = [];
    clienteActual.descuentoActivo = null;
    guardarClienteActualEnLocalStorage(clienteActual);
    mostrarMensaje('Carrito vaciado exitosamente.', 'success');
    renderizarCarrito();
    actualizarContadorCarrito();
}

function aplicarDescuento() {
    if (!clienteActual || clienteActual.carritoCompras.length === 0) {
        mostrarMensaje("No hay ítems en el carrito para aplicar un descuento.", "warning");
        return;
    }

    const codigoIngresado = codigoDescuentoInput.value.trim().toUpperCase();
    const codigoEncontrado = codigosDescuento.find(c => c.codigo === codigoIngresado);

    if (!codigoEncontrado) {
        mostrarMensaje("Código de descuento no válido", "error");
        clienteActual.descuentoActivo = null;
        actualizarTotalesCarrito();
        return;
    }

    let subtotal = clienteActual.carritoCompras.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    if (codigoEncontrado.minCompra && subtotal < codigoEncontrado.minCompra) {
        mostrarMensaje(`El código ${codigoIngresado} requiere una compra mínima de $${codigoEncontrado.minCompra.toLocaleString('es-AR')}.`, "warning");
        clienteActual.descuentoActivo = null;
        actualizarTotalesCarrito();
        return;
    }

    clienteActual.descuentoActivo = codigoEncontrado;
    guardarClienteActualEnLocalStorage(clienteActual);
    mostrarMensaje(`Código "${codigoIngresado} aplicado correctamente.`, "success");
    actualizarTotalesCarrito();
}

function actualizarTotalesCarrito() {
    let subtotal = clienteActual.carritoCompras.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    let descuentoCalculado = 0;

    if (clienteActual.descuentoActivo) {
        const desc = clienteActual.descuentoActivo;
        if (desc.minCompra && subtotal < desc.minCompra) {
            descuentoCalculado = 0;
            clienteActual.descuentoActivo = null;
            guardarClienteActualEnLocalStorage(clienteActual);
        } else {
            if (desc.tipo === "porcentaje") {
                descuentoCalculado = subtotal * desc.valor;
            } else if (desc.tipo === "fijo") {
                descuentoCalculado = desc.valor;
            }
            descuentoCalculado = Math.min(descuentoCalculado, subtotal);
        }
    }

    let totalPagar = subtotal - descuentoCalculado;

    subtotalCarritoSpan.textContent = subtotal.toLocaleString('es-AR');
    descuentoAplicadoSpan.textContent = descuentoCalculado.toLocaleString('es-AR');
    totalPagarSpan.textContent = totalPagar.toLocaleString('es-AR');
}

function finalizarCompra() {
    if (!clienteActual || clienteActual.carritoCompras.length === 0) {
        mostrarMensaje("Tu carrito está vacío. Agrega productos para finalizar la compra.", "error");
        return;
    }

    actualizarTotalesCarrito();
    const totalFinal = parseFloat(totalPagarSpan.textContent.replace(/\./g, '').replace(',', '.'));
    Swal.fire({
        title: 'Confirmá tu pago',
        html: `
            <p>Total a pagar: <strong>$${totalFinal.toLocaleString('es-AR')}</strong></p>
            <form id="formPagoSweetAlert" class="swal2-form">
                <div class="swal2-input-container">
                    <label for="numeroTarjeta">Número de Tarjeta:</label>
                    <input id="numeroTarjeta" type="text" class="swal2-input" placeholder="1203 5671 1946 4521" maxlength="19" required>
                </div>
                <div class="swal2-input-container">
                    <label for="nombreTitular">Nombre del Titular</label>
                    <input id="nombreTitular" type="text" class="swal2-input" placeholder="Como aparece en la tarjeta" required>
                </div>
                <div class="swal2-input-group">
                    <div class="swal2-input-container half-width">
                        <label for="fechaVencimiento">Vencimiento:</label>
                        <input id="fechaVencimiento" type="text" class="swal2-input" placeholder="MM/AA" maxlength="5" required>
                    </div>
                    <div class="swal2-input-container half-width">
                        <label for="cvv">CVV:</label>
                        <input id="cvv" type="password" class="swal2-input" placeholder="1234" maxlength="4" required>
                    </div>
                </div>
            </form>
            <style>
                /* Estilos básicos para el formulario dentro de SweetAlert */
                /* Considera mover estos estilos a tu archivo CSS principal */
                .swal2-form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-top: 20px;
                    text-align: left;
                }
                .swal2-input-container {
                    display: flex;
                    flex-direction: column;
                }
                .swal2-input-container label {
                    font-size: 0.9em;
                    margin-bottom: 5px;
                    color: #555;
                }
                .swal2-input {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 1em;
                }
                .swal2-input-group {
                    display: flex;
                    gap: 15px;
                }
                .swal2-input-group .half-width {
                    flex: 1;
                }
            </style>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Pagar Ahora',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const numeroTarjeta = Swal.getPopup().querySelector('#numeroTarjeta').value.trim();
            const nombreTitular = Swal.getPopup().querySelector('#nombreTitular').value.trim();
            const fechaVencimiento = Swal.getPopup().querySelector('#fechaVencimiento').value.trim();
            const cvv = Swal.getPopup().querySelector('#cvv').value.trim();

            if (!numeroTarjeta || !nombreTitular || !fechaVencimiento || !cvv) {
                Swal.showValidationMessage('Por favor, completa todos los campos de pago.');
                return false;
            }
            return { numeroTarjeta, nombreTitular, fechaVencimiento, cvv };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            if (!clienteActual.historialComprasEquipos) {
                clienteActual.historialComprasEquipos = [];
            }

            clienteActual.historialComprasEquipos.push({
                fecha: new Date().toLocaleString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
                total: totalFinal,
                items: clienteActual.carritoCompras.map(item => ({ ...item }))
            });

            clienteActual.carritoCompras.forEach(itemComprado => {
                const equipoEnLista = equiposList.find(e => e.id === itemComprado.id);
                if (equipoEnLista) {
                    equipoEnLista.stock -= itemComprado.cantidad;
                }
            });
            clienteActual.carritoCompras = [];
            clienteActual.descuentoActivo = null;
            guardarClienteActualEnLocalStorage(clienteActual);
            guardarEquiposEnLocalStorage();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: '¡Compra exitosa! La orden se envió correctamente.',
                showConfirmButton: false,
                timer: 3000,
                toast: true,
                customClass: {
                    popup: 'swal2-toast-popup',
                },
                willClose: () => {
                    mostrarHistorialComprasEquipos();
                }
            });
        }
    });
}
function mostrarHistorialComprasEquipos() {
    limpiarTodosLosContenedores();
    historialComprasEquiposContainer.style.display = "block";
    historialEquiposListado.innerHTML = "";

    if (!clienteActual || !clienteActual.historialComprasEquipos || clienteActual.historialComprasEquipos.length === 0) {
        historialEquiposListado.innerHTML = '<p>Aún no has realizado compras de equipos.</p>';
        return;
    }

    clienteActual.historialComprasEquipos.forEach((compra, index) => {
        const compraDiv = document.createElement("div");
        compraDiv.className = "historial-compra-card";

        let itemsHtml = '<ul class="historial-items-list">';
        compra.items.forEach(item => {
            itemsHtml += `<li>${item.nombre} x ${item.cantidad} ($${item.precio.toLocaleString('es-AR')} c/u)</li>`;
        });
        itemsHtml += '</ul>';

        compraDiv.innerHTML = `
            <h4>Compra #${index + 1} - ${compra.fecha}</h4>
            <p>Total: $${compra.total.toLocaleString('es-AR')}</p>
            <h5>Detalle de la compra:</h5>
            ${itemsHtml}
        `;
        historialEquiposListado.appendChild(compraDiv);
    });
}
//addEventListener
document.addEventListener("DOMContentLoaded", async () => {

    // Carga de datos inicial
    clienteActual = getClienteActualDesdeLocalStorage();
    //Carga de productos y servicios inicial
    await cargarPacksDesdeJSON();
    await cargarEquiposDesdeJSON();

    // Actualizar UI inicial, si ya hay un cliente logueado
    actualizarUI();

    // Autenticación
    btnLogin.addEventListener("click", validarLinea);
    lineaInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            validarLinea();
        }
    });
    btnLogOut.addEventListener("click", cerrarSesion);

    // Menú Principal
    btnConsultaDeSaldo.addEventListener("click", mostrarConsultaDeSaldo);
    btnRecargaDeSaldo.addEventListener("click", mostrarRecargarSaldo);
    btnComprarPacks.addEventListener("click", renderizarPacks);
    btnVisualizarHistorialDePacks.addEventListener("click", mostrarHistorialPacks);
    btnVerTiendaEquipos.addEventListener("click", mostrarTiendaEquipos);
    btnVerCarrito.addEventListener("click", mostrarCarrito);
    btnVerHistorialComprasEquipos.addEventListener("click", mostrarHistorialComprasEquipos);


    // Dentro de Recarga
    btnRecargarSaldo.addEventListener("click", recargarSaldo);

    // Dentro del Carrito
    btnAplicarDescuento.addEventListener("click", aplicarDescuento);
    btnFinalizarCompra.addEventListener("click", finalizarCompra);
    btnVaciarCarrito.addEventListener("click", vaciarCarrito);
    btnVolverTiendaDesdeCarrito.addEventListener("click", mostrarTiendaEquipos);

    // Dentro del Historial de Compras de Equipos
    btnVolverATiendaDesdeHistorialEquipos.addEventListener("click", mostrarTiendaEquipos);

});