import React from 'react';
import {Clipboard, Image, ScrollView, Text, TouchableOpacity, View, Dimensions, PixelRatio} from 'react-native';
import background from '../../components/background';
import GradientButton from "../../components/GradientButton";
import styles from './style';
import {SimpleAlert} from "../../components/AlertModal";
import client from '../../services/new_client';
import stringCapitalizer from '../../services/utils';

export default class Trade extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            tradeList : [],
        }
    }

    async updateUser() {
      let {data: user} = await client.get('/user');
      this.setState({user});
    }

    promisedSetState = (newState) => {
      return new Promise((resolve) => {
          this.setState(newState, () => {
              resolve()
          });
      });
    }

    async getTradeList(){
      let {data} = await client.get("/trade/list");
      let tradeList = data.map(e => {
        return{
          id:e.id,
          owner_book_id: e.owner_book_id,
          owner_id : e.owner_id,
          trader_id : e.trader_id,
          preferred_book_id : e.preferred_book_id,
          description : e.description,
          published_year : e.published_year,
          attrition : e.attrition,
          status: e.status,
          owner_book: e.owner_book,
          preferred_book: e.preferred_book
        };
      });
      await this.promisedSetState({tradeList})
    }
  
    async componentDidMount() {
      this.updateUser();
      this.getTradeList();
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
        <View style={{ backgroundColor: "rgba(0,0,0,0.5)", flex: 1, alignItems: 'center',flexDirection: 'row',}}>
            <TouchableOpacity onPress={this.props.navigation.openDrawer}>
                <Image
                    source={{uri : this.state.user.avatar}}
                    style={{
                        resizeMode:'contain',
                        bottom: '25%',
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
                    bottom: '3.5%',
                    height: 50,
                    width: 150,
                    marginTop: 30,
                    marginLeft: '18%',
                    justifyContent: 'center'
                }}
            />
        </View>
        <View style={{flex:9}}>
        <Text style={{marginTop:8,fontSize:28,color:'white',textAlign:'left',marginLeft:'3%'}}>
                        Created Trades
                  </Text>
        <ScrollView>
                  {this.state.tradeList.map((item, index) => (
                      <View style={{backgroundColor: index % 2 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.6)',paddingVertical:10}} key={index}>
                        <View style={{flexDirection:"column" }}>
                          <View style={{flexDirection:"row",justifyContent:'space-between'}}>
                            <Text style={{ textAlign: "left", fontSize: 16, color: "white",flex:0,marginLeft:8 }}>
                                  Owner Book
                            </Text>
                            <Text style={{ textAlign: "left", fontSize: 16, color: "white",flex:0 }}>
                                  :
                            </Text>
                            <Text style={{ textAlign: "right", fontSize: 16, color: "white",flex:1,marginRight:15}}>
                                {item.owner_book.name} 
                            </Text>
                          </View>

                          <View style={{flexDirection:"row",justifyContent:'space-between'}}>
                            <Text style={{ textAlign: "left", fontSize: 16, color: "white",flex:0,marginLeft:8 }}>
                                  Preferred Book
                            </Text>
                            <Text style={{ textAlign: "left", fontSize: 16, color: "white",flex:0}}>
                                  :
                            </Text>
                            <Text style={{ textAlign: "right", fontSize: 16, color: "white",flex:1,marginRight:15}}>
                                {item.preferred_book.name} 
                            </Text>
                          </View>

                          <View style={{flexDirection:"row",justifyContent:'space-between'}}>
                            <Text style={{ textAlign: "left", fontSize: 16, color: "white",flex:0,marginLeft:8 }}>
                                  Attrition
                            </Text>
                            <Text style={{ textAlign: "left", fontSize: 16, color: "white",flex:0}}>
                                  :
                            </Text>
                            <Text style={{ textAlign: "right", fontSize: 16, color: "white",flex:1,marginRight:15}}>
                                {stringCapitalizer(item.attrition)} 
                            </Text>
                          </View>

                          <View style={{flexDirection:"row",justifyContent:'space-between'}}>
                            <Text style={{ textAlign: "left", fontSize: 16, color: "white",flex:0,marginLeft:8 }}>
                                  Publish Year
                            </Text>
                            <Text style={{ textAlign: "left", fontSize: 16, color: "white",flex:0}}>
                                  :
                            </Text>
                            <Text style={{ textAlign: "right", fontSize: 16, color: "white",flex:1,marginRight:15}}>
                                {item.published_year} 
                            </Text>
                          </View>

                          <View style={{flexDirection:"row",justifyContent:'space-between'}}>
                            <Text style={{ textAlign: "left", fontSize: 16, color: "white",flex:0,marginLeft:8 }}>
                                  Status
                            </Text>
                            <Text style={{ textAlign: "left", fontSize: 16, color: "white",flex:0}}>
                                  :
                            </Text>
                            <Text style={{ textAlign: "right", fontSize: 16, color: "white",flex:1,marginRight:15}}>
                                {stringCapitalizer(item.status)} 
                            </Text>
                          </View>
                          
                          <View style={{flexDirection:"row",justifyContent:'space-between'}}>
                            <Text style={{ textAlign: "left", fontSize: 16, color: "white",flex:0,marginLeft:8 }}>
                                  Description
                            </Text>
                            <Text style={{ textAlign: "left", fontSize: 16, color: "white",flex:0}}>
                                  :
                            </Text>
                            <Text style={{ textAlign: "right", fontSize: 16, color: "white",flex:1,marginRight:15}}>
                                {item.description} 
                            </Text>
                          </View>

                        </View>
                      </View>
                  ))}
                </ScrollView>
          <GradientButton
              style={{
                position: 'absolute',
                width: 50,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                right: 15,
                bottom: 15,
              }}
              
              textStyle={{ fontSize: 18 }}
              gradientBegin="#ec232b"
              gradientEnd= "#f05e2c"
              gradientDirection="diagonal"
              radius={25}
              text="+"
              onPressAction={_ => this.props.navigation.navigate('CreateTrade')}
            />
          </View>
      </View>
        );
    }
} 