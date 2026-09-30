import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "./config.js"; 
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Configuración para obtener rutas absolutas correctas en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function sembrarBaseDeDatos() {
  try {
    // 🔀 Solución: Construye la ruta absoluta dinámica apuntando a tu JSON
    const rutaJson = path.join(__dirname, "mockData.json");
    
    console.log(`Buscando archivo en: ${rutaJson}`);
    const datos = JSON.parse(fs.readFileSync(rutaJson, "utf-8"));
    
    const batch = writeBatch(db);
    const coleccionRef = collection(db, "Productos");

    console.log("Preparando registros para la colección 'Productos'...");

    datos.forEach((producto) => {
      const nuevoDocRef = doc(coleccionRef); 
      
      batch.set(nuevoDocRef, {
        nombre: producto.nombre,
        precio: Number(producto.precio), 
        tiempo: producto.tiempo,
        color: producto.color,
        categoriaId: Number(producto.categoriaId), 
        Imagen: producto.Imagen 
      });
    });

    console.log("Subiendo datos a Firestore...");
    await batch.commit();
    
    console.log("🚀 ¡Listo! Los 6 productos se han insertado correctamente.");
    
  } catch (error) {
    console.error("❌ Error al ejecutar el script de siembra:", error);
  }
}

sembrarBaseDeDatos();
