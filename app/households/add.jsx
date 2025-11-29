import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AuthenticatedLayout from '../../components/authenticated-layout';
import { supabase } from '../../src/supabase/client';
import global from '../../styles/globalStyles';

export default function AddHousehold() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return Alert.alert('Validation', 'Inserisci un nome per il household');
    setLoading(true);
    try {
      // Minimal example: insert into households table
      const { data, error } = await supabase.from('households').insert([{ name }]);
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Household creato');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <View style={styles.container}>
        <Text style={global.title}>Add Household</Text>
        <Text style={global.label}>Name</Text>
        <TextInput
          style={global.input}
          value={name}
          onChangeText={setName}
          placeholder="Household name"
        />
        <View style={{ height: 12 }} />
        <Pressable
          style={loading ? [global.button, { opacity: 0.6 }] : global.button}
          onPress={() => { if (!loading) handleCreate(); }}
        >
          <Text style={global.buttonText}>{loading ? 'Creating...' : 'Create'}</Text>
        </Pressable>
      </View>
    </AuthenticatedLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});

