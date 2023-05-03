using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Project.Models;
using Project.Utilities;

namespace Project.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PersonnelController : ControllerBase
    {
        [HttpGet("teams")]
        public async Task<IEnumerable<RacingTeam>> GetTeams()
        {
            await using var connection = new SqliteConnection(DbUtils.ConnectionString());
            await connection.OpenAsync();

            var command = connection.CreateCommand();
            command.CommandText = "select RacingTeamId, Name, TeamPrincipal from RacingTeam";

            var result = new List<RacingTeam>();
            await using var reader = await command.ExecuteReaderAsync();
            while (reader.Read())
                result.Add(new RacingTeam
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    TeamPrincipalName = reader.GetString(2)
                });

            return result;
        }

        [HttpGet("teams/{teamId:int}/drivers")]
        public async Task<IEnumerable<RacingDriver>> GetDrivers(int teamId)
        {
            await using var connection = new SqliteConnection(DbUtils.ConnectionString());
            await connection.OpenAsync();

            var command = connection.CreateCommand();
            command.CommandText = $"select RacingDriverId, Name, DriverNumber from RacingDriver where RacingTeamId = {teamId}";

            var result = new List<RacingDriver>();
            await using var reader = await command.ExecuteReaderAsync();
            while (reader.Read())
                result.Add(new RacingDriver
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Number = reader.GetInt32(2)
                });

            return result;
        }
    }
}