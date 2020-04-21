import { Alert, Platform } from 'react-native'

const server = 'http://192.168.0.4/tasks_backend/public/api';
// const server = Platform.OS === 'ios'
//     ? 'http://' : 'http://localhost:8000/api'

function showError(err) {
    Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${err}`)
}

function showSuccess(msg) {
    Alert.alert('Sucesso', msg)
}

export { server, showError, showSuccess }