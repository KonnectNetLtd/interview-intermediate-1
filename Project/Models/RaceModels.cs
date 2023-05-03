namespace Project.Models;

public class LapTime
{
    public int Id { get; set; }
    
    public DateTime StartDateTime { get; set; }
    public double? Sector1ElapsedTime { get; set; }
    public double? Sector2ElapsedTime { get; set; }
    public double? Sector3ElapsedTime { get; set; }
}