import { StyleSheet, Text, View } from 'react-native';
import AuthenticatedLayout from '../../components/authenticated-layout';

export default function Dashboard() {
  return (
    <AuthenticatedLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Dashboard (coming soon)</Text>
      </View>
    </AuthenticatedLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18 },
});
