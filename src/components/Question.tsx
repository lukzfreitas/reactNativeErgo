import React, { Component, PureComponent } from 'react';
import { StyleSheet, View, Text, Dimensions, DeviceEventEmitter } from 'react-native'
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
    item: any;
    sliderColor: string,
    eventEmitter: any
}

export class Question extends PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {  item: props.item, sliderColor: 'gray', eventEmitter: null }
    }

    getScreenInfo = () => {
        const dim = Dimensions.get('window');
        return dim;
    }

    changeQuestion = (option: number) => {
        switch (option) {
            case 1:
                this.setState(state => { return { ...state, item: { ...state.item, option: 1, selected: true}, sliderColor: 'red' }});
                break;
            case 2:
                this.setState(state => { return { ...state, item: { ...state.item, option: 2, selected: true}, sliderColor: 'orange' }});
                break;
            case 3:
                this.setState(state => { return { ...state, item: { ...state.item, option: 3, selected: true}, sliderColor: 'gold'}});
                break;
            case 4:
                this.setState(state => { return { ...state, item: { ...state.item, option: 4, selected: true}, sliderColor: 'lightblue'}});
                break;
            case 5:
                this.setState(state => { return { ...state, item: { ...state.item, option: 5, selected: true}, sliderColor: 'green'}});                
                break;
            default:
                    this.setState(state => { return { ...state, item: { ...state.item, option: 1, selected: false}, sliderColor: 'gray'}});                
                break;
        }        
    }    

    render() {
        const { onSelect } = this.props;
        const { sliderColor, item } = this.state;
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
                            onPress={() => {onSelect(item, 1); this.changeQuestion(1)}}                        
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
                            onPress={() => {onSelect(item, 2); this.changeQuestion(2)}}                        
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
                            onPress={() => {onSelect(item, 3); this.changeQuestion(3)}}                        
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
                            onPress={() => {onSelect(item, 4); this.changeQuestion(4)}}
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
                            onPress={() => {onSelect(item, 5); this.changeQuestion(5)}}
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
                    thumbTintColor={sliderColor}
                    step={1}
                    onValueChange={() => {onSelect(item, item.option); this.changeQuestion(item.option)}}
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