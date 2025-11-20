using Microsoft.EntityFrameworkCore;
using WriteTogether.Models.DB;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication("MyCookies")
    .AddCookie("MyCookies", options =>
    {
        options.LoginPath = "/Home/Index";
        options.AccessDeniedPath = "/Home/Index";
    });

builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<WriteTogetherContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();



// ===============================
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<WriteTogetherContext>();

    if (db.Database.CanConnect())
        Console.WriteLine("La base de datos SÍ está conectada.");
    else
        Console.WriteLine("ERROR: No se pudo conectar a la base de datos.");
}
// ===============================


if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
