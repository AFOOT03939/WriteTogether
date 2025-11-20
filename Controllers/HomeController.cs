using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using WriteTogether.Models;
using WriteTogether.Models.DB;

namespace WriteTogether.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly WriteTogetherContext _context;

        public HomeController(ILogger<HomeController> logger, WriteTogetherContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var stories = await _context.Stories
                .Include(s => s.AutorStNavigation)
                .Include(s => s.CategoryStNavigation)
                .OrderByDescending(s => s.DateUs)
                .ToListAsync();

            return View(stories);
        }

        public IActionResult Category()
        {
            return View();
        }

        public IActionResult Profile()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Edit()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

