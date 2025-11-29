import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import AuthenticatedLayout from '../../components/authenticated-layout';
import global from '../../styles/globalStyles';

export default function Households() {
  const router = useRouter();

  return (
    <AuthenticatedLayout>
      <View style={global.container}>
        <Text style={global.title}>Households</Text>

        <Pressable
          style={[global.button, { marginTop: 12 }]}
          onPress={() => router.push('/households/add')}
        >
          <Text style={global.buttonText}>Add new household</Text>
        </Pressable>

        <View style={{ height: 12 }} />
        <Text style={global.body}>You don't have any Households yet. Create your first one!</Text>
      </View>
    </AuthenticatedLayout>
  );
}

