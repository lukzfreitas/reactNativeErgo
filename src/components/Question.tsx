import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, DeviceEventEmitter } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngry, faFrownOpen, faMeh, faSmile, faSmileBeam } from '@fortawesome/free-regular-svg-icons'
import Slider from '@react-native-community/slider';
import { If } from '../commons/If';


interface Props {
    item: any;
}

interface State {
    item: any,
    sliderColor: string,
    
}

export class Question extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { item: this.props.item, sliderColor: 'gray' }        
    }

    isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    };        


    changeQuestion = async (option: number) => {
        switch (option) {
            case 1:
                this.setState(state => { return { ...state, item: { ...state.item, option: 1, selected: true}, sliderColor: 'red' }});
                break;
            case 2:
                this.setState(state => { return { ...state, item: { ...state.item, option: 2, selected: true}, sliderColor: 'orange' }});
                break;
            case 3:
                this.setState(state => { return { ...state, item: { ...state.item, option: 3, selected: true}, sliderColor: 'yellow'}});
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
        return Promise.resolve();
    }

    changeSlider(option: number) {        
        this.changeQuestion(option).then(() => {            
            DeviceEventEmitter.emit('eventKey', this.state.item);
        })
        
    }


    render() {        
        const { item, sliderColor } = this.state;
        return (
            <View>
                <Text style={style.question} key={item.id}>{item.description}</Text>
                <View style={style.answers}>
                    <View style={this.isPortrait() ? style.smilePortrait : style.smileLandscape}>
                        <FontAwesomeIcon
                            style={this.isPortrait() ? style.smilePortrait : style.smileLandscape}
                            icon={faAngry}
                            size={40}
                            color='red'
                            onPress={() => this.changeSlider(1)}
                        />
                        <If condition={!this.isPortrait()}>
                            <Text style={style.textSmile}>Discordo{"\n"}Totalmente</Text>
                        </If>
                    </View>

                    <View style={this.isPortrait() ? style.smilePortrait : style.smileLandscape}>
                        <FontAwesomeIcon
                            style={this.isPortrait() ? style.smilePortrait : style.smileLandscape}
                            icon={faFrownOpen}
                            size={40}
                            color='orange'
                            onPress={() => this.changeSlider(2)}
                        />
                        <If condition={!this.isPortrait()}>
                            <Text style={style.textSmile}>Discordo{"\n"}Parcialmente</Text>
                        </If>
                    </View>

                    <View style={this.isPortrait() ? style.smilePortrait : style.smileLandscape}>
                        <FontAwesomeIcon
                            style={this.isPortrait() ? style.smilePortrait : style.smileLandscape}
                            icon={faMeh}
                            size={40}
                            color='yellow'
                            onPress={() => this.changeSlider(3)}
                        />
                        <If condition={!this.isPortrait()}>
                            <Text style={style.textSmile}>Indiferente</Text>
                        </If>
                    </View>

                    <View style={this.isPortrait() ? style.smilePortrait : style.smileLandscape}>
                        <FontAwesomeIcon
                            style={this.isPortrait() ? style.smilePortrait : style.smileLandscape}
                            icon={faSmile}
                            size={40}
                            color='lightblue'
                            onPress={() => this.changeSlider(4)}
                        />
                        <If condition={!this.isPortrait()}>
                            <Text style={style.textSmile}>Condordo{"\n"}Parcialmente</Text>
                        </If>
                    </View>

                    <View style={this.isPortrait() ? style.smilePortrait : style.smileLandscape}>
                        <FontAwesomeIcon
                            style={this.isPortrait() ? style.smilePortrait : style.smileLandscape}
                            icon={faSmileBeam}
                            size={40}
                            color='green'
                            onPress={() => this.changeSlider(5)}
                        />
                        <If condition={!this.isPortrait()}>
                            <Text style={style.textSmile}>Condordo{"\n"}Totalmente</Text>
                        </If>
                    </View>
                </View>
                <Slider
                    style={this.isPortrait() ? style.sliderPortrait : style.sliderLandscape}
                    value={item.option}
                    minimumValue={1}
                    maximumValue={5}
                    thumbTintColor={sliderColor}
                    step={1}
                    onValueChange={(option: number) => this.changeSlider(option)}
                />
            </View>
        )
    }
}

const style = StyleSheet.create({
    question: {
        padding: 15,
        fontSize: 15,
        fontWeight: 'bold',
    },
    answers: {
        flexDirection: "row",
        alignSelf: 'center'
    },
    smilePortrait: {
        marginHorizontal: 8,
        alignSelf: 'center',
        fontSize: 1
    },
    smileLandscape: {
        marginHorizontal: 20,
        marginVertical: 10,
        alignSelf: 'center'
    },
    sliderPortrait: {
        marginHorizontal: 20,
        marginVertical: 20
    },
    sliderLandscape: {
        marginHorizontal: 60,
        paddingTop: 30
    },
    textSmile: {
        textAlign: 'center'
    }
})