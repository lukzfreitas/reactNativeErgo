import React, { Component, PureComponent } from 'react';
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
    ToastAndroid
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
} from 'react-native-responsive-screen';


interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface State {
    empresa: any;
    setor: string;
    mes: string;
    questions: any[];
    // questionsId: number[];
    // questionsInit: any[];
    // questionsIdSelected: number[];    
    backHandler: any;    
}

export class FormQuestion extends PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            empresa: props.navigation.getParam('empresa'),
            setor: props.navigation.getParam('setor'),
            mes: props.navigation.getParam('mes'),
            // questionsInit: require('../assets/questions.json').data,
            questions: require('../assets/questions.json').data,
            // questionsId: [],
            // questionsIdSelected: [],            
            backHandler: null,            
        };
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        // let questionsId = this.state.questionsInit.map((question: any) => {
        //     return question.id;
        // })
        this.setState({            
            // questionsId: questionsId,
            // backHandler: BackHandler.addEventListener('hardwareBackPress', () => {
            //     if (this.state.questionsIdSelected.length > 0) {
            //         Alert.alert(
            //             'As questões respondidas não serão salvas',
            //             'Você deseja realmente sair?',
            //             [
            //                 { text: 'Sair', onPress: () => this.props.navigation.goBack() },
            //                 { text: 'Cancelar', onPress: () => console.log('sair') }
            //             ]
            //         );
            //         return true;
            //     }
            // })
        });
    }

    componentWillUnmount() {        
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
    }

    submit = () => {
        // let questionsNotSelected = this.state.questionsId.filter((i) => {
        //     return this.state.questionsIdSelected.indexOf(i) < 0;
        // }).map((i) => {
        //     return "Questão " + i;
        // });
        // if (questionsNotSelected.length > 0) {
        //     Alert.alert(
        //         'As questões abaixo não foram preenchidas',
        //         questionsNotSelected.slice(0, 10).join("\n")
        //     )
        // } else {
        //     Alert.alert(
        //         'Salvar Questionário',
        //         'Salvar e ir para próximo questionário?',
        //         [
        //             { text: 'Não', onPress: () => console.log('cancelado') },
        //             {
        //                 text: 'Sim', onPress: async () => {
        //                     await this.saveQuestions();
        //                     ToastAndroid.showWithGravity(
        //                         'Questionário Salvo com sucesso',
        //                         ToastAndroid.LONG,
        //                         ToastAndroid.TOP
        //                     )
        //                     this.setState({
        //                         questionsInit: this.state.questionsInit.map((item) => {
        //                             return { ...item, option: 0 };
        //                         })
        //                     })

        //                 }
        //             }
        //         ]
        //     )
        // }
    }

    onSelect = (item: any, option: number) => {
        console.log('item', item);
        console.log('option', option);
        this.setState({questions: this.state.questions.map(item => {
            return {...item, option};
        })})        
        console.log(this.state.questions);
    }

    render() {
        const { empresa, setor, questions } = this.state;
        return (
            <View style={style.screen}>
                <Text style={style.titleRazaoSocial}>
                    {empresa.razaoSocial} - {setor}
                </Text>
                <Text style={style.titleCnpj}>
                    {empresa.cnpj}
                </Text>
                <View style={style.contentList}>
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