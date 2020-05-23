import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from "react-native";
import background from "../../components/background";
import StarRating from "react-native-star-rating";
import GradientButton from "../../components/GradientButton";
import styles from "./style";
import client from "../../services/new_client";
import {IndicatorViewPager} from 'rn-viewpager';
import stringCapitalizer from '../../services/utils';
import {Alert, SimpleAlert} from '../../components/AlertModal';
import { Rating,AirbnbRating } from 'react-native-ratings';




export default class BookDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      bookDetail: {},
      similarBooks: [],
      comments: [],
      starCount:0,
      userComment:""
    };
  }

  promisedSetState = (newState) => {
    return new Promise((resolve) => {
        this.setState(newState, () => {
            resolve()
        });
    });
};
onStarRatingPress(rating) {
  this.setState({
    starCount: rating
  });
}

 addComment = () => {
     Alert({
       title: 'Add Comment',
       slot: (
           <View style={{height:'80%',}}>
             <View style={{flex:1,marginTop: 20}}>
             <AirbnbRating
                count={5}
                defaultRating={this.state.bookDetail.rate}
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
                await client.post("/book/comments/add",{book_id: this.state.bookDetail.id, body: this.state.userComment, rate: this.state.starCount})
                await this.getBookComments();

              }
           }
       ]
   })
 }

bookmarkImage(status){
  if(status === true){
    return require('../../assets/bookmarked.png');
  }
  else{
    return require('../../assets/bookmark.png');
  }
}

async toggleBookmark(id){
  await client.post('/user/wishes/toggle',{book_id : id});
  this.state.bookDetail.marked =!this.state.bookDetail.marked
  this.setState({bookDetail:this.state.bookDetail});
}

  async getBookDetails() {
    const { navigation } = this.props;
    const book_id = navigation.getParam("book_id", "NO-ID");
    let { data: bookDetail } = await client.get("/books/detail/" + book_id);
    this.setState({ bookDetail })
  }

  async getBookComments() {
    const { navigation } = this.props;
    const book_id = navigation.getParam("book_id", "NO-ID");
    let {data} = await client.get("/books/comments/" + book_id)
    let comments = data.map( e=> {
        return{
            body: e.body,
            rate: e.rate,
            user: e.user
        };
    });
    await this.promisedSetState({comments});
    //console.log(this.state.comments);
  }

  async getSimilarBooks() {
    const { navigation } = this.props;
    const book_id = navigation.getParam("book_id", "NO-ID");
    let {data} = await client.get("/books/similar/" + book_id);
    let similarBooks = data.map( e=> {
        return{
          id: e.id,
          owner_book_id: e.owner_book_id,
          owner_id: e.owner_id,
          trader_id: e.trader_id,
          preferred_book_id : e.preferred_book_id,
          description: e.description,
          published_year: e.published_year,
          attrition: e.attrition,
          status: e.status,
          owner: e.owner,
          owner_book: e.owner_book
        };
      });
      await this.promisedSetState({similarBooks});

  }

  async getTraders(item){
    this.props.navigation.navigate('TraderDetail',{item})
  }
  

  async componentDidMount() {
    await this.getBookDetails();
    this.getBookComments();
    this.getSimilarBooks();
  }


  render() {
    const {goBack} = this.props.navigation;
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
          <TouchableOpacity onPress={() => goBack()}>
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
          <Image source={{uri: this.state.bookDetail.link}} 
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
                {this.state.bookDetail.name}
              </Text>
              <Text
                style={{ textAlign: "center", fontSize: 12, color: "white" }}
              >
                {this.state.bookDetail.author} - {this.state.bookDetail.publisher}
              </Text>
              <View style={{justifyContent:'center',alignContent:'center'}}>
                <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={parseInt(this.state.bookDetail.rate)}
                />
              </View>
            </View>
            <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}} onPress={_  => this.toggleBookmark(this.state.bookDetail.id)}>
                    <Image
                      source={this.bookmarkImage(this.state.bookDetail.marked)}
                      style={{
                        alignSelf:'center',
                        resizeMode: "contain",
                        height: 30,
                        width: 30
                      }}
                    />
                  </TouchableOpacity>
          </View>

          <View style={{flex:3.5,marginTop:5}}>
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
                    SIMILAR TRADES
              </Text>
              <ScrollView>
              {this.state.similarBooks.map((item, index) => (
                item.status == "active" ? (
                  <TouchableOpacity 
                  style={{ backgroundColor: index % 2 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.6)'}} 
                  onPress={() => this.getTraders(item)} 
                  key={index}
                >
                  <View style={{paddingVertical:10,flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
                    <Image style={{ height:60,width:60,resizeMode:'stretch',borderRadius:30}} source={{uri: item.owner.avatar}}/>
                    <Text style={{fontSize:14,color:'white',textAlign:'center',marginTop:10}}> {item.owner.name}</Text>
                    <Text style={{fontSize:14,color:'white',textAlign:'center',marginTop:10}}> Trade Status: {stringCapitalizer(item.status)}</Text>
                  </View>
                </TouchableOpacity>
                ):
                (
                  <TouchableOpacity 
                  style={{ backgroundColor: index % 2 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.6)'}} 
                  onPress={() => this.getTraders(item)} 
                  key={index}
                  disabled={true}
                >
                  <View style={{paddingVertical:10,flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
                    <Image style={{ height:60,width:60,resizeMode:'stretch',borderRadius:30}} source={{uri: item.owner.avatar}}/>
                    <Text style={{fontSize:14,color:'white',textAlign:'center',marginTop:10}}> {item.owner.name}</Text>
                    <Text style={{fontSize:14,color:'white',textAlign:'center',marginTop:10}}> Trade Status: {stringCapitalizer(item.status)}</Text>
                  </View>
                </TouchableOpacity>
                )
                
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}
