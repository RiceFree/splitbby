import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from "../../src/supabase/client";


export default function Home() {
const router = useRouter();
const [session, setSession] = useState(null);
const [loading, setLoading] = useState(true);


useEffect(() => {
supabase.auth.getSession().then(({ data }) => {
setSession(data.session);
setLoading(false);
if (!data.session) router.replace('/auth/login');
else router.replace('/dashboard');
});


const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
	setSession(session);
	// If the user signs out, redirect to login. When signing in, don't force a specific
	// page so in-app navigation (e.g. /households/add) isn't interrupted.
	if (!session) router.replace('/auth/login');
});


return () => listener.subscription.unsubscribe();
}, []);


if (loading) return (
<View style={{ flex:1, justifyContent:'center' }}>
<ActivityIndicator />
</View>
);


return <Stack />;
}