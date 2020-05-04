import React from 'react'
import { ScrollView, 
         View, 
         Text, 
         StyleSheet, 
         AsyncStorage,
         TouchableOpacity 
} from 'react-native'
import { DrawerItems } from 'react-navigation-drawer'
import { Gravatar } from 'react-native-gravatar'
import commonStyles from '../commonStyles'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons';

export default props => {

    const logout = () => {

        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        props.navigation.navigate('AuthOrApp')

    }

    return (
        <ScrollView>
            <View style={styles.header}>
                <Text style={styles.title}>Tasks</Text>
                <Gravatar style={styles.avatar}
                          
                          options={{
                            email: props.navigation.getParam('email'),
                            secure: true
                          }}  />
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.name}>
                    {props.navigation.getParam('name')}
                    </Text>          
                <Text style={styles.email}>
                    {props.navigation.getParam('email')}
                </Text>          
            </View>
            <TouchableOpacity onPress={logout}>
                <View style={styles.logoutIcon}>
                    <Ionicons name='ios-log-out' size={30} color='#800' />
                </View>
            </TouchableOpacity>
            <DrawerItems {...props} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderColor: '#DDD',
    },
    title: {
        color: '#000',
        fontSize: 30,
        paddingTop: 30,
        padding: 10,
    },  
    avatar: {
        width: 60,
        height: 60,
        borderWidth: 3,
        borderRadius: 30,
        margin: 10,
    },
    userInfo: {
        marginLeft: 10,
        
    },
    name: {
        fontSize: 20,
        marginBottom: 5,
        color: commonStyles.colors.mainText,
    },
    email: {
        fontSize: 15,
        color: commonStyles.colors.subText,
        marginBottom: 10,
    },
    logoutIcon: {
        marginLeft: 10,
        marginBottom: 10,
    }
})