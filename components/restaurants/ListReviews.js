import React,{ useState, useEffect,useCallback } from 'react'
import { StyleSheet, Text, View , ActivityIndicator} from 'react-native'
import firebase from 'firebase/app';
import { Button,  Avatar, Rating} from 'react-native-elements';
import moment from 'moment/min/moment-with-locales';
import { getRestaurantsReviews } from '../../utils/actions';
import { map, size } from 'lodash';
import { useFocusEffect } from "@react-navigation/native";

moment.locale("es");

export default function ListReviews({navigation,idRestaurant}) {
  const [reviews, setReviews] = useState([]);
  const [userLogged,setUserLogged] = useState(false);


  firebase.auth().onAuthStateChanged((user)=>{
    user ? setUserLogged(true) : setUserLogged(false);
  })

  useFocusEffect(
    useCallback(() => {
      (async() =>{
        const response = await getRestaurantsReviews(idRestaurant);
        if(response.statusResponse){
          setReviews(response.reviews)
        }
      })()
    }, [])
  )
  
  return (
    <View>
      {userLogged ? (
        <Button
          title="Escribe una opinion"
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.btnTitleAddReview}
          icon={{
            type:"material-community",
            name:"square-edit-outline",
            color:"#a376c7"
          }}
          onPress={()=> navigation.navigate("add-review-restaurant",{idRestaurant})}
        />
      )
      :
      (
        <Text style={styles.mustLoginText} onPress={()=> navigation.navigate("login")}>
          Para escribir una opinion debes estar logeado.{""}
          <Text style={styles.loginText}> Pulsa aqui para iniciar sesion</Text>
        </Text>
      )}

      {
        size(reviews) > 0 && (
          map(reviews,(reviewDoc) => (
            <Review reviewDoc={reviewDoc}/>
          ))
        )
      }
    </View>
  )
}

function Review({reviewDoc}){
  const { title, review, createdAt, avatarUser,rating } = reviewDoc;
  const createReview = new Date(createdAt.seconds * 1000)

  return(
    <View style={styles.viewReview}>
      <View style={styles.imageAvatar}>
        <Avatar 
          renderPlaceholderContent={<ActivityIndicator color="grey"/>}
          size="large" 
          rounded 
          containerStyle={styles.imageAvatarUser}
          source={ avatarUser ? {uri: avatarUser}: require("../../assets/avatardefault.png")}
        />
      </View>
      <View style={styles.viewInfo}>
        <Text style={styles.reviewTitle}>{title}</Text>
        <Text style={styles.reviewText}>{review}</Text>
        <Rating imageSize={15} startingValue={rating} readonly/>
        <Text style={styles.reviewDate}>{moment(createReview).format("LLL")}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  btnAddReview:{
    backgroundColor:"transparent",

  },
  btnTitleAddReview:{
    color: "#a376c3"
  },
  mustLoginText:{
    textAlign:"center",
    color:"#3C5A14",
    padding: 20,
  },
  loginText:{
    fontWeight:"bold",
    color:"#11270B"
  },
  viewReview:{
    flexDirection:"row",
    padding:10,
    paddingBottom:20,
    borderBottomColor: "#aeaeae",
    borderBottomWidth:1
  },
  imageAvatar:{
    marginRight:15
  },
  imageAvatarUser:{
    width:50, 
    height:50
  },
  viewInfo:{
    flex:1,
    alignItems:"flex-start"
  },
  reviewTitle:{
    fontWeight:"bold"
  },
  reviewText:{
    paddingTop:2,
    marginBottom:5,
    color:"grey"
  },
  reviewDate:{
    marginTop:5,
    color:"grey",
    fontSize:18,
    position:"absolute",
    right:0,
    bottom:0
  }
})
