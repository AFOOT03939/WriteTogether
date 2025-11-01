using System;
using System.Collections.Generic;

namespace WriteTogether.Models.DB;

public partial class Fragment
{
    public int? IdFr { get; set; }

    public string ContentFr { get; set; } = null!;

    public DateTime DateUs { get; set; }

    public int? AutorFr { get; set; }

    public int? StoryFr { get; set; }

    public virtual User AutorFrNavigation { get; set; } = null!;

    public virtual Story StoryFrNavigation { get; set; } = null!;
}
