import React from 'react';
import {Dimensions, Image, KeyboardAvoidingView, Text, TextInput, TouchableHighlight, TouchableOpacity,View} from 'react-native';
import GradientButton from '../../components/GradientButton';
import * as SecureStore from 'expo-secure-store'
import * as LocalAuthentication from 'expo-local-authentication'
import {Alert, SimpleAlert} from '../../components/AlertModal'
import background from '../../components/background'

import {View as AnimationView} from 'react-native-animatable'
import {BarPasswordStrengthDisplay} from 'react-native-password-strength-meter'

import styles from './style';
import client from '../../services/new_client';


export default class Login extends React.Component {
    state = {
        biometrics: false,
        fontLoaded: false,
        biometricPromt: false,
        loginWithMail: true,
        registerWithMail: false,
        email: "",
        password: "",
        password_confirmation: "",
        name: "",
        modalIndex: 0,
        pin: ""
    };

    constructor() {
        super()
    }

    login = async () => {
        var autoLoginToken = await SecureStore.getItemAsync('token');
        var pinControll = await SecureStore.getItemAsync("pin");
        let {success} = await this.hasAuthentication();
        if (autoLoginToken && !this.props.navigation.getParam('isLogout', false) && success) {
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
                        backgroundColor: '#61c3c2',
                    }
                ]
            });
            var result = await this.promptValidate('PIN ID');
            if (result.success == true) {
                client.setToken(autoLoginToken);
                this.props.navigation.navigate('Home')
            }
            close()
        } else if (autoLoginToken && !this.props.navigation.getParam('isLogout', false) && !success) {
            let {close} = Alert({
                title: 'Enter Pin',
                slot: () => (
                    <TextInput
                        style={styles.input}
                        onChangeText={(pin) => this.setState({pin})}
                        placeholder='Pin'
                       placeholderTextColor="grey"
                        keyboardType='numeric'
                        secureTextEntry={true}

                    />
                ),
                buttons: [
                    {
                        text: 'Cancel',
                        close: true,
                        backgroundColor: '#61c3c2',
                    },
                    {
                        text: 'OK',
                        close: false,
                        onPress: () => {
                            if (pinControll == this.state.pin) {
                                client.setToken(autoLoginToken);
                                close();
                                this.props.navigation.navigate('Home')
                            } else {
                                SimpleAlert(
                                    "Information", "Wrong PIN"
                                )
                            }

                        }
                    },
                ]
            })
        }
    };

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
    

    loginPostWithEmail = async () => {
        let {token, verificated} = await client.post('/login', {email: this.state.email, password: this.state.password});

        if(!verificated){
            Alert({
                title: 'Information',
                slot: (<Text style={{color: '#afafb5'}}>Account is not verificated. Do you want a resend mail to your mailbox.</Text>),
                buttons: [
                    {
                        text: 'Cancel',
                        close: true,
                        backgroundColor: '#61c3c2'
                    },
                    {
                        text: 'Send',
                        close: true,
                        onPress: () => {
                            client.post('/email/resend');
                        }
                    }
                ]
            }
        )
        }


        if (token !== undefined && verificated) {
            let {success} = await this.hasAuthentication();
            var autoLoginToken = await SecureStore.getItemAsync('token');

            if (!autoLoginToken && success) {
                Alert({
                    title: '',
                    slot: () => (
                        <View>
                            <Image style={{
                                height: Dimensions.get('window').width * 0.35,
                                alignSelf: 'center',
                                aspectRatio: 1,
                                marginBottom: 10
                            }} source={require('../../assets/touch-id.png')}/>
                            <Text style={{textAlign: 'center', color: 'white', fontSize: 20}}> Do you want save
                                your TouchID {'\n'} for the login next time? </Text>
                        </View>
                    ),
                    buttons: [
                        {
                            text: 'No, Thanks',
                            close: true,
                            backgroundColor: '#61c3c2',
                            onPress: () => {
                                if (verificated)
                                    this.props.navigation.navigate('Home')
                            }
                        },
                        {
                            text: 'Sure',
                            close: true,
                            onPress: () => {
                                SecureStore.setItemAsync('token', token);
                                if (verificated)
                                    this.props.navigation.navigate('Home')
                            }
                        }
                    ]
                });
            } else if (!autoLoginToken && !success) {
                Alert({
                    title: 'Enter New Pin',
                    slot: () => (
                        <TextInput
                            style={styles.input}
                            onChangeText={(pin) => this.setState({pin})}
                            placeholder='New Pin'
                           placeholderTextColor="grey"
                            keyboardType='numeric'
                        />
                    ),
                    buttons: [
                        {
                            text: 'Cancel',
                            close: true,
                            backgroundColor: '#61c3c2',
                        },
                        {
                            text: 'OK',
                            close: true,
                            onPress: () => {
                                SecureStore.setItemAsync("token", client.getToken());
                                SecureStore.setItemAsync("pin", this.state.pin);
                                this.setState(this.state);
                                this.props.navigation.navigate('Home')
                            }
                        },
                    ]
                })
            } else {
                if (verificated)
                    this.props.navigation.navigate('Home')
            }
        }
    };

    registerPostWithEmail = async () => {
        let {token, verificated} = await client.post('/register',
            {
                email: this.state.email,
                password: this.state.password,
                password_confirmation: this.state.password_confirmation,
                name: this.state.name
            });
        Alert({
                title: 'Information',
                slot: (<Text style={{color: '#afafb5'}}>Verification mail sent to your email address.</Text>),
                buttons: [
                    {
                        text: 'OK',
                        close: true
                    }
                ]
            }
        )
    };

    forgetPasswordPost = async () => {
        await client.post('/password/email', {email: this.state.email});
        this.setState({modalIndex: 0});
        Alert({
                title: 'Information',
                slot: (<Text style={{color: '#afafb5'}}>Password reset mail sent to your email address.</Text>),
                buttons: [
                    {
                        text: 'OK',
                        close: true
                    }
                ]
            }
        )
    };

    promisedSetState = (newState) => {
        return new Promise((resolve) => {
            this.setState(newState, () => {
                resolve()
            });
        });
    };

    async componentDidMount() {
        this.login();

        this.setState({fontLoaded: true});
    }

    onChange = password => this.setState({password})

    render() {
        const { password } = this.state
        const login = <View style={styles.loginScreen}>
            <TextInput
                style={[styles.input, {marginBottom: 10}]}
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
                placeholder="Email"
               placeholderTextColor="grey"
                keyboardType="email-address"
                autoCapitalize='none'
            />
            <TextInput
                style={styles.input}
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
                placeholder="Password"
               placeholderTextColor="grey"
                textContentType="password"
                autoCapitalize='none'
                secureTextEntry={true}
            />
            <View style={{alignSelf: 'flex-end', marginTop: 10, marginBottom: 25}}>
                <Text onPress={_ => this.setState({modalIndex: 2})}
                      style={{textAlign: 'right', color: '#fff', fontSize: 15, textDecorationLine: 'underline'}}>
                    Forgot Password?
                </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                {/* <TouchableOpacity onPress={_ => this.setState({modalIndex: 1})} style={styles.signBtn}>
                    <Text style={{fontSize: 18,fontFamily:'made-evolve-regular'} }> Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.loginPostWithEmail} style={[styles.signBtn,{backgroundColor:'#d05b74'}]}>
                    <Text style={{fontSize: 18,fontFamily:'made-evolve-regular'} }> Login</Text>
                </TouchableOpacity> */}
                 <GradientButton
                    style={styles.signBtn}
                    textStyle={{fontSize: 18}}
                    gradientBegin="#61c3c2"
                    gradientEnd="#61c3c2"
                    gradientDirection="diagonal"
                    radius={13}
                    text="Sign Up"
                    onPressAction={_ => this.setState({modalIndex: 1})}
                />
                <GradientButton
                    style={styles.signBtn}
                    textStyle={{fontSize: 18}}
                    gradientBegin="#354A82"
                    gradientEnd="#354A82"
                    gradientDirection="diagonal"
                    radius={13}
                    text="Login"
                    onPressAction={this.loginPostWithEmail}
                    //denemek için bunu kullan
                    //onPressAction={this.props.navigation.navigate('Home')} 
                />
            </View>
        </View>;

        const register = <View style={styles.loginScreen}>
            <TextInput
                style={styles.input}
                onChangeText={(name) => this.setState({name})}
                value={this.state.name}
                placeholder="Full Name"
               placeholderTextColor="grey"
            />
            <TextInput
                style={styles.input}
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
                placeholder="Email"
                placeholderTextColor="grey"
                keyboardType="email-address"
                autoCapitalize='none'
            />
            <TextInput
                style={styles.input}
                onChangeText={this.onChange}
                value={this.state.password}
                placeholder="Password"
                placeholderTextColor="grey"
                textContentType='password'
                autoCapitalize='none'
                maxLength={20}
                secureTextEntry={true}

            />
            <BarPasswordStrengthDisplay
                password={password}
                defaultPassword=""
                width={Dimensions.get("window").width-(Dimensions.get("window").width/6)}
            />
            <TextInput
                style={styles.input}
                onChangeText={(password_confirmation) => this.setState({password_confirmation})}
                value={this.state.password_confirmation}
                placeholder="Confirm Password"
                placeholderTextColor="grey"
                textContentType="password"
                autoCapitalize='none'
                maxLength={20}
                secureTextEntry={true}
            />
            <View style={{flexDirection: 'row'}}>
                <TouchableHighlight
                    style={[styles.signBtn, {backgroundColor: "#61c3c2", borderRadius: 13}]}
                    textStyle={{fontSize: 18,}}
                    onPress={_ => this.setState({modalIndex: 0})}
                >
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{fontSize: 18,  color: '#fff'}}> {'<'} </Text>
                        <Text style={{fontSize: 18,  color: '#fff'}}>Back</Text>
                    </View>
                </TouchableHighlight>
                <TouchableOpacity onPress={this.registerPostWithEmail} style={[styles.signBtn,{backgroundColor:"#354A82"}]}>
                    <Text style={{color:'white',fontSize: 18,} }> Register</Text>
                </TouchableOpacity>
                
                {/* <GradientButton
                    style={styles.signBtn}
                    textStyle={{fontSize: 18, fontFamily: 'made-evolve-regular'}}
                    gradientBegin="#d05b74"
                    gradientEnd="#d05b74"
                    gradientDirection="diagonal"
                    radius={13}
                    text="Register"
                    onPressAction={this.registerPostWithEmail}

                /> */}

            </View>
        </View>;

        const forgetPassword = <View style={styles.loginScreen}>
            <TextInput
                style={styles.input}
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
                placeholder="Email"
               placeholderTextColor="grey"
                keyboardType="email-address"
                autoCapitalize='none'
            />
            <View style={{flexDirection: 'row'}}>
                <TouchableHighlight
                    style={[styles.signBtn, {backgroundColor: "#61c3c2", borderRadius: 13}]}
                    textStyle={{fontSize: 18,}}
                    onPress={_ => this.setState({modalIndex: 0})}
                >
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{fontSize: 18, color: '#fff'}}> {'<'} </Text>
                        <Text style={{fontSize: 18, color: '#fff'}}>Back</Text>
                    </View>
                </TouchableHighlight>
                <GradientButton
                    style={styles.signBtn}
                    textStyle={{fontSize: 18,}}
                    gradientBegin="#354A82"
                    gradientEnd="#354A82"
                    gradientDirection="diagonal"
                    radius={13}
                    impact
                    impactStyle='Light'
                    text="Send Mail"
                    onPressAction={this.forgetPasswordPost}
                />
            </View>
        </View>;

        return (
                <View style={{flex: 1}}>
                    {background()}
                    <KeyboardAvoidingView style={{flex: 1, backgroundColor: 'transparent'}} behavior="padding" enabled>

                        <View style={styles.logoWrapper}>
                            <View style={{
                                marginBottom: 90,
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1
                            }}>
                                <AnimationView animation={'fadeIn'} delay={0} duration={4000}>
                                    <Image
                                        resizeMode={"contain"}
                                        source={require('../../assets/bookSwipe-logo.png')}
                                        style={{width: 178.5, height: 157.5}}/>
                                </AnimationView>
                            </View>
                            <AnimationView animation={'fadeInUpBig'} delay={0} duration={1500} style={{width: '100%'}}>
                                {this.state.modalIndex == 0 ? login : (this.state.modalIndex == 1 ? register : forgetPassword)}
                            </AnimationView>
                        </View>
                    </KeyboardAvoidingView>
                </View>
        );
    }
}