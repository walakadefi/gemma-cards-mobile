import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

// Shop with pack artwork URLs (using public Gemma CDN links or placeholders)
interface PackData {
  id: string;
  name: string;
  price: number;
  image: string; // Use public URL instead of require() for web export
}

const packs:PackData[] = [
  { id: "pbl", name: "Pitch Black", price:9.99, image:"https://www.gemma.cards/cards/packs/pbl.webp" },
  { id: "asc", name: "Ascending", price:7.99, image:"https://www.gemma.cards/cards/packs/asc.webp" },
];

const PackCard = ({ pack }: { pack:PackData }) => (
  <TouchableOpacity 
    onPress={() => alert(`Opening ${pack.name} - in production this routes to reveal screen`)}
    style={[styles.card, { borderBottomColor:`var(--accent)`,borderBottomWidth:2}]}>
    
    {/* Use public URL for web deployment */}
    <img src={pack.image} alt={`${pack.name} pack art`} style={styles.packImage}/>
    
    <View style={styles.cardFooter}>
      <Text style={styles.price}>{pack.price}</Text>
    </View>
  </TouchableOpacity>
);

export default function Shop() {
  return (
    <ScrollView contentContainerStyle={StyleSheet.absoluteFill} >   
      {/* Pack cards */}
      
    </ScrollView>
  );
}
