namespace Project.Models
{
    public class RacingTeam
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string TeamPrincipalName { get; set; }
    }

    public class RacingDriver
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Number { get; set; }
    }
}
