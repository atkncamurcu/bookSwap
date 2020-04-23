import React from 'react';
import {Clipboard, Image, ScrollView, Text, TouchableOpacity, View, Dimensions, PixelRatio} from 'react-native';
import background from '../../components/background';
import styles from './style';
import {SimpleAlert} from "../../components/AlertModal";
import client from '../../services/new_client';

export default class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            messageList : []
        }
    }

    async updateUser() {
        let {data: user} = await client.get('/user');
        this.setState({user});
      }
    
      async componentDidMount() {
        this.updateUser();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
        {background()}
        <View style={{ backgroundColor: "rgba(0,0,0,0.5)", flex: 1, alignItems: 'center',flexDirection: 'row',}}>
            <TouchableOpacity onPress={this.props.navigation.openDrawer}>
                <Image
                    source={{uri: this.state.user.avatar}}
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
          <Text style={{ textAlign: "center", fontSize: 30, color: "white" }}>
            Message
          </Text>
        </View>
      </View>
        );
    }
} 