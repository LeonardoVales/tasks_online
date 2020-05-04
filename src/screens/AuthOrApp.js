import React, { Component } from 'react'
import {
    View,
    ActivityIndicator,
    Text,
    StyleSheet,
    AsyncStorage
} from 'react-native'

import axios from 'axios'

export default class AuthOrApp extends Component {

    componentDidMount = async () => {

        const userDataJson = await AsyncStorage.getItem('userData')
        let userData = null

        try {
            userData = JSON.parse(userDataJson)
        } catch(e) {

        }

        if (userData && userData.token) {
            axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`
            this.props.navigation.navigate('Home', userData)
        } else {
            this.props.navigation.navigate('Auth')
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titleLoad}>Carregando</Text>
                <ActivityIndicator size='large' />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    titleLoad: {
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    }
})