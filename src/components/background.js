import Svg, {Defs, RadialGradient, Rect, Stop} from 'react-native-svg';
import React from 'react'
import {Dimensions} from 'react-native'

export default background = () => {
    return (
        <Svg height="100%" width="100%" style={{position: 'absolute', zIndex: 0}}>
            <Defs>
                <RadialGradient
                    id="grad"
                    cx="50%"
                    cy="50%"
                    r={Dimensions.get('window').height / 2}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset="0" stopColor="#353a7d" stopOpacity="1"/>
                    <Stop offset="1" stopColor="#12131b" stopOpacity="1"/>
                </RadialGradient>
            </Defs>
            <Rect x="0"
                  y="0"
                  width="100%"
                  height="100%" fill="url(#grad)"/>
        </Svg>
    );
}