import React, { Component } from 'react';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { QuestionScaleLikert, QuestionDefault } from '../components';
import { RealmService, AsyncStorageService } from '../services';
import {
    SafeAreaView,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    View,
    Alert,
    ToastAndroid,
    ActivityIndicator,
    Switch,
    DeviceEventEmitter
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { If } from '../commons';


interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface State {
    cnpj: string;
    razaoSocial: string,
    setor: string;
    mes: string;
    questionsData: any[];
    questions: any;
    questionsDefault: boolean;
    loading: boolean;
    textLoading: string;
}

export class FormQuestion extends Component<Props, State> {

    eventEmitter: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            cnpj: '',
            razaoSocial: '',
            setor: '',
            mes: '',
            questionsData: require('../assets/questions.json').data,
            questions: new Map(),
            questionsDefault: true,
            loading: false,
            textLoading: ''
        };
        this.submit = this.submit.bind(this);
    }

    componentDidMount = async () => {
        let questionsData = this.state.questionsData.map((question: any) => {
            return { ...question, option: '0' };
        })
        let questions: any = this.state.questions;
        this.state.questionsData.map((question: any) => {
            questions.set(question.id, question);
        })
        let empresa = await AsyncStorageService.getItem('empresa');
        this.setState({
            cnpj: empresa.cnpj,
            razaoSocial: empresa.razaoSocial,
            setor: empresa.setor,
            questionsData,
            questions
        });
        this.eventEmitter = DeviceEventEmitter.addListener('eventKey', this.setFormQuestions);
    }

    setFormQuestions = (empresa: any) => {
        if (this.state.cnpj == '') {
            return;
        }
        let questionsData = this.state.questionsData.map((question: any) => {
            return { ...question, option: '0', sliderColor: 'gray' };
        })
        let questions: any = this.state.questions;
        this.state.questionsData.map((question: any) => {
            questions.set(question.id, question);
        })
        this.setState({
            cnpj: empresa.cnpj,
            razaoSocial: empresa.razaoSocial,
            setor: empresa.setor,
            questionsData,
            questions,
            questionsDefault: true,
        })
    }

    componentWillUnmount() {
        this.eventEmitter.remove();
    }

    onSelect = (item: any, option: string) => {
        let questions: any = this.state.questions;
        questions.set(item.id, { ...item, option })
        this.setState({ questions });
    }

    submit = () => {
        let questionsNotSelected: string[] = [];
        for (var question of this.state.questions.values()) {
            if (question.option === '0') {
                questionsNotSelected.push("Questão " + question.id);
            }
        }
        if (questionsNotSelected.length > 0) {
            Alert.alert(
                'As questões abaixo não foram preenchidas',
                questionsNotSelected.slice(0, 10).join("\n")
            );
        } else {
            Alert.alert(
                'Salvar Questionário',
                'Salvar e ir para próximo questionário?',
                [
                    { text: 'Não', onPress: () => console.log('cancelado') },
                    {
                        text: 'Sim', onPress: async () => {
                            await this.saveQuestions();
                        }
                    }
                ]
            )
        }
    }

    private saveQuestions = async () => {
        this.setState({ loading: true, textLoading: 'Salvando Questionário...' });
        let questionsSchema = this.state.questionsData.reduce((object: any, question: any) => {
            let nameQuestion = question.id < 10 ? '0' + question.id : question.id;
            object['q' + nameQuestion] = parseInt(question.option);
            return object;
        }, {});        
        questionsSchema.setor = {
            nome: this.state.setor,
            empresa: {
                id: 0, // TODO:  implementar
                idRegional: 0, // TODO: implementar
                cnpj: this.state.cnpj,
                razaoSocial: this.state.razaoSocial
            }
        };
        questionsSchema.dataQuestionario = this.state.mes;

        const realm = await RealmService.getRealm();
        try {
            realm.write(() => {
                realm.create('QuestionarioSchema', questionsSchema);
            });
            let questions = new Map();
            let questionsData = this.state.questionsData.map((question: any) => {
                questions.set(question.id, { ...question, option: '0', sliderColor: 'gray' });
                return { ...question, option: '0', sliderColor: 'gray' }
            })
            this.setState({ questionsData, questions });
            setTimeout(() => {
                this.setState({ loading: false, textLoading: '' });
                ToastAndroid.showWithGravity(
                    'Questionário salvo com sucesso',
                    ToastAndroid.LONG,
                    ToastAndroid.TOP
                );
            }, 1000);
        } catch (exception) {
            setTimeout(() => {
                this.setState({ loading: false, textLoading: '' });
                ToastAndroid.showWithGravity(
                    'Ocorreu um erro ao tentar salvar o questionário',
                    ToastAndroid.LONG,
                    ToastAndroid.TOP
                );
            }, 1000);
        }

    }

    changeQuestionDefault() {
        this.setState({
            questionsDefault: !this.state.questionsDefault,
            loading: true,
            textLoading: 'Carregando Questões...'
        });
        setTimeout(() => {
            this.setState({ loading: false, textLoading: '' });
        }, 1000);
    }

    render() {
        const { cnpj, razaoSocial, setor, questionsData, loading, textLoading, questionsDefault } = this.state;
        return (
            <View style={style.screen}>
                <View style={style.header}>
                    <Text style={style.titleRazaoSocial}>
                        {razaoSocial} - {setor}
                    </Text>
                    <Text style={style.titleCnpj}>
                        {cnpj}
                    </Text>
                    <View style={style.switch}>
                        <Text style={style.textQuestionDefault}> Questionário Padrão </Text>
                        <Switch
                            onValueChange={() => this.changeQuestionDefault()}
                            value={!questionsDefault}
                        />
                        <Text style={style.textQuestionLikert}> Questionário Escala Likert </Text>
                    </View>
                </View>
                <View style={style.contentList}>
                    <If condition={loading}>
                        <ActivityIndicator
                            style={{ height: 100 }}
                            color="#48bb94"
                            size="large"
                        />
                        <Text style={style.textLoading}> {textLoading} </Text>
                    </If>
                    <If condition={!loading}>
                        <If condition={questionsDefault}>
                            <SafeAreaView>
                                <FlatList
                                    data={questionsData}
                                    extraData={questionsData}
                                    keyExtractor={(question: any) => question.id}
                                    renderItem={({ item }) => (
                                        <QuestionDefault
                                            item={item}
                                            onSelect={this.onSelect}
                                        />
                                    )}
                                />
                            </SafeAreaView>
                        </If>
                        <If condition={!questionsDefault}>
                            <If condition={!loading}>
                                <SafeAreaView>
                                    <FlatList
                                        data={questionsData}
                                        extraData={questionsData}
                                        keyExtractor={(question: any) => question.id}
                                        renderItem={({ item }) => (
                                            <QuestionScaleLikert
                                                item={item}
                                                onSelect={this.onSelect}
                                            />
                                        )}
                                    />
                                </SafeAreaView>
                            </If>
                        </If>

                    </If>
                </View>
                <If condition={!loading}>
                    <View style={style.footer}>
                        <TouchableOpacity style={style.button} onPress={this.submit} disabled={loading} >
                            <Text style={style.textButton}>Salvar Questionário</Text>
                        </TouchableOpacity>
                    </View>
                </If>
            </View>
        );
    }
}

