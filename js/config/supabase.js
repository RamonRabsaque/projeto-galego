// ========== CONFIGURAÇÃO SUPABASE ==========
const SUPABASE_CONFIG = {
    URL: 'https://hbpdmkhnzfavombdpodj.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicGRta2huemZhdm9tYmRwb2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMjgzMDUsImV4cCI6MjA4NjYwNDMwNX0.Rnylv89Y7MKczMj0hIOuNoT_Gs1TDwUDHe1bHr2EIbI'
};

// Verificar se as credenciais foram preenchidas
console.log('🔧 Configuração Supabase:', SUPABASE_CONFIG.URL.substring(0, 30) + '...');

// Inicializar cliente Supabase (NOME DIFERENTE: supabaseClient)
const supabaseClient = window.supabase.createClient(
    SUPABASE_CONFIG.URL,
    SUPABASE_CONFIG.ANON_KEY
);

console.log('✅ Supabase client inicializado');


// Teste simples de conexão
fetch('https://znrukhjxpjgogimxwniw.supabase.co/rest/v1/', {
    headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucnVraHhwamdnb2dpeHduaXciLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczOTQ2MTYwNywiZXhwIjoyMDU1MDM3NjA3fQ.dVpLtVjYq0CjXxPq8RtYzZw'
    }
})
    .then(response => console.log('✅ Conexão OK:', response.status))
    .catch(error => console.error('❌ Erro de conexão:', error));