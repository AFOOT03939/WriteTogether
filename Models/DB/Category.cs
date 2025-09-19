using System;
using System.Collections.Generic;

namespace WriteTogether.Models.DB;

public partial class Category
{
    public int IdCat { get; set; }

    public string NameUs { get; set; } = null!;

    public DateTime DateUs { get; set; }

    public virtual ICollection<Story> Stories { get; set; } = new List<Story>();
}
