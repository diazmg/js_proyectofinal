export class Abonado {
    constructor(nombre, apellido, recurso, tipoPlan, datosDisponibles, datosRoaming, monederoPrepago, monederoAbono, historialCompraPacks, carritoCompras) {
        this.nombre= nombre;
        this.apellido = apellido;
        this.recurso = recurso;
        this.tipoPlan = tipoPlan;
        this.datosDisponibles = datosDisponibles;
        this.datosRoaming = datosRoaming;
        this.monederoPrepago = monederoPrepago;
        this.monederoAbono = monederoAbono;
        this.historialCompraPacks = historialCompraPacks;
        this.carritoCompras = carritoCompras;
    }
    obtenerSaldoTotal() {
        return this.monederoPrepago + this.monederoAbono;
    }
    static fromPlainObject(obj) {
        if (!obj) return null;
        return new Abonado(
        obj.nombre,
        obj.apellido,
        obj.recurso,
        obj.tipoPlan,
        obj.datosDisponibles || 0,
        obj.datosRoaming || 0,
        obj.monederoPrepago || 0,
        obj.monederoAbono || 0 ,
        obj.historialCompraPacks || [],
        obj.carritoCompras || []
        )
    }
}

export class PackGBNacional {
    constructor(id, nombre, gigas, duracion, precio) {
        this.id = id;
        this.packNombre = nombre;
        this.cantidadGBNacional = gigas;
        this.duracionPack = duracion;
        this.packPrecio = precio;
    }
}

export class PackGBRoaming {
    constructor(id, nombre, gigas, duracion, precio) {
        this.id = id;
        this.packNombre = nombre;
        this.cantidadGBRoaming = gigas;
        this.duracionPack = duracion;
        this.packPrecio = precio;
    }
}

export class Equipo {
    constructor(id, brand, name, model, color, mobileNetwork, capacity, price, stock, image) {
        this.id = id;
        this.brand = brand;
        this.name = name;
        this.model = model;
        this.color = color;
        this.mobileNetwork = mobileNetwork;
        this.capacity = capacity;
        this.price = price;
        this.stock = stock;
        this.image = image;
    }
    mostrarDetalles() {
        return `${this.brand} ${this.name} (${this.color}, ${this.capacity}GB) - Precio: $${this.price}`;
    }
}
