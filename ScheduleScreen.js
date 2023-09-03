import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import Icons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Colors from "./assets/Colors";
import BottomSheet from "./components/BottomSheet";

const ScheduleScreen = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeDate, setActiveDate] = React.useState({});
  const Height = Dimensions.get("window").height;
  const [weekDates, setWeekDates] = React.useState([
    { name: "Monday", initial: "M", week: 1, content: [] },
    { name: "Tuesday", initial: "T", week: 2, content: [] },
    { name: "Wednesday", initial: "W", week: 3, content: [] },
    { name: "Thursday", initial: "Th", week: 4, content: [] },
    { name: "Friday", initial: "F", week: 5, content: [] },
    { name: "Saturday", initial: "Sa", week: 6, content: [] },
    { name: "Sunday", initial: "Su", week: 0, content: [] },
  ]);

  const modalRef = React.useRef(null);

  const setStorage = async () => {
    try {
      await AsyncStorage.setItem("WeekDates", JSON.stringify(weekDates));
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = () => {
    modalRef.current?.present();
  };

  const getItem = async () => {
    const data = await AsyncStorage.getItem("WeekDates");
    data !== null && setWeekDates(JSON.parse(data));
    setIsLoading(false);
  };

  const checkItems = async () => {
    const data = await AsyncStorage.getItem("Weekdates");
    console.log(weekDates, data);
  };

  const handleDelete = (item) => {
    const newDate = activeDate;
    const newContent = newDate.content.filter((data) => data !== item);
    newDate.content = newContent;

    const index = weekDates.findIndex((day) => day.name == activeDate.name);
    const newWeek = [...weekDates];
    newWeek[index] = newDate;
    setWeekDates(newWeek);

    setStorage();
  };

  React.useEffect(() => {
    getItem();
  }, []);

  React.useEffect(() => {
    setActiveDate(weekDates[0]);
  }, [isLoading]);

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{
          height: "100%",
          flex: 1,
        }}
        scrollEnabled={false}
        data={weekDates}
        renderItem={({ item, index }) => {
          return (
            <View
              style={[
                styles.dateTextContainer,
                {
                  height: Height / weekDates.length,
                },
              ]}
              key={index}
            >
              <TouchableOpacity
                onPress={() => {
                  setActiveDate(item);
                }}
              >
                <View
                  style={[
                    styles.initialContainer,
                    {
                      backgroundColor:
                        item.name == activeDate.name
                          ? Colors.accent
                          : Colors.background,
                    },
                  ]}
                >
                  <Text style={styles.dateText}>{item.initial}</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <View style={styles.dateContentContainer}>
        <Text
          style={{
            backgroundColor: Colors.secondary,
            padding: 5,
            paddingHorizontal: 10,
            borderRadius: 100,
          }}
          onPress={checkItems}
        >
          {activeDate.name}
        </Text>
        <FlatList
          contentContainerStyle={{ paddingBottom: 70 }}
          data={activeDate.content}
          renderItem={({ item, index }) => {
            return (
              <View>
                <View
                  style={{
                    marginTop: 10,
                    width: "73%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <Text style={{ fontSize: 15, color: Colors.secondary }}>
                    EDIT
                  </Text>
                  <Icons
                    onPress={() => handleDelete(item)}
                    name="trash-outline"
                    size={20}
                    color={Colors.secondary}
                  />
                </View>
                <View key={index} style={styles.scheduleContent}>
                  <View style={styles.timeContainer}>
                    <Text
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                        color: Colors.background,
                        fontSize: 20,
                        fontWeight: "bold",
                        marginBottom: 20,
                      }}
                    >
                      {item.from}
                    </Text>
                    <Text
                      style={{
                        fontSize: 40,
                        color: Colors.background,
                        transform: [{ rotate: "90deg" }],
                      }}
                    >
                      {" "}
                      - - - -{" "}
                    </Text>
                    <Text
                      style={{
                        color: Colors.background,
                        fontSize: 20,
                        fontWeight: "bold",
                        marginTop: 20,
                      }}
                    >
                      {item.to}
                    </Text>
                  </View>

                  <View style={styles.subjectContainer}>
                    <Text
                      style={{
                        fontSize: 40,
                        fontWeight: "100",
                        color: Colors.primary,
                        paddingBottom: 0,
                      }}
                    >
                      {item.subject}
                    </Text>
                    <Text style={{ color: Colors.primary, paddingTop: 0 }}>
                      {item.code}
                    </Text>
                    <Text style={{ marginTop: 15, color: Colors.primary }}>
                      {item.reminder ? item.reminder : "No reminder set"}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.7}
          onPress={() => openModal()}
        >
          <Text
            style={{
              fontSize: 25,
              color: Colors.background,
            }}
          >
            Create Schedule
          </Text>
          <Icons
            name="add-circle-outline"
            color={Colors.background}
            size={30}
          />
        </TouchableOpacity>
      </View>
      <BottomSheet
        modalRef={modalRef}
        activeDate={activeDate}
        weekDates={weekDates}
        setWeekDates={setWeekDates}
        setActiveDate={setActiveDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    flexDirection: "row",
    paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 15,
  },
  dateTextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  initialContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 65,
    width: 65,
    borderWidth: 2,
    borderColor: Colors.text,
    borderRadius: 100,
  },
  dateText: {
    color: Colors.text,
    fontSize: 25,
    fontWeight: "700",
  },
  dateContentContainer: {
    paddingLeft: 20,
    paddingVertical: 20,
    alignItems: "flex-start",
    flex: 4,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    marginLeft: 10,
    height: "100%",
    width: "100%",
    elevation: 5,
  },
  addButton: {
    position: "absolute",
    bottom: 15,
    right: 0,
    backgroundColor: Colors.accent,
    width: "100%",
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    elevation: 10,
  },
  scheduleContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderBottomWidth: 3,
    borderBottomColor: Colors.accent,
    paddingVertical: 10,
  },
  timeContainer: {},
  subjectContainer: {
    padding: 20,
    backgroundColor: Colors.secondary,
    height: "100%",
    width: "100%",
    borderRadius: 20,
    marginLeft: 20,
    elevation: 10,
  },
});

export default ScheduleScreen;
