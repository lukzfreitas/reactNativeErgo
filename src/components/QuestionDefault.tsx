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
    item: any;
}

export class QuestionDefault extends PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { item: props.item }
    }

    changeQuestion(option: string) {
        switch (option) {
            case "1":
                this.setState(state => { return { ...state, item: { ...state.item, option: '1', sliderColor: 'red' } } });
                this.props.item.option = '1';
                this.props.item.sliderColor = 'red';
                break;
            case "2":
                this.setState(state => { return { ...state, item: { ...state.item, option: '2', sliderColor: 'orange' } } });
                this.props.item.option = '2';
                this.props.item.sliderColor = 'orange';
                break;
            case "3":
                this.setState(state => { return { ...state, item: { ...state.item, option: '3', sliderColor: 'gold' } } });
                this.props.item.option = '3';
                this.props.item.sliderColor = 'gold';
                break;
            case "4":
                this.setState(state => { return { ...state, item: { ...state.item, option: '4', sliderColor: 'lightblue' } } });
                this.props.item.option = '4';
                this.props.item.sliderColor = 'lightblue';
                break;
            case "5":
                this.setState(state => { return { ...state, item: { ...state.item, option: '5', sliderColor: 'green' } } });
                this.props.item.option = '5';
                this.props.item.sliderColor = 'green';
                break;
            default:
                this.setState(state => { return { ...state, item: { ...state.item, option: '0', sliderColor: 'gray' } } });
                this.props.item.option = '0';
                this.props.item.sliderColor = 'gray';
                break;
        }        
    }

    render() {
        const { item, onSelect } = this.props;
        return (
            <View>
                <Text style={style.question} key={item.id}> {item.description} </Text>
                <RadioButton.Group
                    onValueChange={(option) => { onSelect(item, option), this.changeQuestion(option) }}
                    value={item.option}
                >
                    <View style={style.answer}>
                        <RadioButton value='1' />
                        <Text style={style.textAswer} onPress={() => { onSelect(item, '1'), this.changeQuestion('1') }}>
                            Discordo Totalmente
                        </Text>
                    </View>
                    <View style={style.answer}>
                        <RadioButton value='2' />
                        <Text style={style.textAswer} onPress={() => { onSelect(item, '2'), this.changeQuestion('2') }}>
                            Discordo Parcialmente
                        </Text>
                    </View>
                    <View style={style.answer}>
                        <RadioButton value='3' />
                        <Text style={style.textAswer} onPress={() => { onSelect(item, '3'), this.changeQuestion('3') }}>
                            Indiferente
                        </Text>
                    </View>
                    <View style={style.answer}>
                        <RadioButton value='4' />
                        <Text style={style.textAswer} onPress={() => { onSelect(item, '4'), this.changeQuestion('4') }}>
                            Concordo Parcialmente
                        </Text>
                    </View>
                    <View style={style.answer}>
                        <RadioButton value='5' />
                        <Text style={style.textAswer} onPress={() => { onSelect(item, '5'), this.changeQuestion('5') }}>
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
        fontSize: 20,
        fontWeight: 'bold'        
    },
    answer: {        
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: wp('5%'),        
        marginVertical: 7
    },
    textAswer: {
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        fontSize: 18
    }
})


