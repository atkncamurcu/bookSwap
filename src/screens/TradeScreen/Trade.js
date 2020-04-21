import React from 'react';
import {Clipboard, Image, ScrollView, Text, TouchableOpacity, View, Dimensions, PixelRatio} from 'react-native';
import background from '../../components/background';
import GradientButton from "../../components/GradientButton";
import styles from './style';
import {SimpleAlert} from "../../components/AlertModal";

export default class Trade extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            incomingOffers : [],
            outgoingOffers : [],
            selectedBegin : "#ec232b",
            selectedEnd : "#f05e2c",
            unselectedColor : "#2d2f4e",
            selected : true,
            modalIndex : 0

        }
    }

    render() {

        const incoming = <View style={{flex:1}}>
             <ScrollView style={{backgroundColor:'grey'}}>
              {this.state.incomingOffers.map((item, index) => (
                <View>
                  
                </View>
              ))}
            </ScrollView>
        </View>

        const outgoing = <View style={{flex:1}}>
        <ScrollView style={{backgroundColor:'orange'}}>
         {this.state.outgoingOffers.map((item, index) => (
           <View>
             
           </View>
         ))}
       </ScrollView>
   </View>

        return (
            <View style={{ flex: 1 }}>
        {background()}
        <View style={{ backgroundColor: "rgba(0,0,0,0.5)", flex: 1, alignItems: 'center',flexDirection: 'row',}}>
            <TouchableOpacity onPress={this.props.navigation.openDrawer}>
                <Image
                    source={require("../../assets/dummy-avatar.png")}
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
          <View style={{flexDirection:'row',flex:1}}>
          <GradientButton
              style={{
                marginTop:10,
                marginBottom:10,
                flex:1,
                height: 50,

              }}
              textStyle={{ fontSize: 16 }}
              gradientBegin={this.state.selected ? this.state.selectedBegin : this.state.unselectedColor}
              gradientEnd={this.state.selected ? this.state.selectedEnd : this.state.unselectedColor}
              gradientDirection="diagonal"
              radius={10}
              text="Incoming Offers"
              onPressAction={_ => this.setState({selected : true, modalIndex:0})}
            />
            <GradientButton
              style={{
                marginTop:10,
                marginBottom:10,
                flex:1,
                height: 50,

              }}
              textStyle={{ fontSize: 16 }}
              gradientBegin={!this.state.selected ? this.state.selectedBegin : this.state.unselectedColor}
              gradientEnd={!this.state.selected ? this.state.selectedEnd : this.state.unselectedColor}
              gradientDirection="diagonal"
              radius={10}
              text="Outgoing Offers"
              onPressAction={_ => this.setState({selected : false,  modalIndex:1})}
            />
          </View>
          <View style={{flex:8}}>
          {this.state.modalIndex == 0 ? incoming : outgoing }
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
      </View>
        );
    }
} 