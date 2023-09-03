import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import Colors from "../assets/Colors";
import Icons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BottomSheet = ({
  modalRef,
  activeDate,
  weekDates,
  setWeekDates,
  setActiveDate,
}) => {
  const [kbVisible, setKbVisible] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [selectedTimeMode, setSelectedTimeMode] = React.useState("from");
  const [timeFrom, setTimeFrom] = React.useState({
    displayText: "12:00 am",
    time: null,
  });
  const [timeTo, setTimeTo] = React.useState({
    displayText: "12:00 pm",
    time: null,
  });
  const [subject, setSubject] = React.useState("");
  const [subCode, setSubCode] = React.useState("");
  const [reminder, setReminder] = React.useState();
  const [addReminder, setAddReminder] = React.useState({
    value: false,
    icon: "square-outline",
    color: Colors.primary,
  });

  const setStorage = async () => {
    try {
      await AsyncStorage.setItem("WeekDates", JSON.stringify(weekDates));
    } catch (error) {
      console.log("Error sa setItem: ", error);
    }
  };

  const handleAddReminder = () => {
    addReminder.value == false
      ? setAddReminder({ value: true, icon: "checkbox", color: Colors.accent })
      : setAddReminder({
          value: false,
          icon: "square-outline",
          color: Colors.primary,
        });
  };

  const handleSubmit = () => {
    if (subject != "") {
      const data = {
        from: timeFrom.displayText,
        to: timeTo.displayText,
        subject: subject,
        code: subCode,
        reminder: reminder ? addReminder : null,
        timeStart: timeFrom.time,
        timeEnd: timeTo.time,
      };
      let activeDateCopy = activeDate;
      activeDateCopy.content.push(data);
      activeDateCopy.content.sort((a, b) => {
        return a.timeStart - b.timeStart;
      });
      setActiveDate(activeDateCopy);

      const index = weekDates.findIndex((day) => day.name == activeDate.name);
      const updatedWeeks = [...weekDates];

      updatedWeeks[index] = activeDate;
      setWeekDates(updatedWeeks);
      console.log(JSON.stringify(weekDates));
      setStorage();

      setSubCode("");
      setSubject("");
      setReminder(null);

      modalRef.current?.dismiss();
    } else {
      console.log("SUBJECT AND SUJECT CODE CANNOT BE EMPTY");
    }
  };

  const clearActiveDate = () => {
    let tempDate = activeDate;
    let newDate = { ...tempDate, content: [] };
    console.log(activeDate);
  };

  const handleShowTime = (timeMode) => {
    setDate(new Date());
    if (timeMode == "from") {
      setSelectedTimeMode("from");
    } else if (timeMode == "to") {
      setSelectedTimeMode("to");
    }

    setShowTimePicker(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowTimePicker(Platform.OS === "ios");
    setDate(currentDate);

    const currentHrs =
      JSON.stringify(currentDate.getHours()) == 0
        ? "12"
        : JSON.stringify(currentDate.getHours());
    const currentMin = JSON.stringify(currentDate.getMinutes());
    const hrs = currentHrs > 12 ? JSON.stringify(currentHrs - 12) : currentHrs;
    const timeText = `${hrs.length == 1 ? "0" + hrs : hrs}:${
      currentMin.length == 1 ? "0" + currentMin : currentMin
    } ${currentHrs > 11.99 ? "pm" : "am"}`;
    selectedTimeMode == "from"
      ? setTimeFrom({
          time: currentDate.getTime(),
          displayText: timeText,
        })
      : setTimeTo({
          time: currentDate.getTime(),
          displayText: timeText,
        });
    console.log(currentHrs);
  };

  React.useEffect(() => {
    const kbShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKbVisible(true);
    });
    const kbHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKbVisible(false);
    });

    return () => {
      kbShowListener.remove();
      kbHideListener.remove();
    };
  }, []);

  return (
    <BottomSheetModalProvider>
      <View>
        <BottomSheetModal
          ref={modalRef}
          index={0}
          snapPoints={[!kbVisible ? "45%" : "90%"]}
          backgroundStyle={{ backgroundColor: Colors.secondary }}
          backdropComponent={() => (
            <View
              style={{
                position: "absolute",
                backgroundColor: "gray",
                opacity: 0.2,
                height: "100%",
                width: "100%",
              }}
            />
          )}
        >
          <View style={styles.container}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  color: Colors.secondary,
                  fontWeight: "bold",
                  fontSize: 20,
                  borderRadius: 100,
                  paddingHorizontal: 20,
                  backgroundColor: Colors.primary,
                  paddingVertical: 5,
                }}
                onPress={clearActiveDate}
              >
                {activeDate.name}
              </Text>
              <Text
                onPress={handleSubmit}
                style={{
                  color: Colors.accent,
                  fontSize: 20,
                  alignSelf: "center",
                }}
              >
                Submit
              </Text>
            </View>
            <View style={styles.timeContainer}>
              <View style={styles.timeBtnContainer}>
                <Text
                  style={{
                    fontSize: 20,
                    color: Colors.primary,
                    fontWeight: "800",
                  }}
                >
                  FROM:{" "}
                </Text>
                <TouchableOpacity
                  style={styles.timeBtn}
                  onPress={() => handleShowTime("from")}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color: Colors.primary,
                      fontWeight: "800",
                    }}
                  >
                    <Icons
                      name="time-outline"
                      size={20}
                      color={Colors.primary}
                    />
                    {timeFrom.displayText}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 20,
                    color: Colors.primary,
                    fontWeight: "800",
                  }}
                >
                  TO:
                </Text>
                <TouchableOpacity
                  style={styles.timeBtn}
                  onPress={() => handleShowTime("to")}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color: Colors.primary,
                      fontWeight: "800",
                    }}
                  >
                    <Icons
                      name="time-outline"
                      size={20}
                      color={Colors.primary}
                    />
                    {timeTo.displayText}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.textInputContainer}>
                <Text
                  style={{
                    fontSize: 20,
                    color: Colors.primary,
                    fontWeight: "800",
                  }}
                >
                  SUBJECT NAME:
                </Text>
                <TextInput
                  onChangeText={(text) => setSubject(text)}
                  style={styles.textInput}
                  placeholder="Subject Name"
                />
                <Text
                  style={{
                    fontSize: 20,
                    color: Colors.primary,
                    fontWeight: "800",
                    marginTop: 10,
                  }}
                >
                  SUBJECT CODE:
                </Text>
                <TextInput
                  onChangeText={(text) => setSubCode(text)}
                  style={styles.textInput}
                  placeholder="Subject Code"
                />
              </View>
              {/* <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Icons
                name={addReminder.icon}
                size={30}
                color={addReminder.color}
                onPress={() => handleAddReminder()}
              />
              <Text style={{ color: Colors.primary }}>Add a reminder?</Text>
            </View> */}
            </View>
            {addReminder.value && (
              <View style={styles.reminder}>
                <Text>REMINDER SCREEN</Text>
              </View>
            )}
          </View>
        </BottomSheetModal>
      </View>
      {showTimePicker && (
        <DateTimePicker
          minuteInterval={15}
          accentColor={Colors.accent}
          value={date}
          is24Hour={false}
          testID="DateTimePicker"
          mode="time"
          display="spinner"
          onChange={onChange}
        />
      )}
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  textInputContainer: {
    flex: 4,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 20,
    marginVertical: 10,
    marginHorizontal: 5,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  textInput: {
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: 10,
    fontSize: 20,
    borderRadius: 15,
    paddingHorizontal: 30,
    color: Colors.primary,
    backgroundColor: Colors.secondary,
    elevation: 5,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    borderColor: "white",
    rowGap: 40,
    marginTop: 10,
  },
  timeText: {
    fontSize: 20,
    borderRadius: 10,
    backgroundColor: Colors.text,
    padding: 10,
    fontWeight: "800",
    color: Colors.text,
  },
  timeTextContainer: {
    alignItems: "center",
    borderColor: Colors.accent,
    borderWidth: 2,
  },
  timeBtnContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    marginVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  timeBtn: {
    borderColor: Colors.primary,
    borderWidth: 2,
    borderRadius: 15,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.secondary,
    elevation: 5,
  },
  reminder: {
    height: "40%",
    width: "100%",
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: Colors.primary,
    opacity: 0.6,
    borderRadius: 40,
  },
});

export default BottomSheet;
