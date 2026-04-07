import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase não configurado. Usando dados de exemplo.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

// ── Produtos ─────────────────────────────────────────────
export async function fetchProdutos({ categoria, busca } = {}) {
  let query = supabase
    .from('produtos')
    .select('*')
    .order('criado_em', { ascending: false });

  if (categoria && categoria !== 'todos') {
    query = query.eq('categoria', categoria);
  }

  if (busca) {
    query = query.ilike('nome', `%${busca}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchProdutosDestaque() {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('destaque', true)
    .limit(4);
  if (error) throw error;
  return data;
}

// ── Pedidos ───────────────────────────────────────────────
export async function criarPedido({ usuario_id, total, items }) {
  const { data: pedido, error: pedidoError } = await supabase
    .from('pedidos')
    .insert({ usuario_id, total, status: 'pendente' })
    .select()
    .single();

  if (pedidoError) throw pedidoError;

  const itensPedido = items.map((item) => ({
    pedido_id: pedido.id,
    produto_id: item.id,
    quantidade: item.quantidade,
    preco_unitario: item.preco,
  }));

  const { error: itensError } = await supabase
    .from('itens_pedido')
    .insert(itensPedido);

  if (itensError) throw itensError;

  return pedido;
}

export async function fetchPedidosUsuario(usuario_id) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, itens_pedido(*, produtos(*))')
    .eq('usuario_id', usuario_id)
    .order('criado_em', { ascending: false });
  if (error) throw error;
  return data;
}