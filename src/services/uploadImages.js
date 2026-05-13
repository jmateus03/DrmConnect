import { supabase } from "../supabase/supabase";

export async function envImagensStorage(arquivo) {
  if (!arquivo) return null;

  const fileName = `${Date.now()}-${arquivo.name}`;

  const { data, error } = await supabase.storage
    .from("imagens-problemas")
    .upload(fileName, arquivo);

  if (error) {
    console.error(error);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("imagens-problemas")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}