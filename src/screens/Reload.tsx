import React, { Component } from 'react'
import { ActivityIndicator, View, Text } from 'react-native'
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { If } from '../commons';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface State {
    loading: boolean;
}

export class Reload extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { loading: true };
        setTimeout(() => {
            console.log('carregando')
        }, 1000);
        this.setState({ loading: false })
        this.props.navigation.navigate('FormQuestion');
    }

    render() {
        const { loading } = this.state;
        return (
            <View>
                <If condition={loading}>
                    <ActivityIndicator
                        style={{ height: 100 }}
                        color="#48bb94"
                        size="large"
                    />
                </If>
            </View>
        )
    }
}
