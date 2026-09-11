import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Platform, Animated } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface PackCardProps {
  pack: { id: string; setId: string };
}

export default function Binder() {
  return (
    <View>
      {/* Empty state art */}
      {collectedCards.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="albums-outline" size={64} color="#9ca3af"/>
          <Text>Complete your collection in the binder!</Text>
        </View>
      )}
      
      {/* Card collection */}
      <FlatList {...} />
    </View>
  );
}
