import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { Button } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

export default function UserGuest() {

    const navigation = useNavigation()

    return (
        <ScrollView
            centerContent
            style={styles.viewBody}
        >
            <Image
                source={require("../../assets/logo.png")}
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.title}>Consulta tu perfil en Restaurantes</Text>
            <Text style={styles.description}>
                Como describirias tu mejor restaurante? Busca y visualiza los mejores restaurantes de una forma sencilla, vote cual te ha gustado mas y comenta como ha sido tu experiencia.
            </Text>
            <Button
                title="Ver tu perfil"
                buttonStyle={styles.button}
                onPress={()=>navigation.navigate("login")}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        marginHorizontal:30
    },
    image:{
        height:300,
        width: "100%",
        marginBottom:10
    },
    title:{
        fontWeight:"bold",
        fontSize:19,
        marginVertical:10,
        textAlign: "center"
    },
    description:{
        textAlign: "justify",
        marginBottom: 2,
        color: "grey"
    },
    button : {
        backgroundColor: "#a3bf45",
        marginTop: 10
    }
})
