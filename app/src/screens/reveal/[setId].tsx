import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Animated, StyleSheet } from "react-native";

// Reveal sequence with suspense timing on last card (card 10)
const CARD_SPACING = 72; // Distance between cards in reveal view

interface RevealedCard {
  setId: string;
  name: string;
  art: string;
  rarity: 'common'|'uncommon'|'rare'|'mythic';
}

export default function Reveal({ packId, onComplete }: { packId:string; onComplete:(binderIds:number[]) => void }) {
  const [revealedCards, setRevealedCards] = useState<RevealedCard[]>([]);
  const cardStackAnimations = Array(10).fill(null).map((_, i) => new Animated.Value(i === 9 ? 8 : -CARD_SPACING));

  // Suspense shake animation for last card before reveal
  const shakeAnimation = new Animated.Value(0);
  const shakeDuration = 500; // 0.5 seconds for suspense shake

  // Simulated deterministic draw - in production this would use provably-fair randomness
  const generateFixedPacks = () => [
    { setId: "pbl-001", name: "Charizard Base", art: require("@/assets/cards/pbl.webp"), rarity:"mythic" },
    { setId: "pfl-002", name: "Eevee Common", art: require("@/assets/cards/pfl.webp"), rarity:"common" },
  ];

  const revealCards = async () => {
    // Staggered card entry animations with suspense shake on last card
    const cards = generateFixedPacks().slice(0, revealedCards.length);
    
    Animated.stagger(100, cardStackAnimations.map((anim) => 
      Animated.timing(anim, { toValue: 8, duration: 300, useNativeDriver: true }) // Slower for suspense
    )).start();
  };

  const handleShake = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: shakeDuration, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: shakeDuration, useNativeDriver: true })
      ])
    ).start();
  };

  return (
    <View style={styles.container}>
      {/* Card stack reveal */}
      <FlatList 
        inverted
        data={Array(10).fill(null)}
        renderItem={({item, index}) => (
          <Animated.View 
            style={[
              styles.cardPosition,
              { transform: [{translateY: cardStackAnimations[index]}], opacity: index < revealedCards.length ? 1 : 0 }
            ]}
          >            
            {/* Card 10 gets suspense shake before entry */}
            <View style={index === 9 && !revealedCards.includes("last") ? styles.suspenseCard : {}}>              
              {(index === 9) ? (
                <>
                  {/* Shake animation on last card */}
                  <Animated.View style={[styles.card, { transform: [{translateX: shakeAnimation}] }]} >
                    <Text style={styles.cardArt}>🃏</Text>
                  </Animated.View>
                </>              
              ) : (
                styles.suspenseCard = index === 9 ? styles.suspenseCard : {}
              )}
            </View>
          </Animated.View>
        )}
      />

    </View>
  );
}

// Styles for suspense timing and card reveal
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0a0f18',
    paddingHorizontal: 32,  
    paddingTop: 48      
  },
  cardPosition: { marginVertical: CARD_SPACING, marginBottom: -16 },
  suspenseCard: { transform: [{ translateY: 0 }] } as const,
  card: { width:"70%", height:320, backgroundColor:'#1e293b', borderRadius: 12 ,marginLeft:16,marginRight:16,borderWidth:4,borderColor:#fff },
  cardArt: { color:'#818cf8', fontSize: 60 },
});
