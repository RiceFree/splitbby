import { useRouter } from "expo-router";
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { supabase } from "../../src/supabase/client";


export default function AddExpense() {
const [amount, setAmount] = useState('');
const [desc, setDesc] = useState('');
const router = useRouter();


const save = async () => {
const user = (await supabase.auth.getUser()).data.user;


const { data: hm } = await supabase
.from('household_members')
.select('household_id')
.eq('user_id', user.id)
.limit(1);


const household_id = hm?.[0]?.household_id;
if (!household_id) return;


const { data: members } = await supabase
.from('household_members')
.select('user_id')
.eq('household_id', household_id);


const total = parseFloat(amount);
const per = parseFloat((total / members.length).toFixed(2));


const { data: exp } = await supabase
.from('expenses')
.insert([{ household_id, payer_id: user.id, total, description: desc }])
.select()
.single();


const shares = members.map((m) => ({
expense_id: exp.id,
user_id: m.user_id,
share: per
}));


await supabase.from('expense_shares').insert(shares);
router.back();
};


return (
<View style={{ padding:16 }}>
<Text>Descrizione</Text>
<TextInput value={desc} onChangeText={setDesc} />


<Text>Importo</Text>
<TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" />


<Button title="Salva" onPress={save} />
</View>
);
}