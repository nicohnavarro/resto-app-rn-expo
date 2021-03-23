import { firebaseApp } from './firebase'
import * as firebase from 'firebase'
import 'firebase/firestore'

const db = firebase.firestore(firebaseApp)

export const isUserLogged = () => {
    let isLogged = false
    firebase.auth().onAuthStateChanged((user)=>{
        user !== null && (isLogged = true)
    })
    return isLogged
}

export const getCurrentUser = () => {
    return firebase.auth().currentUser
}

export const closeSession = () => {
    return firebase.auth().signOut()
}

export const registerUser = async (correo,clave)=>{
    const result = {statusResponse:true,error:null}
    try {
        await firebase.auth().createUserWithEmailAndPassword(correo,clave)
    } catch (error) {
        console.info(error)
        result.statusResponse=false
        result.error = "Este correo ya fue registrado."
    }

    return result
}

export const loginWithEmailAndPassword = async (correo,clave)=>{
    const result = {statusResponse:true,error:null}
    try {
        await firebase.auth().signInWithEmailAndPassword(correo,clave)
    } catch (error) {
        console.info(error)
        result.statusResponse=false
        result.error = "Usuario o clave invalida"
    }

    return result
}

