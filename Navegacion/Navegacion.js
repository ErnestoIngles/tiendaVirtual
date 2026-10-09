import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

import CatalogoScreen from '../Screens/Catalogo';
import AdminProductosScreen from '../Screens/AdminProductosScreen';
import FormularioProductoScreen from '../Screens/FormularioProductoScreen';

const Tab = createBottomTabNavigator();
const AdminStack = createNativeStackNavigator();

function AdminStackScreen() {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen 
        name="AdminProductosMain" 
        component={AdminProductosScreen} 
        options={{ title: 'Administrar Productos' }}
      />
      <AdminStack.Screen 
        name="FormularioProducto" 
        component={FormularioProductoScreen} 
        options={({ route }) => ({
          title: route.params?.producto ? 'Editar Producto' : 'Nuevo Producto'
        })}
      />
    </AdminStack.Navigator>
  );
}

export default function Navegacion() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen 
          name="Catalogo" 
          component={CatalogoScreen} 
          options={{ 
            title: 'Catálogo',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            )
          }} 
        />
        <Tab.Screen 
          name="AdminProductos" 
          component={AdminStackScreen} 
          options={{ 
            title: 'Admin Productos',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            )
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}