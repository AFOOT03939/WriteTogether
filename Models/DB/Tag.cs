using System;
using System.Collections.Generic;

namespace WriteTogether.Models.DB;

public partial class Tag
{
    public int IdTag { get; set; }

    public string? NameTag { get; set; }

    public virtual ICollection<Story> IdSts { get; set; } = new List<Story>();
}
