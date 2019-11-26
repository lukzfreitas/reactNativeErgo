import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Dialog, TextInput, Paragraph, Button } from 'react-native-paper';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'



interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;  
}

interface State {
  visible: boolean
  pin: string
}

export class DialogMessage extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    props.navigation.getParam('routeName');
    this.state = { visible: true, pin: '' }
  }

  render() {
    const { visible, pin } = this.state;    
    return (
      <Dialog visible={visible} onDismiss={() => this.setState({ visible: false })}>
        <Dialog.Title>Ir para próxima página</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Informe o PIN</Paragraph>
          <TextInput
            secureTextEntry={true}
            placeholder='Informe o pin'
            underlineColorAndroid='black'
            value={pin}
            onChangeText={(pin) => this.setState({pin})}
          >
          </TextInput>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => this.props.navigation.navigate('Register')}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    )
  }
}
