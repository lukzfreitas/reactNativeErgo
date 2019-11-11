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
    TouchableOpacity,
    StyleSheet,
    View,
    Alert,
    ToastAndroid,
    ActivityIndicator
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
    empresa: any;
    setor: string;
    mes: string;
    questions: any[];
    loading: boolean;
    questionsSelected: any;
    backHandler: any;
}

export class FormQuestion extends Component<Props, State> {


    constructor(props: Props) {
        super(props);
        this.state = {
            empresa: props.navigation.getParam('empresa'),
            setor: props.navigation.getParam('setor'),
            mes: props.navigation.getParam('mes'),
            questions: require('../assets/questions.json').data,
            loading: false,
            questionsSelected: new Map(),
            backHandler: null,
        };
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        let questions = this.state.questions.map((question: any) => {
            return { ...question, option: 0 };
        })
        let questionsSelected: any = this.state.questionsSelected;
        this.state.questions.map((question: any) => {
            questionsSelected.set(question.id, question);
        })
        this.setState({
            questions,
            questionsSelected,
            backHandler: BackHandler.addEventListener('hardwareBackPress', () => {
                if (this.state.questionsSelected.length > 0) {
                    Alert.alert(
                        'As questões respondidas não serão salvas',
                        'Você deseja realmente sair?',
                        [
                            { text: 'Cancelar', onPress: () => console.log('cancelar') },
                            { text: 'Sair', onPress: () => this.props.navigation.goBack() }
                        ]
                    );
                    return true;
                }
            })
        });
    }

    componentWillUnmount() {
        this.state.backHandler.remove();
    }

    public static navigationOptions = ({ navigation }: any) => {
        return {
            headerLeft: <HeaderBackButton onPress={() => {
                Alert.alert(
                    'As questões respondidas não serão salvas',
                    'Você deseja realmente sair?',
                    [
                        { text: 'Cancelar', onPress: () => console.log('cancelar') },
                        { text: 'Sair', onPress: () => navigation.goBack() }
                    ]
                );
            }} />
        }
    }

    onSelect = (item: any, option: number) => {
        let questionsSelected: any = this.state.questionsSelected;
        questionsSelected.set(item.id, { ...item, option })
        this.setState({ questionsSelected });
    }

    submit = () => {
        let questionsNotSelected: string[] = [];
        for (var question of this.state.questionsSelected.values()) {
            if (question.option === 0) {
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
                            this.setState({loading: false});
                            ToastAndroid.showWithGravity(
                                'Questionário Salvo com sucesso',
                                ToastAndroid.LONG,
                                ToastAndroid.TOP
                            )

                            let questions = this.state.questions.map((question: any) => {
                                return { ...question, option: 0, sliderColor: 'gray' }
                            })
                            this.setState({ questions, questionsSelected: new Map() });
                        }
                    }
                ]
            )
        }
    }

    private saveQuestions = async () => {
        this.setState({loading: true});
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
    }

    render() {
        const { empresa, setor, questions, loading } = this.state;
        return (
            <View style={style.screen}>
                <Text style={style.titleRazaoSocial}>
                    {empresa.razaoSocial} - {setor}
                </Text>
                <Text style={style.titleCnpj}>
                    {empresa.cnpj}
                </Text>
                <View style={style.contentList}>
                    <If condition={loading}>
                        <ActivityIndicator
                            style={{ height: 100 }}
                            color="#48bb94"
                            size="large"
                        />
                    </If>
                    <If condition={!loading}>
                        <SafeAreaView>
                            <FlatList
                                data={questions}
                                extraData={questions}
                                keyExtractor={(question: any) => question.id}
                                renderItem={({ item }) => (
                                    <Question
                                        item={item}
                                        onSelect={this.onSelect}
                                    />
                                )}
                            />
                        </SafeAreaView>
                    </If>
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