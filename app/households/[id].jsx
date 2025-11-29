import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import AuthenticatedLayout from '../../components/authenticated-layout';
import { supabase } from '../../src/supabase/client';
import { Colors, global } from '../../styles/globalStyles';

const AddMemberIcon = ({ size = 24, color = Colors.primary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
  </Svg>
);

export default function DetailHousehold() {
  const { id } = useLocalSearchParams();

  const [household, setHousehold] = useState([]);
  const [loading, setLoading] = useState(true);

  const handeAddMember = () => {
    return;;
  }

  const loadHousehold = useCallback(async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('households')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error loading household:', error);
          setHousehold(null);
        } else {
          setHousehold(data);
        }
  
        
      } catch (e) {
        console.error('Unexpected error:', e);
      } finally {
        setLoading(false);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      loadHousehold();
    }, [loadHousehold])
  );

  return (
    <AuthenticatedLayout>
      <View style={global.container}>
        <View style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={global.title}>{household.name}</Text>
           <Pressable
                  onPress={() => { if (!loading) handleAddMember(); }}
                >
                  <AddMemberIcon size={28} color={Colors.primary} />
                </Pressable>
        </View>
      </View>
    </AuthenticatedLayout>
  );
}
