import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import AuthenticatedLayout from '../../components/authenticated-layout';
import { supabase } from '../../src/supabase/client';
import global from '../../styles/globalStyles';
import HouseholdCard from './card';

export default function Households() {
  const router = useRouter();
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHouseholds = useCallback(async () => {
    setLoading(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        console.error('Could not get user');
        setLoading(false);
        return;
      }

      const userId = userData.user.id;

      // Get households for this user
      const { data, error } = await supabase
        .from('household_members')
        .select('household_id, households:household_id(id, name, created_at)')
        .eq('user_id', userId);

      if (error) {
        console.error('Error loading households:', error);
        setHouseholds([]);
      } else {
        // Flatten the structure
        const hhs = data?.map(hm => hm.households).filter(Boolean) || [];
        setHouseholds(hhs);
      }
    } catch (e) {
      console.error('Unexpected error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load households when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadHouseholds();
    }, [loadHouseholds])
  );

  return (
    <AuthenticatedLayout>
      <View style={global.container}>
        <Text style={global.title}>Households</Text>

        <Pressable
          style={[global.button, { marginTop: 12, marginBottom: 20 }]}
          onPress={() => router.push('/households/add')}
        >
          <Text style={global.buttonText}>+ Add new household</Text>
        </Pressable>

        {loading ? (
          <Text style={global.body}>Loading...</Text>
        ) : households.length === 0 ? (
          <Text style={global.body}>You don't have any Households yet. Create your first one!</Text>
        ) : (
          <FlatList
            data={households}
            renderItem={({ item }) => (
              <HouseholdCard
                item={item}
                onDelete={() => loadHouseholds()}
              />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </View>
    </AuthenticatedLayout>
  );
}

