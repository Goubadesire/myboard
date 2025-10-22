import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email)
      return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file");
    if (!file)
      return new Response(JSON.stringify({ error: "Aucun fichier fourni" }), { status: 400 });

    // Récupérer l'utilisateur
    const { data: user, error: userError } = await supabaseServer
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user)
      return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 404 });

    // ✅ Lire le fichier sous forme de buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Sécuriser le nom du fichier
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${user.id}-${Date.now()}-${safeFileName}`;

    // ✅ Upload correct vers Supabase Storage
    const { data, error: uploadError } = await supabaseServer.storage
      .from("profiles")
      .upload(fileName, buffer, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type, // important pour le bon affichage
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabaseServer.storage.from("profiles").getPublicUrl(fileName);

    return new Response(JSON.stringify({ url: publicUrl }), { status: 200 });
  } catch (err) {
    console.error("❌ Erreur upload Supabase :", err);
    return new Response(JSON.stringify({ error: err.message || "Erreur serveur" }), { status: 500 });
  }
}
