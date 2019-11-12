import React, { Component } from 'react';
import { StyleSheet, TextInput, ScrollView, TouchableOpacity, Text } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { If } from '../commons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { RealmService, AsyncStorageService } from '../services'
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
    invalidCnpj: boolean;
    invalidRazaoSocial: boolean;
    setor: string;
    invalidSetor: boolean;
    dateQuestion: any;
    empresaExist: boolean;
}

export class Register extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            empresa: { cnpj: '', razaoSocial: '' },
            invalidCnpj: false,
            invalidRazaoSocial: false,
            setor: '',
            empresaExist: false,
            invalidSetor: false,
            dateQuestion: { date: new Date(), mode: 'date', show: false },
        };
    }

    openDatePicker = () => {
        this.setState(state => { return { ...state, dateQuestion: { ...state.dateQuestion, show: true, } } })
    }

    setDate = (value: any) => {
        let date = this.state.dateQuestion.date;
        if (value.type !== "dismissed") {
            date = new Date(value.nativeEvent.timestamp);
        }
        this.setState(state => { return { ...state, dateQuestion: { ...state.dateQuestion, date: date, show: false } } });
    }

    isValidForm = () => {
        let invalid: boolean = true;
        if (this.state.empresa.cnpj === '') {
            invalid = !invalid;
            this.setState({ invalidCnpj: true })
        }
        if (this.state.empresa.razaoSocial === '') {
            invalid = !invalid;
            this.setState({ invalidRazaoSocial: true })
        }
        if (this.state.setor === '') {
            invalid = !invalid;
            this.setState({ invalidSetor: true })
        }
        return invalid;
    }

    save = async () => {
        if (this.isValidForm()) {
            const empresaSchema = { cnpj: this.state.empresa.cnpj, nome: this.state.empresa.razaoSocial, setor: this.state.setor };
            const empresaStorage = {
                cnpj: this.state.empresa.cnpj,
                razaoSocial: this.state.empresa.razaoSocial,
                setor: this.state.setor,
                mes: this.state.dateQuestion.date.getMonth() + 1 + '/' + this.state.dateQuestion.date.getFullYear(),
            }
            await this.saveEmpresa(empresaSchema);
            await AsyncStorageService.saveItem('empresa', empresaStorage);
            this.props.navigation.navigate('FormQuestion');
            this.setState(state => { return { ...state, empresa: { ...state.empresa, razaoSocial: '', cnpj: '' }, setor: '', empresaExist: false } });
        }
    }

    saveEmpresa = async (empresaSchema: any) => {
        const realm = await RealmService.getRealm();
        if (!this.state.empresaExist) {
            realm.write(() => {
                let empresa: any = realm.create('EmpresaSchema', empresaSchema);
                empresa.setores.push(empresaSchema.setor);
            });
        } else {
            realm.write(() => {
                let empresa: any = realm.create('EmpresaSchema', empresaSchema, true);
                empresa.setores.push(empresaSchema.setor);
            })
        }
    }

    findEmpresa = async () => {
        async function loadEmpresas(cnpj: string) {
            const realm = await RealmService.getRealm();
            return realm.objects('EmpresaSchema').filtered("cnpj = " + `'${cnpj}'`);
        }
        let foundEmpresa: any = await loadEmpresas(this.state.empresa.cnpj);
        if (foundEmpresa.length > 0) {
            this.setState(state => { return { ...state, empresa: { ...state.empresa, cnpj: foundEmpresa[0].cnpj, razaoSocial: foundEmpresa[0].nome }, empresaExist: true } });
        } else {
            this.setState(state => { return { ...state, empresa: { ...state.empresa, razaoSocial: '' }, empresaExist: false } });
        }
    }

    render() {
        const { empresa, invalidCnpj, invalidRazaoSocial, setor, invalidSetor, dateQuestion } = this.state;
        return (
            <ScrollView style={style.screen}>
                <TextInputMask
                    type={'cnpj'}
                    style={style.textInput}
                    value={empresa.cnpj}
                    underlineColorAndroid={invalidCnpj ? 'red' : '#008030'}
                    placeholder={invalidCnpj ? 'CNPJ não informado' : 'Informe o CNPJ'}
                    placeholderTextColor={invalidCnpj ? 'red' : '#008030'}
                    onChangeText={text => this.setState(state => { return { ...state, empresa: { ...state.empresa, cnpj: text } } })}
                    onChange={() => this.setState({ invalidCnpj: false })}
                    onBlur={() => this.findEmpresa()}
                />
                <TextInput
                    style={style.textInput}
                    value={empresa.razaoSocial}
                    underlineColorAndroid={invalidRazaoSocial ? 'red' : '#008030'}
                    placeholder={invalidRazaoSocial ? 'Razão social não informada' : 'Informe a razão social'}
                    placeholderTextColor={invalidRazaoSocial ? 'red' : '#008030'}
                    onChangeText={text => this.setState(state => { return { ...state, empresa: { ...state.empresa, razaoSocial: text } } })}
                    onChange={() => this.setState({ invalidRazaoSocial: false })}
                />
                <TextInput
                    style={style.textInput}
                    value={setor}
                    underlineColorAndroid={invalidSetor ? 'red' : '#008030'}
                    placeholder={invalidSetor ? 'Setor não informado' : 'Informe o setor'}
                    placeholderTextColor={invalidCnpj ? 'red' : '#008030'}
                    onChangeText={text => this.setState({ setor: text })}
                    onChange={() => this.setState({ invalidSetor: false })}
                />
                <FontAwesomeIcon
                    icon={faCalendarAlt}
                    style={style.calendar}
                    color='green'
                    size={60}
                    onPress={() => this.openDatePicker()}
                />
                <TextInput
                    style={style.textInput}
                    value={dateQuestion.date.getMonth() + 1 + '/' + dateQuestion.date.getFullYear() + ' - Data do questionário '}
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
                <TouchableOpacity style={style.button} onPress={() => this.save()}>
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
        alignSelf: 'center'
    },
    textInput: {
        flex: 1,
        alignSelf: 'center',
        width: wp('90%'),
        marginVertical: 20,
    },
    calendar: {
        alignSelf: 'center',
    },
    button: {
        flex: 1,
        backgroundColor: '#008030',
        paddingBottom: 10,
        paddingTop: 5,
        borderRadius: 10,
        shadowOpacity: 0.9,
        marginVertical: 10,
        alignSelf: 'center',
        width: wp('20%'),
        height: hp('5%')
    },
    textButton: {
        flex: 1,
        color: 'white',
        textAlignVertical: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 20
    }
})

