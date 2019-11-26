import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text, BackHandler } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { If } from '../commons';
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
    username: string;
    password: string;
    userInvalid: boolean;
}

export class Login extends Component<Props, State> {

    backHandler: any;

    constructor(props: Props) {
        super(props);
        this.state = { username: '', password: '', userInvalid: false };
    }

    componentDidMount = () => {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => { return true })
    }

    componentWillUnmount = () => {
        this.backHandler.remove();
    }


    validUser() {
        if (this.state.username !== 'ginfo.labs' || this.state.password !== 'sistemas01') {
            this.setState({ username: '', password: '', userInvalid: true });
        } else {
            this.setState({ username: '', password: '', userInvalid: false });
            this.props.navigation.navigate('Register');
        }

    }

    render() {
        return (
            <View style={style.screen}>
                <Image style={style.logo} source={require('../assets/logo_sem_fundo.png')} />
                <TextInput
                    value={this.state.username}
                    style={style.input}
                    autoFocus
                    underlineColorAndroid={this.state.userInvalid ? 'red' : '#008030'}
                    placeholder='Usuário'
                    placeholderTextColor={this.state.userInvalid ? 'red' : '#008030'}
                    onChangeText={(text: string) => this.setState({ username: text })}
                    onChange={() => this.setState({ userInvalid: false })}
                />
                <TextInput
                    value={this.state.password}
                    style={style.input}
                    underlineColorAndroid={this.state.userInvalid ? 'red' : '#008030'}
                    placeholder='Senha'
                    placeholderTextColor={this.state.userInvalid ? 'red' : '#008030'}
                    secureTextEntry={true}
                    onChangeText={(text: string) => this.setState({ password: text })}
                    onChange={() => this.setState({ userInvalid: false })}
                />
                <If condition={this.state.userInvalid}>
                    <Text style={style.userInvalid}> Usuário ou senha inválidos </Text>
                </If>
                <TouchableOpacity style={style.button} onPress={() => this.validUser()}>
                    <Text style={style.textButton}>Entrar</Text>
                </TouchableOpacity >
            </View>
        )
    }
}

const style = StyleSheet.create({
    screen: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {        
        alignSelf: 'center',
        width: wp('70%'),
        height: hp('15%'),
        resizeMode: 'stretch',  
        marginBottom: hp('2%'),      
        marginTop: hp('5%')
    },
    input: {
        width: wp('80%'),         
        marginVertical: hp('2%'),
        textAlignVertical: 'center'
    },
    button: {        
        backgroundColor: '#008030',
        paddingBottom: 10,
        paddingTop: 5,
        borderRadius: 10,
        shadowOpacity: 0.9,
        marginVertical: hp('2%'),
        alignSelf: 'center',
        width: wp('25%'),
        height: hp('6%')

    },
    textButton: {
        flex: 1,
        color: 'white',
        textAlignVertical: 'center',                
        alignSelf: 'center',
        alignContent: 'center',
        textAlign: 'center',        
        fontSize: 20        
    },
    userInvalid: {
        color: 'red'
    }
})