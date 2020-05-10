import React from "react";
import {
  Clipboard,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import StarRating from "react-native-star-rating";
import background from "../../components/background";
import styles from "./style";
import {IndicatorViewPager} from 'rn-viewpager';
import client from '../../services/new_client';


export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      commentRate : 0,
      comments: [],
      wishList: [],
      success_trades: ["Harry Potter - Alfabeler", "Kurullar - Sorular"],
    };
  }

  promisedSetState = (newState) => {
    return new Promise((resolve) => {
        this.setState(newState, () => {
            resolve()
        });
    });
};
  async updateUser() {
    let {data: user} = await client.get('/user');
    this.setState({user});
  }

  async getWishList(){
    let {data} = await client.get('/user/wishes/'+this.state.user.id)
    let wishList = data.map( e=> {
      return{
          name: e.name,
          publisher: e.publisher,
          author: e.author,
          rate: e.rate
      }
    })
    await this.promisedSetState({wishList});
  }

  async getUserComments() {
    let {data} = await client.get("/user/comments/" + this.state.user.id)
    let comments = data.map( e=> {
        return{
            body: e.body,
            rate: e.rate,
            user: e.user
        };
    });
    await this.promisedSetState({comments});
  }

  async componentDidMount() {
    await this.updateUser();
    this.getUserComments();
    this.getWishList();
  }


//   onStarRatingPress = (rating) => {
//     this.setState({
//       commentRate: rating
//     });
//     this.forceUpdate();
//     console.log('commentRate: ' + this.state.commentRate)
//     console.log('rating : ' + rating)
//   }



//   addComment = () => {
//     Alert({
//       title: 'Add Comment',
//       slot: (
//           <View style={{height:'80%',}}>
//             <View style={{flex:1}}>
//             <Dropdown
//               textColor="white"
//               selectedItemColor="black"
//               baseColor="white"
//               label="Trades"
//               data={this.state.success_trades.map((item, index) => ({ value: item }))}
//             />
//             </View>
//             <View style={{flex:1,marginTop: 20}}>
//             <StarRating
//               disabled={false}
//               maxStars={5}
//               rating={this.state.commentRate}
//               selectedStar={(rating) => this.onStarRatingPress(rating)}
//               fullStarColor={'red'}
//             />
//             </View>
//             <View style={{flex:5,marginTop:20}}>
//               <TextInput style={{backgroundColor:'white',flex:1}}/>
//             </View>
//           </View>
//       ),
//       buttons: [
//           {
//               text: 'OK',
//               close: true
//           }
//       ]
//   })
// }

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
        <View style={{ flex: 9,marginTop:10,}}>
          <View style={{flexDirection:"row",justifyContent:'space-around', flex:1.5 }}>
            <Image
              source={{uri:this.state.user.avatar}}
              style={{
                resizeMode: "contain",
                height: 100,
                width: 100,
                borderRadius:50
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
                {this.state.user.name}
              </Text>
              <Text
                style={{ textAlign: "center", fontSize: 12, color: "white" }}
              >
                {this.state.user.city} - {this.state.user.district}
              </Text>
              <View style={{justifyContent:'center',alignContent:'center'}}>
                <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={parseInt(this.state.user.rate)}
                />
              </View>
            </View>
          </View>

          <View style={{flex:3,marginTop:10}}>
            <IndicatorViewPager style={{flex:1,backgroundColor:"rgba(0, 0, 0, 0.5)"}}>
            {this.state.comments.map((item, index) => (
                <View style={{justifyContent:'center', alignItems:'center',marginTop:20}} key={index}>
                  <View style={{flexDirection:"row"}}>
                    <Image source={require("../../assets/backIcon.png")} style={{marginRight:'30%',marginTop:20,resizeMode: "contain",height: 20,width: 20}}/>
                    <Image style={{ height:60,width:60,resizeMode:'stretch',borderRadius:30}} source={{uri: item.user.avatar}}/>
                    <Image source={require("../../assets/nextIcon.png")} style={{marginLeft:'30%',marginTop:20,resizeMode: "contain",height: 20,width: 20}}/>
                  </View>
                  <Text style={{fontSize:14,color:'white',textAlign:'center',marginTop:10}}> {item.user.city}</Text>
                  <Text style={{fontSize:14,color:'white',textAlign:'center',marginTop:10}}> {item.body} - {item.rate}</Text>
                </View>
              ))}
            </IndicatorViewPager>
          </View>

          <View style={{flex:4.5,marginTop:10}}>
              <Text style={{fontSize:30,color:'white',textAlign:'left',marginLeft:'3%',marginBottom:10}}>
                   WISH LIST
              </Text>
              <ScrollView>
              {this.state.wishList.map((item, index) => (
                // <TouchableOpacity 
                //   style={{ backgroundColor: index % 2 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.6)'}} 
                //   onPress={() => this.getTraders(item)} 
                //   key={index}
                // >
                // </TouchableOpacity>

                <View style={{flexDirection:"row",justifyContent:'space-around', flex:1.5, backgroundColor: index % 2 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.6)' }} key={index}>
                  <Image
                    source={require('../../assets/dummy-book.jpeg')}
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
              </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}
