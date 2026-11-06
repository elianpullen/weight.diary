using backend.Data;
using backend.Models;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/excel")]
public class ExcelController(AppDbContext context) : ControllerBase
{
    // POST: /api/excel/readexcelformdata
    [HttpPost("readexcelformdata")]
    public async Task<IActionResult> ReadExcelFrom_FormData(IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file == null || file.Length == 0) return BadRequest("File is empty.");

        var data = new List<Dictionary<string, string>>();

        using (var stream = new MemoryStream())
        {
            await file.CopyToAsync(stream, cancellationToken);
            stream.Position = 0; // Reset the stream position to the beginning

            using (var workbook = new XLWorkbook(stream))
            {
                var worksheet = workbook.Worksheets.First();
                var rows = worksheet.RangeUsed().RowsUsed();

                var headerRow = rows.First(); // Assumes the first row is the header row
                var headers = headerRow.Cells().Select(c => c.Value.ToString()).ToList();

                foreach (var row in rows.Skip(1))
                {
                    var rowData = new Dictionary<string, string>();

                    foreach (var cell in row.Cells())
                    {
                        var header = headers[cell.Address.ColumnNumber - 1];
                        rowData[header] = cell.Value.ToString();
                    }

                    data.Add(rowData);

                    var bodyWeight = new BodyWeight
                    {
                        Date = DateTime.Parse(rowData["date"]),
                        Weight = decimal.Parse(rowData["weight"])
                    };


                    context.BodyWeights.Add(bodyWeight);
                }

                await context.SaveChangesAsync(cancellationToken);
            }
        }

        return Ok(data);
    }

    // GET: /api/excel/exportbodyweights
    [HttpGet("exportbodyweights")]
    public async Task<IActionResult> ExportBodyWeights(
        CancellationToken cancellationToken)
    {
        var bodyWeights = await context.BodyWeights
            .AsNoTracking()
            .OrderBy(b => b.Date)
            .ToListAsync(cancellationToken);

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("BodyWeights");

        // Headers
        worksheet.Cell(1, 1).Value = "id";
        worksheet.Cell(1, 2).Value = "date";
        worksheet.Cell(1, 3).Value = "weight";

        // Data
        for (var i = 0; i < bodyWeights.Count; i++)
        {
            var row = i + 2;

            worksheet.Cell(row, 1).Value = bodyWeights[i].Id;

            worksheet.Cell(row, 2).Value = bodyWeights[i].Date;
            worksheet.Cell(row, 2).Style.DateFormat.Format = "dd-MM-yyyy";

            worksheet.Cell(row, 3).Value = bodyWeights[i].Weight;
        }

        // Styling
        worksheet.Row(1).Style.Font.Bold = true;
        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);

        return File(
            stream.ToArray(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"BodyWeights_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx"
        );
    }
}