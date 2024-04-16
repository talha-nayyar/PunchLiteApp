import { orderBy, where } from "firebase/firestore"
import { useFocusEffect } from "@react-navigation/native"

import { FlatList, StyleSheet, View } from "react-native"
import React, { useState } from "react"

import useFirebase from "../../hooks/useFirebase"
import Container from "../../components/container"
import Header from "../../components/header"
import { useAuth } from "../../hooks"
import AbesenseCard from "./card"

export default function AbsenceHistory() {
  const { profile } = useAuth()
  const [requests, setRequests] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const { getDocuments } = useFirebase()

  useFocusEffect(
    React.useCallback(() => {
      getRequests()
    }, [])
  )

  const getRequests = async () => {

    const res = await getDocuments("absense", null, [
      where("userId", "==", profile.id),
      orderBy("createdAt", "desc"),
    ])
    if (res.status === 200) {
      setRequests(res.data)
    }

  }

  return (
    <Container>
      <Header title="Absence History" />

      <FlatList
        data={requests}
        renderItem={({ item }) => <AbesenseCard abesense={item} />}
        keyExtractor={(item) => item.id}
        ListFooterComponent={<View style={{ height: 100 }} />}
        refreshing={refreshing}
        onRefresh={getRequests}
      />
    </Container>
  )
}

const styles = StyleSheet.create({})
