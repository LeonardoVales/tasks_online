import React from 'react'
import { View,
         Text,
         StyleSheet,
         TouchableWithoutFeedback,
         TouchableOpacity 
        } from 'react-native'

import commonStyles from '../commonStyles'    
import { Ionicons } from '@expo/vector-icons';    
import moment from 'moment'
import 'moment/locale/pt-br'
import Swipeable from 'react-native-gesture-handler/Swipeable'

export default props => {

    const doneOrNotStyle = props.doneAt != null ? 
        { textDecorationLine: 'line-through'} : {}

    const date = props.doneAt ? props.doneAt : props.estimateAt

    const formatedDate = moment(date).locale('pt-br').format('ddd, D, [de] MMMM')

    const getRightContent = () => {
        return (
            <TouchableOpacity style={styles.right} 
            onPress={() => props.onDelete && props.onDelete(props.id)}>
                <Ionicons name="md-trash" size={30} color='#FFF' />
            </TouchableOpacity>
        );
    }

    const getLeftContent = () => {
        return (
            <View style={styles.left}>
                <Ionicons name="md-trash" size={20} color='#FFF' style={styles.excludeIcon} />
                <Text style={styles.excludeText}>Excluir</Text>
            </View>
        );
    }    

    return (

        <Swipeable
        renderRightActions={getRightContent} //renderiza o conteúdo que vai aparecer no lado direito
        renderLeftActions={getLeftContent} //renderiza o conteúdo que vai aparecer no lado esquerdo
        onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)} //Quando abrir o evento do lado direito
        
        >
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={() => props.toggleTask(props.id)}
                >
                    <View style={styles.checkContainer}>
                        {getCheckView(props.doneAt)}
                    </View>
                </TouchableWithoutFeedback>
                <View>
                    <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
                    <Text style={styles.date}>{formatedDate}</Text>
                </View>            
            </View>            
        </Swipeable>

    );

} 

function getCheckView(doneAt) {

    if (doneAt != null) {
        return (
            <View style={styles.done}>
                <Ionicons 
                    name="md-checkmark" 
                    size={20} color='#FFF'
                    
                />
            </View>
        );
    } else {
        return (
            <View style={styles.pending}>
                
            </View>
        );        
    }


}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderColor: '#AAA', //Quando coloca a cor da borda, é necessário colocar a sua largura
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#FFF',
    },
    checkContainer: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    }, 
    pending: {
        width: 25,
        height: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555'
    },
    done: {
        width: 25,
        height: 25,
        borderRadius: 13,
        backgroundColor: '#4d7031',
        alignItems: 'center',
        justifyContent: 'center'
    },
    desc: {
        color: commonStyles.colors.mainText,
        fontSize: 15,
    },
    date: {
        color: commonStyles.colors.subText,
        fontSize: 12,
        fontWeight: 'bold'
    },
    right: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    },
    left: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
    },
    excludeText: {
        color: '#FFF',
        fontSize: 20,
        margin: 10,
    },
    excludeIcon: {
        marginLeft: 10,
    }
});