const style = StyleSheet.create({
    screen: {
        flex: 10,
        flexDirection: 'column'
    },
    header: {
        flex: 1.5,
        alignItems: 'center',
    },
    switch: {
        flex: 3,
        flexDirection: 'row'
    },
    textQuestionDefault: {
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        margin: wp('2%'),
        fontSize: hp('2.2%'),
        color: 'gray',
        fontWeight: 'bold'
    },
    textQuestionLikert: {
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        margin: wp('2%'),
        fontSize: hp('2.2%'),
        color: 'green',
        fontWeight: 'bold'
    },
    textLoading: {
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        margin: 10,
        fontSize: hp('3.5%'),
        color: 'green',
        fontWeight: 'bold'
    },
    titleRazaoSocial: {
        alignSelf: 'center',
        fontSize: hp('3%'),
        fontWeight: 'bold'
    },
    titleCnpj: {
        alignSelf: 'center',        
        fontWeight: 'bold',
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
        flexDirection: 'row'
    },
    button: {
        flex: 1,
        backgroundColor: '#488aff',
        borderRadius: 10,
        alignSelf: 'center',
        width: wp('100%'),
        height: hp('6%'),
        marginHorizontal: wp('2%'),
        marginVertical: hp('1%'),
    },
    textButton: {
        flex: 1,
        alignSelf: 'center',
        fontSize: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontWeight: 'bold'
    }
})