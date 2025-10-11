using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using WriteTogether.Models.DB;

namespace WriteTogether.Controllers
{
    public class StoriesController : Controller
    {
        private readonly WriteTogetherContext _context;

        public StoriesController(WriteTogetherContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> getStory()
        {
            var writeTogetherContext = await _context.Stories.Include(s => s.AutorStNavigation).Include(s => s.CategoryStNavigation).ToListAsync();
            return Ok(writeTogetherContext);
        }

        [HttpPost]
        public async Task<IActionResult> createStory([Bind("IdSt,TitleSt,DateUs,AutorSt,CategorySt,RateSt,PosterSt, StateSt")] Story story)
        {
            if (ModelState.IsValid)
            {
                story.DateUs = DateTime.Now;
                _context.Add(story);
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Usuario creado exitosamente." });
            }
            return RedirectToAction("Edit", "Home");
        }

        [HttpPut]
        public async Task<IActionResult> editStory(int id, [Bind("IdSt,TitleSt,CategorySt,RateSt,PosterSt,StateSt")] Story story)
        {
            if (id != story.IdSt)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var existingStory = await _context.Stories.FindAsync(id);
                    if (existingStory == null) return NotFound();

                    existingStory.TitleSt = story.TitleSt;
                    existingStory.CategorySt = story.CategorySt;
                    existingStory.RateSt = story.RateSt;
                    existingStory.PosterSt = story.PosterSt;
                    existingStory.StateSt = story.StateSt;

                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!StoryExists(story.IdSt))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return Ok(new { success = true, message = "Usuario editado exitosamente." });
            }
            return RedirectToAction("Edit", "Home");
        }

        [HttpPut]
        public async Task<IActionResult> editState(int id, [Bind("IdSt,StateSt")] Story story)
        {
            if (id != story.IdSt)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var existingStory = await _context.Stories.FindAsync(id);
                    if (existingStory == null) return NotFound();

                    existingStory.StateSt = story.StateSt;

                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!StoryExists(story.IdSt))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return Ok(new { success = true, message = "Usuario editado exitosamente." });
            }
            return RedirectToAction("Edit", "Home");
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> deleteStory(int id)
        {
            var story = await _context.Stories.FindAsync(id);
            if (story != null)
            {
                _context.Stories.Remove(story);
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Usuario eliminado exitosamente." });
        }

        private bool StoryExists(int id)
        {
            return _context.Stories.Any(e => e.IdSt == id);
        }
    }
}
