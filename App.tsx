import React from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createDrawerNavigator } from 'react-navigation-drawer'
import { Login, Register, FormQuestion, Sync } from './src/screens'
import { Icon } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDoorOpen, faBuilding, faSync } from '@fortawesome/free-solid-svg-icons'

const LoginStackNavigator = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: ({
      header: null
    })
  }
})

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

const SyncStackNavigator = createStackNavigator({
  Sync: {
    screen: Sync,
    navigationOptions: ({ navigation }) => ({
      title: 'Sincronizar',
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
  Sync: {
    screen: SyncStackNavigator,
    navigationOptions: {
      drawerLabel: 'Sincronizar',
      drawerIcon: (
        <FontAwesomeIcon
          icon={faSync}
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
