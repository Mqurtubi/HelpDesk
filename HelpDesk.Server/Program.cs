using HelpDesk.Server.Data;
using HelpDesk.Server.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
var builder = WebApplication.CreateBuilder(args);
var jwtSection = builder.Configuration.GetSection("jwt");
var jwtKey = jwtSection["Key"];
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!))
        };
    });
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.Migrate();

    if (!db.Roles.Any())
    {
        db.Roles.AddRange(
            new Role { Name = "Admin" },
            new Role { Name = "Agent" },
            new Role { Name = "Employee" }
        );
        db.SaveChanges();
    }

    if (!db.Departements.Any())
    {
        db.Departements.AddRange(
            new Departement { Name = "IT Support" },
            new Departement { Name = "Finance" },
            new Departement { Name = "HR" }
        );
        db.SaveChanges();
    }

    var adminRole = db.Roles.FirstOrDefault(x => x.Name == "Admin");
    var agentRole = db.Roles.FirstOrDefault(x => x.Name == "Agent");
    var employeeRole = db.Roles.FirstOrDefault(x => x.Name == "Employee");

    var itDepartment = db.Departements.FirstOrDefault(x => x.Name == "IT Support");
    var financeDepartment = db.Departements.FirstOrDefault(x => x.Name == "Finance");
    var hrDepartment = db.Departements.FirstOrDefault(x => x.Name == "HR");

    if (adminRole != null && itDepartment != null &&
        !db.AppUsers.Any(x => x.Email == "admin@helpdesk.local"))
    {
        db.AppUsers.Add(new AppUser
        {
            FullName = "Admin HelpDesk",
            Email = "admin@helpdesk.local",
            Password = "123456",
            DepartementId = itDepartment.Id,
            RoleId = adminRole.Id
        });
    }

    if (agentRole != null && itDepartment != null &&
        !db.AppUsers.Any(x => x.Email == "agent@helpdesk.local"))
    {
        db.AppUsers.Add(new AppUser
        {
            FullName = "Support Agent",
            Email = "agent@helpdesk.local",
            Password = "123456",
            DepartementId = itDepartment.Id,
            RoleId = agentRole.Id
        });
    }

    if (employeeRole != null && financeDepartment != null &&
        !db.AppUsers.Any(x => x.Email == "finance@helpdesk.local"))
    {
        db.AppUsers.Add(new AppUser
        {
            FullName = "Finance User",
            Email = "finance@helpdesk.local",
            Password = "123456",
            DepartementId = financeDepartment.Id,
            RoleId = employeeRole.Id
        });
    }

    if (employeeRole != null && hrDepartment != null &&
        !db.AppUsers.Any(x => x.Email == "hr@helpdesk.local"))
    {
        db.AppUsers.Add(new AppUser
        {
            FullName = "HR User",
            Email = "hr@helpdesk.local",
            Password = "123456",
            DepartementId = hrDepartment.Id,
            RoleId = employeeRole.Id
        });
    }

    db.SaveChanges();
}

app.Run();


