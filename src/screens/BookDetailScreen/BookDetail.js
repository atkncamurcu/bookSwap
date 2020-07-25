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
import client from "../../services/new_client";
import {IndicatorViewPager} from 'rn-viewpager';
import stringCapitalizer from '../../services/utils';
import {Alert} from '../../components/AlertModal';
import { AirbnbRating } from 'react-native-ratings';
import styles from "./style";




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
           <View style={styles.commentAlertWrapper}>
             <View style={styles.ratingWrapper}>
             <AirbnbRating
                count={5}
                defaultRating={this.state.bookDetail.rate}
                showRating={true}
                onFinishRating={(rating) => this.onStarRatingPress(rating)}
             />
             </View>
             <View style={styles.inputWrapper}>
               <TextInput 
                style={styles.input}
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
                await this.getBookDetails();

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
      <View style={styles.fullScreen}>
        {background()}
        <View style={styles.headerView}>
          <TouchableOpacity onPress={() => goBack()}>
            <Image
              source={require("../../assets/backIcon.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Image
            source={require("../../assets/header-logo.png")}
            style={styles.headerLogo}
          />
        </View>
        <View style={styles.mainView}>
          <View style={styles.bookDetailWrapper}>
          <Image source={{uri: this.state.bookDetail.link}} style={styles.bookImage}/>
            <View style={styles.columnDirection}>
              <Text style={styles.bookName}>
                {this.state.bookDetail.name}
              </Text>
              <Text style={styles.authorName}>
                {this.state.bookDetail.author} - {this.state.bookDetail.publisher}
              </Text>
              <View style={styles.rating}>
                <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={parseInt(this.state.bookDetail.rate)}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.bookmarkButton} onPress={_  => this.toggleBookmark(this.state.bookDetail.id)}>
                    <Image
                      source={this.bookmarkImage(this.state.bookDetail.marked)}
                      style={styles.bookmarkImage}
                    />
                  </TouchableOpacity>
          </View>

          <View style={styles.commentWrapper}>
            <IndicatorViewPager style={styles.indicator}>
            {this.state.comments.map((item, index) => (
                <View style={styles.commentItem} key={index}>
                  <View style={styles.rowDirection}>
                    <Image source={require("../../assets/backIcon.png")} style={styles.commentBackIcon}/>
                    <Image style={styles.commentAvatar} source={{uri: item.user.avatar}}/>
                    <Image source={require("../../assets/nextIcon.png")} style={styles.commentNextIcon}/>
                  </View>
                  <Text style={styles.commentInfos}> {item.user.city}</Text>
                  <Text style={styles.commentInfos}> {item.body} - {item.rate}</Text>
                </View>
              ))}
            </IndicatorViewPager>
            <GradientButton
              style={styles.addCommentButton}
              textStyle={{ fontSize: 16 }}
              gradientBegin="#ec232b"
              gradientEnd="#f05e2c"
              gradientDirection="diagonal"
              radius={10}
              text="Add Comment"
              onPressAction={_ => this.addComment()}
            />
          </View>

          <View style={styles.similarWrapper}>
              <Text style={styles.similarTitle}>
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
                  <View style={styles.similarItem}>
                    <Image style={styles.similarAvatar} source={{uri: item.owner.avatar}}/>
                    <Text style={styles.commentInfos}> {item.owner.name}</Text>
                    <Text style={styles.commentInfos}> Trade Status: {stringCapitalizer(item.status)}</Text>
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
                  <View style={styles.similarItem}>
                    <Image style={styles.similarAvatar} source={{uri: item.owner.avatar}}/>
                    <Text style={styles.commentInfos}> {item.owner.name}</Text>
                    <Text style={styles.commentInfos}> Trade Status: {stringCapitalizer(item.status)}</Text>
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
