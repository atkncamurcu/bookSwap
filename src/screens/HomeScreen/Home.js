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

  promisedSetState = (newState) => {
    return new Promise((resolve) => {
        this.setState(newState, () => {
            resolve()
        });
    });
};

goDetail(book_id){
  this.props.navigation.navigate('BookDetail',{book_id : book_id});
}


  async updateUser() {
    let {data: user} = await client.get('/user');
    this.setState({user});
  }

  async getPopularTraders(){
    let {data} = await client.post('/user/popular');
    let popularTraders = data.map(e => {
      return{
        id : e.id,
        name : e.name,
        city : e.city,
        district : e.district,
        avatar : e.avatar,
        rate : e.rate,
        type : e.type
      }
    })
    await this.promisedSetState({popularTraders});

  }

  getSearchDetails(searchText){
      this.props.navigation.navigate('Search',{searchText : searchText});
  }
    

  async getRecentylBooks(){
    let {data} = await client.get('/books/recently');
    let recentlyBooks = data.map( e=> {
      return{
        id : e.id,
        name : e.name,
        description : e.description,
        publisher : e.publisher,
        publish_year : e.year,
        author : e.author,
        rate : e.rate,
        link: e.link  
      };
    });
    await this.promisedSetState({recentlyBooks});
  }

  async componentDidMount() {
    this.updateUser();
    this.getPopularTraders();
    this.getRecentylBooks();
    this.props.navigation.addListener('didBlur', ({action}) => {
      if (!action.actions)
          return;
      action = action.actions[0];
  })
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
              source={{uri: this.state.user.avatar}}
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
              onPressAction={_ => this.getSearchDetails(this.state.searchText)}
            />
          </View>
          <View style={{ flexDirection: "column", flex:8}}>
            <View style={{flex:4.8}}>
              <Text
                style={{fontSize: 24,color: "white",paddingLeft: 10,flex: 0.3}}>
                Recently Added Books
              </Text>
              <ScrollView horizontal={true} style={{flex: 4.5, backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
              {this.state.recentlyBooks.map((item, index) => (
                <TouchableOpacity style={{height:150,width:150,marginLeft:10,alignSelf:'center',justifyContent:'center'}} onPress={() => this.goDetail(item.id)} key={index}>
                    <Image style={{ height:150,width:150,resizeMode:'contain'}} source={{uri: item.link}} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            </View>

            <View style={{flex:3.2,marginTop:40}}>
                  
            <Text style={{ fontSize: 24,color: "white",paddingLeft: 10,flex:0.3}}>
              Most Popular Traders
            </Text>

            <ScrollView horizontal={true} style={{ flex: 2.9, backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
              {this.state.popularTraders.map((item, index) => (
                item.type == 'user' &&
                <View style={{marginLeft:15,marginTop:20,alignItems:'center'}} key={index}>
                  <Image style={{ height:60,width:60,resizeMode:'stretch',borderRadius:30,alignSelf:'center'}} source={{uri:item.avatar}}/>
                  <Text style={{fontSize:12,color:'white',textAlign:'center',marginTop:5}}> {item.name}</Text>
                </View>
              ))}
            </ScrollView>

            </View>
          </View>
        </View>
      </View>
    );
  }
}
