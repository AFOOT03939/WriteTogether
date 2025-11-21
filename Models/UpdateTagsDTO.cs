namespace WriteTogether.Models
{
    public class UpdateTagsDTO
    {
        public int StoryId { get; set; }
        public List<string> Tags { get; set; }
    }

}
