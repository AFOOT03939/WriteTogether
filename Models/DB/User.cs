using System;
using System.Collections.Generic;

namespace WriteTogether.Models.DB;

public partial class User
{
    public int IdUs { get; set; }

    public string NameUs { get; set; } = null!;

    public string? EmailUs { get; set; }

    public string? PasswordUs { get; set; }

    public DateTime DateUs { get; set; } = DateTime.Now;

    public string? AvatarUs { get; set; }

    public virtual ICollection<Fragment> Fragments { get; set; } = new List<Fragment>();

    public virtual ICollection<Story> Stories { get; set; } = new List<Story>();
}
