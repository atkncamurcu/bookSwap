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
import StarRating from "react-native-star-rating";
import background from "../../components/background";
import GradientButton from "../../components/GradientButton";
import { Dropdown } from "react-native-material-dropdown";
import styles from "./style";
import { Alert,SimpleAlert } from "../../components/AlertModal";
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

  async updateUser() {
    let {data: user} = await client.get('/user');
    this.setState({user});
  }

  async componentDidMount() {
    this.updateUser();
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
        <View style={{ flex: 9,marginTop:10 }}>
          <View style={{flexDirection:"row",justifyContent:'space-around', flex:1.5 }}>
            <Image
              source={{uri: this.state.user.avatar}}
              style={{
                resizeMode: "contain",
                borderRadius: 50,
                height: 100,
                width: 100
              }}
            />
            <View
              style={{
                flexDirection: "column",
              }}
            >
              <Text
                style={{ textAlign: "center", fontSize: 24, color: "white" }}
              >
                {this.state.user.name}
              </Text>
              <Text
                style={{ textAlign: "center", fontSize: 18, color: "white" }}
              >
                {this.state.user.city} - {this.state.user.district}
              </Text>
              <View style={{justifyContent:'center',alignContent:'center'}}>
                <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={this.state.user.rate}
                />
              </View>
            </View>
          </View>

          <View style={{flex:3.5,marginTop:5}}>
          <ScrollView style={{backgroundColor:'yellow'}}>
              {this.state.comments.map((item, index) => (
                <View>
                  
                </View>
              ))}
            </ScrollView>
            <GradientButton
              style={{
                marginTop:10,
                marginBottom:10,
                alignSelf:'center',
                width:'40%',
                height: 50,
              }}
              textStyle={{ fontSize: 16 }}
              gradientBegin="#ec232b"
              gradientEnd="#f05e2c"
              gradientDirection="diagonal"
              radius={10}
              text="Add Comment"
              onPressAction={_ => this.addComment()}
            />
          </View>

          <View style={{flex:4}}>
              <Text style={{fontSize:30,color:'white',textAlign:'left',marginLeft:'3%'}}>
                    WISHLIST
              </Text>
              <ScrollView style={{backgroundColor:'grey'}}>
              {this.state.wishList.map((item, index) => (
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
