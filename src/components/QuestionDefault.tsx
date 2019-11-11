import React, { PureComponent } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
} from 'react-native-responsive-screen';

interface Props {
    item: any;
    onSelect: any;
}

interface State {
    sliderColor: string;
    item: any;
}

export class QuestionDefault extends PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const { item } = this.props;
        return (
            <View>
                <Text style={style.question} key={item.id}> {item.description} </Text>
                <RadioButton.Group
                    onValueChange={(option) => this.setState(state => { return { ...state, item: { ...state.item, option: parseInt(option) } } })}
                    value={item.option}
                >
                    <View>
                        <RadioButton value="1" />
                        <Text onPress={() => { this.setState(state => { return { ...state, item: { ...state.item, option: 1 } } }) }}>
                            Discordo Totalmente
                        </Text>
                    </View>
                    <View>
                        <RadioButton value="2" />
                        <Text onPress={() => { this.setState(state => { return { ...state, item: { ...state.item, option: 2 } } }) }}>
                            Discordo Parcialmente
                        </Text>
                    </View>
                    <View>
                        <RadioButton value="3" />
                        <Text onPress={() => { this.setState(state => { return { ...state, item: { ...state.item, option: 3 } } }) }}>
                            Indiferente
                        </Text>
                    </View>
                    <View>
                        <RadioButton value="4" />
                        <Text onPress={() => { this.setState(state => { return { ...state, item: { ...state.item, option: 4 } } }) }}>
                            Concordo Parcialmente
                        </Text>
                    </View>
                    <View>
                        <RadioButton value="4" />
                        <Text onPress={() => { this.setState(state => { return { ...state, item: { ...state.item, option: 4 } } }) }}>
                            Concordo Totalmente
                        </Text>
                    </View>
                </RadioButton.Group>
            </View>
        )
    }
}

const style = StyleSheet.create({
    question: {
        padding: wp('4%'),
        fontSize: 15,
        fontWeight: 'bold',
    },
})


