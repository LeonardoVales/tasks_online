import React, { Component } from 'react';
import { View,
         ImageBackground,
         Text,
         StyleSheet,
         TouchableOpacity,
         Alert,
         AsyncStorage } from 'react-native';

import backgroundImage from '../../assets/imgs/login.jpg';
import commonStyles from '../commonStyles';
import AuthInput from '../components/AuthInput'
import { server, showError, showSuccess } from '../common'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';


const initialState = {
        name: '',
        email: 'calvino@gmail.com',
        password: '123456',
        confirmPassword: '',
        stageNew: false    
}

const KEY_SECURE = {keychainService: 'tasks@2020'}

export default class Auth extends Component {

    state = {
        ...initialState
    }
    
    signinOrSignup = () => {
        if (this.state.stageNew) {
            this.signup()
        } else {
            this.signin()
        }
    }

    signup = async () => {

        try {
            await axios.post(`${server}/users/create`, {
                name:            this.state.name,
                email:           this.state.email,
                password:        this.state.password,
                confirmPassword: this.state.confirmPassword,
            })
            showSuccess('Usuário cadastrado!')
            this.setState({ ...initialState })
        } catch (e) {
            showError(e)
        }

    }

    signin = async () => {

        try {
            const res = await axios.post(`${server}/login`, {
                        email:    this.state.email,
                        password: this.state.password,
            })

            const dados_login = {email: this.state.email, password: this.state.password}
            
            // AsyncStorage.setItem('userData', JSON.stringify(res.data))
            AsyncStorage.setItem('userData', JSON.stringify(res.data))
            await SecureStore.setItemAsync('tasks_login', JSON.stringify(dados_login), KEY_SECURE)

            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            this.props.navigation.navigate('Home', res.data)

        } catch (e) {
            showError(e)
        }
    }

    render() {

        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)

        if (this.state.stageNew) {
            validations.push(this.state.name && this.state.name.trim().length >= 3)
            validations.push(this.state.password === this.state.confirmPassword)
        }

        //expressão reduce que verifica se todas as validações são verdadeiras
        const valideForm = validations.reduce((t, a) => t && a)

        return (
            <ImageBackground source={backgroundImage} style={styles.background}>
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>

                    <Text style={styles.subTitle}>
                        {this.state.stageNew ? 'Crie sua conta' : 'Informe seus dados'}
                    </Text>

                    {this.state.stageNew && 
                        <AuthInput icon='ios-person' placeholder='Nome' 
                                value={this.state.name} 
                                style={styles.input}
                                onChangeText={name => this.setState({ name })} />                    
                    }

                    <AuthInput icon='md-at' placeholder='E-mail' 
                               value={this.state.email} 
                               style={styles.input}
                               onChangeText={email => this.setState({ email })} />

                    <AuthInput icon='ios-lock' placeholder='Senha' 
                               secureTextEntry={true}
                               value={this.state.password} 
                               style={styles.input}
                               onChangeText={password => this.setState({ password })} />   

                    {this.state.stageNew && 
                        <AuthInput icon='ios-lock' placeholder='Confirmação de Senha' 
                                   value={this.state.confirmPassword} 
                                   style={styles.input}
                                   onChangeText={confirmPassword => this.setState({ confirmPassword })} />                    
                    }

                    <TouchableOpacity onPress={this.signinOrSignup} disabled={!valideForm}>
                        <View style={[styles.button, valideForm ? {} : { backgroundColor : '#AAA'}]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </Text>
                        </View>
                    </TouchableOpacity>                            
                    <TouchableOpacity style={{ padding: 10 }} 
                                      onPress={ () => this.setState({ stageNew: !this.state.stageNew })} >
                        <Text style={styles.buttonText}>
                            {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }

}


const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10
    },
    subTitle: {
        color: commonStyles.colors.secondary,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        width: '90%'   
    },    
    input: {
        marginTop: 10,
        backgroundColor: '#FFF'
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 5
    },
    buttonText: {
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center'
    }
});