using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace UpBizlyBackend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;

        // Only for input; not stored in DB and not returned in API
        [NotMapped]
        [JsonIgnore]
        public string Password { get; set; } = string.Empty;

        // Existing field — stays the same
        public string PasswordHash { get; set; } = string.Empty;

        // Existing role field — stays the same
        public string Role { get; set; } = "User";

        public List<Business> Businesses { get; set; } = new();
    }
}