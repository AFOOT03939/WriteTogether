using WriteTogether.Models.DB;

namespace WriteTogether.Models
{
    public class StoryCategory
    {
        public int IdSt { get; set; }

        public string TitleSt { get; set; } = null!;

        public int AutorSt { get; set; }

        public int CategorySt { get; set; }

        public int? RateSt { get; set; }

        public string? PosterSt { get; set; }

        public bool StateSt { get; set; }

        public virtual User AutorStNavigation { get; set; } = null!;

        public virtual Category CategoryStNavigation { get; set; } = null!;
    }
}

