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
import GradientButton from "../../components/GradientButton";
import styles from "./style";
import { SimpleAlert } from "../../components/AlertModal";

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      searchText: "",
      searchList:[]
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
          <TouchableOpacity onPress={_ =>  this.props.navigation.navigate("Home")}>
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
          <View style={{ flexDirection: "row", flex: 1 }}>
            <TextInput
              style={{
                width: "70%",
                textAlign: "left",
                height: 40,
                backgroundColor: "#444b9c",
                color: "white",
                paddingLeft: 10
              }}
              onChangeText={searchText => this.setState({ searchText })}
              value={this.state.searchText}
              placeholder="Search..."
              placeholderTextColor="white"
              autoCapitalize="none"
            />
            <GradientButton
              style={{
                justifyContent: "center",
                width: "27%",
                height: 40,
                marginRight: "3%"
              }}
              textStyle={{ fontSize: 16 }}
              gradientBegin="#ec232b"
              gradientEnd="#f05e2c"
              gradientDirection="diagonal"
              radius={10}
              text="SEARCH"
              onPressAction={_ => this.props.navigation.navigate("Search")}
            />
          </View>
          <View style={{ flexDirection: "column", flex: 8 }}>
            <Text
              style={{
                fontSize: 24,
                color: "white",
                paddingLeft: 10,
                flex: 0.1
              }}
            >
              Search Results
            </Text>
            <ScrollView style={{ flex: 7.9, backgroundColor: "yellow" }}>
              {this.state.searchList.map((item, index) => (
                <View></View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}