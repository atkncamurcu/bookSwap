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

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      searchText: "",
      popularTraders: [],
      recentlyBooks: []
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
          <TouchableOpacity onPress={this.props.navigation.openDrawer}>
            <Image
              source={require("../../assets/dummy-avatar.png")}
              style={{
                resizeMode: "contain",
                bottom: "25%",
                borderRadius: 20,
                marginLeft: 20,
                height: 40,
                width: 40,
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
                flex: 0.3
              }}
            >
              Recently Added Books
            </Text>
            <ScrollView style={{ flex: 3.7, backgroundColor: "yellow" }}>
              {this.state.recentlyBooks.map((item, index) => (
                <View></View>
              ))}
            </ScrollView>

            <Text
              style={{
                fontSize: 24,
                color: "white",
                paddingLeft: 10,
                flex: 0.3
              }}
            >
              Most Popular Traders
            </Text>
            <ScrollView style={{ flex: 3.7, backgroundColor: "red" }}>
              {this.state.popularTraders.map((item, index) => (
                <View>
                  
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}
