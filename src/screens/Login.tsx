import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { If } from '../commons';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface State {
    username: string;
    password: string;
    userInvalid: boolean;    
}

export class Login extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { username: '', password: '', userInvalid: false };
    }


    validUser() {
        if (this.state.username == '' || this.state.password == '') {
            this.setState({username: '', password: '', userInvalid: true});            
        } else {
            this.setState({username: '', password: '', userInvalid: false});            
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
                    onChange={() => this.setState({userInvalid: false})}
                />                
                <TextInput
                    value={this.state.password}
                    style={style.input}                    
                    underlineColorAndroid={this.state.userInvalid ? 'red' : '#008030'}
                    placeholder='Senha'
                    placeholderTextColor={this.state.userInvalid ? 'red' : '#008030'}
                    secureTextEntry={true}                    
                    onChangeText={(text: string) => this.setState({ password: text })}
                    onChange={() => this.setState({userInvalid: false})}                    
                />
                <If condition={this.state.userInvalid}>
                    <Text style={style.userInvalid}> Usuário ou senha não informados </Text>
                </If>
                <TouchableOpacity style={style.button} onPress={() => this.validUser()}>
                    <Text style={style.textButton}>Login</Text>
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
        width: 300,
        height: 100,
        resizeMode: 'stretch',
        padding: 10,
        margin: 10
    },
    input: {
        width: 300,
        padding: 10,
        margin: 10,
        textAlignVertical: 'center'
    },
    button: {
        backgroundColor: '#008030',
        paddingBottom: 10,
        paddingTop: 10,        
        borderRadius: 10,
        shadowOpacity: 0.9,
        marginVertical: 10,
        width: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
        
    },
    textButton: {
        color: 'white',
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 20
    },
    userInvalid: {
      color: 'red'  
    }
})