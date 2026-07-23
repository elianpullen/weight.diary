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

        var message = exception?.ToString();

        if (message?.Contains("Duplicate entry") == true)
        {
            return StatusCode(409, new
            {
                error = "BODYWEIGHT_ALREADY_EXISTS"
            });
        }

        if (message?.Contains("Unknown database") == true)
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