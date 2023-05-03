namespace Project.Utilities;

public static class DbUtils
{
    public static string ConnectionString()
    {
        var currentDirectory = AppDomain.CurrentDomain.BaseDirectory;
        var dbPath = Path.Combine(currentDirectory, "Database", "SpeedFestDb.db");
        var connectionString = $@"Data Source={dbPath};";

        return connectionString;
    }
}