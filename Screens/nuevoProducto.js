import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  View,
} from "react-native";
import { db } from "../firebase/config";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

const NuevoProducto = ({ route, navigation }) => {
  const productoAEditar = route.params?.producto;

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [color, setColor] = useState("#F7DD83");
  const [imagen, setImagen] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  useEffect(() => {
    if (productoAEditar) {
      setNombre(productoAEditar.nombre || "");
      setPrecio(productoAEditar.precio ? String(productoAEditar.precio) : "");
      setTiempo(productoAEditar.tiempo || "");
      setColor(productoAEditar.color || "#F7DD83");
      setImagen(productoAEditar.Imagen || "");
      setCategoriaId(
        productoAEditar.categoriaId !== undefined
          ? String(productoAEditar.categoriaId)
          : ""
      );
    }
  }, [productoAEditar]);

  const guardarProducto = async () => {
    if (!nombre.trim() || !precio.trim()) {
      Alert.alert("Error", "El nombre y el precio son obligatorios.");
      return;
    }

    const payload = {
      nombre: nombre.trim(),
      precio: parseFloat(precio) || 0,
      tiempo: tiempo.trim() || "Justo ahora",
      color: color.trim() || "#F7DD83",
      Imagen: imagen.trim() || "https://via.placeholder.com/150",
      categoriaId: isNaN(categoriaId) ? categoriaId : Number(categoriaId),
    };

    try {
      if (productoAEditar) {
        const docRef = doc(db, "Productos", productoAEditar.id);
        await updateDoc(docRef, payload);
      } else {
        await addDoc(collection(db, "Productos"), payload);
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
      Alert.alert("Error", "No se pudo guardar el producto.");
    }
  };

  return (
    <ScrollView style={styles.contenedor}>
      <Text style={styles.tituloHeader}>
        {productoAEditar ? "Editar Producto" : "Nuevo Producto"}
      </Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ej. Makeup travel bag"
      />

      <Text style={styles.label}>Precio</Text>
      <TextInput
        style={styles.input}
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
        placeholder="Ej. 50"
      />

      <Text style={styles.label}>Tiempo / Publicación</Text>
      <TextInput
        style={styles.input}
        value={tiempo}
        onChangeText={setTiempo}
        placeholder="Ej. 20 hours ago"
      />

      <Text style={styles.label}>Color Hex (ej. #F7DD83)</Text>
      <TextInput
        style={styles.input}
        value={color}
        onChangeText={setColor}
        placeholder="#F7DD83"
      />

      <Text style={styles.label}>URL Imagen</Text>
      <TextInput
        style={styles.input}
        value={imagen}
        onChangeText={setImagen}
        placeholder="https://..."
      />

      <Text style={styles.label}>ID Categoría</Text>
      <TextInput
        style={styles.input}
        value={categoriaId}
        onChangeText={setCategoriaId}
        keyboardType="numeric"
        placeholder="Ej. 1"
      />

      <View style={styles.filaBotones}>
        <TouchableOpacity
          style={[styles.boton, styles.botonCancelar]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoBoton}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.boton, styles.botonGuardar]}
          onPress={guardarProducto}
        >
          <Text style={styles.textoBoton}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contenedor: { padding: 15, backgroundColor: "#FFF", flex: 1 },
  tituloHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#222" },
  label: { fontSize: 12, fontWeight: "600", color: "#555", marginTop: 8, marginBottom: 2 },
  input: {
    backgroundColor: "#F5F4FC",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40,
    fontSize: 13,
  },
  filaBotones: { flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginBottom: 30 },
  boton: { flex: 0.48, height: 42, borderRadius: 6, justifyContent: "center", alignItems: "center" },
  botonCancelar: { backgroundColor: "#8E8E93" },
  botonGuardar: { backgroundColor: "#7C7CFF" },
  textoBoton: { color: "#FFF", fontWeight: "bold" },
});

export default NuevoProducto;