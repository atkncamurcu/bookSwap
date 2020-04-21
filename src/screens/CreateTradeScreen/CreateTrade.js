import React from "react";
import {
  Clipboard,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  PixelRatio,
  TextInput
} from "react-native";
import background from "../../components/background";
import { Dropdown } from "react-native-material-dropdown";
import GradientButton from "../../components/GradientButton";
import styles from "./style";
import { SimpleAlert } from "../../components/AlertModal";

export default class CreateTrade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      books: [
        "Harry Potter",
        "Grinin 50 Tonu",
        "Harry Potter",
        "Grinin 50 Tonu"
      ],
      city: ["Izmir", "Ankara", "Istanbul", "Bursa"],
      district: ["Narlıdere",'Balçova',"Üçyol",'Bornova'],
      attrition: ['Yeni','Az yıpranmış','Yıpranmış'],
      publish_year : ["1990","1991","1992","1993"],
      preferred_book : ["Araba Sevdası","Saatleri Ayarlama Enstitüsü","Araba Sevdası","Saatleri Ayarlama Enstitüsü"],
      description : ""

    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {background()}
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            flex: 1,
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          <TouchableOpacity
            onPress={_ => this.props.navigation.navigate("Trade")}
          >
            <Image
              source={require("../../assets/backIcon.png")}
              style={{
                resizeMode: "contain",
                bottom: "25%",
                marginLeft: 10,
                height: 30,
                width: 30,
                marginTop: 30
              }}
            />
          </TouchableOpacity>
          <Image
            source={require("../../assets/header-logo.png")}
            style={{
              bottom: "3.5%",
              height: 50,
              width: 150,
              marginTop: 30,
              marginLeft: "18%",
              justifyContent: "center"
            }}
          />
        </View>
        <View style={{ flex: 9, flexDirection: "column" }}>
          <View style={{ flex: 1, margin: 10 }}>
            <Dropdown
              textColor="white"
              selectedItemColor="black"
              baseColor="white"
              label="BOOK"
              data={this.state.books.map((item, index) => ({ value: item }))}
            />
            <Dropdown
              textColor="white"
              selectedItemColor="black"
              baseColor="white"
              label="CITY"
              data={this.state.city.map((item, index) => ({ value: item }))}
            />
            <Dropdown
              textColor="white"
              selectedItemColor="black"
              baseColor="white"
              label="DISTRICT"
              data={this.state.district.map((item, index) => ({ value: item }))}
            />
            <Dropdown
              textColor="white"
              selectedItemColor="black"
              baseColor="white"
              label="ATTRITION"
              data={this.state.attrition.map((item, index) => ({ value: item }))}
            />
            <Dropdown
              textColor="white"
              selectedItemColor="black"
              baseColor="white"
              label="PUBLISH YEAR"
              data={this.state.publish_year.map((item, index) => ({ value: item }))}
            />
            <Dropdown
              textColor="white"
              selectedItemColor="black"
              baseColor="white"
              label="PREFERRED BOOK"
              data={this.state.preferred_book.map((item, index) => ({ value: item }))}
            />
            <View style={{flex:4}}>
                <TextInput multiline={true} style={{flex:3,backgroundColor: "#444b9c",padding:10,marginBottom:5}}
                    onChangeText={description => this.setState({ description })}
                    value={this.state.searchText}
                    placeholder="Description..."
                    placeholderTextColor="white"
                    autoCapitalize="none"
                />
                <View style={{flex:1,flexDirection:'row'}}>
                <GradientButton
                style={{
                justifyContent: "center",
                height:'100%',
                flex:1
              }}
              textStyle={{ fontSize: 16 }}
              gradientBegin="#2d2f4e"
              gradientEnd="#2d2f4e"
              gradientDirection="diagonal"
              radius={10}
              text="Cancel"
              onPressAction={_ => this.props.navigation.navigate("Trade")}
            />
            <GradientButton
              style={{
                justifyContent: "center",
                flex:1,
                height:'100%'
              }}
              textStyle={{ fontSize: 16 }}
              gradientBegin="#ec232b"
              gradientEnd="#f05e2c"
              gradientDirection="diagonal"
              radius={10}
              text="Create"
              onPressAction={_ => this.props.navigation.navigate("Search")}
            />
                </View>
                
            </View>
            
          </View>
        </View>
      </View>
    );
  }
}
