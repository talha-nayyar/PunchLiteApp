import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import PendingUsers from "./pending";
import { screens } from "../../routes/screens";

const Tab = createMaterialTopTabNavigator();

export default function AbsenseManagementStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={screens.newRequests}
        component={PendingUsers}
        options={{
          tabBarLabel: "New1 ",
          tabBarLabel: "     New          |          Approved          |          Rejected"
        }}
      />
      
    </Tab.Navigator>
  );
}
