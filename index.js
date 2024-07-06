/**
 * @format
 */

import { handleBackgroundMessage } from '@/utils/notification';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import App from './App';

messaging().setBackgroundMessageHandler(handleBackgroundMessage);
AppRegistry.registerComponent('cookbookd', () => App);
