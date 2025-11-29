import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import AuthenticatedLayout from '../../components/authenticated-layout';
import { supabase } from "../../src/supabase/client";

export default function Expenses() {
  const [items, setItems] = useState([]);

  const loadExpenses = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    const { data: hm } = await supabase
      .from("household_members")
      .select("household_id")
      .eq("user_id", user.id)
      .limit(1);

    const household_id = hm?.[0]?.household_id;
    if (!household_id) return;

    const { data } = await supabase
      .from("expenses")
      .select("*, expense_shares(*)")
      .eq("household_id", household_id)
      .order("created_at", { ascending: false });

    setItems(data || []);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <AuthenticatedLayout>
      <View style={{ flex: 1, padding: 16 }}>
        <Link href="/expenses/add" asChild>
          <Button title="Aggiungi Spesa" />
        </Link>

        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={{ padding: 8, borderBottomWidth: 1 }}>
              <Text>{item.description}</Text>
              <Text>€ {item.total}</Text>
            </View>
          )}
        />
      </View>
    </AuthenticatedLayout>
  );
}
