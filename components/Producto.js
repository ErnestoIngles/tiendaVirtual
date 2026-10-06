import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Producto = ( props ) => {
  return (
    <View style={ styles.tarjeta }>
      {/* Contenedor de la Imagen */}
      <View style={ [ styles.contenedorImagen, { backgroundColor: props.color } ] }>
        <Image source={ { uri: props.imagen } } style={ styles.imagen } />
      </View>

      {/* Información del Producto */}
      <View style={ styles.informacion }>
        <View style={ styles.filaPrecio }>
          <Text style={ styles.precio }>$ { props.precio }</Text>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={ 18 } color="#BFC2D9" />
          </TouchableOpacity>
        </View>
        <Text style={ styles.nombre } numberOfLines={ 1 }>
          { props.nombre }
        </Text>
        <Text style={ styles.tiempo }>
          { props.tiempo }
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create( {
  tarjeta: {
    width: "100%", // Se adapta al contenedor del FlatList
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  contenedorImagen: {
    height: 170,
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // Clave para posicionar los botones dentro
  },
  imagen: {
    width: "85%",
    height: "85%",
    resizeMode: "contain",
  },
  overlayAcciones: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    gap: 6,
  },
  botonIcono: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo semi-transparente estilo 'blur'
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  botonEliminar: {
    backgroundColor: "#FFF0F0",
  },
  informacion: {
    padding: 10,
  },
  filaPrecio: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  precio: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  nombre: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4A4A4A",
    marginTop: 4,
  },
  tiempo: {
    fontSize: 10,
    color: "#999999",
    marginTop: 4,
  },
} );

export default Producto;