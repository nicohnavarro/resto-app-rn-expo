import { map } from 'lodash';
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon, ListItem } from 'react-native-elements';

export default function AccountOptions({user,toastRef}) {
  const menuOptions = generatedOptions();

  return (
    <View>
      {
        map(menuOptions,(menu,index)=>(
          <ListItem key={index} style={styles.menuItem}>
            <Icon type="material-community"
            name={menu.iconNameLeft}
            color={menu.iconColorLeft}
            />
            <ListItem.Content>
              <ListItem.Title>{menu.title}</ListItem.Title>
            </ListItem.Content>
            <Icon type="material-community"
            name={menu.IconNameRight}
            color={menu.iconColorRight}
            />

          </ListItem>
        ))
      }
    </View>
  )
}

function generatedOptions(){
  return[{
    title:"Cambiar Nombre y Apellido",
    iconNameLeft:"account-circle",
    iconColorLeft:"#a3bf45",
    IconNameRight:"chevron-right",
    iconColorRight:"#a3bf45"
  },
  {
    title:"Cambiar Correo",
    iconNameLeft:"at",
    iconColorLeft:"#a3bf45",
    IconNameRight:"chevron-right",
    iconColorRight:"#a3bf45"
  },
  {
    title:"Cambiar Clave",
    iconNameLeft:"lock-reset",
    iconColorLeft:"#a3bf45",
    IconNameRight:"chevron-right",
    iconColorRight:"#a3bf45"
  }]
}
const styles = StyleSheet.create({
  menuItem:{
    borderBottomWidth:1,
    borderBottomColor:"#a3bf45"
  }
})
