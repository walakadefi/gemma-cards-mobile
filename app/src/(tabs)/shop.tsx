import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Animated, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const PackCard:React.FC<{ pack:any; onOpen:(setId:string) => void }> = ({ pack, onOpen }) => {
  const [isTearing, setIsTearing] = useState(false);
  const tearProgress = new Animated.Value(0);

  const startTear = (event) => {
    if(event.nativeEvent.locationY < window.innerHeight * 0.2 && Math.abs(event.nativeEvent.velocityX) > 100) {
      setIsTearing(true);
      onOpen(pack.id);
    }
  };

  return (
    <View style={[styles.card, { opacity: isTearing ? 0 : 1 }]}>
      <ImageBackground source={pack.image} style={styles.cardImage}>
        <Text style={styles.packName}>{pack.name}</Text>
        
        {/* Tear strip visual representation */}
        <Animated.View 
          style={[styles.tearStrip, { height: tearProgress.interpolate({ inputRange:[0,1], outputRange:[0,20] }) }]}
        />
      </ImageBackground>
      
      <View style={styles.cardFooter}>
        <Text style={styles.price}>{pack.price}</Text>
        <TouchableOpacity onPress={() => onOpen(pack.id)}>
          <Ionicons name="open-outline" size={12} color="#fff"/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function Shop() {
  const packs = [
    { id: "pbl", name: "Pitch Black", price: "$9.99", image: require("@/assets/packs/pbl.webp") },
    { id: "asc", name: "Ascending", price: "$7.99", image: require("@/assets/packs/asc.webp") },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌐 Card Packs</Text>
        
        {/* Navigation with Ionicons */}
        <Ionicons name="store" size={24} color="#6366f1"/>
      </View>

      <Text style={styles.subtitle}>Select a pack to open:</Text>
      
      {packs.map(pack => (
        <PackCard 
          key={pack.id} 
          pack={pack}
          onOpen={(setId) => require("./reveal/[setId].tsx")(setId)} 
        />
      ))}

      {/* Trust & legal disclosures */}
      <View style={styles.discovery}>
        <Text style={styles.disclaimer}>🎲 Every draw is verifiable · 18+ only · Not affiliated with publishers</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#0a0f18" },
  header: { flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  title: { fontSize: 28, color:"#fff", fontWeight:"bold" },
  subtitle: { color:"#94a3b8", marginBottom: 24 },
  card: { width:"100%", height: 320, borderRadius: 16, overflow: "hidden", marginBottom: 20, backgroundColor: "#1e293b" },
  cardImage: { position: "relative"},
  cardFooter: { 
    flexDirection:"row", justifyContent:"space-between", padding: 8, alignItems: "center", borderTopWidth: 1, borderTopColor: '#374151' 
  },
  packName: { color: "#9ca3af", fontSize: 16, fontWeight:"bold" },
  price: { fontSize: 20, color:"#86efac" },
  discovery: { backgroundColor: "#1e1e1e", padding: 12, borderRadius: 8, marginTop: 16, marginLeft: 4, marginRight: 4 },
  disclaimer: { color: '#6b7280', textAlign: "center", fontSize: 14 }
});
