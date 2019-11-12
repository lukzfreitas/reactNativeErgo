import React from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createDrawerNavigator } from 'react-navigation-drawer'
import { Login, Register, FormQuestion, Reload } from './src/screens'
import { Icon } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDoorOpen, faBuilding } from '@fortawesome/free-solid-svg-icons'

const LoginStackNavigator = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: ({
      header: null
    })
  }
})

// TODO: Talvez utilizar dentro do component FormQuestion
const FormQuestionStackNavigator = createStackNavigator({
  FormQuestion: {
    screen: FormQuestion,
    navigationOptions: ({ navigation }) => ({
      title: 'Questionário',
      headerTitleStyle: {
        color: 'green',
        fontWeight: 'bold',
      },
      headerLeft: (
        <Icon
          name='navicon'
          type='evilicon'
          color='green'
          size={60}
          onPress={() => navigation.openDrawer()}
        />
      )
    })
  }
})


const RegisterStackNavigator = createStackNavigator({
  Register: {
    screen: Register,
    navigationOptions: ({ navigation }) => ({
      title: 'Registrar Empresa',
      headerTitleStyle: {
        fontWeight: 'bold',
        alignSelf: 'center',
        textAlign: 'center',
      },
      headerTintColor: '#008030',
      headerLeft: <Icon
        name='navicon'
        type='evilicon'
        color='green'
        size={60}
        onPress={() => navigation.openDrawer()}
      />
    })
  }
})

const AppDrawerNavigator = createDrawerNavigator({  
  Register: {
    screen: RegisterStackNavigator,
    navigationOptions: {
      drawerLabel: 'Registrar Empresa',
      drawerIcon: (
        <FontAwesomeIcon
          icon={faBuilding}
          color='green'
          size={20}
        />
      )
    }
  },
  Login: {
    screen: LoginStackNavigator,
    navigationOptions: {
      drawerLabel: 'Logout',
      drawerIcon: (
        <FontAwesomeIcon
          icon={faDoorOpen}
          color='green'
          size={20}
        />
      )
    }
  },
  FormQuestion: {
    screen: FormQuestionStackNavigator,
    navigationOptions: {
      drawerLabel: () => null
    }
  }
})

const AppSwitchNavigator = createSwitchNavigator({
  Questions: { screen: AppDrawerNavigator }
})

const AppContainer = createAppContainer(AppSwitchNavigator);

export default AppContainer;



// const App = createAppContainer(
//   createStackNavigator({
//     Login: {
//       screen: Login,
//       navigationOptions: () => ({
//         header: null, // not showing header on component        
//       })
//     },
//     Register: {
//       screen: Register,
//       navigationOptions: () => ({
//         title: 'Registro Empresa',
//         headerLeft: null,
//         headerTitleStyle: {
//           fontWeight: 'bold',
//           alignSelf: 'center',
//           textAlign: 'center',
//         },
//         headerTintColor: '#008030'
//       })
//     },
//     FormQuestion: {
//       screen: FormQuestion,
//       navigationOptions: () => ({
//         title: 'Questionário',
//         headerTitleStyle: {
//           fontWeight: 'bold'
//         },
//         headerTintColor: '#008030'
//       })
//     },
//   })
// )

// export default App;
