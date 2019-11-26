import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    DeviceEventEmitter
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { If } from '../commons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { RealmService, AsyncStorageService } from '../services'
import { NavigationEvents } from 'react-navigation';
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
    loading: boolean;
}

export class Register extends Component<Props, State> {

    eventEmitter: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            empresa: { cnpj: '', razaoSocial: '' },
            invalidCnpj: false,
            invalidRazaoSocial: false,
            setor: '',
            invalidSetor: false,
            dateQuestion: { date: new Date(), mode: 'date', show: false },
            loading: false
        };
        AsyncStorageService.saveItem('empresa', {});
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
            this.setState({ loading: true });
            const empresaSchema = { cnpj: this.state.empresa.cnpj, razaoSocial: this.state.empresa.razaoSocial, setor: this.state.setor };
            const empresaStorage = {
                cnpj: this.state.empresa.cnpj,
                razaoSocial: this.state.empresa.razaoSocial,
                setor: this.state.setor,
                idRegional: 1 // TODO: Alterar 
            }            
            await this.saveEmpresa(empresaSchema);
            async function loadEmpresas(cnpj: string) {
                const realm = await RealmService.getRealm();
                return realm.objects('EmpresaSchema').filtered("cnpj = " + `'${cnpj}'`);
            }
            let empresaFound = await loadEmpresas(this.state.empresa.cnpj);
            const setorStorage = {
                nome: this.state.setor,
                empresa: empresaFound[0]
            }
            this.saveSetor(setorStorage)

            let empresaUpdate = await AsyncStorageService.updateItem('empresa', empresaStorage);

            DeviceEventEmitter.emit('eventKey', empresaUpdate);
            this.props.navigation.navigate('FormQuestion');
            this.setState({ loading: false });
        }
    }

    saveEmpresa = async (empresaSchema: any) => {
        const realm = await RealmService.getRealm();
        if (this.empresaExists()) {
            realm.write(() => {
                realm.create('EmpresaSchema', empresaSchema, true);
                
            });
        } else {
            realm.write(() => {
                realm.create('EmpresaSchema', empresaSchema);                
            });
        }
    }

    saveSetor = async (setorSchema: any) => {
        const realm = await RealmService.getRealm();
        realm.write(() => {
            let setor: any = realm.create('SetorSchema', setorSchema);
        });
    }

    findEmpresa = async () => {
        async function loadEmpresas(cnpj: string) {
            const realm = await RealmService.getRealm();
            return realm.objects('EmpresaSchema').filtered("cnpj = " + `'${cnpj}'`);
        }
        let empresaFound: any = await loadEmpresas(this.state.empresa.cnpj);
        if (empresaFound.length > 0) {
            this.setState(state => { return { ...state, empresa: { ...state.empresa, cnpj: empresaFound[0].cnpj, razaoSocial: empresaFound[0].razaoSocial } } });
        } else {
            this.setState(state => { return { ...state, empresa: { ...state.empresa, razaoSocial: '' } } });
        }
    }

    empresaExists = async () => {
        async function loadEmpresas(cnpj: string) {
            const realm = await RealmService.getRealm();
            return realm.objects('EmpresaSchema').filtered("cnpj = " + `'${cnpj}'`);
        }
        let empresaFound = await loadEmpresas(this.state.empresa.cnpj);
        empresaFound.length > 0;
    }

    refresh = async () => {
        this.setState({
            empresa: { cnpj: '', razaoSocial: '' },
            setor: '',
            dateQuestion: { date: new Date(), mode: 'date', show: false }
        });
    }

    render() {
        const { empresa, invalidCnpj, invalidRazaoSocial, setor, invalidSetor, dateQuestion, loading } = this.state;
        return (
            <ScrollView style={style.screen}>
                <NavigationEvents
                    onDidFocus={() => this.refresh()}
                />
                <If condition={loading}>
                    <ActivityIndicator
                        style={{ height: 100 }}
                        color="#48bb94"
                        size="large"
                    />
                    <Text style={style.textLoading}> Carregando Questionários... </Text>
                </If>
                <If condition={!loading}>
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
                </If>
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
        width: wp('28%'),
        height: hp('6%')
    },
    textButton: {
        flex: 1,
        color: 'white',
        textAlignVertical: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 20
    },
    textLoading: {
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        margin: 10,
        fontSize: hp('3.5%'),
        color: 'green',
        fontWeight: 'bold'
    }
})

