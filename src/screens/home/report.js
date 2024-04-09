import DateTimePickerModal from "react-native-modal-datetime-picker"
import { useFocusEffect } from "@react-navigation/native"
import { orderBy, where } from "firebase/firestore"

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native"
import React, { useMemo } from "react"

import useFirebase from "../../hooks/useFirebase"
import { useAuth } from "../../hooks/useAuth"
import { formatTimeFb } from "../../utils"
import { colors } from "../../constants"
import { Button } from "react-native-paper"
import Container from "../../components/container"
import Header from "../../components/header"

const ty = new Date().getDay()

export default function WeeklyReportScreen({ navigation, route }) {
  const { profile } = useAuth()
  const { getDocuments, updateDocument, addDocument2 } = useFirebase()

  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  useFocusEffect(
    React.useCallback(() => {
      getData()
      // getInData();
    }, [])
  )

  const getData = async () => {
    const today = new Date()
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()))
    const lastDay = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    )
    const month = firstDay.getMonth() + 1
    const year = firstDay.getFullYear()

    const res = await getDocuments("attendance", setLoading, [
      where("userId", "==", profile.id),
      where(
        "createdAt",
        ">=",
        new Date(`${year}-${month}-${firstDay.getDate()}`)
      ),
      where(
        "createdAt",
        "<=",
        new Date(`${year}-${month}-${lastDay.getDate()}`)
      ),
      orderBy("createdAt", "asc"),
    ])

    if (res?.error) return

    setData(res.data)
  }

  const average = useMemo(() => {
    let sum = 0
    data.forEach((item) => {
      if (!item.checkOut || !item.checkIn) return
      const diff = (item.checkOut.toDate() - item.checkIn.toDate()) / 3600000
      sum += diff
    })

    return {
      sum: sum,
      average: ty === 0 ? sum / 7 : sum / ty,
    }
  }, [data])

  const getInData = () => {
    const today = new Date()

    let firstDay = new Date(today.setDate(today.getDate() - today.getDay()))
    let fd = new Date(today.setDate(today.getDate() - today.getDay()))

    const initial = firstDay.getDate() + 1
    const last = firstDay.getDate() + 8

    let data = []
    for (let i = initial; i < last; i++) {
      let date = new Date(firstDay.setDate(i))

      data.push({
        checkIn: "",
        checkOut: "",
        checkouts: [],
        dayname: date.toLocaleDateString("en-US", { weekday: "long" }),
        date: date.toDateString(),
        createdAt: date,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        userId: profile.id,
        nw: true,
      })
    }

    return data
  }

  const newData = useMemo(() => {
    const dt = getInData()
    let newData = []

    dt.forEach((item) => {
      const found = data.find((d) => d.date === item.date)

      if (found) {
        newData.push(found)
      } else {
        newData.push(item)
      }
    })

    return newData
  }, [data])

  const approveStatus = useMemo(() => {
    const found = data.filter((d) => d.approved === true)
    return found.length === data.length
  }, [data])

  return (
    <Container>
      <Header title="Weekly Report" />
      <FlatList
        data={newData}
        keyExtractor={(item, index) => item.date}
        renderItem={({ item }) => {
          return (
            <Option
              // only show day name
              day={item?.dayname}
              checkin={formatTimeFb(item.checkIn)}
              checkout={formatTimeFb(item.checkOut)}
            />
          )
        }}
        ListFooterComponent={
          <View>
            <Text
              style={{
                marginTop: 10,
                fontWeight: "bold",
              }}
            >{`Average: ${average.average.toFixed(1)} hours per day`}</Text>
            <Text
              style={{
                marginTop: 10,
                fontWeight: "bold",
              }}
            >{`Total: ${average.sum.toFixed(1)} hours`}</Text>
            {approveStatus && (
              <Text
                style={{
                  marginTop: 10,
                  fontWeight: "bold",
                  color: colors.secondary,
                }}
              >
                Approved
              </Text>
            )}
          </View>
        }
      />
    </Container>
  )
}

const styles = StyleSheet.create({})

const Option = ({ day, checkin, checkout, onPress }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        borderBottomColor: "lightgrey",
        borderBottomWidth: 1,
        paddingBottom: 10,
      }}
    >
      <Cell value={day} ta="left" />
      <Cell value={checkin} link={true} onPress={() => onPress("checkIn")} />
      <Cell
        value={checkout}
        ta="right"
        br={0}
        link={true}
        onPress={() => onPress("checkOut")}
      />
    </View>
  )
}

const Cell = ({ value, ta = "center", br = 1, link, onPress, data }) => (
  <View
    style={{ flex: 1, borderRightColor: "lightgrey", borderRightWidth: br }}
  >
    <Text
      style={{
        fontWeight: "400",
        textAlign: ta,
        color: link ? colors.primary : colors.darkGrey,
      }}
    >
      {value}
    </Text>
  </View>
)
