import React from 'react'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';
import { server, showError, showSuccess } from '../common'
import AsyncStorage from 'react-native'

const refreshToken = async () => {

    try {

        const res = await axios.post(`${server}/refresh-token`)
        
        axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
        
    } catch(e) {
        showError(e)
    }

}

export default refreshToken;