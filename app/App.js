import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Modal, View, Button } from 'react-native';
import AppNavigator from './src/screens/MainScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';
import LoginForm from './src/components/forms/LoginForm'; // LoginForm 임포트

const Stack = createStackNavigator();

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true); // 모달 열기
  const closeModal = () => setModalVisible(false); // 모달 닫기

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {/* 네비게이터 */}
      <NavigationContainer>
        <Stack.Navigator screenOptions = {{headerShown : false}}>
        <Stack.Screen name="MainScreen">
            {() => <AppNavigator onLoginPress={openModal} />}
          </Stack.Screen>
          <Stack.Screen name="LoginForm" component={LoginForm} />
        </Stack.Navigator>
      </NavigationContainer>

      {/* 로그인 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <NavigationContainer independent={true}>
              <LoginForm />
            </NavigationContainer>
            <Button title="닫기" onPress={closeModal} color="red" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF9F8',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
});
