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
    public class CategoriesController : Controller
    {
        private readonly WriteTogetherContext _context;

        public CategoriesController(WriteTogetherContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> getCategories()
        {
            var categories = await _context.Categories.Select(c =>  c.NameUs).ToListAsync();
            return Ok(categories);
        }
    }
}
