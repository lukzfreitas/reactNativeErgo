import React, { Component } from 'react'
import { Text, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from 'react-native'
import { NavigationEvents } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as loc,
    removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { RealmService, QuestionService } from '../services'

interface Props {

}

interface State {
    totalQuestions: number,
    isLoading: boolean
}

export class Sync extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            totalQuestions: 0,
            isLoading: false
        }
    }

    componentDidMount = async () => {
        const realm = await RealmService.getRealm();
        const questions: any = realm.objects('QuestionarioSchema');
        this.setState({ totalQuestions: questions.length });
    }

    refresh = async () => {
        const realm = await RealmService.getRealm();
        const questions: any = realm.objects('QuestionarioSchema');
        this.setState({ totalQuestions: questions.length });
    }

    sync = async () => {
        if (this.state.totalQuestions == 0) {
            Alert.alert(
                'Aviso',
                'Você não possui registros para sincronizar'
            );
            return;
        }
        await NetInfo.fetch().then(async state => {
            if (!state.isConnected) {
                Alert.alert(
                    'Aviso',
                    'O seu dispositivo não possui uma conexão com a internet para a realização da sincronização dos dados.'
                );
            } else {
                await this.executeSync();                
            }
        });
    }

    private executeSync = async () => {
        const realm = await RealmService.getRealm();
        const questions = realm.objects('QuestionarioSchema');
        console.log(questions);
        return;
        questions.map(async (quest: any) => {
            this.setState({ isLoading: true });
            QuestionService.postQuestions(quest).then(async (response) => {
                this.setState({ isLoading: false });
                if (response.status === 200) {
                    realm.write(() => {
                        realm.delete(quest);
                        let questions: any = realm.objects('QuestionarioSchema');
                        this.setState({ totalQuestions: questions.length });
                    });
                    ToastAndroid.showWithGravity(
                        'Questionários sincronizados com sucesso',
                        ToastAndroid.LONG,
                        ToastAndroid.TOP
                    )
                } else {
                    ToastAndroid.showWithGravity(
                        'Ocorreu um erro ao tentar sincronizar os dados',
                        ToastAndroid.LONG,
                        ToastAndroid.TOP
                    );
                    console.log(response);
                }
            }).catch((error: any) => {
                ToastAndroid.showWithGravity(
                    'Ocorreu um erro ao tentar sincronizar os dados',
                    ToastAndroid.LONG,
                    ToastAndroid.TOP
                );
                console.error(error);
            });
        });
    }

    render() {
        const { totalQuestions } = this.state;
        return (
            <ScrollView style={style.screenScroll}>
                <NavigationEvents
                    onDidFocus={() => this.refresh()}
                />
                <Text style={style.textTitle}> Questionário PsicoErgo - Sincronizar </Text>
                <Text style={style.textSubTitle}> Quantidade de Respostas: {totalQuestions} </Text>
                <TouchableOpacity style={style.button} onPress={() => this.sync()}>
                    <Text style={style.textButton}>Sincronizar</Text>
                </TouchableOpacity>
            </ScrollView>

        )
    }
}

const style = StyleSheet.create({
    screenScroll: {
        flexDirection: 'column'
    },
    textTitle: {
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: hp('1%'),
        padding: hp('2%'),
        fontWeight: 'bold',
        fontSize: hp('4%')
    },
    textSubTitle: {
        alignSelf: 'center',
        fontSize: hp('3%')
    },
    textButton: {
        flex: 1,
        color: 'white',
        alignSelf: 'center',
        fontSize: hp('3%'),
        padding: hp('1%')
    },
    button: {
        flex: 1,
        backgroundColor: '#008030',
        borderRadius: 10,
        alignSelf: 'center',
        width: wp('40%'),
        height: hp('6%'),
        marginHorizontal: 100,
        marginTop: hp('1%'),
        marginBottom: hp('1%')
    },
});
