import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native'
import { Icon } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngry, faFrownOpen, faMeh,  faSmile, faSmileBeam  } from '@fortawesome/free-regular-svg-icons'

interface Props {
    keyItem: string,
    description: string
}

interface State {

}

export class Question extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const { keyItem, description } = this.props;
        return (
            <View>
                <Text style={style.question} key={keyItem}>{description}</Text>
                <View style={style.answers}>
                    <FontAwesomeIcon style={style.smile} icon={faAngry} size={40} color='red' />
                    <FontAwesomeIcon style={style.smile} icon={faFrownOpen} size={40} color='orange' />
                    <FontAwesomeIcon style={style.smile} icon={faMeh} size={40} color='yellow' />
                    <FontAwesomeIcon style={style.smile} icon={faSmile} size={40} color='lightblue' />
                    <FontAwesomeIcon style={style.smile} icon={faSmileBeam} size={40} color='green' />
                </View>

            </View>
        )
    }
}

const style = StyleSheet.create({
    question: {                
        padding: 15,
        fontSize: 15,
        fontWeight: 'bold'
    },
    answers: {
        flexDirection: "row",        
    },
    smile: {        
        margin: 20
    }

})