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

namespace WriteTogether.Controllers
{
    public class UsersController : Controller
    {
        private readonly WriteTogetherContext _context;

        public UsersController(WriteTogetherContext context)
        {
            _context = context;
        }

        // POST: Create an User and send him to the DB, it recieves 5 parameters
        [HttpPost]
        public async Task<IActionResult> Create([Bind("IdUs,NameUs,EmailUs,PasswordUs,DateUs")] [FromBody] User user)
        {
            if (ModelState.IsValid)
            {
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
    }
}
