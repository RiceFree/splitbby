import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { supabase } from '../../src/supabase/client';
import { Colors, global } from '../../styles/globalStyles';

const HomeIcon = ({ size = 24, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color}>
    <Path d="M10.795 1.375a2.25 2.25 0 0 1 2.41 0l9 6.083a2.25 2.25 0 0 1 .795 2.991V19.5a2.25 2.25 0 0 1-2.25 2.25H4.25A2.25 2.25 0 0 1 2 19.5V10.449a2.25 2.25 0 0 1 .795-2.991l9-6.083ZM14.25 18.75a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v3h4.5v-3Z" />
  </Svg>
);

const TrashIcon = ({ size = 20, color = Colors.error }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M10 7V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3m-6 0h12" />
  </Svg>
);

export default function HouseholdCard({ item, onDelete }) {
  const router = useRouter();
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const loadMemberCount = async () => {
      try {
        const { count, error } = await supabase
          .from('household_members')
          .select('*', { count: 'exact', head: true })
          .eq('household_id', item.id);

        if (!error) {
          setMemberCount(count || 0);
        }
      } catch (e) {
        console.error('Error loading member count:', e);
      }
    };

    loadMemberCount();
  }, [item.id]);

  const handleDelete = (householdId) => {    
    Alert.alert(
      'Delete Household',
      'Are you sure? This action cannot be undone.',
      [
        { 
          text: 'Cancel', 
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const { data, error } = await supabase
                .from('households')
                .delete()
                .eq('id', householdId)
                .select();

              if (error) {
                Alert.alert('Error', error.message || 'Failed to delete household');
              } else {
                Alert.alert('Success', 'Household deleted successfully');
                onDelete?.(householdId);
              }
            } catch (e) {
              Alert.alert('Error', e.message || 'Unexpected error occurred');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}
    >
      <Pressable
        onPress={() => router.push(`/households/${item.id}`)}
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
      >
        <HomeIcon size={28} color={Colors.primary} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={[global.subtitle, { marginBottom: 4 }]}>{item.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={global.muted}>{memberCount} member{memberCount !== 1 ? 's' : ''}</Text>
            <Text style={global.muted}>•</Text>
            <Text style={global.muted}>{new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
        </View>
      </Pressable>

      <TouchableOpacity 
        onPress={() => {
          handleDelete(item.id);
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <TrashIcon size={20} />
      </TouchableOpacity>
    </View>
  );
}


