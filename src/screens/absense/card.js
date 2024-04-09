import { useNavigation } from "@react-navigation/native";

import { StyleSheet, View, Text, Alert } from "react-native";
import React from "react";

import { colors } from "../../constants/colors";
import { formatDate } from "../../utils";
import { Button } from "react-native-paper";

export default function AbesenseCard({ abesense = {}, updateStatus }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={{ fontSize: 14, marginBottom: 5, fontWeight: "bold" }}>
          {abesense?.name}
        </Text>
        <Text style={{ fontSize: 13, marginBottom: 5 }}>{abesense?.email}</Text>
        <Text
          style={{ fontSize: 15, marginBottom: 5, color: colors.secondary }}
        >
          {formatDate(abesense?.startDate)}
          {abesense?.endDate && ` - ${formatDate(abesense?.endDate)}`}
        </Text>
      </View>
      {abesense?.status === "pending" && (
        <Text style={[{ color: colors.info }]}>Pending Approval</Text>
      )}
      {abesense?.status === "approved" && (
        <Text style={[{ color: colors.success }]}>Approved</Text>
      )}
      {abesense?.status === "rejected" && (
        <Text style={[{ color: colors.danger }]}>Rejected</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  ticket: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 10,
    margin: 10,
    position: "relative",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  semiCircle1: {
    overflow: "hidden",
    width: 8,
    height: 12,
    position: "absolute",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    borderLeftWidth: 0,
    backgroundColor: "#fff",
    zIndex: 10,
    left: -1,
    bottom: 7,
  },
  semiCircle2: {
    overflow: "hidden",
    width: 8,
    height: 12,
    position: "absolute",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRightWidth: 0,
    backgroundColor: "#fff",
    zIndex: 10,
    right: -1,
    bottom: 7,
  },
});
