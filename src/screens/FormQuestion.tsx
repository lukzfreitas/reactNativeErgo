import React, { Component } from 'react';
import { SafeAreaView, Text, FlatList, DeviceEventEmitter, TouchableOpacity, StyleSheet, View, Alert } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { HeaderBackButton } from 'react-navigation-stack'
import { Question } from '../components';


interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface State {
    questionsId: number[];
    questionsIdSelected: number[];
    count: number;
    eventEmitter: any;
}

const questions: any[] = require('../assets/questions.json').data;

export class FormQuestion extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            questionsId: [],
            questionsIdSelected: [],
            count: 0,
            eventEmitter: null
        };
    }   

    componentDidMount() {
        let questionsId = questions.map((question: any) => {
            return question.id;
        })
        this.setState({ eventEmitter: DeviceEventEmitter.addListener('eventKey', this.questionSelected), questionsId: questionsId });
    }    

    componentWillUnmount() {        
        this.state.eventEmitter.remove();
    }


    public static navigationOptions = ({navigation}) => {
        return {            
            headerLeft: (
                <HeaderBackButton onPress={() => console.log('teste')}/> 
              ),
        }
    }

    warning = () => {
        if (this.state.questionsIdSelected.length == 0) {
            this.props.navigation.goBack();
        } else {
            Alert.alert(
                'Atenção',
                'As questões respondidas não serão salvas ao sair, você realmente deseja sair?',
                [
                    { text: 'Sair', onPress: () => this.state.eventEmitter.remove() },
                    { text: 'Cancelar', onPress: () => console.log('cancelado') }
                ]
            );
        }
    }

    questionSelected = (question: any) => {
        if (this.state.questionsIdSelected.indexOf(question.id) > -1) return;
        this.state.questionsIdSelected.push(question.id);
    }

    saveQuestions = () => {
        let questionsNotSelected = this.state.questionsId.filter((i) => {
            return this.state.questionsIdSelected.indexOf(i) < 0;
        }).map((i) => {
            return "Questão " + i;
        });

        Alert.alert(
            'Questões abaixo não foram respondidas',
            questionsNotSelected.slice(0, 10).join("\n")
        )
    }


    render() {
        return (
            <View style={style.screen}>
                <View style={style.contentList}>
                    <SafeAreaView>
                        <FlatList
                            data={questions}
                            keyExtractor={(question: any) => question.description}
                            renderItem={({ item, index, separators }) => (
                                <Question item={item} />
                            )}
                        />
                    </SafeAreaView>
                </View>
                <View style={style.footer}>
                    <TouchableOpacity style={style.button} onPress={this.saveQuestions} >
                        <Text style={style.textButton}>Salvar Questionário</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create({
    screen: {
        flex: 10,
        flexDirection: 'column'
    },
    contentList: {
        flex: 9
    },
    footer: {
        backgroundColor: 'transparent',
        shadowOpacity: 0.8,
        borderColor: 'black',
        elevation: 50
    },
    button: {
        shadowOpacity: 0.9,
        alignSelf: 'center',
        margin: 15
    },
    textButton: {
        alignSelf: 'center',
        fontSize: 20,
        textAlign: 'center',
        color: 'green',
        fontWeight: 'bold'
    }
})