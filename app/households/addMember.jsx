import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import AuthenticatedLayout from "../../components/authenticated-layout";
import { supabase } from '../../src/supabase/client';
import global from '../../styles/globalStyles';


export default function AddMember() {
    const { householdId } = useLocalSearchParams();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');


    const handleAddMember = async () => {
      if (!email.trim() || email.indexOf('@') === -1 || email.indexOf('.') === -1 || email.length < 5) {
        return setMsg('Please enter an email address');
      }

      try {
        const { data: user, error} = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', email.trim())
          .single();

        if (!user) {
          return setMsg('No user found with that email');
        }
        if (error) {
          return setMsg('Error looking up user: ' + error.message);
        }

        // Check that the user is not already a member
        const { data: memberData, error: memberError } = await supabase
          .from('household_members')
          .select('id')
          .eq('household_id', householdId)
          .eq('user_id', user.id)
          .single();
        if (memberData) {
          return setMsg('User is already a member of this household');
        }

        // Add user to household members
        const { error: addMemberError } = await supabase
          .from('household_members')
          .insert([{
            household_id: householdId,
            user_id: user.id,
            role: 'member',
          }]);

        if (addMemberError) {
          return setMsg('Error adding member: ' + addMemberError.message);
        }
        router.replace("/households/" + householdId);
      } catch (e) {
        console.error('Unexpected error:', e);
        Alert.alert('Error', e.message || 'Unexpected error');
      }
      

      
    }
  return (
    <AuthenticatedLayout>
        <View style={global.container}>
            <Text style={global.title}>Add Household Member</Text>
            <Text style={global.label}>Email of the new member</Text>
            <TextInput
            style={global.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            editable={!loading}
            />
            {msg ? <Text style={global.error}>{msg}</Text> : null}
            <View style={{ height: 12 }} />
            <Pressable
            style={loading ? [global.button, { opacity: 0.6 }] : global.button}
            onPress={() => { if (!loading) handleAddMember(); }}
            disabled={loading}
            >
            <Text style={global.buttonText}>{loading ? 'Adding...' : 'Add'}</Text>
            </Pressable>
        </View>
    </AuthenticatedLayout>
  );
}