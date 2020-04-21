import React from "react";
import SideMenu from "./SideMenu";
import { Image } from "react-native";

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createBottomTabNavigator } from "react-navigation-tabs";

import BookDetail from "./BookDetailScreen/BookDetail";
import Chat from "./ChatScreen/Chat";
import CreateTrade from "./CreateTradeScreen/CreateTrade";
import Home from "./HomeScreen/Home";
import Login from "./LoginScreen/Login";
import Message from "./MessageScreen/Message";
import Profile from "./ProfileScreen/Profile";
import Search from "./SearchScreen/Search";
import TraderDetail from "./TraderDetailScreen/TraderDetail";
import Trade from "./TradeScreen/Trade";


const Tabs = createBottomTabNavigator(
  {
    Transaction: {
      screen: Trade,
      navigationOptions: {
        tabBarLabel: "Trades",
        tabBarIcon: () => (
          <Image
            source={require("../assets/transaction-tab.png")}
            style={{ width: 22, height: 20 }}
          />
        )
      }
    },
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: () => (
          <Image
            source={require("../assets/home-tab.png")}
            style={{ width: 20, height: 20 }}
          />
        )
      }
    },
    Receive: {
      screen: Message,
      navigationOptions: {
        tabBarLabel: "Messages",
        tabBarIcon: () => (
          <Image
            source={require("../assets/message-tab.png")}
            style={{ resizeMode:"contain",width: 25, height: 25 }}
          />
        )
      }
    }
  },
  {
    initialRouteName: "Home",
    tabBarOptions: {
      activeBackgroundColor: "#1f2349",
      inactiveBackgroundColor: "#090a0f",
      showLabel: false,
      style: {
        backgroundColor: "#1f1f1f",
        borderTopColor: "transparent"
      },
      indicatorStyle: {
        backgroundColor: "#000"
      }
    }
  }
);

const DrawerNavigator = createDrawerNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        drawerLockMode: "locked-closed"
      }
    },
    Home: {
      screen: Tabs
    }
  },
  {
    contentComponent: SideMenu,
    drawerWidth: "55%"
  }
);

const StackNavigator = createAppContainer(
  createStackNavigator(
    {
      Login: DrawerNavigator,
      Home: {
        screen: Home,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      BookDetail: {
        screen: BookDetail
      },
      Chat: {
        screen: Chat
      },
      CreateTrade: {
        screen: CreateTrade
      },
      Message: {
        screen: Message
      },
      Profile: {
        screen: Profile
      },
      Search: {
        screen: Search
      },
      TraderDetail: {
        screen: TraderDetail
      },
      Trade: {
        screen: Trade
      }
    },
    {
      headerMode: "none"
    }
  )
);

export default StackNavigator;
