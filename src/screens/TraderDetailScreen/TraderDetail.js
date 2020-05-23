import React from 'react';
import {Clipboard, Image, ScrollView, Text, TouchableOpacity, View, Dimensions, PixelRatio} from 'react-native';
import background from "../../components/background";
import StarRating from "react-native-star-rating";
import GradientButton from "../../components/GradientButton";
import {IndicatorViewPager} from 'rn-viewpager';
import styles from "./style";
import client from "../../services/new_client";
import stringCapitalizer from '../../services/utils';


export default class TraderDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            traderDetail: this.props.navigation.getParam('item',"NO-ITEM"),
            wishList: [],
            preferredBook:{},
            comments:[]
        }
    }

    promisedSetState = (newState) => {
        return new Promise((resolve) => {
            this.setState(newState, () => {
                resolve()
            });
        });
    };

    async getUserComments(){
      const { navigation } = this.props;
      const detail = navigation.getParam("item", "NO-ITEM");
      let {data} = await client.get('/user/comments/' + detail.owner_id)
      let comments = data.map( e=> {
        return{
            body: e.body,
            rate: e.rate,
            user: e.user
        }
      })
      await this.promisedSetState({comments});

    }
   
    async getTraders(id){
        let {data : traderDetail} = await client.get('/book/similar/item/' + id);
        this.setState({traderDetail});
      }
      

    async getPrefferedBookName(){
        const { navigation } = this.props;
        const detail = navigation.getParam("item", "NO-ITEM");
        let {data : preferredBook} = await client.get('/books/detail/' + detail.preferred_book_id)
        this.setState({preferredBook});
    }

    async getWishList(){
        const { navigation } = this.props;
        const detail = navigation.getParam("item", "NO-ITEM");
        let {data} = await client.get('/user/wishes/' + detail.owner_id)
        let wishList = data.map( e=> {
            return{
                id : e.id,
                name: e.name,
                description: e.description,
                publisher: e.publisher,
                author: e.author,
                year: e.year,
                rate: e.rate,
                link: e.link
            };
        });
        await this.promisedSetState({wishList});
      
    }

    async componentDidMount(){
        this.getPrefferedBookName();
        this.getWishList();
        this.getUserComments();
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
              <TouchableOpacity onPress={_ =>  this.props.navigation.navigate('BookDetail')}>
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
            <View style={{ flex: 9,marginTop:10}}>
              <View style={{flexDirection:"row",justifyContent:'space-around', flex:1.5}}>
                <Image
                  source={{uri:this.state.traderDetail.owner_book.link}}
                  style={{
                    paddingVertical:15,
                    resizeMode: "contain",
                    height: 100,
                    width: 100
                  }}
                />
                <View style={{flexDirection: "column"}}>
                  <Text style={{ textAlign: "center", fontSize: 24, color: "white",paddingVertical:5}}>
                    {this.state.traderDetail.owner.city} - {this.state.traderDetail.owner.district}
                  </Text>
                  <Text style={{ textAlign: "center", fontSize: 16, color: "white",paddingVertical:5 }}>
                    {stringCapitalizer(this.state.traderDetail.attrition)} - {this.state.traderDetail.published_year}
                  </Text>
                  <Text style={{ textAlign: "center", fontSize: 16, color: "white",paddingVertical:5 }}>
                    Preferred Book: {this.state.preferredBook.name}
                  </Text>
                  <View style={{justifyContent:'center',alignContent:'center',paddingTop:5}}>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={this.state.traderDetail.owner.rate}
                    />
                  </View>
                </View>
              </View>
              <View style={{flexDirection:'row',paddingVertical:15}}>
                    <View style={{backgroundColor:'rgba(0,0,0,0.5)', flexDirection:'column',flex:1}}>
                        <Text style={{textAlign:'center',fontSize:16,color:'white'}}>
                            Description:
                        </Text>
                        <Text style={{textAlign: "center", fontSize: 14, color: "white"}}>
                            {this.state.traderDetail.description}
                        </Text>
                    </View>
                   
                    <GradientButton
                        style={{alignSelf:'center',width: "40%",height: 40,flex:0}}
                        textStyle={{ fontSize: 16 }}
                        gradientBegin="#ec232b"
                        gradientEnd="#f05e2c"
                        gradientDirection="diagonal"
                        radius={10}
                        text="Message"
                        onPressAction={_ => this.props.navigation.navigate("Chat",
                        {
                          trade_id : this.state.traderDetail.id,
                          owner_id : this.state.traderDetail.owner_id})}
                    />
                  </View>
                  
              <View style={{flex:4}}>
                <View style={{flex:1.5}}>
                  <IndicatorViewPager style={{flex:1,backgroundColor:"rgba(0, 0, 0, 0.5)"}}>
                    {this.state.comments.map((item, index) => (
                        <View style={{justifyContent:'center', alignItems:'center',marginTop:5}} key={index}>
                          <View style={{flexDirection:"row"}}>
                            <Image source={require("../../assets/backIcon.png")} style={{marginRight:'30%',marginTop:35,resizeMode: "contain",height: 20,width: 20}}/>
                            <Image style={{ height:60,width:60,resizeMode:'stretch',borderRadius:30}} source={{uri: item.user.avatar}}/>
                            <Image source={require("../../assets/nextIcon.png")} style={{marginLeft:'30%',marginTop:35,resizeMode: "contain",height: 20,width: 20}}/>
                          </View>
                          <Text style={{fontSize:14,color:'white',textAlign:'center',marginTop:10}}> {item.user.city}</Text>
                          <Text style={{fontSize:14,color:'white',textAlign:'center',marginTop:10}}> {item.body} - {item.rate}</Text>
                        </View>
                      ))}
                    </IndicatorViewPager>
                </View>
                <View style={{flex:2.5,marginTop:15}}>
                  <Text style={{fontSize:30,color:'white',textAlign:'left',marginLeft:'3%'}}>
                          WISHLIST
                    </Text>
                    <ScrollView>
                    {this.state.wishList.map((item, index) => (
                        <View style={{ backgroundColor: index % 2 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.6)'}} key={index}>
                          <View style={{flexDirection:"row",paddingVertical:10 }}>
                              <Image source={{uri:item.link}} style={{flex:0,resizeMode: "contain",height: 100,width: 100}}/>
                              <View style={{flexDirection: "column",flex:1}}>
                                  <Text style={{ textAlign: "center", fontSize: 24, color: "white" }}>
                                      {item.name}
                                  </Text>
                                  <Text style={{ textAlign: "center", fontSize: 12, color: "white" }}>
                                      {item.author} - {item.publisher}
                                  </Text>
                              </View>
                          </View>
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