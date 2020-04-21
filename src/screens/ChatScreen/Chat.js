import React from 'react';
import {Clipboard, Image, ScrollView, Text, TouchableOpacity, View, Dimensions, PixelRatio} from 'react-native';
import background from '../../components/background';
import styles from './style';
import {SimpleAlert} from "../../components/AlertModal";

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            transactions: [],
            next_cursor: 0,
            has_more: false,
            shownTransactionId: null,
            balance: "0.00000",
        }
    }

    render() {
        return (
            <View style={{flexDirection: 'column', flex: 1}}>
                {background()}
                <Text>Chat Screen</Text>
                
            </View>
        );
    }
} 