using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using WriteTogether.Models.DB;
using Microsoft.AspNetCore.Authorization;
using WriteTogether.Models;

namespace WriteTogether.Controllers
{
    public class UsersController : Controller
    {
        private readonly WriteTogetherContext _context;

        public UsersController(WriteTogetherContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Create([Bind("IdUs,NameUs,EmailUs,PasswordUs,DateUs")][FromBody] User user)
        {
            if (ModelState.IsValid)
            {
                // Verificar si ya existe un usuario con el mismo correo
                var exists = await _context.Users.AnyAsync(u => u.EmailUs == user.EmailUs);
                if (exists)
                {
                    return BadRequest(new { success = false, message = "El correo ya está registrado." });
                }

                _context.Add(user);
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Usuario creado exitosamente." });
            }

            return BadRequest(ModelState);
        }



        // POST: Log an User using the cookies from asp.net
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            if (ModelState.IsValid)
            {
                var result = _context.Users.FirstOrDefault(u => u.NameUs.Equals(user.NameUs) && u.PasswordUs!.Equals(user.PasswordUs));

                if (result != null)
                {
                    var claims = new List<Claim>
                {
                new Claim(ClaimTypes.Name, result.NameUs),
                new Claim(ClaimTypes.NameIdentifier, result.IdUs.ToString()),
                };
                    var claimsIdentity = new ClaimsIdentity(claims, "MyCookies");
                    await HttpContext.SignInAsync("MyCookies", new ClaimsPrincipal(claimsIdentity));
                    return Ok(new { success = true, message = "Usuario logueado exitosamente." });
                }
                else
                {
                    return Unauthorized(new { success = false, message = "Email o contraseña incorrectos." });
                }
            }
            return RedirectToAction("Index", "Home");
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync("MyCookies");
            return RedirectToAction("Index", "Home");
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> getUserInfo()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var intUserId = int.Parse(userId);
            var userName = await _context.Users.Where(u => u.IdUs == intUserId)
                                                .Select(u => u.NameUs)
                                                .ToListAsync();
            return Ok(userName);
        }


        [Authorize]
        [HttpGet]
        public async Task<IActionResult> getFragments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var intUserId = int.Parse(userId);
            var fragments = await _context.Fragments.Include(f => f.StoryFrNavigation)
                                                .Where(f => f.AutorFr == intUserId)
                                                .Select(f => new FragmentsAndStory
                                                {
                                                    content_Fr = f.ContentFr,
                                                    IdSt = f.StoryFrNavigation.IdSt,
                                                    TitleSt = f.StoryFrNavigation.TitleSt,
                                                    dateFr = f.DateUs
                                                }).ToListAsync();
            return Ok(fragments);
        }
    }
}
