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
import client from '../../services/new_client';
import StarRating from "react-native-star-rating";


export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      searchText: "",
      searchList:[]
    };
  }


  promisedSetState = (newState) => {
    return new Promise((resolve) => {
        this.setState(newState, () => {
            resolve()
        });
    });
};

bookmarkImage(status){
  if(status === true){
    return require('../../assets/bookmarked.png');
  }
  else{
    return require('../../assets/bookmark.png');
  }
}

goDetail(book_id){
  this.props.navigation.navigate('BookDetail',{book_id : book_id});
}

async toggleBookmark(id,index){
    await client.post('/user/wishes/toggle',{book_id : id});
    this.state.searchList[index].marked =!this.state.searchList[index].marked
    console.log("worked");
    this.setState({searchList:this.state.searchList});
}

async getSearchResults(searchText){
  let {data} = await client.get("/books/search/" + searchText );
    let searchList = data.map( e=> {
      return{
        id: e.id,
        name: e.name,
        description: e.description,
        publisher: e.publisher,
        author: e.author,
        year: e.year,
        rate: e.rate,
        marked: e.marked
      };
    });
    await this.promisedSetState({searchList});
    console.log(this.state.searchList);
}

async getSearchResultsFromHome(){
    const { navigation } = this.props;
    const book_name = navigation.getParam("searchText", "NO-Text");
    let {data} = await client.get("/books/search/" + book_name );
    let searchList = data.map( e=> {
      return{
        id: e.id,
        name: e.name,
        description: e.description,
        publisher: e.publisher,
        author: e.author,
        year: e.year,
        rate: e.rate,
        marked: e.marked,
        link: e.link
      };
    });
    await this.promisedSetState({searchList});
    console.log(this.state.searchList);
  }

  async componentDidMount(){
    this.getSearchResultsFromHome()
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
              onPressAction={_ => this.getSearchResults(this.state.searchText)}
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
            <ScrollView style={{ flex: 7.9}}>
              {this.state.searchList.map((item, index) => (
                <View style={{flexDirection:'row',justifyContent:"space-around",backgroundColor: index % 2 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.6)',marginTop:10}} key={index}>
                <TouchableOpacity style={{flexDirection:"row",justifyContent:'space-around'}} 
                                  key={index}
                                  onPress={() => this.goDetail(item.id)}
                                  >
                  <Image
                    source={{uri: item.link}}
                    style={{
                      resizeMode: "contain",
                      height: 100,
                      width: 100
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "column"
                    }}
                  >
                    <Text
                      style={{ textAlign: "center", fontSize: 24, color: "white" }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{ textAlign: "center", fontSize: 12, color: "white" }}
                    >
                      {item.author} - {item.publisher}
                    </Text>
                    <View style={{justifyContent:'center',alignContent:'center'}}>
                      <StarRating
                          disabled={true}
                          maxStars={5}
                          rating={parseInt(item.rate)}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}} onPress={_  => this.toggleBookmark(item.id,index)}>
                    <Image
                      source={this.bookmarkImage(item.marked)}
                      style={{
                        alignSelf:'center',
                        resizeMode: "contain",
                        height: 30,
                        width: 30
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}