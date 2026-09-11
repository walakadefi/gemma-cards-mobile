import React, { useState, useEffect } from "react";
import { View, Text, Animated, StyleSheet, ImageBackground } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface RevealProps {
  setId: string; // Set ID (pbl, asc, op16, etc.)  
}

export default function Reveal({setId}:RevealProps) {
  const [cardNumber, setCardNumber] = useState(0);
  const shakeAnim = new Animated.Value(0);

  useEffect(() => {
    // Card 10 suspense: shake for 500ms before reveal
    if(cardNumber ===9){
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, {duration:50,startDelay:0,toValue:10}, useNativeDriver:true ),