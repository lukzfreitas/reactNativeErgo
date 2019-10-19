import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { Login, Register, FormQuestion } from './src/screens'

const App = createAppContainer(
  createStackNavigator({
    Login: {
      screen: Login,
      navigationOptions: () => ({
        header: null, // not showing header on component        
      })
    },
    Register: {
      screen: Register,
      navigationOptions: () => ({
        title: 'Registro Empresa',
        headerLeft: null,
        headerTitleStyle: {
          fontWeight: 'bold',
          alignSelf: 'center',
          textAlign: 'center',
        },
        headerTintColor: '#008030'
      })
    },
    FormQuestion: {
      screen: FormQuestion,
      navigationOptions: () => ({
        title: 'Questionário',
        headerTitleStyle: {
          fontWeight: 'bold'
        },
        headerTintColor: '#008030'
      })
    }
  }, {
    navigationOptions: {
      headerStyle: {
        backgroundColor: 'skyblue'
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'skyblue'
      },
    }
  })
)

export default App;
