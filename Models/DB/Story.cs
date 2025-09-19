using System;
using System.Collections.Generic;

namespace WriteTogether.Models.DB;

public partial class Story
{
    public int IdSt { get; set; }

    public string TitleSt { get; set; } = null!;

    public DateTime DateUs { get; set; }

    public int AutorSt { get; set; }

    public int CategorySt { get; set; }

    public int? RateSt { get; set; }

    public string? PosterSt { get; set; }

    public virtual User AutorStNavigation { get; set; } = null!;

    public virtual Category CategoryStNavigation { get; set; } = null!;

    public virtual ICollection<Fragment> Fragments { get; set; } = new List<Fragment>();

    public virtual ICollection<Tag> IdTags { get; set; } = new List<Tag>();
}
