import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import background from "../../components/background";
import styles from "./style";
import client from "../../services/new_client";
import GradientButton from "../../components/GradientButton";

export let interval;

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: this.props.navigation.getParam("owner_id", "NO-ID"),
      user_message: "",
      messagesList: [],
    };
  }

  promisedSetState = (newState) => {
    return new Promise((resolve) => {
      this.setState(newState, () => {
        resolve();
      });
    });
  };

  async createChat() {
    const { navigation } = this.props;
    const trade_id = navigation.getParam("trade_id", "NO-ID");
    await client.get("/trade/chat/create/" + trade_id);
  }

  async sendMessage() {
    const { navigation } = this.props;
    const trade_id = navigation.getParam("trade_id", "NO-ID");
    await client.post("/user/chat/messages/send", {
      trade_id: trade_id,
      body: this.state.user_message,
    });
    await this.getMessagesList();
    this.promisedSetState({ user_message: "" });
  }

  async getMessagesList() {
    const { navigation } = this.props;
    const trade_id = navigation.getParam("trade_id", "NO-ID");
    const trader_id = navigation.getParam("owner_id", "NO-ID");
    let { data: messagesList } = await client.get(
      "/user/chat/messages/" + trade_id + "/" + trader_id
    );
    this.setState({ messagesList });
  }

  async componentDidMount() {
    this.createChat();
    this.getMessagesList();

    interval = setInterval(() => {
      this.getMessagesList();
    }, 3000);
    this.props.navigation.addListener("didBlur", ({ action }) => {
      clearInterval(interval);
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {background()}
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: "transparent" }}
          behavior={Platform.OS === "ios" ? "padding" : null}
          enabled
        >
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity onPress={(_) => this.props.navigation.goBack()}>
              <Image
                source={require("../../assets/backIcon.png")}
                style={{
                  resizeMode: "contain",
                  bottom: "25%",
                  marginLeft: 10,
                  height: 30,
                  width: 30,
                  marginTop: 30,
                }}
              />
            </TouchableOpacity>
            <Image
              source={require("../../assets/header-logo.png")}
              style={{
                bottom: "3.5%",
                height: 50,
                width: 150,
                marginTop: 30,
                marginLeft: "18%",
                justifyContent: "center",
              }}
            />
          </View>

          <View style={{ flex: 8 }}>
            <View style={{ flex: 1.5 }}>
              <ScrollView
                horizontal={false}
                style={{ flex: 2.9, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                ref={(ref) => {
                  this.scrollView = ref;
                }}
                onContentSizeChange={() =>
                  this.scrollView.scrollToEnd({ animated: true })
                }
              >
                {this.state.messagesList.map((item, index) =>
                  this.state.user_id == item.owner_user_id ? (
                    <View
                      style={{
                        justifyContent: "center",
                        alignSelf: "flex-start",
                        backgroundColor: "rgba(109,118,247, 0.2)",
                        margin: 10,
                        borderRadius: 15,
                      }}
                      key={index}
                    >
                      <Text
                        style={{
                          borderTopRightRadius: 7,
                          borderBottomRightRadius: 7,
                          padding: 10,
                          fontSize: 15,
                          color: "white",
                          textAlign: "center",
                          marginEnd: 5,
                        }}
                      >
                        {item.body}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        justifyContent: "center",
                        alignSelf: "flex-end",
                        backgroundColor: "rgba(109,118,247, 0.5)",
                        margin: 10,
                        borderRadius: 15,
                      }}
                      key={index}
                    >
                      <Text
                        style={{
                          borderTopLeftRadius: 7,
                          borderBottomLeftRadius: 7,
                          padding: 10,
                          fontSize: 15,
                          color: "white",
                          textAlign: "center",
                          marginStart: 5,
                        }}
                      >
                        {item.body}
                      </Text>
                    </View>
                  )
                )}
              </ScrollView>
            </View>
          </View>
          <View style={{ flex: 2, flexDirection: "row", margin: 5 }}>
            <View style={{ flex: 10, padding: 1 }}>
              <TextInput
                style={{
                  width: "100%",
                  height: "100%",
                  padding: 5,
                  borderColor: "rgba(242, 241, 239, 1)",
                  borderWidth: 2,
                  justifyContent: "flex-start",
                  backgroundColor: "#12131b",
                  color: "#ededed",
                }}
                underlineColorAndroid="transparent"
                placeholderTextColor="#ededed"
                multiline={true}
                onChangeText={(user_message) => this.setState({ user_message })}
                value={this.state.user_message}
              />
            </View>
            <View style={{ flex: 2 }}>
              <GradientButton
                style={{ width: "100%", height: "100%", padding: 5 }}
                textStyle={{ fontSize: 18 }}
                gradientBegin="#6d76f7"
                gradientEnd="#444b9c"
                gradientDirection="diagonal"
                radius={13}
                impact
                impactStyle="Light"
                text="Send"
                onPressAction={(_) => this.sendMessage()}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
