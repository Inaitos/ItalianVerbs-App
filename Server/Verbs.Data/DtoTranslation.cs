using System.Text.RegularExpressions;

namespace Verbs.Data;

public class DtoTranslation
{
    public string Usage { get; set; }
    public string Translation { get; set; }

    public DtoTranslation(string input)
    {
        var match = Regex.Match(input, @"\(([^()]*|\([^()]*\))*\)");

        if (match.Success)
        {
            Usage = match.Value.Trim('(', ')');
            Translation = input.Substring(match.Index + match.Length).Trim();
        }
        else
        {
            Usage = string.Empty;
            Translation = input;
        }
    }
}