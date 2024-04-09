import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import PendingUsers from "./pending";

const Tab = createMaterialTopTabNavigator();

export default function UserManagementStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="PendingUsers"
        component={PendingUsers}
        options={{
          tabBarLabel: "     New          |          Active          |          Blocked",
        }}
      />
    </Tab.Navigator>
  );
}
