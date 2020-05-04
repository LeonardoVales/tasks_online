import React, { Component } from 'react';
import { View, 
         Text,
         ImageBackground,
         StyleSheet,
         FlatList,
         TouchableOpacity,
         Platform,
         StatusBar,
         Alert,
         AsyncStorage
        } from 'react-native';


import todayImage from './assets/imgs/today.jpg';
import tomorrowImage from './assets/imgs/tomorrow.jpg';
import weekImage from './assets/imgs/week.jpg';
import monthImage from './assets/imgs/month.jpg';



import moment from 'moment'
import 'moment/locale/pt-br'
import commonStyles from './src/commonStyles'
import Task from './src/components/Task'
import { Ionicons } from '@expo/vector-icons';
import AddTask from './src/screens/AddTask'    
import axios from 'axios'
import { server, showError } from './src/common'


const initialState = {
    showDoneTasks: true,
    showAddTask:   false,
    visibleTasks:  [],
    tasks:         []
}

export default class HomeTask extends Component {

  state = {
    ...initialState
  }

  componentDidMount = async () => {
    
    const stateString = await AsyncStorage.getItem('tasksState')
    const savedState = JSON.parse(stateString) || initialState
    this.setState({
      showDoneTasks: savedState.showDoneTasks
    }, this.filterTasks)

    this.loadTasks()

  }

  //carrega as tasks
  loadTasks = async () => {
      try {
        const maxDate = moment()
                        .add({ days: this.props.daysAhead })
                        .format('YYYY-MM-DD 23:59:59')
        const res     = await axios.get(`${server}/tasks/${maxDate}`)
        this.setState({ tasks: res.data }, this.filterTasks)
      } catch (e) {
        showError(e)
      }
  }

  toggleFilter = () => {
    this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTasks)
  }

  filterTasks = () => {
    let visibleTasks = null;
    if (this.state.showDoneTasks) {
      visibleTasks = [...this.state.tasks]
    } else {
      const pending = task => task.doneAt === null
      visibleTasks = this.state.tasks.filter(pending)
    }
    this.setState({visibleTasks})
    AsyncStorage.setItem('tasksState', JSON.stringify({
        showDoneTasks: this.state.showAddTask
    }))
  }

  toggleTask = async taskId => {

      try {

          await axios.put(`${server}/tasks/toggle/${taskId}`)
          this.loadTasks()

      } catch(e) {
        showError(e)
      }

  }

  AddTask = async newTask => {
    
    if (!newTask.desc || !newTask.desc.trim()) {
      Alert.alert('Dados inválidos', 'Descrição não informada')
      return 
    }

    try {

      await axios.post(`${server}/tasks/create`, {
        desc:       newTask.desc,
        estimateAt: newTask.date
      });

      

      this.setState({showAddTask: false}, this.loadTasks)

    } catch(e) {
      showError(e)
    }

  }

  deleteTask = async taskId => {

    try {

      await axios.delete(`${server}/tasks/delete/${taskId}`)
      this.loadTasks()

    } catch(e) {
      showError(e)
    }

  }

  getImage = () => {

    switch(this.props.daysAhead) {
      case 0: return todayImage
      case 1: return tomorrowImage
      case 7: return weekImage
      case 30: return monthImage
      defaullt: return monthImage
    }

  }

  getColor = () => {

    switch(this.props.daysAhead) {
      case 0: return commonStyles.colors.today
      case 1: return commonStyles.colors.tomorrw
      case 7: return commonStyles.colors.week
      case 30: return commonStyles.colors.month
      defaullt: return commonStyles.colors.month
    }
    
  }


  render() {

    const today = moment().locale('pt-br').format('ddd, D [de] MMMM')

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <AddTask 
          isVisible={this.state.showAddTask} 
          onCancel={() => this.setState({showAddTask: false})}
          onSave={this.AddTask}  />
        <ImageBackground source={this.getImage()} style={styles.background}>
          
            <TouchableOpacity style={styles.iconBar} onPress={this.toggleFilter}>

                <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                  <Ionicons name='ios-menu' 
                            size={30} 
                            color={commonStyles.colors.secondary} />
                </TouchableOpacity>

                <Ionicons 
                  name={this.state.showDoneTasks ? 'md-eye' : 'md-eye-off'}                   
                  size={30} 
                  color={commonStyles.colors.secondary} />
            
            </TouchableOpacity>
          
          <View style={styles.titleBar}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.subtitle}>{today}</Text>
          </View>
        </ImageBackground>
        <View style={styles.taskList}>
          <FlatList 
            data={this.state.visibleTasks}
            keyExtractor={item => `${item.id}`}
            renderItem={({item}) => <Task {...item} toggleTask={this.toggleTask} onDelete={this.deleteTask} />}
          />
        </View>   
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: this.getColor() }]}
          onPress={() => this.setState({showAddTask: true})}
          activeOpacity={0.7}>
          <Ionicons 
            name='md-add' 
            size={20} 
            color={commonStyles.colors.secondary} />
        </TouchableOpacity> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    flex: 3, //30% da tela
  },
  taskList: {
    flex: 7, //70% da tela
  },
  titleBar: {
    flex: 1, //quando eu coloco 1, estou dizendo que vou permitir que ele cresça dentro do escopo 
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 50,
    color: commonStyles.colors.secondary,
    marginLeft: 20,
    marginBottom: 20
  },
  subtitle: {
    fontSize: 20,
    color: commonStyles.colors.secondary,
    marginLeft: 20,
    marginBottom: 30
  },
  iconBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    justifyContent: 'space-between',
    // marginTop: Platform.OS === 'ios' ? 30 : 25,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  }

})