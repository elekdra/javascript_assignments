using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Assignment_3
{
 public class Startup
 {
  // This method gets called by the runtime. Use this method to add services to the container.
  // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
  public void ConfigureServices(IServiceCollection services)
  {
   services.AddControllers();

   services.AddCors(options =>
   {
    options.AddPolicy(name: "AllOrigins",
                  builder =>
                  {
                   builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                  });
   });

   services.AddRouting(options => { });
  }


  // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
  public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
  {
   if (env.IsDevelopment())
   {
    app.UseDeveloperExceptionPage();
   }
   app.UseCors("AllOrigins");
   app.UseDefaultFiles();

   app.UseStaticFiles();

   app.UseRouting();

   app.UseEndpoints(endpoints =>
   {
    // Map endpoints to relevant controllers. Routes are defined in controllers
    // using Route attribute.
    endpoints.MapControllers();

    // Map a lamda as an endpoint.
    endpoints.MapGet("/version", async context =>
    {
     await context.Response.WriteAsync("1.0.0");
    });
   });
  }
 }
}
