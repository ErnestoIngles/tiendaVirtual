import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function FormularioProductoScreen({ route, navigation }) {
  const productoEditar = route.params?.producto;

  // Estado para rastrear si el documento ya existe en Firestore
  const [docId, setDocId] = useState(null);

  // Estados de los campos del formulario
  const [id, setId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [color, setColor] = useState('');
  const [imagen, setImagen] = useState('');
  const [tiempo, setTiempo] = useState('');

  useEffect(() => {
    if (productoEditar) {
      // Guardamos el docId de Firestore para saber a cuál documento aplicar updateDoc
      setDocId(productoEditar.docId);

      // Cargamos los datos en los inputs para su edición
      setId(String(productoEditar.id ?? ''));
      setCategoriaId(String(productoEditar.categoriaId ?? ''));
      setNombre(productoEditar.nombre ?? '');
      setPrecio(String(productoEditar.precio ?? ''));
      setColor(productoEditar.color ?? '');
      setImagen(productoEditar.imagen ?? productoEditar.Imagen ?? '');
      setTiempo(productoEditar.tiempo ?? '');
    }
  }, [productoEditar]);

  const guardarProducto = async () => {
    if (!categoriaId || !nombre || !precio || !color || !imagen || !tiempo) {
      Alert.alert('Atención', 'Por favor completa todos los campos del formulario.');
      return;
    }

    // Mantenemos el casteo a Number() para no romper los filtros de la Guía 9.2
    const payload = {
      id: Number(id),
      categoriaId: Number(categoriaId),
      nombre,
      precio: Number(precio),
      color,
      imagen,
      tiempo,
    };

    try {
      if (docId) {
        // ✏️ MODO EDICIÓN: Usamos la referencia al documento existente por su docId
        const docRef = doc(db, 'Productos', docId);
        await updateDoc(docRef, payload);
        Alert.alert('Éxito', 'Producto actualizado correctamente');
      } else {
        // ➕ MODO CREACIÓN: Firestore genera su propio id de documento automático
        await addDoc(collection(db, 'Productos'), payload);
        Alert.alert('Éxito', 'Producto registrado correctamente');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el producto: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>      
      <Text style={styles.label}>ID Categoría</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ej. 1" 
        value={categoriaId} 
        onChangeText={setCategoriaId} 
        keyboardType="numeric" 
      />

      <Text style={styles.label}>Nombre</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Nombre del producto" 
        value={nombre} 
        onChangeText={setNombre} 
      />

      <Text style={styles.label}>Precio</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ej. 27" 
        value={precio} 
        onChangeText={setPrecio} 
        keyboardType="numeric" 
      />

      <Text style={styles.label}>Color</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ej. #F5AFC1" 
        value={color} 
        onChangeText={setColor} 
      />

      <Text style={styles.label}>Imagen (URL)</Text>
      <TextInput 
        style={styles.input} 
        placeholder="https://..." 
        value={imagen} 
        onChangeText={setImagen} 
        autoCapitalize="none" 
      />

      <Text style={styles.label}>Tiempo</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ej. 10 hours ago" 
        value={tiempo} 
        onChangeText={setTiempo} 
      />

      <TouchableOpacity style={styles.btnGuardar} onPress={guardarProducto}>
        <Text style={styles.btnGuardarTexto}>
          {docId ? 'ACTUALIZAR PRODUCTO' : 'GUARDAR PRODUCTO'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, marginBottom: 14, backgroundColor: '#FAFAFA' },
  inputDisabled: { backgroundColor: '#E0E0E0', color: '#777' },
  btnGuardar: { backgroundColor: '#2196F3', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  btnGuardarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});