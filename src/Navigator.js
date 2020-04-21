import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import HomeTask from '../HomeTask'
import Auth from './screens/Auth';

const mainRoutes = {

    Auth: {
        name: 'Auth',
        screen: Auth
    },
    Home: {
        name: 'Home',
        screen: HomeTask
    }

}

const mainNavigator = createSwitchNavigator(mainRoutes, {
    initialRouteName: 'Auth'
})

export default createAppContainer(mainNavigator)