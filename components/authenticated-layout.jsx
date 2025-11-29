import { supabase } from '@/src/supabase/client';
import { Link, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function AuthenticatedLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Logout error', e);
    }
    router.replace('/auth/login');
  };

  const IconHome = ({ size = 20, color = '#0a7ea4' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <Path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
        <Path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
    </Svg>
  );

  const IconUsers = ({ size = 20, color = '#0a7ea4' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <Path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
    </Svg>
  );

  const IconLogout = ({ size = 20, color = '#a40a1fff' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <Path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </Svg>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>

      <View style={styles.navbar}>
        <Link href="/dashboard" asChild>
          <TouchableOpacity style={styles.navItem}>
            <IconHome />
          </TouchableOpacity>
        </Link>

        <Link href="/households" asChild>
          <TouchableOpacity style={styles.navItem}>
            <IconUsers />
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
          <IconLogout />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 56,
    backgroundColor: '#0a7ea4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '600' },
  logoutBtn: { padding: 8 },
  logoutText: { color: '#fff' },
  content: { flex: 1 },
  navbar: {
    height: 56,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navText: { color: '#0a7ea4' },
});

