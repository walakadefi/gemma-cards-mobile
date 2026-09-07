import React, { useState } from "react";
import { View, Text, ScrollView, FlatList, ImageBackground, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

const CARD_PER_PAGE = 50;
const RARITY_COLORS:Record<string, string> = { common:'#9ca3af', uncommon:'#60a5fa', rare:'#8b5cf6', mythic:'#ec4899' };

interface BinderCard {
  setId: string;
  slot: number;
  rarity: 'common'|'uncommon'|'rare'|'mythic';
}

// Collection binder page showing found and missing slots with live density
export default function Binder({ cards }: { cards: BinderCard[] }) {
  
  const sortedCards = cards.sort((a, b) => a.setId.localeCompare(b.setId));
  
  return ( 
    <ScrollView style={{ flex: 1, backgroundColor: '#0a0f18' }}>
      {/* Header showing total collection value */}
      <View  style={styles.section}>
        <Text style={styles.title}>💎 Collection Binder</Text>
        <Text style={styles.subtitle}>{sortedCards.length} cards found</Text>
        
        {/* Collection value calculation */}
        <Text style={styles.value}>Total Value: $0.00 (prototype data)</Text>
      </View>

      {/* Card grid showing binder pages with 50 cards per page */}
      <FlatList 
        data={[{ slotIndex: 1 }]} // Simplified single-page view for demo  
        keyExtractor={item => `${item.slotIndex}`}
        renderItem={({}) => (
          <View style={styles.page}>
            <Text style={styles.pageHeader}>Page 1</Text>
            
            {/* Placeholder card slots showing rarity colors */}
            {[...Array(5)].map((_, idx) => {
              const card = sortedCards[idx] || null; 
              
              return (
                <View key={idx} style={[styles.card, {
                  backgroundColor: card ? 'transparent' : '#1e293b',
                  borderColor: card ? undefined : '#374151',
                }]}>
                  {card && (
                    <>
                      <Text style={[styles.rarityBadge, { color: RARITY_COLORS[card.rarity] }]}>{card.rarity}</Text>
                      <View style={[styles.cardImageBackground, { backgroundColor: '#6366f1' }]} />
                      <Text style={styles.rarity}>{RARITY_COLORS[card.rarity]}</Text>
                    </>
                  )}
                  {!card && (
                    <View style={styles.emptySlot}>
                      <Text style={styles.emptyText}>_</Text>
                    </View> 
                  )}
                </View>
              );
            })}
          </View>
        )}
      />

      {/* Dedupe finder: locate duplicates */}
      <View style={[styles.section, { marginTop: 32 }]}>
        <Text style={styles.sectionTitle}>Duplicates Found</Text>
        <Text style={styles.emptyState}>No duplicates in this prototype session</Text>
      </View>
    </ScrollView>
  );
}

// Styles definition
const StyleSheet = {
  section: { padding: 16, backgroundColor: '#0a0f18', borderBottomWidth: 1, borderBottomColor: '#374151' },
  title: { fontSize: 24, fontWeight:"bold", color:'#fff' },
  subtitle: { color:'#94a3b8', marginTop: 4 },
  value: { color:'#86efac', marginTop: 8 },
  page: { padding:12, backgroundColor:'#0e1525' },
  pageHeader: { fontSize: 14, color:'#4b5563', marginBottom:8, marginLeft:4},
  card: { width:"19.6%", height: 120, padding: 8, borderRadius: 6, marginRight: 6, borderWidth: 2 },
  rarityBadge: { fontSize: 10, fontWeight:'bold' as const, alignSelf:'flex-end', marginBottom: 4 },
  cardImageBackground: { flex: 1, borderRadius: 3, overflow: "hidden" },
  rarity: { color:'#6b7280', textAlign:"center", textTransform:'uppercase', fontSize: 12 },
  emptySlot: { backgroundColor:'#1e293b', justifyContent:"center", alignItems:"center" },
  emptyText: { fontSize: 40, opacity: 0.3 } as const,
}
