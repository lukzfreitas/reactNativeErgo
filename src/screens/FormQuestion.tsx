import React, { Component } from 'react';
import { View, Text, FlatList, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Question } from '../components';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface State {
    questions: any[];
    count: number;
    eventEmitter: any;
}

export class FormQuestion extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            questions: require('../assets/questions.json').data,
            count: 0,
            eventEmitter: null
        };
    }

    componentDidMount() {
        console.log('ok')
        this.setState({ eventEmitter: DeviceEventEmitter.addListener('eventKey', this.questionSelected) });
    }

    componentWillUnmount() {
        this.state.eventEmitter.remove();
    }

    questionSelected = (question: any) => {
        console.log(question);
    }


    render() {
        const { questions } = this.state;
        return (
            <View>
                <FlatList
                    data={questions}
                    keyExtractor={question => question.description}
                    renderItem={({ item, index, separators }) => (
                        <Question item={item} />
                    )}
                />
            </View>
        );
    }
}