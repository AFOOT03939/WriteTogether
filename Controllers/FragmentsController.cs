using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using WriteTogether.Models.DB;

namespace WriteTogether.Controllers
{
    public class FragmentsController : Controller
    {
        private readonly WriteTogetherContext _context;

        public FragmentsController(WriteTogetherContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult> postFragments([FromBody] Fragment fragment)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            fragment.AutorFr = userId;

            _context.Fragments.Add(fragment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Fragmento guardado sin validar modelo." });
        }

        [HttpGet("getByStory/{storyId}")]
        public async Task<IActionResult> getByStory(int storyId)
        {
            var frags = await _context.Fragments
                .Where(f => f.StoryFr == storyId)
                .Include(f => f.AutorFrNavigation)
                .Select(f => new
                {
                    id = f.IdFr,
                    content = f.ContentFr,
                    date = f.DateUs,
                    autor = f.AutorFrNavigation.NameUs
                })
                .ToListAsync();

            return Ok(frags);
        }



    }
}
