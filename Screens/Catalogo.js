import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import Categoria from "../components/Categoria";
import Producto from "../components/Producto";

const Catalogo = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    obtenerCategorias();
    obtenerProductos();
  }, []);

  const obtenerCategorias = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Categorias"));
      const datos = [];
      querySnapshot.forEach((doc) => {
        datos.push({ id: doc.id, ...doc.data() });
      });
      setCategorias(datos);
    } catch (error) {
      console.error("Error obteniendo categorías: ", error);
    }
  };

  const obtenerProductos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Productos"));
      const datos = [];
      querySnapshot.forEach((doc) => {
        datos.push({ id: doc.id, ...doc.data() });
      });
      setProductos(datos);
    } catch (error) {
      console.error("Error obteniendo productos: ", error);
    }
  };

  const obtenerProductosPorCategoria = async (categoriaId) => {
    setBusqueda("");
    try {
      const consulta = query(
        collection(db, "Productos"),
        where("categoriaId", "==", categoriaId)
      );
      const consultaSnapshot = await getDocs(consulta);
      const datos = [];
      consultaSnapshot.forEach((documento) => {
        datos.push({ id: documento.id, ...documento.data() });
      });
      setProductos(datos);
    } catch (error) {
      console.error("Error obteniendo productos por categoría:", error);
    }
  };

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const seleccionarTodos = () => {
    setBusqueda("");
    obtenerProductos();
  };

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={productosFiltrados}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.filaProductos}
        renderItem={({ item }) => (
          <View style={styles.tarjetaContenedor}>
            <Producto
              nombre={item.nombre}
              precio={item.precio}
              tiempo={item.tiempo}
              color={item.color}
              imagen={item.Imagen}
            />
          </View>
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.headerAcciones}>
              <View style={styles.buscador}>
                <Ionicons name="search-outline" size={18} color="#7C7CFF" />
                <TextInput
                  placeholder="Buscar producto"
                  placeholderTextColor="#B5B5D5"
                  style={styles.input}
                  value={busqueda}
                  onChangeText={setBusqueda}
                />
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categorias}
            >
              <Categoria
                nombre="Todos"
                icono="apps-outline"
                onPress={seleccionarTodos}
              />
              {categorias.map((categoria) => (
                <Categoria
                  key={categoria.id}
                  nombre={categoria.nombre}
                  icono={categoria.icono}
                  onPress={() => obtenerProductosPorCategoria(categoria.id)}
                />
              ))}
            </ScrollView>

            <View style={styles.linea} />
            <Text style={styles.titulo}>Productos</Text>
          </View>
        }
        contentContainerStyle={styles.listaProductos}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 10 },
  headerAcciones: { flexDirection: "row", alignItems: "center", marginVertical: 12 },
  buscador: {
    flex: 1,
    height: 45,
    backgroundColor: "#F5F4FC",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  input: { flex: 1, fontSize: 13, marginLeft: 8, color: "#000" },
  categorias: { marginBottom: 10 },
  linea: { height: 1, backgroundColor: "#EFEFEF", marginHorizontal: -10 },
  titulo: { fontSize: 20, fontWeight: "bold", color: "#222", marginTop: 15, marginBottom: 10 },
  listaProductos: { paddingBottom: 20 },
  filaProductos: { justifyContent: "space-between", marginBottom: 10 },
  tarjetaContenedor: { width: "48%" },
});

export default Catalogo;