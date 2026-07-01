using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class BodyWeight
{
    public int Id { get; set; }
    
    public DateTime Date { get; set; } = DateTime.UtcNow;

    [Required]
    [Range(0.1, 500, ErrorMessage = "Weight must between 0.1 and 500 kg.")]
    [Display(Name = "Weight (kg)")]
    public decimal Weight { get; set; }
}