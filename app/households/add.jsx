import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import AuthenticatedLayout from '../../components/authenticated-layout';
import { supabase } from '../../src/supabase/client';
import global from '../../styles/globalStyles';

export default function AddHousehold() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return Alert.alert('Validation', 'Inserisci un nome per il household');
    setLoading(true);
    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        Alert.alert('Error', 'Could not get current user');
        setLoading(false);
        return;
      }
      const userId = userData.user.id;
      console.log('Creating household for user:', userId);

      // Create household
      const householdPayload = { name: name.trim() };
      console.log('Household payload:', householdPayload);
      
      const { data: householdData, error: householdError } = await supabase
        .from('households')
        .insert([householdPayload])
        .select()
        .single();

      console.log('Household response:', { data: householdData, error: householdError });

      if (householdError) {
        Alert.alert('Error Creating Household', householdError.message || JSON.stringify(householdError));
        setLoading(false);
        return;
      }

      console.log('Household created:', householdData);

      // Add current user as household member with role "creator"
      const memberPayload = {
        household_id: householdData.id,
        user_id: userId,
        role: 'creator',
      };
      console.log('Member payload:', memberPayload);

      const { error: memberError } = await supabase
        .from('household_members')
        .insert([memberPayload])
        .select();

      console.log('Member response error:', memberError);

      if (memberError) {
        Alert.alert('Error Adding Member', 'Household created but could not add you as member: ' + (memberError.message || JSON.stringify(memberError)));
        setLoading(false);
        return;
      }

      Alert.alert('Success', 'Household creato con successo!');
      setName('');
      router.back();
    } catch (e) {
      console.error('Unexpected error:', e);
      Alert.alert('Error', e.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <View style={global.container}>
        <Text style={global.title}>Add Household</Text>
        <Text style={global.label}>Name</Text>
        <TextInput
          style={global.input}
          value={name}
          onChangeText={setName}
          placeholder="Household name"
          editable={!loading}
        />
        <View style={{ height: 12 }} />
        <Pressable
          style={loading ? [global.button, { opacity: 0.6 }] : global.button}
          onPress={() => { if (!loading) handleCreate(); }}
          disabled={loading}
        >
          <Text style={global.buttonText}>{loading ? 'Creating...' : 'Create'}</Text>
        </Pressable>
      </View>
    </AuthenticatedLayout>
  );
}

