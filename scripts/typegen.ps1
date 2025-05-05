param(
    [string]$schema = "public",
    [string]$outdir = "./src/types/database.types",
    [string]$projectId = "gilqgzjkzkmhbbcqidqb"                
)


supabase gen types typescript --project-id $projectId --schema $schema > $outdir/database.$schema.types.ts
