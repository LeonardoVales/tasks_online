import React, { Component } from 'react'
import {
    View,
    ActivityIndicator,
    Text,
    StyleSheet,
    AsyncStorage
} from 'react-native'

import refreshToken from '../components/refreshToken'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';
import { showError } from '../common';

const KEY_SECURE = {keychainService: 'tasks@2020'}

export default class AuthOrApp extends Component {

    componentDidMount = async () => {

        const userDataJson = await AsyncStorage.getItem('userData')
        const dados_login  = await SecureStore.getItemAsync('tasks_login', KEY_SECURE)
        
        let userData   = null
        let user_login = null

        try {
            userData = JSON.parse(userDataJson)
            user_login = JSON.parse(dados_login)
            
        } catch(e) {
            showError(e)
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