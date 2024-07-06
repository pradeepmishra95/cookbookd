import {StyledButton, StyledText, StyledView} from '@/components';
import {useTheme} from '@rneui/themed';
import {useMemo} from 'react';
import {Dimensions, FlatList} from 'react-native';
import {Route, TabBar, TabView, TabViewProps} from 'react-native-tab-view';
import {SelectOptions} from './Select';

type TopMenuBarPropsCommon = {
  cuisines: SelectOptions[];
  selectedCuisine: string;
  setSelectedCuisine: (cuisine: string) => void;
};

type TopMenuBarPropsWithCategory = {
  showCategories: true;
  categories: SelectOptions[];
  selectedCategory: number;
  setSelectedCategory: (index: number) => void;
  renderPage: TabViewProps<Route>['renderScene'];
};

type TopMenuBarPropsWithoutCategory = {
  showCategories?: false;
  categories?: never;
  selectedCategory?: never;
  setSelectedCategory?: never;
  renderPage?: never;
};
type TopMenuBarPropsType = TopMenuBarPropsCommon &
  (TopMenuBarPropsWithCategory | TopMenuBarPropsWithoutCategory);

const TopMenuBar = ({
  showCategories,
  cuisines,
  selectedCuisine,
  categories,
  selectedCategory,
  setSelectedCategory,
  setSelectedCuisine,
  renderPage,
}: TopMenuBarPropsType) => {
  const {theme} = useTheme();

  const routes = useMemo(
    () =>
      categories
        ? categories.map(item => ({key: item.key, title: item.label}))
        : [],
    [categories],
  );
  const layout = Dimensions.get('screen');
  return (
    <>
      <FlatList
        tw="flex-none"
        horizontal
        data={cuisines}
        ItemSeparatorComponent={() => {
          return <StyledView tw="p-2" />;
        }}
        renderItem={({item}) => {
          return (
            <StyledButton
              titleStyle={{
                fontSize: 14,
                fontFamily: 'Manrope-SemiBold', // 600
                fontWeight: '600',
                color:
                  selectedCuisine !== item.value ? theme.colors.black : 'white',
              }}
              // twTitle={selectedCuisine !== item.value ? 'text-white' : ''}
              buttonStyle={[
                selectedCuisine !== item.value
                  ? {borderColor: theme.colors.black}
                  : {},
              ]}
              onPress={() => setSelectedCuisine(item.value)}
              type={selectedCuisine === item.value ? 'solid' : 'outline'}
              title={item.label}
            />
          );
        }}
      />
      {showCategories && (
        <StyledView tw="flex-1">
          {routes.length > 0 ? (
            <TabView
              navigationState={{index: selectedCategory, routes}}
              sceneContainerStyle={{height: '100%'}}
              renderScene={renderPage}
              onIndexChange={setSelectedCategory}
              renderTabBar={props => (
                <TabBar
                  {...props}
                  scrollEnabled
                  tabStyle={{width: 'auto'}}
                  indicatorStyle={{
                    backgroundColor: theme.colors.primary,
                  }}
                  style={{
                    backgroundColor: theme.colors.background,
                  }}
                  indicatorContainerStyle={{
                    borderBottomColor: theme.colors.grey0,
                  }}
                  renderLabel={({route, focused, color}) => (
                    <StyledText
                      numberOfLines={1}
                      style={{
                        color: focused
                          ? theme.colors.primary
                          : theme.colors.black,
                        marginVertical: 0,
                      }}>
                      {route.title}
                    </StyledText>
                  )}
                />
              )}
              initialLayout={{width: layout.width}}
            />
          ) : (
            <></>
          )}
        </StyledView>
      )}
    </>
  );
};

export default TopMenuBar;
