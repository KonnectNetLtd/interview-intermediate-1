using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Project.Models;
using Project.Utilities;

namespace Project.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RaceController : ControllerBase
    {
        [HttpGet("drivers/{driverId:int}/times")]
        public async Task<IEnumerable<LapTime>> GetTimes(int driverId)
        {
            await using var connection = new SqliteConnection(DbUtils.ConnectionString());
            await connection.OpenAsync();

            var command = connection.CreateCommand();
            command.CommandText = $"select LapTimeId, StartDateTime, Sector1ElapsedTime, Sector2ElapsedTime, Sector3ElapsedTime from LapTime where RacingDriverId = {driverId}";

            var result = new List<LapTime>();
            await using var reader = await command.ExecuteReaderAsync();
            while (reader.Read())
                result.Add(new LapTime
                {
                    Id = reader.GetInt32(0),
                    StartDateTime = reader.GetDateTime(1),
                    Sector1ElapsedTime = reader.GetDouble(2),
                    Sector2ElapsedTime = reader.GetDouble(3),
                    Sector3ElapsedTime = reader.GetDouble(4)
                });

            return result;
        }
        
        [HttpGet("reports/")]
        public async Task<IEnumerable<object>> GetReports()
        {
            // we will discuss about this method further in the technical interview
            throw new NotImplementedException();
        }
    }
}