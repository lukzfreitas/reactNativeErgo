import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngry, faFrownOpen, faMeh, faSmile, faSmileBeam } from '@fortawesome/free-regular-svg-icons'
import Slider from '@react-native-community/slider';
import { If } from '../commons/If';
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

export class QuestionScaleLikert extends PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { item: props.item, sliderColor: 'gray' }
    }

    getScreenInfo = () => {
        const dim = Dimensions.get('window');
        return dim;
    }

    changeQuestion = (option: number) => {        
        switch (option) {
            case 1:
                this.setState(state => { return { ...state, item: { ...state.item, option: 1 }, sliderColor: 'red' } });
                this.props.item.option = 1;
                this.props.item.sliderColor = 'red';
                break;
            case 2:
                this.setState(state => { return { ...state, item: { ...state.item, option: 2 }, sliderColor: 'orange' } });
                this.props.item.option = 2;
                this.props.item.sliderColor = 'orange';
                break;
            case 3:
                this.setState(state => { return { ...state, item: { ...state.item, option: 3 }, sliderColor: 'gold' } });
                this.props.item.option = 3;
                this.props.item.sliderColor = 'gold';
                break;
            case 4:
                this.setState(state => { return { ...state, item: { ...state.item, option: 4 }, sliderColor: 'lightblue' } });
                this.props.item.option = 4;
                this.props.item.sliderColor = 'lightblue';
                break;
            case 5:
                this.setState(state => { return { ...state, item: { ...state.item, option: 5 }, sliderColor: 'green' } });
                this.props.item.option = 5;
                this.props.item.sliderColor = 'green';
                break;
            default:
                this.setState(state => { return { ...state, item: { ...state.item, option: 1 }, sliderColor: 'gray' } });
                this.props.item.option = 1;
                this.props.item.sliderColor = 'gray';
                break;
        }
    }

    render() {
        const { onSelect, item } = this.props;        
        return (
            <View>
                <Text style={style.question} key={item.id}>{item.description}</Text>
                <View style={style.answers}>
                    <View style={this.getScreenInfo().width > 360 ? style.smileLandscape : style.smilePortrait}>
                        <FontAwesomeIcon
                            style={this.getScreenInfo().width > 360 ? style.smileLandscape : style.smilePortrait}
                            icon={faAngry}
                            size={40}
                            color='red'
                            onPress={() => { onSelect(item, 1); this.changeQuestion(1) }}
                        />
                        <If condition={this.getScreenInfo().width > 360}>
                            <Text style={style.textSmile}>Discordo{"\n"}Totalmente</Text>
                        </If>
                    </View>

                    <View style={this.getScreenInfo().width > 360 ? style.smileLandscape : style.smilePortrait}>
                        <FontAwesomeIcon
                            style={this.getScreenInfo().width > 360 ? style.smileLandscape : style.smilePortrait}
                            icon={faFrownOpen}
                            size={40}
                            color='orange'
                            onPress={() => { onSelect(item, 2); this.changeQuestion(2) }}
                        />
                        <If condition={this.getScreenInfo().width > 360}>
                            <Text style={style.textSmile}>Discordo{"\n"}Parcialmente</Text>
                        </If>
                    </View>

                    <View style={this.getScreenInfo().width > 360 ? style.smileLandscape : style.smilePortrait}>
                        <FontAwesomeIcon
                            style={this.getScreenInfo().width > 360 ? style.smileLandscape : style.smilePortrait}
                            icon={faMeh}
                            size={40}
                            color='gold'
                            onPress={() => { onSelect(item, 3); this.changeQuestion(3) }}
                        />
                        <If condition={this.getScreenInfo().width > 360}>
                            <Text style={style.textSmile}>Indiferente{"\n"}</Text>
                        </If>
                    </View>

                    <View style={this.getScreenInfo().width > 360 ? style.smileLandscape : style.smilePortrait}>
                        <FontAwesomeIcon
                            style={this.getScreenInfo().width > 360 ? style.smileLandscape : style.smilePortrait}
                            icon={faSmile}
                            size={40}
                            color='lightblue'
                            onPress={() => { onSelect(item, 4); this.changeQuestion(4) }}
                        />
                        <If condition={this.getScreenInfo().width > 360}>
                            <Text style={style.textSmile}>Condordo{"\n"}Parcialmente</Text>
                        </If>
                    </View>

                    <View style={this.getScreenInfo().width > 360 ? style.smileLandscape : style.smilePortrait}>
                        <FontAwesomeIcon
                            style={this.getScreenInfo().width > 360 ? style.smileLandscape : style.smilePortrait}
                            icon={faSmileBeam}
                            size={40}
                            color='green'
                            onPress={() => { onSelect(item, 5); this.changeQuestion(5) }}
                        />
                        <If condition={this.getScreenInfo().width > 360}>
                            <Text style={style.textSmile}>Condordo{"\n"}Totalmente</Text>
                        </If>
                    </View>
                </View>
                <Slider
                    style={this.getScreenInfo().width > 360 ? style.sliderLandscape : style.sliderPortrait}
                    value={item.option}
                    minimumValue={1}
                    maximumValue={5}
                    thumbTintColor={item.sliderColor}
                    step={1}
                    onValueChange={(option: number) => { onSelect(item, option); this.changeQuestion(option) }}
                />
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
    answers: {
        flexDirection: "row",
        alignSelf: 'center'
    },
    smilePortrait: {
        marginHorizontal: wp('5%'),
        alignSelf: 'center',
        fontSize: 1
    },
    smileLandscape: {
        marginHorizontal: wp('3.6%'),
        marginVertical: 10,
        alignSelf: 'center'
    },
    sliderPortrait: {
        marginHorizontal: wp('6%'),
        marginVertical: wp('3%')
    },
    sliderLandscape: {
        marginHorizontal: wp('10%'),
        paddingTop: hp('1%')
    },
    textSmile: {
        textAlign: 'center'
    }
})