using UpBizlyBackend.Models;

namespace UpBizlyBackend.Models
{
    public class Business
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public int OwnerId { get; set; }
        public User Owner { get; set; } = null!;

        public List<Product> Products { get; set; } = new();
    }
}
