import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Image } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { If } from '../commons';


interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface State {
    cnpj: string;
    razaoSocial: string;
    setor: string;
    dateQuestion: any;

}

export class Register extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            cnpj: '',
            razaoSocial: '',
            setor: '',
            dateQuestion: { date: new Date(), mode: 'date', show: false }
        };
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
        let date = new Date(value.nativeEvent.timestamp);        
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
        const { cnpj, razaoSocial, setor, dateQuestion } = this.state;
        return (            
            <View>
                <TextInputMask
                    type={'cnpj'}
                    style={style.textInput}
                    value={cnpj}
                    underlineColorAndroid='#008030'
                    placeholder='Informe o CNPJ'
                    onChangeText={text => this.setState({ cnpj: text })}
                />
                <TextInput
                    style={style.textInput}
                    value={razaoSocial}
                    underlineColorAndroid='#008030'
                    placeholder='Informe a razão social'
                    onChangeText={text => this.setState({ razaoSocial: text })}
                />
                <TextInput
                    style={style.textInput}
                    value={setor}
                    underlineColorAndroid='#008030'
                    placeholder='Informe o setor'
                    onChangeText={text => this.setState({ setor: text })}
                />
                <TextInput
                    style={style.textInput}
                    value={dateQuestion.date.toString()}
                    underlineColorAndroid='#008030'
                    placeholder='Selecione a data'                    
                    onChangeText={(text: string) => {
                        this.setState(state => {
                            return {
                                ...state,
                                dateQuestion: {
                                    ...state.dateQuestion,
                                    date: new Date(text)
                                }
                            }
                        })
                    }}
                    onFocus={() => this.openDatePicker()}
                />                
                <If condition={dateQuestion.show}>
                    <DateTimePicker value={dateQuestion.date}
                        mode={dateQuestion.mode}
                        is24Hour={true}
                        display="default"
                        onChange={(value) => this.setDate(value)} />
                </If>

            </View>
        )
    }
}

const style = StyleSheet.create({
    screen: {
        flex: 1,
        flexDirection: 'column',
        margin: 20
    },
    textInput: {
        marginHorizontal: 40,
        marginVertical: 20
    }
})

