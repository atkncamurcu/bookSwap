import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View,TextInput} from 'react-native';
import background from '../../components/background';
import styles from './style';
import {Alert} from "../../components/AlertModal";
import { Rating,AirbnbRating } from 'react-native-ratings';
import client from '../../services/new_client';

export default class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            messageList : [],
            userComment:"",
            starCount:3
        }
    }

    onStarRatingPress(rating) {
      this.setState({
        starCount: rating
      });
    }

    addComment = (user_id,trade_id) => {
      Alert({
        title: 'Add Comment',
        slot: (
            <View style={{height:'80%',}}>
              <View style={{flex:1,marginTop: 20}}>
              <AirbnbRating
                 count={5}
                 defaultRating={this.state.starCount}
                 showRating={true}
                 onFinishRating={(rating) => this.onStarRatingPress(rating)}
              />
              </View>
              <View style={{flex:5,marginTop:20}}>
                <TextInput 
                 style={{backgroundColor:'white',flex:1}}
                 onChangeText={(userComment) => this.setState({userComment})}
                 placeholder='Comment...'
                 placeholderTextColor="grey"
               />
              </View>
            </View>
        ),
        buttons: [
            {
               text: 'Cancel',
               fontSize:13,
               close: true,
               backgroundColor:'#2d2f4e'
            },
            {
               text: 'Add',
               fontSize:13,
               close: true,
               onPress: async() => {
                 await client.post("/user/comments/add",{u_id: user_id, body: this.state.userComment, rate: this.state.starCount, trade_id : trade_id})
                
               }
            }
        ]
    })
  }




    async getMessageList(){
        let {data} = await client.get("/user/chat/list");
        this.setState({messageList:data});
    }



    
      async componentDidMount() {
        this.getMessageList();
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
            
            <View style={{ flex: 8}}>
              <View style={{ flex:1.5 }}>
              <ScrollView horizontal={false} style={{ flex: 2.9, backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                  
                  {this.state.messageList.map((item, index) => (
                    <View style={{flexDirection:'row', justifyContent:'space-around',flex:1,backgroundColor: 'rgba(109,118,247, 0.2)'}} key={index}>

                    <TouchableOpacity style={{flexDirection:"row",padding:10,marginTop:8,flex:0.8}}
                        onPress={_ => this.props.navigation.navigate("Chat",
                        {
                          trade_id : item.trade_id,
                          owner_id : item.trader_user_id
                        })
                        }
                    >
                    
                        <Image source={{uri:item.owner.avatar}} style={{ height:60,width:60,resizeMode:'stretch',borderRadius:30}}/>
                          <Text style={{marginLeft:30,fontSize:22,color:'white',textAlign:'center',alignSelf:'center'}}>
                             {item.owner.name}
                          </Text>
                        
                        </TouchableOpacity>

                        <TouchableOpacity style={{alignItems:'center',justifyContent:'center',flex:0.2}} onPress={_  => this.addComment(item.trader_user_id,item.trade_id)}>
                        <Image
                          source={require("../../assets/tick.png")}
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