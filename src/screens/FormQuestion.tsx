import React, { Component } from 'react';
import { BackHandler, SafeAreaView, Text, FlatList, DeviceEventEmitter, TouchableOpacity, StyleSheet, View, Alert } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { HeaderBackButton } from 'react-navigation-stack'
import { Question } from '../components';
import { RealmService } from '../services';


interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface State {
    id: number;
    empresa: any;
    setor: string;
    mes: string;
    questions: any[];
    questionsId: number[];
    questionsIdSelected: number[];
    count: number;
    eventEmitter: any;
    backHandler: any;
}

// const questions: any[] = require('../assets/questions.json').data;

export class FormQuestion extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            id: 0,
            empresa: props.navigation.getParam('empresa'),
            setor: props.navigation.getParam('setor'),
            mes: props.navigation.getParam('mes'),
            questions: require('../assets/questions.json').data,
            questionsId: [],
            questionsIdSelected: [],
            count: 0,
            eventEmitter: null,
            backHandler: null
        };
    }

    componentDidMount() {
        let questionsId = this.state.questions.map((question: any) => {
            return question.id;
        })
        this.setState({
            eventEmitter: DeviceEventEmitter.addListener('eventKey', this.questionSelected), questionsId: questionsId,
            backHandler: BackHandler.addEventListener('hardwareBackPress', () => {
                if (this.state.questionsIdSelected.length > 0) {
                    Alert.alert(
                        'As questões respondidas não serão salvas',
                        'Você deseja realmente sair?',
                        [
                            { text: 'Sair', onPress: () => this.props.navigation.goBack() },
                            { text: 'Cancelar', onPress: () => console.log('sair') }
                        ]
                    );
                    return true;
                }
            })
        });
    }

    componentWillUnmount() {
        this.state.eventEmitter.remove();
        this.state.backHandler.remove();
    }

    public static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton onPress={() => {
                Alert.alert(
                    'As questões respondidas não serão salvas',
                    'Você deseja realmente sair?',
                    [
                        { text: 'Sair', onPress: () => navigation.goBack() },
                        { text: 'Cancelar', onPress: () => console.log('sair') }
                    ]
                );
            }} />
        }
    }

    questionSelected = (question: any) => {
        if (this.state.questionsIdSelected.indexOf(question.id) > -1) return;
        this.state.questionsIdSelected.push(question.id);
        // this.state.questions.push(question);
    }

    saveQuestions = async () => {
        let questionsNotSelected = this.state.questionsId.filter((i) => {
            return this.state.questionsIdSelected.indexOf(i) < 0;
        }).map((i) => {
            return "Questão " + i;
        });

        if (questionsNotSelected.length > 0) {
            Alert.alert(
                'Questões abaixo não foram respondidas',
                questionsNotSelected.slice(0, 10).join("\n")
            )
        } else {
            console.log('questions ', this.state.questions);
            // let questionsSchema = this.state.questions.reduce((object: any, question: any) => {
            //     object['q' + question.id] = '' + question.option
            //     return object;
            // });            
            // questionsSchema.cnpj = this.state.empresa.cnpj;
            // questionsSchema.setor = this.state.setor;
            // questionsSchema.mes = this.state.mes;
            // const realm = await RealmService.getRealm();
            // realm.write(() => {                
            //     console.log('questions schema', questionsSchema);
            //     realm.create('QuestionarioSchema', questionsSchema);                
            // });
            // let question = realm.objects('QuestionarioSchema').filtered("cnpj = " + `'${this.state.empresa.cnpj}'`);
            // console.log(question);
        }
    }

    render() {
        const { empresa, setor, questions } = this.state;
        return (
            <View style={style.screen}>
                <Text style={style.titleRazaoSocial}>
                    {empresa.razaoSocial}
                </Text>
                <Text style={style.titleCnpj}>
                    {empresa.cnpj}
                </Text>
                <Text style={style.titleSetor}>
                    {setor}
                </Text>
                <View style={style.contentList}>
                    <SafeAreaView>
                        <FlatList
                            data={questions}
                            keyExtractor={(question: any) => question.id}
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
    titleRazaoSocial: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    titleCnpj: {
        alignSelf: 'center',
        fontSize: 15,
        fontWeight: 'bold'
    },
    titleSetor: {
        alignSelf: 'center',
        fontSize: 10,
        fontWeight: 'bold'
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