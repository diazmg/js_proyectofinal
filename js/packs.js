import { PackGBNacional, PackGBRoaming } from "./clases.js";

export const packsGBNacionalesList = [];
export const packsGBRoamingList = [];

export async function cargarPacksDesdeJSON() {
    try {
        const res = await fetch('./data/packs.json');
        const data = await res.json();

        data.nacionales.forEach(pack => {
            packsGBNacionalesList.push(
                new PackGBNacional(pack.id, pack.nombre, pack.gigas, pack.duracion, pack.precio)
            );
        });

        data.roaming.forEach(pack => {
            packsGBRoamingList.push(
                new PackGBRoaming(pack.id, pack.nombre, pack.gigas, pack.duracion, pack.precio)
            );
        });
    } catch (error) {
    }
}