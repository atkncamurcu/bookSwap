import React from "react";
import {
  Image,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import background from "../../components/background";
import { Dropdown } from "react-native-material-dropdown";
import GradientButton from "../../components/GradientButton";
import styles from "./style";
import client from '../../services/new_client';
import stringCapitalizer from '../../services/utils';
import { Alert } from "../../components/AlertModal";


export default class CreateTrade extends React.Component {

  

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      books: [],
      city: [],
      district: [],
      attrition: ["new","newish","good","fair","bad"],
      publish_year : Array(100).fill(0).map((i,k)=>new Date().getFullYear()-k),
      user_book_id:null,
      user_attrition:"",
      user_publish_year:null,
      user_preferred_book_id:null,
      description : "",
  
    };
  }

  promisedSetState = (newState) => {
    return new Promise((resolve) => {
        this.setState(newState, () => {
            resolve()
        });
    });
  }

  chooseBook(value,index){
    this.setState({user_book_id : this.state.books[index].id})
  }

  chooseAttrition(value){
    var attrition = value.toLowerCase();
    this.setState({user_attrition : attrition});

  }

  choosePublishYear(value){
    this.setState({user_publish_year : value});

  }

  choosePreferredBook(value,index){
    this.setState({user_preferred_book_id : this.state.books[index].id})

  }

  
  async createTrade(){
    await client.post('/trade/create',
    { owner_book_id: this.state.user_book_id,  
      attrition: this.state.user_attrition,
      published_year: this.state.user_publish_year,
      preferred_book_id: this.state.user_preferred_book_id,
      description: this.state.description
    });
    Alert({
      title:'Information',
      slot: (<Text style={{color: '#afafb5'}}>Successfully created a trade.</Text>),
      buttons:[{
        text: 'OK',
        close: true,
        onPress: () => {this.props.navigation.navigate('Trade')}
      }]
    })
  }

  async getAllBooks(){
    let {data} = await client.get('/books/all');
    let books = data.map(e => {
      return{
        id:e.id,
        name:e.name,
      };
    });
    await this.promisedSetState({books})
  }


  async componentDidMount(){
    this.getAllBooks();
  }
  
  render() {
   
    return (
      <View style={{ flex: 1 }}>
        {background()}
        <KeyboardAvoidingView 
                        style={{flex: 1, backgroundColor: 'transparent'}} 
                        behavior= {(Platform.OS === 'ios')? "padding" : null}
                        enabled
        >
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
              data={this.state.books.map((item, index) => ({ value: item.name }))}
              onChangeText={(value,index)=> this.chooseBook(value,index)}
            />
            <Dropdown
              textColor="white"
              selectedItemColor="black"
              baseColor="white"
              label="ATTRITION"
              data={this.state.attrition.map((item, index) => ({ value: stringCapitalizer(item) }))}
              onChangeText={(value,index)=> this.chooseAttrition(value)}
            />
            <Dropdown
              textColor="white"
              selectedItemColor="black"
              baseColor="white"
              label="PUBLISH YEAR"
              data={this.state.publish_year.map((item, index) => ({ value: item }))}
              onChangeText={(value,index)=> this.choosePublishYear(value)}
            />
            <Dropdown
              textColor="white"
              selectedItemColor="black"
              baseColor="white"
              label="PREFERRED BOOK"
              data={this.state.books.map((item, index) => ({ value: item.name }))}
              onChangeText={(value,index)=> this.choosePreferredBook(value,index)}
            />
            <View style={{flex:4}}>
                <TextInput style={{flex:3,backgroundColor: "#444b9c",padding:10,marginBottom:5}}
                    onChangeText={description => this.setState({ description })}
                    textAlignVertical="top"    
                    value={this.state.description}
                    placeholder="Description..."
                    placeholderTextColor="white"
                    autoCapitalize="none"
                    returnKeyType="done"
                />
            </View>
            <View style={{flex:1,flexDirection:'row'}}>
                <GradientButton
                style={{
                justifyContent: "center",
                height:'80%',
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
                height:'80%'
              }}
              textStyle={{ fontSize: 16 }}
              gradientBegin="#ec232b"
              gradientEnd="#f05e2c"
              gradientDirection="diagonal"
              radius={10}
              text="Create"
              onPressAction={_ => this.createTrade()}
            />
                </View>
                
            
          </View>
        </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
