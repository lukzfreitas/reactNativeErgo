import React, { Component } from 'react';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { HeaderBackButton } from 'react-navigation-stack'
import { Question } from '../components';
import { RealmService } from '../services';
import {
    BackHandler,
    SafeAreaView,
    Text,
    FlatList,
    DeviceEventEmitter,
    TouchableOpacity,
    StyleSheet,
    View,
    Alert,
    ToastAndroid
} from 'react-native';


interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface State {
    empresa: any;
    setor: string;
    mes: string;
    questions: any[];
    questionsId: number[];
    questionsIdSelected: number[];
    eventEmitter: any;
    backHandler: any;
}

var questions: any[] = require('../assets/questions.json').data;

export class FormQuestion extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        const dateQuestion: Date = props.navigation.getParam('mes').date;
        this.state = {
            empresa: props.navigation.getParam('empresa'),
            setor: props.navigation.getParam('setor'),
            mes: dateQuestion.getMonth() + 1 + '/' + dateQuestion.getFullYear(),
            questions: [],
            questionsId: [],
            questionsIdSelected: [],
            eventEmitter: null,
            backHandler: null
        };
    }

    componentDidMount() {
        let questionsId = questions.map((question: any) => {
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
                        { text: 'Cancelar', onPress: () => console.log('sair') },
                        { text: 'Sair', onPress: () => navigation.goBack() }
                    ]
                );
            }} />
        }
    }

    private questionSelected = (question: any) => {
        let index = this.state.questionsIdSelected.indexOf(question.id);
        if (index > -1) {
            this.state.questions.splice(index, 1);
            this.state.questionsIdSelected.splice(index, 1);
        };
        this.state.questionsIdSelected.push(question.id);
        this.state.questions.push(question);
    }

    private saveQuestions = async () => {
        let questionsSchema = this.state.questions.reduce((object: any, question: any) => {
            object['q' + question.id] = question.option
            return object;
        }, {});

        questionsSchema.cnpj = this.state.empresa.cnpj;
        questionsSchema.setor = this.state.setor;
        questionsSchema.mes = this.state.mes;
        const realm = await RealmService.getRealm();
        realm.write(() => {
            realm.create('QuestionarioSchema', questionsSchema);
        });
        let questions = realm.objects('QuestionarioSchema').filtered("cnpj = " + `'${this.state.empresa.cnpj}'`);
        console.log(questions)
    }

    submit = () => {
        let questionsNotSelected = this.state.questionsId.filter((i) => {
            return this.state.questionsIdSelected.indexOf(i) < 0;
        }).map((i) => {
            return "Questão " + i;
        });
        if (questionsNotSelected.length > 0) {
            Alert.alert(
                'As questões abaixo não foram preenchidas',
                questionsNotSelected.slice(0, 10).join("\n")
            )
        } else {
            Alert.alert(
                'Salvar Questionário',
                'Salvar e ir para próximo questionário?',
                [
                    { text: 'Não', onPress: () => console.log('cancelado') },
                    {
                        text: 'Sim', onPress: async () => {
                            await this.saveQuestions();
                            ToastAndroid.showWithGravity(
                                'Questionário Salvo com sucesso',
                                ToastAndroid.LONG,
                                ToastAndroid.TOP
                            )
                            this.render();
                        }
                    }
                ]
            )
        }
    }

    render() {
        const { empresa, setor } = this.state;
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
                    <TouchableOpacity style={style.button} onPress={this.submit} >
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