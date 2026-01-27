namespace UpBizlyBackend.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // initialize with empty
        public decimal Price { get; set; }

        public int BusinessId { get; set; }
        public Business Business { get; set; } = null!; // tells compiler it will not be null

        public string StockStatus { get; set; } = string.Empty; // ADD THIS
        
    }
}

