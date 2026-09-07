import React from "react"
import { View, Text, ScrollView, StyleSheet, Platform } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"

// Settings screen with theme, currency, export functionality  
export default function Settings({ onExport }: { onExport?: () => void }) {

  return (
    <ScrollView style={styles.container}>
      {/* Theme toggle */}
      <View style={styles.section}>
        <Text style={styles.title}>💎 Appearance</Text>
        <TouchableOpacity style={styles.toggleRow}>
          <Ionicons name="color-palette-outline" size={18} color="#9ca3af" />
          <Text style={styles.label}>Dark Mode (System)</Text>  
          <View style={[styles.button, { backgroundColor: Platform.OS === 'ios' ? '#4b5563' : 'transparent' }]} >
            <Ionicons name="checkmark-done-outline" size={16} color="#9ca3af"/>
          </View>
        </TouchableOpacity>
      </View>

      {/* Currency selector */}      
      <View style={styles.section}>          
        <Text style={styles.title}>💵 Currency</Text>   
        <TouchableOpacity style={styles.toggleRow}>  
          <Ionicons name="currency-usd-outline" size={18} color="#9ca3af" />
          <Text style={styles.label}>US Dollar (USD)</Text>
          <View style={[styles.button, { backgroundColor: '#4b5563' } ]}>
            <Ionicons name="checkmark-done-outline" size={16} color="#9ca3af"/>  
          </View>
        </TouchableOpacity>
      </View>

      {/* Language placeholder */}      
      <View style={[styles.section, { backgroundColor: '#0e1525' } ]}>          
        <Text style={styles.title}>🌐 Language</Text>           
        <TouchableOpacity style={[styles.toggleRow, { justifyContent:'flex-end' }]}>
          <Ionicons name="language-outline" size={18} color="#9ca3af"/>
          <Text style={[styles.label, { flex: 4 }]}>English (en-US)</Text>  
          <View style={styles.button}>
            <Ionicons name="chevron-forward-outline" size={16} color="#475569"/>
          </View>              
        </TouchableOpacity>      
      </View>

      {/* Export collection data */}       
      <View style={[styles.section, { backgroundColor: '#0e1525' }]}>          
        <Text style={styles.title}>📊 Collection</Text>
        <TouchableOpacity onPress={onExport ?? (() => {}) } style={styles.exportButton} >      
          <Ionicons name="download-outline" size={20} color="#86efac"/>
          <Text style={[styles.buttonText, { color:'#86efac' }]}>Export Collection JSON</Text>
        </TouchableOpacity>
      </View>

      {/* Data privacy */}        
      <View style={[styles.section, { backgroundColor: '#0e1525' } ]}>          
        <Text style={styles.title}>🔒 Privacy</Text>  
        <Text style={styles.description}>Prototype data is session-only and never shared</Text>             
      </View>

      {/* Legal links */}      
      <View style={[styles.section, { backgroundColor: '#0e1525' } ]}>          
        <TouchableOpacity style={[styles.legalLink, { color:'#6b7280', textDecorationLine:'underline' }]}>
          Privacy Policy
        </TouchableOpacity>
        <TouchableOpacity style={[styles.legalLink, { color:'#6b7280', textDecorationLine:'underline' } ]} >        
          Terms & Conditions
        </TouchableOpacity>           
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0a0f18' },  
  section:{paddingTop:24,borderBottomWidth:1,borderBottomColor:'#374151'},  
  title:{color:'#fff',fontWeight:'bold' as const},   
  toggleRow:{flexDirection:'row',alignItems:'center',marginTop:12,marginHorizontal:16},
  label:{flex:1,color:'#94a3b8',fontSize:15},
  button:{marginRight:16,paddingVertical:6,borderRadius:6,borderWidth:1,borderColor:'#374151'},  
  buttonText:{fontWeight:'bold' as const,fontSize:15},
  exportButton:{flexDirection:'row',backgroundColor:'#0e1525',padding:14,marginHorizontal:-16,elevation:Platform.OS === 'ios' ? 1 : 2 , borderRadius:8 }, 
  description:{color:'#9ca3b8',text-align:'center',fontSize:12},
  legalLink:{paddingHorizontal:16} as const,
})
