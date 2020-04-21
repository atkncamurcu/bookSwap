import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native'
import GradientButton from '../components/GradientButton';
import client from '../services/new_client';
import {NavigationActions, StackActions} from 'react-navigation';
import {LinearGradient} from 'expo-linear-gradient';

export default class SideMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            user: {},
        }
    }

    // async updateUser() {
    //     let {data: user} = await client.get('/user');
    //     this.setState({user});
    // }

    // async componentDidMount() {
    //     let getUser = async () => {
    //         if (!client.getVerification())
    //             return setTimeout(getUser, 1000);
    //         this.updateUser();
    //     };
    //     getUser();
    // }


    render() {
        return (
            <LinearGradient style={{flex: 1}} colors={['#121429', '#0d0d14']}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <View style={{
                        flex: 0.2,
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity style={{position: 'absolute', top: 25, left: 10}}
                                          onPress={this.props.navigation.closeDrawer}>
                            <Image
                                source={require('../assets/backIcon.png')}
                                style={{height: 15, width: 15}}
                            />
                        </TouchableOpacity>
                        <Image
                            source={require("../assets/dummy-avatar.png")}
                            style={{borderRadius: 32, height: 64, width: 64}}
                        />
                        {/* <Text style={{color: '#ffffff', fontSize: 15}}>{this.state.user.name}</Text> */}
                        <Text style={{color: '#ffffff', fontSize: 15}}>Atakan Çamurcu</Text>
                    </View>
                    <View style={{marginTop: 15, flex: 0.8, alignItems: 'center'}}>
                        <GradientButton
                            textStyle={{fontSize: 23}}
                            gradientBegin="rgba(0,0,0,0.25)"
                            gradientEnd="rgba(0,0,0,0.25)"
                            gradientDirection="diagonal"
                            height={40}
                            width='75%'
                            radius={20}
                            children={
                                <View style={{justifyContent:'space-around',flexDirection:'row'}}>
                                <Image style={{width:18, height:18}} key={1}
                                    source={require("../assets/transaction-tab.png")}/>
                                <Text style={{color:'#fff'}} key={2}> Trades </Text>
                                </View>}
                            style={{marginTop: 15}}
                            onPressAction={() => {
                                this.props.navigation.navigate('Trade')
                            }}
                        />
                        <GradientButton
                            textStyle={{fontSize: 23}}
                            gradientBegin="rgba(0,0,0,0.25)"
                            gradientEnd="rgba(0,0,0,0.25)"
                            gradientDirection="diagonal"
                            height={40}
                            width='75%'
                            radius={20}
                            children={
                                <View style={{justifyContent:'space-between',flexDirection:'row'}}>
                            <Image style={{width: 18, height: 18}} key={1}
                                              source={require('../assets/setting-icon.png')}/>
                                <Text style={{color:'#fff'}} key={2}> Profile </Text>
                                </View>}
                            style={{marginTop: 15}}
                            onPressAction={() => {
                                this.props.navigation.navigate('Profile')
                            }}
                        />
                         <GradientButton
                            textStyle={{fontSize: 23}}
                            gradientBegin="rgba(0,0,0,0.25)"
                            gradientEnd="rgba(0,0,0,0.25)"
                            gradientDirection="diagonal"
                            height={40}
                            width='75%'
                            radius={20}
                            children={
                                <View style={{justifyContent:'space-around',flexDirection:'row'}}>
                                <Image style={{width:18, height:18}} key={1}
                                    source={require("../assets/transaction-tab.png")}/>
                                <Text style={{color:'#fff'}} key={2}> BookDetail </Text>
                                </View>}
                            style={{marginTop: 15}}
                            onPressAction={() => {
                                this.props.navigation.navigate('BookDetail')
                            }}
                        />
                        <GradientButton
                            textStyle={{fontSize: 23}}
                            gradientBegin="#ec232b"
                            gradientEnd="#f05e2c"
                            gradientDirection="diagonal"
                            height={40}
                            width='75%'
                            radius={20}
                            children={
                                <View style={{justifyContent:'space-between',flexDirection:'row'}}>
                            <Image style={{width: 18, height: 18}} key={1}
                                              source={require('../assets/logout-icon.png')}/>
                                <Text style={{color:'#fff'}} key={2}> Logout </Text>
                                </View>}
                            style={{marginTop: 15}}
                            onPressAction={() => {
                                client.setToken(null, false);
                                const resetAction = StackActions.reset({
                                    index: 0,
                                    actions: [NavigationActions.navigate({
                                        routeName: 'Login',
                                        params: {isLogout: true}
                                    })],
                                });
                                this.props.navigation.dispatch(resetAction);
                            }}
                        />
                    </View>
                </View>
            </LinearGradient>
        );
    }
}
