import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ProfileProps {
  userStatus: 'guest'|'member';
  coinBalance:number;
  packCount:number;
}

export default function Profile({ userStatus, coinBalance, packCount }: ProfileProps) {
  
  return (
    <ScrollView style={styles.container}>
      
      {/* Header with profile icon and guest badge */} 
      <View style={styles.header}>        
        <View style={[styles.avatarContainer, { backgroundColor: '#6366f1' }]}>
          <Text style={styles.avatarText}>{userStatus.charAt(0).toUpperCase()}</Text>
        </View>

        {/* Profile title and prototype badge */}
        <View style={styles.headerContent}>
          <Text style={styles.userName}>{userStatus}</Text>
          <View style={styles.badgeContainer}>
            <Ionicons name="code-slash-outline" size={12} color="#86efac"/>
            <View style={styles.badge}>Prototype Mode</View>
          </View>
        </View>
      </View>

      {/* Live collection statistics */}
      <View style={styles.section}>              
        <Text style={styles.subtitle}>📊 Collection Stats</Text>
        
        <View style={styles.statRow}>
          <Ionicons name="wallet-outline" size={20} color="#86efac"/>
          <Text style={styles.value}>{coinBalance.toLocaleString()} coins</Text>
        </View>

        <View style={styles.statRow}>
          <Ionicons name="cart-outline" size={20} color="#6366f1"/>  
          <Text style={styles.value}>{packCount} packs opened</Text>
        </View>

        {/* Placeholder for live card count */}        
        <View style={styles.statRow}>
          <Ionicons name="albums-outline" size={20} color="#8b5cf6"/>
          <Text style={styles.value}>Cards collected: {packCount}</Text>  
        </View>
      </View>

      {/* Account information with session-only notice */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>🔐 Account</Text>            
        
        <View style={[styles.infoRow, { backgroundColor: '#1e293b' }]}>
          <Ionicons name="lock-closed-outline" size={16} color="#475569"/>
          <Text style={styles.infoText}>No login required · Session-only data</Text>  
        </View>
      </View>

      {/* Settings and preferences */}      
      <View style={styles.section}>      
        <Text style={styles.subtitle}>⚙️ Settings</Text>
        
        <TouchableOpacity style={styles.settingButton}>
          <Ionicons name="color-palette-outline" size={18} color="#9ca3af"/>
          <Text style={styles.settingLabel}>Theme (System)</Text>          
          <Ionicons name="chevron-forward-outline" size={16} color="#475569"/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingButton}>      
          <Ionicons name "currency-usd-outline" size={18} color="#9ca3af"/>
          <Text style={styles.settingLabel}>Currency (USD)</Text>          
          <Ionicons name="chevron-forward-outline" size={16} color="#475569"/>
        </TouchableOpacity>
      </View>

      {/* Support contact */}       
      <View style={[styles.section, { backgroundColor: '#0e1525' }]}>          
        <Text style={styles.supportEmail}>📧 support@gemma.cards</Text>  
        <Text style={styles.version}>App v1.0.0 (prototype)</Text>      
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor:'#0a0f18' } as const,
  header: { flexDirection:'row', alignItems:'center', paddingTop:24, paddingVertical: 16 },
  avatarContainer: { width: 72, height: 72, borderRadius: 36, justifyContent:'center', alignItems:'center', marginRight: 16 , marginLeft:24},
  avatarText: { fontSize: 28, fontWeight: 'bold' as const, color:'#fff' } as const,
  headerContent: {},
  userName: { fontSize: 24, fontWeight:'bold' as const, color:'#fff', letterSpacing: 0.5 },  
  badgeContainer: { flexDirection: 'row' as const , alignItems:'center', marginTop:4, paddingHorizontal:12, paddingVertical:6, backgroundColor:'#374151', borderRadius:8 },
  badge: { color:'#86efac', fontSize: 10, fontWeight:'bold' as const, paddingLeft:4 },
  section: { padding:16, borderBottomWidth:1, borderBottomColor:'#374151' } as const,  
  subtitle: { color:'#9ca3b8', marginBottom: 12},   
  statRow: { flexDirection:'row' as const , alignItems:'center', paddingVertical: 8 },
  value: { flex: 1, color: '#e2e8f0' } as const,  
  infoRow: { flexDirection:'row', alignItems:'flex-start', paddingVertical: 8 },
  infoText: { flex: 1, fontSize: 14, color: '#9ca3b8' } as const,        
  settingButton: { flexDirection:'row' as const, paddingVertical:12 , marginLeft:-24 },  
  settingLabel:{ flex:1, fontSize:15 },
  supportEmail: { textAlign:'center', color:'#94a3b8', marginTop:8},
  version: { textAlign:'center', color:'#6b7280', marginTop: 4, fontSize: 12 },  
}
