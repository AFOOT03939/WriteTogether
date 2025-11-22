using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WriteTogether.Models;
using WriteTogether.Models.DB;
using static WriteTogether.Controllers.StoriesController;

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
        public async Task<IActionResult> getFullStory()
        {
            var writeTogetherContext = await _context.Stories.Include(s => s.AutorStNavigation).Include(s => s.CategoryStNavigation).ToListAsync();
            return Ok(writeTogetherContext);
        }

        [HttpGet]
        public async Task<IActionResult> getStory()
        {
            var writeTogetherContext = await _context.Stories.Include(s => s.AutorStNavigation).Include(s => s.CategoryStNavigation)
                .Select(s => new StoryCategory 
                {
                    IdSt = s.IdSt,
                    TitleSt = s.TitleSt,
                    PosterSt = s.PosterSt,
                    RateSt = s.RateSt,
                    AutorSt = s.AutorStNavigation.IdUs,
                    AutorNameSt = s.AutorStNavigation.NameUs,
                    CategorySt = s.CategoryStNavigation.IdCat,
                    StateSt = s.StateSt
                })
        .ToListAsync();
            return Ok(writeTogetherContext);
        }

        [HttpPost]
        public async Task<IActionResult> createStory([FromBody] Story story)
        {
            try
            {
                story.DateUs = DateTime.Now;
                _context.Add(story);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Historia creada exitosamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor.",
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }


        [HttpPost]
        public async Task<IActionResult> editStory([FromBody] Story story)
        {
            var existingStory = await _context.Stories.FindAsync(story.IdSt);
            if (existingStory == null) return NotFound();

            existingStory.TitleSt = story.TitleSt;
            existingStory.CategorySt = story.CategorySt;
            existingStory.RateSt = story.RateSt;
            existingStory.PosterSt = story.PosterSt;
            existingStory.StateSt = story.StateSt;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Historia guardada correctamente." });
        }

        [HttpPost]
        public async Task<IActionResult> UpdateTags([FromBody] UpdateTagsDTO dto)
        {
            try
            {
                var story = await _context.Stories
                    .Include(s => s.IdTags)
                    .FirstOrDefaultAsync(s => s.IdSt == dto.StoryId);

                if (story == null)
                    return NotFound(new { message = "Story no encontrada." });

                // 1. Eliminar relaciones existentes en tabla puente
                var existingTags = story.IdTags.ToList();

                foreach (var t in existingTags)
                {
                    story.IdTags.Remove(t);  // EF marca para borrar en JoinTable
                }

                // 2. Insertar nuevas etiquetas
                foreach (var tagName in dto.Tags)
                {
                    var tag = await _context.Tags
                        .FirstOrDefaultAsync(t => t.NameTag == tagName);

                    if (tag == null)
                    {
                        tag = new Tag { NameTag = tagName };
                        _context.Tags.Add(tag); // se inserta una nueva etiqueta
                    }

                    story.IdTags.Add(tag); // EF creará una fila en la JoinTable
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Tags actualizados correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno.", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> DeleteTags([FromBody] DeleteTagsDTO dto)
        {
            var story = await _context.Stories
                .Include(s => s.IdTags)
                .FirstOrDefaultAsync(s => s.IdSt == dto.StoryId);

            if (story == null)
                return NotFound("Story not found");

            // Buscar los tags relacionados que deben eliminarse
            var tagsToRemove = story.IdTags
                .Where(t => dto.TagIds.Contains(t.IdTag))
                .ToList();

            // Quitar relaciones Story_Tag
            foreach (var tag in tagsToRemove)
                story.IdTags.Remove(tag);

            await _context.SaveChangesAsync();

            return Ok("Tags eliminados correctamente");
        }


        public class DeleteTagsDTO
        {
            public int StoryId { get; set; }
            public List<int> TagIds { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> RateStory([FromBody] RateStoryDTO dto)
        {
            var story = await _context.Stories.FindAsync(dto.StoryId);

            if (story == null)
                return NotFound(new { message = "Story not found" });

            // si la historia nunca ha sido calificada
            if (story.RateSt == null || story.RateSt == 0)
                story.RateSt = dto.Rating;
            else
                story.RateSt = Convert.ToInt32((story.RateSt + dto.Rating) / 2.0);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Rating saved",
                newRating = story.RateSt
            });
        }

        public class RateStoryDTO
        {
            public int StoryId { get; set; }
            public int Rating { get; set; }
        }






        public async Task<IActionResult> Edit(int id)
        {
            var story = await _context.Stories
                .Include(s => s.AutorStNavigation)
                .Include(s => s.CategoryStNavigation)
                .Include(s => s.Fragments)
                    .ThenInclude(f => f.AutorFrNavigation)
                .Include(s => s.IdTags)
                .FirstOrDefaultAsync(s => s.IdSt == id);

            if (story == null)
                return NotFound();

            return View(story);
        }


        [HttpPost]
        public async Task<IActionResult> StartNewStory()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();

            var userId = int.Parse(userIdStr);

            // Crear historia por defecto
            var newStory = new Story
            {
                TitleSt = "New Story",
                AutorSt = userId,
                CategorySt = 1,         // Fantasy por defecto
                StateSt = false,        // In progress
                RateSt = 0,
                PosterSt = "default_poster.png"
            };

            _context.Stories.Add(newStory);
            await _context.SaveChangesAsync(); // Esto asigna IdSt automáticamente

            // Redirigir a Edit con el Id generado
            return RedirectToAction("Edit", new { id = newStory.IdSt });
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
