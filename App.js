import React from 'react';
import AppNavigator from './src/screens/AppNavigator';
import AlertModal from './src/components/AlertModal';
import {StatusBar, View, Text, TextInput} from 'react-native'


if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;

export default class App extends React.Component {

    render() {
        return (
            <View style={{width: '100%', height: '100%'}}>
                <StatusBar hidden={true}/>
                <AlertModal/>
                <AppNavigator/>
            </View>
        )
    }
}