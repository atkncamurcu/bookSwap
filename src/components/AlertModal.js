import {Modal, Text, View} from 'react-native'
import GradientButton from '../components/GradientButton';
import React from 'react'
import {View as AnimationView} from 'react-native-animatable'
import background from '../components/background'

let component;
let modals = [
    /*
    {
        title: 'Test',
        direction: 'column',
        slot: (<Text style={{ color: '#afafb5' }}>Slot Content</Text>),
        buttons: [
            {
                text: 'OK',
                onPress: () => console.log("asdas")
            },
            {
                text: 'Cancel',
                close: true,
                onPress: () => console.log("asdas")
            },
        ]
    }, {
        title: 'Test2',
        slot: (<Text style={{ color: '#afafb5' }}>Slot Content</Text>),
        buttons: [
            {
                text: 'OK',
                onPress: () => console.log("asdas")
            },
            {
                text: 'Cancel',
                close: true,
                onPress: () => console.log("asdas")
            }
        ]
    } 
    */
];

export const Alert = (i) => {
    let index = modals.push(i) - 1;
    component.forceUpdate();
    return {
        update() {
            component.forceUpdate(component.forceUpdate);
        },
        close() {
            modals.splice(index, 1);
            component.forceUpdate();
        }
    };
};

export const SimpleAlert = (title, text, buttons) => {
    if (!buttons)
        buttons = [
            {
                text: 'OK',
                close: true
            }
        ];
    return Alert({
        title,
        slot: (<Text style={{color: '#afafb5'}}>{text}</Text>),
        buttons
    });
};


export default class AlertModal extends React.Component {
    componentDidMount() {
        component = this;
    }

    modalClick = (i, btnOptions) => {
        if (btnOptions.onPress)
            btnOptions.onPress();
        if (btnOptions.close) {
            modals.splice(i, 1);
            this.forceUpdate();
        }
    };

    render() {
        return (
            <Modal transparent={true} visible={!!modals.length}>
                {background()}
                {
                    modals.map((item, index) => {
                        return (
                            <AnimationView animation={modals.length == index + 1 ? 'zoomIn' : 'zoomOut'} duration={300}
                                           key={index} style={{
                                position: 'absolute',
                                height: '100%',
                                width: '100%',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <View
                                    style={{
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        width: '86%',
                                        borderRadius: 20,
                                        padding: 20
                                    }}>
                                    {item.title ? (<Text style={{
                                        color: '#afafb5',
                                        fontSize: 18,
                                    }}>{item.title}</Text>) : null}
                                    {typeof (item.slot) == 'function' ? item.slot() : item.slot}
                                </View>
                                <View style={{
                                    flexDirection: item.direction == "column" ? item.direction : 'row',
                                    width: item.direction == 'column' ? '100%' : 'auto',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    {
                                        item.buttons && item.buttons.map((button, ib) => {
                                            return button.backgroundColor ? (
                                                <GradientButton
                                                    key={ib}
                                                    textStyle={{fontSize: 23,}}
                                                    gradientBegin={button.backgroundColor}
                                                    gradientEnd={button.backgroundColor}
                                                    gradientDirection="diagonal"
                                                    radius={20}
                                                    text={button.text}
                                                    height={40}
                                                    width={item.direction == "column" ? '86%' : 80 / item.buttons.length + '%'}
                                                    style={{marginTop: 10}}
                                                    onPressAction={this.modalClick.bind(null, index, button)}
                                                />
                                            ) : (
                                                <GradientButton
                                                    key={ib}
                                                    textStyle={{fontSize: 23}}
                                                    gradientBegin="#ec232b"
                                                    gradientEnd="#f05e2c"
                                                    gradientDirection="diagonal"
                                                    radius={20}
                                                    text={button.text}
                                                    height={40}
                                                    width={item.direction == "column" ? '86%' : 80 / item.buttons.length + '%'}
                                                    style={{marginTop: 10}}
                                                    onPressAction={this.modalClick.bind(null, index, button)}
                                                />
                                            )
                                        })
                                    }
                                </View>
                            </AnimationView>
                        )
                    })
                }
            </Modal>
        )
    }

}