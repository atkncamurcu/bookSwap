import React from 'react';
import {Dimensions, Image, Switch, Text, TouchableOpacity, View} from 'react-native';
import * as SecureStore from 'expo-secure-store'
import * as LocalAuthentication from 'expo-local-authentication'
import client from '../../services/new_client';
import styles from './style'
import background from '../../components/background';
import {Alert} from '../../components/AlertModal';
import {TextInput} from 'react-native-gesture-handler';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fa: false,
            pin: "",
            logins: {
                "3fa": {
                    enable: false,
                    loginType: 0,
                    name: 'Login with Touch ID or Face ID'
                },
                "pin": {
                    enable: false,
                    loginType: 1,
                    name: 'Login with PIN'
                },
                "auto": {
                    enable: false,
                    name: 'Auto Login'
                }
            }
        }
    }

    promisedSetState = (newState) => {
        return new Promise((resolve) => {
            this.setState(newState, () => {
                resolve()
            });
        });
    };

    async componentDidMount() {
        let faEnable = (await this.hasAuthentication()).success;
        let tokenEnable = !!(await SecureStore.getItemAsync("token"));
        let pinEnable = !!(await SecureStore.getItemAsync("pin"));

        if (faEnable && tokenEnable) {
            this.state.logins["3fa"].enable = true;
        }

        if (pinEnable) {
            this.state.logins["pin"].enable = true;
        }

        this.state.fa = faEnable;
        this.state.logins.auto.enable = tokenEnable || pinEnable;
        await this.promisedSetState(this.state);
        console.log(this.state)
    }

    async hasAuthentication() {
        var success = await LocalAuthentication.hasHardwareAsync();
        return {success}
    }

    promptValidate = async (message) => {
        let {success} = await this.hasAuthentication();
        if (!success)
            return {success};

        let result = await LocalAuthentication.authenticateAsync(message);
        return result
    };

    changePin = async (status) => {
        if (status) {
            Alert({
                title: 'Enter New Pin',
                slot: () => (
                    <TextInput
                        style={[styles.input, {textAlign: 'center'}]}
                        onChangeText={(pin) => this.setState({pin})}
                        placeholder='New Pin'
                        placeholderTextColor="white"
                        keyboardType='numeric'

                    />
                ),
                buttons: [
                    {
                        text: 'Cancel',
                        close: true,
                        backgroundColor: '#2d2f4e',
                        onPress: () => {
                            this.state.logins.pin.enable = false;
                            this.state.logins.auto.enable = false;
                            this.setState(this.state)
                        }
                    },
                    {
                        text: 'OK',
                        close: true,
                        onPress: () => {
                            this.state.logins["pin"].enable = true;
                            this.state.logins["auto"].enable = true;
                            SecureStore.setItemAsync("auto", "1");
                            SecureStore.setItemAsync("pin", this.state.pin);
                            this.setState(this.state)
                        }
                    },
                ]
            })
        } else {
            Alert({
                
                slot: (<Text style={{color: '#afafb5'}}>Turn off pin login</Text>),
                buttons: [
                    {
                        text: 'Cancel',
                        close: true,
                        backgroundColor: '#2d2f4e',
                        onPress: () => {
                            this.state.logins.pin.enable = true;
                            this.setState(this.state)
                        }
                    },
                    {
                        text: 'Sure',
                        close: true,
                        onPress: () => {
                            SecureStore.deleteItemAsync("pin");
                            SecureStore.deleteItemAsync("auto");
                            this.state.logins.auto.enable = false;
                            this.state.logins.pin.enable = false;
                            this.setState(this.state)
                        }
                    },
                ]
            })
        }
    };

    changeAuto = async (status) => {
        if (status) {
            if (this.state.fa)
                this.change3fa(true);
            else
                this.changePin(true);

        } else {
            Alert({
                
                slot: (<Text style={{color: '#afafb5'}}>Turn off auto login</Text>),
                buttons: [
                    {
                        text: 'Cancel',
                        close: true,
                        backgroundColor: '#2d2f4e',
                        onPress: () => {
                            this.state.logins.auto.enable = true;
                            this.setState(this.state)
                        }
                    },
                    {
                        text: 'Sure',
                        close: true,
                        onPress: () => {
                            SecureStore.deleteItemAsync("token");
                            SecureStore.deleteItemAsync("pin");
                            SecureStore.deleteItemAsync("auto");
                            this.state.logins.auto.enable = false;
                            this.state.logins["3fa"].enable = false;
                            this.state.logins.pin.enable = false;
                            this.setState(this.state)
                        }
                    },
                ]
            })
        }
    };

    change3fa = async (status) => {
        if (status) {
            let {close} = Alert({
                slot: () => (
                    <View>
                        <Image style={{
                            height: Dimensions.get('window').width * 0.35,
                            alignSelf: 'center',
                            aspectRatio: 1,
                            marginBottom: 10
                        }} source={require('../../assets/touch-id.png')}/>
                    </View>
                ),
                buttons: [
                    {
                        text: 'Cancel',
                        close: true,
                        backgroundColor: '#2d2f4e',
                    }
                ]
            });

            var result = await this.promptValidate('ID Validate');
            if (result.success == true) {
                this.state.logins["3fa"].enable = true;
                this.state.logins["auto"].enable = true;
                SecureStore.setItemAsync("token", client.getToken());
                SecureStore.setItemAsync("auto", "1");
                this.setState(this.state)
            }
            close()
        } else {
            Alert({
                
                slot: (<Text style={{color: '#afafb5'}}>Turn off 3FA login</Text>),
                buttons: [
                    {
                        text: 'Cancel',
                        close: true,
                        backgroundColor: '#2d2f4e',
                        onPress: () => {
                            this.state.logins["3fa"].enable = true;
                            this.state.logins["auto"].enable = true;
                            this.setState(this.state)
                        }
                    },
                    {
                        text: 'Sure',
                        close: true,
                        onPress: () => {
                            SecureStore.deleteItemAsync("token");
                            SecureStore.deleteItemAsync("auto");
                            this.state.logins["3fa"].enable = false;
                            this.state.logins["auto"].enable = false;
                            this.setState(this.state)
                        }
                    },
                ]
            })
        }
    };

    render() {
        return (
            <View style={{flex: 1}}>
                {background()}
                <View style={styles.logoWrapper}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => this.props.navigation.navigate('Home')}>
                        <Image
                            source={require('../../assets/backIcon.png')}
                            style={styles.backIcon}/>
                    </TouchableOpacity>
                    <Text style={styles.settings}>Settings</Text>
                </View>
                <View style={styles.op1}>
                    <View style={styles.container}>
                        <Text style={{
                            fontSize: 15,
                            color: 'white',
                            textAlign: 'center'
                        }}> {this.state.logins["auto"].name} </Text>
                        <Switch onValueChange={this.changeAuto} value={this.state.logins["auto"].enable}/>
                    </View>
                    {
                        this.state.fa && this.state.logins.auto.enable && this.state.logins["3fa"].enable ? (
                            <View style={styles.container}>
                                <Text style={{
                                    fontSize: 15,
                                    color: 'white',
                                    textAlign: 'center'
                                }}> {this.state.logins["3fa"].name} </Text>
                                <Switch onValueChange={this.change3fa} value={this.state.logins["3fa"].enable}/>
                            </View>
                        ) : null
                    }
                    {
                        !this.state.fa && this.state.logins.auto.enable && this.state.logins["pin"].enable ? (
                            <View style={styles.container}>
                                <Text style={{
                                    fontSize: 15,
                                    color: 'white',
                                    textAlign: 'center'
                                }}> {this.state.logins["pin"].name} </Text>
                                <Switch onValueChange={this.changePin} value={this.state.logins["pin"].enable}/>
                            </View>
                        ) : null
                    }
                </View>
            </View>
        );
    }
}
