using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
public class ErrorController : ControllerBase
{
    [Route("/error")]
    public IActionResult Error()
    {
        var exception = HttpContext.Features
            .Get<IExceptionHandlerFeature>()?
            .Error;

        if (exception?.Message.Contains("Unknown database") == true)
        {
            return StatusCode(500, new
            {
                error = "DATABASE_NOT_FOUND"
            });
        }

        return StatusCode(500, new
        {
            error = exception?.Message
        });
    }
}