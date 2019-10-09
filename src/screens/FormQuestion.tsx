import React, { Component } from 'react';
import { View, Text, FlatList, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Question } from '../components';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface State {
    AllQuestions: any[];
    totalQuestions: any[];
    questions: any[];    
    loading: boolean
}

const perPage: number = 7;
const countQuestions: number = 35;

export class FormQuestion extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            AllQuestions: require('../assets/questions.json').data,
            totalQuestions: require('../assets/questions.json').data,
            questions: [],            
            loading: false
        };        
    }

    componentDidMount() {                
        this.loadQuestions();
    }

    loadQuestions = async () => {                
        console.log(this.state);
        if (this.state.loading || this.state.totalQuestions.length == 0) return;

        this.setState({loading: true});

        this.loadPartQuestions().then((resolve) => {
            this.setState({
                totalQuestions: resolve.totalQuestions,
                questions: resolve.questions,
                loading: false
            });       
        });
    }

    async loadPartQuestions()  {
        let totalQuestions = this.state.totalQuestions;
        let questions = this.state.questions;
        for (let i = 0; i < perPage; i++) {
            questions.push(totalQuestions[0]);
            totalQuestions.splice(0, 1);
          }
        return Promise.resolve({totalQuestions, questions});
    }

    renderFooter = () => {        
        if (!this.state.loading) return null;
        return (
            <View>
                <ActivityIndicator />
            </View>
        );
    };

    render() {
        const { questions} = this.state;
        return (
            <View>
                <FlatList
                    data={questions}
                    keyExtractor={question => question.description}
                    renderItem={({ item, index, separators }) => (
                        <Question keyItem={item.description} description={item.description} />
                    )}
                    onEndReached={this.loadQuestions}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={this.renderFooter}
                />
            </View>
        );
    }
}