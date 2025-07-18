# App Móvil Simulación - Gestión de Clientes y Tienda de Equipos

Esta aplicación web simula las funcionalidades clave de un operador de telefonía móvil, permitiendo a los usuarios gestionar su cuenta, realizar operaciones de saldo y comprar packs de datos y dispositivos.

## Características Principales

* **Autenticación de Usuario:** Inicio y cierre de sesión mediante un número de línea telefónica de 10 dígitos existe en una base de datos ficticia, declarada en el archivo clientes.json
* **Gestión de Cuenta:**
    * Consulta de saldo y detalles del plan (Libre o Prepago).
    * Recarga de saldo para planes Prepago.
* **Packs de Datos:**
    * Visualización y compra de packs de datos nacionales y de roaming (cargados en el archivo packs.json)
    * Registro y consulta del historial de compra de packs.
* **Tienda de Equipos:**
    * Exploración y adición de dispositivos móviles al carrito de compras.
    * Gestión de cantidades en el carrito y validación de stock.
    * Aplicación de códigos de descuento.
    * Proceso de finalización de compra (simulado).
    * Registro y consulta del historial de compras de equipos.
* **Persistencia de Datos:** Utiliza `localStorage` para mantener la sesión del usuario activo, así como los datos de los equipos y packs disponibles, incluso después de recargar la página.

## Tecnologías Utilizadas

* **HTML5:** Estructura de la aplicación.
* **CSS3:** Estilos y diseño responsivo.
* **JavaScript (ES6+):** Lógica principal de la aplicación, interactividad y manejo de datos.
* **SweetAlert2:** Librería para la gestión de alertas, notificaciones y diálogos interactivos, mejorando la experiencia de usuario.

## Estructura del Proyecto

El proyecto está organizado en varios archivos JavaScript modulares para una mejor gestión y escalabilidad:

* `index.html`: Archivo principal HTML.
* `./assets/css/style.css`: Hojas de estilo de la aplicación.
* `./main.js`: Lógica principal de la aplicación, manejo de la UI y coordinación de funciones.
* `./js/clases.js`: Define las Clases para estructurar los datos del cliente, packs disponibles y equipos.
* `./js/clientes.js`: Funciones relacionadas con la validación y gestión de datos de abonados (lectura/escritura en `localStorage`).
* `./js/packs.js`: Lógica para la carga y gestión de los packs de datos disponibles.
* `./js/equipos.js`: Lógica para la carga y gestión de los equipos móviles en la tienda.
* `./assets/`: Directorio que contiene las imágenes de los equipos.
* `./data/`: Directorio que contiene los archivos .JSON utilizados como base de datos.

## Notas Adicionales

* La aplicación está diseñada como una simulación y no procesa transacciones monetarias reales ni datos de usuario sensibles ya que TODO es ficticio.
* Los datos de clientes, packs y equipos se cargan inicialmente de archivos JSON (gestionados a través de los módulos `./js/clientes.js`, `./js/packs.js` y `./js/equipos.js` respectivamente) y luego se utilizan de forma local con persistencia en `localStorage`.

---

**Desarrollado por:** Marcos Diaz
**Fecha:** Julio de 2025