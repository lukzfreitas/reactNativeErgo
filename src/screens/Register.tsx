import React, { Component } from 'react';
import { StyleSheet, TextInput, ScrollView, TouchableOpacity, Text } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { If } from '../commons';
import { Icon } from 'react-native-elements'

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface State {
    cnpj: string;
    invalidCnpj: boolean;
    razaoSocial: string;
    invalidRazaoSocial: boolean;
    setor: string;
    invalidSetor: boolean;
    dateQuestion: any;
}

export class Register extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            cnpj: '',
            invalidCnpj: false,
            razaoSocial: '',
            invalidRazaoSocial: false,
            setor: '',
            invalidSetor: false,
            dateQuestion: { date: new Date(), mode: 'date', show: false }
        };
    }

    validForm = () => {
        let invalid: boolean = false;
        if (this.state.cnpj === '') {
            invalid = true;
            this.setState({ invalidCnpj: true })
        }
        if (this.state.razaoSocial === '') {
            invalid = true;
            this.setState({ invalidRazaoSocial: true })
        }
        if (this.state.setor === '') {
            invalid = true;
            this.setState({ invalidSetor: true })
        }
        if (!invalid) {
            this.props.navigation.navigate('FormQuestion')
        }
    }

    openDatePicker = () => {
        this.setState(state => {
            return {
                ...state,
                dateQuestion: {
                    ...state.dateQuestion,
                    show: true,
                }
            }
        })
    }

    setDate = (value: any) => {
        let date = this.state.dateQuestion.date;
        if (value.type !== "dismissed") {
            date = new Date(value.nativeEvent.timestamp);
        }
        this.setState(state => {
            return {
                ...state,
                dateQuestion: {
                    ...state.dateQuestion,
                    date: date,
                    show: false
                }
            }
        })
    }

    render() {
        const { cnpj, invalidCnpj, razaoSocial, invalidRazaoSocial, setor, invalidSetor, dateQuestion } = this.state;
        return (
            <ScrollView style={style.screen}>
                <TextInputMask
                    type={'cnpj'}
                    style={style.textInput}
                    value={cnpj}
                    underlineColorAndroid={invalidCnpj ? 'red' : '#008030'}
                    placeholder={invalidRazaoSocial ? 'CNPJ não informado' : 'Informe o CNPJ'}
                    placeholderTextColor={invalidRazaoSocial ? 'red' : '#008030'}
                    onChangeText={text => this.setState({ cnpj: text })}
                />
                <TextInput
                    style={style.textInput}
                    value={razaoSocial}
                    underlineColorAndroid={invalidRazaoSocial ? 'red' : '#008030'}
                    placeholder={invalidRazaoSocial ? 'Razão social não informada' : 'Informe a razão social'}
                    placeholderTextColor={invalidRazaoSocial ? 'red' : '#008030'}
                    onChangeText={text => this.setState({ razaoSocial: text })}
                />
                <TextInput
                    style={style.textInput}
                    value={setor}
                    underlineColorAndroid={invalidSetor ? 'red' : '#008030'}
                    placeholder={invalidSetor ? 'Setor não informado' : 'Informe o setor'}
                    placeholderTextColor={invalidCnpj ? 'red' : '#008030'}
                    onChangeText={text => this.setState({ setor: text })}
                />
                <Icon
                    name='calendar'
                    type='evilicon'
                    color='#008030'
                    size={60}
                    onPress={() => this.openDatePicker()}
                />
                <TextInput
                    style={style.textInput}
                    value={dateQuestion.date.getMonth() + 1 + '/' + dateQuestion.date.getFullYear()}
                    underlineColorAndroid='#008030'
                    placeholder='Selecione a data'
                    editable={true}
                    onFocus={() => this.openDatePicker()}
                />
                <If condition={dateQuestion.show}>
                    <DateTimePicker
                        value={dateQuestion.date}
                        mode={dateQuestion.mode}
                        is24Hour={true}
                        display="default"
                        locale="pt-BR"
                        onChange={(value) => this.setDate(value)} />
                </If>
                <TouchableOpacity style={style.button} onPress={() => this.validForm()}>
                    <Text style={style.textButton}>Cadastrar</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
}

const style = StyleSheet.create({
    screen: {
        flex: 1,
        flexDirection: 'column',
        margin: 10
    },
    textInput: {
        marginHorizontal: 40,
        marginVertical: 10
    },
    button: {
        backgroundColor: '#008030',
        paddingBottom: 10,
        paddingTop: 5,
        borderRadius: 10,
        shadowOpacity: 0.9,
        marginVertical: 10,
        marginHorizontal: 110,
        width: 120,
        height: 40,

    },
    textButton: {
        color: 'white',
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 20
    },
    messageError: {
        color: 'red',
        marginHorizontal: 40,
    }
})

