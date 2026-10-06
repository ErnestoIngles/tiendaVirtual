import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import Categoria from "../components/Categoria";
import Producto from "../components/Producto";
import FormularioProducto from "../components/FormularioProducto"; // <-- Importamos el Formulario

const Catalogo = () => {
    const [ categorias, setCategorias ] = useState( [] );
    const [ productos, setProductos ] = useState( [] );
    const [ busqueda, setBusqueda ] = useState( "" );
    
    // Estados para el CRUD Operacional
    const [ modalVisible, setModalVisible ] = useState( false );
    const [ productoAEditar, setProductoAEditar ] = useState( null );

    useEffect( () => {
        obtenerCategorias();
        obtenerProductos();
    }, [] );

    const obtenerCategorias = async () => {
        try {
            const querySnapshot = await getDocs( collection( db, "Categorias" ) );
            const datos = [];
            querySnapshot.forEach( ( doc ) => {
                datos.push( { id: doc.id, ...doc.data() } );
            } );
            setCategorias( datos );
        } catch ( error ) {
            console.error( "Error obteniendo categorías: ", error );
        }
    };

    const obtenerProductos = async () => {
        try {
            const querySnapshot = await getDocs( collection( db, "Productos" ) );
            const datos = [];
            querySnapshot.forEach( ( doc ) => {
                datos.push( { id: doc.id, ...doc.data() } );
            } );
            setProductos( datos );
        } catch ( error ) {
            console.error( "Error obteniendo productos: ", error );
        }
    };

    const obtenerProductosPorCategoria = async ( categoriaId ) => {
        setBusqueda("");
        try {
            const consulta = query(
                collection( db, "Productos" ),
                where( "categoriaId", "==", categoriaId )
            );
            const consultaSnapshot = await getDocs( consulta );
            const datos = [];
            consultaSnapshot.forEach( ( documento ) => {
                datos.push( { id: documento.id, ...documento.data() } );
            } );
            setProductos( datos );
        } catch ( error ) {
            console.error( "Error obteniendo productos por categoría:", error );
        }
    };

    // Funciones Handler del CRUD
    const abrirCrear = () => {
        setProductoAEditar( null );
        setModalVisible( true );
    };

    const abrirEditar = ( producto ) => {
        setProductoAEditar( producto );
        setModalVisible( true );
    };

    const confirmarEliminar = ( id ) => {
        Alert.alert(
            "Eliminar producto",
            "¿Estás seguro de que deseas eliminar este producto?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: () => eliminarProducto( id ) }
            ]
        );
    };

    const eliminarProducto = async ( id ) => {
        try {
            await deleteDoc( doc( db, "Productos", id ) );
            obtenerProductos(); // Recargamos lista en verde
        } catch ( error ) {
            console.error( "Error al eliminar producto:", error );
        }
    };

    const productosFiltrados = productos.filter( ( producto ) =>
        producto.nombre.toLowerCase().includes( busqueda.toLowerCase() )
    );

    const seleccionarTodos = () => {
        setBusqueda( "" );
        obtenerProductos();
    };

    return (
        <View style={ styles.contenedor }>
            <FlatList
                data={ productosFiltrados }
                numColumns={ 2 }
                keyExtractor={ ( item ) => item.id.toString() }
                showsVerticalScrollIndicator={ false }
                columnWrapperStyle={ styles.filaProductos }
                renderItem={ ( { item } ) => (
                    <View style={ styles.tarjetaContenedor }>
                        <Producto
                            nombre={ item.nombre }
                            precio={ item.precio }
                            tiempo={ item.tiempo }
                            color={ item.color }
                            imagen={ item.Imagen }
                        />
                        {/* Acciones Rápidas CRUD en cada Tarjeta */}
                        <View style={ styles.accionesCard }>
                            <TouchableOpacity onPress={() => abrirEditar( item )}>
                                <Ionicons name="pencil-outline" size={18} color="#7C7CFF" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmarEliminar( item.id )}>
                                <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) }
                ListHeaderComponent={
                    <View>
                        {/* Buscador superior y Botón + */}
                        <View style={ styles.headerAcciones }>
                            <View style={ styles.buscador }>
                                <Ionicons name="search-outline" size={ 18 } color="#7C7CFF" />
                                <TextInput
                                    placeholder="Buscar producto"
                                    placeholderTextColor="#B5B5D5"
                                    style={ styles.input }
                                    value={ busqueda }
                                    onChangeText={ setBusqueda }
                                />
                            </View>
                            <TouchableOpacity style={ styles.botonAgregar } onPress={ abrirCrear }>
                                <Ionicons name="add" size={ 24 } color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Categorías horizontales */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={ false }
                            style={ styles.categorias }
                        >
                            <Categoria
                                nombre="Todos"
                                icono="apps-outline"
                                onPress={ seleccionarTodos }
                            />
                            { categorias.map( ( categoria ) => (
                                <Categoria
                                    key={ categoria.id }
                                    nombre={ categoria.nombre }
                                    icono={ categoria.icono }
                                    onPress={ () => obtenerProductosPorCategoria( categoria.id ) }
                                />
                            ) ) }
                        </ScrollView>

                        <View style={ styles.linea } />
                        <Text style={ styles.titulo }>News</Text>
                    </View>
                }
                contentContainerStyle={ styles.listaProductos }
            />

            {/* Modal CRUD */}
            <Modal visible={ modalVisible } animationType="slide" presentationStyle="pageSheet">
                <FormularioProducto
                    productoSeleccionado={ productoAEditar }
                    alCancelar={ () => setModalVisible( false ) }
                    alGuardar={ () => {
                        setModalVisible( false );
                        obtenerProductos();
                    } }
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create( {
    contenedor: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 10,
        marginTop: 40,
    },
    headerAcciones: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
        marginBottom: 15,
    },
    buscador: {
        flex: 1,
        height: 50,
        backgroundColor: "#F5F4FC",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 12,
        marginLeft: 8,
        color: "#000",
    },
    botonAgregar: {
        width: 50,
        height: 50,
        backgroundColor: "#7C7CFF",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    categorias: {
        marginBottom: 10,
    },
    linea: {
        height: 3,
        backgroundColor: "#AAAAAA",
        marginHorizontal: -10,
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#222",
        marginTop: 15,
        marginBottom: 10,
    },
    listaProductos: {
        paddingBottom: 20,
    },
    filaProductos: {
        justifyContent: "space-between",
        marginBottom: 10,
    },
    tarjetaContenedor: {
        width: "48%",
        position: "relative",
    },
    accionesCard: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#F5F4FC",
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: -8,
        marginBottom: 8,
    }
} );

export default Catalogo;