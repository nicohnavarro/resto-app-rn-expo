import React, { useState, useCallback, useRef, useEffect } from "react";
import { StyleSheet, Text, View, Alert, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Rating, ListItem, Icon} from "react-native-elements";
import CarouselImages from "../../components/CarouselImages";
import Loading from "../../components/Loading";
import MyCarousel from "../../components/MyCarousel";
import { addDocumentWithoutId, getCurrentUser, getDocumentById, getIsFavorite, deleteFavorite} from "../../utils/actions";
import {formatPhone} from '../../utils/helpers';
import MapRestaurant from '../../components/restaurants/MapRestaurant';
import { map } from 'lodash';
import ListReviews from "../../components/restaurants/ListReviews";
import { useFocusEffect } from '@react-navigation/native';
import firebase from 'firebase/app';
import Toast from 'react-native-easy-toast';


const widthScreen = Dimensions.get("window").width;

export default function Restaurant({ navigation, route }) {
  const { id, name } = route.params;
  const toastRef = useRef();
  const [restaurant, setRestaurant] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);

  firebase.auth().onAuthStateChanged(user => {
    user? setIsLogged(true) : setIsLogged(false);
  })

  const addFavorite = async() =>{
    if(!isLogged){
      toastRef.current.show("Necesitas estar logeado para agregar",3000);
      return;
    }
    
    setLoading(true);
    const response = await addDocumentWithoutId("favorites",{
      idUser: getCurrentUser().uid,
      idRestaurant: restaurant.id
    })
    if(response.statusResponse){
      setIsFavorite(true);
      toastRef.current.show("Se agrego a favoritos!",3000)
    }else{
      toastRef.current.show("No se agrego a favoritos.",3000)
    }
    setLoading(false);
  }
  
  const removeFavorite = async() => {
    setLoading(true);
    const response = await deleteFavorite(restaurant.id);
    if(response.statusResponse){
      setIsFavorite(false);
      toastRef.current.show("Se elimino de favoritos!",3000)
    }else{
      toastRef.current.show("No se pudo eliminar de favoritos.",3000)
    }
    setLoading(false); 
  } 

  navigation.setOptions({ title: name });

  useFocusEffect(
    useCallback(() => {
    (async () => {
      const response = await getDocumentById("restaurants", id);
      if (response.statusResponse === true) {
        setRestaurant(response.document);
      } else {
        setRestaurant({});
        Alert.alert(
          "Ocurrio un problema cargando el restaurante, intente mas tarde."
        );
      }

    })();
  }, []));

  useEffect(()=>{
    (async()=>{
      if(isLogged && restaurant){
        const response = await getIsFavorite(restaurant.id);
        if(response.statusResponse){
          setIsFavorite(response.isFavorite);
        }
      }
    })()
  },[isLogged,restaurant]);

  if (!restaurant) {
    return <Loading isVisible={true} text="Cargando..." />;
  }

  return (
    <ScrollView style={styles.viewBody}>
      <View style={styles.viewFavorite}>
        <Icon type="material-community" name={ isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={isFavorite ? "red": "grey"}
          size={35}
          underlayColor="transparent"
        />
      </View>
      <CarouselImages
      images={restaurant.images}
      height={250}
      width={widthScreen}
      activeSlide={activeSlide}
      setActiveSlide={setActiveSlide}
      />
      {/* <MyCarousel/> */}
      <TitleRestaurant
        name={restaurant.name}
        description={restaurant.description}
        rating={restaurant.rating}
      />
      <RestaurantInfo 
        name={restaurant.name}
        location={restaurant.location}
        address={restaurant.address}
        email={restaurant.email}
        phone={formatPhone(restaurant.callingCode,restaurant.phone)}
      />
      <ListReviews navigation={navigation} idRestaurant={restaurant.id}/>
      <Toast ref={toastRef} position="center" opacity={0.8}/>
      <Loading isVisible={loading} text="Cargando favoritos"/>
    </ScrollView>
  );
}

function TitleRestaurant({name,description,rating=0}){
  return(
    <View style={styles.viewRestaurantTitle}>
      <View style={styles.viewRestaurantContainer}>
        <Text style={styles.nameRestaurant}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}/>
      </View>
        <Text style={styles.descriptionRestaurant}>{description}</Text>
    </View>
  )
}

function 
RestaurantInfo({name, location, address ,email ,phone}){
  const listInfo = [
    { text: address, iconName:"map-marker"},
    { text: phone, iconName:"phone"},
    { text: email, iconName:"at"}
  ]

  return(
    <View styles={styles.viewRestaurantInfo}>
      <Text style={styles.restaurantInfoTitle}>Informacion sobre Restaurante</Text>
      <MapRestaurant
        name={name}
        location={location}
        height={150}
      />
      {
        map(listInfo,(item,index) =>(
          <ListItem
            key={index}
            style={styles.containerListItem}
          >
            <Icon
              type="material-community"
              name={item.iconName}
              color="#442421"
            />
            <ListItem.Content>
              <ListItem.Title>{item.text}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))
      }
    </View>
  )
}


const styles = StyleSheet.create({
  viewBody:{
    flex:1,
    backgroundColor:"#fff"
  },
  viewRestaurantTitle:{
    padding:15
  },
  viewRestaurantContainer:{
    flexDirection:"row"
  },
  nameRestaurant:{
    fontWeight:"bold"
  },
  descriptionRestaurant:{
    marginTop:5,
    color:"gray",
    textAlign:"justify"
  },
  rating:{
    position:"absolute",
    right:0
  },
  viewRestaurantInfo:{
    margin:15,
    marginTop:25
  },
  restaurantInfoTitle:{
    fontSize:25,
    fontWeight:"bold",
    marginBottom:15
  },
  containerListItem:{
    borderBottomColor:"#423123",
    borderBottomWidth:1
  },
  viewFavorite:{
    position: "absolute",
    top:0,
    right: 0,
    backgroundColor:"#fff",
    borderBottomLeftRadius:100,
    padding:5,
    paddingLeft:15,
    zIndex:100,
  }
});
