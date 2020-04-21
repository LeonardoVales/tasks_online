import React, { Component } from 'react';
import { View,
         ImageBackground,
         Text,
         StyleSheet,
         TouchableOpacity,
         Alert, } from 'react-native';

import backgroundImage from '../../assets/imgs/login.jpg';
import commonStyles from '../commonStyles';
import AuthInput from '../components/AuthInput'
import { server, showError, showSuccess } from '../common'
import axios from 'axios'

export default class Auth extends Component {

    state = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        stageNew: false
    }
    
    signinOrSignup = () => {
        if (this.state.stageNew) {
            this.signup()
        } else {
            Alert.alert('Sucesso!', 'logar')
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
            this.setState({ stageNew: false })
        } catch (e) {
            showError(e)
        }

    }

    render() {
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

                    <TouchableOpacity onPress={this.signinOrSignup}>
                        <View style={styles.button}>
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