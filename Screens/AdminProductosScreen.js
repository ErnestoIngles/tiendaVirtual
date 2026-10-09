// screens/AdminProductosScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import { db } from '../firebase/config';

export default function AdminProductosScreen({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const obtenerProductos = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'Productos'));
      const lista = [];
      querySnapshot.forEach((documento) => {
        lista.push({
          docId: documento.id, // ID asignado por Firestore
          ...documento.data(),
        });
      });
      setProductos(lista);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los productos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      obtenerProductos();
    }
  }, [isFocused]);

  const confirmarEliminacion = (docId, nombre) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que deseas eliminar "${nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive', 
          onPress: () => ejecutarEliminacion(docId) 
        },
      ]
    );
  };

  const ejecutarEliminacion = async (docId) => {
    try {
      await deleteDoc(doc(db, 'Productos', docId));
      Alert.alert('Éxito', 'Producto eliminado correctamente');
      obtenerProductos();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el producto: ' + error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagen }} style={styles.imagen} />
      <View style={styles.infoContainer}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.detalle}>Precio: C$ {item.precio}</Text>
        <Text style={styles.detalle}>Cat ID: {item.categoriaId}</Text>
        <Text style={styles.detalle}>Color: {item.color}</Text>
        <Text style={styles.tiempo}>{item.tiempo}</Text>
      </View>
      <View style={styles.acciones}>
        <TouchableOpacity 
          style={[styles.btnAccion, styles.btnEditar]} 
          onPress={() => navigation.navigate('FormularioProducto', { producto: item })}
        >
          <Text style={styles.btnTexto}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.btnAccion, styles.btnEliminar]} 
          onPress={() => confirmarEliminacion(item.docId, item.nombre)}
        >
          <Text style={styles.btnTexto}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.btnAgregar} 
        onPress={() => navigation.navigate('FormularioProducto')}
      >
        <Text style={styles.btnAgregarTexto}>+ Agregar producto</Text>
      </TouchableOpacity>

      <FlatList
        data={productos}
        keyExtractor={(item) => item.docId}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={obtenerProductos}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  btnAgregar: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, alignment: 'center', marginBottom: 16 },
  btnAgregarTexto: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
  imagen: { width: 60, height: 60, borderRadius: 6, marginRight: 12 },
  infoContainer: { flex: 1 },
  nombre: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  detalle: { fontSize: 12, color: '#666', marginTop: 2 },
  tiempo: { fontSize: 10, color: '#999', marginTop: 2 },
  acciones: { flexDirection: 'column', gap: 8 },
  btnAccion: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  btnEditar: { backgroundColor: '#E3F2FD' },
  btnEliminar: { backgroundColor: '#FFEBEE' },
  btnTexto: { fontSize: 16 },
});