import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import {createDrawerNavigator} from 'react-navigation-drawer';
import HomeTask from '../HomeTask'
import Auth from './screens/Auth';
import Menu from './screens/Menu'
import CommonStyles from './commonStyles'
import AuthOrApp from './screens/AuthOrApp'

const menuConfig = {
    initialRouteName: 'Today',
    contentComponent: Menu,
    contentOptions: {
        labelStyle: {
            fontWeight: 'normal',
            fontSize: 20,
        },
        activeLabelStyle: {
            color: '#080',
            fontWeight: 'bold'
        }
    }
}


const menuRoutes = {
    Today: {
        name: 'Today',
        screen: props => <HomeTask title='Hoje' daysAhead={0} {...props} />,
        navigationOptions: {
            title: 'Hoje'
        }
    },
    Tomorrow: {
        name: 'Tomorrow',
        screen: props => <HomeTask title='Amanhã' daysAhead={1} {...props} />,
        navigationOptions: {
            title: 'Amanhã'
        }
    },
    Week: {
        name: 'Week',
        screen: props => <HomeTask title='Semana' daysAhead={7} {...props} />,
        navigationOptions: {
            title: 'Semana'
        }
    },
    Month: {
        name: 'Month',
        screen: props => <HomeTask title='Mês' daysAhead={30} {...props} />,
        navigationOptions: {
            title: 'Mês'
        }
    },

};

const menuNavigator = createDrawerNavigator(menuRoutes, menuConfig)

const mainRoutes = {

    AuthOrApp: {
        name: 'AuthOrApp',
        screen: AuthOrApp
    },
    Auth: {
        name: 'Auth',
        screen: Auth
    },
    Home: {
        name: 'Home',
        screen: menuNavigator
    }

}

const mainNavigator = createSwitchNavigator(mainRoutes, {
    initialRouteName: 'AuthOrApp'
})

export default createAppContainer(mainNavigator)