import {StyledPageView, StyledView} from '@/components';
import useLiveChefs from '@/store/useLiveChefs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';
import LiveChefCard from './components/LiveChefCard';

type LiveChefsPropsType = NativeStackScreenProps<
  RootStackParamList,
  'customer_live_chefs'
>;

const LiveChefs = ({navigation, route}: LiveChefsPropsType) => {
  const {liveChefs} = useLiveChefs();
  return (
    <StyledPageView
      title={'Live Chefs'}
      navigation={navigation}
      route={route}
      header
      twScrollView={'justify-start px-1'}>
      <StyledView tw="flex-row flex-wrap justify-evenly">
        {liveChefs.map(item => (
          <LiveChefCard {...item} cardView />
        ))}
      </StyledView>
    </StyledPageView>
  );
};

export default LiveChefs;
